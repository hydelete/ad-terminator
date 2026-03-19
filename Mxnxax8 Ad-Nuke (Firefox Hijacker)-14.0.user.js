// ==UserScript==
// @name         Manga18 Ad-Nuke (Firefox Hijacker)
// @namespace    http://tampermonkey.net/
// @version      14.0
// @description  Intercepts the 'click' event at the root to prevent the double-window trigger.
// @author       Gemini
// @match        *://mxnxax8.club/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. THE KILL-SWITCH
    // We catch the click before the website's ad-scripts even know you touched the mouse.
    window.addEventListener('click', function(e) {
        const target = e.target.closest('a');

        // If you clicked a link that stays on Manga18
        if (target && target.href && target.href.includes('manga18.club')) {
            console.log("Safe link detected. Hijacking navigation...");

            // STOP the website from running its own 'click' logic (the ad trigger)
            e.preventDefault();
            e.stopImmediatePropagation();

            // Manually go to the URL in the current tab
            window.location.assign(target.href);
            return false;
        }

        // If you clicked an invisible ad-div, just delete it and stop the click
        if (window.getComputedStyle(e.target).position === 'fixed') {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.target.remove();
        }
    }, true); // The 'true' here is CRITICAL: it catches the click in the "Capture" phase.

    // 2. PROTECT THE URL BAR
    // This stops scripts from changing your current tab's URL to an ad.
    const originalReplace = window.location.replace;
    window.location.replace = function(url) {
        if (url.includes('manga18.club') || url.startsWith('/') || url.startsWith('#')) {
            return originalReplace.apply(this, arguments);
        }
        console.warn("Blocked location.replace to ad: " + url);
    };

    // 3. BLIND THE AD-SCRIPTS
    // We tell the browser that 'window.open' does absolutely nothing.
    window.open = function() {
        console.log("Blocked window.open attempt.");
        return { focus: () => {}, close: () => {}, closed: true };
    };

    // 4. CSS CLEANUP
    const style = document.createElement('style');
    style.innerHTML = `
        iframe, ins, .exo-native-widget, [data-zoneid],
        div[style*="z-index: 99999"],
        div[style*="z-index: 2147483647"] {
            display: none !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }
    `;
    document.documentElement.appendChild(style);

    // 5. AUTO-IMAGE RECOVERY
    // If the images are missing, this forces them to fetch their 'data-src'
    setInterval(() => {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }, 1500);

})();