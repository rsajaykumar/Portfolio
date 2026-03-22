// Set GitHub Username Here
const GITHUB_USERNAME = 'rsajaykumar'; // Using true actual username for dynamic fetching!

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
            
            document.querySelector('.records-count').textContent = `${reposData.length} Live Records Found`;

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

// Active link highlighting for semantic scrolling
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Initialize GitHub Fetching
fetchGitHubData();

// Terminal Typewriter Effect
const terminalLines = [
    { cmd: "./fetch_bio.sh", output: "Initializing secure connection... OK\nLoading payload... OK" },
    { cmd: "cat identity.json", output: "{\n  \"name\": \"Ajay Kumar R S\",\n  \"role\": \"Electrical & Embedded Eng\",\n  \"status\": \"Deployed\"\n}" },
    { cmd: "whoami", output: "root" }
];

async function typeTerminal() {
    const termBody = document.getElementById('term-body');
    if(!termBody) return;
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
    if(termSection && !terminalAnimated) {
        const rect = termSection.getBoundingClientRect();
        if(rect.top < window.innerHeight - 100) {
            terminalAnimated = true;
            typeTerminal();
        }
    }
});

// Decryption Effect for Contact Section
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$*&%';
const btnDecrypt = document.getElementById('btn-decrypt');
const encryptedNodes = document.querySelectorAll('.encrypted-data');

if (btnDecrypt) {
    btnDecrypt.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        this.querySelector('span').textContent = 'DECRYPTION COMPLETE';
        
        encryptedNodes.forEach(node => {
            const valueSpan = node.querySelector('.node-value');
            const finalValue = node.getAttribute('data-value');
            const originalLength = valueSpan.textContent.length;
            const targetLength = finalValue.length;
            
            let iterations = 0;
            const maxIterations = 20;
            
            const interval = setInterval(() => {
                let currentText = '';
                const displayLength = Math.max(originalLength, targetLength);
                
                for(let i=0; i<displayLength; i++) {
                    if (i < iterations / maxIterations * targetLength) {
                        currentText += finalValue[i] || '';
                    } else {
                        currentText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                
                valueSpan.textContent = currentText;
                
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    valueSpan.textContent = finalValue;
                    valueSpan.classList.add('decrypted-text');
                }
                
                iterations += 1;
            }, 50);
        });
    });
}

// Click Spark Effect
document.addEventListener('click', (e) => {
    // Only trigger if not clicking a link to avoid overriding navigation
    if(e.target.closest('a') && !e.target.closest('.contact-node')) return;

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

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');
const mobileNavLinks = navMenu ? navMenu.querySelectorAll('a') : [];

if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent closing immediately
        navMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            navMenu.classList.remove('open');
            document.body.classList.remove('menu-open');
        }
    });
}

// Canvas Background Network
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.5)'; // Money green
            ctx.fill();
        }
    }
    
    function initCanvas() {
        resize();
        window.addEventListener('resize', resize);
        
        const numParticles = Math.min(Math.floor(window.innerWidth / 15), 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
        
        animate();
    }
    
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        const heroSection = document.getElementById('home');
        if (window.scrollY > heroSection.offsetHeight) return; // Optimize
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(34, 197, 94, ${0.15 - dist/800})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            if (mouse.x != null && mouse.y != null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(251, 191, 36, ${0.2 - dist/750})`; // Gold connections
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }
    
    initCanvas();
}
