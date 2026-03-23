/**
 * animations.js
 * Premium animation module — inspired by the reference portfolio at parthh.in
 * Implements: Splash screen, Custom cursor, Hero letter-stagger,
 *             Text scramble, 3D card tilt, Magnetic buttons,
 *             Nav pill glow-follow, Parallax scroll, Word-reveal,
 *             Animated counter (GitHub stats)
 */

/* ──────────────────────────────────────────────────────────
   0. UTILITY HELPERS
   ────────────────────────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const isMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window);

/* ──────────────────────────────────────────────────────────
   1. SPLASH SCREEN
   ────────────────────────────────────────────────────────── */
(function initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;

    // Hide after load bar finishes (1s animation) + small buffer
    window.addEventListener('load', () => {
        setTimeout(() => {
            splash.classList.add('hidden');
            // Once transition ends, kick off all boot animations
            splash.addEventListener('transitionend', () => {
                splash.remove();
                bootHeroAnimations();
            }, { once: true });
        }, 1100);
    });
})();

/* ──────────────────────────────────────────────────────────
   2. CUSTOM CURSOR  (desktop only)
   ────────────────────────────────────────────────────────── */
(function initCursor() {
    if (isMobile()) return;

    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let mx = 0, my = 0;  // actual mouse
    let rx = 0, ry = 0;  // ring (lerped)

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        // Dot follows instantly
        dot.style.left  = mx + 'px';
        dot.style.top   = my + 'px';
    });

    // Ring follows with lerp for smoothness
    function animateRing() {
        rx = lerp(rx, mx, 0.1);
        ry = lerp(ry, my, 0.1);
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expand ring on interactive elements
    const hoverTargets = 'a, button, .project-card, .spec-item, .contact-node, .nav-links a';
    document.querySelectorAll(hoverTargets).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
    });
})();

/* ──────────────────────────────────────────────────────────
   3. HERO LETTER-BY-LETTER STAGGER REVEAL
   ────────────────────────────────────────────────────────── */
function bootHeroAnimations() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    title.querySelectorAll('span[class]').forEach((wordEl, wordIdx) => {
        const isGradient = wordEl.classList.contains('gradient-name');
        const text = wordEl.textContent.trim();
        wordEl.textContent = '';
        wordEl.style.perspective = '600px';
        wordEl.style.display = 'block';

        // For gradient words, we need each char to be inside a gradient-clipped container.
        // We split into chars but keep them inside the gradient element so the
        // background-clip: text still applies across the gradient-name parent.
        if (isGradient) {
            // Remove text-fill from parent and apply it per letter via inherited gradient
            wordEl.style.backgroundClip = 'text';
            wordEl.style.webkitBackgroundClip = 'text';
            wordEl.style.webkitTextFillColor = 'transparent';
            wordEl.style.backgroundImage = 'linear-gradient(135deg, #fbbf24 0%, #f97316 55%, #ef4444 100%)';
        }

        [...text].forEach((char, i) => {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = char === ' ' ? '\u00A0' : char;
            if (isGradient) {
                // inherit the gradient fill from parent
                s.style.display = 'inline-block';
            }
            const delay = wordIdx * 0.28 + i * 0.045;
            s.style.animationDelay = delay + 's';
            wordEl.appendChild(s);
        });
    });

    setTimeout(() => {
        scrambleText(document.querySelector('.hero-eyebrow'));
        scrambleText(document.querySelector('.status-badge'));
    }, 900);
}

/* ──────────────────────────────────────────────────────────
   4. TEXT SCRAMBLE EFFECT
   ────────────────────────────────────────────────────────── */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';

function scrambleText(el) {
    if (!el) return;

    // Collect only text nodes to avoid scrambling child elements
    const textNodes = [];
    el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textNodes.push(node);
        }
    });

    textNodes.forEach(node => {
        const original = node.textContent;
        const len = original.length;
        let frame = 0;
        const totalFrames = len * 3;

        const interval = setInterval(() => {
            let out = '';
            for (let i = 0; i < len; i++) {
                if (original[i] === ' ') { out += ' '; continue; }
                if (frame > i * 3) {
                    out += original[i];
                } else {
                    out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                }
            }
            node.textContent = out;
            frame++;
            if (frame > totalFrames) {
                node.textContent = original;
                clearInterval(interval);
            }
        }, 30);
    });
}

/* ──────────────────────────────────────────────────────────
   5. 3D CARD TILT  (mouse-relative perspective)
   ────────────────────────────────────────────────────────── */
(function initCardTilt() {
    if (isMobile()) return;

    const CARDS = document.querySelectorAll('.project-card');

    CARDS.forEach(card => {
        // Add the shine layer
        const shine = document.createElement('div');
        shine.className = 'tilt-shine';
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;   // 0–1
            const y = (e.clientY - rect.top)  / rect.height;  // 0–1

            const rotX = (y - 0.5) * -14;   // tilt up/down
            const rotY = (x - 0.5) *  14;   // tilt left/right

            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;

            // Move shine with mouse position (in %)
            shine.style.setProperty('--tx', (x * 100) + '%');
            shine.style.setProperty('--ty', (y * 100) + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

/* ──────────────────────────────────────────────────────────
   6. MAGNETIC BUTTONS
   ────────────────────────────────────────────────────────── */
(function initMagneticButtons() {
    if (isMobile()) return;

    const STRENGTH = 0.38;  // 0 = no pull, 1 = full pull
    const RANGE    = 80;   // px radius from button edge to activate

    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < RANGE) {
                const pull = (1 - dist / RANGE) * STRENGTH;
                btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0,0)';
        });
    });
})();

/* ──────────────────────────────────────────────────────────
   7. NAV PILL — GLOW FOLLOWS CURSOR ALONG BORDER
   ────────────────────────────────────────────────────────── */
(function initNavPillGlow() {
    if (isMobile()) return;

    const nav = document.querySelector('.pill-nav');
    if (!nav) return;
    nav.style.position = 'relative'; // ensure ::after positions correctly

    nav.addEventListener('mousemove', (e) => {
        const rect = nav.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        nav.style.setProperty('--gx', x);
        nav.style.setProperty('--gy', y);
    });
})();

/* ──────────────────────────────────────────────────────────
   8. PARALLAX — HERO ELEMENTS ON SCROLL
   ────────────────────────────────────────────────────────── */
(function initParallax() {
    if (isMobile()) return;

    const orb1  = document.querySelector('.orb-1');
    const orb2  = document.querySelector('.orb-2');
    const orb3  = document.querySelector('.orb-3');

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const sy = window.scrollY;
            if (orb1) orb1.style.transform = `translateY(${sy * 0.12}px)`;
            if (orb2) orb2.style.transform = `translateY(${sy * -0.08}px)`;
            if (orb3) orb3.style.transform = `translate(-50%, ${sy * 0.05}px)`;
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
})();

/* ──────────────────────────────────────────────────────────
   9. WORD-LEVEL REVEAL for section titles
   ────────────────────────────────────────────────────────── */
(function initWordReveal() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(el => {
        el.classList.add('reveal-words');
        const words = el.textContent.trim().split(' ');
        el.textContent = '';
        words.forEach(w => {
            const wrapper = document.createElement('span');
            wrapper.className = 'word';
            const inner = document.createElement('span');
            inner.textContent = w;
            wrapper.appendChild(inner);
            el.appendChild(wrapper);
            el.appendChild(document.createTextNode(' '));
        });
    });

    // Re-use IntersectionObserver to trigger words
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const words = e.target.querySelectorAll('.word span');
                words.forEach((w, i) => {
                    setTimeout(() => { w.parentElement.classList.contains('word') && (w.style.transform = 'translateY(0)'); }, i * 80);
                });
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });

    titles.forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────────────────────
   10. ANIMATED COUNTER — GitHub stats
   ────────────────────────────────────────────────────────── */
function animateCounter(el, targetVal, duration = 1200) {
    const start   = performance.now();
    const initial = 0;

    function step(now) {
        const progress = clamp((now - start) / duration, 0, 1);
        const ease     = 1 - Math.pow(1 - progress, 4);  // ease-out-quart
        el.textContent = Math.round(initial + (targetVal - initial) * ease);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// Hook into GitHub fetch completion
const _origFetch = window.fetch;
window.fetch = async (...args) => {
    const res = await _origFetch(...args);
    return res;
};

// Watch for the repos count element to be updated and animate it
const reposTarget = document.getElementById('gh-repos');
if (reposTarget) {
    const repoObserver = new MutationObserver(() => {
        const val = parseInt(reposTarget.textContent, 10);
        if (!isNaN(val) && val > 0) {
            animateCounter(reposTarget, val);
            repoObserver.disconnect();
        }
    });
    repoObserver.observe(reposTarget, { childList: true, characterData: true, subtree: true });
}

/* ──────────────────────────────────────────────────────────
   11. PROJECT CARD STAGGER REVEAL
      (MutationObserver: cards injected by scripts.js get stagger)
   ────────────────────────────────────────────────────────── */
(function initCardStagger() {
    const grid = document.getElementById('github-projects-grid');
    if (!grid) return;

    const gridObserver = new MutationObserver(() => {
        const cards = grid.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
            if (card.dataset.staggered) return;
            card.dataset.staggered = '1';
            card.style.opacity    = '0';
            card.style.transform  = 'translateY(32px)';
            card.style.transition = `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s`;

            // Trigger after a micro-delay so transition registers
            setTimeout(() => {
                card.style.opacity   = '';
                card.style.transform = '';
            }, 60);

            // Also attach tilt + shine if not already done
            if (!card.querySelector('.tilt-shine') && !isMobile()) {
                const shine = document.createElement('div');
                shine.className = 'tilt-shine';
                card.appendChild(shine);

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top)  / rect.height;
                    card.style.transform = `perspective(900px) rotateX(${(y-0.5)*-12}deg) rotateY(${(x-0.5)*12}deg) scale3d(1.02,1.02,1.02)`;
                    shine.style.setProperty('--tx', (x*100)+'%');
                    shine.style.setProperty('--ty', (y*100)+'%');
                });
                card.addEventListener('mouseleave', () => { card.style.transform = ''; });
            }
        });
    });

    gridObserver.observe(grid, { childList: true });
})();

/* ──────────────────────────────────────────────────────────
   12. SCROLL PROGRESS BORDER on pill nav
   ────────────────────────────────────────────────────────── */
(function initScrollProgress() {
    const nav = document.querySelector('.pill-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        const max  = document.body.scrollHeight - window.innerHeight;
        const pct  = max > 0 ? window.scrollY / max : 0;
        nav.style.setProperty('--scroll', pct.toFixed(3));
    }, { passive: true });
})();
