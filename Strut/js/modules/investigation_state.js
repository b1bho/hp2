// File: js/modules/investigation_state.js
// Investigation State System - Manages consequences of player activities and authority attention

/**
 * Investigation State System
 * Monitors player activities and applies consequences based on investigation level thresholds:
 * - 0-79%: Growing Investigation
 * - 80-99%: Imminent Risk
 * - 100%: Imminent Arrest
 */

// Investigation level thresholds
const INVESTIGATION_THRESHOLDS = {
    GROWING: 79,
    IMMINENT_RISK: 99,
    ARREST: 100
};

// Investigation state constants
const INVESTIGATION_STATES = {
    SAFE: 'safe',
    GROWING: 'growing',
    IMMINENT_RISK: 'imminent_risk',
    ARREST: 'arrest'
};

// Investigation events for different levels
const INVESTIGATION_EVENTS = {
    growing: [
        "Le autorità hanno rilevato attività sospette sulla rete.",
        "Aumentata la sorveglianza sui target attaccati di recente.",
        "Alcuni informatori segnalano crescente attenzione investigativa.",
        "Le contromisure sui sistemi target sono state rinforzate."
    ],
    imminent_risk: [
        "ATTENZIONE: Le autorità stanno stringendo il cerchio!",
        "Rilevata correlazione tra i tuoi attacchi - considera il Wipe Identità!",
        "Gli investigatori hanno ottenuto mandati di perquisizione.",
        "Il tuo pattern di attacco è stato identificato dalle autorità."
    ],
    arrest: [
        "ARRESTO IMMINENTE: Le autorità stanno per localizzarti!",
        "Tutte le tue identità sono state compromesse!",
        "È troppo tardi per nascondersi - preparati alle conseguenze!"
    ]
};

/**
 * Get current investigation state based on level
 */
function getInvestigationState(level = null) {
    const investigationLevel = level ?? state.identity.investigationLevel;
    
    if (investigationLevel >= INVESTIGATION_THRESHOLDS.ARREST) {
        return INVESTIGATION_STATES.ARREST;
    } else if (investigationLevel >= 80) {
        return INVESTIGATION_STATES.IMMINENT_RISK;
    } else if (investigationLevel > 0) {
        return INVESTIGATION_STATES.GROWING;
    } else {
        return INVESTIGATION_STATES.SAFE;
    }
}

/**
 * Increase investigation level based on player activities
 */
function increaseInvestigationLevel(amount, reason = 'Unknown activity') {
    if (!state.identity) return;
    
    const oldLevel = state.identity.investigationLevel;
    const newLevel = Math.min(100, oldLevel + amount);
    
    state.identity.investigationLevel = newLevel;
    
    // Log the investigation increase
    const logEntry = {
        timestamp: Date.now(),
        reason: reason,
        increase: amount,
        oldLevel: oldLevel,
        newLevel: newLevel
    };
    
    if (!state.investigationLogs) {
        state.investigationLogs = [];
    }
    state.investigationLogs.push(logEntry);
    
    // Check for threshold crossings and trigger events
    checkInvestigationThresholds(oldLevel, newLevel);
    
    // Update UI
    updateInvestigationUI();
    saveState();
    
    console.log(`Investigation level increased by ${amount}% (${reason}): ${oldLevel}% → ${newLevel}%`);
}

/**
 * Check if investigation level crossed important thresholds
 */
function checkInvestigationThresholds(oldLevel, newLevel) {
    const oldState = getInvestigationState(oldLevel);
    const newState = getInvestigationState(newLevel);
    
    if (oldState !== newState) {
        handleInvestigationStateChange(oldState, newState, newLevel);
    }
    
    // Check for arrest condition
    if (newLevel >= 100) {
        setTimeout(() => triggerArrestEvent(), 2000); // Delay for dramatic effect
    }
}

/**
 * Handle investigation state changes
 */
function handleInvestigationStateChange(oldState, newState, level) {
    switch (newState) {
        case INVESTIGATION_STATES.GROWING:
            handleGrowingInvestigation(level);
            break;
        case INVESTIGATION_STATES.IMMINENT_RISK:
            handleImminentRisk(level);
            break;
        case INVESTIGATION_STATES.ARREST:
            // Arrest will be handled separately
            break;
    }
}

/**
 * Handle growing investigation consequences (0-79%)
 */
function handleGrowingInvestigation(level) {
    // Generate investigation events
    generateInvestigationEvent('growing');
    
    // Increase countermeasures on targets
    increaseTargetCountermeasures();
    
    // Modify informant quest availability
    modifyInformantQuestAvailability(level);
    
    // Update investigation authority
    updateInvestigatingAuthority(level);
}

/**
 * Handle imminent risk consequences (80-99%)
 */
function handleImminentRisk(level) {
    // Show persistent warning notification
    showImminentRiskNotification();
    
    // Generate high-priority investigation events  
    generateInvestigationEvent('imminent_risk');
    
    // Enable identity wipe option
    enableIdentityWipeOption();
    
    // Increase all countermeasures significantly
    increaseTargetCountermeasures(2.0);
}

/**
 * Generate investigation events based on current state
 */
function generateInvestigationEvent(investigationState) {
    const events = INVESTIGATION_EVENTS[investigationState];
    if (!events || events.length === 0) return;
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    // Add to news feed or notifications
    showNotification(randomEvent, investigationState === 'imminent_risk' ? 'error' : 'warning');
    
    // Add to investigation logs
    if (!state.investigationLogs) state.investigationLogs = [];
    state.investigationLogs.push({
        timestamp: Date.now(),
        type: 'event',
        level: state.identity.investigationLevel,
        message: randomEvent
    });
}

/**
 * Increase target countermeasures based on investigation level
 */
function increaseTargetCountermeasures(multiplier = 1.0) {
    // This would integrate with the existing target/quest system
    // For now, we'll just log the effect
    console.log(`Target countermeasures increased by ${multiplier}x due to investigation level`);
    
    // TODO: Integrate with existing quest/target systems
    // - Increase quest difficulty
    // - Reduce success rates
    // - Increase detection chances
}

/**
 * Modify informant quest availability based on investigation level
 */
function modifyInformantQuestAvailability(level) {
    // Reduce informant quest availability as investigation increases
    const availabilityModifier = Math.max(0.1, 1 - (level / 200));
    
    console.log(`Informant quest availability modified: ${(availabilityModifier * 100).toFixed(1)}%`);
    
    // TODO: Integrate with quest system
    // - Reduce available informant quests
    // - Increase quest costs
    // - Add investigation risk to quests
}

/**
 * Update investigating authority based on level
 */
function updateInvestigatingAuthority(level) {
    let authority = 'Nessuna';
    
    if (level >= 80) {
        authority = 'Task Force Internazionale';
    } else if (level >= 60) {
        authority = 'Polizia Postale Nazionale';
    } else if (level >= 40) {
        authority = 'Cybercrime Unit Locale';
    } else if (level >= 20) {
        authority = 'Sicurezza Informatica Aziendale';
    }
    
    state.identity.investigatedBy = authority;
}

/**
 * Show imminent risk notification
 */
function showImminentRiskNotification() {
    // Create persistent warning notification
    const warningNotification = {
        id: 'imminent-risk-warning',
        type: 'persistent',
        level: 'error',
        title: 'RISCHIO IMMINENTE',
        message: 'Le autorità stanno per localizzarti! Considera il Wipe Identità prima che sia troppo tardi!',
        actions: [
            {
                text: 'Wipe Identità',
                callback: () => showIdentityWipeModal(),
                class: 'bg-red-600 hover:bg-red-700'
            },
            {
                text: 'Ignora',
                callback: () => dismissNotification('imminent-risk-warning'),
                class: 'bg-gray-600 hover:bg-gray-700'
            }
        ]
    };
    
    if (!state.identity.activeWarnings) {
        state.identity.activeWarnings = [];
    }
    
    // Remove existing warning if present
    state.identity.activeWarnings = state.identity.activeWarnings.filter(w => w.id !== 'imminent-risk-warning');
    
    // Add new warning
    state.identity.activeWarnings.push(warningNotification);
    
    // Update UI
    updateInvestigationUI();
}

/**
 * Enable identity wipe option
 */
function enableIdentityWipeOption() {
    state.identity.canWipeIdentity = true;
    console.log('Identity wipe option enabled');
}

/**
 * Show identity wipe modal
 */
function showIdentityWipeModal() {
    if (state.identity.wipeInProgress) {
        showNotification('Un Wipe Identità è già in corso!', 'warning');
        return;
    }
    
    const modal = document.getElementById('identity-wipe-modal');
    if (!modal) {
        createIdentityWipeModal();
        return;
    }
    
    modal.classList.remove('hidden');
}

/**
 * Create identity wipe modal
 */
function createIdentityWipeModal() {
    const modalHtml = `
        <div id="identity-wipe-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h2 class="text-3xl font-bold text-red-400 mb-2">WIPE IDENTITÀ</h2>
                    <p class="text-gray-300">Operazione irreversibile - Conferma per procedere</p>
                </div>
                
                <div class="bg-gray-900 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-semibold text-yellow-400 mb-3">Conseguenze del Wipe:</h3>
                    <ul class="space-y-2 text-sm text-gray-300">
                        <li>• <span class="text-red-400">Riduzione Bitcoin e XMR del 50%</span></li>
                        <li>• <span class="text-red-400">Reset completo InfectedHostPool</span></li>
                        <li>• <span class="text-red-400">Perdita upgrade hardware personali</span></li>
                        <li>• <span class="text-red-400">Perdita flussi salvati</span></li>
                        <li>• <span class="text-green-400">Mantenimento Talenti</span></li>
                        <li>• <span class="text-green-400">Mantenimento Livello Giocatore</span></li>
                        <li>• <span class="text-green-400">Mantenimento Reputazione Fazioni</span></li>
                        <li>• <span class="text-blue-400">Reset Livello Indagine a 0%</span></li>
                    </ul>
                </div>
                
                <div class="flex space-x-4">
                    <button id="confirm-identity-wipe" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        CONFERMA WIPE
                    </button>
                    <button id="cancel-identity-wipe" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Annulla
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add event listeners
    document.getElementById('confirm-identity-wipe').addEventListener('click', () => {
        executeIdentityWipe();
        document.getElementById('identity-wipe-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-identity-wipe').addEventListener('click', () => {
        document.getElementById('identity-wipe-modal').classList.add('hidden');
    });
    
    // Show modal
    document.getElementById('identity-wipe-modal').classList.remove('hidden');
}

/**
 * Execute identity wipe
 */
function executeIdentityWipe() {
    if (state.identity.wipeInProgress) {
        showNotification('Un Wipe Identità è già in corso!', 'warning');
        return;
    }
    
    state.identity.wipeInProgress = true;
    
    // Create wipe summary for logging
    const wipeSummary = {
        timestamp: Date.now(),
        previousLevel: state.identity.investigationLevel,
        lostBTC: state.btc * 0.5,
        lostXMR: state.xmr * 0.5,
        lostHosts: state.infectedHostPool ? state.infectedHostPool.length : 0,
        lostFlows: Object.keys(state.permanentFlows || {}).length
    };
    
    // Apply wipe consequences
    // 1. Reduce Bitcoin and XMR by 50%
    state.btc *= 0.5;
    state.xmr *= 0.5;
    
    // 2. Reset InfectedHostPool
    state.infectedHostPool = [];
    state.botnetGroups = {};
    
    // 3. Remove personal hardware upgrades
    if (state.ownedHardware) {
        // Keep only essential/clan hardware
        const essentialHardware = {};
        for (const [key, value] of Object.entries(state.ownedHardware)) {
            if (value.type === 'clan' || value.essential === true) {
                essentialHardware[key] = value;
            }
        }
        state.ownedHardware = essentialHardware;
    }
    
    // 4. Remove saved flows (permanent flows)
    state.permanentFlows = {};
    
    // 5. Reset investigation level to 0%
    state.identity.investigationLevel = 0;
    state.identity.investigatedBy = 'Nessuna';
    state.identity.lastWipeTimestamp = Date.now();
    
    // 6. Clear active warnings
    state.identity.activeWarnings = [];
    
    // 7. Add to investigation logs
    if (!state.investigationLogs) state.investigationLogs = [];
    state.investigationLogs.push({
        timestamp: Date.now(),
        type: 'identity_wipe',
        summary: wipeSummary
    });
    
    // Generate new identity name
    const newIdentities = ['Phoenix', 'Phantom', 'Shadow', 'Cipher', 'Wraith', 'Specter', 'Enigma'];
    state.identity.current = newIdentities[Math.floor(Math.random() * newIdentities.length)];
    
    state.identity.wipeInProgress = false;
    state.identity.canWipeIdentity = false; // Cooldown period
    
    // Show success message
    showNotification(`Wipe Identità completato! Nuova identità: ${state.identity.current}`, 'success');
    
    // Update UI
    updateInvestigationUI();
    updateUI(); // Update main UI
    saveState();
    
    console.log('Identity wipe executed successfully:', wipeSummary);
}

/**
 * Trigger arrest event
 */
function triggerArrestEvent() {
    console.log('ARREST EVENT TRIGGERED - Investigation level reached 100%');
    
    // Create arrest summary for logging
    const arrestSummary = {
        timestamp: Date.now(),
        lostBTC: state.btc,
        lostXMR: state.xmr,
        lostHosts: state.infectedHostPool ? state.infectedHostPool.length : 0,
        lostLevel: state.level,
        preservedTalents: Object.keys(state.unlocked || {}).length
    };
    
    // Show arrest modal
    showArrestModal(arrestSummary);
}

/**
 * Show arrest modal
 */
function showArrestModal(arrestSummary) {
    const modalHtml = `
        <div id="arrest-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 p-8 text-center">
                <div class="text-8xl mb-6">🚔</div>
                <h2 class="text-4xl font-bold text-red-500 mb-4">ARRESTATO!</h2>
                <p class="text-xl text-gray-300 mb-6">Le autorità ti hanno localizzato e arrestato!</p>
                
                <div class="bg-gray-900 rounded-lg p-6 mb-6 text-left">
                    <h3 class="text-xl font-semibold text-red-400 mb-4">Conseguenze dell'Arresto:</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 class="font-semibold text-red-300 mb-2">PERDITE:</h4>
                            <ul class="space-y-1 text-gray-300">
                                <li>• Bitcoin: ${arrestSummary.lostBTC.toFixed(4)} BTC</li>
                                <li>• Monero: ${arrestSummary.lostXMR.toFixed(2)} XMR</li>
                                <li>• Host Infetti: ${arrestSummary.lostHosts}</li>
                                <li>• Tutte le risorse e infrastrutture</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold text-green-300 mb-2">MANTENUTO:</h4>
                            <ul class="space-y-1 text-gray-300">
                                <li>• Talenti acquisiti</li>
                                <li>• Livello Giocatore</li>
                                <li>• Reputazione Fazioni</li>
                                <li>• Conoscenze e competenze</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-900 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-semibold text-blue-300 mb-2">SOFT RESET</h3>
                    <p class="text-sm text-gray-300">
                        Dopo il periodo di detenzione, ripartirai con un HQ base ma con tutte le tue conoscenze intatte.
                        Le autorità credono di averti fermato, ma un vero hacker risorge sempre dalle ceneri.
                    </p>
                </div>
                
                <button id="accept-arrest" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                    ACCETTA LE CONSEGUENZE
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add event listener
    document.getElementById('accept-arrest').addEventListener('click', () => {
        executeArrest(arrestSummary);
        document.getElementById('arrest-modal').remove();
    });
}

/**
 * Execute arrest consequences
 */
function executeArrest(arrestSummary) {
    // Preserve important data before reset
    const preservedData = {
        unlocked: { ...state.unlocked },
        level: state.level,
        xp: state.xp,
        factionReputation: { ...state.factionReputation },
        completedQuests: [...(state.completedQuests || [])],
        arrestCount: (state.identity.arrestCount || 0) + 1
    };
    
    // Reset to base state (soft reset)
    // Reset currencies and resources
    state.btc = 0.1; // Small starting amount
    state.xmr = 100;  // Small starting amount
    state.money = 1000;
    
    // Reset infrastructure
    state.infectedHostPool = [];
    state.botnetGroups = {};
    state.ownedHardware = {};
    state.purchasedServices = {};
    state.permanentFlows = {};
    state.activeOperations = [];
    state.activeAttacks = [];
    state.miningOperations = [];
    
    // Reset investigation
    state.identity.investigationLevel = 0;
    state.identity.investigatedBy = 'Nessuna';
    state.identity.activeWarnings = [];
    state.identity.arrestCount = preservedData.arrestCount;
    
    // Generate new identity
    const newIdentities = ['Phoenix', 'Reborn', 'Lazarus', 'Neo', 'Resurrect', 'Revival'];
    state.identity.current = newIdentities[Math.floor(Math.random() * newIdentities.length)];
    
    // Restore preserved data
    state.unlocked = preservedData.unlocked;
    state.level = preservedData.level;
    state.xp = preservedData.xp;
    state.factionReputation = preservedData.factionReputation;
    state.completedQuests = preservedData.completedQuests;
    
    // Add arrest log
    if (!state.investigationLogs) state.investigationLogs = [];
    state.investigationLogs.push({
        timestamp: Date.now(),
        type: 'arrest',
        summary: arrestSummary,
        newIdentity: state.identity.current
    });
    
    // Show post-arrest message
    showNotification(`Dopo mesi di detenzione, ricominci con l'identità: ${state.identity.current}. Le tue conoscenze rimangono intatte.`, 'success');
    
    // Update UI
    updateInvestigationUI();
    updateUI();
    saveState();
    
    console.log('Arrest executed successfully:', arrestSummary);
}

/**
 * Update investigation UI elements
 */
function updateInvestigationUI() {
    // Update investigation level display
    updateInvestigationLevelDisplay();
    
    // Update active warnings
    updateActiveWarnings();
    
    // Update profile investigation section
    if (typeof updateProfileData === 'function') {
        updateProfileData();
    }
}

/**
 * Update investigation level display
 */
function updateInvestigationLevelDisplay() {
    const level = state.identity.investigationLevel || 0;
    const investigationState = getInvestigationState(level);
    
    // Update any investigation level indicators in the UI
    const levelElements = document.querySelectorAll('.investigation-level');
    levelElements.forEach(element => {
        element.textContent = `${level.toFixed(1)}%`;
        
        // Update color based on level
        element.className = `investigation-level ${getInvestigationColorClass(investigationState)}`;
    });
    
    // Update progress bars
    const progressBars = document.querySelectorAll('.investigation-progress');
    progressBars.forEach(bar => {
        bar.style.width = `${level}%`;
        bar.className = `investigation-progress transition-all duration-300 ${getInvestigationColorClass(investigationState, 'bg')}`;
    });
}

/**
 * Get color class for investigation state
 */
function getInvestigationColorClass(state, type = 'text') {
    const prefix = type === 'bg' ? 'bg' : 'text';
    
    switch (state) {
        case INVESTIGATION_STATES.SAFE:
            return `${prefix}-green-400`;
        case INVESTIGATION_STATES.GROWING:
            return `${prefix}-yellow-400`;
        case INVESTIGATION_STATES.IMMINENT_RISK:
            return `${prefix}-orange-400`;
        case INVESTIGATION_STATES.ARREST:
            return `${prefix}-red-400`;
        default:
            return `${prefix}-gray-400`;
    }
}

/**
 * Update active warnings display
 */
function updateActiveWarnings() {
    const warningsContainer = document.getElementById('investigation-warnings');
    if (!warningsContainer) return;
    
    const warnings = state.identity.activeWarnings || [];
    
    if (warnings.length === 0) {
        warningsContainer.innerHTML = '';
        return;
    }
    
    const warningsHtml = warnings.map(warning => `
        <div class="investigation-warning bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-bold text-red-400 text-lg">${warning.title}</h4>
                    <p class="text-red-300 text-sm mt-1">${warning.message}</p>
                </div>
                <button class="text-red-400 hover:text-red-300 ml-4" onclick="dismissNotification('${warning.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${warning.actions ? warning.actions.map(action => `
                <button class="mt-3 mr-2 px-4 py-2 rounded text-sm font-medium ${action.class}" onclick="${action.callback}">
                    ${action.text}
                </button>
            `).join('') : ''}
        </div>
    `).join('');
    
    warningsContainer.innerHTML = warningsHtml;
}

/**
 * Dismiss notification
 */
function dismissNotification(notificationId) {
    if (state.identity.activeWarnings) {
        state.identity.activeWarnings = state.identity.activeWarnings.filter(w => w.id !== notificationId);
        updateActiveWarnings();
        saveState();
    }
}

/**
 * Initialize investigation state system
 */
function initializeInvestigationState() {
    console.log('Initializing Investigation State System...');
    
    // Ensure investigation level is properly initialized
    if (!state.identity.hasOwnProperty('investigationLevel')) {
        state.identity.investigationLevel = state.identity.suspicion || 0;
    }
    
    // Initialize other investigation fields if missing
    if (!state.identity.hasOwnProperty('lastWipeTimestamp')) {
        state.identity.lastWipeTimestamp = null;
    }
    if (!state.identity.hasOwnProperty('arrestCount')) {
        state.identity.arrestCount = 0;
    }
    if (!state.identity.hasOwnProperty('canWipeIdentity')) {
        state.identity.canWipeIdentity = true;
    }
    if (!state.identity.hasOwnProperty('activeWarnings')) {
        state.identity.activeWarnings = [];
    }
    
    // Initialize investigation logs
    if (!state.investigationLogs) {
        state.investigationLogs = [];
    }
    
    // Check current investigation state and apply appropriate consequences
    const currentState = getInvestigationState();
    if (currentState === INVESTIGATION_STATES.IMMINENT_RISK) {
        showImminentRiskNotification();
    }
    
    // Set up periodic investigation monitoring
    setInterval(() => {
        monitorInvestigationState();
    }, 30000); // Check every 30 seconds
    
    console.log('Investigation State System initialized successfully');
}

/**
 * Monitor investigation state periodically
 */
function monitorInvestigationState() {
    const level = state.identity.investigationLevel;
    const currentState = getInvestigationState(level);
    
    // Handle state-specific monitoring
    switch (currentState) {
        case INVESTIGATION_STATES.GROWING:
            // Occasionally generate events for growing investigation
            if (Math.random() < 0.1) { // 10% chance every check
                generateInvestigationEvent('growing');
            }
            break;
            
        case INVESTIGATION_STATES.IMMINENT_RISK:
            // Ensure warning is always visible
            if (!state.identity.activeWarnings.some(w => w.id === 'imminent-risk-warning')) {
                showImminentRiskNotification();
            }
            break;
    }
    
    // Update UI
    updateInvestigationUI();
}

// Export functions for use in other modules
window.InvestigationState = {
    increaseInvestigationLevel,
    getInvestigationState,
    showIdentityWipeModal,
    initializeInvestigationState,
    updateInvestigationUI,
    INVESTIGATION_STATES,
    INVESTIGATION_THRESHOLDS
};