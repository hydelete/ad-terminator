// ==UserScript==
// @name         Ohentai Video Ad Force-Skip
// @match        https://oxextxi.org/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const forceSkip = () => {
        const video = document.querySelector('video');
        if (!video) return;

        // 1. Check if the site's "Ad" label is visible
        // These sites often use specific classes for the ad player
        const isAdShowing = document.querySelector('.vjs-ad-playing, .ima-ad-container, .ad-interrupting');

        // 2. If it's an ad, mute it and jump to the end
        if (isAdShowing || video.duration < 61) {
            // We assume videos under 60s on a full-length site are ads
            if (isFinite(video.duration) && video.currentTime < video.duration) {
                video.muted = true;
                video.playbackRate = 16.0; // Speed it up to the max
                video.currentTime = video.duration - 0.1; // Jump to the final millisecond
            }
        }
    };

    // Run frequently to catch the moment an ad starts
    setInterval(forceSkip, 500);

    // 3. Prevent "Click-to-Open" Popups
    // This stops the video player from opening a new tab when you click 'Play'
    window.addEventListener('click', function(e) {
        if (window.open) {
            window.open = function() {
                console.log("Popup blocked.");
                return null;
            };
        }
    }, true);
})();