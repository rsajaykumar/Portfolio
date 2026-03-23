// ============================================================
// Configuration
// ============================================================
const GITHUB_USERNAME = 'rsajaykumar';

// ============================================================
// Scroll-Reveal (IntersectionObserver)
// ============================================================
(function () {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
})();

async function fetchGitHubData() {
    try {
        // 1. Fetch User Profile
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!userRes.ok) return; // If user not found or rate limited, silent fail and show static cards

        const userData = await userRes.json();

        // Show Banner
        document.getElementById('gh-stats').style.display = 'flex';
        document.getElementById('gh-avatar').src = userData.avatar_url;
        document.getElementById('gh-name').textContent = userData.name || GITHUB_USERNAME;
        document.getElementById('gh-username').textContent = userData.login;
        document.getElementById('gh-repos').textContent = userData.public_repos;

        // 2. Fetch Pinned or Top Repos
        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
        if (!reposRes.ok) return;

        let allRepos = await reposRes.json();

        // Filter out snakegame.py
        allRepos = allRepos.filter(repo => repo.name.toLowerCase() !== 'snakegame.py');

        // Prioritize Ai-thinker WB2 32S
        const targetRepoIndex = allRepos.findIndex(repo => repo.name.toLowerCase().includes('ai-thinker') || repo.name.toLowerCase().includes('wb2'));
        let reposData = [];

        if (targetRepoIndex !== -1) {
            const [targetRepo] = allRepos.splice(targetRepoIndex, 1);
            reposData = [targetRepo, ...allRepos].slice(0, 6);
        } else {
            reposData = allRepos.slice(0, 6);
        }

        if (reposData.length > 0) {
            const grid = document.getElementById('github-projects-grid');
            grid.innerHTML = ''; // Clear static cards if API is successful

            const rc = document.getElementById('records-count-el');
            if (rc) rc.textContent = `${reposData.length} records fetched`;

            reposData.forEach(repo => {
                const date = new Date(repo.updated_at).getFullYear();
                const language = repo.language || 'Code';

                const cardHTML = `
                    <div class="project-card">
                        <div class="project-header">
                            <div class="project-icon cyan">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </div>
                            <span class="project-date">${date}</span>
                        </div>
                        <h3 class="project-title">${repo.name}</h3>
                        <p class="project-desc">${repo.description || 'No description provided for this repository.'}</p>
                        <div class="project-tech">
                            <span class="tech-pill">${language}</span>
                            ${repo.stargazers_count > 0 ? `<span class="tech-pill" style="color:var(--accent-yellow)">★ ${repo.stargazers_count}</span>` : ''}
                        </div>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" class="project-link">View Repository <span>→</span></a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link" style="color:var(--accent-green)">Live Demo <span>↗</span></a>` : ''}
                        </div>
                    </div>
                `;
                grid.innerHTML += cardHTML;
            });
        }
    } catch (e) {
        console.error("GitHub API integration failed:", e);
        // Fallback to static cards if fails
    }
}

// (Active link highlighting moved to bottom with mobile nav)

// Initialize GitHub Fetching
fetchGitHubData();

// Terminal Typewriter Effect
const terminalLines = [
    { cmd: "./fetch_bio.sh", output: "Initializing secure connection... OK\nLoading payload... OK" },
    { cmd: "cat identity.json", output: "{\n  \"name\": \"Ajay Kumar\",\n  \"role\": \"Electrical & Embedded Eng\",\n  \"status\": \"Deployed\"\n}" },
    { cmd: "whoami", output: "root" }
];

async function typeTerminal() {
    const termBody = document.getElementById('term-body');
    if (!termBody) return;
    termBody.innerHTML = '';

    // Animate each command
    for (let i = 0; i < terminalLines.length; i++) {
        const line = terminalLines[i];

        // Setup prompt line
        const lineDiv = document.createElement('div');
        lineDiv.className = 'term-line';
        lineDiv.innerHTML = `<span class="term-prompt">admin@node:~#</span><span class="term-command"></span><span class="term-cursor"></span>`;
        termBody.appendChild(lineDiv);

        const cmdSpan = lineDiv.querySelector('.term-command');
        const cursor = lineDiv.querySelector('.term-cursor');

        // Type the command
        for (let j = 0; j < line.cmd.length; j++) {
            cmdSpan.textContent += line.cmd[j];
            await new Promise(r => setTimeout(r, Math.random() * 50 + 50));
        }

        await new Promise(r => setTimeout(r, 400)); // wait before executing
        cursor.remove(); // remove cursor from old line

        // Show output
        if (line.output) {
            const outDiv = document.createElement('span');
            outDiv.className = 'term-output';
            outDiv.innerHTML = line.output.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
            termBody.appendChild(outDiv);
        }
        await new Promise(r => setTimeout(r, 600)); // wait before next command
    }

    // Add final blinking prompt
    const finalDiv = document.createElement('div');
    finalDiv.className = 'term-line';
    finalDiv.innerHTML = `<span class="term-prompt">admin@node:~#</span><span class="term-cursor"></span>`;
    termBody.appendChild(finalDiv);
}

// Ensure terminal animation triggers when scrolled into view
let terminalAnimated = false;
window.addEventListener('scroll', () => {
    const termSection = document.getElementById('terminal');
    if (termSection && !terminalAnimated) {
        const rect = termSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            terminalAnimated = true;
            typeTerminal();
        }
    }
});

// Contact Form — mailto: handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';
        const message = document.getElementById('message').value.trim();

        const body = `Hi Ajay,\n\n${message}\n\n---\nSent by: ${name}\nReply to: ${email}`;

        const mailtoLink = `mailto:rsajaykumar12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        // Visual feedback
        const btn = document.getElementById('btn-send');
        btn.textContent = '✓ Opening Mail Client...';
        btn.style.background = '#16a34a';
        setTimeout(() => {
            btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message`;
            btn.style.background = '';
        }, 3000);
    });
}

// Click Spark Effect
document.addEventListener('click', (e) => {
    // Only trigger if not clicking a link to avoid overriding navigation
    if (e.target.closest('a') && !e.target.closest('.contact-node')) return;

    const numSparks = 5;
    const colors = ['#22c55e', '#fbbf24', '#10b981'];

    for (let i = 0; i < numSparks; i++) {
        const spark = document.createElement('div');
        spark.className = 'click-spark';

        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';

        const angle = (Math.PI * 2 / numSparks) * i + (Math.random() - 0.5);
        const distance = 40 + Math.random() * 40;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        spark.style.setProperty('--dx', `${dx}px`);
        spark.style.setProperty('--dy', `${dy}px`);

        spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(spark);

        setTimeout(() => {
            spark.remove();
        }, 600);
    }
});

// ============================================================
// Mobile Menu Toggle  (pill nav)
// ============================================================
const mobileBtn = document.getElementById('mobile-menu-btn');
const navMenu   = document.getElementById('nav-menu');

function closeMobileNav() {
    if (!navMenu) return;
    navMenu.classList.remove('mobile-open');
    if (mobileBtn) {
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
    }
}

if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('mobile-open');
        mobileBtn.classList.toggle('active', isOpen);
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('click', (e) => {
        if (
            navMenu.classList.contains('mobile-open') &&
            !navMenu.contains(e.target) &&
            !mobileBtn.contains(e.target)
        ) {
            closeMobileNav();
        }
    });
}

// ============================================================
// Active Nav Link Highlighting
// ============================================================
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        if (scrollY >= section.offsetTop - 160) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}, { passive: true });

// Canvas Space Background
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    // Arrays for space objects
    let stars = [];
    let asteroids = [];
    let rockets = [];
    let ufos = [];

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 1.2;
            this.vy = Math.random() * 0.5 + 0.1; // Fall downwards slowly
            this.opacity = Math.random();
        }
        update() {
            this.y += this.vy;
            if (this.y > height) {
                this.y = 0;
                this.x = Math.random() * width;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    class Asteroid {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 3 + 1;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'; // Muted gray asteroid
            ctx.fill();
        }
    }

    class Rocket {
        constructor() {
            this.active = false;
        }
        reset() {
            // Spawn outside bottom or left
            if (Math.random() > 0.5) {
                this.x = -50;
                this.y = Math.random() * height;
            } else {
                this.x = Math.random() * width;
                this.y = height + 50;
            }
            this.vx = Math.random() * 3 + 1.5;
            this.vy = -(Math.random() * 3 + 1.5);
            this.angle = Math.atan2(this.vy, this.vx);
            this.size = Math.random() * 0.4 + 0.6; // Scale
            this.active = true;
        }
        update() {
            if (!this.active) return;
            this.x += this.vx;
            this.y += this.vy;
            if (this.x > width + 100 || this.y < -100) {
                this.active = false;
            }
        }
        draw() {
            if (!this.active) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.scale(this.size, this.size);

            // Flame
            ctx.fillStyle = Math.random() > 0.5 ? '#fbbf24' : '#ef4444';
            ctx.beginPath();
            ctx.moveTo(-15, -4);
            ctx.lineTo(-30, 0);
            ctx.lineTo(-15, 4);
            ctx.fill();

            // Body
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.moveTo(-15, -8);
            ctx.lineTo(10, -8);
            ctx.lineTo(25, 0);
            ctx.lineTo(10, 8);
            ctx.lineTo(-15, 8);
            ctx.closePath();
            ctx.fill();

            // Fins
            ctx.fillStyle = '#22c55e'; // match money green theme
            ctx.beginPath();
            ctx.moveTo(-15, -8);
            ctx.lineTo(-20, -16);
            ctx.lineTo(-5, -8);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(-15, 8);
            ctx.lineTo(-20, 16);
            ctx.lineTo(-5, 8);
            ctx.fill();

            // Window
            ctx.fillStyle = '#0f1115';
            ctx.beginPath();
            ctx.arc(5, 0, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    class UFO {
        constructor() {
            this.active = false;
        }
        reset() {
            this.x = Math.random() < 0.5 ? -100 : width + 100;
            this.y = Math.random() * (height * 0.6); // Hover in upper 60%
            this.vx = (this.x < 0 ? 1 : -1) * (Math.random() * 0.5 + 0.5);
            this.vy = 0;
            this.hoverOffset = Math.random() * Math.PI * 2;
            this.size = Math.random() * 0.4 + 0.5;
            this.active = true;
        }
        update() {
            if (!this.active) return;
            this.x += this.vx;
            this.hoverOffset += 0.03;
            this.y += Math.sin(this.hoverOffset) * 0.5;

            if (this.x > width + 150 || this.x < -150) {
                this.active = false;
            }
        }
        draw() {
            if (!this.active) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.size, this.size);

            // Tractor Beam (flashing)
            if (Math.random() > 0.1) {
                ctx.fillStyle = 'rgba(34, 197, 94, 0.15)'; // Money green beam
                ctx.beginPath();
                ctx.moveTo(-10, 10);
                ctx.lineTo(10, 10);
                ctx.lineTo(40, 150);
                ctx.lineTo(-40, 150);
                ctx.fill();
            }

            // Glass dome
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(0, -5, 12, Math.PI, 0);
            ctx.fill();

            // UFO Body
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.ellipse(0, 5, 25, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Lights
            const time = Date.now();
            ctx.fillStyle = Math.floor(time / 300) % 2 === 0 ? '#fbbf24' : '#ef4444';
            ctx.beginPath(); ctx.arc(-15, 5, 2, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = Math.floor(time / 300 + 1) % 2 === 0 ? '#22c55e' : '#3b82f6';
            ctx.beginPath(); ctx.arc(0, 7, 2, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = Math.floor(time / 300) % 2 === 0 ? '#fbbf24' : '#ef4444';
            ctx.beginPath(); ctx.arc(15, 5, 2, 0, Math.PI * 2); ctx.fill();

            ctx.restore();
        }
    }

    function initCanvas() {
        resize();
        window.addEventListener('resize', resize);

        // Populate arrays
        const numStars = Math.floor(window.innerWidth / 5);
        for (let i = 0; i < numStars; i++) stars.push(new Star());

        const numAsteroids = Math.floor(window.innerWidth / 50);
        for (let i = 0; i < numAsteroids; i++) asteroids.push(new Asteroid());

        // Just 1 rocket to prevent multiple rockets flying
        for (let i = 0; i < 1; i++) {
            let r = new Rocket();
            r.reset();
            rockets.push(r);
        }

        // 1 UFO
        let u = new UFO();
        u.reset();
        ufos.push(u);

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        // Draw Stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Draw Asteroids
        asteroids.forEach(ast => {
            ast.update();
            ast.draw();
        });

        // Draw Rockets
        rockets.forEach(rocket => {
            if (!rocket.active && Math.random() < 0.05) rocket.reset(); // Random spawn frequency
            rocket.update();
            rocket.draw();
        });

        // Draw UFOs
        ufos.forEach(ufo => {
            if (!ufo.active && Math.random() < 0.002) ufo.reset(); // Rare spawn frequency
            ufo.update();
            ufo.draw();
        });
    }

    initCanvas();
}
