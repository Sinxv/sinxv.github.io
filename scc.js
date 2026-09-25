import { data } from '/EHD.js';

// ------- Scoring tables -------
const WEAPON_SCORING = {
    "Physical/Magical Attack Power (Enhancement Level)": [[1.5, 9.5], [1.4, 9], [1.3, 8], [1.2, 7.5], [1.1, 7], [1.0, 6], [0.9, 5], [0.8, 4.5]],
    "All Skill Damage (Enhancement Level)": [[1.5, 8.5], [1.4, 8], [1.3, 7.5], [1.2, 7], [1.1, 5.5], [1.0, 5], [0.9, 5], [0.8, 4.5]],
    "Physical/Magical Attack Power Level (Enhancement Level)": [[1.5, 7.5], [1.4, 7], [1.3, 6.5], [1.2, 6], [1.1, 5.5], [1.0, 5], [0.9, 4.5], [0.8, 4]],
    "Critical Damage (Enhancement Level)": [[1.5, 7.25], [1.4, 6.75], [1.3, 6.25], [1.2, 5.75], [1.1, 5.25], [1.0, 4.75], [0.9, 4.25], [0.8, 3.75]],
    "Deal n% of Damage as continuous damage for 3 sec.": [[12, 7.25], [11, 6.75], [10, 6.25], [9, 5.75], [8, 5.25], [7, 4.5], [6, 4], [5, 3.5]],
    "Physical/Magical Attack Power": [[13, 7], [12, 6.5], [11, 6], [10, 5.5], [9, 5], [8, 4.5], [7, 4], [6, 3.5]],
    "Critical Damage": [[13, 5.5], [12, 5], [11, 4.5], [10, 4], [9, 3.5], [8, 3], [7, 2.5], [6, 2]],
    "Physical/Magical Attack Power Level": [[13, 5.5], [12, 5], [11, 4.5], [10, 4], [9, 3.5], [8, 3], [7, 2.5], [6, 2]],
    "Damage to Boss": [[15, 5], [14, 4.5], [13, 4.5], [12, 4], [11, 4], [10, 3.5], [9, 3], [8, 2.5]],
    "All Skill Damage": [[13, 6.5], [12, 6], [11, 5], [10, 4.5], [9, 4.5], [8, 4], [7, 3.5], [6, 3]],
    "Strength Skill Damage": [[13, 5.5], [12, 5], [11, 4.5], [10, 4], [9, 3.5], [8, 3], [7, 2.5], [6, 2]],
    "Bravery Skill Damage": [[13, 5.5], [12, 5], [11, 4.5], [10, 4], [9, 3.5], [8, 3], [7, 2.5], [6, 2]],
    "Polarize: Attack/Attacked Damage": [[12, 8.5], [11, 8], [10, 7], [9, 6.5], [8, 6], [7, 5.5], [6, 5], [5, 4.5]]
};

// ------- Options -------
const WEAPON_OPTIONS = [
    ["Physical/Magical Attack Power (Enhancement Level)", 0.8, 1.5, true, 0.1],
    ["Physical/Magical Attack Power Level (Enhancement Level)", 0.8, 1.5, true, 0.1],
    ["Critical Damage (Enhancement Level)", 0.8, 1.5, true, 0.1],
    ["All Skill Damage (Enhancement Level)", 0.8, 1.5, true, 0.1],
    ["Deal n% of Damage as continuous damage for 3 sec.", 5, 12, false, 1],
    ["Ignore Enemy Physical/Magical Defense", 4.5, 8, false, 0.5],
    ["Physical/Magical Attack Power", 6, 13, false, 1],
    ["Polarize: Attack/Attacked Damage", 5, 12, false, 1],
    ["Critical Damage", 6, 13, false, 1],
    ["Physical/Magical Attack Power Level", 6, 13, false, 1],
    ["Damage to Boss", 8, 15, false, 1],
    ["Strength Skill Damage", 6, 13, false, 1],
    ["Bravery Skill Damage", 6, 13, false, 1],
    ["All Skill Damage", 6, 13, false, 1],
];

const MODES = {
    weapon: {
        lines: 4,
        options: WEAPON_OPTIONS,
        scoring: WEAPON_SCORING,
        enhScaled: true,
        enhLabel: 'Enhancement Level'
    }
};

// ------- Enhancement scaling -------
const ENH_VALUES = { 9: 0.75, 10: 0.8333, 11: 0.9167, 12: 1.0, 13: 1.0833 };

function enhanceAdjustedValue(rawValue, enhLevel, statName, mode) {
    const opt = MODES[mode].options.find(o => o[0] === statName);
    if (!opt || !opt[3]) return rawValue;
    const factor = ENH_VALUES[enhLevel] ?? 1.0;
    return rawValue * factor;
}

// ------- Scoring -------
function calculateScore(statName, rawValue, enhLevel, mode) {
    const cfg = MODES[mode];
    const table = cfg.scoring[statName];
    if (!table) return { score: 0, adjusted: rawValue };

    const opt = cfg.options.find(o => o[0] === statName);
    const isEnh = opt && opt[3];
    const factor = isEnh ? (ENH_VALUES[enhLevel] ?? 1.0) : 1.0;

    let baseScore = 0;
    for (const [threshold, points] of table) {
        if (rawValue >= threshold) { baseScore = points; break; }
    }

    return {
        score: baseScore * factor,
        adjusted: rawValue * factor  // effective stat for the tooltip
    };
}

function scoreTier(score) {
    if (score >= 9) return 'max';
    if (score >= 7) return 'high';
    if (score >= 5) return 'mid';
    return 'low';
}

function totalTier(total, lineCount) {
    // Total tiers scale with line count
    // can both hit "max" without the weapon being inherently higher tier.
    const perLine = total / lineCount;
    if (perLine >= 8.5) return 'trueadam';
    if (perLine >= 7.5) return 'max';
    if (perLine >= 6)   return 'high';
    if (perLine >= 4)   return 'mid';
    return 'low';
}

// ------- Probability (uniform assumption) -------
function getStatChance(statName, mode) {
    const cfg = MODES[mode];
    const opt = cfg.options.find(o => o[0] === statName);
    if (!opt) return 0;
    const [, min, max] = opt;
    const totalWidth = cfg.options.reduce((s, o) => s + (o[2] - o[1]), 0);
    if (totalWidth <= 0) return 0;
    return ((max - min) / totalWidth) * 100;
}

// ------- Public API -------
export function renderStatChangeCalculator(container) {
    const state = {
        mode: 'weapon',
        enh: 12,
        lines: [null, null, null, null]
    };

    const root = document.createElement('div');
    root.className = 'scc-root';
    container.appendChild(root);

    const lineCount = () => MODES[state.mode].lines;
    const opts = () => MODES[state.mode].options;
    const scoreFor = (name, val) => calculateScore(name, val, state.enh, state.mode);

    function usedStats() {
        return new Set(
            state.lines.slice(0, lineCount())
                .filter(l => l && l.statName)
                .map(l => l.statName)
        );
    }

    function statRange(name) {
        const o = opts().find(x => x[0] === name);
        if (!o) return { min: 0, max: 0, step: 1, isEnh: false };
        const [, min, max, isEnh, step] = o;
        return { min, max, step: step ?? 1, isEnh };
    }

    function setMode(m) {
        if (m === state.mode) return;
        state.mode = m;
        const n = lineCount();
        while (state.lines.length < n) state.lines.push(null);
        if (state.lines.length > n) state.lines.length = n;
        render();
    }

    function setEnh(v) { state.enh = v; render(); }

    function setLine(i, statName) {
        if (!statName) state.lines[i] = null;
        else {
            const { min } = statRange(statName);
            const prev = state.lines[i];
            state.lines[i] = {
                statName,
                value: prev && prev.statName === statName ? prev.value : min
            };
        }
        render();
    }

    function setLineValue(i, v) {
        if (!state.lines[i]) return;
        const { step } = statRange(state.lines[i].statName);
        let num = parseFloat(v);
        if (isNaN(num)) num = 0;
        // Snap to the nearest step so 0.13 doesn't linger when step is 0.01
        const precision = Math.max(0, Math.ceil(-Math.log10(step)));
        num = Math.round(num / step) * step;
        num = parseFloat(num.toFixed(precision + 2));
        state.lines[i].value = num;
        renderScoreOnly();
    }

    function getTotal() {
        return state.lines.slice(0, lineCount()).reduce((sum, line) => {
            if (!line) return sum;
            return sum + scoreFor(line.statName, line.value).score;
        }, 0);
    }

    function render() {
        root.innerHTML = '';
        root.appendChild(renderHeader());
        root.appendChild(renderLines());
        root.appendChild(renderFooter());
    }

    function renderScoreOnly() {
        // Update each line's score badge in-place
        state.lines.forEach((line, i) => {
            const badgeHost = root.querySelector(`.scc-line-score[data-index="${i}"]`);
            if (!badgeHost) return;
            badgeHost.innerHTML = '';
            if (line) {
                const { score, adjusted } = scoreFor(line.statName, line.value);
                badgeHost.appendChild(makeScoreBadge(score, adjusted));
            }
        });
        // Update total
        const totalWrap = root.querySelector('.scc-total-wrap');
        if (totalWrap) {
            totalWrap.replaceWith(renderTotal());
        }
    }

    function renderHeader() {
        const header = document.createElement('div');
        header.className = 'scc-header';

        const modeWrap = document.createElement('div');
        modeWrap.className = 'scc-mode-toggle';
        [['weapon', 'Weapon']].forEach(([m, label]) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'scc-mode-btn' + (state.mode === m ? ' is-active' : '');
            btn.textContent = label;
            btn.addEventListener('click', () => setMode(m));
            modeWrap.appendChild(btn);
        });
        header.appendChild(modeWrap);

        const enhWrap = document.createElement('div');
        enhWrap.className = 'scc-enh';
        const enhLabel = document.createElement('span');
        enhLabel.className = 'scc-enh-label';
        enhLabel.textContent = MODES[state.mode].enhLabel;
        enhWrap.appendChild(enhLabel);

        const enhSelect = document.createElement('select');
        enhSelect.className = 'scc-enh-select';
        [9, 10, 11, 12, 13].forEach(lvl => {
            const opt = document.createElement('option');
            opt.value = lvl;
            opt.textContent = `+${lvl}`;
            if (lvl === state.enh) opt.selected = true;
            enhSelect.appendChild(opt);
        });
        enhSelect.addEventListener('change', e => setEnh(parseInt(e.target.value, 10)));
        enhWrap.appendChild(enhSelect);

        header.appendChild(enhWrap);
        return header;
    }

    function renderLines() {
        const body = document.createElement('div');
        body.className = 'scc-lines';
        for (let i = 0; i < lineCount(); i++) body.appendChild(renderLine(i));
        return body;
    }

    function renderLine(index) {
        const line = state.lines[index];
        const used = usedStats();

        const wrap = document.createElement('div');
        wrap.className = 'scc-line';
        wrap.dataset.index = index;

        const num = document.createElement('div');
        num.className = 'scc-line-num';
        num.textContent = `Line ${index + 1}`;
        wrap.appendChild(num);

        // Stat select
        const select = document.createElement('select');
        select.className = 'scc-line-select';
        const ph = document.createElement('option');
        ph.value = '';
        ph.textContent = '— Select a stat —';
        select.appendChild(ph);
        opts().forEach(([name]) => {
            const o = document.createElement('option');
            o.value = name;
            o.textContent = name;
            if (used.has(name) && (!line || line.statName !== name)) o.disabled = true;
            if (line && line.statName === name) o.selected = true;
            select.appendChild(o);
        });
        select.addEventListener('change', e => setLine(index, e.target.value));
        wrap.appendChild(select);

        // Value control
        const valueWrap = document.createElement('div');
        valueWrap.className = 'scc-line-value';
        if (line) {
            const { min, max, step } = statRange(line.statName);

            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'scc-line-input';
            input.min = min; input.max = max; input.step = step;
            input.value = line.value;
            input.addEventListener('input', e => {
                setLineValue(index, e.target.value);
                // Reflect snapped value back into the input
                if (state.lines[index]) {
                    const snapped = state.lines[index].value;
                    if (parseFloat(e.target.value) !== snapped) e.target.value = snapped;
                }
            });
            valueWrap.appendChild(input);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.className = 'scc-line-slider';
            slider.min = min; slider.max = max; slider.step = step;
            slider.value = line.value;
            slider.addEventListener('input', e => {
                setLineValue(index, e.target.value);
                if (state.lines[index]) {
                    const snapped = state.lines[index].value;
                    e.target.value = snapped;
                    input.value = snapped;
                }
            });
            valueWrap.appendChild(slider);
        } else {
            valueWrap.classList.add('scc-line-empty');
            valueWrap.textContent = '—';
        }
        wrap.appendChild(valueWrap);

        const scoreWrap = document.createElement('div');
        scoreWrap.className = 'scc-line-score';
        scoreWrap.dataset.index = index;
        if (line) {
            const { score, adjusted } = scoreFor(line.statName, line.value);
            scoreWrap.appendChild(makeScoreBadge(score, adjusted));
        }
        wrap.appendChild(scoreWrap);

        // Remove
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'scc-line-remove';
        removeBtn.setAttribute('aria-label', 'Remove line');
        removeBtn.textContent = '×';
        removeBtn.disabled = !line;
        removeBtn.addEventListener('click', () => setLine(index, ''));
        wrap.appendChild(removeBtn);

        return wrap;
    }

    function makeScoreBadge(score, adjustedValue) {
        const tier = scoreTier(score);
        const badge = document.createElement('span');
        badge.className = `scc-score scc-score-${tier}`;
        badge.textContent = roundToHalf(score).toFixed(1);
        badge.title = `Adjusted value: ${adjustedValue.toFixed(3)}`;
        return badge;
    }

    function renderFooter() {
        const footer = document.createElement('div');
        footer.className = 'scc-footer';
        footer.appendChild(renderTotal());
        return footer;
    }

    function roundToHalf(value) {
        return Math.round(value * 2) / 2;
    }

    function renderTotal() {
        const total = getTotal();
        const tier = totalTier(total, lineCount());
        const wrap = document.createElement('div');
        wrap.className = `scc-total-wrap scc-total-${tier}`;

        const label = document.createElement('div');
        label.className = 'scc-total-label';
        label.textContent = 'Total Score';
        wrap.appendChild(label);

        const value = document.createElement('div');
        value.className = 'scc-total-value';
        value.textContent = roundToHalf(total).toFixed(1);
        wrap.appendChild(value);

        const tierLabel = document.createElement('div');
        tierLabel.className = 'scc-total-tier';
        tierLabel.textContent = ({ low: 'Weak', mid: 'Decent', high: 'Strong', max: 'Excellent', trueadam: 'Maximum'})[tier];
        wrap.appendChild(tierLabel);

        return wrap;
    }

    render();

    root.setHideInfo = function (hide) {
        root.classList.toggle('scc-hide-info', hide);
    };

    return root;
}