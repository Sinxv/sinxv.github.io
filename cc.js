import { data } from '/EHD.js';

const UI_TRANSLATIONS = {
    en: {
        'ui.title': 'Required Crit / Maximize', 'ui.mode': 'Stat Type', 'ui.crit': 'Critical',
        'ui.maxi': 'Maximize', 'ui.enemy_res': 'Demon Realm (DR) Debuff',
        'ui.enh_lv': 'Enhancement Level', 'ui.yellow_artifact': 'Yellow Artifact',
        'ui.grove': 'Atma of Grove', 'ui.base_stats': 'Class Passives', 'ui.add_btn': '+ Add Stat',
        'ui.type_unnorm': 'Unnormalized (U)', 'ui.type_add': 'Additive (A)',
        'ui.type_mult': 'Multiplicative (M)', 'ui.add_cap': 'In-Dungeon stat cap',
        'ui.result_req': 'Required Socketed Stat', 'ui.result_impossible': 'Impossible to achieve.',
        'ui.result_explanation': 'Already at 100%!', 'ui.add_cap_help': 'What the additive cap means',
        'ui.add_cap_tooltip': 'Additive stats are capped at 100%, assuming that with enough buffs your additive stat reaches 100%, after the DR debuff and multiplicative bonuses, your critical will be limited to this.',
        'ui.value_placeholder': 'Value', 'ui.remove': 'Remove'
    },
    es: {
        'ui.title': 'Crítico / Maximización requerida', 'ui.mode': 'Tipo de estadística', 'ui.crit': 'Crítico',
        'ui.maxi': 'Maximización', 'ui.enemy_res': 'Penalización de Reino Demoníaco (DR)',
        'ui.enh_lv': 'Nivel de mejora', 'ui.yellow_artifact': 'Artefacto amarillo',
        'ui.grove': 'Atma del Bosque', 'ui.base_stats': 'Pasivas de clase', 'ui.add_btn': '+ Añadir estadística',
        'ui.type_unnorm': 'Sin normalizar (U)', 'ui.type_add': 'Aditiva (A)',
        'ui.type_mult': 'Multiplicativa (M)', 'ui.add_cap': 'Límite en mazmorras',
        'ui.result_req': 'Estadística necesaria para socket', 'ui.result_impossible': 'Imposible de alcanzar.',
        'ui.result_explanation': '¡Ya está al 100%!', 'ui.add_cap_help': 'Qué significa el límite aditivo',
        'ui.add_cap_tooltip': 'Las estadísticas aditivas tienen un límite del 100%. Si con suficientes bonificaciones alcanzas el 100% de estadísticas aditivas, después de la penalización DR y las bonificaciones multiplicativas, tu crítico quedará limitado a este valor.',
        'ui.value_placeholder': 'Valor', 'ui.remove': 'Eliminar'
    },
    kr: {
        'ui.title': '필요 치명타 / 극대화', 'ui.mode': '스탯 유형', 'ui.crit': '치명타',
        'ui.maxi': '극대화', 'ui.enemy_res': '마계 디버프 (DR)', 'ui.enh_lv': '강화 레벨',
        'ui.yellow_artifact': '노란색 아티팩트', 'ui.grove': '숲의 아트마', 'ui.base_stats': '전직 패시브',
        'ui.add_btn': '+ 스탯 추가', 'ui.type_unnorm': '비정규화 (U)', 'ui.type_add': '가산 (A)',
        'ui.type_mult': '곱연산 (M)', 'ui.add_cap': '다른 스탯 적용 후 가산 한도',
        'ui.result_req': '필요 소켓 스탯', 'ui.result_impossible': '달성할 수 없습니다.',
        'ui.result_explanation': '이미 100%입니다!', 'ui.add_cap_help': '가산 한도 설명',
        'ui.add_cap_tooltip': '가산 스탯은 100%로 제한됩니다. 충분한 버프로 가산 스탯이 100%에 도달하더라도, DR 디버프와 곱연산 보너스를 적용한 후 치명타는 이 값으로 제한됩니다.',
        'ui.value_placeholder': '값', 'ui.remove': '삭제'
    },
    jp: {
        'ui.title': '必要クリティカル / 極大化', 'ui.mode': 'ステータス種類', 'ui.crit': 'クリティカル',
        'ui.maxi': '極大化', 'ui.enemy_res': '魔界デバフ (DR)', 'ui.enh_lv': '強化レベル',
        'ui.yellow_artifact': '黄色アーティファクト', 'ui.grove': '森のアトマ', 'ui.base_stats': '職業パッシブ',
        'ui.add_btn': '+ ステータスを追加', 'ui.type_unnorm': '未正規化 (U)', 'ui.type_add': '加算 (A)',
        'ui.type_mult': '乗算 (M)', 'ui.add_cap': '他のステータス適用後の加算上限',
        'ui.result_req': '必要なソケットステータス', 'ui.result_impossible': '達成できません。',
        'ui.result_explanation': 'すでに100%です！', 'ui.add_cap_help': '加算上限について',
        'ui.add_cap_tooltip': '加算ステータスは100%が上限です。十分なバフで加算ステータスが100%に達した場合、DRデバフと乗算ボーナスを適用した後のクリティカルはこの値に制限されます。',
        'ui.value_placeholder': '値', 'ui.remove': '削除'
    },
    br: {
        'ui.title': 'Crítico / Maximização necessária', 'ui.mode': 'Tipo de atributo', 'ui.crit': 'Crítico',
        'ui.maxi': 'Maximização', 'ui.enemy_res': 'Debuff do Reino Demoníaco (DR)',
        'ui.enh_lv': 'Nível de aprimoramento', 'ui.yellow_artifact': 'Artefato amarelo',
        'ui.grove': 'Atma do Bosque', 'ui.base_stats': 'Passivas de classe', 'ui.add_btn': '+ Adicionar atributo',
        'ui.type_unnorm': 'Não normalizado (U)', 'ui.type_add': 'Aditivo (A)',
        'ui.type_mult': 'Multiplicativo (M)', 'ui.add_cap': 'Limite aditivo após outros atributos',
        'ui.result_req': 'Atributo necessário no soquete', 'ui.result_impossible': 'Impossível de alcançar.',
        'ui.result_explanation': 'Já está em 100%!', 'ui.add_cap_help': 'O que significa o limite aditivo',
        'ui.add_cap_tooltip': 'Atributos aditivos têm limite de 100%. Mesmo que você alcance 100% de atributo aditivo com bônus suficientes, após o debuff DR e os bônus multiplicativos, seu crítico ficará limitado a este valor.',
        'ui.value_placeholder': 'Valor', 'ui.remove': 'Remover'
    }
};

function t(path) {
    const lang = window.translationManager?.currentLang || 'en';
    if (path === 'ui.title') {
        const title = data.translations?.system?.crit?.title;
        if (typeof title === 'string') return title;
        if (title && typeof title === 'object') return title[lang] || title.en || UI_TRANSLATIONS.en[path];
    }
    return UI_TRANSLATIONS[lang]?.[path] || UI_TRANSLATIONS.en[path] || path;
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
                    <option value="0">+0</option>    
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
                <div style="display:flex; flex-direction:column; align-items:flex-start; gap:8px; width:100%;">
                    <label style="display:flex; align-items:center; justify-content:flex-start; gap:8px; cursor:pointer; width:100%;">
                        <input type="checkbox" data-ref="yellowArtifact" style="width:16px;height:16px;accent-color:var(--primary-color); margin:0;">
                        <span>${t('ui.yellow_artifact')}</span>
                    </label>
                    <label data-ref="groveWrap" style="display:flex; align-items:center; justify-content:flex-start; gap:8px; cursor:pointer; width:100%;">
                        <input type="checkbox" data-ref="grove" style="width:16px;height:16px;accent-color:var(--primary-color); margin:0;">
                        <span>${t('ui.grove')}</span>
                    </label>
                </div>
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
            <div class="crit-res-box" data-ref="addCapBox">
                <div class="crit-res-title">${t('ui.add_cap')} <button type="button" data-ref="addCapHelp" class="rich-tip" aria-label="${t('ui.add_cap_help')}" aria-describedby="crit-add-cap-tooltip" style="width:18px;height:18px;padding:0;border:1px solid currentColor;border-radius:50%;background:transparent;color:inherit;font-size:12px;line-height:16px;cursor:help;">?</button></div>
                <div class="crit-res-val" data-ref="addCapVal">0.00%</div>
            </div>
        </div>
    `;
    container.appendChild(root);

    const $ = (name) => root.querySelector(`[data-ref="${name}"]`);
    const els = {
        mode: $('mode'), resRow: $('resRow'), enemyRes: $('enemyRes'), enhLv: $('enhLv'),
        yellowArtifact: $('yellowArtifact'), groveWrap: $('groveWrap'), grove: $('grove'),
        dynamicList: $('dynamicList'), addBtn: $('addBtn'),
        resVal: $('resVal'), resWarn: $('resWarn'), addCapBox: $('addCapBox'), addCapVal: $('addCapVal'), addCapHelp: $('addCapHelp')
    };

    const addCapTooltip = document.createElement('div');
    addCapTooltip.id = 'crit-add-cap-tooltip';
    addCapTooltip.className = 'rich-tip-tooltip';
    addCapTooltip.textContent = t('ui.add_cap_tooltip');
    document.body.appendChild(addCapTooltip);

    function showAddCapTooltip() {
        const rect = els.addCapHelp.getBoundingClientRect();
        addCapTooltip.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - 332))}px`;
        addCapTooltip.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - 100)}px`;
        addCapTooltip.classList.add('is-visible');
    }

    function hideAddCapTooltip() {
        addCapTooltip.classList.remove('is-visible');
    }

    els.addCapHelp.addEventListener('mouseenter', showAddCapTooltip);
    els.addCapHelp.addEventListener('focus', showAddCapTooltip);
    els.addCapHelp.addEventListener('mouseleave', hideAddCapTooltip);
    els.addCapHelp.addEventListener('blur', hideAddCapTooltip);

    let rowCount = 0;

    function addStatRow() {
        rowCount++;
        const id = `stat-${rowCount}`;
        const row = document.createElement('div');
        row.className = 'crit-dynamic-row';
        row.dataset.id = id;
        
        row.innerHTML = `
            <input type="number" class="crit-input crit-dyn-val" placeholder="${t('ui.value_placeholder')}" step="1" value="0">
            <select class="crit-input crit-dyn-type">
                <option value="unnorm">${t('ui.type_unnorm')}</option>
                <option value="add">${t('ui.type_add')}</option>
                <option value="mult">${t('ui.type_mult')}</option>
            </select>
            <button type="button" class="crit-remove-btn" title="${t('ui.remove')}">×</button>
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
        els.groveWrap.style.display = mode === 'crit' ? 'flex' : 'none';
        els.addCapBox.style.display = mode === 'crit' ? '' : 'none';

        // Get values
        const R = mode === 'crit' ? (parseFloat(els.enemyRes.value) / 100) : 0;
        const enhLv = parseInt(els.enhLv.value, 10) || 0;

        let U = 0; // Sum of unnormalized
        let additiveTotal = 0;
        let M = 1.0; // Product of multiplicative

        // Armor (Shoes for Crit, Bottom for Maxi). M = 2 + Enh. Lv%
        const armorBonus = (2 + enhLv) / 100;
        M *= (1 + armorBonus);

        // Yellow Artifact (8% M)
        if (els.yellowArtifact.checked) {
            M *= 1.08;
        }

        // Grove is a crit-only stat line: +30% crit DMG, -6% crit chance
        if (els.grove.checked && mode === 'crit') {
            A += -0.06;
        }

        // Dynamic passives
        const rows = els.dynamicList.querySelectorAll('.crit-dynamic-row');
        rows.forEach(row => {
            const val = parseFloat(row.querySelector('.crit-dyn-val').value) || 0;
            const type = row.querySelector('.crit-dyn-type').value;
            if (type === 'unnorm') U += val / 100;
            else if (type === 'add') additiveTotal += val;
            else if (type === 'mult') M *= (1 + val / 100);
        });

        // Convert additive stat into normalized N using the table's total-stat breakpoints.
        const breakpoints = mode === 'crit'
            ? [{ limit: 40, factor: 0.6 }, { limit: 75, factor: 0.6 }, { limit: 105, factor: 0.4 }]
            : [{ limit: 40, factor: 0.5 }, { limit: 80, factor: 0.5 }, { limit: 120, factor: 0.25 }];
        let remainingAdd = Math.max(0, additiveTotal);
        let previousLimit = 0;
        let N = 0;
        for (const point of breakpoints) {
            const band = Math.max(0, Math.min(remainingAdd, point.limit - previousLimit));
            N += band * point.factor / 100;
            remainingAdd -= band;
            previousLimit = point.limit;
            if (remainingAdd <= 0) break;
        }

        // Required stat = ((1 + resistance - U) / M) - N.
        const requiredPercent = ((((1 - U) / M) + R - N) * 100);
        const resistancePercent = R * 100;
        const multiplicativeBonusPercent = (M - 1) * 100;
        const additiveCap = Math.min(100, 100 - resistancePercent + multiplicativeBonusPercent);
        els.addCapVal.textContent = `${additiveCap.toFixed(2)}%`;

        if (requiredPercent > 100) {
            els.resVal.textContent = requiredPercent.toFixed(2) + '%';
            els.resVal.style.color = '#ff5c5c';
            els.resWarn.textContent = t('ui.result_impossible');
            els.resWarn.style.display = 'block';
        } else if (requiredPercent <= 0) {
            els.resVal.textContent = '0.00%';
            els.resVal.style.color = '#6ee787';
            els.resWarn.textContent = t('ui.result_explanation');
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