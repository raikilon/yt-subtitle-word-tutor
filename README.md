# YouTube Subtitle word tutor

A simple browser extension that lets you click YouTube subtitle words to translate them and save vocabulary.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the extension:

```bash
npm run build
```

3. Load the `dist` folder as an unpacked extension in Chrome:

- Go to `chrome://extensions`
- Enable **Developer mode**
- Click **Load unpacked**
- Select the `dist` folder

## Usage

- Open the extension popup to choose your learning and native languages.
- Turn on subtitles in a YouTube video.
- Click any subtitle word to see a translation bubble.
- Open the **Vocabulary** tab to export CSV or reset the list.


## Demo
![alt text](demo-images/settings.png)

![alt text](demo-images/voc-list.png)