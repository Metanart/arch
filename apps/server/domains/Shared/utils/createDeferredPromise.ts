type Deferred<GData> = {
  promise: Promise<GData>
  resolve: (value: GData) => void
  reject: (error: Error) => void
}

export function createDeferredPromise<GData>(): Deferred<GData> {
  let resolve!: (value: GData) => void
  let reject!: (error: Error) => void

  const promise = new Promise<GData>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}
