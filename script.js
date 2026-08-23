// Clear legacy permanent backdoor localStorage flags
try {
    localStorage.removeItem('cake_backdoor');
    localStorage.removeItem('card23_backdoor');
    localStorage.removeItem('letter_backdoor');
} catch(e) {}

// --- Make a Wish & Letter Section Lock & 10-Tap Backdoor ---
let cakeNavTapCount = 0;
let cakeNavTapTimer = null;

function isLetterUnlocked() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlockLetter') === 'true' || params.get('unlockCake') === 'true' || params.get('unlockAll') === 'true' || params.get('backdoor') === 'letter' || params.get('backdoor') === 'cake' || params.get('backdoor') === 'true' || params.get('backdoor') === 'all') {
        sessionStorage.setItem('letter_backdoor', 'true');
        sessionStorage.setItem('cake_backdoor', 'true');
    }
    return isCard23DateUnlocked() || sessionStorage.getItem('letter_backdoor') === 'true' || sessionStorage.getItem('cake_backdoor') === 'true';
}

function isCakeUnlocked() {
    // Check URL backdoor parameter for quick testing
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlockCake') === 'true' || params.get('unlockLetter') === 'true' || params.get('unlockAll') === 'true' || params.get('backdoor') === 'cake' || params.get('backdoor') === 'letter' || params.get('backdoor') === 'true' || params.get('backdoor') === 'all') {
        sessionStorage.setItem('cake_backdoor', 'true');
        sessionStorage.setItem('letter_backdoor', 'true');
    }
    return isCard23DateUnlocked() || sessionStorage.getItem('cake_backdoor') === 'true' || sessionStorage.getItem('letter_backdoor') === 'true';
}

function initCakeNavLock() {
    const cakeCard = document.querySelector('.nav-card[href="cake.html"], a[href="cake.html"]');
    if (cakeCard) {
        if (!isCakeUnlocked()) {
            // Keep button completely hidden before Aug 31 12:00 AM
            cakeCard.style.display = 'none';
        } else {
            // Revealed once unlocked (by date or backdoor)
            cakeCard.style.display = '';
        }
    }

    const letterSection = document.querySelector('.love-letter-section');
    if (letterSection) {
        if (!isLetterUnlocked()) {
            // Keep letter section completely hidden before Aug 31 12:00 AM
            letterSection.style.display = 'none';
        } else {
            // Revealed once unlocked (by date or backdoor)
            letterSection.style.display = '';
        }
    }

    // Attach secret 10-tap backdoor on header badge ("Bettuuu✿") and flower icon (🌸)
    const triggers = [
        document.querySelector('header .badge'),
        document.querySelector('.message-card .flower-icon')
    ];

    triggers.forEach(el => {
        if (el && !el.dataset.backdoorAttached) {
            el.dataset.backdoorAttached = 'true';
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                if (isCakeUnlocked() && isLetterUnlocked()) return;

                cakeNavTapCount++;
                clearTimeout(cakeNavTapTimer);
                cakeNavTapTimer = setTimeout(() => { cakeNavTapCount = 0; }, 3500);

                el.style.transition = 'transform 0.15s ease';
                el.style.transform = 'scale(1.2) rotate(6deg)';
                setTimeout(() => { el.style.transform = ''; }, 150);

                if (cakeNavTapCount >= 10) {
                    cakeNavTapCount = 0;
                    sessionStorage.setItem('cake_backdoor', 'true');
                    sessionStorage.setItem('letter_backdoor', 'true');

                    if (cakeCard) {
                        cakeCard.style.display = '';
                    }

                    if (letterSection) {
                        letterSection.style.display = '';
                        if (typeof initLoveLetter === 'function') {
                            initLoveLetter();
                        }
                    }

                    if (window.confetti) {
                        confetti({
                            particleCount: 80,
                            spread: 80,
                            origin: { y: 0.6 },
                            colors: ['#ffd700', '#ff6b9e', '#a78bfa', '#34d399']
                        });
                    }
                    const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                    popSound.volume = 0.5;
                    popSound.play().catch(() => {});

                    showTreasureToast("✨ Secret backdoor unlocked! 📜🎂");
                }
            });
        }
    });
}

// --- Happy Birthday Melody Synthesizer ---
function playHappyBirthdayTune() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const notes = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
            'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46
        };

        const score = [
            { note: 'C4', dur: 0.35, pause: 0.08 },
            { note: 'C4', dur: 0.25, pause: 0.05 },
            { note: 'D4', dur: 0.6, pause: 0.05 },
            { note: 'C4', dur: 0.6, pause: 0.05 },
            { note: 'F4', dur: 0.6, pause: 0.05 },
            { note: 'E4', dur: 1.1, pause: 0.2 },

            { note: 'C4', dur: 0.35, pause: 0.08 },
            { note: 'C4', dur: 0.25, pause: 0.05 },
            { note: 'D4', dur: 0.6, pause: 0.05 },
            { note: 'C4', dur: 0.6, pause: 0.05 },
            { note: 'G4', dur: 0.6, pause: 0.05 },
            { note: 'F4', dur: 1.1, pause: 0.2 },

            { note: 'C4', dur: 0.35, pause: 0.08 },
            { note: 'C4', dur: 0.25, pause: 0.05 },
            { note: 'C5', dur: 0.6, pause: 0.05 },
            { note: 'A4', dur: 0.6, pause: 0.05 },
            { note: 'F4', dur: 0.6, pause: 0.05 },
            { note: 'E4', dur: 0.6, pause: 0.05 },
            { note: 'D4', dur: 0.9, pause: 0.18 },

            { note: 'Bb4', dur: 0.35, pause: 0.08 },
            { note: 'Bb4', dur: 0.25, pause: 0.05 },
            { note: 'A4', dur: 0.6, pause: 0.05 },
            { note: 'F4', dur: 0.6, pause: 0.05 },
            { note: 'G4', dur: 0.6, pause: 0.05 },
            { note: 'F4', dur: 1.4, pause: 0.3 }
        ];

        let curTime = ctx.currentTime + 0.1;
        score.forEach(item => {
            const freq = notes[item.note];
            if (freq) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, curTime);

                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(freq * 2, curTime);

                gain.gain.setValueAtTime(0, curTime);
                gain.gain.linearRampToValueAtTime(0.18, curTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, curTime + item.dur);

                gain2.gain.setValueAtTime(0, curTime);
                gain2.gain.linearRampToValueAtTime(0.05, curTime + 0.02);
                gain2.gain.exponentialRampToValueAtTime(0.0001, curTime + item.dur * 0.7);

                osc.connect(gain);
                osc2.connect(gain2);
                gain.connect(ctx.destination);
                gain2.connect(ctx.destination);

                osc.start(curTime);
                osc.stop(curTime + item.dur + 0.1);
                osc2.start(curTime);
                osc2.stop(curTime + item.dur + 0.1);
            }
            curTime += item.dur + item.pause;
        });
    } catch (e) {
        console.log("Audio playback error:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('skipIntro') === 'true') {
        const introScreen = document.getElementById('intro-screen');
        const mainContent = document.getElementById('main-content');
        if (introScreen && mainContent) {
            introScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }
    }
});

function openEnvelope() {
    const envelope = document.querySelector('.envelope-container');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        
        // Wait for animation then fade out intro and show main content
        setTimeout(() => {
            introScreen.classList.add('fade-out');
            
            setTimeout(() => {
                introScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                window.scrollTo(0, 0);
                startFloatingHearts();
                startEmojiRain();

                // Music playback on opening envelope:
                if (isCard23DateUnlocked()) {
                    // On/After Aug 31 12:00 AM: Play Happy Birthday celebration song/tune
                    playHappyBirthdayTune();
                } else {
                    // All other times: Play "Eppadi Vandhaayo"
                    const audio = document.getElementById('bg-music');
                    const playBtn = document.getElementById('play-btn');
                    if (audio && audio.src && !audio.src.endsWith('index.html')) {
                        audio.play().then(() => {
                            if (playBtn) playBtn.textContent = '⏸';
                        }).catch((err) => {
                            console.log("Audio autoplay note:", err);
                        });
                    }
                }
            }, 800);
            
        }, 1500); // Give time to read the letter
    }
}

// --- Countdown Timer ---
function startCountdown() {
    // Aug 31, 2026 12:00 AM IST (UTC+5:30 = Aug 30 18:30 UTC)
    const targetDate = new Date('2026-08-31T00:00:00+05:30').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Birthday is here!
            document.getElementById('cd-days').textContent = '🎉';
            document.getElementById('cd-hours').textContent = '🎂';
            document.getElementById('cd-minutes').textContent = '🎈';
            document.getElementById('cd-seconds').textContent = '💖';
            document.querySelectorAll('.countdown-text').forEach(el => el.textContent = '');
            document.querySelectorAll('.countdown-separator').forEach(el => el.textContent = '');
            const label = document.querySelector('.countdown-label');
            if (label) label.textContent = "it's her special day! 🎉";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minutesEl = document.getElementById('cd-minutes');
        const secondsEl = document.getElementById('cd-seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) {
            secondsEl.textContent = String(seconds).padStart(2, '0');
            // Pulse animation on seconds
            secondsEl.style.transform = 'scale(1.1)';
            setTimeout(() => { secondsEl.style.transform = 'scale(1)'; }, 500);
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// Start countdown when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCountdown);
} else {
    startCountdown();
}

// Audio Player Logic
document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('play-btn');
    const audio = document.getElementById('bg-music');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const timeDisplay = document.getElementById('time-display');

    if (playBtn && audio) {
        // Play / Pause toggle
        playBtn.addEventListener('click', function() {
            if (audio.paused) {
                // Check if user has provided a src
                if (!audio.src || audio.src.endsWith('index.html') || audio.getAttribute('src') === '') {
                    alert("Please add your song.mp3 file to the 'src' attribute of the <audio> tag in index.html first!");
                    return;
                }
                
                audio.play();
                this.textContent = '⏸';
            } else {
                audio.pause();
                this.textContent = '▶';
            }
        });

        // Update progress bar as song plays
        audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            // Format time
            const currentMinutes = Math.floor(audio.currentTime / 60);
            let currentSeconds = Math.floor(audio.currentTime % 60);
            if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;

            let durationMinutes = Math.floor(audio.duration / 60) || 0;
            let durationSeconds = Math.floor(audio.duration % 60) || 0;
            if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;

            timeDisplay.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
        });

        // Click on progress bar to seek
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;
            if (duration) {
                audio.currentTime = (clickX / width) * duration;
            }
        });
        
        // Reset when song ends
        audio.addEventListener('ended', () => {
            playBtn.textContent = '▶';
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00 / 0:00';
        });
    }
});

// Floating Hearts Animation
function startFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    if (!container) return;
    
    // Emojis to float
    const emojis = ['💖', '🌸', '✨', '💕', '🌷'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        // Random emoji
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Random position and animation duration
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5s to 10s
        
        container.appendChild(heart);
        
        // Remove after animation completes
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }, 800); // create a new heart every 800ms
}

// --- Treasure Hunt & Card 23 Date Lock / Backdoor Logic ---
function isCard23DateUnlocked() {
    // 12:00 AM on August 31, 2026 IST (UTC+5:30)
    let targetTime = new Date('2026-08-31T00:00:00+05:30').getTime();
    if (window.SITE_CONTENT && window.SITE_CONTENT.homepage && window.SITE_CONTENT.homepage.countdown && window.SITE_CONTENT.homepage.countdown.targetDate) {
        const raw = window.SITE_CONTENT.homepage.countdown.targetDate;
        const parsed = new Date(raw.includes('+') || raw.endsWith('Z') ? raw : raw + '+05:30').getTime();
        if (!isNaN(parsed)) {
            targetTime = parsed;
        }
    }
    return Date.now() >= targetTime;
}

function isCard23Unlocked() {
    return isCard23DateUnlocked() || sessionStorage.getItem('card23_backdoor') === 'true';
}

function showTreasureToast(message) {
    let toast = document.getElementById('treasure-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'treasure-toast';
        toast.className = 'treasure-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.treasureToastTimeout);
    window.treasureToastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

let card23TapCount = 0;
let card23TapTimer = null;

function handleCard23Tap(cardElement) {
    const isDateUnlocked = isCard23DateUnlocked();
    const isBackdoor = sessionStorage.getItem('card23_backdoor') === 'true';
    const isUnlocked = isDateUnlocked || isBackdoor;
    const maxUnlocked = parseInt(localStorage.getItem('treasureProgress') || '1', 10);

    // If card 23 is already unlocked (date passed or backdoor active) AND not locked
    if (isUnlocked && !cardElement.classList.contains('locked')) {
        cardElement.classList.toggle('flipped');
        return;
    }

    // Card 23 is currently locked: count tap towards 10-tap backdoor
    card23TapCount++;
    clearTimeout(card23TapTimer);
    card23TapTimer = setTimeout(() => {
        card23TapCount = 0;
    }, 3500);

    // Shake animation
    cardElement.classList.remove('card-shake');
    void cardElement.offsetWidth;
    cardElement.classList.add('card-shake');

    if (card23TapCount >= 10) {
        // Backdoor triggered!
        card23TapCount = 0;
        sessionStorage.setItem('card23_backdoor', 'true');

        cardElement.classList.remove('locked', 'date-locked');
        cardElement.classList.add('unlocked', 'active');
        const dateHint = cardElement.querySelector('.lock-date-hint');
        if (dateHint) dateHint.style.display = 'none';

        // Celebration feedback
        if (window.confetti) {
            confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffb3c6', '#ff6b9e', '#ffd700', '#a18cd1', '#87ceeb']
            });
        }
        const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        popSound.volume = 0.5;
        popSound.play().catch(() => {});

        showTreasureToast("✨ Backdoor unlocked! Opening messages... 💌");

        setTimeout(() => {
            cardElement.classList.add('flipped');
        }, 350);
    } else {
        // Feedback while tapping
        if (!isDateUnlocked && maxUnlocked >= 23) {
            showTreasureToast("🔒 Unlocks on August 31 at 12:00 AM! 🎂");
        } else if (!isDateUnlocked) {
            showTreasureToast("🔒 Clue 23 unlocks on August 31 at 12:00 AM! ✨");
        } else {
            showTreasureToast("🔒 Find the earlier gifts first! 🎁");
        }
    }
}

function initTreasureHunt() {
    const maxUnlocked = parseInt(localStorage.getItem('treasureProgress') || '1', 10);
    const card23Unlocked = isCard23Unlocked();

    for (let i = 1; i <= 23; i++) {
        const card = document.querySelector(`.treasure-card[data-card="${i}"]`);
        if (!card) continue;

        if (i === 23) {
            const dateHint = card.querySelector('.lock-date-hint');
            if (maxUnlocked > 23) {
                // Finished hunt
                card.classList.remove('locked', 'date-locked');
                card.classList.add('unlocked', 'completed');
                card.querySelector('.found-btn')?.classList.add('hidden');
                card.querySelector('.completed-check')?.classList.remove('hidden');
                if (dateHint) dateHint.style.display = 'none';
            } else if (card23Unlocked && (maxUnlocked >= 23 || sessionStorage.getItem('card23_backdoor') === 'true')) {
                // Unlocked either normally by reaching card 23 after Aug 31 12am OR via backdoor
                card.classList.remove('locked', 'date-locked', 'completed');
                card.classList.add('unlocked', 'active');
                card.querySelector('.found-btn')?.classList.remove('hidden');
                card.querySelector('.completed-check')?.classList.add('hidden');
                if (dateHint) dateHint.style.display = 'none';
            } else {
                // Locked before Aug 31 12:00 AM
                card.classList.remove('unlocked', 'active', 'completed');
                card.classList.add('locked', 'date-locked');
                card.querySelector('.found-btn')?.classList.remove('hidden');
                card.querySelector('.completed-check')?.classList.add('hidden');
                if (dateHint) dateHint.style.display = 'inline-block';
            }
            continue;
        }

        if (i < maxUnlocked) {
            card.classList.remove('locked', 'date-locked');
            card.classList.add('unlocked', 'completed');
            card.querySelector('.found-btn')?.classList.add('hidden');
            card.querySelector('.completed-check')?.classList.remove('hidden');
        } else if (i === maxUnlocked) {
            card.classList.remove('locked', 'completed', 'date-locked');
            card.classList.add('unlocked', 'active');
            card.querySelector('.found-btn')?.classList.remove('hidden');
            card.querySelector('.completed-check')?.classList.add('hidden');
        } else {
            card.classList.remove('unlocked', 'active', 'completed', 'date-locked');
            card.classList.add('locked');
            card.querySelector('.found-btn')?.classList.remove('hidden');
            card.querySelector('.completed-check')?.classList.add('hidden');
        }
    }
}

function flipTreasureCard(cardElement) {
    const cardNum = parseInt(cardElement.getAttribute('data-card'), 10);
    if (cardNum === 23) {
        handleCard23Tap(cardElement);
        return;
    }
    if (cardElement.classList.contains('locked')) {
        cardElement.classList.remove('card-shake');
        void cardElement.offsetWidth;
        cardElement.classList.add('card-shake');
        showTreasureToast("🔒 Find the earlier gifts first!");
        return; 
    }
    cardElement.classList.toggle('flipped');
}

function unlockNextCard(currentCardNum) {
    const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    popSound.volume = 0.5;
    popSound.play().catch(e => console.log("Audio play blocked", e));

    if (window.confetti && currentCardNum < 23) {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ffb3c6', '#ff6b9e', '#e05e96', '#ffffff']
        });
    }

    const nextCardNum = currentCardNum + 1;
    const maxUnlocked = parseInt(localStorage.getItem('treasureProgress') || '1', 10);
    if (nextCardNum > maxUnlocked) {
        localStorage.setItem('treasureProgress', nextCardNum.toString());
    }

    const currentCard = document.querySelector(`.treasure-card[data-card="${currentCardNum}"]`);
    if (currentCard) {
        currentCard.classList.remove('active');
        currentCard.classList.add('completed');
        currentCard.querySelector('.found-btn')?.classList.add('hidden');
        currentCard.querySelector('.completed-check')?.classList.remove('hidden');

        setTimeout(() => {
            currentCard.classList.remove('flipped');
        }, 800);
    }

    if (nextCardNum <= 23) {
        const nextCard = document.querySelector(`.treasure-card[data-card="${nextCardNum}"]`);
        if (nextCardNum === 23 && !isCard23Unlocked()) {
            if (nextCard) {
                nextCard.classList.remove('unlocked', 'active', 'completed');
                nextCard.classList.add('locked', 'date-locked');
                const dateHint = nextCard.querySelector('.lock-date-hint');
                if (dateHint) dateHint.style.display = 'inline-block';
                setTimeout(() => {
                    nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    showTreasureToast("🎉 Clue 22 completed! Clue 23 unlocks on August 31 at 12:00 AM! 🎂");
                }, 1000);
            }
        } else {
            if (nextCard) {
                nextCard.classList.remove('locked', 'date-locked');
                nextCard.classList.add('unlocked', 'active');
                const dateHint = nextCard.querySelector('.lock-date-hint');
                if (dateHint) dateHint.style.display = 'none';

                setTimeout(() => {
                    nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 1000);
            }
        }
    } else {
        // All found!
        setTimeout(() => {
            const overlay = document.getElementById('celebration-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
                startFloatingHearts();
                startGrandCelebration();

                if (window.confetti) {
                    var duration = 4000;
                    var end = Date.now() + duration;

                    (function frame() {
                        confetti({
                            particleCount: 8,
                            angle: 60,
                            spread: 80,
                            origin: { x: 0 },
                            colors: ['#ffb3c6', '#ff6b9e', '#e05e96', '#ffd700', '#87ceeb']
                        });
                        confetti({
                            particleCount: 8,
                            angle: 120,
                            spread: 80,
                            origin: { x: 1 },
                            colors: ['#ffb3c6', '#ff6b9e', '#e05e96', '#ffd700', '#87ceeb']
                        });

                        if (Date.now() < end) {
                            requestAnimationFrame(frame);
                        }
                    }());
                }
            }
        }, 1200);
    }
}

function resetHunt() {
    if(confirm("Are you sure you want to reset all progress?")) {
        localStorage.setItem('treasureProgress', '1');
        sessionStorage.removeItem('card23_backdoor');
        sessionStorage.removeItem('cake_backdoor');
        document.querySelectorAll('.treasure-card.flipped').forEach(c => c.classList.remove('flipped'));
        setTimeout(() => {
            initTreasureHunt();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 400);
    }
}

// --- Slot Machine Logic ---
const reasonsList = [
    "the way you scrunch your nose when you laugh",
    "how you always know exactly what I'm thinking",
    "your beautiful smile that lights up the room",
    "the way you make everything better just by being there",
    "how incredibly smart and funny you are",
    "the countless amazing memories we've made",
    "your weird but cute dance moves",
    "how you steal the covers but I let you anyway",
    "the way your eyes sparkle when you talk about things you love",
    "how safe I feel when I'm with you",
    "the fact that you laugh at my terrible jokes",
    "your kindness towards everyone you meet",
    "how we can sit in silence and it's not awkward",
    "the way you support my dreams",
    "because you're simply my favorite person"
];

let isSpinning = false;
function spinReasons() {
    if (isSpinning) return;
    isSpinning = true;
    
    const textElement = document.getElementById('reason-text');
    if(!textElement) return;
    
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    
    let spinCount = 0;
    const maxSpins = 20; // How many times it flashes before stopping
    
    // Quick flash interval
    const spinInterval = setInterval(() => {
        const randomReason = reasonsList[Math.floor(Math.random() * reasonsList.length)];
        textElement.textContent = randomReason;
        textElement.style.opacity = '0.5';
        spinCount++;
        
        if (spinCount >= maxSpins) {
            clearInterval(spinInterval);
            
            // Final reason
            const finalReason = reasonsList[Math.floor(Math.random() * reasonsList.length)];
            textElement.textContent = finalReason;
            textElement.style.opacity = '1';
            textElement.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                textElement.style.transform = 'scale(1)';
                isSpinning = false;
                spinBtn.disabled = false;
            }, 300);
        }
    }, 100); // 100ms per flash
}

// --- Custom Sparkle Cursor ---
document.addEventListener('DOMContentLoaded', () => {
    // Only on desktop (no touch)
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // occasionally drop a sparkle
            if (Math.random() > 0.8) {
                createCursorSparkle(e.clientX, e.clientY);
            }
        });
    }
});

function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('cursor-sparkle');
    sparkle.textContent = Math.random() > 0.5 ? '✨' : '💖';
    sparkle.style.left = (x - 10) + 'px';
    sparkle.style.top = (y - 10) + 'px';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// --- Grand Celebration (Balloons) ---
function startGrandCelebration() {
    const container = document.getElementById('celebration-overlay');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.textContent = ['🎈', '✨', '🎁', '🎉'][Math.floor(Math.random() * 4)];
            balloon.style.position = 'absolute';
            balloon.style.fontSize = (Math.random() * 3 + 2) + 'rem';
            balloon.style.left = Math.random() * 100 + 'vw';
            balloon.style.bottom = '-100px';
            balloon.style.transition = 'all 4s ease-in';
            container.appendChild(balloon);

            setTimeout(() => {
                balloon.style.bottom = '120vh';
                balloon.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 - 50}px)`;
            }, 50);

            setTimeout(() => {
                balloon.remove();
            }, 4000);
        }, Math.random() * 2000);
    }
}

// --- Dynamic Video Modal Stack Logic ---
let currentVideoIndex = 0; // 0-indexed
let videoCardsList = [];

function formatVideoCaption(filename) {
    let name = filename.replace(/\.[^/.]+$/, ""); // Remove extension
    if (!/^from\s+/i.test(name)) {
        name = "from " + name;
    }
    return name;
}

function initVideoModal() {
    const stackContainer = document.getElementById('video-stack-container');
    if (!stackContainer) return;

    videoCardsList = (window.TREASURE_VIDEOS && Array.isArray(window.TREASURE_VIDEOS))
        ? window.TREASURE_VIDEOS
        : [];

    stackContainer.innerHTML = '';

    if (videoCardsList.length === 0) {
        stackContainer.innerHTML = `
            <div class="stacked-card" style="transform: none; z-index: 5; opacity: 1; pointer-events: auto; justify-content: center; align-items: center; text-align: center; border: 2px dashed #ff99b3; background: #fffafc; padding: 25px;">
                <div style="font-size: 3.2rem; margin-bottom: 12px;">📹</div>
                <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; color: var(--text-main); margin-bottom: 8px;">Waiting for your videos</h3>
                <p style="font-family: 'Caveat', cursive; font-size: 1.35rem; color: var(--text-light); max-width: 300px; line-height: 1.4;">
                    Drop your video files into the <code style="background: #ffe6f0; padding: 3px 8px; border-radius: 6px; color: #c92a63; font-weight: bold;">videos/</code> folder!
                </p>
                <p style="font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: var(--text-light); margin-top: 14px; opacity: 0.8;">
                    e.g. <em>friend1.mp4</em> becomes <strong>"from friend1"</strong>
                </p>
            </div>
        `;
        const prevBtn = document.getElementById('prev-vid-btn');
        const nextBtn = document.getElementById('next-vid-btn');
        const counter = document.getElementById('video-counter');
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        if (counter) counter.textContent = '0 / 0';
        return;
    }

    currentVideoIndex = 0;

    videoCardsList.forEach((vid, index) => {
        const card = document.createElement('div');
        card.className = 'stacked-card';
        card.dataset.index = index;

        const filename = typeof vid === 'string' ? vid : vid.file;
        const caption = (typeof vid === 'object' && vid.caption) ? vid.caption : formatVideoCaption(filename);

        const videoSrc = (filename.startsWith('http') || filename.startsWith('/') || filename.startsWith('videos/'))
            ? filename
            : `videos/${encodeURIComponent(filename)}`;

        card.innerHTML = `
            <video controls playsinline preload="metadata">
                <source src="${videoSrc}">
                Your browser does not support video playback.
            </video>
            <p class="video-caption">${caption}</p>
        `;
        stackContainer.appendChild(card);
    });

    updateVideoStackDisplay();
}

function updateVideoStackDisplay() {
    const cards = document.querySelectorAll('#video-stack-container .stacked-card');
    const total = cards.length;
    if (total === 0) return;

    cards.forEach((card, index) => {
        const diff = index - currentVideoIndex;

        card.classList.remove('active-card', 'slide-out-left', 'slide-out-right');

        if (diff < 0) {
            card.style.transform = 'translateX(-125%) rotate(-15deg)';
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
            card.style.zIndex = '1';
        } else if (diff === 0) {
            card.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            card.style.zIndex = '30';
            card.classList.add('active-card');
        } else if (diff === 1) {
            card.style.transform = 'translateY(12px) scale(0.95) rotate(2deg)';
            card.style.opacity = '0.8';
            card.style.pointerEvents = 'none';
            card.style.zIndex = '20';
        } else if (diff === 2) {
            card.style.transform = 'translateY(24px) scale(0.90) rotate(-3deg)';
            card.style.opacity = '0.55';
            card.style.pointerEvents = 'none';
            card.style.zIndex = '10';
        } else {
            card.style.transform = 'translateY(36px) scale(0.85) rotate(1deg)';
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
            card.style.zIndex = '5';
        }
    });

    const prevBtn = document.getElementById('prev-vid-btn');
    const nextBtn = document.getElementById('next-vid-btn');
    const counter = document.getElementById('video-counter');

    if (prevBtn) prevBtn.disabled = (currentVideoIndex <= 0);
    if (nextBtn) nextBtn.disabled = (currentVideoIndex >= total - 1);
    if (counter) counter.textContent = `${currentVideoIndex + 1} / ${total}`;
}

function openVideoModal() {
    initVideoModal();
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.add('hidden');
        pauseAllVideos();
    }
}

function pauseAllVideos() {
    document.querySelectorAll('.stacked-card video').forEach(vid => {
        vid.pause();
    });
}

function nextVideo() {
    const cards = document.querySelectorAll('#video-stack-container .stacked-card');
    if (currentVideoIndex < cards.length - 1) {
        pauseAllVideos();
        currentVideoIndex++;
        updateVideoStackDisplay();
    }
}

function prevVideo() {
    if (currentVideoIndex > 0) {
        pauseAllVideos();
        currentVideoIndex--;
        updateVideoStackDisplay();
    }
}

// --- Emoji Rain ---
function startEmojiRain() {
    const emojis = ['🎂', '🎈', '🎁', '💖', '✨', '🎉', '🧡', '🌸', '💕', '🎀'];
    const container = document.createElement('div');
    container.id = 'emoji-rain-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const drop = document.createElement('span');
            drop.className = 'emoji-drop';
            drop.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            drop.style.left = Math.random() * 100 + 'vw';
            drop.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
            drop.style.animationDuration = (Math.random() * 2 + 2) + 's';
            drop.style.animationDelay = '0s';
            container.appendChild(drop);
        }, Math.random() * 2500);
    }

    setTimeout(() => {
        container.style.transition = 'opacity 1s';
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 1000);
    }, 4000);
}

// --- Love Letter Typewriter ---
function initLoveLetter() {
    const letterEl = document.getElementById('love-letter-text');
    if (!letterEl) return;

    letterEl.textContent = '';
    let hasStarted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                const fullText = (window.SITE_CONTENT && window.SITE_CONTENT.homepage && window.SITE_CONTENT.homepage.loveLetter && window.SITE_CONTENT.homepage.loveLetter.text)
                    ? window.SITE_CONTENT.homepage.loveLetter.text
                    : (letterEl.getAttribute('data-text') || '');
                if (fullText) {
                    typeLetter(letterEl, fullText, 0);
                }
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(letterEl);
}

function typeLetter(el, text, idx) {
    if (idx <= text.length) {
        el.textContent = text.substring(0, idx);
        setTimeout(() => typeLetter(el, text, idx + 1), 45);
    }
}

document.addEventListener('DOMContentLoaded', initLoveLetter);

// --- Floating Gallery Logic ---
function initFloatingGallery() {
    const container = document.getElementById('float-container');
    if (!container) return;

    // Dynamically render from window.MEMORIES_PHOTOS if available
    const photosList = (window.MEMORIES_PHOTOS && Array.isArray(window.MEMORIES_PHOTOS) && window.MEMORIES_PHOTOS.length > 0)
        ? window.MEMORIES_PHOTOS
        : [];

    if (photosList.length > 0) {
        container.innerHTML = '';
        photosList.forEach((photoFile, idx) => {
            const div = document.createElement('div');
            div.className = 'float-photo';
            const src = (photoFile.startsWith('http') || photoFile.startsWith('/') || photoFile.startsWith('memories/'))
                ? photoFile
                : `memories/${encodeURIComponent(photoFile)}`;
            div.innerHTML = `<img decoding="async" src="${src}" alt="Memory ${idx + 1}">`;
            container.appendChild(div);
        });
    }

    const photos = document.querySelectorAll('.float-photo');
    if (!photos.length) return;

    const count = photos.length;
    const cols = window.innerWidth < 600 ? 3 : Math.min(6, Math.max(4, Math.ceil(Math.sqrt(count * 1.5))));
    const rows = Math.ceil(count / cols);

    const cellW = 82 / cols;
    const cellH = 75 / rows;

    photos.forEach((photo, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        const left = 6 + (col * cellW) + (Math.random() * (cellW * 0.45));
        const top = 14 + (row * cellH) + (Math.random() * (cellH * 0.40));

        const size = Math.floor(Math.random() * 30) + 88; // 88px to 118px
        photo.style.width = size + 'px';
        photo.style.height = size + 'px';
        photo.style.left = left + '%';
        photo.style.top = top + '%';

        const dur = (Math.random() * 5 + 5).toFixed(1);
        const delay = (Math.random() * 4).toFixed(1);
        photo.style.animation = `floatBubble ${dur}s ease-in-out ${delay}s infinite alternate`;

        photo.addEventListener('click', (e) => {
            e.stopPropagation();
            const overlay = document.getElementById('gallery-overlay');
            const overlayImg = document.getElementById('gallery-overlay-img');
            if (overlay && overlayImg) {
                overlayImg.src = photo.querySelector('img').src;
                overlay.classList.remove('hidden');
            }
        });
    });

    // Add ambient background bubbles
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'ambient-bubble';
        const bSize = Math.floor(Math.random() * 50) + 20;
        bubble.style.width = bSize + 'px';
        bubble.style.height = bSize + 'px';
        bubble.style.left = Math.random() * 95 + '%';
        bubble.style.top = Math.random() * 90 + 5 + '%';
        bubble.style.animationDuration = (Math.random() * 6 + 6) + 's';
        bubble.style.animationDelay = (Math.random() * 4) + 's';
        container.appendChild(bubble);
    }
}

function closeGalleryOverlay() {
    const overlay = document.getElementById('gallery-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// Close overlays with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGalleryOverlay();
        closeMosaicOverlay();
    }
});

// --- Photo Mosaic Logic ---
function initMosaic() {
    const tiles = document.querySelectorAll('.mosaic-tile');
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const overlay = document.getElementById('mosaic-overlay');
            const overlayImg = document.getElementById('mosaic-overlay-img');
            const overlayCaption = document.getElementById('mosaic-overlay-caption');
            if (overlay && overlayImg) {
                overlayImg.src = tile.querySelector('img').src;
                if (overlayCaption) {
                    overlayCaption.textContent = tile.getAttribute('data-caption') || 'every piece is you 💜';
                }
                overlay.classList.remove('hidden');
            }
        });
    });
}

function closeMosaicOverlay() {
    const overlay = document.getElementById('mosaic-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// --- Birthday Cake Candle Blow ---
let candlesLit = 23;
let micActive = false;

function initCake() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, i) => {
        candle.addEventListener('click', () => {
            blowOutCandle(candle);
        });
    });

    // Microphone support for mobile
    const blowBtn = document.getElementById('blow-btn');
    if (blowBtn) {
        blowBtn.addEventListener('click', () => {
            if (!micActive) {
                startMicDetection();
                blowBtn.textContent = '🎤 Listening... blow!';
                blowBtn.classList.add('active-mic');
            }
        });
    }
}

function blowOutCandle(candle) {
    if (candle.classList.contains('blown-out')) return;
    candle.classList.add('blown-out');
    candlesLit--;

    // Trigger smoke animation
    setTimeout(() => candle.classList.add('smoke-active'), 50);

    // Update counter
    const counter = document.getElementById('candles-left');
    if (counter) counter.textContent = candlesLit;

    // Update ambient glow from candles
    const glow = document.getElementById('cake-glow');
    if (glow) {
        const ratio = candlesLit / 23;
        glow.style.opacity = ratio.toFixed(2);
    }

    if (candlesLit <= 0) {
        setTimeout(() => {
            const wish = document.getElementById('cake-wish');
            if (wish) {
                wish.classList.remove('hidden');
            }
            if (window.confetti) {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#ffb3c6', '#ff6b9e', '#ffd700', '#87ceeb', '#a78bfa']
                });
            }
        }, 500);
    }
}

function startMicDetection() {
    if (micActive) return;
    micActive = true;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function checkBlow() {
            if (candlesLit <= 0) {
                stream.getTracks().forEach(t => t.stop());
                micActive = false;
                return;
            }
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

            if (avg > 40) {
                // Blow detected! Blow out a random lit candle
                const litCandles = document.querySelectorAll('.candle:not(.blown-out)');
                if (litCandles.length > 0) {
                    const randomCandle = litCandles[Math.floor(Math.random() * litCandles.length)];
                    blowOutCandle(randomCandle);
                }
            }
            requestAnimationFrame(checkBlow);
        }
        checkBlow();
    }).catch(err => {
        console.log('Microphone access denied:', err);
        const blowBtn = document.getElementById('blow-btn');
        if (blowBtn) blowBtn.textContent = '🎤 Mic denied - tap candles instead';
    });
}


// --- Apply Central Content From content.json / content.js ---
function applyContentFromJSON() {
    if (!window.SITE_CONTENT) return;
    const c = window.SITE_CONTENT;

    // Intro Screen
    if (c.introEnvelope) {
        const letterPs = document.querySelectorAll('#intro-screen .letter p:not(.highlight)');
        if (letterPs.length >= 2) {
            if (c.introEnvelope.title) letterPs[0].textContent = c.introEnvelope.title;
            if (c.introEnvelope.body) letterPs[1].textContent = c.introEnvelope.body;
        }
        const hl = document.querySelector('#intro-screen .letter .highlight');
        if (hl && c.introEnvelope.highlight) hl.textContent = c.introEnvelope.highlight;
        const stamp = document.querySelector('#intro-screen .stamp');
        if (stamp && c.introEnvelope.stamp) stamp.textContent = c.introEnvelope.stamp;
        const seal = document.querySelector('#intro-screen .heart-seal');
        if (seal && c.introEnvelope.heartSeal) seal.textContent = c.introEnvelope.heartSeal;
        const tap = document.querySelector('#intro-screen .tap-text');
        if (tap && c.introEnvelope.tapInstruction) tap.textContent = c.introEnvelope.tapInstruction;
    }

    // Homepage
    if (c.homepage) {
        if (c.homepage.header) {
            const hBadge = document.querySelector('header .badge');
            if (hBadge && c.homepage.header.badge) hBadge.textContent = c.homepage.header.badge;
            const hSub = document.querySelector('header .header-title');
            if (hSub && c.homepage.header.subtitle) hSub.textContent = c.homepage.header.subtitle;
            const h1 = document.querySelector('header h1');
            if (h1 && c.homepage.header.title) h1.textContent = c.homepage.header.title;
        }

        if (c.homepage.countdown) {
            const cdDate = document.querySelector('.countdown-date');
            if (cdDate && c.homepage.countdown.birthdayLabel) cdDate.textContent = c.homepage.countdown.birthdayLabel;
        }

        if (c.homepage.messageCard) {
            const msgP = document.querySelector('.message-card p');
            if (msgP) msgP.textContent = c.homepage.messageCard;
        }

        if (c.homepage.musicPlayer) {
            const np = document.querySelector('.music-player .now-playing');
            if (np && c.homepage.musicPlayer.nowPlaying) np.textContent = c.homepage.musicPlayer.nowPlaying;
            const sTitle = document.querySelector('.music-player h3');
            if (sTitle && c.homepage.musicPlayer.songTitle) sTitle.textContent = c.homepage.musicPlayer.songTitle;
            const sArtist = document.querySelector('.music-player .artist');
            if (sArtist && c.homepage.musicPlayer.artist) sArtist.textContent = c.homepage.musicPlayer.artist;
            const audioEl = document.getElementById('bg-music');
            if (audioEl && c.homepage.musicPlayer.audioSrc && (!audioEl.src || audioEl.src.endsWith('index.html') || audioEl.getAttribute('src') === '')) {
                audioEl.src = c.homepage.musicPlayer.audioSrc;
            }
            const sInst = document.querySelector('.instruction-text');
            if (sInst && c.homepage.musicPlayer.instruction) sInst.textContent = c.homepage.musicPlayer.instruction;
        }

        if (c.homepage.flipCardsSection) {
            const fTitle = document.querySelector('.flip-cards-section h2');
            if (fTitle && c.homepage.flipCardsSection.title) fTitle.textContent = c.homepage.flipCardsSection.title;
            const fSub = document.querySelector('.flip-cards-section .sub-instruction');
            if (fSub && c.homepage.flipCardsSection.subtitle) fSub.textContent = c.homepage.flipCardsSection.subtitle;

            if (c.homepage.flipCardsSection.cards && Array.isArray(c.homepage.flipCardsSection.cards)) {
                const cardBacks = document.querySelectorAll('.flip-card-back p');
                c.homepage.flipCardsSection.cards.forEach((cardData, idx) => {
                    if (cardBacks[idx] && cardData.backText) {
                        cardBacks[idx].textContent = cardData.backText;
                    }
                });
            }
        }

        if (c.homepage.reasonsSection) {
            const rTitle = document.querySelector('.reasons-section h2');
            if (rTitle && c.homepage.reasonsSection.title) rTitle.textContent = c.homepage.reasonsSection.title;
            const rBtn = document.getElementById('spin-btn');
            if (rBtn && c.homepage.reasonsSection.buttonText) rBtn.textContent = c.homepage.reasonsSection.buttonText;
            const rPrompt = document.getElementById('reason-text');
            if (rPrompt && c.homepage.reasonsSection.initialPrompt && rPrompt.textContent.includes('Click')) {
                rPrompt.textContent = c.homepage.reasonsSection.initialPrompt;
            }
            if (c.homepage.reasonsSection.reasons && Array.isArray(c.homepage.reasonsSection.reasons)) {
                reasonsList.length = 0;
                reasonsList.push(...c.homepage.reasonsSection.reasons);
            }
        }

        if (c.homepage.loveLetter) {
            const llTitle = document.querySelector('.love-letter-section h2');
            if (llTitle && c.homepage.loveLetter.title) llTitle.textContent = c.homepage.loveLetter.title;
            const llP = document.getElementById('love-letter-text');
            if (llP && c.homepage.loveLetter.text) llP.setAttribute('data-text', c.homepage.loveLetter.text);
            const llSig = document.querySelector('.letter-signature');
            if (llSig && c.homepage.loveLetter.signature) llSig.textContent = c.homepage.loveLetter.signature;
        }

        if (c.homepage.navHub) {
            const nhTitle = document.querySelector('.nav-hub h2');
            if (nhTitle && c.homepage.navHub.title) nhTitle.textContent = c.homepage.navHub.title;
        }
    }

    // Treasure Hunt (album.html)
    if (c.treasureHunt) {
        const thTitle = document.querySelector('.album-title');
        if (thTitle && c.treasureHunt.title) thTitle.textContent = c.treasureHunt.title;
        const thSub = document.querySelector('.album-subtitle');
        if (thSub && c.treasureHunt.subtitle) thSub.textContent = c.treasureHunt.subtitle;

        if (c.treasureHunt.clues && Array.isArray(c.treasureHunt.clues)) {
            c.treasureHunt.clues.forEach((clueText, idx) => {
                const card = document.querySelector(`.treasure-card[data-card="${idx + 1}"] .treasure-card-back p`);
                if (card) card.textContent = clueText;
            });
        }

        if (c.treasureHunt.videoModalTitle) {
            const vmTitle = document.querySelector('#video-modal h2');
            if (vmTitle) vmTitle.textContent = c.treasureHunt.videoModalTitle;
        }
    }

    // Mosaic Page (mosaic.html)
    if (c.mosaicPage) {
        const mTitle = document.querySelector('.mosaic-title');
        if (mTitle && c.mosaicPage.title) mTitle.textContent = c.mosaicPage.title;
        const mSub = document.querySelector('.mosaic-subtitle');
        if (mSub && c.mosaicPage.subtitle) mSub.textContent = c.mosaicPage.subtitle;
    }

    // Memories Page (gallery.html)
    if (c.memoriesPage) {
        const gTitle = document.querySelector('.gallery-title');
        if (gTitle && c.memoriesPage.title) gTitle.textContent = c.memoriesPage.title;
        const gSub = document.querySelector('.gallery-subtitle');
        if (gSub && c.memoriesPage.subtitle) gSub.textContent = c.memoriesPage.subtitle;
    }
}

// Auto-run content hydration on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyContentFromJSON);
} else {
    applyContentFromJSON();
    initCakeNavLock();
}

if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initCakeNavLock); } else { initCakeNavLock(); }
