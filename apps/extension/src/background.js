const TOOL_BASE = 'https://www.zenovee.in/tools'

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'zenovee-open-tools',
      title: 'Open Zenovee Tools',
      contexts: ['action'],
    })

    chrome.contextMenus.create({
      id: 'zenovee-process-selection',
      title: 'Open selection in Zenovee Tools',
      contexts: ['selection'],
    })
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'zenovee-open-tools') {
    chrome.tabs.create({ url: TOOL_BASE })
    return
  }

  if (info.menuItemId === 'zenovee-process-selection') {
    const query = encodeURIComponent((info.selectionText || '').slice(0, 200))
    chrome.tabs.create({ url: query ? `${TOOL_BASE}?q=${query}` : TOOL_BASE })
    return
  }

  if (info.menuItemId === 'zenovee-open-current-page') {
    const currentUrl = tab?.url ? encodeURIComponent(tab.url) : ''
    chrome.tabs.create({ url: currentUrl ? `${TOOL_BASE}?source=${currentUrl}` : TOOL_BASE })
  }
})

chrome.action.onClicked?.addListener(() => {
  chrome.tabs.create({ url: TOOL_BASE })
})
