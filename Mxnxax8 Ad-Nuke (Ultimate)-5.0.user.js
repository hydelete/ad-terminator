// ==UserScript==
// @name         Manga18 Ad-Nuke & Ghost-Box Crusher (v5.0)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Full sweep: Video ads, iframes, and the "White Box" ghost-float crusher.
// @author       Gemini
// @match        *://mxnxax8.club/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. FAST CSS SHIELD (Stops the "White Box" before it renders)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Targets the specific floating signature you found */
        div[style*="bottom: 10px"],
        div[style*="bottom:10px"],
        div[style*="z-index: 2147483647"],
        iframe[title="offer"],
        iframe.XTW5FHL0HWb5OUsYRvNu {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0px !important;
            height: 0px !important;
            position: fixed !important;
            left: -9999px !important; /* The 'Teleport' fix */
            pointer-events: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    const adBlacklist = [
        'magsrv.com', 'afcdn.net', 'shortterm-result.com',
        'aucdn.net', 'sexselector.com', 'exosrv.com',
        'adsterra', 'popads'
    ];

    const nukeAds = () => {
        // --- NATIVE WIDGETS & FLOATERS ---
        const floatingAds = document.querySelectorAll('.exo-native-widget, ins.eas6a97888e2, [data-zoneid], div[style*="bottom: 10px"]');
        floatingAds.forEach(el => {
            const container = el.closest('div[style*="display: table"]') || el;
            console.log("🚀 v5.0: Nuked/Crushed floating container.");
            container.remove();

            // If it can't be removed (locked), shrink it
            if (document.contains(container)) {
                container.style.setProperty('width', '0px', 'important');
                container.style.setProperty('height', '0px', 'important');
                container.style.setProperty('left', '-9999px', 'important');
            }
        });

        // --- IFRAME BLACKLIST ---
        document.querySelectorAll('iframe').forEach(frame => {
            if (adBlacklist.some(domain => frame.src.includes(domain)) || frame.title === "offer") {
                frame.remove();
            }
        });

        // --- VIDEO ADS ---
        document.querySelectorAll('video').forEach(v => {
            const source = v.querySelector('source');
            if (source && adBlacklist.some(domain => source.src.includes(domain))) {
                v.closest('div[class*="main_outstream"]')?.remove() || v.remove();
            }
        });

        // --- CLEANUP ---
        document.querySelectorAll('div[style*="display: table"]').forEach(div => {
            if (div.innerHTML.includes('magsrv.com') || div.innerHTML.trim() === "") {
                div.remove();
            }
        });
    };

    // 2. BLOCK AdProvider & Popups
    Object.defineProperty(window, 'AdProvider', {
        get: () => ({ push: () => console.log("Blocked AdProvider push.") }),
        set: () => {}
    });

    window.open = function() {
        console.log("Blocked Pop-under attempt.");
        return { focus: () => {}, close: () => {} };
    };

    // 3. EVENT-DRIVEN OBSERVER (Modified to watch for style changes)
    const observer = new MutationObserver((mutations) => {
        nukeAds();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'] // Catches delayed "reveals"
    });

    // 4. MULTI-STAGE SWEEP (For the 1-2s delayed injection)
    nukeAds();
    window.addEventListener('load', nukeAds);
    //setTimeout(nukeAds, 1500);

})();