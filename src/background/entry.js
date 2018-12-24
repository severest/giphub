import contentScript from '../inject/entry.js';

const arrowURLs = ['^https://github\\.com'];
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return;
    browser.tabs.executeScript({
      file: contentScript
    });
});
