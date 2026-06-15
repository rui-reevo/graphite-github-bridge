// Maps a Graphite PR URL to the corresponding GitHub PR URL.
// Graphite: https://app.graphite.com/github/pr/{org}/{repo}/{number}[/...]
// GitHub:   https://github.com/{org}/{repo}/pull/{number}
function graphiteToGithub(href) {
  const match = href.match(
    /^https:\/\/app\.graphite\.com\/github\/pr\/([^/]+)\/([^/]+)\/(\d+)/
  );
  if (!match) return null;
  const [, org, repo, number] = match;
  return `https://github.com/${org}/${repo}/pull/${number}`;
}

const BUTTON_ID = "graphite-to-github-button";

const GITHUB_MARK =
  '<svg class="g2gh-mark" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">' +
  '<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>' +
  "</svg>";

// External-link arrow — signals the link opens off-site (a new GitHub tab).
const EXTERNAL_ARROW =
  '<svg class="g2gh-arrow" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">' +
  '<path fill="currentColor" d="M5.5 3.5a.75.75 0 000 1.5h4.44L3.22 11.72a.75.75 0 101.06 1.06L11 6.06v4.44a.75.75 0 001.5 0v-6a.75.75 0 00-.75-.75h-6z"/>' +
  "</svg>";

// The PR-number row ("frontend-monorepo #13331"). Class hashes change across
// Graphite builds, so match by the stable prefix.
function findAnchor() {
  return document.querySelector('[class*="MetadataSection_prNumberGroup"]');
}

function buildButton(githubUrl, inline) {
  const button = document.createElement("a");
  button.id = BUTTON_ID;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.title = "Open this PR on GitHub";
  button.href = githubUrl;
  button.className = inline ? "g2gh-inline" : "g2gh-floating";
  const label = inline ? "GitHub" : "Open on GitHub";
  button.innerHTML = GITHUB_MARK + "<span>" + label + "</span>" + EXTERNAL_ARROW;
  return button;
}

function syncButton() {
  const githubUrl = graphiteToGithub(location.href);
  let button = document.getElementById(BUTTON_ID);

  // Not on a PR page — remove the button if it exists.
  if (!githubUrl) {
    if (button) button.remove();
    return;
  }

  const anchor = findAnchor();
  // Re-create if missing, or if it's in the wrong place (e.g. anchor appeared
  // after we'd fallen back to the floating button).
  const wantInline = !!anchor;
  const haveInline = button && button.classList.contains("g2gh-inline");
  if (button && wantInline !== haveInline) {
    button.remove();
    button = null;
  }

  if (!button) {
    button = buildButton(githubUrl, wantInline);
    if (wantInline) anchor.appendChild(button);
    else document.body.appendChild(button);
  } else if (button.href !== githubUrl) {
    button.href = githubUrl;
  }
}

// Graphite is a single-page app, so content (and the URL) changes without a
// full reload. Watch for both and keep the button in sync.
function watchChanges() {
  let lastHref = location.href;
  const check = () => {
    if (location.href !== lastHref) lastHref = location.href;
    syncButton();
  };

  // Catch SPA navigations via the History API.
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function (...args) {
      const result = original.apply(this, args);
      check();
      return result;
    };
  }
  window.addEventListener("popstate", check);

  // The anchor row renders asynchronously, so re-check as the DOM mutates.
  const observer = new MutationObserver(() => {
    if (!document.getElementById(BUTTON_ID)) syncButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Final fallback poll.
  setInterval(check, 1000);
}

syncButton();
watchChanges();
