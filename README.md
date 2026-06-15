# Graphite → GitHub PR

A tiny Chrome extension that adds an **Open on GitHub** button to Graphite PR
pages, linking to the real GitHub pull request.

It maps:

```
https://app.graphite.com/github/pr/ReevoAI/frontend-monorepo/13331
        ↓
https://github.com/ReevoAI/frontend-monorepo/pull/13331
```

The button is a small **GitHub** pill placed inline right after the
`frontend-monorepo #13331` PR-number line in the page header. It opens the
GitHub PR in a new tab. If Graphite changes its markup and that anchor can't be
found, the button falls back to a floating button in the bottom-right corner.

## Install (unpacked)

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right).
3. Click **Load unpacked** and select this `graphite-to-github` folder.
4. Open any Graphite PR page — the button appears in the bottom-right.

To update after editing files, click the refresh icon on the extension card.
