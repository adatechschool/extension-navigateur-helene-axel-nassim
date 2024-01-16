chrome.runtime.onInstalled.addListener(function() {
    // Init liste par défaut
    chrome.storage.local.set({ websiteList: ["https://www.instagram.com","https://www.facebook.com"] });
    chrome.storage.local.set({ switchFlag: true });
  });

// // Init du Switch  par défaut = ON (true)
//   chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.local.set({ switchFlag: false });
//   });
