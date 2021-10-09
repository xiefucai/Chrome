class Session {
  data: { [key: string]: any } = {}

  get (key: string) {
    return this.data[key]
  }

  set (key: string, value: any) {
    this.data[key] = value
  }
}

export default Session
