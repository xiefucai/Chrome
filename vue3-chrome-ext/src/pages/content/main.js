const TYPES = {
  'application/rss+xml': 'rss',
  'application/rsd+xml': 'rsd',
  'application/atom+xml': 'atom',
  'application/wlwmanifest+xml': 'wl'
}
const TYPEKEYS = Object.keys(TYPES)
const getDocumentRssLinks = () => {
  var arr = []
  ;[...document.getElementsByTagName('link')].forEach(function (link) {
    if (TYPEKEYS.indexOf(link.type) >= 0) {
      arr.push({
        href: link.href,
        title: link.title
      })
    } else {
      console.log('ignore', link.type, link.href)
    }
  })
  return Promise.resolve(arr)
}
const getDocumentIcons = () => {
  const icons = []
  ;[...document.querySelectorAll('link[rel*="icon"]')].forEach(link => {
    icons.push({
      name: link.rel,
      href: link.href
    })
  })
  return Promise.resolve(icons)
}
const actions = {
  getRssInfo: async () => {
    const links = await getDocumentRssLinks()
    const icons = await getDocumentIcons()
    if (links && links.length) {
      return { links, icons }
    }
    return {}
  }
}

const onMessage = async (request, sender, sendResponse) => {
  console.log('onMessage', request)
  const name = request.name
  if (name && actions[name]) {
    actions[name]().then(data => {
      sendResponse({ [name]: data })
    })
  } else {
    console.warn(`no actions named ${name}`)
    sendResponse({ [name]: null })
  }
}

const sendMessage = (data, callback) => {
  chrome.runtime.sendMessage(data, callback)
}

chrome.runtime.onMessage.addListener(onMessage)
document.addEventListener(
  'DOMContentLoaded',
  async () => {
    const { links, icons } = await actions.getRssInfo()
    if (links && links.length) {
      sendMessage(
        {
          action: 'setRssLinks',
          links,
          icons
        },
        rs => {
          console.log('sended rss links', rs)
        }
      )
    }
  },
  false
)
