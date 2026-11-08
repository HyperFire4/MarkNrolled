# MarkNrolled PWA package

This package contains your existing MarkNrolled website with the minimum changes needed to make it installable as a Progressive Web App (PWA).

## Files
- `index.html` — your original app, with PWA metadata and service-worker registration added.
- `manifest.json` — app name, launch path, display mode and icons.
- `sw.js` — service worker with network-first page loading and an offline page fallback.
- `icon-192.png`, `icon-512.png` — PWA icons.
- `apple-touch-icon.png` — iPhone/iPad Home Screen icon.

## Upload to GitHub Pages
1. Extract this ZIP.
2. Open the same GitHub repository and folder where your current `index.html` lives.
3. Upload/replace `index.html` and add the other five files in that same folder.
4. Commit the changes.
5. Wait for GitHub Pages to finish deploying, then open the HTTPS Pages URL.
6. On Android, open the URL in Chrome and choose **Install app** / **Add to Home screen**.
7. On iPhone, open the URL in Safari, tap **Share**, then **Add to Home Screen**.

Keep all six files together in the same folder as `index.html`. The relative paths are intentional so this also works when your GitHub Pages site uses a repository subpath.

## Notes about this app
- Your original application logic and localStorage data handling have not been redesigned.
- Data is stored locally in the browser/app on each device. It does not automatically sync between devices. Use the app's Export JSON feature for backups.
- The current SAP password field is not validated by the existing code; this package does not add secure authentication.
- Tailwind CSS, Google Fonts and Lucide icons are loaded from external CDNs, so styling/icons may not fully load offline even though the app shell is cached.
- When you change the app, commit the changed files to GitHub as usual. The page uses network-first loading, so it will fetch the latest published HTML whenever online. If you change the precached asset list, also update the cache version at the top of `sw.js`.
