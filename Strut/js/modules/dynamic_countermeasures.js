/**
 * js/modules/dynamic_countermeasures.js
 * Dynamic Target Countermeasures System
 * 
 * Implements advanced countermeasure mechanisms for targets:
 * 1. Dynamic IP Rotation (IP Changes)
 * 2. Defense Hardening (Temporary parameter boosts)
 * 3. Last Node Detection (Routing chain tracking)
 * 4. Player notifications and UI integration
 */

// Countermeasure types
const COUNTERMEASURE_TYPES = {
    IP_ROTATION: 'ip_rotation',
    DEFENSE_HARDENING: 'defense_hardening', 
    LAST_NODE_DETECTION: 'last_node_detection'
};

// Countermeasure trigger probabilities by tier
const COUNTERMEASURE_PROBABILITIES = {
    1: { ip_rotation: 0.1, defense_hardening: 0.15, last_node_detection: 0.05 },
    2: { ip_rotation: 0.2, defense_hardening: 0.25, last_node_detection: 0.15 },
    3: { ip_rotation: 0.35, defense_hardening: 0.4, last_node_detection: 0.25 },
    4: { ip_rotation: 0.5, defense_hardening: 0.6, last_node_detection: 0.4 }
};

// Defense hardening multipliers by tier
const DEFENSE_HARDENING_MULTIPLIERS = {
    1: { lso: 1.2, rc: 1.15, lcs: 1.2, an: 1.1, eo: 1.15, rl: 1.1 },
    2: { lso: 1.35, rc: 1.25, lcs: 1.3, an: 1.2, eo: 1.25, rl: 1.15 },
    3: { lso: 1.5, rc: 1.4, lcs: 1.45, an: 1.3, eo: 1.4, rl: 1.25 },
    4: { lso: 1.8, rc: 1.6, lcs: 1.7, an: 1.5, eo: 1.65, rl: 1.4 }
};

// Duration of defense hardening by tier (in seconds)
const DEFENSE_HARDENING_DURATION = {
    1: 300,   // 5 minutes
    2: 600,   // 10 minutes
    3: 1200,  // 20 minutes
    4: 1800   // 30 minutes
};

/**
 * Initialize dynamic target states if not already present
 */
function initializeDynamicTargetStates() {
    if (!state.dynamicTargetStates) {
        state.dynamicTargetStates = {};
    }
    
    // Initialize states for all targets in worldTargets
    Object.keys(worldTargets).forEach(targetId => {
        if (!state.dynamicTargetStates[targetId]) {
            state.dynamicTargetStates[targetId] = {
                currentIp: worldTargets[targetId].ipAddress,
                originalIp: worldTargets[targetId].ipAddress,
                ipChangeHistory: [],
                defenseHardening: {
                    active: false,
                    multipliers: null,
                    expiresAt: null
                },
                detectedNodes: new Set(),
                lastAttackTime: null,
                countermeasureHistory: []
            };
        }
    });
}

/**
 * Generate a new random IP address for a target
 * @param {string} targetId - Target identifier
 * @returns {string} New IP address
 */
function generateNewTargetIp(targetId) {
    // Generate a realistic IP that's different from current
    const currentState = state.dynamicTargetStates[targetId];
    let newIp;
    
    do {
        newIp = generateRandomIp();
    } while (newIp === currentState.currentIp);
    
    return newIp;
}

/**
 * Execute IP rotation countermeasure for a target
 * @param {string} targetId - Target identifier
 * @param {Object} attack - Current attack object
 */
function executeIpRotation(targetId, attack) {
    const targetState = state.dynamicTargetStates[targetId];
    const target = worldTargets[targetId];
    const newIp = generateNewTargetIp(targetId);
    
    // Update target state
    targetState.currentIp = newIp;
    targetState.ipChangeHistory.push({
        oldIp: target.ipAddress,
        newIp: newIp,
        timestamp: Date.now(),
        reason: 'attack_detected'
    });
    
    // Update the target object itself
    target.ipAddress = newIp;
    
    // Record countermeasure
    targetState.countermeasureHistory.push({
        type: COUNTERMEASURE_TYPES.IP_ROTATION,
        timestamp: Date.now(),
        details: { oldIp: targetState.currentIp, newIp: newIp }
    });
    
    // Interrupt ongoing attack
    if (attack) {
        interruptAttack(attack, 'ip_rotation');
    }
    
    // Notify player
    showNotification(
        `L'IP di ${target.name} è cambiato. L'attacco è stato interrotto.`,
        'error'
    );
    
    // Force reconnaissance requirement
    if (state.discoveredTargets.includes(targetId)) {
        // Remove from discovered targets to force new reconnaissance
        const index = state.discoveredTargets.indexOf(targetId);
        if (index > -1) {
            state.discoveredTargets.splice(index, 1);
        }
        
        showNotification(
            `È necessaria una nuova Ricognizione per scoprire il nuovo IP di ${target.name}.`,
            'info'
        );
    }
    
    // Update UI if on world page
    if (state.activePage === 'world') {
        updateWorldTargetDisplay();
    }
    
    return true;
}

/**
 * Execute defense hardening countermeasure for a target
 * @param {string} targetId - Target identifier
 * @param {Object} attack - Current attack object
 */
function executeDefenseHardening(targetId, attack) {
    const targetState = state.dynamicTargetStates[targetId];
    const target = worldTargets[targetId];
    const tier = target.tier || 1;
    const multipliers = DEFENSE_HARDENING_MULTIPLIERS[tier];
    const duration = DEFENSE_HARDENING_DURATION[tier];
    
    // Apply defense hardening
    targetState.defenseHardening = {
        active: true,
        multipliers: multipliers,
        expiresAt: Date.now() + (duration * 1000)
    };
    
    // Record countermeasure
    targetState.countermeasureHistory.push({
        type: COUNTERMEASURE_TYPES.DEFENSE_HARDENING,
        timestamp: Date.now(),
        details: { multipliers, duration }
    });
    
    // Notify player
    showNotification(
        `Le difese di ${target.name} sono state rafforzate temporaneamente.`,
        'error'
    );
    
    // Set timer to remove hardening
    setTimeout(() => {
        if (targetState.defenseHardening.expiresAt <= Date.now()) {
            targetState.defenseHardening.active = false;
            targetState.defenseHardening.multipliers = null;
            targetState.defenseHardening.expiresAt = null;
            
            showNotification(
                `Le difese rafforzate di ${target.name} sono tornate normali.`,
                'info'
            );
        }
    }, duration * 1000);
    
    return true;
}

/**
 * Execute last node detection countermeasure
 * @param {string} targetId - Target identifier  
 * @param {Object} attack - Current attack object
 */
function executeLastNodeDetection(targetId, attack) {
    const targetState = state.dynamicTargetStates[targetId];
    const target = worldTargets[targetId];
    
    if (!attack.routingChain || attack.routingChain.length === 0) return false;
    
    // Get the last node in the routing chain
    const lastNodeId = attack.routingChain[attack.routingChain.length - 1];
    const lastNode = getNodeInfo(lastNodeId);
    
    if (!lastNode) return false;
    
    const lastNodeIp = lastNode.currentIp || lastNode.ipAddress;
    
    // Track the detected node
    targetState.detectedNodes.add(lastNodeIp);
    
    // Drastically increase IP traceability score for the last node
    if (!state.ipTraceability[lastNodeIp]) {
        state.ipTraceability[lastNodeIp] = 0;
    }
    state.ipTraceability[lastNodeIp] = Math.min(100, state.ipTraceability[lastNodeIp] + 40);
    
    // Record countermeasure
    targetState.countermeasureHistory.push({
        type: COUNTERMEASURE_TYPES.LAST_NODE_DETECTION,
        timestamp: Date.now(),
        details: { detectedNodeIp: lastNodeIp, nodeId: lastNodeId }
    });
    
    // Notify player
    showNotification(
        `Attenzione: ${target.name} ha rilevato un pattern nel tuo routing. Cambia la tua catena per i prossimi attacchi!`,
        'error'
    );
    
    return true;
}

/**
 * Check if an attack should be blocked due to detected last nodes
 * @param {string} targetId - Target identifier
 * @param {Array} routingChain - Routing chain for the attack
 * @returns {boolean} True if attack should be blocked
 */
function checkLastNodeBlocking(targetId, routingChain) {
    const targetState = state.dynamicTargetStates[targetId];
    
    if (!routingChain || routingChain.length === 0) return false;
    
    const lastNodeId = routingChain[routingChain.length - 1];
    const lastNode = getNodeInfo(lastNodeId);
    
    if (!lastNode) return false;
    
    const lastNodeIp = lastNode.currentIp || lastNode.ipAddress;
    
    return targetState.detectedNodes.has(lastNodeIp);
}

/**
 * Get modified target requirements based on active countermeasures
 * @param {string} targetId - Target identifier
 * @returns {Object} Modified target requirements
 */
function getModifiedTargetRequirements(targetId) {
    const target = worldTargets[targetId];
    const targetState = state.dynamicTargetStates[targetId];
    
    if (!target || !targetState) return target.req;
    
    let modifiedReq = { ...target.req };
    
    // Apply defense hardening if active
    if (targetState.defenseHardening.active && targetState.defenseHardening.expiresAt > Date.now()) {
        const multipliers = targetState.defenseHardening.multipliers;
        
        Object.keys(multipliers).forEach(stat => {
            if (modifiedReq[stat] !== undefined) {
                modifiedReq[stat] = parseFloat((modifiedReq[stat] * multipliers[stat]).toFixed(2));
            }
        });
    }
    
    return modifiedReq;
}

/**
 * Evaluate and potentially trigger countermeasures for an attack
 * @param {Object} attack - Attack object
 * @param {number} successRatio - Attack success ratio (0-1)
 */
function evaluateCountermeasures(attack, successRatio) {
    if (!attack.target || !attack.target.id) return;
    
    const targetId = attack.target.id;
    const target = worldTargets[targetId];
    const tier = target.tier || 1;
    const probabilities = COUNTERMEASURE_PROBABILITIES[tier];
    
    // Initialize target state if needed
    initializeDynamicTargetStates();
    
    const targetState = state.dynamicTargetStates[targetId];
    targetState.lastAttackTime = Date.now();
    
    // Show initial detection message for higher tier targets  
    if (tier >= 3 && successRatio < 0.8) {
        showNotification(
            `Attacco rilevato! ${target.name} ha attivato le contromisure.`,
            'error'
        );
    }
    
    // Calculate countermeasure trigger chances based on attack performance
    const failureSeverity = 1 - successRatio;
    const baseChanceMultiplier = 1 + (failureSeverity * 2); // More likely if attack failed
    
    // IP Rotation check
    if (Math.random() < (probabilities.ip_rotation * baseChanceMultiplier)) {
        executeIpRotation(targetId, attack);
        return; // Only one countermeasure per attack
    }
    
    // Defense Hardening check
    if (Math.random() < (probabilities.defense_hardening * baseChanceMultiplier)) {
        executeDefenseHardening(targetId, attack);
        return;
    }
    
    // Last Node Detection check
    if (Math.random() < (probabilities.last_node_detection * baseChanceMultiplier)) {
        executeLastNodeDetection(targetId, attack);
        return;
    }
}

/**
 * Interrupt an ongoing attack due to countermeasures
 * @param {Object} attack - Attack to interrupt
 * @param {string} reason - Reason for interruption
 */
function interruptAttack(attack, reason) {
    if (!state.activeAttacks) return;
    
    const attackIndex = state.activeAttacks.findIndex(a => a.id === attack.id);
    if (attackIndex === -1) return;
    
    // Remove the attack from active attacks
    state.activeAttacks.splice(attackIndex, 1);
    
    // Update UI
    if (state.activePage === 'world') {
        updateActiveAttacks();
    }
    
    saveState();
}

/**
 * Get node information by ID (helper function)
 * @param {string} nodeId - Node identifier
 * @returns {Object|null} Node information
 */
function getNodeInfo(nodeId) {
    // Check network nodes
    if (networkNodeData && networkNodeData[nodeId]) {
        return networkNodeData[nodeId];
    }
    
    // Check personal services
    const personalService = marketData?.networkServices?.find(s => s.id === nodeId);
    if (personalService) {
        return { 
            ...personalService, 
            currentIp: state.purchasedServices?.[nodeId]?.currentIp 
        };
    }
    
    // Check clan VPN
    if (nodeId.startsWith('c_vpn_t') && state.clan?.infrastructure.c_vpn) {
        const tier = state.clan.infrastructure.c_vpn.tier - 1;
        return { 
            ...marketData.clanInfrastructure.c_vpn.tiers[tier], 
            currentIp: state.clan.infrastructure.c_vpn.currentIp 
        };
    }
    
    return null;
}

/**
 * Update world target display to show countermeasure states
 */
function updateWorldTargetDisplay() {
    // This will be called by the world module to update target displays
    // Implementation depends on how the world page renders targets
    if (typeof updateTargetStatesInWorldView === 'function') {
        updateTargetStatesInWorldView();
    }
}

/**
 * Get target status for display purposes
 * @param {string} targetId - Target identifier
 * @returns {Object} Target status information
 */
function getTargetStatus(targetId) {
    initializeDynamicTargetStates();
    
    const targetState = state.dynamicTargetStates[targetId];
    const target = worldTargets[targetId];
    
    if (!targetState || !target) {
        return { status: 'normal', indicators: [] };
    }
    
    const indicators = [];
    
    // Check for IP changes
    if (targetState.currentIp !== targetState.originalIp) {
        indicators.push({
            type: 'ip_changed',
            icon: 'fas fa-exchange-alt',
            tooltip: 'IP address changed',
            class: 'text-orange-400'
        });
    }
    
    // Check for active defense hardening
    if (targetState.defenseHardening.active && targetState.defenseHardening.expiresAt > Date.now()) {
        indicators.push({
            type: 'hardened',
            icon: 'fas fa-shield-alt',
            tooltip: 'Enhanced defenses active',
            class: 'text-red-400'
        });
    }
    
    // Check for detected nodes
    if (targetState.detectedNodes.size > 0) {
        indicators.push({
            type: 'tracking',
            icon: 'fas fa-eye',
            tooltip: 'Routing patterns detected',
            class: 'text-yellow-400'
        });
    }
    
    const status = indicators.length > 0 ? 'countermeasures_active' : 'normal';
    
    return { status, indicators };
}

// Export functions for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeDynamicTargetStates,
        evaluateCountermeasures,
        getModifiedTargetRequirements,
        checkLastNodeBlocking,
        getTargetStatus,
        COUNTERMEASURE_TYPES
    };
}