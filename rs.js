import { data } from '/EHD.js';

// ============================================================
// TUNABLES
// ============================================================
const TIMING = {
    RUN_MS: 45000,
    RESULT_MS: 5000,
    H_SPEED: 0.00055,
    GRAVITY: 0.00005,
    JUMP_IMPULSE: -0.005,
    GROUND_Y: 0.88,
    ZONE_STAND_Y_TOL: 0.02,
    ZONE_STAND_X_PAD: 0.02,
    URGENT_AT_MS: 10000
};

// ============================================================
// ZONE LAYOUT
// ============================================================
const ZONE_SLOTS = [
    { x: 0.25, y: 0.55, w: 0.14 },
    { x: 0.75, y: 0.55, w: 0.14 },
    { x: 0.17, y: 0.88, w: 0.30 },
    { x: 0.83, y: 0.88, w: 0.30 },
];

const DECOR_PLATFORMS = [
    { x: 0.12, y: 0.30, w: 0.14 },
    { x: 0.88, y: 0.30, w: 0.14 },
    { x: 0.88, y: 0.74, w: 0.14 },
    { x: 0.12, y: 0.74, w: 0.14 },
    { x: 0.50, y: 0.88, w: 0.30 },
    { x: 0.17, y: 0.10, w: 0.30 },
    { x: 0.83, y: 0.10, w: 0.30 }
];

const ZONE_WORDS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four' };
function word(n) { return ZONE_WORDS[n] || String(n); }

// ============================================================
// FRAGMENT POOL — every entry is a real, atomic fragment.
// ============================================================
const POOL = {
    // Zone references
    zone_1:   'zo... ...ne',
    zone_2:   '...ne tw...',
    zone_3:   '...on... ...hre...',
    zone_4:   'z...e fo...',
    zone_all: 'Al... ...ne',

    // Modifiers
    mod_plus:   '...+...',
    mod_minus:  '...-...',
    mod_except: '...ept...',

    // Unit references
    unit_0: 'ze... u...ts',
    unit_1: 'on... un...',
    unit_2: '...wo ...its',
    unit_3: 'th... uni...',
    unit_4: '...ou... ...nits',
    unit_5: '...ve ...ni...',

    // Command fragments
    cmd_fire_all:        'Com... ...ire at all zo...',
    cmd_focus_fire:      '...men... foc... fi...',
    cmd_evac_to_safe:    '...vac... to the sa... ...ne',
    cmd_evac_from:       'Eva... fro... the zo...',
    cmd_evac_from_safe:  '...cua... ...om the ...afe ...ne',
    cmd_evac_from_des:   '...vac... fr... ...sign... zo...',
    cmd_from_des:        'Fr... th... des... ne,',
    cmd_from_target:     'Fr... th... ...arg... ...ne',
    cmd_evac_immediate:  '... uat... imm...',
    cmd_safe_changed:    'Sa... ...ne has ...ang...',
    cmd_from_current:    'Fr... th... ...ren... ...ne,'
};

function zoneFrag(n) {
    return POOL[`zone_${n}`] || POOL.zone_all;
}

// ============================================================
// FRAGMENT GLOSSES — what each fragment unscrambles to.
// Used by the result screen to teach the puzzle mechanic.
// ============================================================
const GLOSS = {
    [POOL.zone_1]:           'Zone One',
    [POOL.zone_2]:           'Zone Two',
    [POOL.zone_3]:           'Zone Three',
    [POOL.zone_4]:           'Zone Four',
    [POOL.zone_all]:         'All zones',
    [POOL.mod_plus]:         'Plus (+)',
    [POOL.mod_minus]:        'Minus (-)',
    [POOL.mod_except]:       'Except',
    [POOL.unit_0]:           '0 units',
    [POOL.unit_1]:           '1 unit',
    [POOL.unit_2]:           '2 units',
    [POOL.unit_3]:           '3 units',
    [POOL.unit_4]:           '4 units',
    [POOL.unit_5]:           '5 units',
    [POOL.cmd_fire_all]:     'Commence fire at all zones',
    [POOL.cmd_focus_fire]:   'Commence focus fire',
    [POOL.cmd_evac_to_safe]: 'Evacuate to the safe zone',
    [POOL.cmd_evac_from]:    'Evacuate from the zone',
    [POOL.cmd_evac_from_safe]: 'Evacuate from the safe zone',
    [POOL.cmd_evac_from_des]:'Evacuate from Designated Zone',
    [POOL.cmd_from_des]:     'From the designated zone',
    [POOL.cmd_from_target]:  'From the Target Zone',
    [POOL.cmd_evac_immediate]: 'Evacuate immediately',
    [POOL.cmd_safe_changed]: 'Safe zone has changed',
    [POOL.cmd_from_current]: 'From the current zone'
};

// ============================================================
// COMPOSITES — every entry yields EXACTLY 4 unique fragments.
// Fragments are pulled from the pool above. No fragment repeats
// within a composite, and each fragment contributes meaning.
// ============================================================
const COMPOSITES = [

    // 1) Fire at all zones → outside every platform.
    {
        fragments: [
            POOL.cmd_fire_all,
            POOL.zone_all,
            POOL.cmd_evac_immediate,
            POOL.cmd_evac_from_safe
        ],
        fullText: 'Commence fire at all zones. Evacuate immediately — even the safe zone.',
        explanation: 'No zone is safe. Stand outside every platform.',
        correctAction: { constraints: [{ type: 'outside' }] }
    },

    // 2) Fire all except Zone N → Zone N is safe.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_fire_all,
                POOL.zone_all,
                POOL.mod_except,
                zoneFrag(z)
            ],
            fullText: `Commence fire at all zones except Zone ${word(z)}.`,
            explanation: `Zone ${word(z)} is the only safe zone.`,
            correctAction: { constraints: [{ type: 'onZone', zone: z }] }
        };
    },

    // 3) Fire all except + evacuate to it.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_fire_all,
                POOL.zone_all,
                POOL.mod_except,
                POOL.cmd_evac_to_safe
            ],
            fullText: `Commence fire at all zones except Zone ${word(z)}. Evacuate to the safe zone.`,
            explanation: `Zone ${word(z)} is safe — move there.`,
            correctAction: { constraints: [{ type: 'onZone', zone: z }] }
        };
    },

    // 4) Focus fire — junk message, any position.
    {
        fragments: [
            POOL.cmd_focus_fire,
            POOL.zone_all,
            POOL.cmd_fire_all,
            POOL.cmd_evac_immediate
        ],
        fullText: 'Commence focus fire at all zones. Evacuate immediately.',
        explanation: 'Junk message — no fail. Any position is fine.',
        correctAction: { constraints: [{ type: 'any' }] }
    },

    // 5) Evacuate to Zone N.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_evac_to_safe,
                zoneFrag(z),
                POOL.cmd_evac_immediate,
                POOL.zone_all
            ],
            fullText: `Evacuate to the safe zone — Zone ${word(z)}. Evacuate immediately.`,
            explanation: `Move to Zone ${word(z)}.`,
            correctAction: { constraints: [{ type: 'onZone', zone: z }] }
        };
    },

    // 6) Evacuate from Zone N.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_evac_from,
                zoneFrag(z),
                POOL.cmd_evac_immediate,
                POOL.cmd_evac_to_safe
            ],
            fullText: `Evacuate from Zone ${word(z)}. Evacuate immediately to the safe zone.`,
            explanation: `Leave Zone ${word(z)}. Anywhere else is safe.`,
            correctAction: { constraints: [{ type: 'notOnZone', zone: z }] }
        };
    },

    // 7) Evacuate from Zone N to Zone M.
    (ctx) => {
        const a = ctx.pickZone();
        let b = ctx.pickZone();
        if (b === a) b = ((a % 4) + 1);
        return {
            fragments: [
                POOL.cmd_evac_from,
                zoneFrag(a),
                POOL.cmd_evac_to_safe,
                zoneFrag(b)
            ],
            fullText: `Evacuate from Zone ${word(a)} to the safe zone — Zone ${word(b)}.`,
            explanation: `Leave Zone ${word(a)}. Move to Zone ${word(b)}.`,
            correctAction: { constraints: [{ type: 'onZone', zone: b }] }
        };
    },

    // 8) Evacuate from the safe zone.
    (ctx) => {
        const z = ctx.safeZone;
        return {
            fragments: [
                POOL.cmd_evac_from_safe,
                zoneFrag(z),
                POOL.cmd_evac_immediate,
                POOL.zone_all
            ],
            fullText: `Evacuate from the safe zone — Zone ${word(z)}. Evacuate immediately.`,
            explanation: `Leave Zone ${word(z)}. Anywhere else is safe.`,
            correctAction: { constraints: [{ type: 'notOnZone', zone: z }] }
        };
    },

    // 9) Evacuate from Designated Zone.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_evac_from_des,
                zoneFrag(z),
                POOL.cmd_evac_immediate,
                POOL.zone_all
            ],
            fullText: `Evacuate from the designated zone (Zone ${word(z)}). Evacuate immediately.`,
            explanation: `Leave Zone ${word(z)}.`,
            correctAction: { constraints: [{ type: 'notOnZone', zone: z }] }
        };
    },

    // 10) From the designated zone.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_from_des,
                zoneFrag(z),
                POOL.cmd_evac_immediate,
                POOL.zone_all
            ],
            fullText: `From the designated zone (Zone ${word(z)}). Evacuate immediately.`,
            explanation: `Leave Zone ${word(z)}.`,
            correctAction: { constraints: [{ type: 'notOnZone', zone: z }] }
        };
    },

    // 11) From the Target Zone.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_from_target,
                zoneFrag(z),
                POOL.cmd_evac_immediate,
                POOL.zone_all
            ],
            fullText: `From the Target Zone (Zone ${word(z)}). Evacuate immediately.`,
            explanation: `Leave Zone ${word(z)} — it's the target.`,
            correctAction: { constraints: [{ type: 'notOnZone', zone: z }] }
        };
    },

    // 12) Evacuate immediately.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_evac_immediate,
                zoneFrag(z),
                POOL.cmd_evac_from,
                POOL.zone_all
            ],
            fullText: `Evacuate immediately from Zone ${word(z)}.`,
            explanation: `Leave Zone ${word(z)}. Anywhere else is safe.`,
            correctAction: { constraints: [{ type: 'notOnZone', zone: z }] }
        };
    },

    // 13) Safe zone has changed.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_safe_changed,
                zoneFrag(z),
                POOL.cmd_evac_to_safe,
                POOL.cmd_evac_immediate
            ],
            fullText: `Safe zone has changed to Zone ${word(z)}. Evacuate to it immediately.`,
            explanation: `Move to Zone ${word(z)}.`,
            correctAction: { constraints: [{ type: 'onZone', zone: z }] }
        };
    },

    // 14) From the current zone, to Zone N.
    (ctx) => {
        const z = ctx.pickZone();
        return {
            fragments: [
                POOL.cmd_from_current,
                zoneFrag(z),
                POOL.cmd_evac_to_safe,
                POOL.cmd_evac_immediate
            ],
            fullText: `From the current zone, to the safe zone — Zone ${word(z)}. Evacuate immediately.`,
            explanation: `Move to Zone ${word(z)}.`,
            correctAction: { constraints: [{ type: 'onZone', zone: z }] }
        };
    },

    // 15) Unit allocation (solo — no fail).
    (ctx) => {
        const a = ctx.pickZone();
        let b = ctx.pickZone();
        if (b === a) b = ((a % 4) + 1);
        const unitA = 1 + Math.floor(Math.random() * 3);          // 1–3
        let unitB = 1 + Math.floor(Math.random() * 3);
        if (unitB === unitA) unitB = ((unitA % 3) + 1);           // ensure different
        return {
            fragments: [
                zoneFrag(a),
                POOL[`unit_${unitA}`],
                zoneFrag(b),
                POOL[`unit_${unitB}`]
            ],
            fullText: `Zone ${word(a)}: ${unitA} unit${unitA > 1 ? 's' : ''}. Zone ${word(b)}: ${unitB} unit${unitB > 1 ? 's' : ''}.`,
            explanation: `Party assignment — no fail in solo practice. ${unitA} unit${unitA > 1 ? 's' : ''} → Zone ${word(a)}, ${unitB} unit${unitB > 1 ? 's' : ''} → Zone ${word(b)}.`,
            correctAction: { constraints: [{ type: 'any' }] }
        };
    }
];

// ============================================================
// COMPOSITE GENERATION
// ============================================================
function generateComposite(zoneNumbers, safeZone) {
    const ctx = {
        pickZone: () => zoneNumbers[Math.floor(Math.random() * 4)],
        safeZone
    };
    const entry = COMPOSITES[Math.floor(Math.random() * COMPOSITES.length)];
    return typeof entry === 'function' ? entry(ctx) : entry;
}

// ============================================================
// TRANSLATIONS
// ============================================================
const TRANSLATION_ROOT = 'system.simulator.radio';

const FALLBACK = {
    'ui.whisper_label': 'Intercepted Signal',
    'ui.timer_label': 'Time Left',
    'ui.start': 'Start',
    'ui.stop': 'Stop',
    'ui.reset': 'Reset',
    'ui.end_run': 'End Run',
    'ui.success': 'Safe!',
    'ui.fail': 'Caught!',
    'ui.result_title': 'Result',
    'ui.result_message': 'Message',
    'ui.result_yours': 'You were',
    'ui.result_safe': 'Safe spot',
    'ui.result_gloss': 'What they meant',
    'ui.result_zone': 'Zone {n}',
    'ui.result_ground': 'Ground',
    'ui.result_none': 'Outside all zones',
    'ui.result_retry': 'New message in 5s…',
    'ui.mobile_disabled': 'This simulator is available on desktop only.'
};

function t(path, vars = {}) {
    const full = `${TRANSLATION_ROOT}.${path}`;
    const keys = full.split('.');
    let node = data.translations;
    for (const k of keys) {
        if (!node || typeof node !== 'object' || !(k in node)) {
            return applyVars(FALLBACK[path] || path, vars);
        }
        node = node[k];
    }
    const lang = window.translationManager?.currentLang || 'en';
    const str = node[lang] || node.en || FALLBACK[path] || path;
    return applyVars(str, vars);
}
function applyVars(str, vars) {
    for (const [k, v] of Object.entries(vars)) str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    return str;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// ============================================================
// MAIN RENDER
// ============================================================
export function renderRadioSimulator(container, options = {}) {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
        || window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        const msg = document.createElement('div');
        msg.className = 'sim-mobile-disabled';
        msg.textContent = t('ui.mobile_disabled');
        container.appendChild(msg);
        return null;
    }

    const root = document.createElement('div');
    root.className = 'sim-root radio-root';
    container.appendChild(root);

    // ---- Header ----
    const header = document.createElement('div');
    header.className = 'sim-header';
    root.appendChild(header);

    const endBtn = document.createElement('button');
    endBtn.type = 'button';
    endBtn.className = 'sim-btn radio-end-btn';
    endBtn.textContent = t('ui.end_run');
    endBtn.disabled = true;
    header.appendChild(endBtn);

    const titleLabel = document.createElement('span');
    titleLabel.className = 'radio-title';
    titleLabel.textContent = 'Radio Transmission';
    header.appendChild(titleLabel);

    const startBtn = document.createElement('button');
    startBtn.type = 'button';
    startBtn.className = 'sim-btn sim-btn-primary';
    startBtn.textContent = t('ui.start');
    header.appendChild(startBtn);

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'sim-btn';
    resetBtn.textContent = t('ui.reset');
    header.appendChild(resetBtn);

    const timerWrap = document.createElement('div');
    timerWrap.className = 'radio-timer';
    const timerLabel = document.createElement('span');
    timerLabel.className = 'radio-timer-label';
    timerLabel.textContent = t('ui.timer_label');
    timerWrap.appendChild(timerLabel);
    const timerValue = document.createElement('span');
    timerValue.className = 'radio-timer-value';
    timerValue.textContent = '45.0';
    timerWrap.appendChild(timerValue);
    header.appendChild(timerWrap);

    // ---- Whisper panel ----
    const whisper = document.createElement('div');
    whisper.className = 'radio-whisper';
    const whisperLabel = document.createElement('div');
    whisperLabel.className = 'radio-whisper-label';
    whisperLabel.textContent = t('ui.whisper_label');
    whisper.appendChild(whisperLabel);
    const whisperBody = document.createElement('div');
    whisperBody.className = 'radio-whisper-body';
    whisper.appendChild(whisperBody);
    root.appendChild(whisper);

    // ---- Arena ----
    const arena = document.createElement('div');
    arena.className = 'sim-arena radio-arena';
    if (options.backgroundImage) {
        arena.style.backgroundImage = `url("${options.backgroundImage}")`;
        arena.style.backgroundSize = 'cover';
        arena.style.backgroundPosition = 'center';
        arena.classList.add('sim-arena-has-image');
    }
    root.appendChild(arena);

    const ground = document.createElement('div');
    ground.className = 'sim-ground';
    if (options.showGround === false) ground.style.display = 'none';
    arena.appendChild(ground);

    DECOR_PLATFORMS.forEach(p => {
        const el = document.createElement('div');
        el.className = 'radio-platform radio-platform-decor';
        el.style.left = `${p.x * 100}%`;
        el.style.top  = `${p.y * 100}%`;
        el.style.width = `${p.w * 100}%`;
        arena.appendChild(el);
    });

    const zoneEls = ZONE_SLOTS.map(slot => {
        const wrapper = document.createElement('div');
        wrapper.className = 'radio-zone';
        wrapper.style.left = `${slot.x * 100}%`;
        wrapper.style.top  = `${slot.y * 100}%`;
        wrapper.style.width = `${slot.w * 100}%`;
        const num = document.createElement('div');
        num.className = 'radio-zone-num';
        num.textContent = '1';
        wrapper.appendChild(num);
        arena.appendChild(wrapper);
        return { wrapper, numEl: num, slot };
    });

    const playerEl = document.createElement('div');
    playerEl.className = 'sim-player';
    playerEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="32" height="32">
            <ellipse cx="12" cy="22" rx="7" ry="2" fill="rgba(0,0,0,0.4)"/>
            <circle cx="12" cy="6" r="4" fill="#4dabf7"/>
            <rect x="8" y="10" width="8" height="8" rx="2" fill="#4dabf7"/>
            <rect x="9" y="18" width="2.5" height="4" fill="#4dabf7"/>
            <rect x="12.5" y="18" width="2.5" height="4" fill="#4dabf7"/>
        </svg>`;
    arena.appendChild(playerEl);

    const toast = document.createElement('div');
    toast.className = 'sim-toast';
    arena.appendChild(toast);

    const resultEl = document.createElement('div');
    resultEl.className = 'radio-result sim-hidden';
    arena.appendChild(resultEl);

    // ---- State ----
    const sim = {
        running: false,
        lastTime: 0,
        frameHandle: null,
        timer: 0,
        zoneNumbers: [1, 2, 3, 4],
        currentMessage: null,
        safeZone: 1,
        player: { x: 0.5, y: TIMING.GROUND_Y, vy: 0, grounded: true },
        keys: new Set(),
        resultShowing: false,
        resultTimer: 0,
        urgent: false
    };

    // ---- Helpers ----
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function renderWhisper(composite) {
        whisperBody.innerHTML = '';
        composite.fragments.forEach((f, i) => {
            const row = document.createElement('div');
            row.className = 'radio-whisper-row';
            row.style.animationDelay = `${i * 0.45}s`;
            const prefix = document.createElement('span');
            prefix.className = 'radio-whisper-prefix';
            prefix.textContent = '•';
            row.appendChild(prefix);
            const frag = document.createElement('span');
            frag.className = 'radio-whisper-fragment';
            frag.textContent = f;
            row.appendChild(frag);
            whisperBody.appendChild(row);
        });
    }

    function satisfies(playerZone, constraints) {
        return constraints.every(c => {
            switch (c.type) {
                case 'any':       return true;
                case 'outside':   return playerZone == null;
                case 'onZone':    return playerZone === c.zone;
                case 'notOnZone': return playerZone !== c.zone;
                default:          return false;
            }
        });
    }

    function assignZoneNumbers() {
        sim.zoneNumbers = shuffle([1, 2, 3, 4]);
        zoneEls.forEach((z, i) => {
            z.numEl.textContent = sim.zoneNumbers[i];
        });
        sim.safeZone = sim.zoneNumbers[Math.floor(Math.random() * 4)];
    }

    function getPlayerZone() {
        const px = sim.player.x;
        const py = sim.player.y;
        for (let i = 0; i < ZONE_SLOTS.length; i++) {
            const slot = ZONE_SLOTS[i];
            const half = slot.w / 2;
            if (Math.abs(px - slot.x) <= half + TIMING.ZONE_STAND_X_PAD
                && Math.abs(py - slot.y) <= TIMING.ZONE_STAND_Y_TOL) {
                return sim.zoneNumbers[i];
            }
        }
        return null;
    }

    function describePlayerPosition() {
        const z = getPlayerZone();
        if (z != null) return t('ui.result_zone', { n: z });
        return t('ui.result_ground');
    }

    function describeCorrectAction(action) {
        if (!action || !action.constraints) return '';
        const parts = action.constraints.map(c => {
            switch (c.type) {
                case 'any':       return t('ui.result_none');
                case 'outside':   return t('ui.result_none');
                case 'onZone':    return t('ui.result_zone', { n: c.zone });
                case 'notOnZone': return `NOT ${t('ui.result_zone', { n: c.zone })}`;
                default:          return '';
            }
        }).filter(Boolean);
        return parts.join(' · ');
    }

    // ---- Lifecycle ----
    function beginRun() {
        assignZoneNumbers();
        sim.currentMessage = generateComposite(sim.zoneNumbers, sim.safeZone);
        renderWhisper(sim.currentMessage);
        sim.player = { x: 0.5, y: TIMING.GROUND_Y, vy: 0, grounded: true };
        sim.timer = TIMING.RUN_MS;
        sim.resultShowing = false;
        sim.urgent = false;
        timerValue.classList.remove('is-urgent');
        resultEl.classList.add('sim-hidden');
        arena.classList.remove('radio-arena-fail', 'radio-arena-success');
        endBtn.disabled = false;
    }

    function endRun() {
        const msg = sim.currentMessage;
        const survived = satisfies(getPlayerZone(), msg.correctAction.constraints);

        if (survived) {
            toast.textContent = t('ui.success');
            toast.className = 'sim-toast sim-toast-success sim-toast-visible';
            arena.classList.add('radio-arena-success');
        } else {
            toast.textContent = t('ui.fail');
            toast.className = 'sim-toast sim-toast-whiff sim-toast-visible';
            arena.classList.add('radio-arena-fail');
        }
        setTimeout(() => toast.classList.remove('sim-toast-visible'), 1600);

        showResult(msg, survived);
        sim.resultShowing = true;
        sim.resultTimer = TIMING.RESULT_MS;
        endBtn.disabled = true;
    }

    function showResult(msg, survived) {
        const yourPos = describePlayerPosition();
        const correctPos = describeCorrectAction(msg.correctAction);
        const correctText = msg.fullText || '';
        const explanation = msg.explanation || '';

        // Build fragment glosses
        const glossRows = msg.fragments.map(f => {
            const meaning = GLOSS[f] || '—';
            return `
                <div class="radio-result-gloss-row">
                    <span class="radio-result-gloss-frag">${escapeHtml(f)}</span>
                    <span class="radio-result-gloss-arrow">→</span>
                    <span class="radio-result-gloss-meaning">${escapeHtml(meaning)}</span>
                </div>
            `;
        }).join('');

        resultEl.innerHTML = `
            <div class="radio-result-head">
                <div class="radio-result-verdict ${survived ? 'is-success' : 'is-fail'}">
                    ${survived ? t('ui.success') : t('ui.fail')}
                </div>
            </div>
            <div class="radio-result-row">
                <div class="radio-result-label">${t('ui.result_message')}</div>
                <div class="radio-result-value">${escapeHtml(correctText)}</div>
            </div>
            <div class="radio-result-row">
                <div class="radio-result-label">${t('ui.result_yours')}</div>
                <div class="radio-result-value">${escapeHtml(yourPos)}</div>
            </div>
            <div class="radio-result-row">
                <div class="radio-result-label">${t('ui.result_safe')}</div>
                <div class="radio-result-value">${escapeHtml(correctPos)}</div>
            </div>
            <div class="radio-result-gloss">
                <div class="radio-result-gloss-title">${t('ui.result_gloss')}</div>
                ${glossRows}
            </div>
            <div class="radio-result-hint">${escapeHtml(explanation)}</div>
            <div class="radio-result-retry">${t('ui.result_retry')}</div>
        `;
        resultEl.classList.remove('sim-hidden');
    }

    // ---- Input ----
    const ARROW_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);
    function onKeyDown(e) {
        if (!sim.running || !document.contains(root)) return;
        if (ARROW_KEYS.has(e.key)) {
            e.preventDefault();
            sim.keys.add(e.key);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (sim.player.grounded) {
                sim.player.vy = TIMING.JUMP_IMPULSE;
                sim.player.grounded = false;
            }
        }
    }
    function onKeyUp(e) {
        if (ARROW_KEYS.has(e.key)) sim.keys.delete(e.key);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    const cleanupObserver = new MutationObserver(() => {
        if (!document.contains(root)) {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            stopLoop();
            cleanupObserver.disconnect();
        }
    });
    cleanupObserver.observe(document.body, { childList: true, subtree: true });

    // ---- Loop ----
    function tick(now) {
        if (!sim.running) return;
        const dt = Math.min(80, now - sim.lastTime);
        sim.lastTime = now;

        if (!sim.resultShowing) {
            sim.timer = Math.max(0, sim.timer - dt);
            timerValue.textContent = (sim.timer / 1000).toFixed(1);

            // Urgency class
            if (!sim.urgent && sim.timer <= TIMING.URGENT_AT_MS) {
                sim.urgent = true;
                timerValue.classList.add('is-urgent');
            }

            if (sim.keys.has('ArrowLeft'))  sim.player.x -= TIMING.H_SPEED * dt;
            if (sim.keys.has('ArrowRight')) sim.player.x += TIMING.H_SPEED * dt;
            sim.player.x = clamp(sim.player.x, 0.05, 0.95);

            const prevY = sim.player.y;
            const fastFall = sim.keys.has('ArrowDown') && !sim.player.grounded;
            sim.player.vy += TIMING.GRAVITY * (fastFall ? 2.5 : 1) * dt;
            sim.player.y += sim.player.vy * dt;

            let landingY = TIMING.GROUND_Y;
            const allPlatforms = [...ZONE_SLOTS, ...DECOR_PLATFORMS];
            for (const p of allPlatforms) {
                const half = p.w / 2;
                const withinX = Math.abs(sim.player.x - p.x) <= half;
                if (!withinX) continue;
                const crossedFromAbove = prevY <= p.y + 0.001 && sim.player.y >= p.y;
                if (crossedFromAbove && p.y < landingY) landingY = p.y;
            }

            if (sim.player.y >= landingY) {
                sim.player.y = landingY;
                sim.player.vy = 0;
                sim.player.grounded = true;
            } else {
                sim.player.grounded = false;
            }

            playerEl.style.left = `${sim.player.x * 100}%`;
            playerEl.style.top  = `${sim.player.y * 100}%`;

            const playerZone = getPlayerZone();
            zoneEls.forEach((z, i) => {
                const isOn = sim.zoneNumbers[i] === playerZone;
                z.wrapper.classList.toggle('radio-zone-active', isOn);
            });

            if (sim.timer <= 0) endRun();
        } else {
            sim.resultTimer -= dt;
            if (sim.resultTimer <= 0) {
                resultEl.classList.add('sim-hidden');
                arena.classList.remove('radio-arena-fail', 'radio-arena-success');
                beginRun();
            }
        }

        sim.frameHandle = requestAnimationFrame(tick);
    }

    function startLoop() {
        sim.running = true;
        sim.lastTime = performance.now();
        sim.frameHandle = requestAnimationFrame(tick);
    }
    function stopLoop() {
        sim.running = false;
        if (sim.frameHandle) cancelAnimationFrame(sim.frameHandle);
        sim.frameHandle = null;
    }

    // ---- Buttons ----
    startBtn.addEventListener('click', () => {
        stopLoop();
        beginRun();
        startLoop();
        startBtn.textContent = t('ui.stop');
    });
    resetBtn.addEventListener('click', () => {
        stopLoop();
        startBtn.textContent = t('ui.start');
        sim.timer = TIMING.RUN_MS;
        timerValue.textContent = '45.0';
        timerValue.classList.remove('is-urgent');
        sim.urgent = false;
        resultEl.classList.add('sim-hidden');
        arena.classList.remove('radio-arena-fail', 'radio-arena-success');
        sim.resultShowing = false;
        endBtn.disabled = true;
        assignZoneNumbers();
        sim.currentMessage = generateComposite(sim.zoneNumbers, sim.safeZone);
        renderWhisper(sim.currentMessage);
        sim.player = { x: 0.5, y: TIMING.GROUND_Y, vy: 0, grounded: true };
        playerEl.style.left = '50%';
        playerEl.style.top  = `${TIMING.GROUND_Y * 100}%`;
    });
    endBtn.addEventListener('click', () => {
        if (!sim.running || sim.resultShowing) return;
        endRun();
    });

    // ---- Init ----
    assignZoneNumbers();
    sim.currentMessage = generateComposite(sim.zoneNumbers, sim.safeZone);
    renderWhisper(sim.currentMessage);
    timerValue.textContent = '45.0';

    return root;
}