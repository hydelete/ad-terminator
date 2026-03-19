// ==UserScript==
// @name         Manga18 Ad-Nuke (Ultimate)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Full sweep: Video ads, iframes, and ExoClick native widgets
// @author       Gemini
// @match        *://mxnxax8.club/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Expanded Blacklist for Script & Image Servers
    const adBlacklist = [
        'magsrv.com',
        'afcdn.net',
        'shortterm-result.com',
        'aucdn.net',
        'sexselector.com',
        'exosrv.com',
        'adsterra',
        'popads'
    ];

    const nukeAds = () => {
        // Target: Native Widgets (like the one you pasted)
        // These almost always use the 'exo-native-widget' class or are inside an <ins> tag
        const nativeAds = document.querySelectorAll('.exo-native-widget, ins.eas6a97888e2, [data-zoneid]');
        nativeAds.forEach(el => {
            console.log("Nuked Native Ad Widget.");
            el.closest('div[style*="display: table"]')?.remove() || el.remove();
        });

        // Target: Iframes
        document.querySelectorAll('iframe').forEach(frame => {
            if (adBlacklist.some(domain => frame.src.includes(domain))) {
                frame.remove();
            }
        });

        // Target: Video Ads
        document.querySelectorAll('video').forEach(v => {
            const source = v.querySelector('source');
            if (source && adBlacklist.some(domain => source.src.includes(domain))) {
                v.closest('div[class*="main_outstream"]')?.remove() || v.remove();
            }
        });

        // Target: Clean up leftover empty "table" or "flex" containers used for ads
        document.querySelectorAll('div[style*="display: table"]').forEach(div => {
            if (div.innerHTML.includes('magsrv.com') || div.innerHTML === "") {
                div.remove();
            }
        });
    };

    // 2. Kill the "AdProvider" variable before the site script can use it
    // This breaks the link: (AdProvider = window.AdProvider || []).push...
    Object.defineProperty(window, 'AdProvider', {
        get: () => ({ push: () => console.log("Blocked AdProvider push.") }),
        set: () => {}
    });

    // 3. Block window.open
    window.open = function() { return { focus: () => {}, close: () => {} }; };

    // 4. MutationObserver for dynamic injection
    const observer = new MutationObserver(nukeAds);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial sweep
    nukeAds();

})();