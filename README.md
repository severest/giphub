# Giphub [![Build Status](https://sean.semaphoreci.com/badges/giphub/branches/master.svg?style=shields)](https://sean.semaphoreci.com/projects/giphub)
Giphub let's you insert Giphy GIFs from within GitHub.

- Firefox <https://addons.mozilla.org/en-US/firefox/addon/giphubv1/>
- Chrome <https://chrome.google.com/webstore/detail/giphub/kkdonncilmofnmoohllejgcjooeiodhe>

## Setup

This project uses yarn. If you haven't already, install yarn globally:

```
npm install -g yarn
```

Install required packages

```
yarn install --pure-lockfile
```

## Build

Build un-minified version of the extension

```
yarn run dev
```

Build production version the extension

```
yarn run build
```

The unpacked extension is available in the `dist` folder in both cases.
