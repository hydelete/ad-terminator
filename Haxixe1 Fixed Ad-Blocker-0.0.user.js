// ==UserScript==
// @name         Hanime1 Fixed Ad-Blocker
// @match        https://hxnxmx1.me/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const nukeHanimeAds = () => {
        // 1. Safety List: DO NOT delete these elements
        const whitelist = [
            '#playlist-scroll',
            '.related-videos',
            '#video-playlist',
            '.scroll-y'
        ];

        // 2. Target specific ad-only containers
        const adSelectors = [
            '#bottom-ads',
            'iframe[src*="ads"]',
            'iframe[src*="pop"]',
            'div[style*="z-index: 2147483647"]'
        ];

        adSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                // Check if the ad is inside a whitelisted element
                const isSafe = whitelist.some(safeSel => el.closest(safeSel));
                if (!isSafe) el.remove();
            });
        });

        // 3. Selective Iframe Killing
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(frame => {
            const src = frame.src.toLowerCase();

            // Whitelist for the actual video player
            const isPlayer = src.includes('hanime1.me/player') || src.includes('v.redd.it') || src.includes('m3u8');

            // If it's not the player and it's from a known ad domain, kill it
            if (!isPlayer && (src.includes('ads') || src.includes('exoclick') || src.includes('traffic'))) {
                frame.remove();
            }
        });

        // 4. Kill the "Mini-Ads" but leave the Episode thumbnails alone
        document.querySelectorAll('div[style*="position: fixed"]').forEach(div => {
            // Usually, ads have a very high z-index and are not part of the main layout
            const zIndex = parseInt(window.getComputedStyle(div).zIndex);
            if (zIndex > 1000 && !div.querySelector('.episode-number')) {
                div.remove();
            }
        });
    };

    // 5. Disable pop-ups
    window.open = function() { return null; };

    setInterval(nukeHanimeAds, 1000);
})();