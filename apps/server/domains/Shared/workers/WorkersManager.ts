import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'

type ManagerOptions = {
  poolSize: number
  workerEntryPath: string
  idleTerminateMs?: number
}

type PendingCall = {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  timeoutId?: NodeJS.Timeout
}

type WorkerSlot = {
  worker: Worker
  isBusy: boolean
  lastUsedAt: number
}

type WorkerResponse =
  | { requestId: string; ok: true; result: unknown }
  | { requestId: string; ok: false; error: { message: string; stack?: string } }

export class WorkersManager {
  private readonly options: ManagerOptions

  private slots: WorkerSlot[] = []
  private pendingByRequestId = new Map<string, PendingCall>()

  private queue: Array<{
    task: string
    payload: unknown
    timeoutMs?: number
    resolve: (value: unknown) => void
    reject: (reason: unknown) => void
  }> = []

  private isShuttingDown = false
  private idleTimer?: NodeJS.Timeout

  constructor(options: ManagerOptions) {
    if (!Number.isInteger(options.poolSize) || options.poolSize <= 0) {
      throw new Error('poolSize must be a positive integer')
    }

    this.options = {
      ...options,
      workerEntryPath: resolve(options.workerEntryPath)
    }

    this.ensurePool(options.poolSize)

    if (this.options.idleTerminateMs && this.options.idleTerminateMs > 0) {
      this.startIdleReaper(this.options.idleTerminateMs)
    }
  }

  async runTask<TResult = unknown>(
    task: string,
    payload: unknown,
    opts?: { timeoutMs?: number }
  ): Promise<TResult> {
    if (this.isShuttingDown) {
      throw new Error('WorkersManager is shutting down')
    }

    return new Promise<TResult>((resolvePromise, rejectPromise) => {
      this.queue.push({
        task,
        payload,
        timeoutMs: opts?.timeoutMs,
        resolve: resolvePromise as any,
        reject: rejectPromise
      })

      this.drainQueue()
    })
  }

  getPoolStats() {
    const total = this.slots.length
    const busy = this.slots.filter((s) => s.isBusy).length
    return { total, busy, queued: this.queue.length }
  }

  async shutdown(): Promise<void> {
    this.isShuttingDown = true

    if (this.idleTimer) clearInterval(this.idleTimer)

    // Отменяем очередь
    while (this.queue.length > 0) {
      const item = this.queue.shift()!
      item.reject(new Error('Shutdown'))
    }

    // Отменяем pending calls
    for (const [requestId, pending] of this.pendingByRequestId) {
      if (pending.timeoutId) clearTimeout(pending.timeoutId)
      pending.reject(new Error('Shutdown'))
      this.pendingByRequestId.delete(requestId)
    }

    await Promise.allSettled(this.slots.map((s) => this.terminateWorker(s.worker)))
    this.slots = []
  }

  // ---------- internals ----------

  private ensurePool(size: number) {
    for (let i = 0; i < size; i++) {
      this.slots.push(this.createSlot())
    }
  }

  private createSlot(): WorkerSlot {
    const worker = new Worker(this.options.workerEntryPath)

    worker.on('message', (msg: WorkerResponse) => this.handleWorkerMessage(worker, msg))
    worker.on('error', (err) => this.handleWorkerCrash(worker, err))
    worker.on('exit', (code) => this.handleWorkerExit(worker, code))

    return {
      worker,
      isBusy: false,
      lastUsedAt: Date.now()
    }
  }

  private handleWorkerMessage(worker: Worker, msg: WorkerResponse) {
    const pending = this.pendingByRequestId.get(msg.requestId)
    if (!pending) return

    this.pendingByRequestId.delete(msg.requestId)
    if (pending.timeoutId) clearTimeout(pending.timeoutId)

    const slot = this.findSlot(worker)
    if (slot) {
      slot.isBusy = false
      slot.lastUsedAt = Date.now()
    }

    if (msg.ok) pending.resolve(msg.result)
    else pending.reject(new Error(msg.error.message))

    this.drainQueue()
  }

  private handleWorkerCrash(worker: Worker, err: Error) {
    // если воркер упал во время задачи — нужно отклонить все pending, которые "висели" на нем.
    // Здесь мы не знаем requestId, поэтому полагаемся на exit-handler + таймауты.
    // Но можно сделать мапу requestId->worker для строгого управления (добавлю ниже как улучшение).
    // Пока — просто логика восстановления пула:
    this.replaceWorker(worker)
  }

  private handleWorkerExit(worker: Worker, code: number) {
    // Если не shutdown и воркер умер — восстанавливаем пул
    if (!this.isShuttingDown && code !== 0) {
      this.replaceWorker(worker)
    }
  }

  private replaceWorker(oldWorker: Worker) {
    const idx = this.slots.findIndex((s) => s.worker === oldWorker)
    if (idx === -1) return

    // помечаем старый слот как "мертвый"
    this.slots.splice(idx, 1)

    // создаём новый воркер на замену
    this.slots.push(this.createSlot())

    // пытаемся продолжить работу очереди
    this.drainQueue()
  }

  private drainQueue() {
    if (this.isShuttingDown) return

    while (this.queue.length > 0) {
      const freeSlot = this.slots.find((s) => !s.isBusy)
      if (!freeSlot) return

      const item = this.queue.shift()!
      const requestId = randomUUID()

      freeSlot.isBusy = true
      freeSlot.lastUsedAt = Date.now()

      const pending: PendingCall = {
        resolve: item.resolve,
        reject: item.reject
      }

      if (item.timeoutMs && item.timeoutMs > 0) {
        pending.timeoutId = setTimeout(() => {
          this.pendingByRequestId.delete(requestId)

          // освобождаем слот, иначе пул залипнет
          const slot = this.findSlot(freeSlot.worker)
          if (slot) {
            slot.isBusy = false
            slot.lastUsedAt = Date.now()
          }

          item.reject(new Error(`Task timeout after ${item.timeoutMs}ms`))
          this.drainQueue()
        }, item.timeoutMs)
      }

      this.pendingByRequestId.set(requestId, pending)

      freeSlot.worker.postMessage({
        requestId,
        task: item.task,
        payload: item.payload
      })
    }
  }

  private findSlot(worker: Worker) {
    return this.slots.find((s) => s.worker === worker)
  }

  private async terminateWorker(worker: Worker): Promise<void> {
    try {
      await worker.terminate()
    } catch {
      // ignore
    }
  }

  private startIdleReaper(idleTerminateMs: number) {
    // Раз в N/2 проверяем простаивающих
    this.idleTimer = setInterval(
      () => {
        if (this.isShuttingDown) return
        if (this.queue.length > 0) return // есть работа — не трогаем

        const now = Date.now()
        const idleSlots = this.slots.filter(
          (s) => !s.isBusy && now - s.lastUsedAt > idleTerminateMs
        )

        // оставим минимум 1 воркер
        for (const slot of idleSlots) {
          if (this.slots.length <= 1) break

          this.terminateWorker(slot.worker).finally(() => {
            const idx = this.slots.findIndex((s) => s.worker === slot.worker)
            if (idx >= 0) this.slots.splice(idx, 1)
          })
        }
      },
      Math.max(250, Math.floor(idleTerminateMs / 2))
    )
  }
}
