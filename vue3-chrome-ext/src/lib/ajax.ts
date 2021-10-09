interface Params {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
  timeout?: number
  username?: string
  password?: string
  headers?: { [key: string]: string }
}
const request = (params: Params) => {
  return new Promise((resolve, reject) => {
    const ajax = new XMLHttpRequest()
    ajax.onreadystatechange = function (q) {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          resolve(ajax)
        } else {
          reject(ajax)
        }
      }
    }

    ajax.open((params.method || 'GET').toUpperCase(), params.url, true)

    if (params.timeout) {
      ajax.timeout = params.timeout
    }

    if (params.username && params.password) {
      ajax.setRequestHeader(
        'Authorization',
        'Basic ' + btoa(params.username + ':' + params.password)
      )
    }

    ajax.setRequestHeader('If-Modified-Since', 'Sat, 01 Jan 2000 00:00:00 GMT')

    if (params.headers) {
      for (const key in params.headers) {
        ajax.setRequestHeader(key, params.headers[key])
      }
    }

    ajax.send()
  })
}

const get = async (params: Params) => {
  return await request({ method: 'GET', ...params })
}

const post = async (params: Params) => {
  return await request({ method: 'POST', ...params })
}

module.exports = { get, post }
