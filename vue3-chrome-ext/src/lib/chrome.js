const getTab = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      tabs => {
        resolve(tabs && tabs[0])
      }
    )
  })
}
const getCurrentTab = async () => {
  return await getTab({
    active: true,
    currentWindow: true
  })
}
const openUrl = async (title, url) => {
  const tab = await getTab({ title })
  if (tab) {
    console.log('openUrl update', title, url)

    chrome.tabs.update(tab.id || tab.windowId, {
      active: true,
      // focused: true,
      url
    })
    try {
      window.close()
    } catch (j) {
      console.log('Failed to close popup window')
    }
  } else {
    console.log('openUrl create', title, url)

    chrome.tabs.create(
      {
        // active: true,
        url: chrome.runtime.getURL(url)
      },
      function (ac) {
        try {
          window.close()
        } catch (j) {
          console.log('Failed to close popup window')
        }
      }
    )
  }
}

const popUrl = (url, view) => {
  const rect = {
    width: 500,
    height: 500,
    top: 0,
    left: 0,
    ...view
  }
  chrome.windows.create({
    url: chrome.runtime.getURL(url),
    type: 'popup',
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left
  })
}

const sendRequest = async (name, callback) => {
  const tab = await getCurrentTab()
  if (tab) {
    chrome.tabs.sendMessage(tab.id, { name }, response => {
      callback(response && response[name])
    })
  }
}

// chrome.extension.getBackgroundPage() 获取background的window对象
export { getTab, getCurrentTab, openUrl, popUrl, sendRequest }
