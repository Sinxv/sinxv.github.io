import { data } from '/EHD.js';

// ============================================================
// TUNABLES
// ============================================================
const TIMING = {
    PARRY_WINDOW_MS: 800,
    PARRY_COOLDOWN_MS: 400,

    // --- Orb pulse intervals (used ONLY by the methane orb) ---
    ORB_PULSE_BLUE_MS: 600,
    ORB_PULSE_RED_MS: 500,
    ORB_PULSE_YELLOW_MS: 400,

    // --- Base flash intervals (punch, stomp, discharge) ---
    BASE_PULSE_BLUE_MS: 600,
    BASE_PULSE_RED_MS: 500,
    BASE_PULSE_YELLOW_MS: 400,

    STAGGER_MS: 1200,
    PARRY_RESTRICTION_MS: 15000,

    // Punch
    PUNCH_WINDUP_MS: 300,
    PUNCH_GAP_MS: 300,
    PUNCH_FIST_MS: 180,
    PUNCH_RECOVER_MS: 900,

    // Stomp
    CHARGE_MS: 1000,
    JUMP_OUT_MS: 350,
    FALL_MS: 550,
    LAND_RECOVER_MS: 900,

    // Red dim / bright
    RED_DIM_MS: 300,
    RED_BRIGHT_MS: 300,

    // Yellow count
    YELLOW_PARRIES_ON_PULSE: 4,

    // Methane orb
    ORB_SPAWN_MS: 1500,
    ORB_TRAVEL_SPEED: {
        blue:   0.00006,
        red:    0.00012,
        yellow: 0.00018
    },
    ORB_PUSHBACK_MS: 400,
    ORB_PUSHBACK_DIST: 0.08,
    ORB_REQUIRED_PARRIES: 4,

    // Parry Discharge
    DISCHARGE_IDLE_MS: 600,
    DISCHARGE_RECOVER_MS: 500,
    DISCHARGE_SLAMS: 6,
    DISCHARGE_BLUE_WINDOW_MS: 1500,   // ← was PULSE_BLUE_MS
    DISCHARGE_RED_WINDOW_MS: 1000,    // ← was RED_BRIGHT_MS
    DISCHARGE_YELLOW_WINDOW_MS: 500, // ← was PULSE_YELLOW_MS

    // Physics
    GRAVITY: 0.0012,
    JUMP_IMPULSE: -0.35,
    GROUND_Y: 0.85,
    FAST_FALL_MULT: 2.2,

    // Flash timing
    FLASH_FADE_IN_MS: 200,
    FLASH_FULL_OPACITY: 1.0,
    FLASH_DIM_OPACITY: 0.45
};

const TRANSLATION_ROOT = 'system.simulator.undertow';

const FALLBACK = {
    'ui.mechanic_label': 'Mechanic',
    'ui.color_label': 'Color',
    'ui.color_blue': 'Blue',
    'ui.color_red': 'Red',
    'ui.color_yellow': 'Yellow',
    'ui.start': 'Start',
    'ui.stop': 'Stop',
    'ui.reset': 'Reset',
    'ui.ping_label': 'Simulated Ping',
    'ui.success': 'Perfect Parry!',
    'ui.whiff': 'Missed',
    'ui.air_parry': 'Cannot parry mid-air',
    'ui.mobile_disabled': 'The parry simulator is available on desktop only.',
    'ui.stats_success': 'Parries: {n}',
    'ui.stats_whiff': 'Misses: {n}',
    'ui.prompt_punch_blue': 'Blue — parry on the flash',
    'ui.prompt_punch_red': 'Red — parry on the bright flash',
    'ui.prompt_punch_yellow': 'Yellow — parry on the 4th pulse',
    'ui.prompt_stomp_blue': 'Blue — parry when Marcus lands',
    'ui.prompt_stomp_red': 'Red — parry on the bright flash after landing',
    'ui.prompt_stomp_yellow': 'Yellow — parry on the 4th pulse after landing',
    'ui.prompt_orb_blue': 'Parry the orb on the 6th blue pulse',
    'ui.prompt_orb_red': 'Parry the orb on the 4th red pulse',
    'ui.prompt_orb_yellow': 'Parry the orb on the 2nd yellow pulse',
    'ui.prompt_discharge_blue': 'Blue flash — parry immediately',
    'ui.prompt_discharge_red': 'Wait for the bright red — parry then',
    'ui.prompt_discharge_yellow': 'Wait for the 4th pulse',
    'ui.end_dispelled': 'Mechanic cleared!',
    'ui.end_wipe': 'Failed the mechanic.',
    'mechanics.marcus_punch': 'Punch Parry',
    'mechanics.marcus_stomp': 'Stomp Parry',
    'mechanics.methane_orb': 'Giant Methane Orb',
    'mechanics.parry_discharge': 'Parry Discharge'
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
    for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, v);
    return str;
}

// ============================================================
// SPRITES
// ============================================================
const SPRITES = {
    player: `<svg viewBox="0 0 24 24" width="32" height="32">
        <ellipse cx="12" cy="22" rx="7" ry="2" fill="rgba(0,0,0,0.4)"/>
        <circle cx="12" cy="6" r="4" fill="#4dabf7"/>
        <rect x="8" y="10" width="8" height="8" rx="2" fill="#4dabf7"/>
        <rect x="9" y="18" width="2.5" height="4" fill="#4dabf7"/>
        <rect x="12.5" y="18" width="2.5" height="4" fill="#4dabf7"/>
    </svg>`,
    marcus: `<img src="/images/markos.png" alt="Marcus" class="sim-marcus-img" draggable="false">`,
    fist: `<svg viewBox="0 0 24 24" width="28" height="28">
        <path d="M5 10 h10 a3 3 0 0 1 3 3 v3 a4 4 0 0 1 -4 4 h-6 a4 4 0 0 1 -4 -4 v-3 a3 3 0 0 1 1 -3 z"
              fill="#f0c68f" stroke="#8a5a2b" stroke-width="1.4"/>
        <line x1="8"  y1="10" x2="8"  y2="14" stroke="#8a5a2b" stroke-width="1.2"/>
        <line x1="11" y1="10" x2="11" y2="14" stroke="#8a5a2b" stroke-width="1.2"/>
        <line x1="14" y1="10" x2="14" y2="14" stroke="#8a5a2b" stroke-width="1.2"/>
    </svg>`,
    parry_ring: `<svg viewBox="0 0 32 32" width="48" height="48">
        <circle cx="16" cy="16" r="14" fill="none" stroke="#ffe066" stroke-width="3" opacity="0.95"/>
    </svg>`,
    target_marker: `<svg viewBox="0 0 40 40" width="48" height="48">
        <circle cx="20" cy="20" r="14" fill="none" stroke="#ff5c5c" stroke-width="2" opacity="0.9"/>
        <circle cx="20" cy="20" r="6" fill="none" stroke="#ff5c5c" stroke-width="2" opacity="0.9"/>
        <line x1="20" y1="2"  x2="20" y2="10" stroke="#ff5c5c" stroke-width="2"/>
        <line x1="20" y1="30" x2="20" y2="38" stroke="#ff5c5c" stroke-width="2"/>
        <line x1="2"  y1="20" x2="10" y2="20" stroke="#ff5c5c" stroke-width="2"/>
        <line x1="30" y1="20" x2="38" y2="20" stroke="#ff5c5c" stroke-width="2"/>
    </svg>`
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ============================================================
// SHARED COLOR SEQUENCE
// Runs the universal timing rule for a color and calls
// sim.openParryWindow() at the right moment.
// The "source" controls which visual element glows.
// ============================================================
function runColorSequence(sim, color, source = 'marcus', windowMs = null) {
    const seq = {
        color,
        source,
        phase: 'init',
        timer: 0,
        pulses: 0
    };
    seq.windowMs = windowMs ?? TIMING.PARRY_WINDOW_MS;
    if (color === 'blue') {
        seq.phase = 'init';
    } else if (color === 'red') {
        seq.phase = 'dim';
    } else if (color === 'yellow') {
        seq.phase = 'pulse';
    }
    return seq;
}

function tickColorSequence(sim, seq, dt) {
    seq.timer += dt;

    if (seq.phase === 'init') {
        if (seq.color === 'blue') {
            sim.triggerFlash('blue', seq.source);
            sim.openParryWindow(seq.windowMs);
            seq.phase = 'window';
        } else if (seq.color === 'red') {
            // skip to dim on first tick
            seq.phase = 'dim';
            seq.timer = 0;
        } else if (seq.color === 'yellow') {
            // start pulse chain
            seq.phase = 'pulse';
            seq.timer = 0;
            seq.pulses = 0;
        }
    } else if (seq.phase === 'dim') {
        if (seq.timer >= TIMING.RED_DIM_MS) {
            sim.triggerFlash('red', seq.source, { dim: true });
            seq.timer = 0;
            seq.phase = 'bright';
        }
    } else if (seq.phase === 'bright') {
        if (seq.timer >= TIMING.RED_BRIGHT_MS) {
            sim.triggerFlash('red', seq.source);
            sim.openParryWindow(seq.windowMs);
            seq.phase = 'window';
        }
    } else if (seq.phase === 'pulse') {
        const interval = TIMING.BASE_PULSE_YELLOW_MS;
        if (seq.timer >= interval) {
            seq.timer = 0;
            seq.pulses++;
            sim.triggerFlash('yellow', seq.source);
            if (seq.pulses >= TIMING.YELLOW_PARRIES_ON_PULSE) {
                sim.openParryWindow(seq.windowMs);
                seq.phase = 'window';
            }
        }
    } else if (seq.phase === 'window') {
        if (!sim.isParryWindowOpen()) {
            seq.phase = 'done';
        }
    }
    return seq.phase === 'done';
}

// ============================================================
// MECHANICS
// ============================================================
const MECHANICS = {

    // ---------------------------------------------
    // MARCUS PUNCH — 2 punches, charge, jump out, fall on player, color seq
    // ---------------------------------------------
    marcus_punch: {
        labelKey: 'mechanics.marcus_punch',
        supportsColor: true,
        init(sim) {
            sim.marcus.x = 0.5;          // Marcus at center
            sim.marcus.y = TIMING.GROUND_Y;
            sim.marcus.visible = true;
            sim.player.x = 0.5 + 0.18;   // player spawns near Marcus
            sim.player.y = TIMING.GROUND_Y;
            sim.player.vy = 0;
            sim.lockMovement(false);
            sim.hideTargetMarker();

            sim.mech = {
                phase: 'windup',
                timer: 0,
                seq: null
            };
            sim.setPrompt(`ui.prompt_punch_${sim.selectedColor}`);
        },
        update(sim, dt) {
            const m = sim.mech;
            m.timer += dt;

            switch (m.phase) {
                case 'windup':
                    if (m.timer >= TIMING.PUNCH_WINDUP_MS) {
                        m.timer = 0;
                        m.phase = 'punch1';
                        sim.showFist();
                    }
                    break;
                case 'punch1':
                    if (m.timer >= TIMING.PUNCH_GAP_MS) {
                        m.timer = 0;
                        m.phase = 'punch2';
                        sim.showFist();
                    }
                    break;
                case 'punch2':
                    if (m.timer >= TIMING.PUNCH_GAP_MS) {
                        m.timer = 0;
                        m.phase = 'charge';
                    }
                    break;

                case 'charge':
                    // Red dim on the ground near the end of the charge
                    if (sim.selectedColor === 'red' && m.timer >= TIMING.CHARGE_MS - TIMING.RED_DIM_MS) {
                        sim.triggerFlash('red', 'marcus', { dim: true });
                    }
                    if (m.timer >= TIMING.CHARGE_MS) {
                        m.timer = 0;
                        m.phase = 'seq';
                        m.seq = runColorSequence(sim, sim.selectedColor, 'marcus');
                    }
                    break;

                case 'seq':
                    if (tickColorSequence(sim, m.seq, dt)) {
                        m.timer = 0;
                        m.phase = 'recover';
                    }
                    break;

                case 'recover':
                    if (m.timer >= TIMING.PUNCH_RECOVER_MS) {
                        m.timer = 0;
                        m.phase = 'windup';
                    }
                    break;
            }
        },
        onParry(sim, success) {
            if (success) sim.logSuccess(); else sim.logWhiff();
        }
    },

    // ---------------------------------------------
    // MARCUS STOMP — charge, jump out, fall on player, color seq
    // ---------------------------------------------
    marcus_stomp: {
        labelKey: 'mechanics.marcus_stomp',
        supportsColor: true,
        init(sim) {
            // Marcus at a random position, player at center
            sim.marcus.x = 0.15 + Math.random() * 0.7;   // anywhere 0.15 .. 0.85
            sim.marcus.y = TIMING.GROUND_Y;
            sim.marcus.visible = true;
            sim.player.x = 0.5;
            sim.player.y = TIMING.GROUND_Y;
            sim.player.vy = 0;
            sim.lockMovement(false);
            sim.hideTargetMarker();

            sim.mech = {
                phase: 'charge',
                timer: 0,
                jumpT: 0,
                jumpTargetX: sim.player.x,
                seq: null
            };
            sim.setPrompt(`ui.prompt_stomp_${sim.selectedColor}`);
        },
        update(sim, dt) {
            const m = sim.mech;
            m.timer += dt;

            switch (m.phase) {
                case 'charge':
                    sim.lockMovement(true);
                    // Red dim near the end of charge, on the ground
                    if (sim.selectedColor === 'red' && m.timer >= TIMING.CHARGE_MS - TIMING.RED_DIM_MS) {
                        sim.triggerFlash('red', 'marcus', { dim: true });
                    }
                    if (m.timer >= TIMING.CHARGE_MS) {
                        m.timer = 0;
                        m.phase = 'rise';
                        m.jumpT = 0;
                        m.jumpTargetX = sim.player.x;
                    }
                    break;

                case 'rise':
                    // Vertical: just go straight up from current X. No horizontal drift.
                    m.jumpT += dt;
                    {
                        const k = clamp(m.jumpT / TIMING.JUMP_OUT_MS, 0, 1);
                        sim.marcus.y = TIMING.GROUND_Y - k * 1.4;
                        // Teleport horizontally once airborne so he falls on the player
                        if (k >= 0.9) {
                            sim.marcus.x = m.jumpTargetX;
                        }
                    }
                    if (m.jumpT >= TIMING.JUMP_OUT_MS) {
                        m.jumpT = 0;
                        m.phase = 'fall';
                        sim.marcus.x = m.jumpTargetX;
                    }
                    break;

                case 'fall':
                    m.jumpT += dt;
                    {
                        const k = clamp(m.jumpT / TIMING.FALL_MS, 0, 1);
                        sim.marcus.y = -0.4 + (TIMING.GROUND_Y + 0.4) * k;
                    }
                    if (m.jumpT >= TIMING.FALL_MS) {
                        sim.marcus.y = TIMING.GROUND_Y;
                        m.timer = 0;
                        m.phase = 'seq';
                        m.seq = runColorSequence(sim, sim.selectedColor, 'marcus');
                    }
                    break;

                case 'seq':
                    if (tickColorSequence(sim, m.seq, dt)) {
                        m.timer = 0;
                        m.phase = 'recover';
                    }
                    break;

                case 'recover':
                    if (m.timer >= TIMING.LAND_RECOVER_MS) {
                        sim.lockMovement(false);
                        m.timer = 0;
                        m.phase = 'charge';
                        // Re-roll Marcus's starting position for next cycle
                        sim.marcus.x = 0.15 + Math.random() * 0.7;
                        sim.marcus.y = TIMING.GROUND_Y;
                    }
                    break;
            }
        },
        onParry(sim, success) {
            if (success) sim.logSuccess(); else sim.logWhiff();
        }
    },

    // ---------------------------------------------
    // GIANT METHANE ORB — parry the orb, at player height
    // Color rule differs from base: target pulse count per color.
    // ---------------------------------------------
    methane_orb: {
        labelKey: 'mechanics.methane_orb',
        supportsColor: false,
        init(sim) {
            sim.player.x = 0.35;
            sim.player.y = TIMING.GROUND_Y;
            sim.player.vy = 0;
            sim.marcus.x = 0.88;
            sim.marcus.y = TIMING.GROUND_Y;
            sim.marcus.visible = true;
            sim.lockMovement(false);
            sim.hideTargetMarker();

            sim.mech = {
                color: sim.selectedColor || 'blue',
                interval: TIMING.PULSE_BLUE_MS,
                targetPulse: 6,
                pulseTimer: 0,
                pulseCount: 0,
                orbX: 0.82,
                orbY: 0.78,          // player-height (chest/torso)
                orbActive: false,
                spawnTimer: 0,
                pushbackTimer: 0,
                pushbackDir: 1,
                parriesLeft: TIMING.ORB_REQUIRED_PARRIES,
                parryWindowOpened: false
            };
            // Orb always starts blue per fight behavior
            applyOrbColor(sim, 'blue');
            sim.setPrompt('ui.prompt_orb_blue');
        },
        update(sim, dt) {
            const m = sim.mech;

            if (!m.orbActive) {
                m.spawnTimer += dt;
                if (m.spawnTimer >= TIMING.ORB_SPAWN_MS) {
                    m.orbActive = true;
                    m.pulseTimer = 0;
                    m.pulseCount = 0;
                    m.parryWindowOpened = false;
                }
                return;
            }

            m.pulseTimer += dt;
            if (m.pulseTimer >= m.interval) {
                m.pulseTimer = 0;
                if (m.pulseCount < m.targetPulse) {
                    m.pulseCount++;
                    sim.triggerFlash(m.color, 'orb');
                    if (m.pulseCount === m.targetPulse && !m.parryWindowOpened) {
                        sim.openParryWindow(m.parryWindowMs);
                        m.parryWindowOpened = true;
                    }
                }
            }

            // Always check the whiff condition every tick
            if (m.parryWindowOpened && !sim.isParryWindowOpen()) {
                m.pulseCount = 0;
                m.pulseTimer = 0;
                m.parryWindowOpened = false;
                sim.logWhiff();
                sim.closeParryWindow();
            }

            if (m.pushbackTimer > 0) {
                const step = (TIMING.ORB_PUSHBACK_DIST * dt / TIMING.ORB_PUSHBACK_MS);
                m.orbX += step * m.pushbackDir;
                m.pushbackTimer -= dt;
            } else {
                const speed = TIMING.ORB_TRAVEL_SPEED[m.color] || TIMING.ORB_TRAVEL_SPEED.blue;
                m.orbX -= speed * dt;
            }
            m.orbX = clamp(m.orbX, 0, 1);

            if (m.orbX <= 0.02 && m.pushbackTimer <= 0) {
                sim.finish('ui.end_wipe');
            }
        },
        onParry(sim, success) {
            const m = sim.mech;
            if (success) {
                sim.logSuccess();
                m.parriesLeft--;
                m.pushbackTimer = TIMING.ORB_PUSHBACK_MS;
                m.pushbackDir = 1;
                if (m.parriesLeft <= 0) {
                    sim.finish('ui.end_dispelled');
                    return;
                }
                advanceOrb(sim);
            } else {
                sim.logWhiff();
            }
        }
    },

    // ---------------------------------------------
    // PARRY DISCHARGE — Marcus centered, uses the universal color rule
    // ---------------------------------------------
    parry_discharge: {
        labelKey: 'mechanics.parry_discharge',
        supportsColor: false,
        init(sim) {
            sim.player.x = 0.5;
            sim.player.y = TIMING.GROUND_Y;
            sim.player.vy = 0;
            sim.marcus.x = 0.5;
            sim.marcus.y = TIMING.GROUND_Y;
            sim.marcus.visible = true;
            sim.lockMovement(false);
            sim.hideTargetMarker();

            sim.mech = {
                phase: 'idle',
                timer: 0,
                slamIndex: 0,
                totalSlams: TIMING.DISCHARGE_SLAMS,
                color: null,
                yellowCount: 0,
                dimFlashFired: false,
                parryWindowOpened: false
            };
            sim.setPrompt('ui.prompt_discharge_blue');
        },
        update(sim, dt) {
            const m = sim.mech;
            m.timer += dt;

            switch (m.phase) {
                case 'idle':
                    if (m.timer >= TIMING.DISCHARGE_IDLE_MS) {
                        m.timer = 0;
                        startDischargePhase(sim);
                    }
                    break;

                case 'blue':
                    sim.triggerFlash('blue', 'marcus');
                    sim.openParryWindow(TIMING.DISCHARGE_BLUE_WINDOW_MS);
                    m.parryWindowOpened = true;
                    m.phase = 'wait_parry';
                    m.timer = 0;
                    break;

                case 'red_dim':
                    if (!m.dimFlashFired) {
                        sim.triggerFlash('red', 'marcus', { dim: true });
                        m.dimFlashFired = true;
                    }
                    if (m.timer >= TIMING.RED_DIM_MS) {
                        m.timer = 0;
                        m.dimFlashFired = false;
                        m.phase = 'red_bright';
                    }
                    break;

                case 'red_bright':
                    sim.triggerFlash('red', 'marcus');
                    sim.openParryWindow(TIMING.DISCHARGE_RED_WINDOW_MS);
                    m.parryWindowOpened = true;
                    m.phase = 'wait_parry';
                    m.timer = 0;
                    break;

                case 'yellow':
                    if (m.timer >= TIMING.BASE_PULSE_YELLOW_MS) {
                        m.timer = 0;
                        m.yellowCount++;
                        sim.triggerFlash('yellow', 'marcus');
                        if (m.yellowCount >= TIMING.YELLOW_PARRIES_ON_PULSE) {
                            sim.openParryWindow(TIMING.DISCHARGE_YELLOW_WINDOW_MS);
                            m.parryWindowOpened = true;
                            m.phase = 'wait_parry';
                        }
                    }
                    break;

                case 'wait_parry':
                    if (!sim.isParryWindowOpen()) {
                        sim.logWhiff();
                        m.timer = 0;
                        m.phase = 'recover';
                    }
                    break;

                case 'recover':
                    if (m.timer >= TIMING.DISCHARGE_RECOVER_MS) {
                        m.slamIndex++;
                        if (m.slamIndex >= m.totalSlams) {
                            sim.finish('ui.end_dispelled2');
                            return;
                        }
                        m.timer = 0;
                        m.phase = 'idle';
                    }
                    break;
            }
        },
        onParry(sim, success) {
            if (success) {
                sim.logSuccess();
                const m = sim.mech;
                m.phase = 'recover';
                m.timer = 0;
            } else {
                sim.logWhiff();
            }
        }
    }
};

// ---------------------------------------------
// Orb color helper
// ---------------------------------------------

function startDischargePhase(sim) {
    const m = sim.mech;
    const next = ['blue', 'red', 'yellow'][Math.floor(Math.random() * 3)];

    m.color = next;
    m.timer = 0;
    m.yellowCount = 0;
    m.parryWindowOpened = false;

    if (next === 'blue') {
        m.phase = 'blue';
        sim.setPrompt('ui.prompt_discharge_blue');
    } else if (next === 'red') {
        m.phase = 'red_dim';
        sim.setPrompt('ui.prompt_discharge_red');
    } else {
        m.phase = 'yellow';
        sim.setPrompt('ui.prompt_discharge_yellow');
    }
}

function applyOrbColor(sim, color) {
    const m = sim.mech;
    m.color = color;
    m.pulseCount = 0;
    m.pulseTimer = 0;
    m.parryWindowOpened = false;
    if (color === 'blue') {
        m.interval = TIMING.ORB_PULSE_BLUE_MS;   m.targetPulse = 6;
        sim.setPrompt('ui.prompt_orb_blue');
    } else if (color === 'red') {
        m.interval = TIMING.ORB_PULSE_RED_MS;    m.targetPulse = 4;
        sim.setPrompt('ui.prompt_orb_red');
    } else {
        m.interval = TIMING.ORB_PULSE_YELLOW_MS; m.targetPulse = 2;
        sim.setPrompt('ui.prompt_orb_yellow');
    }
    m.parryWindowMs = m.interval;
}
function advanceOrb(sim) {
    const next = ['blue','red','yellow'][Math.floor(Math.random()*3)];
    applyOrbColor(sim, next);
}

// ============================================================
// MAIN RENDER
// ============================================================
export function renderParrySimulator(container, options) {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
        || window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        const msg = document.createElement('div');
        msg.className = 'sim-mobile-disabled';
        msg.textContent = t('ui.mobile_disabled');
        container.appendChild(msg);
        return null;
    }
    if (options.backgroundImage) {
        arena.style.backgroundImage = `url("${options.backgroundImage}")`;
        arena.style.backgroundSize = 'cover';
        arena.style.backgroundPosition = 'center';
        arena.classList.add('sim-arena-has-image');
    }
    if (options.showGround === false) {
        ground.style.display = 'none';
    }

    const root = document.createElement('div');
    root.className = 'sim-root';
    container.appendChild(root);

    // ---- Header ----
    const header = document.createElement('div');
    header.className = 'sim-header';
    root.appendChild(header);

    const mechLabel = document.createElement('label');
    mechLabel.className = 'sim-mech-label';
    mechLabel.textContent = t('ui.mechanic_label');
    header.appendChild(mechLabel);

    const mechSelect = document.createElement('select');
    mechSelect.className = 'sim-mech-select';
    Object.entries(MECHANICS).forEach(([id, def]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = t(def.labelKey);
        mechSelect.appendChild(opt);
    });
    header.appendChild(mechSelect);

    // Color selector
    const colorWrap = document.createElement('div');
    colorWrap.className = 'sim-color-wrap';
    const colorLabel = document.createElement('label');
    colorLabel.className = 'sim-color-label';
    colorLabel.textContent = t('ui.color_label');
    colorWrap.appendChild(colorLabel);

    const colorSelect = document.createElement('select');
    colorSelect.className = 'sim-color-select';
    ['blue', 'red', 'yellow'].forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = t(`ui.color_${c}`);
        colorSelect.appendChild(opt);
    });
    colorWrap.appendChild(colorSelect);
    header.appendChild(colorWrap);

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

    const pingWrap = document.createElement('div');
    pingWrap.className = 'sim-ping';
    const pingLabel = document.createElement('label');
    pingLabel.className = 'sim-ping-label';
    pingLabel.textContent = t('ui.ping_label');
    pingWrap.appendChild(pingLabel);
    const pingInput = document.createElement('input');
    pingInput.type = 'range';
    pingInput.min = '0'; pingInput.max = '300'; pingInput.step = '10'; pingInput.value = '0';
    pingWrap.appendChild(pingInput);
    const pingValue = document.createElement('span');
    pingValue.className = 'sim-ping-value';
    pingValue.textContent = '0ms';
    pingWrap.appendChild(pingValue);
    header.appendChild(pingWrap);

    // ---- Arena ----
    const arena = document.createElement('div');
    arena.className = 'sim-arena';
    root.appendChild(arena);

    const ground = document.createElement('div');
    ground.className = 'sim-ground';
    arena.appendChild(ground);

    const brightFlash = document.createElement('div');
    brightFlash.className = 'sim-bright-flash';
    arena.appendChild(brightFlash);

    const attackerFlash = document.createElement('div');
    attackerFlash.className = 'sim-attacker-flash';
    arena.appendChild(attackerFlash);

    const marcusEl = document.createElement('div');
    marcusEl.className = 'sim-marcus';
    marcusEl.innerHTML = SPRITES.marcus;
    arena.appendChild(marcusEl);

    // Fist overlay (for punch mechanic)
    const fistEl = document.createElement('div');
    fistEl.className = 'sim-fist sim-hidden';
    fistEl.innerHTML = SPRITES.fist;
    arena.appendChild(fistEl);

    const orbEl = document.createElement('div');
    orbEl.className = 'sim-orb sim-orb-hidden';
    arena.appendChild(orbEl);

    const pulseCounter = document.createElement('div');
    pulseCounter.className = 'sim-pulse-counter sim-hidden';
    arena.appendChild(pulseCounter);

    const targetMarker = document.createElement('div');
    targetMarker.className = 'sim-target-marker sim-hidden';
    targetMarker.innerHTML = SPRITES.target_marker;
    arena.appendChild(targetMarker);

    const playerEl = document.createElement('div');
    playerEl.className = 'sim-player';
    playerEl.innerHTML = SPRITES.player;
    const parryRing = document.createElement('div');
    parryRing.className = 'sim-parry-ring sim-hidden';
    parryRing.innerHTML = SPRITES.parry_ring;
    playerEl.appendChild(parryRing);
    arena.appendChild(playerEl);

    const promptBar = document.createElement('div');
    promptBar.className = 'sim-prompt';
    root.appendChild(promptBar);

    const statsBar = document.createElement('div');
    statsBar.className = 'sim-stats';
    root.appendChild(statsBar);

    const toast = document.createElement('div');
    toast.className = 'sim-toast';
    root.appendChild(toast);

    // ---- State ----
    const sim = {
        running: false,
        mechanicId: 'marcus_punch',
        selectedColor: 'blue',
        mech: null,
        lastTime: 0,
        frameHandle: null,

        player: { x: 0.35, y: TIMING.GROUND_Y, vy: 0 },
        marcus: { x: 0.55, y: TIMING.GROUND_Y, visible: true },
        movementLocked: false,

        keys: new Set(),
        pingMs: 0,
        inputQueue: [],

        parryWindowStart: 0,
        parryWindowEnd: 0,
        parryArmedAt: 0,
        parryCooldownUntil: 0,

        successes: 0,
        whiffs: 0,
        flashTimer: 0,
        flashColor: null,

        restrictionUntil: 0
    };

    // ---- Public API ----
    sim.setPrompt = (key) => { promptBar.textContent = t(key); };
    sim.logSuccess = () => { sim.successes++; updateStats(); };
    sim.logWhiff   = () => { sim.whiffs++;    updateStats(); };
    sim.finish     = (key) => {
        showToast(t(key), key.includes('wipe') ? 'whiff' : 'success');
        stopLoop();
    };

    sim.triggerFlash = function (color, source = 'marcus', opts = {}) {
        sim.flashColor = color;

        if (source === 'orb') {
            orbEl.dataset.color = color;
            orbEl.classList.add('sim-orb-pulse');
            setTimeout(() => orbEl.classList.remove('sim-orb-pulse'), 150);
            return;
        }

        if (opts.dim) {
            // Dim baseline — persistent until the parry window closes
            attackerFlash.className = `sim-attacker-flash sim-flash-${color} sim-flash-dim`;
            attackerFlash.style.opacity = 0;
            attackerFlash.dataset.state = 'in';
            attackerFlash.dataset.timer = '0';
        } else {
            // Bright overlay
            brightFlash.className = `sim-bright-flash sim-flash-${color}`;
            brightFlash.style.opacity = 0;
            brightFlash.dataset.state = 'in';
            brightFlash.dataset.timer = '0';
        }
    };

    sim.openParryWindow = function (durationMs) {
        const now = performance.now();
        sim.parryWindowStart = now;
        sim.parryWindowEnd   = now + (durationMs ?? TIMING.PARRY_WINDOW_MS);
    };
    sim.closeParryWindow = function () {
        sim.parryWindowStart = 0;
        sim.parryWindowEnd   = 0;
    };
    sim.isParryWindowOpen = function () {
        const now = performance.now();
        return sim.parryWindowStart > 0 && now <= sim.parryWindowEnd;
    };
    sim.lockMovement = function (lock) { sim.movementLocked = !!lock; };
    sim.showTargetMarker = function (x) {
        targetMarker.style.left = `${x * 100}%`;
        targetMarker.classList.remove('sim-hidden');
    };
    sim.hideTargetMarker = function () {
        targetMarker.classList.add('sim-hidden');
    };
    sim.resetPositions = function () {
        sim.marcus.x = sim.mechanicId === 'parry_discharge' ? 0.5
                     : sim.mechanicId === 'methane_orb' ? 0.88
                     : 0.6;
        sim.marcus.y = TIMING.GROUND_Y;
        sim.marcus.visible = true;
    };

    sim.isPlayerAirborne = function () {
        return sim.player.y < TIMING.GROUND_Y - 0.01;
    };

    function enqueue(type, payload) {
        sim.inputQueue.push({ at: performance.now() + sim.pingMs, type, payload });
    }

    function drainQueue(now) {
        while (sim.inputQueue.length && sim.inputQueue[0].at <= now) {
            const ev = sim.inputQueue.shift();
            if (ev.type === 'parry') doParry();
        }
    }
    sim.tryJump = function () {
        if (sim.player.y >= TIMING.GROUND_Y - 0.001) {
            sim.player.vy = TIMING.JUMP_IMPULSE;
        }
    };

    const ARROW_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);
    function onKeyDown(e) {
        if (!sim.running || !document.contains(root)) return;

        if (ARROW_KEYS.has(e.key)) {
            e.preventDefault();
            if (!sim.keys.has(e.key)) sim.keys.add(e.key);   // ← direct, no queue
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            sim.tryJump();                                    // ← direct
        } else if (e.key === 'F1') {
            e.preventDefault();
            enqueue('parry');                                 // ← only this is delayed
        }
    }
    function onKeyUp(e) {
        if (ARROW_KEYS.has(e.key)) sim.keys.delete(e.key);   // ← direct
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

    // ---- Parry ----
    function doParry() {
        const now = performance.now();
        if (now < sim.parryCooldownUntil) return;

        // Disable parry while airborne
        if (sim.isPlayerAirborne()) {
            showToast(t('ui.air_parry'), 'whiff');
            return;
        }

        sim.parryArmedAt = now;
        parryRing.classList.remove('sim-hidden');
        setTimeout(() => parryRing.classList.add('sim-hidden'), 200);

        const success = sim.isParryWindowOpen();
        if (success) {
            sim.restrictionUntil = now + TIMING.PARRY_RESTRICTION_MS;
            showToast(t('ui.success'), 'success');
            sim.closeParryWindow();
        } else {
            showToast(t('ui.whiff'), 'whiff');
        }
        MECHANICS[sim.mechanicId].onParry?.(sim, success);
        sim.parryCooldownUntil = now + TIMING.PARRY_COOLDOWN_MS;
    }

    // ---- Loop ----
    function tick(now) {
        if (!sim.running) return;
        const dt = Math.min(80, now - sim.lastTime);
        sim.lastTime = now;

        drainQueue(now);

        // Horizontal movement
        if (!sim.movementLocked) {
            const H = 0.00055;
            if (sim.keys.has('ArrowLeft'))  sim.player.x -= H * dt;
            if (sim.keys.has('ArrowRight')) sim.player.x += H * dt;
        }
        sim.player.x = clamp(sim.player.x, 0.05, 0.95);

        // Gravity
        if (sim.keys.has('ArrowDown') && sim.player.y < TIMING.GROUND_Y) {
            sim.player.vy += TIMING.GRAVITY * TIMING.FAST_FALL_MULT * dt;
        } else {
            sim.player.vy += TIMING.GRAVITY * dt;
        }
        sim.player.y += sim.player.vy * dt;
        if (sim.player.y >= TIMING.GROUND_Y) {
            sim.player.y = TIMING.GROUND_Y;
            sim.player.vy = 0;
        }
        sim.player.y = clamp(sim.player.y, 0.4, TIMING.GROUND_Y);

        // DOM
        playerEl.style.left = `${sim.player.x * 100}%`;
        playerEl.style.top  = `${sim.player.y * 100}%`;
        marcusEl.style.left = `${sim.marcus.x * 100}%`;
        marcusEl.style.top  = `${sim.marcus.y * 100}%`;
        marcusEl.style.display = sim.marcus.visible ? '' : 'none';

        attackerFlash.style.left = `${sim.marcus.x * 100}%`;
        attackerFlash.style.top  = `${sim.marcus.y * 100}%`;
        brightFlash.style.left = `${sim.marcus.x * 100}%`;
        brightFlash.style.top  = `${sim.marcus.y * 100}%`;

        // Fist overlay follows Marcus
        fistEl.style.left = `${sim.marcus.x * 100}%`;
        fistEl.style.top  = `${sim.marcus.y * 100}%`;

        if (brightFlash.dataset.state === 'in') {
            const elapsed = parseFloat(brightFlash.dataset.timer || '0') + dt;
            brightFlash.dataset.timer = String(elapsed);
            const k = Math.min(1, elapsed / TIMING.FLASH_FADE_IN_MS);
            brightFlash.style.opacity = k * TIMING.FLASH_FULL_OPACITY;

            if (k >= 1) {
                brightFlash.dataset.state = 'lit';   // fully lit, waiting for window close
                brightFlash.dataset.timer = '0';
            }
        } else if (brightFlash.dataset.state === 'lit') {
            // Hidden when the parry window is no longer open
            if (!sim.isParryWindowOpen()) {
                brightFlash.dataset.state = '';
                brightFlash.style.opacity = 0;
                brightFlash.className = 'sim-bright-flash';
            }
        }

        if (attackerFlash.dataset.state === 'in') {
            const elapsed = parseFloat(attackerFlash.dataset.timer || '0') + dt;
            attackerFlash.dataset.timer = String(elapsed);
            const k = Math.min(1, elapsed / TIMING.FLASH_FADE_IN_MS);
            attackerFlash.style.opacity = k * TIMING.FLASH_DIM_OPACITY;

            if (k >= 1) {
                attackerFlash.dataset.state = 'lit';
                attackerFlash.dataset.timer = '0';
            }
        } else if (attackerFlash.dataset.state === 'lit') {
            if (!sim.isParryWindowOpen()) {
                attackerFlash.dataset.state = '';
                attackerFlash.style.opacity = 0;
                attackerFlash.className = 'sim-attacker-flash';
            }
        }

        // Fade out dim flash too (after its own timeout)
        if (sim.flashDimTimer > 0) {
            sim.flashDimTimer = TIMING.FLASH_FADE_IN_MS + TIMING.FLASH_HOLD_MS + TIMING.FLASH_FADE_OUT_MS;
            if (sim.flashDimTimer <= 0) {
                attackerFlash.style.opacity = 0;
                attackerFlash.className = 'sim-attacker-flash';
            }
        }

        // Mechanic update
        MECHANICS[sim.mechanicId].update(sim, dt);

        // Flash fade
        if (sim.flashTimer > 0) {
            sim.flashTimer -= dt;
            if (sim.flashTimer <= 0) attackerFlash.className = 'sim-attacker-flash';
        }

        // Orb render
        const mech = sim.mech;
        if (sim.mechanicId === 'methane_orb' && mech?.orbActive) {
            orbEl.classList.remove('sim-orb-hidden');
            orbEl.style.left = `${mech.orbX * 100}%`;
            orbEl.style.top  = `${mech.orbY * 100}%`;
            renderPulseDots(mech);
        } else {
            orbEl.classList.add('sim-orb-hidden');
            pulseCounter.classList.add('sim-hidden');
        }

        sim.frameHandle = requestAnimationFrame(tick);
    }

    function renderPulseDots(m) {
        const total = Math.max(m.targetPulse, m.pulseCount);
        let html = '';
        for (let i = 0; i < total; i++) {
            const filled = i < m.pulseCount;
            const isTarget = (i + 1) === m.targetPulse;
            html += `<span class="sim-dot${filled ? ' sim-dot-on' : ''}${isTarget ? ' sim-dot-target' : ''}"></span>`;
        }
        pulseCounter.innerHTML = html;
        pulseCounter.classList.remove('sim-hidden');
        pulseCounter.style.left = `${m.orbX * 100}%`;
        pulseCounter.style.top  = `calc(${m.orbY * 100}% + 44px)`;
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
        sim.closeParryWindow();
        sim.lockMovement(false);
        sim.hideTargetMarker();
    }

    function updateStats() {
        statsBar.textContent = `${t('ui.stats_success', { n: sim.successes })}   ·   ${t('ui.stats_whiff', { n: sim.whiffs })}`;
    }
    function showToast(text, kind) {
        toast.textContent = text;
        toast.className = `sim-toast sim-toast-${kind} sim-toast-visible`;
        setTimeout(() => toast.classList.remove('sim-toast-visible'), 900);
    }

    // ---- Fist animation hook ----
    // The punch mechanic triggers this by adding the visible class for a short time
    sim.showFist = function () {
        fistEl.classList.remove('sim-hidden');
        fistEl.classList.add('sim-fist-pop');
        setTimeout(() => {
            fistEl.classList.add('sim-hidden');
            fistEl.classList.remove('sim-fist-pop');
        }, TIMING.PUNCH_FIST_MS);
    };

    // ---- Buttons ----
    startBtn.addEventListener('click', () => {
        stopLoop();
        sim.successes = 0;
        sim.whiffs = 0;
        sim.player = { x: 0.35, y: TIMING.GROUND_Y, vy: 0 };
        sim.marcus = { x: 0.55, y: TIMING.GROUND_Y, visible: true };
        sim.parryArmedAt = 0;
        sim.parryCooldownUntil = 0;
        sim.flashTimer = 0;
        sim.inputQueue = [];
        sim.mechanicId = mechSelect.value;
        sim.selectedColor = colorSelect.value;
        MECHANICS[sim.mechanicId].init(sim);
        updateStats();
        startLoop();
        startBtn.textContent = t('ui.stop');
    });

    resetBtn.addEventListener('click', () => {
        stopLoop();
        startBtn.textContent = t('ui.start');
        sim.successes = 0;
        sim.whiffs = 0;
        updateStats();
        promptBar.textContent = '';
        attackerFlash.className = 'sim-attacker-flash';
        orbEl.classList.add('sim-orb-hidden');
        pulseCounter.classList.add('sim-hidden');
        parryRing.classList.add('sim-hidden');
        targetMarker.classList.add('sim-hidden');
        fistEl.classList.add('sim-hidden');
        playerEl.style.left = '35%';
        playerEl.style.top  = `${TIMING.GROUND_Y * 100}%`;
        marcusEl.style.left = '55%';
        marcusEl.style.top  = `${TIMING.GROUND_Y * 100}%`;
        marcusEl.style.display = '';
    });

    mechSelect.addEventListener('change', () => {
        if (sim.running) {
            stopLoop();
            startBtn.textContent = t('ui.start');
        }
        sim.mechanicId = mechSelect.value;
        const def = MECHANICS[sim.mechanicId];
        colorWrap.style.display = def.supportsColor ? '' : 'none';
        promptBar.textContent = '';
    });

    colorSelect.addEventListener('change', () => {
        sim.selectedColor = colorSelect.value;
    });

    pingInput.addEventListener('input', e => {
        sim.pingMs = parseInt(e.target.value, 10);
        pingValue.textContent = `${sim.pingMs}ms`;
    });

    // Hide color selector for the orb mechanic
    colorWrap.style.display = MECHANICS[sim.mechanicId].supportsColor ? '' : 'none';

    updateStats();
    return root;
}