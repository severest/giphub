import { createRoot } from "react-dom/client";

import GifButton from "./components/gif-button.js";

const giphubAppId = "giphub-app";

async function init() {
	const renderButton = (evt) => {
		if (document.getElementById(giphubAppId)) {
			// app already loaded
			return;
		}

		const pullRequestReviewDialogHeader = Array.from(
			document.querySelectorAll("h1"),
		).find(
			(el) => el.textContent.trim().toLowerCase() === "finish your review",
		);
		if (!pullRequestReviewDialogHeader) {
			return;
		}

		const pullRequestReviewDialog =
			pullRequestReviewDialogHeader.closest('[role="dialog"]');
		const fieldset = pullRequestReviewDialog.querySelector("fieldset");
		const textarea = fieldset.querySelector("textarea");

		const notice = document.createElement("div");
		notice.id = giphubAppId;
		fieldset.prepend(notice);
		const root = createRoot(document.getElementById(giphubAppId));
		root.render(<GifButton textarea={textarea} />);
	};

	document.addEventListener("selectionchange", renderButton);
}

init();
