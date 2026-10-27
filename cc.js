import { data } from '/EHD.js';

const FALLBACK = {
    'ui.title': 'Required Crit / Maximize',
    'ui.mode': 'Stat Type',
    'ui.crit': 'Critical',
    'ui.maxi': 'Maximize',
    'ui.enemy_res': 'Demon Realm (DR) Debuff',
    'ui.enh_lv': 'Enhancement Level',
    'ui.yellow_artifact': 'Yellow Artifact',
    'ui.grove': 'Atma of Grove',
    'ui.base_stats': 'Class Passives',
    'ui.add_btn': '+ Add Stat',
    'ui.type_unnorm': 'Unnormalized (U)',
    'ui.type_add': 'Additive (A)',
    'ui.type_mult': 'Multiplicative (M)',
    'ui.result_req': 'Required Socketed Stat',
    'ui.result_impossible': 'Impossible to achieve.',
    'ui.result_explanation': 'Already over 100%.'
};

function t(path) {
    const keys = `system.simulator.crit.${path}`.split('.');
    let node = data.translations;
    for (const k of keys) {
        if (!node || typeof node !== 'object' || !(k in node)) return FALLBACK[path] || path;
        node = node[k];
    }
    const lang = window.translationManager?.currentLang || 'en';
    return node[lang] || node.en || FALLBACK[path] || path;
}

export function renderCritCalculator(container) {
    const root = document.createElement('div');
    root.className = 'crit-root';
    root.innerHTML = `
        <div class="crit-header">${t('ui.title')}</div>
        
        <div class="crit-section">
            <div class="crit-row">
                <label>${t('ui.mode')}</label>
                <select class="crit-input crit-select" data-ref="mode">
                    <option value="crit">${t('ui.crit')}</option>
                    <option value="maxi">${t('ui.maxi')}</option>
                </select>
            </div>
            
            <div class="crit-row" data-ref="resRow">
                <label>${t('ui.enemy_res')}</label>
                <select class="crit-input crit-select" data-ref="enemyRes">
                    <option value="0">0%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                </select>
            </div>

            <div class="crit-row">
                <label>${t('ui.enh_lv')}</label>
                <select class="crit-input crit-select" data-ref="enhLv" value="7">
                    <option value="1">+1</option>
                    <option value="2">+2</option>
                    <option value="3">+3</option>
                    <option value="4">+4</option>
                    <option value="5">+5</option>
                    <option value="6">+6</option>
                    <option value="7">+7</option>
                    <option value="8">+8</option>
                    <option value="9">+9</option>
                    <option value="10">+10</option>
                    <option value="11">+11</option>
                    <option value="12">+12</option>
                    <option value="13">+13</option>
                </select>

            </div>
            
            <div class="crit-row">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-ref="yellowArtifact" style="width:16px;height:16px;accent-color:var(--primary-color);">
                    ${t('ui.yellow_artifact')}
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" data-ref="grove" style="width:16px;height:16px;accent-color:var(--primary-color); value=""">
                    ${t('ui.grove')}
                </label>
            </div>
        </div>

        <div class="crit-section">
            <div class="crit-subheader">${t('ui.base_stats')}</div>
            <div class="crit-dynamic-list" data-ref="dynamicList"></div>
            <button type="button" class="crit-add-btn" data-ref="addBtn">${t('ui.add_btn')}</button>
        </div>

        <div class="crit-results">
            <div class="crit-res-box">
                <div class="crit-res-title">${t('ui.result_req')}</div>
                <div class="crit-res-val" data-ref="resVal">0.00%</div>
                <div class="crit-res-warn" data-ref="resWarn" style="display:none;">${t('ui.result_impossible')}</div>
            </div>
        </div>
    `;
    container.appendChild(root);

    const $ = (name) => root.querySelector(`[data-ref="${name}"]`);
    const els = {
        mode: $('mode'), resRow: $('resRow'), enemyRes: $('enemyRes'), enhLv: $('enhLv'),
        yellowArtifact: $('yellowArtifact'), grove: $('grove'),dynamicList: $('dynamicList'), addBtn: $('addBtn'),
        resVal: $('resVal'), resWarn: $('resWarn')
    };

    let rowCount = 0;

    function addStatRow() {
        rowCount++;
        const id = `stat-${rowCount}`;
        const row = document.createElement('div');
        row.className = 'crit-dynamic-row';
        row.dataset.id = id;
        
        row.innerHTML = `
            <input type="number" class="crit-input crit-dyn-val" placeholder="Value" step="0.1" value="0">
            <select class="crit-input crit-dyn-type">
                <option value="unnorm">${t('ui.type_unnorm')}</option>
                <option value="add">${t('ui.type_add')}</option>
                <option value="mult">${t('ui.type_mult')}</option>
            </select>
            <button type="button" class="crit-remove-btn" title="Remove">×</button>
        `;

        row.querySelector('.crit-remove-btn').addEventListener('click', () => {
            row.remove();
            calculate();
        });

        row.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        });

        els.dynamicList.appendChild(row);
        calculate();
    }

    function calculate() {
        const mode = els.mode.value;
        
        // Show/Hide Resistance row for Maximize
        els.resRow.style.display = mode === 'crit' ? 'flex' : 'none';
        els.grove.style.display = mode === 'crit' ? 'inline-block' : 'none';

        // Get values
        const R = mode === 'crit' ? (parseFloat(els.enemyRes.value) / 100) : 0;
        const enhLv = parseInt(els.enhLv.value, 10) || 0;

        let U = 0; // Sum of unnormalized
        let A = 0; // Sum of additive
        let M = 1.0; // Product of multiplicative

        // Armor (Shoes for Crit, Bottom for Maxi). M = 2 + Enh. Lv%
        const armorBonus = (2 + enhLv) / 100;
        M *= (1 + armorBonus);

        // Yellow Artifact (8% M)
        if (els.yellowArtifact.checked) {
            M *= 1.08;
        }

        if (els.grove.checked) {
            A =  A - 0.06;
        }

        // Dynamic Passives
        const rows = els.dynamicList.querySelectorAll('.crit-dynamic-row');
        rows.forEach(row => {
            const val = (parseFloat(row.querySelector('.crit-dyn-val').value) || 0) / 100;
            const type = row.querySelector('.crit-dyn-type').value;
            if (type === 'unnorm') U += val;
            else if (type === 'add') A += val;
            else if (type === 'mult') M *= (1 + val);
        });

        const rawRequired = (((1 - U) / M) - A + R);
        const requiredPercent = rawRequired * 100;

        if (requiredPercent > 100) {
            els.resVal.textContent = requiredPercent.toFixed(2) + '%';
            els.resVal.style.color = '#ff5c5c';
            els.resWarn.style.display = 'block';
        } else if (requiredPercent <= 0) {
            els.resVal.textContent = '0.00%';
            els.resVal.style.color = '#6ee787';
            els.resWarn.style.display = 'none';
            els.resWarn.textContent = 'Already at 100%!';
            els.resWarn.style.display = 'block';
        } else {
            els.resVal.textContent = requiredPercent.toFixed(2) + '%';
            els.resVal.style.color = 'var(--primary-color)';
            els.resWarn.style.display = 'none';
        }
    }

    els.addBtn.addEventListener('click', addStatRow);
    
    // Attach listeners to static inputs
    [els.mode, els.enemyRes, els.enhLv, els.yellowArtifact, els.grove].forEach(el => {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
    });

    calculate();
    return root;
}