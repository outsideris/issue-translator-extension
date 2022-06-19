chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0].url) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'rerun', url: tabs[0].url});
    }
  });
});
