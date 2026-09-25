import { data } from '/EHD.js';

const translations = data.translations;
const RICH_COLOR_NAMES = new Set([
    'warn', 'danger', 'info', 'success', 'mute', 'dps', 'heal', 'tank'
]);

// Enhanced Translation Manager
class TranslationManager {
    constructor() {
        this.currentLang = localStorage.getItem('elhelper-lang') || 'en';
        this.previousScrollY = 0;
        this.previousHash = '';
        this.activeTargetId = null;
        this.isBackButtonActive = false;
        this.glossaryEntries = this.buildGlossaryEntries();
        this.glossaryTooltip = null;
        this._inlineImgRegistry = new Map();
        this._inlineImgCounter = 0;
        this._currentBaseObject = null;
        document.documentElement.lang = this.currentLang;
        this.setupGlossaryTooltipHandlers();
        this.setupRichTipHandlers();
    }

    _registerInlineImg(imgData) {
        const id = `inline-img-${++this._inlineImgCounter}`;
        this._inlineImgRegistry.set(id, imgData);
        return id;
    }

    _resolveInlineImg(id) {
        return this._inlineImgRegistry.get(id);
    }

    getObjectByPathFromBase(key, base) {
        const keys = key.split('.');
        let value = base;
        for (const k of keys) {
            if (!value || typeof value !== 'object' || !(k in value)) return null;
            value = value[k];
        }
        return value;
    }

    renderWithBase(value, baseObject, container = null) {
        const prev = this._currentBaseObject;
        this._currentBaseObject = baseObject;
        try {
            return this.renderRichText(value, container);
        } finally {
            this._currentBaseObject = prev;
        }
    }

    findBaseObjectForKey(key) {
        const parts = key.split('.');
        
        // 1. Try the key itself
        const self = this.getObjectByPath(key);
        if (self && typeof self === 'object' && self.img) {
            return self;
        }
        
        // 2. Walk up the tree
        for (let drop = 1; drop <= 5; drop++) {
            const candidateKey = parts.slice(0, parts.length - drop).join('.');
            if (!candidateKey) continue;
            const candidate = this.getObjectByPath(candidateKey);
            if (candidate && typeof candidate === 'object' && candidate.img) {
                return candidate;
            }
        }
        return null;
    }

    applyTranslations(context = document) {
        this.translateElements(context);
    }

    setupRichTipHandlers() {
        document.addEventListener('mouseover', (event) => {
            const tip = event.target.closest('.rich-tip');
            if (tip) this.showRichTip(tip, event);
        });

        document.addEventListener('mousemove', (event) => {
            const tip = event.target.closest('.rich-tip');
            if (tip) this.updateRichTipPosition(event.clientX, event.clientY);
        });

        document.addEventListener('mouseout', (event) => {
            const tip = event.target.closest('.rich-tip');
            if (tip && (!event.relatedTarget || !event.relatedTarget.closest || !event.relatedTarget.closest('.rich-tip'))) {
                this.hideRichTip();
            }
        });

        // Touch / keyboard support
        document.addEventListener('focusin', (event) => {
            const tip = event.target.closest('.rich-tip');
            if (tip) {
                const rect = tip.getBoundingClientRect();
                this.showRichTipAt(tip, rect.left + rect.width / 2, rect.bottom);
            }
        });
        document.addEventListener('focusout', (event) => {
            if (event.target.closest && event.target.closest('.rich-tip')) {
                this.hideRichTip();
            }
        });
    }

    createRichTip() {
        if (!this.richTip) {
            this.richTip = document.createElement('div');
            this.richTip.className = 'rich-tip-tooltip';
            document.body.appendChild(this.richTip);
        }
        return this.richTip;
    }

    showRichTip(el, event) {
        this.showRichTipAt(el, event.clientX, event.clientY);
    }

    showRichTipAt(el, x, y) {
        const tooltip = this.createRichTip();
        const text = el.dataset.tip || '';
        if (!text) { this.hideRichTip(); return; }

        // Run through mini-markdown so !!bold!!, @@colors@@, etc. work
        tooltip.innerHTML = this.parseMiniMarkdown(text);
        this.updateRichTipPosition(x, y);
        tooltip.classList.add('is-visible');
    }

    updateRichTipPosition(x, y) {
        const tooltip = this.createRichTip();
        tooltip.style.left = `${x + 12}px`;
        tooltip.style.top = `${y + 12}px`;
    }

    hideRichTip() {
        if (this.richTip) {
            this.richTip.classList.remove('is-visible');
        }
    }

    createBackButton() {
        let button = document.getElementById('anchor-return-button');
        if (button) {
            return button;
        }

        button = document.createElement('button');
        button.id = 'anchor-return-button';
        button.type = 'button';
        button.className = 'anchor-return-button';
        button.textContent = 'Back';
        button.setAttribute('aria-label', 'Return to previous position');
        button.addEventListener('click', () => this.returnToPreviousPosition());
        document.body.appendChild(button);
        return button;
    }

    showBackButton() {
        const button = this.createBackButton();
        this.isBackButtonActive = true;
        button.classList.add('is-visible');
    }

    hideBackButton() {
        const button = document.getElementById('anchor-return-button');
        this.isBackButtonActive = false;
        if (button) {
            button.classList.remove('is-visible');
        }
    }

    isElementVisible(element) {
        if (!element) {
            return false;
        }

        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.bottom >= 0 && rect.top <= viewportHeight;
    }

    updateBackButtonVisibility() {
        const button = document.getElementById('anchor-return-button');
        if (!button || !this.activeTargetId || !this.isBackButtonActive) {
            return;
        }

        const target = document.getElementById(this.activeTargetId);
        if (!target) {
            this.hideBackButton();
            return;
        }

        const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const returnedToOrigin = Math.abs(currentScrollY - this.previousScrollY) < 5;

        if (returnedToOrigin || !this.isElementVisible(target)) {
            this.hideBackButton();
            return;
        }

        button.classList.add('is-visible');
    }

    positionBackButtonForTarget(target) {
        const button = this.createBackButton();
        const targetTop = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0);
        const shouldPositionBottom = targetTop < this.previousScrollY;

        button.classList.toggle('is-bottom', shouldPositionBottom);
        button.classList.toggle('is-top', !shouldPositionBottom);
    }

    returnToPreviousPosition() {
        window.scrollTo({ top: this.previousScrollY, behavior: 'smooth' });
        const nextUrl = this.previousHash
            ? `${window.location.pathname}${window.location.search}${this.previousHash}`
            : `${window.location.pathname}${window.location.search}`;
        history.replaceState(null, '', nextUrl);
        this.hideBackButton();
    }

    handleAnchorClick(event) {
        const link = event.target.closest('a[href^="#"]');
        if (!link) {
            return;
        }

        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        this.previousScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        this.previousHash = window.location.hash;
        this.activeTargetId = targetId;
        this.showBackButton();
        this.positionBackButtonForTarget(target);

        history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${targetId}`);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderImageValue(value) {
        if (window.renderGenericImage) {
            return window.renderGenericImage(value);
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'guide-image-group';
        
        // `ico` and any image with `inline: true` are ONLY rendered via [pic:] tokens.
        const layers = ['primary', 'secondary', 'tertiary', 'normal', 'small'];
        
        layers.forEach(layer => {
            const layerData = value[layer];
            if (!layerData) return;
            
            const layerContainer = document.createElement('div');
            layerContainer.className = `image-layer image-layer-${layer}`;
            
            const images = Array.isArray(layerData) ? layerData : [layerData];
            images.forEach(imgData => {
                // Skip inline-only images
                if (imgData && typeof imgData === 'object' && imgData.inline === true) {
                    return;
                }
                
                const figure = document.createElement('figure');
                figure.className = 'guide-image-figure';
                
                let src, altText, captionType, floatSide, floatWidth;
                if (typeof imgData === 'string') {
                    src = imgData;
                    altText = '';
                    captionType = 'default';
                } else {
                    src = imgData.src;
                    altText = this.getLocalizedValue(imgData.alt) || (imgData.alt?.en || '');
                    captionType = imgData.captionType || 'default';
                    floatSide = imgData.float || null;
                    floatWidth = imgData.width || null;
                }
                
                if (!src) return;
                
                if (floatSide === 'left') figure.classList.add('image-float-left');
                else if (floatSide === 'right') figure.classList.add('image-float-right');
                
                if (floatWidth) figure.style.width = floatWidth;
                
                const img = document.createElement('img');
                img.src = src;
                img.alt = altText;
                img.className = 'guide-image';
                img.loading = 'lazy';
                if (floatWidth) {
                    img.style.width = '100%';
                    img.style.height = 'auto';
                }
                img.addEventListener('click', () => {
                    if (window.openImageLightbox) window.openImageLightbox(src, altText);
                });
                figure.appendChild(img);
                
                if (altText) {
                    const caption = document.createElement('figcaption');
                    caption.className = 'guide-image-caption';
                    if (captionType === 'quote') {
                        caption.textContent = `"${altText}"`;
                        caption.classList.add('caption-quote');
                    } else {
                        caption.textContent = altText;
                    }
                    figure.appendChild(caption);
                }
                
                layerContainer.appendChild(figure);
            });
            
            // Only append if we actually added something
            if (layerContainer.children.length > 0) {
                wrapper.appendChild(layerContainer);
            }
        });
        
        return wrapper;
    }

    renderInlineFloatImage(imgData) {
        // imgData = { primary: [{ src, float, width, alt, captionType }] }
        // Pick the first image from the first layer, or handle multiple
        const layers = ['primary', 'secondary', 'tertiary', 'ico', 'normal', 'small'];
        const figures = [];

        for (const layer of layers) {
            const arr = imgData[layer];
            if (!arr) continue;
            const images = Array.isArray(arr) ? arr : [arr];
            for (const raw of images) {
                let src, altText, captionType, floatSide, floatWidth;
                if (typeof raw === 'string') {
                    src = raw;
                    altText = '';
                    captionType = 'default';
                } else {
                    src = raw.src;
                    altText = this.getLocalizedValue(raw.alt) || (raw.alt?.en || '');
                    captionType = raw.captionType || 'default';
                    floatSide = raw.float || null;
                    floatWidth = raw.width || null;
                }
                if (!src) continue;

                const figure = document.createElement('figure');
                figure.className = 'guide-image-figure';
                if (floatSide === 'left') figure.classList.add('image-float-left');
                else if (floatSide === 'right') figure.classList.add('image-float-right');

                if (floatWidth) figure.style.width = floatWidth;

                const img = document.createElement('img');
                img.src = src;
                img.alt = altText;
                img.className = 'guide-image';
                img.loading = 'lazy';
                img.addEventListener('click', () => {
                    if (window.openImageLightbox) window.openImageLightbox(src, altText);
                });
                figure.appendChild(img);

                if (altText) {
                    const caption = document.createElement('figcaption');
                    caption.className = 'guide-image-caption';
                    if (captionType === 'quote') {
                        caption.textContent = `"${altText}"`;
                        caption.classList.add('caption-quote');
                    } else {
                        caption.textContent = altText;
                    }
                    figure.appendChild(caption);
                }
                figures.push(figure);
            }
        }

        const frag = document.createDocumentFragment();
        figures.forEach(f => frag.appendChild(f));
        return frag;
    }

    _registerInlineImg(imgData) {
        const id = `inline-img-${++this._inlineImgCounter}`;
        this._inlineImgRegistry.set(id, imgData);
        return id;
    }

    _resolveInlineImg(id) {
        return this._inlineImgRegistry.get(id);
    }

    // Wrapper to render with a base object
    renderWithBase(value, baseObject, container = null) {
        const prev = this._currentBaseObject;
        this._currentBaseObject = baseObject;
        try {
            return this.renderRichText(value, container);
        } finally {
            this._currentBaseObject = prev;
        }
    }

    getLocalizedValue(value) {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value.map(v => this.getLocalizedValue(v)).join(' ');
        if (typeof value === 'object') {
            return value[this.currentLang] || value.en || '';
        }
        return String(value);
    }

    setupGlossaryTooltipHandlers() {
        document.addEventListener('mouseover', (event) => {
            const term = event.target.closest('.glossary-term');
            if (term) {
                this.showGlossaryTooltip(term, event);
            }
        });

        document.addEventListener('mousemove', (event) => {
            const term = event.target.closest('.glossary-term');
            if (term) {
                this.updateGlossaryTooltipPosition(event.clientX, event.clientY);
            }
        });

        document.addEventListener('mouseout', (event) => {
            const term = event.target.closest('.glossary-term');
            if (term && (!event.relatedTarget || !event.relatedTarget.closest || !event.relatedTarget.closest('.glossary-term'))) {
                this.hideGlossaryTooltip();
            }
        });
    }

    createGlossaryTooltip() {
        if (!this.glossaryTooltip) {
            this.glossaryTooltip = document.createElement('div');
            this.glossaryTooltip.className = 'glossary-tooltip';
            document.body.appendChild(this.glossaryTooltip);
        }
        return this.glossaryTooltip;
    }

    showGlossaryTooltip(term, event) {
        const tooltip = this.createGlossaryTooltip();
        const description = term.dataset.glossaryText || this.getGlossaryDescription(term.dataset.glossaryKey);
        if (!description) {
            this.hideGlossaryTooltip();
            return;
        }

        tooltip.innerHTML = description;
        this.updateGlossaryTooltipPosition(event.clientX, event.clientY);
        tooltip.classList.add('is-visible');
    }

    updateGlossaryTooltipPosition(x, y) {
        const tooltip = this.createGlossaryTooltip();
        tooltip.style.left = `${x + 12}px`;
        tooltip.style.top = `${y + 12}px`;
    }

    hideGlossaryTooltip() {
        if (this.glossaryTooltip) {
            this.glossaryTooltip.classList.remove('is-visible');
        }
    }

    buildGlossaryEntries() {
        const concepts = translations.concepts || {};
        const entries = [];

        Object.entries(concepts).forEach(([key, value]) => {
            if (!key || !value) {
                return;
            }

            const variants = new Set();
            const addVariant = (variant) => {
                const cleaned = String(variant || '').trim();
                if (!cleaned) {
                    return;
                }
                variants.add(cleaned);
                variants.add(cleaned.toLowerCase());
            };

            addVariant(key);
            addVariant(key.replace(/([a-z])([A-Z])/g, '$1 $2'));
            addVariant(key.replace(/([a-z])([A-Z])/g, '$1-$2'));
            addVariant(key.toLowerCase());
            addVariant(key.toLowerCase().replace(/ /g, '-'));
            addVariant(key.toLowerCase().replace(/ /g, ''));
            addVariant(key.toLowerCase().replace(/-/g, ''));

            const uniqueVariants = Array.from(variants)
                .filter(Boolean)
                .sort((a, b) => b.length - a.length);

            if (uniqueVariants.length) {
                entries.push({ key, variants: uniqueVariants });
            }
        });

        return entries.sort((a, b) => b.variants[0].length - a.variants[0].length);
    }

    getGlossaryDescription(termKey) {
        const concepts = translations.concepts || {};
        const entry = concepts[termKey];
        if (!entry) {
            return '';
        }

        const value = entry[this.currentLang] || entry.en || entry;
        if (Array.isArray(value)) {
            return value.join('<br>');
        }
        if (value && typeof value === 'object') {
            return value[this.currentLang] || value.en || '';
        }
        return String(value || '');
    }

    getGlossaryEntryForText(text) {
        const normalized = text.toLowerCase().replace(/[^a-z0-9]+/g, '');
        return this.glossaryEntries.find((entry) => {
            return entry.variants.some((variant) => {
                const normalizedVariant = variant.toLowerCase().replace(/[^a-z0-9]+/g, '');
                return normalizedVariant === normalized;
            });
        }) || null;
    }

    escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    escapeAttribute(value) {
        return String(value).replace(/"/g, '&quot;');
    }

    renderTextWithGlossary(text) {
        if (!text) {
            return '';
        }

        const patterns = this.glossaryEntries
            .flatMap((entry) => entry.variants)
            .filter((variant, index, all) => all.indexOf(variant) === index)
            .sort((a, b) => b.length - a.length)
            .map((variant) => this.escapeRegExp(variant));

        if (!patterns.length) {
            return text;
        }

        const glossaryRegex = new RegExp(`\\b(?:${patterns.join('|')})\\b`, 'gi');
        let result = '';
        let lastIndex = 0;
        let match;

        while ((match = glossaryRegex.exec(text))) {
            const matchedText = match[0];
            result += text.slice(lastIndex, match.index);
            const entry = this.getGlossaryEntryForText(matchedText);
            if (entry) {
                const description = this.getGlossaryDescription(entry.key);
                result += `<span class="glossary-term" data-glossary-key="${entry.key}" data-glossary-text="${this.escapeAttribute(description)}">${matchedText}</span>`;
            } else {
                result += matchedText;
            }
            lastIndex = match.index + matchedText.length;
        }

        result += text.slice(lastIndex);
        return result;
    }

    _registerInlinePic(picConfig) {
        if (!this._inlinePicRegistry) {
            this._inlinePicRegistry = new Map();
            this._inlinePicCounter = 0;
        }
        const id = `inline-pic-${++this._inlinePicCounter}`;
        this._inlinePicRegistry.set(id, picConfig);
        return id;
    }

    _resolveInlinePic(id) {
        return this._inlinePicRegistry?.get(id);
    }

    _createInlinePicFigure(picData) {
        if (!picData) return null;

        // New shape: { img, layer }
        if (picData.img !== undefined) {
            return this._createSingleInlinePicFigure(picData.img, picData.layer);
        }

        // Legacy shape: layer object
        if (typeof picData === 'object' && !Array.isArray(picData) && !picData.src) {
            const layers = ['primary', 'secondary', 'tertiary', 'ico', 'normal', 'small'];
            const wrapper = document.createDocumentFragment();
            let any = false;

            for (const layerName of layers) {
                const layerData = picData[layerName];
                if (!layerData) continue;
                const images = Array.isArray(layerData) ? layerData : [layerData];
                for (const img of images) {
                    const fig = this._createSingleInlinePicFigure(img, layerName);
                    if (fig) {
                        wrapper.appendChild(fig);
                        any = true;
                    }
                }
            }

            return any ? wrapper : null;
        }

        // Leaf
        return this._createSingleInlinePicFigure(picData);
    }

    _createSingleInlinePicFigure(imgData, layerName = null) {
        if (!imgData) return null;

        let src, altText, captionType, floatSide, floatWidth, isInline;
        if (typeof imgData === 'string') {
            src = imgData;
            altText = '';
            captionType = 'default';
            isInline = false;
        } else {
            src = imgData.src;
            altText = this.getLocalizedValue(imgData.alt) || (imgData.alt?.en || '');
            captionType = imgData.captionType || 'default';
            floatSide = imgData.float || null;
            floatWidth = imgData.width || null;
            isInline = imgData.inline === true;
        }
        if (!src) return null;

        const figure = document.createElement('figure');
        figure.className = 'guide-inline-pic';

        if (isInline) {
            figure.classList.add('guide-inline-pic-inline');
        }

        if (layerName) {
            figure.classList.add(`guide-inline-pic-layer-${layerName}`);
        }

        if (floatSide === 'left') figure.classList.add('guide-inline-pic-float-left');
        else if (floatSide === 'right') figure.classList.add('guide-inline-pic-float-right');

        if (floatWidth) figure.style.width = floatWidth;

        const img = document.createElement('img');
        img.src = src;
        img.alt = altText;
        img.className = 'guide-inline-pic-img';
        img.loading = 'lazy';
        img.addEventListener('click', () => {
            if (window.openImageLightbox) window.openImageLightbox(src, altText);
        });
        figure.appendChild(img);

        // Inline mode: no caption (it would break the flow)
        if (altText && !isInline) {
            const caption = document.createElement('figcaption');
            caption.className = 'guide-inline-pic-caption';
            if (captionType === 'quote') {
                caption.textContent = `"${altText}"`;
                caption.classList.add('caption-quote');
            } else {
                caption.textContent = altText;
            }
            figure.appendChild(caption);
        }

        // Inline mode: keep the alt on the img for accessibility
        if (isInline && altText) {
            img.title = altText;
        }

        return figure;
    }

    // Resolve a [pic:...] path to an array of image leaf objects
    _resolveInlinePicPath(path, base) {
        let data = null;
        if (base) data = this.getObjectByPathFromBase(path, base);
        if (!data) data = this.getObjectByPath(path);
        if (!data) return null;

        // Case A: single image leaf
        if (typeof data === 'string' || (data && typeof data === 'object' && data.src)) {
            return [data];
        }

        // Case B: array of images
        if (Array.isArray(data)) {
            return data;
        }

        // Case C: layer object like { primary: [...] } or the full img object
        if (typeof data === 'object') {
            const layers = ['primary', 'secondary', 'tertiary', 'ico', 'normal', 'small'];
            const collected = [];
            for (const layer of layers) {
                if (data[layer]) {
                    const arr = Array.isArray(data[layer]) ? data[layer] : [data[layer]];
                    collected.push(...arr);
                }
            }
            return collected.length ? collected : null;
        }

        return null;
    }

    parseMiniMarkdown(text) {
        if (!text) return '';
        
        let result = String(text);
        result = result.replace(/(?<!\!)\!([^!]+?)\!(?!\!)/g, '<strong>$1</strong>');
        result = result.replace(/\^([^\^]+?)\^/g, '<em>$1</em>');
        result = result.replace(/(?<!~)~([^~]+?)~(?!~)/g, '<u>$1</u>');
        result = this.applyRichColors(result);   // ← add this last
        return result;
    }
    
    renderRichText(value, container = null) {
        if (value === null || value === undefined) {
            return '';
        }

        let text = String(value);

        // Hyperlinks first ({{url|text}})
        if (this.parseHyperlinks) {
            text = this.parseHyperlinks(text);
        }

        const parts = [];
        let lastIndex = 0;

        text = text.replace(/\[pic:([^\]]+)\]/g, (match, rawPath) => {
            const path = rawPath.trim().replace(/:/g, '.');
            const base = this._currentBaseObject;

            const images = this._resolveInlinePicPath(path, base);
            if (!images || !images.length) {
                console.warn(`[pic:] could not resolve "${rawPath}"`);
                return `<span style="color:orange">[pic not found: ${rawPath}]</span>`;
            }

            // Detect layer from the path
            let layerName = null;
            if (path.includes('.secondary')) layerName = 'secondary';
            else if (path.includes('.tertiary')) layerName = 'tertiary';
            else if (path.includes('.ico')) layerName = 'ico';
            else if (path.includes('.normal')) layerName = 'normal';
            else if (path.includes('.small')) layerName = 'small';
            else if (path.includes('.primary')) layerName = 'primary';

            // Register each image WITH its layer so the figure can use the right class
            const ids = images.map(img => this._registerInlinePic({ img, layer: layerName }));
            return ids.map(id => `<span class="guide-inline-pic-placeholder" data-pic-id="${id}"></span>`).join('');
        });

        text = text.replace(/\[img:([^\]]+)\]/g, (match, rawPath) => {
            const path = rawPath.trim().replace(/:/g, '.');
            const base = this._currentBaseObject;

            let imgData = null;
            if (base) {
                imgData = this.getObjectByPathFromBase(path, base);
            }
            if (!imgData) {
                imgData = this.getObjectByPath(path);
            }

            if (!imgData) {
                console.warn(`[img:] could not resolve "${rawPath}" against base`, base);
                return `<span style="color:orange">[img not found: ${rawPath}]</span>`;
            }

            // If it's a leaf image (string or { src }), wrap it in the correct layer
            let layerObject;
            if (typeof imgData === 'string' || (imgData && typeof imgData === 'object' && imgData.src)) {
                let layerName = 'primary'; // default fallback
                if (path.includes('.secondary')) layerName = 'secondary';
                else if (path.includes('.tertiary')) layerName = 'tertiary';
                else if (path.includes('.ico')) layerName = 'ico';
                else if (path.includes('.normal')) layerName = 'normal';
                else if (path.includes('.small')) layerName = 'small';
                else if (path.includes('.primary')) layerName = 'primary';

                layerObject = { [layerName]: [imgData] };
            } else {
                layerObject = imgData;
            }

            const id = this._registerInlineImg(layerObject);
            return `<span class="guide-image-inline-placeholder" data-img-id="${id}" style="display:inline-block"></span>`;
        });

        text = text.replace(/\[tip:([^|\]]+)\|([^\]]+)\]/g, (match, label, tip) => {
            const safeLabel = this.escapeAttribute(label.trim());
            const safeTip = this.escapeAttribute(tip.trim());
            return `<span class="rich-tip" data-tip="${safeTip}" tabindex="0">${label.trim()}</span>`;
        });

        text.replace(/<([^>]+)>/g, (match, inner, offset) => {
            const before = text.slice(lastIndex, offset);
            parts.push(this.parseMiniMarkdown(this.renderTextWithGlossary(before)));

            const token = inner.trim();
            if (!token) {
                parts.push('');
            } else {
                const lower = token.toLowerCase();
                if (['concept', 'np', 'mech', 'forced mech', 'forced', 'forced mech,', 'derivated from', 'derived from', 'attribute'].includes(lower)) {
                    parts.push(token);
                } else if (/^(\/)?(strong|em|b|i|u|br|p|span|div|h[1-6]|ul|ol|li|a|img|audio|video|source|table|tbody|thead|tfoot|tr|td|th|caption|colgroup|col|iframe|figure|figcaption)\b/i.test(token)) {
                    parts.push(match);
                } else {
                    const label = token.replace(/^derivated from\s+/i, '').replace(/^derived from\s+/i, '').trim();
                    const id = this.getMechAnchor(label);
                    if (id && document.getElementById(id)) {
                        parts.push(`<a href="#${id}" class="mech-reference" data-mech-anchor="${id}" style="color:${this.getPrimaryColor()};">${label}</a>`);
                    } else {
                        parts.push(`&lt;${token}&gt;`);
                    }
                }
            }

            lastIndex = offset + match.length;
            return match;
        });

        parts.push(this.parseMiniMarkdown(this.renderTextWithGlossary(text.slice(lastIndex))));
        return parts.join('');
    }

    getPrimaryColor() {
        const styles = getComputedStyle(document.documentElement);
        const color = styles.getPropertyValue('--primary-color').trim();
        return color || '#8b5cf6';
    }

    getMechAnchor(label, container = null) {
        const id = label.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        
        // Check in specific container first, then fall back to document
        if (container) {
            if (container.querySelector(`#${id}`) || container.id === id) {
                return id;
            }
        }
        if (document.getElementById(id)) {
            return id;
        }
        return null;
    }

    parseHyperlinks(text) {
        if (!text) return '';
        
        return String(text).replace(/\{\{([^}|]+)(?:\|([^}|]+))?(?:\|([^}]+))?\}\}/g, (match, url, label, mode) => {
            const trimmedUrl = url.trim();
            const trimmedLabel = (label || '').trim() || trimmedUrl;
            const modeAttr = (mode || '').trim().toLowerCase();
            
            let targetAttr = '';
            if (modeAttr === 'external') {
                targetAttr = ' target="_blank" rel="noopener noreferrer"';
            } else if (modeAttr === 'internal') {
                targetAttr = '';
            } else if (/^https?:\/\//i.test(trimmedUrl)) {
                // Auto-detect external
                targetAttr = ' target="_blank" rel="noopener noreferrer"';
            }
            
            return `<a href="${trimmedUrl}" class="guide-hyperlink"${targetAttr}>${trimmedLabel}</a>`;
        });
    }

    translateElements(context = document) {
        // data-translate (single-line)
        context.querySelectorAll('[data-translate]:not([data-multiline])').forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                const base = this.findBaseObjectForKey(key);
                el.innerHTML = this.renderWithBase(translation, base);
            }
        });

        context.querySelectorAll('[data-multiline]').forEach(el => {
            const key = el.getAttribute('data-multiline');
            const lines = this.getTranslation(key, true);
            if (lines && Array.isArray(lines)) {
                const base = this.findBaseObjectForKey(key);
                el.innerHTML = lines.map(line => {
                    const trimmed = String(line).trim();
                    // If the line is ONLY [pic:...] tokens, don't wrap in <p>
                    if (/^(?:\[pic:[^\]]+\]\s*)+$/.test(trimmed)) {
                        return this.renderWithBase(line, base);
                    }
                    return `<p>${this.renderWithBase(line, base)}</p>`;
                }).join('');
            }
        });

        context.querySelectorAll('[data-img-id]').forEach(el => {
            const id = el.getAttribute('data-img-id');
            const imgData = this._resolveInlineImg(id);
            if (imgData && typeof imgData === 'object') {
                el.innerHTML = '';
                const imgEl = this.renderImageValue(imgData);
                if (imgEl) el.appendChild(imgEl);
            }
        });

        context.querySelectorAll('[data-pic-id]').forEach(el => {
            const id = el.getAttribute('data-pic-id');
            const picData = this._resolveInlinePic(id);
            if (!picData) return;

            const result = this._createInlinePicFigure(picData);
            if (!result) return;

            if (result instanceof DocumentFragment) {
                el.replaceWith(result);
            } else {
                el.replaceWith(result);
            }
        });

        // Legacy [data-img] path-based placeholders
        context.querySelectorAll('[data-img]').forEach(el => {
            const key = el.getAttribute('data-img');
            const imgData = this.getObjectByPath(key);
            if (imgData && typeof imgData === 'object') {
                el.innerHTML = '';
                const imgEl = this.renderImageValue(imgData);
                if (imgEl) el.appendChild(imgEl);
            }
        });
    }

    // Helper to get an object by dot-path
    getObjectByPath(key) {
        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
            if (!value || typeof value !== 'object' || !(k in value)) return null;
            value = value[k];
        }
        return value;
    }

    getTranslation(key, isMultiline = false) {
        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            if (!value[k]) {
                console.warn(`Translation key not found: ${key}`);
                return null;
            }
            value = value[k];
        }

        if (isMultiline) {
            return value[this.currentLang] || null;
        }
        return value[this.currentLang] || null;
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('elhelper-lang', lang);
        document.documentElement.lang = lang;
        this.applyTranslations();

        if (window.infoSystem) {
            window.infoSystem.initElements();
        }
    }

    applyRichColors(text) {
        if (typeof text !== 'string' || text.indexOf('@@') === -1) {
            return text;
        }

        // Tokenize: split on @@name: and @@, then walk a stack.
        const tokenRegex = /@@([a-zA-Z_][a-zA-Z0-9_]*):|@@/g;
        const out = [];
        const stack = []; // each entry: { name, open }
        let lastIndex = 0;
        let match;

        while ((match = tokenRegex.exec(text)) !== null) {
            out.push(text.slice(lastIndex, match.index));
            lastIndex = tokenRegex.lastIndex;

            if (match[1]) {
                // Opening @@name:
                const key = match[1].toLowerCase();
                const valid = RICH_COLOR_NAMES.has(key);
                stack.push({ key, valid });
                if (valid) out.push(`<span class="rich-color rich-color-${key}">`);
            } else {
                // Closing @@
                const top = stack.pop();
                if (top && top.valid) out.push('</span>');
            }
        }
        out.push(text.slice(lastIndex));

        // Any unclosed opens? Close them to keep the HTML balanced.
        while (stack.length) {
            const top = stack.pop();
            if (top.valid) out.push('</span>');
        }

        return out.join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.translationManager = new TranslationManager();
    document.addEventListener('click', (event) => translationManager.handleAnchorClick(event));
    window.addEventListener('scroll', () => translationManager.updateBackButtonVisibility(), { passive: true });
    translationManager.applyTranslations();

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = translationManager.currentLang;
        langSelect.addEventListener('change', (e) => {
            translationManager.switchLanguage(e.target.value);
        });
    }
});

document.body.addEventListener('click', (event) => {
    const link = event.target.closest('.mech-reference[data-mech-anchor]');
    if (!link) return;
    
    const modal = link.closest('.guide-modal');
    if (!modal) return; // Not in a modal, let normal anchor behavior work
    
    event.preventDefault();
    const targetId = link.getAttribute('data-mech-anchor');
    const target = modal.querySelector(`#${targetId}`);
    if (target) {
        const scrollContainer = modal.querySelector('.guide-modal-scroll');
        if (scrollContainer) {
            const targetTop = target.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top + scrollContainer.scrollTop - 20;
            scrollContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    }
});