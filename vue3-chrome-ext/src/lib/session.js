class Session {
  data = {}

  get (key) {
    return this.data[key]
  }

  set (key, value) {
    this.data[key] = value
  }
}

export default Session
