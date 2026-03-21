// ==UserScript==
// @name         YouTube Ghost Skip (v2.2 - Success Alert)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Skips ads and alerts ONLY after the ad is successfully cleared.
// @author       Gemini
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let adWasPresent = false;
    let lastAlertTime = 0;
    const alertCooldown = 5000; // 5 seconds between alerts

    const checkStatus = () => {
        const video = document.querySelector('video');
        const adElement = document.querySelector('.ad-showing, .ytp-ad-player-overlay');
        const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');

        // PHASE 1: Detection
        // If we see an ad or a skip button, we mark that an ad is currently "In Progress"
        if (adElement || skipButton) {
            adWasPresent = true;

            // Perform the skip/speed-up logic
            if (video) {
                video.playbackRate = 16;
                video.muted = true;
                if (isFinite(video.duration) && video.currentTime < video.duration - 0.5) {
                    video.currentTime = video.duration - 0.1;
                }
            }
            if (skipButton) skipButton.click();
            return; // Exit here; we don't alert yet because the ad is still there
        }

        // PHASE 2: The "Success" Alert
        // If the ad is gone (adElement is null) but it WAS there a moment ago...
        if (adWasPresent && !adElement) {
            const now = Date.now();

            // Only alert if we aren't spamming (cooldown) and the video is actually playing
            if (now - lastAlertTime > alertCooldown) {

                // Reset video to normal speed now that ad is gone
                if (video) {
                    video.playbackRate = 1;
                    video.muted = false;
                }

                //alert("✅ Ad Successfully Skipped! Content Resumed.");

                lastAlertTime = now;
                adWasPresent = false; // Reset the flag until the next ad appears
            }
        }
    };

    // Scan frequently to catch the exact moment the ad ends
    setInterval(checkStatus, 500);

    // Reset flag on new video load
    window.addEventListener('yt-navigate-finish', () => {
        adWasPresent = false;
    });
})();