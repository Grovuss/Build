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
        // Fade out current section
        Object.values(sections).forEach(section => {
            if (section && section.style.display !== 'none') {
                section.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    section.style.display = 'none';
                }, 300);
            }
        });
        
        // Fade in new section
        setTimeout(() => {
            if (sections[id]) {
                sections[id].style.display = 'block';
                sections[id].style.animation = 'fadeInUp 0.6s ease forwards';
            }
        }, 300);

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

    // Add CTA button listener
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = ctaButton.dataset.section;
            showSection(targetId);
            window.location.hash = targetId;
        });
    }

    // --- Build Data & Sidebar ---
    // Remove the local builds array and use the imported one

    // Load builds from builds.js
    const script = document.createElement('script');
    script.src = 'builds.js';
    script.onload = () => {
        const builds = getBuilds();
        
        // Organize tags by category
        const mainCategories = ['Game', 'Movie', 'Show', 'Other'];
        const titlesByCategory = {};
        const generalTags = new Set();
        
        builds.forEach(build => {
            const mainCat = build.tags.find(tag => mainCategories.includes(tag));
            const title = build.tags.find(tag => !mainCategories.includes(tag) && !['Sandbox', 'Recreation', 'Adventure', 'Survival'].includes(tag));
            const general = build.tags.filter(tag => ![mainCat, title].includes(tag));
            
            if (mainCat && title) {
                if (!titlesByCategory[mainCat]) titlesByCategory[mainCat] = new Set();
                titlesByCategory[mainCat].add(title);
            }
            
            general.forEach(tag => generalTags.add(tag));
        });
        
        // Populate main category filter
        const mainCategoryFilter = document.getElementById('main-category-filter');
        mainCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            mainCategoryFilter.appendChild(option);
        });
        
        // Populate general filter
        const generalFilter = document.getElementById('general-filter');
        [...generalTags].sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            generalFilter.appendChild(option);
        });
        
        // Initial render
        renderBuilds(builds);
        
        // Add search and filter listeners
        const searchInput = document.getElementById('search-input');
        const mainCatSelect = document.getElementById('main-category-filter');
        const titleSelect = document.getElementById('title-filter');
        const generalSelect = document.getElementById('general-filter');
        
        function updateTitleFilter() {
            const selectedMain = mainCatSelect.value;
            titleSelect.innerHTML = '<option value="">All Titles</option>';
            
            if (selectedMain && titlesByCategory[selectedMain]) {
                titleSelect.style.display = 'block';
                [...titlesByCategory[selectedMain]].sort().forEach(title => {
                    const option = document.createElement('option');
                    option.value = title;
                    option.textContent = title;
                    titleSelect.appendChild(option);
                });
            } else {
                titleSelect.style.display = 'none';
            }
        }
        
        function filterBuilds() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedMain = mainCatSelect.value;
            const selectedTitle = titleSelect.value;
            const selectedGeneral = generalSelect.value;
            
            const filteredBuilds = builds.filter(build => {
                const matchesSearch = build.name.toLowerCase().includes(searchTerm) ||
                                    build.description.toLowerCase().includes(searchTerm);
                
                const mainCat = build.tags.find(tag => mainCategories.includes(tag));
                const title = build.tags.find(tag => !mainCategories.includes(tag) && !['Sandbox', 'Recreation', 'Adventure', 'Survival'].includes(tag));
                
                const matchesMain = !selectedMain || mainCat === selectedMain;
                const matchesTitle = !selectedTitle || title === selectedTitle;
                const matchesGeneral = !selectedGeneral || build.tags.includes(selectedGeneral);
                
                return matchesSearch && matchesMain && matchesTitle && matchesGeneral;
            });
            
            renderBuilds(filteredBuilds);
        }
        
        mainCatSelect.addEventListener('change', () => {
            updateTitleFilter();
            filterBuilds();
        });
        
        titleSelect.addEventListener('change', filterBuilds);
        generalSelect.addEventListener('change', filterBuilds);
        searchInput.addEventListener('input', filterBuilds);
    };
    document.head.appendChild(script);

    function renderBuilds(buildsToRender) {
        buildsList.innerHTML = '';
        buildsToRender.forEach((build, index) => {
            const li = document.createElement('li');
            li.className = 'build-item';
            li.dataset.buildId = build.id;
            li.style.setProperty('--index', index);
            
            // Categorize tags for display
            const typeTags = ['Game', 'Movie', 'Show', 'Other'];
            const typeTag = build.tags.find(tag => typeTags.includes(tag));
            const titleTag = build.tags.find(tag => !typeTags.includes(tag) && !['Sandbox', 'Recreation', 'Adventure', 'Survival'].includes(tag));
            const generalTags = build.tags.filter(tag => ![typeTag, titleTag].includes(tag));

            // Create tag elements
            const tagsHtml = [
                typeTag ? `<span class="build-item-tag" data-type="${typeTag}">${typeTag}</span>` : '',
                titleTag ? `<span class="build-item-tag" data-type="title">${titleTag}</span>` : '',
                ...generalTags.map(tag => `<span class="build-item-tag">${tag}</span>`)
            ].join('');

            li.innerHTML = `
                <img src="${build.images[0]}" alt="${build.name} preview" class="build-item-preview">
                <div class="build-item-content">
                    <div class="build-item-name">${build.name}</div>
                    <div class="build-item-tags">${tagsHtml}</div>
                </div>
            `;
            
            li.addEventListener('click', () => selectBuild(build));
            buildsList.appendChild(li);
        });
    }

    // Add CSS for fadeOut
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

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

        // Categorize tags
        const typeTags = ['Game', 'Movie', 'Show', 'Other'];
        const typeTag = build.tags.find(tag => typeTags.includes(tag));
        const titleTag = build.tags.find(tag => !typeTags.includes(tag) && !['Sandbox', 'Recreation', 'Adventure', 'Survival'].includes(tag));
        const generalTags = build.tags.filter(tag => ![typeTag, titleTag].includes(tag));

        let tagsHtml = '';
        if (build.tags && build.tags.length > 0) {
            tagsHtml = `
                <div class="build-tags">
                    ${typeTag ? `<span class="tag" data-type="${typeTag}">${typeTag}</span>` : ''}
                    ${titleTag ? `<span class="tag" data-type="title">${titleTag}</span>` : ''}
                    ${generalTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
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
        const imageSrcs = Array.from(images).map(img => img.src);
        images.forEach(img => {
            img.addEventListener('click', () => openModal(img.src, imageSrcs));
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

    let currentImages = [];
    let currentIndex = 0;

    function openModal(src, images = []) {
        currentImages = images;
        currentIndex = images.indexOf(src);
        modal.style.display = 'block';
        modalImg.src = src;
        modalImg.className = 'modal-content';
        updateArrows();
    }

    function updateArrows() {
        let prevArrow = modal.querySelector('.arrow-left');
        let nextArrow = modal.querySelector('.arrow-right');
        
        if (currentImages.length <= 1) {
            if (prevArrow) prevArrow.remove();
            if (nextArrow) nextArrow.remove();
            return;
        }

        if (!prevArrow) {
            prevArrow = document.createElement('span');
            prevArrow.className = 'arrow-left';
            prevArrow.innerHTML = '&#10094;';
            prevArrow.onclick = (e) => {
                e.stopPropagation();
                navigateImage(-1);
            };
            modal.appendChild(prevArrow);
        }

        if (!nextArrow) {
            nextArrow = document.createElement('span');
            nextArrow.className = 'arrow-right';
            nextArrow.innerHTML = '&#10095;';
            nextArrow.onclick = (e) => {
                e.stopPropagation();
                navigateImage(1);
            };
            modal.appendChild(nextArrow);
        }

        prevArrow.style.display = currentIndex === 0 ? 'none' : 'block';
        nextArrow.style.display = currentIndex === currentImages.length - 1 ? 'none' : 'block';
    }

    function navigateImage(direction) {
        const oldIndex = currentIndex;
        currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
        
        // Determine swipe direction
        const swipeOutClass = direction > 0 ? 'swipe-out-left' : 'swipe-out-right';
        const swipeInClass = direction > 0 ? 'swipe-in-right' : 'swipe-in-left';
        
        // Animate out current image
        modalImg.className = `modal-content ${swipeOutClass}`;
        
        setTimeout(() => {
            // Change image and position off-screen
            modalImg.src = currentImages[currentIndex];
            modalImg.className = `modal-content ${swipeInClass}`;
            
            // Force reflow
            modalImg.offsetHeight;
            
            // Animate in new image
            modalImg.className = 'modal-content swipe-in-center';
            updateArrows();
        }, 200);
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    window.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') navigateImage(-1);
            if (e.key === 'ArrowRight') navigateImage(1);
            if (e.key === 'Escape') modal.style.display = 'none';
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