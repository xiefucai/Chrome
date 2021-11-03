import Session from '@/lib/session'
import { getCurrentTab } from '@/lib/chrome'
import initFeed from './feed'
const session = new Session()
const actions: { [key: string]: (data: any, callback: any) => any } = {
  setRssLinks: (request: any) => {
    request.links &&
      request.links.forEach((link: any) => {
        const origin = getUrlOrigin(link.href)
        if (origin) {
          session.set(origin, request)
        }
      })
    session.set(origin, request)
    chrome.browserAction.setBadgeText({ text: request.links.length.toString() })
  },
  getRssByUrl: (req: { url: string }, cb: (data: any) => {}) => {
    const origin = getUrlOrigin(req.url)
    if (origin) {
      const data = session.get(origin)
      console.log('getRssByUrl', req.url, origin, data)
      if (data) {
        cb(data)
        return
      }
    }
    cb(null)
  }
}

const getUrlOrigin = (url?: string) => {
  if (url) {
    const a = document.createElement('a')
    a.href = url
    return a.origin
  }
  return null
}
const changeBadge = async () => {
  const tab = await getCurrentTab()
  if (tab) {
    const origin = getUrlOrigin(tab.url)

    if (origin) {
      const data = session.get(origin)
      if (data) {
        if (tab.url && tab.url.indexOf('chrome-extension://') < 0) {
          chrome.browserAction.setBadgeText({
            text: data.links.length.toString()
          })
        }
        return
      }
    }
    if (
      origin &&
      (origin.indexOf('chrome://') === 0 ||
        origin.indexOf('chrome-extension://') === 0)
    ) {
      return
    }
  }

  chrome.browserAction.setBadgeText({ text: '' })
}
chrome.tabs.onUpdated.addListener(() => {
  changeBadge()
})
chrome.tabs.onActivated.addListener(() => {
  changeBadge()
})

chrome.runtime.onMessage.addListener(function (
  request: any,
  sender: any,
  sendResponse: any
) {
  const origin = sender.origin
  const action = request.action

  if (action && actions[action]) {
    delete request.action
    if (sender.tab.favIconUrl && request.icons) {
      request.icons.unshift({
        name: 'favicon',
        href: sender.tab.favIconUrl
      })
    }
    console.log('background onMessage', request, action, origin)
    actions[action](request, sendResponse)
  }
})

initFeed().catch(err => {
  console.error(err)
})
export default {}
