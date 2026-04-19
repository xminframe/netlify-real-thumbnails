# Netlify Real OG Thumbnails

A Tampermonkey userscript that replaces Netlify's default blank thumbnails with the **real Open Graph images** from each project's live URL.

Instead of seeing the generic Netlify placeholder, you'll see your actual `og:image` (or `twitter:image`) for every site.

### Features
- Automatically detects project names from Netlify's dashboard
- Fetches and displays the real OG image for each site
- Caches results for fast reloading
- Lightweight and polite to Netlify

### Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension
2. Click [this link](https://raw.githubusercontent.com/xminframe/netlify-real-thumbnails/main/netlify-og-thumbnails.user.js) to install the script directly
3. Go to https://app.netlify.com/teams/.../projects
4. Allow the XHR permissions when prompted (only once per domain)

### Auto-Update
The script includes `@updateURL`, so Tampermonkey will automatically notify you when a new version is available.

### How it works
The script reads the `<meta property="og:image">` tag from each live site (`https://your-project.netlify.app/`) and replaces the default Netlify thumbnail.

### License
This is a free, open-source userscript. Feel free to fork and modify it.

---

Made with ❤️ using Grok
