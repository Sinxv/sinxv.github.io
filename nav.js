document.addEventListener("DOMContentLoaded", () => {
    // Overlay for mobile menu
    const overlay = document.createElement("div");
    overlay.id = "nav-overlay";
    document.body.appendChild(overlay);

    // Language-aware nav labels
    function getNavLabels() {
        const lang = localStorage.getItem("elhelper-lang") || "en";
        const labels = {
            en: { home: "Home", progression: "Game Progression", guides: "Guides" },
            es: { home: "Inicio", progression: "Progresión del Juego", guides: "Guías" }
        };
        return labels[lang] || labels.en;
    }

    function updateNavigationLabels() {
        const labels = getNavLabels();
        const desktopHome = navDesktop.querySelector('a[href="/index.html"] li');
        const desktopProgression = navDesktop.querySelector('a[href="/prog.html"] li');
        const desktopGuides = navDesktop.querySelector('a[href="/guides.html"] li');
        if (desktopHome) desktopHome.textContent = labels.home;
        if (desktopProgression) desktopProgression.textContent = labels.progression;
        if (desktopGuides) desktopGuides.textContent = labels.guides;

        const mobileHome = navMobile.querySelector('a[href="/main/index.html"] li');
        const mobileProgression = navMobile.querySelector('a[href="/main/prog.html"] li');
        const mobileGuides = navMobile.querySelector('a[href="/main/guides.html"] li');
        if (mobileHome) mobileHome.textContent = labels.home;
        if (mobileProgression) mobileProgression.textContent = labels.progression;
        if (mobileGuides) mobileGuides.textContent = labels.guides;
    }

    // Desktop nav
    const navDesktop = document.createElement("nav");
    navDesktop.id = "main-nav-desktop";
    const labels = getNavLabels();
    navDesktop.innerHTML = `
      <ul>
        <a href="/index.html"><li>${labels.home}</li></a>
        <a href="/prog.html"><li id="spec">${labels.progression}</li></a>
        <a href="/guides.html"><li>${labels.guides}</li></a>
        <div class="settings-icon" id="settings-icon-desktop"></div>
      </ul>
    `;
    document.body.prepend(navDesktop);

    // Mobile nav (hamburger)
    const navMobile = document.createElement("nav");
    navMobile.id = "main-nav-mobile";
    navMobile.innerHTML = `
    <div class="menu-bar">
        <div class="menu-icon" id="menu-icon"></div>
    </div>
    <div class="hamburger-nav" id="hamburger-nav">
        <div class="settings-icon" id="settings-icon-mobile"></div>
        <a href="/main/index.html"><li>${labels.home}</li></a>
        <a href="/main/prog.html"><li id="spec">${labels.progression}</li></a>
        <a href="/main/guides.html"><li>${labels.guides}</li></a>
    </div>
`;
    document.body.prepend(navMobile);

    updateNavigationLabels();

    // Settings icon positions
    document.getElementById("settings-icon-desktop").style.position = "absolute";
    document.getElementById("settings-icon-desktop").style.right = "25px";
    document.getElementById("settings-icon-desktop").style.top = "14px";
    document.getElementById("settings-icon-desktop").style.zIndex = "101";

    document.getElementById("settings-icon-mobile").style.position = "fixed";
    document.getElementById("settings-icon-mobile").style.right = "25px";
    document.getElementById("settings-icon-mobile").style.top = "22px";
    document.getElementById("settings-icon-mobile").style.zIndex = "1002";

    // Hamburger menu logic
    const menuIcon = document.getElementById("menu-icon");
    const hamburgerNav = document.getElementById("hamburger-nav");
    menuIcon.addEventListener("click", () => {
        try {
            const menuBar = document.querySelector('.menu-bar');
            if (hamburgerNav.classList.contains("open")) {
                hamburgerNav.classList.remove("open");
                overlay.classList.remove("open");
                document.body.style.overflow = "";
                menuBar.classList.remove('no-pointer');
            } else {
                hamburgerNav.classList.add("open");
                overlay.classList.add("open");
                document.body.style.overflow = "hidden";
                menuBar.classList.add('no-pointer');
                Array.from(hamburgerNav.children).forEach((el, i) => {
                    el.style.setProperty('--delay', `${0.1 + i * 0.08}s`);
                });
            }
        } catch (err) {
            console.error('[ERROR] menuIcon click handler:', err);
        }
    });
    overlay.addEventListener("click", () => {
        try {
            hamburgerNav.classList.remove("open");
            overlay.classList.remove("open");
            document.body.style.overflow = "";
            const menuBar = document.querySelector('.menu-bar');
            menuBar.classList.remove('no-pointer');
        } catch (err) {
            console.error('[ERROR] overlay click handler:', err);
        }
    });

    // Show/hide navs depending on screen size
    function handleNavVisibility() {
        try {
            if (window.innerWidth <= 900) {
                navDesktop.style.display = "none";
                navMobile.style.display = "block";
            } else {
                navDesktop.style.display = "block";
                navMobile.style.display = "none";
                hamburgerNav.classList.remove("open");
                overlay.classList.remove("open");
                document.body.style.overflow = "";
            }
        } catch (err) {
            console.error('[ERROR] handleNavVisibility:', err);
        }
    }
    window.addEventListener("resize", handleNavVisibility);
    handleNavVisibility();

    // Settings popup logic (shared for both icons)
    function updateGearIcon() {
        const isLight = localStorage.getItem("elhelper-mode") === "light";
        document.getElementById("settings-icon-desktop").style.backgroundImage = `url('/images/gear-${isLight ? 'black' : 'white'}.png')`;
        document.getElementById("settings-icon-desktop").style.backgroundColor = isLight ? "#fff" : "#222";
        navDesktop.style.backgroundColor = isLight ? "#fff" : "#282832";
        document.getElementById("settings-icon-mobile").style.backgroundImage = `url('/images/gear-${isLight ? 'black' : 'white'}.png')`;
        document.getElementById("settings-icon-mobile").style.backgroundColor = isLight ? "#fff" : "#222";
    }
    
    function updateMenuIcon() {
        const isLight = localStorage.getItem("elhelper-mode") === "light";
        menuIcon.style.backgroundImage = `url('/images/menu-${isLight ? 'black' : 'white'}.png')`;
        menuIcon.style.width = "40px";
        menuIcon.style.height = "40px";
        menuIcon.style.backgroundSize = "contain";
        menuIcon.style.backgroundRepeat = "no-repeat";
        menuIcon.style.backgroundColor = isLight ? "#cccccc" : "#282832";
    }
    
    updateMenuIcon();
    updateGearIcon();

    window.addEventListener("storage", (e) => {
        if (e.key === "elhelper-mode") {
            updateMenuIcon();
            updateGearIcon();
        }
    });
    document.getElementById("mode-switch")?.addEventListener("change", () => {
        updateMenuIcon();
        updateGearIcon();
    });

    // Helper function to get shared settings HTML
    function getSettingsHTML() {
        const savedLang = localStorage.getItem("elhelper-lang") || "en";
        const isLight = localStorage.getItem("elhelper-mode") === "light";
        const savedRegion = localStorage.getItem("elhelper-region") || "na";
        const showFullInfo = window.isFullInfoEnabled?.() ?? false;
        
        return `
            <label for="lang-select">Language:</label>
            <select id="lang-select">
                <option value="en" ${savedLang === 'en' ? 'selected' : ''}>English</option>
                <option value="es" ${savedLang === 'es' ? 'selected' : ''}>Español</option>
                <option value="kr" disabled ${savedLang === 'kr' ? 'selected' : ''}>한국어 (WIP)</option>
                <option value="jp" disabled ${savedLang === 'jp' ? 'selected' : ''}>日本語 (WIP)</option>
                <option value="br" disabled ${savedLang === 'br' ? 'selected' : ''}>Português (WIP)</option>
            </select>
            
            <label for="region-select">Server Region:</label>
            <select id="region-select">
                <option value="na" ${savedRegion === 'na' ? 'selected' : ''}>Default (NA/INT)</option>
                <option value="default" ${savedRegion === 'default' ? 'selected' : ''}>Others (KR/EU/JP/CN/TW)</option>
            </select>
            
            <label for="mode-switch">Light Mode:</label>
            <label class="switch">
                <input type="checkbox" id="mode-switch" ${isLight ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
            
            <label for="full-info-switch">Show Full Info:</label>
            <label class="switch">
                <input type="checkbox" id="full-info-switch" ${showFullInfo ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        `;
    }

    // Helper function to bind settings events
    function bindSettingsEvents(container) {
        const langSelect = container.querySelector("#lang-select");
        const regionSelect = container.querySelector("#region-select");
        const modeSwitch = container.querySelector("#mode-switch");
        const fullInfoSwitch = container.querySelector("#full-info-switch");
        
        if (langSelect) {
            langSelect.addEventListener("change", (e) => {
                const lang = e.target.value;
                if (window.translationManager) {
                    window.translationManager.switchLanguage(lang);
                }
            });
        }
        
        if (regionSelect) {
            regionSelect.addEventListener("change", (e) => {
                const region = e.target.value;
                localStorage.setItem("elhelper-region", region);
                
                // Re-apply translations
                if (window.translationManager) {
                    window.translationManager.applyTranslations();
                }
                
                // Re-open any open guide to apply region filter
                const openOverlay = document.getElementById('guide-modal-overlay');
                if (openOverlay) {
                    const hash = window.location.hash.replace('#', '');
                    if (hash && window.openGuide) {
                        window.openGuide(hash);
                    }
                }
            });
        }
        
        if (modeSwitch) {
            modeSwitch.addEventListener("change", (e) => {
                const isLight = e.target.checked;
                localStorage.setItem("elhelper-mode", isLight ? "light" : "dark");
                if (isLight) {
                    document.body.classList.add("light-mode");
                } else {
                    document.body.classList.remove("light-mode");
                }
                updateMenuIcon();
                updateGearIcon();
            });
        }
        
        if (fullInfoSwitch) {
            fullInfoSwitch.addEventListener("change", (e) => {
                const showFull = e.target.checked;
                if (window.toggleFullInfo) {
                    window.toggleFullInfo(showFull);
                }
            });
        }
    }

    // SETTINGS POPUP PC ver.
    function showSettingsPopupPC() {
        const existing = document.getElementById("settings-popup");
        if (existing) {
            existing.remove();
            return;
        }
        
        const desktopIcon = document.getElementById("settings-icon-desktop");
        const popup = document.createElement("div");
        popup.id = "settings-popup";
        popup.innerHTML = getSettingsHTML();
        document.body.appendChild(popup);
        
        // Position popup
        const rect = desktopIcon.getBoundingClientRect();
        const popupWidth = 280;
        let left = rect.right - popupWidth - 8;
        let top = rect.bottom + 8;
        if (left < 8) left = 8;
        if (left + popupWidth > window.innerWidth - 8) left = window.innerWidth - popupWidth - 8;
        popup.style.position = "fixed";
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.style.maxHeight = "calc(100vh - 100px)";
        popup.style.overflowY = "auto";
        
        // Bind events
        bindSettingsEvents(popup);
    }

    // SETTINGS POPUP MOBILE ver.
    function toggleSettingsMenuMobile() {
        try {
            const hamburgerNav = document.getElementById("hamburger-nav");
            let settingsMenu = hamburgerNav.querySelector('.settings-menu');
            
            if (hamburgerNav.classList.contains("open") && !hamburgerNav.classList.contains("settings-open")) {
                hamburgerNav.classList.add("menu-slide-out");
                setTimeout(() => {
                    hamburgerNav.classList.remove("menu-slide-out");
                    hamburgerNav.classList.add("settings-open");
                    if (!settingsMenu) {
                        let menu = document.createElement("div");
                        menu.className = "settings-menu";
                        menu.innerHTML = getSettingsHTML();
                        hamburgerNav.appendChild(menu);
                        bindSettingsEvents(menu);
                    } else {
                        settingsMenu.style.display = 'flex';
                    }
                }, 350);
            } else if (hamburgerNav.classList.contains("settings-open")) {
                hamburgerNav.classList.add("menu-slide-in");
                setTimeout(() => {
                    hamburgerNav.classList.remove("settings-open");
                    hamburgerNav.classList.remove("menu-slide-in");
                    if (settingsMenu) settingsMenu.remove();
                }, 350);
            } else {
                hamburgerNav.classList.add("open");
                overlay.classList.add("open");
                document.body.style.overflow = "hidden";
                Array.from(hamburgerNav.children).forEach((el, i) => {
                    el.style.setProperty('--delay', `${0.1 + i * 0.08}s`);
                });
                setTimeout(() => {
                    try {
                        toggleSettingsMenuMobile();
                    } catch (err) {
                        console.error('[ERROR] setTimeout toggleSettingsMenuMobile:', err);
                    }
                }, 350);
            }
        } catch (err) {
            console.error('[ERROR] toggleSettingsMenuMobile:', err);
        }
    }

    // --- EVENT BINDINGS ---
    document.getElementById("settings-icon-desktop").addEventListener("click", () => {
        try {
            if (window.innerWidth > 900) {
                showSettingsPopupPC();
            }
        } catch (err) {
            console.error('[ERROR] settings-icon-desktop click handler:', err);
        }
    });
    
    document.getElementById("settings-icon-mobile").addEventListener("click", () => {
        try {
            if (window.innerWidth <= 900) {
                toggleSettingsMenuMobile();
            }
        } catch (err) {
            console.error('[ERROR] settings-icon-mobile click handler:', err);
        }
    });

    // Close PC popup when clicking outside
    document.addEventListener("click", (e) => {
        const popup = document.getElementById("settings-popup");
        if (popup && !popup.contains(e.target) &&
            !document.getElementById("settings-icon-desktop").contains(e.target)) {
            popup.remove();
        }
    });
});