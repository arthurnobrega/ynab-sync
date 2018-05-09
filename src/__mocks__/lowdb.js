class LowdbMock {
  defaults() { return this }
  get() { return this }
  set() { return this }
  unset() { return this }
  push() { return this }
  read() { return this }
  write() { return this }
  find() { return this }
  sortBy() { return this }
  take() { return this }
  map() { return this }
  size() { return this }
  assign() { return this }
  cloneDeep() { return this }
  value() { return undefined }
}

export default function lowdb() {
  return new LowdbMock()
}
