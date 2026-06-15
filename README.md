# Graphite → GitHub PR

A tiny Chrome extension that adds an **Open on GitHub** button to Graphite PR
pages, linking to the real GitHub pull request.

It maps:

```
https://app.graphite.com/github/pr/<org>/<repo>/<number>
        ↓
https://github.com/<org>/<repo>/pull/<number>
```

It works for any GitHub org and repo viewed through Graphite — nothing is
hardcoded.

The button is a small **GitHub** pill placed inline right after the
`<repo> #<number>` PR-number line in the page header. It opens the GitHub PR in
a new tab.

## Install (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** and select this `graphite-to-github` folder.
4. Open any Graphite PR page — the **GitHub** link appears next to the PR number.

To update after editing files, click the refresh icon on the extension card.
