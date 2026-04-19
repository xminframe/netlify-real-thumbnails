// ==UserScript==
// @name         Netlify → Real OG Image Thumbnails
// @namespace    https://github.com/
// @version      1.5
// @description  Replaces Netlify default thumbnails with real Open Graph images
// @author       Grok
// @match        https://app.netlify.com/*
// @connect      netlify.app
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(() => {
    'use strict';

    const cache = new Map(); // liveUrl → ogImageUrl | null (null = failed)

    GM_addStyle(`
        img[data-og-replaced] { object-fit: cover !important; border-radius: 8px; }
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
                        cache.set(liveUrl, null);   // cache failure
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

    function getProjectNameFromCard(card) {
        const projectLink = card.querySelector('a[href^="/projects/"]');
        if (projectLink) {
            const match = projectLink.getAttribute('href').match(/\/projects\/([^/]+)/);
            if (match && match[1]) return match[1];
        }
        return null;
    }

    function processThumbnails() {
        const thumbnails = document.querySelectorAll('img.tw-aspect-screenshot, img[src*=".webp"]');

        thumbnails.forEach(async (img) => {
            if (img.dataset.ogReplaced) return;

            const card = img.closest('li.clickable') || img.closest('.media');
            if (!card) return;

            const projectName = getProjectNameFromCard(card);
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
        // Polling kept but at a gentler interval
        setInterval(processThumbnails, 3000);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('load', start);
    } else {
        start();
    }
})();
