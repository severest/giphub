if (chrome.tabs) {
    const arrowURLs = ['^https://github\\.com'];
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return;
        chrome.scripting.executeScript({
            target: {
                tabId,
            },
            files: ['entry.bundle.js'],
        });
    });
}
