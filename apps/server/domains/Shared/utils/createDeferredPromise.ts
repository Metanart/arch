type Deferred<TData> = {
  promise: Promise<TData>
  resolve: (value: TData) => void
  reject: (error: Error) => void
}

export function createDeferredPromise<TData>(): Deferred<TData> {
  let resolve!: (value: TData) => void
  let reject!: (error: Error) => void

  const promise = new Promise<TData>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}
