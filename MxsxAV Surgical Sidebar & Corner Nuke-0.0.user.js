// ==UserScript==
// @name         MissAV Surgical Sidebar & Corner Nuke
// @match        https://mxsxav.ai/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject CSS to hide the ad containers specifically
    const style = document.createElement('style');
    style.innerHTML = `
        /* Target the specific sidebar ad wrappers you shared */
        .space-y-6.mb-6 > .hidden.lg\\:block,
        iframe[src*="mavrtracktor.com"],
        iframe[src*="snaptrckr.fun"],
        /* Target the corner ad root from previous step */
        div[class*="root--"][class*="bottomRight--"],
        .close-button--a-8tK {
            display: none !important;
            height: 0px !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    const surgicalNuke = () => {
        // 2. Remove the specific sidebar ad iframes
        // We look for iframes that have known ad trackers in their src or data-link
        const trackers = ['mavrtracktor', 'snaptrckr', 'exoclick', 'myavlive'];

        document.querySelectorAll('iframe').forEach(frame => {
            const source = frame.src + (frame.dataset.link || "");
            if (trackers.some(t => source.includes(t))) {
                // Find the "mx-auto" wrapper or the specific hidden lg:block wrapper
                const wrapper = frame.closest('.hidden.lg\\:block') || frame.parentElement;
                wrapper.remove();
            }
        });

        // 3. Keep the Corner Ad dead (using the button text hook)
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('Close ad')) {
                const adRoot = btn.closest('div[class*="root--"]');
                if (adRoot) adRoot.remove();
            }
        });
    };

    // 4. Observer and interval for late-loading ads
    const observer = new MutationObserver(surgicalNuke);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.open = function() { return null; };
    setInterval(surgicalNuke, 1000);
})();