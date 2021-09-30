import Session from '@/lib/session'
import { getCurrentTab } from '@/lib/chrome'
const session = new Session()
console.log('background is open')

const actions = {
  setRssLinks: data => {
    chrome.browserAction.setBadgeText({ text: data.links.length.toString() })
  }
}

const getUrlOrigin = url => {
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
        chrome.browserAction.setBadgeText({
          text: data.links.length.toString()
        })
        console.log('changeBadge', tab, data)
        return
      }
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const origin = sender.origin
  const action = request.action
  if (session.get(origin)) {
  } else {
    if (action && actions[action]) {
      delete request.action
      request.icons.unshift({
        name: 'favicon',
        href: sender.tab.favIconUrl
      })
      session.set(origin, request)
      actions[action](request, sendResponse)
    }
  }
})
