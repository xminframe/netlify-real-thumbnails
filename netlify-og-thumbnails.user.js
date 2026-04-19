// ==UserScript==
// @name         Netlify → Real OG Image Thumbnails
// @namespace    https://github.com/xminframe/netlify-real-thumbnails
// @version      1.6
// @description  Replaces Netlify default thumbnails with real Open Graph images (supports List and Grid view)
// @author       Grok
// @match        https://app.netlify.com/*
// @connect      netlify.app
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL  https://raw.githubusercontent.com/xminframe/netlify-real-thumbnails/main/netlify-og-thumbnails.user.js
// @updateURL    https://raw.githubusercontent.com/xminframe/netlify-real-thumbnails/main/netlify-og-thumbnails.user.js
// ==/UserScript==

(() => {
    'use strict';

    const cache = new Map(); // liveUrl → ogImageUrl | null

    GM_addStyle(`
        img[data-og-replaced] { 
            object-fit: cover !important; 
            border-radius: 8px; 
        }
    `);

    async function fetchOgImage(liveUrl) {
        if (cache.has(liveUrl)) return cache.get(liveUrl);

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: liveUrl,
                timeout: 8000,
                onload: (response) => {
                    if (response.status !== 200) {
                        cache.set(liveUrl, null);
                        return resolve(null);
                    }

                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const meta = doc.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
                    const ogUrl = meta ? meta.getAttribute("content") : null;

                    if (ogUrl) {
                        const absoluteUrl = ogUrl.startsWith('http') 
                            ? ogUrl 
                            : liveUrl.replace(/\/$/, '') + (ogUrl.startsWith('/') ? ogUrl : '/' + ogUrl);
                        
                        cache.set(liveUrl, absoluteUrl);
                        resolve(absoluteUrl);
                    } else {
                        cache.set(liveUrl, null);
                        resolve(null);
                    }
                },
                onerror: () => {
                    cache.set(liveUrl, null);
                    resolve(null);
                }
            });
        });
    }

    function getProjectNameFromElement(element) {
        const projectLink = element.querySelector('a[href^="/projects/"]');
        if (projectLink) {
            const match = projectLink.getAttribute('href').match(/\/projects\/([^/]+)/);
            if (match && match[1]) return match[1];
        }

        const allLinks = element.querySelectorAll('a[href^="/projects/"]');
        for (const link of allLinks) {
            const match = link.getAttribute('href').match(/\/projects\/([^/]+)/);
            if (match && match[1]) return match[1];
        }

        return null;
    }

    function processThumbnails() {
        const thumbnails = document.querySelectorAll('img.tw-aspect-screenshot');

        thumbnails.forEach(async (img) => {
            if (img.dataset.ogReplaced) return;

            const container = img.closest('li') || 
                             img.closest('a[href^="/projects/"]') || 
                             img.closest('div');

            if (!container) return;

            const projectName = getProjectNameFromElement(container);
            if (!projectName) return;

            const liveUrl = `https://${projectName}.netlify.app/`;
            const ogImage = await fetchOgImage(liveUrl);

            if (ogImage) {
                img.src = ogImage;
                img.dataset.ogReplaced = "true";
            }
        });
    }

    const observer = new MutationObserver(processThumbnails);

    function start() {
        processThumbnails();
        const container = document.querySelector('main') || document.body;
        observer.observe(container, { childList: true, subtree: true });
        setInterval(processThumbnails, 2500);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('load', start);
    } else {
        start();
    }
})();
