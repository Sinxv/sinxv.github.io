import { data } from '/EHD.js';

// ============================================================
// DATA — Reforge Tables with specific Click counts (Pity)
// ============================================================

const ARMOR_DATA = {
    tenebrous: {
        label: 'Tenebrous',
        icon: '/images/teneico.webp',
        mat2: { id: 'tasma', label: 'Tasma Aura', icon: '/images/tasma.png' },
        mat1: { id: 'tenebrous', label: 'Tenebrous Aura', icon: '/images/teneaura.png' },
        weeklyMat: 'm1',
        stages: [
            { toLv: 1,  clicks: 2,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 2,  clicks: 4,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 3,  clicks: 5,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 4,  clicks: 2,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 5,  clicks: 4,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 6,  clicks: 5,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 7,  clicks: 2,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 8,  clicks: 5,   m2: 2000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 9,  clicks: 7,   m2: 4000, m1: 15, crystals: 100, ed: 300000 },
            { toLv: 10, clicks: 4,   m2: 4000, m1: 30, crystals: 200, ed: 900000 },
            { toLv: 11, clicks: 5,   m2: 4000, m1: 30, crystals: 200, ed: 900000 },
            { toLv: 12, clicks: 7,   m2: 4000, m1: 30, crystals: 200, ed: 900000 },
            { toLv: 13, clicks: 7,   m2: 4000, m1: 30, crystals: 200, ed: 900000 },
            { toLv: 14, clicks: 10,  m2: 4000, m1: 30, crystals: 200, ed: 900000 },
            { toLv: 15, clicks: 14,  m2: 4000, m1: 30, crystals: 200, ed: 900000 },
            { toLv: 16, clicks: 14,  m2: 6000, m1: 45, crystals: 300, ed: 1800000 },
            { toLv: 17, clicks: 27,  m2: 6000, m1: 45, crystals: 300, ed: 1800000 },
            { toLv: 18, clicks: 53,  m2: 6000, m1: 45, crystals: 300, ed: 1800000 },
            { toLv: 19, clicks: 14,  m2: 6000, m1: 45, crystals: 300, ed: 1800000 },
            { toLv: 20, clicks: 35,  m2: 6000, m1: 45, crystals: 300, ed: 1800000 },
            { toLv: 21, clicks: 60,  m2: 6000, m1: 45, crystals: 300, ed: 1800000 }
        ]
    },
    exascale: {
        label: 'Exascale',
        icon: '/images/exaico.webp',
        mat2: { id: 'zetrium', label: 'Zetrium Steel', icon: '/images/zetrium.png' },
        mat1: { id: 'exikel', label: 'Refined Exikel', icon: '/images/exikel.png' },
        weeklyMat: 'm1',
        stages: [
            { toLv: 1,  clicks: 5,   m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 2,  clicks: 10,  m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 3,  clicks: 15,  m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 4,  clicks: 5,   m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 5,  clicks: 10,  m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 6,  clicks: 15,  m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 7,  clicks: 5,   m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 8,  clicks: 15,  m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 9,  clicks: 20,  m2: 2000, m1: 20, crystals: 100, ed: 300000 },
            { toLv: 10, clicks: 10,  m2: 4000, m1: 40, crystals: 200, ed: 900000 },
            { toLv: 11, clicks: 15,  m2: 4000, m1: 40, crystals: 200, ed: 900000 },
            { toLv: 12, clicks: 20,  m2: 4000, m1: 40, crystals: 200, ed: 900000 },
            { toLv: 13, clicks: 20,  m2: 4000, m1: 40, crystals: 200, ed: 900000 },
            { toLv: 14, clicks: 31,  m2: 4000, m1: 40, crystals: 200, ed: 900000 },
            { toLv: 15, clicks: 40,  m2: 4000, m1: 40, crystals: 200, ed: 900000 },
            { toLv: 16, clicks: 60,  m2: 6000, m1: 60, crystals: 300, ed: 1800000 },
            { toLv: 17, clicks: 100, m2: 6000, m1: 60, crystals: 300, ed: 1800000 },
            { toLv: 18, clicks: 180, m2: 6000, m1: 60, crystals: 300, ed: 1800000 },
            { toLv: 19, clicks: 80,  m2: 6000, m1: 60, crystals: 300, ed: 1800000 },
            { toLv: 20, clicks: 160, m2: 6000, m1: 60, crystals: 300, ed: 1800000 },
            { toLv: 21, clicks: 270, m2: 6000, m1: 60, crystals: 300, ed: 1800000 }
        ]
    },
    nebulonsuit: {
        label: 'Nebulon Suit',
        icon: '/images/nebico.webp',
        mat1: { id: 'methane', label: 'Methane Ampoule', icon: '/images/methane.png' },
        mat2: { id: 'metholone', label: 'Metholone', icon: '/images/metholone.png' },
        weeklyMat: 'm1',
        stages: [
            { toLv: 1,  clicks: 5,   m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 2,  clicks: 10,  m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 3,  clicks: 15,  m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 4,  clicks: 5,   m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 5,  clicks: 10,  m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 6,  clicks: 15,  m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 7,  clicks: 5,   m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 8,  clicks: 15,  m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 9,  clicks: 20,  m1: 20,  m2: 2000, crystals: 100, ed: 300000 },
            { toLv: 10, clicks: 10,  m1: 40,  m2: 4000, crystals: 200, ed: 900000 },
            { toLv: 11, clicks: 15,  m1: 40,  m2: 4000, crystals: 200, ed: 900000 },
            { toLv: 12, clicks: 20,  m1: 40,  m2: 4000, crystals: 200, ed: 900000 },
            { toLv: 13, clicks: 20,  m1: 40,  m2: 4000, crystals: 200, ed: 900000 },
            { toLv: 14, clicks: 31,  m1: 40,  m2: 4000, crystals: 200, ed: 900000 },
            { toLv: 15, clicks: 40,  m1: 40,  m2: 4000, crystals: 200, ed: 900000 },
            { toLv: 16, clicks: 60,  m1: 60,  m2: 6000, crystals: 300, ed: 1800000 },
            { toLv: 17, clicks: 100, m1: 60,  m2: 6000, crystals: 300, ed: 1800000 },
            { toLv: 18, clicks: 180, m1: 60,  m2: 6000, crystals: 300, ed: 1800000 },
            { toLv: 19, clicks: 80,  m1: 60,  m2: 6000, crystals: 300, ed: 1800000 },
            { toLv: 20, clicks: 160, m1: 60,  m2: 6000, crystals: 300, ed: 1800000 },
            { toLv: 21, clicks: 270, m1: 60,  m2: 6000, crystals: 300, ed: 1800000 }
        ]
    }
};

const FALLBACK = {
    'ui.armor': 'Armor',
    'ui.fee_discount': 'Fee Discount',
    'ui.durability': 'Durability',
    'ui.target_level': 'Target Level',
    'ui.material': 'Materials',
    'ui.reforge': 'Reforge',
    'ui.from': 'Level',
    'ui.to': 'To',
    'ui.amount': 'Amount',
    'ui.mat_crystals': 'Magic Crystals',
    'ui.mat_ed': 'ED',
    'ui.mat_chlorite': 'Chlorites',
    'ui.or': 'or',
    'ui.attempts': 'Attempts',
    'ui.reaches': 'Reaches',
    'ui.max': 'MAX'
};

function t(path) {
    const keys = `system.simulator.reforge.${path}`.split('.');
    let node = data.translations;
    for (const k of keys) {
        if (!node || typeof node !== 'object' || !(k in node)) return FALLBACK[path] || path;
        node = node[k];
    }
    const lang = window.translationManager?.currentLang || 'en';
    return node[lang] || node.en || FALLBACK[path] || path;
}

const MAX_LV = 21;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (n) => Math.round(n).toLocaleString('en-US');

// ---------- Pure calculation helpers ----------
const emptyCost = () => ({ m1: 0, m2: 0, crystals: 0, ed: 0, clicks: 0 });

function addStage(cost, stage, clicks) {
    cost.m1 += stage.m1 * clicks;
    cost.m2 += stage.m2 * clicks;
    cost.crystals += stage.crystals * clicks;
    cost.ed += stage.ed * clicks;
    cost.clicks += clicks;
}

function costBetween(armorKey, from, to, startProgress = 0) {
    const cost = emptyCost();
    ARMOR_DATA[armorKey].stages.forEach(s => {
        if (s.toLv > from && s.toLv <= to) {
            const clicks = s.toLv === from + 1 ? s.clicks - startProgress : s.clicks;
            addStage(cost, s, clicks);
        }
    });
    return cost;
}

function addCost(target, source) {
    target.m1 += source.m1;
    target.m2 += source.m2;
    target.crystals += source.crystals;
    target.ed += source.ed;
    target.clicks += source.clicks;
}

function addMaterialAttempts(cost, stage, clicks, matKey) {
    cost[matKey] += stage[matKey] * clicks;
    cost.crystals += stage.crystals * clicks;
    cost.ed += stage.ed * clicks;
    cost.clicks += clicks;
}

function simulateMaterials(armorKey, startingPieces, budget) {
    const stages = ARMOR_DATA[armorKey].stages;
    const cost = emptyCost();
    const remaining = {
        m1: budget.m1 * startingPieces.length,
        m2: budget.m2 * startingPieces.length
    };
    const weeklyKey = ARMOR_DATA[armorKey].weeklyMat;
    const otherKey = weeklyKey === 'm1' ? 'm2' : 'm1';

    const pieces = startingPieces.map(start => {
        let level = start.level;
        let progress = start.progress;
        while (level < MAX_LV && progress >= stages[level].clicks) {
            progress -= stages[level].clicks;
            level++;
        }
        return { level, progress, clicks: 0 };
    });

    for (let threshold = 3; threshold <= MAX_LV; threshold += 3) {
        let madeProgress;
        do {
            madeProgress = false;
            for (const piece of pieces) {
                if (piece.level >= threshold) continue;

                const stage = stages[piece.level];
                const weeklyClicks = Math.min(
                    1,
                    Math.floor(remaining[weeklyKey] / stage[weeklyKey])
                );
                remaining[weeklyKey] -= weeklyClicks * stage[weeklyKey];
                addMaterialAttempts(cost, stage, weeklyClicks, weeklyKey);

                const otherClicks = Math.min(
                    1 - weeklyClicks,
                    Math.floor(remaining[otherKey] / stage[otherKey])
                );
                remaining[otherKey] -= otherClicks * stage[otherKey];
                addMaterialAttempts(cost, stage, otherClicks, otherKey);

                if (weeklyClicks + otherClicks === 0) continue;

                madeProgress = true;
                const attempts = weeklyClicks + otherClicks;
                piece.clicks += attempts;
                piece.progress += attempts;
                if (piece.progress >= stage.clicks) {
                    piece.level++;
                    piece.progress = 0;
                }
            }
        } while (madeProgress);
    }

    return { pieces, cost, remaining };
}

function chloritesNeeded(clicks, durability) {
    return clicks <= durability ? 0 : Math.ceil((clicks - durability) / 10);
}

// ---------- UI ----------

export function renderReforgeCalculator(container) {
    const state = {
        armor: 'tenebrous',
        mode: 'target',
        start: 0,
        target: MAX_LV,
        startProgress: 0,
        pieceCount: 1,
        differentLevels: false,
        pieceLevels: [0],
        m1Mats: 0,
        m2Mats: 0,
        discount: 0,
        durability: 100
    };

    const root = document.createElement('div');
    root.className = 'rc-root';
    root.innerHTML = `
        <div class="rc-top">
            <div class="rc-armor">
                <div class="rc-select-wrap">
                    <select class="rc-ghost-select rc-armor-select" data-ref="armor" aria-label="${t('ui.armor')}"></select>
                </div>
                <div class="rc-icon-box"></div>
            </div>

            <div class="rc-center">
                <div class="rc-title">${t('ui.reforge')}</div>
                <div class="rc-range">
                    <div class="rc-field">
                        <span class="rc-label">${t('ui.from')}</span>
                        <div class="rc-level-controls" data-ref="startField">
                            <select class="rc-big-select" data-ref="start" aria-label="${t('ui.from')}"></select>
                            <select class="rc-pct-select" data-ref="startProgress" aria-label="Starting level progress"></select>
                        </div>
                    </div>

                    <div class="rc-field" data-ref="targetField">
                        <span class="rc-label">${t('ui.to')}</span>
                        <select class="rc-big-select" data-ref="target" aria-label="${t('ui.to')}"></select>
                    </div>

                    <div class="rc-field rc-mats-field" data-ref="matsField">
                        <label class="rc-material-budget">
                            <span class="rc-label" data-ref="m1Label"></span>
                            <input type="number" min="0" step="1" class="rc-input rc-input-wide"
                                   data-ref="m1Mats" value="0">
                        </label>
                        <label class="rc-material-budget">
                            <span class="rc-label" data-ref="m2Label"></span>
                            <input type="number" min="0" step="1" class="rc-input rc-input-wide"
                                   data-ref="m2Mats" value="0">
                        </label>
                    </div>
                </div>
            </div>

            <div class="rc-tabs" role="tablist">
                <button type="button" class="rc-tab" data-mode="target">${t('ui.target_level')}</button>
                <button type="button" class="rc-tab" data-mode="mats">${t('ui.material')}</button>
            </div>
        </div>

        <div class="rc-piece-settings">
            <div class="rc-piece-count" role="group" aria-label="Number of pieces">
                <span class="rc-piece-label">Pieces</span>
                ${[1, 2, 3, 4].map(count => `
                    <button type="button" class="rc-piece-button${count === 1 ? ' active' : ''}"
                            data-piece-count="${count}" aria-pressed="${count === 1}">${count}</button>
                `).join('')}
            </div>
            <label class="rc-different-levels">
                <input type="checkbox" data-ref="differentLevels">
                <span>Different R-lv between pieces</span>
            </label>
            <div class="rc-piece-levels" data-ref="pieceLevels" hidden></div>
        </div>

        <div class="rc-summary" data-ref="summary"></div>
        <div class="rc-results" data-ref="results"></div>
        <div class="rc-attempts" data-ref="attempts"></div>

        <div class="rc-options">
            <label class="rc-option">
                <span>${t('ui.fee_discount')} (%)</span>
                <input type="number" min="0" max="10" class="rc-input" data-ref="discount" value="0">
            </label>
            <label class="rc-option">
                <span>${t('ui.durability')}</span>
                <input type="number" min="0" max="100" class="rc-input" data-ref="durability" value="100">
            </label>
        </div>
    `;
    container.appendChild(root);

    const $ = (name) => root.querySelector(`[data-ref="${name}"]`);
    const els = {
        armor: $('armor'), start: $('start'), target: $('target'),
        targetField: $('targetField'), matsField: $('matsField'),
        startField: $('startField'),
        startProgress: $('startProgress'),
        differentLevels: $('differentLevels'), pieceLevels: $('pieceLevels'),
        m1Mats: $('m1Mats'), m2Mats: $('m2Mats'),
        m1Label: $('m1Label'), m2Label: $('m2Label'),
        summary: $('summary'), results: $('results'), attempts: $('attempts'),
        discount: $('discount'), durability: $('durability'),
        icon: root.querySelector('.rc-icon-box'),
        tabs: root.querySelectorAll('.rc-tab'),
        pieceButtons: root.querySelectorAll('.rc-piece-button')
    };

    // ---------- Option lists ----------
    Object.entries(ARMOR_DATA).forEach(([key, a]) => els.armor.add(new Option(a.label, key)));
    for (let i = 0; i < MAX_LV; i++) els.start.add(new Option(i, i));

    function fillTargetOptions() {
        const highestStart = state.differentLevels
            ? Math.max(...state.pieceLevels.slice(0, state.pieceCount))
            : state.start;
        els.target.innerHTML = '';
        for (let i = highestStart + 1; i <= MAX_LV; i++) els.target.add(new Option(i, i));
        state.target = clamp(state.target, highestStart + 1, MAX_LV);
        els.target.value = state.target;
    }

    function fillProgressOptions() {
        const maxClicks = ARMOR_DATA[state.armor].stages[state.start].clicks;
        els.startProgress.innerHTML = '';
        for (let progressed = 0; progressed <= maxClicks; progressed++) {
            const pct = (progressed / maxClicks) * 100;
            const digits = pct < 10 ? 2 : 1;
            const label = `${Number(pct.toFixed(digits))}%`;
            els.startProgress.add(new Option(label, progressed));
        }
        state.startProgress = clamp(state.startProgress, 0, maxClicks);
        els.startProgress.value = state.startProgress;
    }

    function fillPieceLevelOptions() {
        state.pieceLevels = Array.from({ length: state.pieceCount }, (_, index) =>
            clamp(state.pieceLevels[index] ?? state.start, 0, MAX_LV - 1)
        );
        els.pieceLevels.replaceChildren();

        state.pieceLevels.forEach((level, index) => {
            const label = document.createElement('label');
            label.className = 'rc-piece-level';

            const caption = document.createElement('span');
            caption.textContent = `Piece ${index + 1}`;

            const select = document.createElement('select');
            select.className = 'rc-big-select';
            select.dataset.pieceIndex = String(index);
            select.setAttribute('aria-label', `Piece ${index + 1} starting reforge level`);
            for (let lv = 0; lv < MAX_LV; lv++) {
                select.add(new Option(lv, lv));
            }
            select.value = level;
            select.addEventListener('change', event => {
                state.pieceLevels[index] = parseInt(event.target.value, 10);
                fillTargetOptions();
                calculate();
            });

            label.append(caption, select);
            els.pieceLevels.appendChild(label);
        });
    }

    function updatePieceLevelVisibility() {
        els.startField.style.display = state.differentLevels ? 'none' : '';
        els.pieceLevels.hidden = !state.differentLevels;
    }

    function getStartingPieces() {
        return state.differentLevels
            ? state.pieceLevels.slice(0, state.pieceCount).map(level => ({ level, progress: 0 }))
            : Array.from({ length: state.pieceCount }, () => ({
                level: state.start,
                progress: state.startProgress
            }));
    }

    function groupPieceResults(pieces) {
        const groups = new Map();
        pieces.forEach((piece, index) => {
            const pct = piece.progress && ARMOR_DATA[state.armor].stages[piece.level]
                ? (piece.progress / ARMOR_DATA[state.armor].stages[piece.level].clicks) * 100
                : 0;
            const key = `${piece.level}:${pct.toFixed(1)}`;
            const group = groups.get(key) || { level: piece.level, pct, indexes: [] };
            group.indexes.push(index + 1);
            groups.set(key, group);
        });

        return Array.from(groups.values()).map(group => {
            const pieceLabel = group.indexes.length === 1
                ? `Piece ${group.indexes[0]}`
                : `Pieces ${group.indexes.join(', ')}`;
            const progressLabel = group.pct > 0
                ? ` + ${group.pct.toFixed(1)}% → ${group.level + 1}`
                : '';
            return `${pieceLabel}: Reforge ${group.level}${progressLabel}`;
        }).join('<br>');
    }

    function updateMaterialLabels() {
        const a = ARMOR_DATA[state.armor];
        els.m1Label.textContent = a.mat1.label;
        els.m2Label.textContent = a.mat2.label;
        els.m1Mats.setAttribute('aria-label', a.mat1.label);
        els.m2Mats.setAttribute('aria-label', a.mat2.label);
    }

    function updateIcon() {
        const a = ARMOR_DATA[state.armor];
        els.icon.innerHTML = '';
        const img = new Image();
        img.alt = a.label;
        img.src = a.icon;
        img.onerror = () => {
            els.icon.innerHTML = `<span class="rc-icon-fallback">${a.label[0]}</span>`;
        };
        els.icon.appendChild(img);
    }

    // ---------- Icon paths for static results ----------
    const ICONS = {
        crystals: '/images/magcryico.webp',
        ed: '/images/EDico.png',
        chlorite: '/images/chloico.webp'
    };

    // Renders a single result block with Icon and Value (Label removed, Icons make it clear)
    const item = (iconSrc, value, sub = false) => `
        <div class="rc-res-item${sub ? ' rc-res-sub' : ''}">
            <img src="${iconSrc}" class="rc-res-icon" onerror="this.style.display='none'">
            <span class="rc-res-val">${fmt(value)}</span>
        </div>`;

    const remainingItem = (material, value) => `
        <div class="rc-res-item rc-res-remaining">
            <img src="${material.icon}" class="rc-res-icon" onerror="this.style.display='none'">
            <div class="rc-res-col">
                <span class="rc-res-val">${fmt(value)}</span>
                <span class="rc-res-subtitle">${material.label} remaining</span>
            </div>
        </div>`;

    // ---------- Calculation + render ----------
    function calculate() {
        const a = ARMOR_DATA[state.armor];
        let cost;
        let summary = '';
        let materialsHtml = '';
        let pieceClickCounts = [];

        if (state.mode === 'target') {
            cost = emptyCost();
            getStartingPieces().forEach(start => {
                const pieceCost = costBetween(
                    state.armor,
                    start.level,
                    state.target,
                    start.progress
                );
                addCost(
                    cost,
                    pieceCost
                );
                pieceClickCounts.push(pieceCost.clicks);
            });
        } else {
            const sim = simulateMaterials(
                state.armor,
                getStartingPieces(),
                { m1: state.m1Mats, m2: state.m2Mats }
            );
            cost = sim.cost;
            pieceClickCounts = sim.pieces.map(piece => piece.clicks);
            summary = groupPieceResults(sim.pieces);
            if (sim.pieces.every(piece => piece.level >= MAX_LV)) {
                summary += `<br><span class="rc-pct">${t('ui.max')}</span>`;
            }
            if (sim.remaining.m1 > 0) materialsHtml += remainingItem(a.mat1, sim.remaining.m1);
            if (sim.remaining.m2 > 0) materialsHtml += remainingItem(a.mat2, sim.remaining.m2);
        }

        const ed = Math.floor(cost.ed * (1 - state.discount / 100));
        const chlorites = pieceClickCounts.reduce(
            (total, clicks) => total + chloritesNeeded(clicks, state.durability),
            0
        );

        els.summary.innerHTML = summary;
        els.summary.style.display = summary ? '' : 'none';

        // Build the materials section dynamically based on mode
        if (state.mode === 'target') {
            // Target Mode: Show both materials side by side with the "or" divider
            materialsHtml = `
                ${item(a.mat1.icon, cost.m1)}
                <div class="rc-res-or">${t('ui.or')}</div>
                ${item(a.mat2.icon, cost.m2, true)}
            `;
        }

        // Append materials and the rest of the stats
        els.results.innerHTML = `
            ${materialsHtml}
            ${materialsHtml ? '<div class="rc-res-divider"></div>' : ''}
            ${item(ICONS.crystals, cost.crystals)}
            ${item(ICONS.ed, ed)}
            ${item(ICONS.chlorite, chlorites)}
        `;

        els.attempts.textContent = `${t('ui.attempts')}: ${fmt(cost.clicks)}`;
    }

    function refreshMode() {
        els.tabs.forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
        
        // Hide target input if in mats mode
        els.targetField.style.display = state.mode === 'target' ? '' : 'none';
        updatePieceLevelVisibility();
        
        // Show material inputs only in materials mode.
        els.matsField.style.display = state.mode === 'mats' ? '' : 'none';
    }

    // ---------- Events ----------
    els.armor.addEventListener('change', e => {
        state.armor = e.target.value;
        state.startProgress = 0;
        state.m1Mats = 0;
        state.m2Mats = 0;
        els.m1Mats.value = 0;
        els.m2Mats.value = 0;
        updateIcon();
        fillProgressOptions();
        updateMaterialLabels();
        calculate();
    });

    els.tabs.forEach(btn => btn.addEventListener('click', () => {
        state.mode = btn.dataset.mode;
        refreshMode();
        calculate();
    }));

    els.pieceButtons.forEach(button => button.addEventListener('click', () => {
        state.pieceCount = parseInt(button.dataset.pieceCount, 10);
        els.pieceButtons.forEach(pieceButton => {
            const isActive = pieceButton === button;
            pieceButton.classList.toggle('active', isActive);
            pieceButton.setAttribute('aria-pressed', String(isActive));
        });
        fillPieceLevelOptions();
        fillTargetOptions();
        calculate();
    }));

    els.differentLevels.addEventListener('change', event => {
        state.differentLevels = event.target.checked;
        fillPieceLevelOptions();
        fillTargetOptions();
        updatePieceLevelVisibility();
        refreshMode();
        calculate();
    });

    els.start.addEventListener('change', e => {
        state.start = parseInt(e.target.value, 10);
        state.startProgress = 0;
        state.pieceLevels = Array(state.pieceCount).fill(state.start);
        fillTargetOptions();
        fillProgressOptions();
        fillPieceLevelOptions();
        calculate();
    });

    els.target.addEventListener('change', e => {
        state.target = parseInt(e.target.value, 10);
        calculate();
    });

    els.startProgress.addEventListener('change', e => {
        state.startProgress = parseInt(e.target.value, 10);
        calculate();
    });

    els.m1Mats.addEventListener('input', e => {
        state.m1Mats = Math.max(0, parseInt(e.target.value, 10) || 0);
        calculate();
    });

    els.m2Mats.addEventListener('input', e => {
        state.m2Mats = Math.max(0, parseInt(e.target.value, 10) || 0);
        calculate();
    });

    els.discount.addEventListener('input', e => {
        state.discount = clamp(parseInt(e.target.value, 10) || 0, 0, 10);
        calculate();
    });

    els.durability.addEventListener('input', e => {
        state.durability = clamp(parseInt(e.target.value, 10) || 0, 0, 100);
        calculate();
    });

    root.querySelectorAll('.rc-input').forEach(inp =>
        inp.addEventListener('focus', () => inp.select()));

    // ---------- Init ----------
    els.start.value = state.start;
    fillTargetOptions();
    fillProgressOptions();
    fillPieceLevelOptions();
    updateMaterialLabels();
    updateIcon();
    refreshMode();
    calculate();

    return root;
}