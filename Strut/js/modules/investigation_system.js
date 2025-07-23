/**
 * js/modules/investigation_system.js
 * Investigation Level System
 * 
 * Manages the Investigation Level consequences system:
 * - 0-79%: Growing investigation with progressive events
 * - 80-99%: "Identity Wipe" option available  
 * - 100%: Complete arrest with resource reset
 */

// Investigation Level constants
const INVESTIGATION_CONSTANTS = {
    MAX_LEVEL: 100,
    WIPE_THRESHOLD: 80,
    ARREST_THRESHOLD: 100,
    WIPE_COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    
    // Investigation increase rates based on IP traceability
    TRACEABILITY_MULTIPLIERS: {
        LOW: 0.5,      // 0-30 traceability
        MEDIUM: 1.0,   // 31-60 traceability  
        HIGH: 1.5,     // 61-80 traceability
        CRITICAL: 2.0  // 81-100 traceability
    },
    
    // Event probabilities by investigation level ranges
    EVENT_PROBABILITIES: {
        LOW: { minor: 0.1, moderate: 0.05, major: 0.01 },      // 0-39%
        MEDIUM: { minor: 0.2, moderate: 0.1, major: 0.03 },    // 40-69%
        HIGH: { minor: 0.3, moderate: 0.15, major: 0.05 },     // 70-79%
        CRITICAL: { minor: 0.4, moderate: 0.2, major: 0.08 }   // 80-99%
    }
};

// Investigation events by severity
const INVESTIGATION_EVENTS = {
    minor: [
        {
            title: "Attività Sospetta Rilevata",
            message: "Le autorità hanno notato pattern insoliti nel traffico di rete. Livello di indagine aumentato leggermente.",
            increase: 2
        },
        {
            title: "Monitoraggio ISP",
            message: "Il tuo ISP ha segnalato attività anomale. Le autorità hanno avviato un controllo preliminare.",
            increase: 3
        },
        {
            title: "Tracce Digitali",
            message: "Alcune delle tue tracce digitali sono state collegate. L'indagine progredisce lentamente.",
            increase: 2
        }
    ],
    moderate: [
        {
            title: "Indagine Approfondita",
            message: "Le autorità hanno avviato un'indagine formale sui tuoi movimenti. Sii più cauto.",
            increase: 5
        },
        {
            title: "Correlazione Attacchi",
            message: "Gli investigatori hanno collegato alcuni dei tuoi attacchi. Il livello di indagine aumenta.",
            increase: 6
        },
        {
            title: "Pressione Governativa",
            message: "Il governo ha aumentato la pressione sulle forze dell'ordine per trovarti.",
            increase: 4
        }
    ],
    major: [
        {
            title: "Mandato di Ricerca",
            message: "È stato emesso un mandato di ricerca. Le autorità ti stanno cercando attivamente!",
            increase: 8
        },
        {
            title: "Task Force Specializzata",
            message: "È stata formata una task force specializzata per la tua cattura. Attenzione massima!",
            increase: 10
        },
        {
            title: "Collaborazione Internazionale",
            message: "Le autorità internazionali collaborano per rintracciarti. La situazione è critica!",
            increase: 12
        }
    ]
};

/**
 * Initialize investigation system if not present in game state
 */
function initializeInvestigationSystem() {
    if (!state.identity.investigationLevel) {
        state.identity.investigationLevel = 0;
    }
    if (!state.identity.investigationHistory) {
        state.identity.investigationHistory = [];
    }
    if (!state.identity.lastWipeDate) {
        state.identity.lastWipeDate = null;
    }
    if (!state.identity.arrestCount) {
        state.identity.arrestCount = 0;
    }
}

/**
 * Increase investigation level based on IP traceability and attack failures
 * @param {number} baseIncrease - Base increase amount
 * @param {string} reason - Reason for the increase
 * @param {Object} context - Additional context (targetTier, ipType, etc.)
 */
function increaseInvestigationLevel(baseIncrease, reason, context = {}) {
    initializeInvestigationSystem();
    
    let totalIncrease = baseIncrease;
    
    // Apply multipliers based on context
    if (context.targetTier) {
        const tierMultipliers = { 1: 1.0, 2: 1.2, 3: 1.5, 4: 2.0 };
        totalIncrease *= (tierMultipliers[context.targetTier] || 1.0);
    }
    
    // Apply IP traceability multiplier
    if (context.ipTraceability) {
        let multiplier = INVESTIGATION_CONSTANTS.TRACEABILITY_MULTIPLIERS.LOW;
        if (context.ipTraceability > 80) {
            multiplier = INVESTIGATION_CONSTANTS.TRACEABILITY_MULTIPLIERS.CRITICAL;
        } else if (context.ipTraceability > 60) {
            multiplier = INVESTIGATION_CONSTANTS.TRACEABILITY_MULTIPLIERS.HIGH;
        } else if (context.ipTraceability > 30) {
            multiplier = INVESTIGATION_CONSTANTS.TRACEABILITY_MULTIPLIERS.MEDIUM;
        }
        totalIncrease *= multiplier;
    }
    
    // Round and apply increase
    totalIncrease = Math.round(totalIncrease * 100) / 100;
    const oldLevel = state.identity.investigationLevel;
    state.identity.investigationLevel = Math.min(INVESTIGATION_CONSTANTS.MAX_LEVEL, state.identity.investigationLevel + totalIncrease);
    
    // Log the event
    state.identity.investigationHistory.push({
        timestamp: Date.now(),
        oldLevel: oldLevel,
        newLevel: state.identity.investigationLevel,
        increase: totalIncrease,
        reason: reason,
        context: context
    });
    
    // Check for threshold events
    checkInvestigationThresholds(oldLevel, state.identity.investigationLevel);
    
    // Trigger random investigation events
    triggerInvestigationEvents();
    
    // Update UI
    updateInvestigationUI();
    saveState();
    
    return state.identity.investigationLevel;
}

/**
 * Check for investigation level threshold events
 * @param {number} oldLevel - Previous investigation level
 * @param {number} newLevel - New investigation level
 */
function checkInvestigationThresholds(oldLevel, newLevel) {
    // Check if we crossed the wipe threshold
    if (oldLevel < INVESTIGATION_CONSTANTS.WIPE_THRESHOLD && newLevel >= INVESTIGATION_CONSTANTS.WIPE_THRESHOLD) {
        showNotification(
            `⚠️ LIVELLO CRITICO RAGGIUNTO! L'opzione "Cancella Identità" è ora disponibile nel tuo HQ.`,
            'error'
        );
        
        // Enable wipe option in UI
        enableIdentityWipeOption();
    }
    
    // Check if we reached arrest threshold
    if (newLevel >= INVESTIGATION_CONSTANTS.ARREST_THRESHOLD) {
        setTimeout(() => {
            executeArrest();
        }, 2000); // Delay for dramatic effect
    }
    
    // Milestone notifications
    const milestones = [25, 50, 75, 90, 95];
    milestones.forEach(milestone => {
        if (oldLevel < milestone && newLevel >= milestone) {
            let message;
            if (milestone <= 50) {
                message = `Le autorità stanno iniziando a notarti. Indagine al ${milestone}%.`;
            } else if (milestone <= 75) {
                message = `L'indagine si intensifica! Livello raggiunto: ${milestone}%.`;
            } else {
                message = `🚨 ATTENZIONE! Sei sotto indagine attiva. Livello: ${milestone}%`;
            }
            
            showNotification(message, milestone > 75 ? 'error' : 'info');
        }
    });
}

/**
 * Trigger random investigation events based on current level
 */
function triggerInvestigationEvents() {
    const level = state.identity.investigationLevel;
    let eventCategory;
    
    // Determine event category based on investigation level
    if (level < 40) {
        eventCategory = INVESTIGATION_CONSTANTS.EVENT_PROBABILITIES.LOW;
    } else if (level < 70) {
        eventCategory = INVESTIGATION_CONSTANTS.EVENT_PROBABILITIES.MEDIUM;
    } else if (level < 80) {
        eventCategory = INVESTIGATION_CONSTANTS.EVENT_PROBABILITIES.HIGH;
    } else {
        eventCategory = INVESTIGATION_CONSTANTS.EVENT_PROBABILITIES.CRITICAL;
    }
    
    // Check for events
    const eventTypes = ['minor', 'moderate', 'major'];
    eventTypes.forEach(type => {
        if (Math.random() < eventCategory[type]) {
            const events = INVESTIGATION_EVENTS[type];
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            
            // Trigger the event
            setTimeout(() => {
                showNotification(`📰 ${randomEvent.title}: ${randomEvent.message}`, 'error');
                increaseInvestigationLevel(randomEvent.increase, `Evento: ${randomEvent.title}`);
            }, Math.random() * 5000 + 1000); // Random delay 1-6 seconds
        }
    });
}

/**
 * Execute identity wipe if conditions are met
 */
function executeIdentityWipe() {
    initializeInvestigationSystem();
    
    // Check if wipe is available
    if (state.identity.investigationLevel < INVESTIGATION_CONSTANTS.WIPE_THRESHOLD) {
        showNotification('Il livello di indagine non è abbastanza alto per la cancellazione identità.', 'error');
        return false;
    }
    
    // Check cooldown
    if (state.identity.lastWipeDate) {
        const timeSinceLastWipe = Date.now() - state.identity.lastWipeDate;
        if (timeSinceLastWipe < INVESTIGATION_CONSTANTS.WIPE_COOLDOWN) {
            const hoursRemaining = Math.ceil((INVESTIGATION_CONSTANTS.WIPE_COOLDOWN - timeSinceLastWipe) / (60 * 60 * 1000));
            showNotification(`Devi aspettare ancora ${hoursRemaining} ore prima di poter cancellare di nuovo l'identità.`, 'error');
            return false;
        }
    }
    
    // Calculate resource costs (50% of current resources)
    const btcCost = Math.floor(state.btc * 0.5 * 100) / 100;
    const xmrCost = Math.floor(state.xmr * 0.5);
    const levelCost = Math.floor(state.level * 0.2);
    
    const confirmation = confirm(
        `Cancellare l'identità costerà:\n` +
        `• ${btcCost} BTC (50% del tuo BTC)\n` +
        `• ${xmrCost} XMR (50% del tuo XMR)\n` +
        `• ${levelCost} livelli di esperienza\n` +
        `• Tutti gli IP tracciabili verranno resettati\n\n` +
        `In cambio, il livello di indagine sarà azzerato.\n\n` +
        `Confermi l'operazione?`
    );
    
    if (!confirmation) return false;
    
    // Execute the wipe
    state.btc = Math.max(0, state.btc - btcCost);
    state.xmr = Math.max(0, state.xmr - xmrCost);
    state.level = Math.max(1, state.level - levelCost);
    
    // Reset investigation level and IP traceability
    state.identity.investigationLevel = 0;
    state.identity.lastWipeDate = Date.now();
    state.ipTraceability = {};
    
    // Log the wipe
    state.identity.investigationHistory.push({
        timestamp: Date.now(),
        oldLevel: INVESTIGATION_CONSTANTS.WIPE_THRESHOLD,
        newLevel: 0,
        increase: -INVESTIGATION_CONSTANTS.WIPE_THRESHOLD,
        reason: 'Identity Wipe',
        context: { btcCost, xmrCost, levelCost }
    });
    
    showNotification(
        '🔄 Identità cancellata con successo! Il livello di indagine è stato azzerato.',
        'success'
    );
    
    // Disable wipe option
    disableIdentityWipeOption();
    
    updateInvestigationUI();
    updateUI();
    saveState();
    
    return true;
}

/**
 * Execute arrest when investigation level reaches 100%
 */
function executeArrest() {
    state.identity.arrestCount++;
    
    // Show arrest sequence
    showNotification('🚨 ARRESTATO! Le autorità ti hanno trovato!', 'error');
    
    setTimeout(() => {
        const arrestMessage = `
🚔 SEI STATO ARRESTATO!

Le autorità ti hanno catturato dopo un'indagine approfondita.

CONSEGUENZE:
• Tutte le risorse (BTC, XMR) sono state confiscate
• La botnet è stata smantellata
• Tutti gli IP sono stati bruciati
• Il livello è stato ridotto drasticamente

COSA MANTIENI:
• I tuoi talenti e conoscenze
• La reputazione presso le fazioni
• I flussi salvati come "permanenti"

Questa è la ${state.identity.arrestCount}° volta che vieni arrestato.
Ricomincia da capo... più attento questa volta!
        `;
        
        alert(arrestMessage);
        
        // Reset resources
        state.btc = 0.1; // Small starting amount
        state.xmr = 50;  // Small starting amount
        state.level = Math.max(1, Math.floor(state.level * 0.3)); // Keep 30% of level
        
        // Reset investigation and traceability
        state.identity.investigationLevel = 0;
        state.ipTraceability = {};
        
        // Reset botnet
        state.infectedHostPool = [];
        state.botnetGroups = {};
        
        // Log the arrest
        state.identity.investigationHistory.push({
            timestamp: Date.now(),
            oldLevel: 100,
            newLevel: 0,
            increase: -100,
            reason: 'Arrest',
            context: { arrestNumber: state.identity.arrestCount }
        });
        
        updateInvestigationUI();
        updateUI();
        saveState();
        
        // Force return to HQ
        if (typeof initHQPage === 'function') {
            state.activePage = 'hq';
            initHQPage();
        }
        
    }, 3000);
}

/**
 * Enable identity wipe option in UI
 */
function enableIdentityWipeOption() {
    // This will be called by UI modules to show the wipe option
    if (typeof updateHQInvestigationPanel === 'function') {
        updateHQInvestigationPanel();
    }
}

/**
 * Disable identity wipe option in UI
 */
function disableIdentityWipeOption() {
    // This will be called by UI modules to hide the wipe option
    if (typeof updateHQInvestigationPanel === 'function') {
        updateHQInvestigationPanel();
    }
}

/**
 * Update investigation level UI elements
 */
function updateInvestigationUI() {
    // Update sidebar investigation level display
    const sidebarInvestigation = document.getElementById('sidebar-investigation-level');
    if (sidebarInvestigation) {
        sidebarInvestigation.textContent = `${Math.round(state.identity.investigationLevel)}%`;
        
        // Color code based on level
        if (state.identity.investigationLevel >= 80) {
            sidebarInvestigation.className = 'text-red-400 font-bold';
        } else if (state.identity.investigationLevel >= 50) {
            sidebarInvestigation.className = 'text-yellow-400 font-semibold';
        } else {
            sidebarInvestigation.className = 'text-green-400';
        }
    }
    
    // Update HQ investigation panel if active
    if (state.activePage === 'hq' && typeof updateHQInvestigationPanel === 'function') {
        updateHQInvestigationPanel();
    }
}

/**
 * Get investigation level status for display
 * @returns {Object} Status information
 */
function getInvestigationStatus() {
    initializeInvestigationSystem();
    
    const level = state.identity.investigationLevel;
    let status, color, message;
    
    if (level < 25) {
        status = 'Sicuro';
        color = 'text-green-400';
        message = 'Le autorità non ti hanno notato.';
    } else if (level < 50) {
        status = 'Sotto Osservazione';
        color = 'text-yellow-400';
        message = 'Sei finito sul radar delle autorità.';
    } else if (level < 75) {
        status = 'Indagine Attiva';
        color = 'text-orange-400';
        message = 'Le autorità ti stanno indagando attivamente.';
    } else if (level < 95) {
        status = 'Ricercato';
        color = 'text-red-400';
        message = 'Sei attivamente ricercato dalle autorità!';
    } else {
        status = 'CATTURA IMMINENTE';
        color = 'text-red-500 animate-pulse';
        message = 'La cattura è imminente!';
    }
    
    return {
        level: Math.round(level * 100) / 100,
        status,
        color,
        message,
        canWipe: level >= INVESTIGATION_CONSTANTS.WIPE_THRESHOLD && !isWipeOnCooldown(),
        arrestImminent: level >= 98
    };
}

/**
 * Check if identity wipe is on cooldown
 * @returns {boolean} True if on cooldown
 */
function isWipeOnCooldown() {
    if (!state.identity.lastWipeDate) return false;
    
    const timeSinceLastWipe = Date.now() - state.identity.lastWipeDate;
    return timeSinceLastWipe < INVESTIGATION_CONSTANTS.WIPE_COOLDOWN;
}

/**
 * Get time remaining for wipe cooldown
 * @returns {number} Hours remaining
 */
function getWipeCooldownHours() {
    if (!isWipeOnCooldown()) return 0;
    
    const timeSinceLastWipe = Date.now() - state.identity.lastWipeDate;
    const timeRemaining = INVESTIGATION_CONSTANTS.WIPE_COOLDOWN - timeSinceLastWipe;
    return Math.ceil(timeRemaining / (60 * 60 * 1000));
}

// Export functions for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeInvestigationSystem,
        increaseInvestigationLevel,
        executeIdentityWipe,
        getInvestigationStatus,
        isWipeOnCooldown,
        getWipeCooldownHours,
        INVESTIGATION_CONSTANTS
    };
}