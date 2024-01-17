chrome.runtime.onInstalled.addListener(function() {
    // Init liste par défaut
    chrome.storage.local.set({ websiteList: ["https://www.instagram.com","https://www.facebook.com","https://www.jeuxvideo.com", "https://chat.openai.com"] });
    chrome.storage.local.set({ switchFlag: true });
  });
