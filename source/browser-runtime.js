export const browserRuntime =
	typeof browser === "undefined" ? chrome.runtime : browser.runtime;
