// ==UserScript==
// @name         Ohentai Ultra Cleaner
// @match        https://oxextxi.org/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. VOID WINDOW.OPEN: This kills pop-ups before they can start.
    window.open = function() { return { focus: function() {} }; };

    const nuke = () => {
        // 2. Specific Selectors for this site
        const badStuff = [
            '#aswift_0_wrapper', // Common Google/Adsense wrapper
            '.mgbox',            // Ad containers
            'iframe[src*="ad"]', // Any iframe with "ad" in the source
            'div[style*="z-index: 2147483647"]', // Max z-index "Invisible" layers
            '.inRek'
        ];

        badStuff.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        // 3. Remove "Overlay" divs that cover the video player
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(div => {
            const style = window.getComputedStyle(div);
            // If it's fixed/absolute and covers the whole screen, it's a trap
            if (style.position === 'fixed' && style.zIndex > 100) {
                div.remove();
            }
        });
    };

    // Run immediately and then every time the user clicks
    document.addEventListener('mousedown', nuke, true);
    setInterval(nuke, 1000);
})();