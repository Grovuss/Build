document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = {
        home: document.getElementById('home'),
        builds: document.getElementById('builds')
    };
    const buildsList = document.getElementById('builds-list');
    const buildsMain = document.querySelector('.builds-main');

    // --- Theme Switcher ---
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme based on saved preference, or OS preference, or default to dark
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'light';
    } else {
        if (prefersDark) {
            body.setAttribute('data-theme', 'dark');
            themeToggle.checked = false;
        } else {
            body.setAttribute('data-theme', 'light');
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- Simple Page Navigation ---
    const showSection = (id) => {
        Object.values(sections).forEach(section => {
            if (section) section.style.display = 'none';
        });
        if (sections[id]) {
            sections[id].style.display = 'block';
        }

        // Update active tab
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            window.location.hash = targetId;
        });
    });

    // --- Build Data & Sidebar ---
    // Remove the local builds array and use the imported one

    // Load builds from builds.js
    const script = document.createElement('script');
    script.src = 'builds.js';
    script.onload = () => {
        const builds = getBuilds();
        
        builds.forEach(build => {
            const li = document.createElement('li');
            li.className = 'build-item';
            li.dataset.buildId = build.id;
            li.textContent = build.name;
            li.addEventListener('click', () => selectBuild(build));
            buildsList.appendChild(li);
        });
    };
    document.head.appendChild(script);

    const selectBuild = (build) => {
        document.querySelectorAll('.build-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`.build-item[data-build-id="${build.id}"]`).classList.add('active');

        let imagesHtml = '';
        if (build.images && build.images.length > 0) {
            imagesHtml = `
                <div class="build-images">
                    ${build.images.map((img, index) => `
                        <img src="${img}" alt="${build.name} preview ${index + 1}" loading="lazy">
                    `).join('')}
                </div>
            `;
        }

        let tagsHtml = '';
        if (build.tags && build.tags.length > 0) {
            tagsHtml = `
                <div class="build-tags">
                    ${build.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
        }

        const downloadCount = localStorage.getItem(`downloads_${build.id}`) || 0;
        
        // Convert markdown to HTML
        const descriptionHtml = marked.parse(build.description);
        
        buildsMain.innerHTML = `
            <div class="build-header">
                <h2>${build.name}</h2>
                ${tagsHtml}
            </div>
            ${imagesHtml}
            <div class="build-description">
                ${descriptionHtml}
            </div>
            <div class="download-section">
                <button class="download-btn" data-build-id="${build.id}">
                    <span>Download</span>
                </button>
            </div>
        `;

        // Add event listeners for image click
        const images = buildsMain.querySelectorAll('.build-images img');
        images.forEach(img => {
            img.addEventListener('click', () => openModal(img.src));
        });

        // Add event listener for download button
        const downloadBtn = buildsMain.querySelector('.download-btn');
        downloadBtn.addEventListener('click', () => handleDownload(build.id, build.downloadUrl));
    };

    const handleDownload = (buildId, url) => {
        if (url && url !== '#') {
            window.open(url, '_blank');
        }
    };

    // Modal functionality
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close');

    function openModal(src) {
        modal.style.display = 'block';
        modalImg.src = src;
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Show initial section based on URL hash or default to home
    const currentHash = window.location.hash.substring(1);
    if (currentHash && sections[currentHash]) {
        showSection(currentHash);
    } else {
        showSection('home');
    }
});