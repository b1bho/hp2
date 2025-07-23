/**
 * js/modules/ip_traceability.js
 * Dynamic IP Traceability System
 * 
 * Implements a comprehensive system for tracking IP usage and consequences:
 * 1. IP Traceability Score management for different IP types
 * 2. Dynamic score increases based on attack outcomes
 * 3. Consequences for high traceability (IP burning, regeneration)
 * 4. Integration with player profile and investigation levels
 * 5. Special handling for DDoS and Mining operations
 */

// IP Types for traceability tracking
const IP_TYPES = {
    PERSONAL: 'personal',
    CLAN_SERVER: 'clan_server',
    CLAN_VPN: 'clan_vpn',
    PUBLIC_VPN: 'public_vpn',
    TOR_NODE: 'tor_node',
    INFECTED_HOST: 'infected_host'
};

// Base traceability increase factors
const TRACEABILITY_FACTORS = {
    // Attack outcome factors
    ATTACK_FAILURE: 15,
    ATTACK_SUCCESS: 5,
    ATTACK_PARTIAL: 10,
    
    // Flow characteristic multipliers
    HIGH_DETECTABILITY: 1.5,    // RL > 70
    MEDIUM_DETECTABILITY: 1.2,  // RL 40-70
    LOW_DETECTABILITY: 1.0,     // RL < 40
    
    LOW_ANONYMITY: 1.8,         // AN < 30
    MEDIUM_ANONYMITY: 1.3,      // AN 30-70
    HIGH_ANONYMITY: 1.0,        // AN > 70
    
    LOW_COMPLETENESS: 1.4,      // FC < 50
    MEDIUM_COMPLETENESS: 1.1,   // FC 50-80
    HIGH_COMPLETENESS: 1.0,     // FC > 80
    
    // Target tier multipliers
    TIER_1: 1.0,
    TIER_2: 1.5,
    TIER_3: 2.0,
    TIER_4: 3.0,
    
    // Repeated usage penalty
    REPEATED_USE: 1.3,
    
    // IP type base multipliers
    PERSONAL_BASE: 2.0,
    CLAN_SERVER_BASE: 1.5,
    CLAN_VPN_BASE: 1.2,
    PUBLIC_VPN_BASE: 1.0,
    TOR_NODE_BASE: 0.8,
    INFECTED_HOST_BASE: 1.1
};

// Traceability thresholds and consequences
const TRACEABILITY_THRESHOLDS = {
    LOW: 0,
    MEDIUM: 100,
    HIGH: 200,
    CRITICAL: 350,
    BURNED: 500
};

// IP regeneration costs (in XMR)
const REGENERATION_COSTS = {
    [IP_TYPES.CLAN_VPN]: 50,
    [IP_TYPES.PUBLIC_VPN]: 25,
    [IP_TYPES.TOR_NODE]: 10
};

/**
 * Initialize IP traceability system
 */
function initializeIpTraceability() {
    if (!state.ipTraceability) {
        state.ipTraceability = {};
    }
    
    if (!state.playerTraces) {
        state.playerTraces = {
            totalTraces: 0,
            investigationLevel: 0,
            traceHistory: [],
            investigatedBy: 'Nessuna'
        };
    }
    
    // Initialize personal computer IP traceability
    initializePersonalIpTraceability();
    
    // Initialize clan infrastructure IPs
    initializeClanIpTraceability();
    
    // Initialize infected host IPs
    initializeInfectedHostIpTraceability();
    
    // Initialize public service IPs
    initializePublicServiceIpTraceability();
}

/**
 * Initialize personal computer IP traceability
 */
function initializePersonalIpTraceability() {
    const personalIp = state.identity?.realIp || generateRandomIp();
    
    if (!state.ipTraceability[personalIp]) {
        state.ipTraceability[personalIp] = {
            ip: personalIp,
            type: IP_TYPES.PERSONAL,
            score: 0,
            usageCount: 0,
            lastUsed: null,
            status: 'active',
            traces: [],
            canRegenerate: false
        };
    }
    
    // Ensure identity has the real IP set
    if (!state.identity.realIp) {
        state.identity.realIp = personalIp;
    }
}

/**
 * Initialize clan infrastructure IP traceability
 */
function initializeClanIpTraceability() {
    if (!state.clan || !state.clan.infrastructure) return;
    
    // Initialize clan servers
    if (state.clan.infrastructure.servers) {
        state.clan.infrastructure.servers.forEach(server => {
            if (server.currentIp && !state.ipTraceability[server.currentIp]) {
                state.ipTraceability[server.currentIp] = {
                    ip: server.currentIp,
                    type: IP_TYPES.CLAN_SERVER,
                    score: 0,
                    usageCount: 0,
                    lastUsed: null,
                    status: 'active',
                    traces: [],
                    canRegenerate: true,
                    regenerationCost: 75
                };
            }
        });
    }
    
    // Initialize clan VPN
    if (state.clan.infrastructure.c_vpn && state.clan.infrastructure.c_vpn.currentIp) {
        const vpnIp = state.clan.infrastructure.c_vpn.currentIp;
        if (!state.ipTraceability[vpnIp]) {
            state.ipTraceability[vpnIp] = {
                ip: vpnIp,
                type: IP_TYPES.CLAN_VPN,
                score: 0,
                usageCount: 0,
                lastUsed: null,
                status: 'active',
                traces: [],
                canRegenerate: true,
                regenerationCost: REGENERATION_COSTS[IP_TYPES.CLAN_VPN]
            };
        }
    }
}

/**
 * Initialize infected host IP traceability
 */
function initializeInfectedHostIpTraceability() {
    if (!state.infectedHostPool) return;
    
    state.infectedHostPool.forEach(host => {
        if (host.ipAddress) {
            if (!state.ipTraceability[host.ipAddress]) {
                // Create new traceability entry
                state.ipTraceability[host.ipAddress] = {
                    ip: host.ipAddress,
                    type: IP_TYPES.INFECTED_HOST,
                    score: host.traceabilityScore || 0,
                    usageCount: 0,
                    lastUsed: null,
                    status: 'active',
                    traces: [],
                    canRegenerate: false,
                    hostId: host.id
                };
            } else {
                // Update existing entry to ensure hostId is correct
                const ipData = state.ipTraceability[host.ipAddress];
                if (!ipData.hostId || ipData.hostId !== host.id) {
                    console.log(`[IP Traceability] Updating hostId for IP ${host.ipAddress}: ${ipData.hostId} -> ${host.id}`);
                    ipData.hostId = host.id;
                }
                // Also ensure the type is correct
                if (ipData.type !== IP_TYPES.INFECTED_HOST) {
                    ipData.type = IP_TYPES.INFECTED_HOST;
                }
            }
        }
    });
}

/**
 * Register a newly infected host in the traceability system
 * Should be called whenever a new host is added to the infectedHostPool
 * @param {Object} host - The infected host object
 */
function registerNewInfectedHost(host) {
    if (!host || !host.ipAddress) return;
    
    console.log(`[IP Traceability] Registering new infected host: ${host.id} with IP ${host.ipAddress}`);
    
    state.ipTraceability[host.ipAddress] = {
        ip: host.ipAddress,
        type: IP_TYPES.INFECTED_HOST,
        score: host.traceabilityScore || 0,
        usageCount: 0,
        lastUsed: null,
        status: 'active',
        traces: [],
        canRegenerate: false,
        hostId: host.id
    };
}

/**
 * Initialize public service IP traceability
 */
function initializePublicServiceIpTraceability() {
    if (!state.purchasedServices) return;
    
    Object.values(state.purchasedServices).forEach(service => {
        if (service.currentIp && !state.ipTraceability[service.currentIp]) {
            const serviceType = service.serviceId?.includes('vpn') ? IP_TYPES.PUBLIC_VPN :
                              service.serviceId?.includes('tor') ? IP_TYPES.TOR_NODE :
                              IP_TYPES.PUBLIC_VPN;
            
            state.ipTraceability[service.currentIp] = {
                ip: service.currentIp,
                type: serviceType,
                score: 0,
                usageCount: 0,
                lastUsed: null,
                status: 'active',
                traces: [],
                canRegenerate: true,
                regenerationCost: REGENERATION_COSTS[serviceType] || 25,
                serviceId: service.serviceId
            };
        }
    });
}

/**
 * Ensure IP data is properly initialized in state.ipTraceability
 * @param {string} ipAddress - IP address to ensure
 * @param {string} type - IP type (optional, defaults to 'unknown')
 * @returns {Object} The IP data object
 */
function ensureIpData(ipAddress, type = 'unknown') {
    if (!state.ipTraceability) {
        state.ipTraceability = {};
    }
    
    const existing = state.ipTraceability[ipAddress];
    
    // If it's already a proper object, return it
    if (existing && typeof existing === 'object' && existing.traces) {
        return existing;
    }
    
    // If it's a legacy number, convert it to proper object
    const legacyScore = (typeof existing === 'number') ? existing : 0;
    
    state.ipTraceability[ipAddress] = {
        ip: ipAddress,
        type: type,
        score: legacyScore,
        usageCount: 0,
        lastUsed: null,
        status: 'active',
        traces: [],
        canRegenerate: false
    };
    
    return state.ipTraceability[ipAddress];
}

/**
 * Calculate traceability increase for an attack
 * @param {string} ipAddress - IP address used in attack
 * @param {Object} attackResult - Attack outcome data
 * @param {Object} flow - Flow data used in attack
 * @param {Object} target - Target data
 * @returns {number} Traceability score increase
 */
function calculateTraceabilityIncrease(ipAddress, attackResult, flow, target) {
    const ipData = ensureIpData(ipAddress);
    if (!ipData) return 0;
    
    let baseIncrease = 0;
    
    // Base increase by attack outcome
    switch (attackResult.status) {
        case 'success':
            baseIncrease = TRACEABILITY_FACTORS.ATTACK_SUCCESS;
            break;
        case 'failure':
            baseIncrease = TRACEABILITY_FACTORS.ATTACK_FAILURE;
            break;
        case 'partial':
            baseIncrease = TRACEABILITY_FACTORS.ATTACK_PARTIAL;
            break;
        default:
            baseIncrease = TRACEABILITY_FACTORS.ATTACK_FAILURE;
    }
    
    // Apply flow characteristic multipliers
    let multiplier = 1.0;
    
    if (flow && flow.stats) {
        // Detectability (RL) factor
        if (flow.stats.rl > 70) {
            multiplier *= TRACEABILITY_FACTORS.HIGH_DETECTABILITY;
        } else if (flow.stats.rl > 40) {
            multiplier *= TRACEABILITY_FACTORS.MEDIUM_DETECTABILITY;
        } else {
            multiplier *= TRACEABILITY_FACTORS.LOW_DETECTABILITY;
        }
        
        // Anonymity (AN) factor
        if (flow.stats.an < 30) {
            multiplier *= TRACEABILITY_FACTORS.LOW_ANONYMITY;
        } else if (flow.stats.an < 70) {
            multiplier *= TRACEABILITY_FACTORS.MEDIUM_ANONYMITY;
        } else {
            multiplier *= TRACEABILITY_FACTORS.HIGH_ANONYMITY;
        }
        
        // Functional Completeness (FC) factor
        if (flow.stats.fc < 50) {
            multiplier *= TRACEABILITY_FACTORS.LOW_COMPLETENESS;
        } else if (flow.stats.fc < 80) {
            multiplier *= TRACEABILITY_FACTORS.MEDIUM_COMPLETENESS;
        } else {
            multiplier *= TRACEABILITY_FACTORS.HIGH_COMPLETENESS;
        }
    }
    
    // Target tier multiplier
    if (target && target.difficulty) {
        switch (target.difficulty) {
            case 1: multiplier *= TRACEABILITY_FACTORS.TIER_1; break;
            case 2: multiplier *= TRACEABILITY_FACTORS.TIER_2; break;
            case 3: multiplier *= TRACEABILITY_FACTORS.TIER_3; break;
            case 4: multiplier *= TRACEABILITY_FACTORS.TIER_4; break;
        }
    }
    
    // IP type base multiplier
    switch (ipData.type) {
        case IP_TYPES.PERSONAL:
            multiplier *= TRACEABILITY_FACTORS.PERSONAL_BASE;
            break;
        case IP_TYPES.CLAN_SERVER:
            multiplier *= TRACEABILITY_FACTORS.CLAN_SERVER_BASE;
            break;
        case IP_TYPES.CLAN_VPN:
            multiplier *= TRACEABILITY_FACTORS.CLAN_VPN_BASE;
            break;
        case IP_TYPES.PUBLIC_VPN:
            multiplier *= TRACEABILITY_FACTORS.PUBLIC_VPN_BASE;
            break;
        case IP_TYPES.TOR_NODE:
            multiplier *= TRACEABILITY_FACTORS.TOR_NODE_BASE;
            break;
        case IP_TYPES.INFECTED_HOST:
            multiplier *= TRACEABILITY_FACTORS.INFECTED_HOST_BASE;
            break;
    }
    
    // Repeated usage penalty
    if (ipData.usageCount > 3) {
        multiplier *= TRACEABILITY_FACTORS.REPEATED_USE;
    }
    
    return Math.round(baseIncrease * multiplier);
}

/**
 * Apply traceability increase to an IP
 * @param {string} ipAddress - IP address
 * @param {number} increase - Score increase amount
 * @param {Object} traceData - Trace event data
 */
function applyTraceabilityIncrease(ipAddress, increase, traceData) {
    const ipData = ensureIpData(ipAddress);
    if (!ipData || ipData.status === 'burned') return;
    
    // Apply the increase
    ipData.score += increase;
    ipData.usageCount += 1;
    ipData.lastUsed = Date.now();
    
    // Record the trace
    const trace = {
        timestamp: Date.now(),
        increase: increase,
        totalScore: ipData.score,
        event: traceData.event || 'attack',
        target: traceData.target || 'unknown',
        flow: traceData.flow || 'unknown',
        details: traceData.details || {}
    };
    
    ipData.traces.push(trace);
    
    // Update player traces - ONLY for personal IP (as only personal IP can lead to hacker's identity)
    if (ipData.type === IP_TYPES.PERSONAL) {
        state.playerTraces.totalTraces += increase;
        // Show specific notification for personal IP usage
        showPersonalIpTraceabilityNotification(ipAddress, increase, ipData.score);
    }
    
    // Always add to trace history for tracking purposes
    state.playerTraces.traceHistory.push({
        ...trace,
        ip: ipAddress,
        ipType: ipData.type
    });
    
    // Check for consequences
    checkTraceabilityConsequences(ipAddress);
    
    // Update investigation level
    updateInvestigationLevel();
    
    // Show notification for non-personal IPs (personal IP notifications are shown above)
    if (ipData.type !== IP_TYPES.PERSONAL) {
        showTraceabilityNotification(ipAddress, increase, ipData.score);
    }
    
    saveState();
}

/**
 * Check and apply consequences for high traceability
 * @param {string} ipAddress - IP address to check
 */
function checkTraceabilityConsequences(ipAddress) {
    const ipData = state.ipTraceability[ipAddress];
    if (!ipData) return;
    
    const score = ipData.score;
    
    // Check for IP burning
    if (score >= TRACEABILITY_THRESHOLDS.BURNED) {
        burnIpAddress(ipAddress);
        return;
    }
    
    // Check for critical level consequences
    if (score >= TRACEABILITY_THRESHOLDS.CRITICAL) {
        applyCriticalConsequences(ipAddress);
    } else if (score >= TRACEABILITY_THRESHOLDS.HIGH) {
        applyHighConsequences(ipAddress);
    } else if (score >= TRACEABILITY_THRESHOLDS.MEDIUM) {
        applyMediumConsequences(ipAddress);
    }
}

/**
 * Burn an IP address (make it unusable)
 * @param {string} ipAddress - IP address to burn
 */
function burnIpAddress(ipAddress) {
    const ipData = state.ipTraceability[ipAddress];
    if (!ipData) {
        console.warn(`[IP Traceability] Attempted to burn non-existent IP: ${ipAddress}`);
        return;
    }
    
    console.log(`[IP Traceability] Burning IP ${ipAddress} (type: ${ipData.type}, score: ${ipData.score})`);
    
    ipData.status = 'burned';
    
    // Handle special cases based on IP type
    switch (ipData.type) {
        case IP_TYPES.INFECTED_HOST:
            console.log(`[IP Traceability] Burning infected host IP ${ipAddress} with hostId: ${ipData.hostId}`);
            if (ipData.hostId) {
                removeInfectedHost(ipData.hostId);
                showNotification(`Host infetto ${ipAddress} è stato pulito dalle autorità!`, 'error');
            } else {
                console.error(`[IP Traceability] No hostId found for infected host IP ${ipAddress}`);
                showNotification(`IP host infetto ${ipAddress} è stato bruciato!`, 'error');
            }
            break;
            
        case IP_TYPES.PERSONAL:
            showNotification(`Il tuo IP personale ${ipAddress} è stato bruciato! Rischi conseguenze gravi.`, 'error');
            state.playerTraces.investigationLevel += 50;
            break;
            
        case IP_TYPES.CLAN_SERVER:
            showNotification(`Server del clan ${ipAddress} è stato compromesso!`, 'error');
            break;
            
        default:
            showNotification(`IP ${ipAddress} è stato bruciato e non può più essere utilizzato.`, 'error');
    }
    
    // Auto-regenerate if possible
    if (ipData.canRegenerate) {
        scheduleIpRegeneration(ipAddress);
    }
    
    // Update UI if profile page is visible
    if (typeof renderProfileContent === 'function') {
        renderProfileContent();
    }
}

/**
 * Apply critical level consequences
 * @param {string} ipAddress - IP address
 */
function applyCriticalConsequences(ipAddress) {
    const ipData = state.ipTraceability[ipAddress];
    
    // Increase investigation level
    state.playerTraces.investigationLevel += 10;
    
    // High chance of triggering target countermeasures
    if (Math.random() < 0.8) {
        triggerTargetCountermeasures();
    }
    
    showNotification(`IP ${ipAddress} è sotto forte sorveglianza! Livello di rischio CRITICO.`, 'error');
}

/**
 * Apply high level consequences
 * @param {string} ipAddress - IP address
 */
function applyHighConsequences(ipAddress) {
    const ipData = state.ipTraceability[ipAddress];
    
    // Moderate investigation level increase
    state.playerTraces.investigationLevel += 5;
    
    // Chance of triggering target countermeasures
    if (Math.random() < 0.5) {
        triggerTargetCountermeasures();
    }
    
    showNotification(`IP ${ipAddress} è monitorato dalle autorità. Livello di rischio ALTO.`, 'warning');
}

/**
 * Apply medium level consequences
 * @param {string} ipAddress - IP address
 */
function applyMediumConsequences(ipAddress) {
    const ipData = state.ipTraceability[ipAddress];
    
    // Small investigation level increase
    state.playerTraces.investigationLevel += 2;
    
    // Low chance of triggering target countermeasures
    if (Math.random() < 0.2) {
        triggerTargetCountermeasures();
    }
    
    showNotification(`IP ${ipAddress} ha attirato l'attenzione. Livello di rischio MEDIO.`, 'info');
}

/**
 * Remove infected host due to IP burning
 * @param {string} hostId - Host ID to remove
 */
function removeInfectedHost(hostId) {
    if (!state.infectedHostPool) return;
    
    console.log(`[IP Traceability] Attempting to remove infected host: ${hostId}`);
    
    // Find the host before removal for logging
    const hostToRemove = state.infectedHostPool.find(host => host.id === hostId);
    if (!hostToRemove) {
        console.warn(`[IP Traceability] Host ${hostId} not found in infectedHostPool`);
        return;
    }
    
    console.log(`[IP Traceability] Found host ${hostId} with IP ${hostToRemove.ipAddress}, removing...`);
    
    // Remove from infected host pool
    const initialCount = state.infectedHostPool.length;
    state.infectedHostPool = state.infectedHostPool.filter(host => host.id !== hostId);
    console.log(`[IP Traceability] Infected host pool size: ${initialCount} -> ${state.infectedHostPool.length}`);
    
    // Remove from botnet groups
    let removedFromGroups = 0;
    if (state.botnetGroups) {
        Object.keys(state.botnetGroups).forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group.hostIds) {
                const initialGroupSize = group.hostIds.length;
                group.hostIds = group.hostIds.filter(id => id !== hostId);
                if (group.hostIds.length < initialGroupSize) {
                    removedFromGroups++;
                    console.log(`[IP Traceability] Removed host ${hostId} from group "${groupName}"`);
                }
            }
        });
    }
    
    // Clean up empty groups
    if (typeof cleanupEmptyGroups === 'function') {
        const cleanedGroups = cleanupEmptyGroups();
        if (cleanedGroups > 0) {
            console.log(`[IP Traceability] Cleaned up ${cleanedGroups} empty groups`);
        }
    } else {
        console.warn('[IP Traceability] cleanupEmptyGroups function not available');
    }
    
    // Update UI if botnet page is currently visible
    if (typeof updateBotnetAggregateStats === 'function') {
        updateBotnetAggregateStats();
    }
    if (typeof updateBotnetGroupsUI === 'function') {
        updateBotnetGroupsUI();
    }
    
    // Refresh botnet hosts list and related UI components
    if (typeof renderInfectedHostsList === 'function') {
        renderInfectedHostsList();
    }
    if (typeof renderHostDetailsPanel === 'function') {
        renderHostDetailsPanel();
    }
    if (typeof renderBotGroupSelection === 'function') {
        renderBotGroupSelection();
    }
    if (typeof renderMiningGroups === 'function') {
        renderMiningGroups();
    }
    
    // Save state
    saveState();
    
    console.log(`[IP Traceability] Successfully removed host ${hostId} from ${removedFromGroups} groups`);
}

/**
 * Schedule IP regeneration for burned IPs
 * @param {string} ipAddress - IP address to regenerate
 */
function scheduleIpRegeneration(ipAddress) {
    const ipData = state.ipTraceability[ipAddress];
    if (!ipData || !ipData.canRegenerate) return;
    
    // Check if player can afford regeneration
    const cost = ipData.regenerationCost || 25;
    if (state.xmr < cost) {
        showNotification(`Non hai abbastanza XMR (${cost}) per rigenerare l'IP ${ipAddress}.`, 'error');
        return;
    }
    
    // Charge for regeneration
    state.xmr -= cost;
    
    // Generate new IP
    const newIp = generateRandomIp();
    
    // Update service/infrastructure with new IP
    updateIpInServices(ipAddress, newIp);
    
    // Create new traceability entry
    state.ipTraceability[newIp] = {
        ...ipData,
        ip: newIp,
        score: 0,
        usageCount: 0,
        lastUsed: null,
        status: 'active',
        traces: [],
        regeneratedFrom: ipAddress
    };
    
    // Mark old IP as regenerated
    ipData.status = 'regenerated';
    ipData.regeneratedTo = newIp;
    
    showNotification(`IP ${ipAddress} rigenerato in ${newIp}. Costo: ${cost} XMR.`, 'success');
}

/**
 * Update IP address in services and infrastructure
 * @param {string} oldIp - Old IP address
 * @param {string} newIp - New IP address
 */
function updateIpInServices(oldIp, newIp) {
    // Update in purchased services
    if (state.purchasedServices) {
        Object.values(state.purchasedServices).forEach(service => {
            if (service.currentIp === oldIp) {
                service.currentIp = newIp;
            }
        });
    }
    
    // Update in clan infrastructure
    if (state.clan && state.clan.infrastructure) {
        // Update clan VPN
        if (state.clan.infrastructure.c_vpn && state.clan.infrastructure.c_vpn.currentIp === oldIp) {
            state.clan.infrastructure.c_vpn.currentIp = newIp;
        }
        
        // Update clan servers
        if (state.clan.infrastructure.servers) {
            state.clan.infrastructure.servers.forEach(server => {
                if (server.currentIp === oldIp) {
                    server.currentIp = newIp;
                }
            });
        }
    }
}

/**
 * Trigger target countermeasures due to high traceability
 */
function triggerTargetCountermeasures() {
    // Use the dynamic countermeasures system
    if (typeof triggerCountermeasuresFromTraceability === 'function') {
        triggerCountermeasuresFromTraceability('high_traceability');
    } else {
        // Fallback to basic countermeasure triggering
        const availableTargets = Object.keys(state.dynamicTargetStates || {});
        if (availableTargets.length > 0) {
            const randomTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
            showNotification(`Target ${randomTarget} ha attivato contromisure di sicurezza avanzate!`, 'warning');
        }
    }
}

/**
 * Update player investigation level based on personal IP traces only
 * Only the personal IP can lead back to the hacker's identity
 */
function updateInvestigationLevel() {
    const totalTraces = state.playerTraces.totalTraces;
    
    let newLevel = 0;
    if (totalTraces > 1000) newLevel = 5;
    else if (totalTraces > 500) newLevel = 4;
    else if (totalTraces > 200) newLevel = 3;
    else if (totalTraces > 100) newLevel = 2;
    else if (totalTraces > 50) newLevel = 1;
    
    if (newLevel > state.playerTraces.investigationLevel) {
        state.playerTraces.investigationLevel = newLevel;
        
        const agencies = ['FBI', 'NSA', 'Interpol', 'CIA', 'Europol'];
        state.playerTraces.investigatedBy = agencies[Math.min(newLevel - 1, agencies.length - 1)];
        
        showNotification(`🚨 LIVELLO DI INDAGINE AUMENTATO A ${newLevel}! Ora sei investigato da: ${state.playerTraces.investigatedBy}. Solo le tracce del tuo IP personale contribuiscono a questo livello.`, 'error');
    }
}

/**
 * Show traceability notification to player
 * @param {string} ipAddress - IP address
 * @param {number} increase - Score increase
 * @param {number} totalScore - Total score after increase
 */
function showTraceabilityNotification(ipAddress, increase, totalScore) {
    let level = 'info';
    let message = `IP ${ipAddress}: +${increase} tracce (Total: ${totalScore})`;
    
    if (totalScore >= TRACEABILITY_THRESHOLDS.CRITICAL) {
        level = 'error';
        message += ' - CRITICO!';
    } else if (totalScore >= TRACEABILITY_THRESHOLDS.HIGH) {
        level = 'warning';
        message += ' - ALTO RISCHIO!';
    } else if (totalScore >= TRACEABILITY_THRESHOLDS.MEDIUM) {
        level = 'warning';
        message += ' - Attenzione';
    }
    
    if (typeof showNotification === 'function') {
        showNotification(message, level);
    }
}

/**
 * Show specific notification for personal IP traceability increases
 * @param {string} ipAddress - Personal IP address
 * @param {number} increase - Score increase
 * @param {number} totalScore - Total score after increase
 */
function showPersonalIpTraceabilityNotification(ipAddress, increase, totalScore) {
    let level = 'warning';
    let message = `⚠️ IP PERSONALE ${ipAddress}: +${increase} tracce di indagine (Total: ${totalScore})`;
    
    if (totalScore >= TRACEABILITY_THRESHOLDS.CRITICAL) {
        level = 'error';
        message = `🚨 IP PERSONALE ${ipAddress}: +${increase} tracce - RISCHIO CRITICO! (Total: ${totalScore}) - Le autorità potrebbero identificarti!`;
    } else if (totalScore >= TRACEABILITY_THRESHOLDS.HIGH) {
        level = 'error';
        message = `🔴 IP PERSONALE ${ipAddress}: +${increase} tracce - ALTO RISCHIO! (Total: ${totalScore}) - Sei sotto sorveglianza!`;
    } else if (totalScore >= TRACEABILITY_THRESHOLDS.MEDIUM) {
        level = 'warning';
        message = `🟡 IP PERSONALE ${ipAddress}: +${increase} tracce - ATTENZIONE! (Total: ${totalScore}) - Le autorità ti stanno notando.`;
    } else {
        message = `🔵 IP PERSONALE ${ipAddress}: +${increase} tracce (Total: ${totalScore}) - Solo il tuo IP personale può portare alla tua identità.`;
    }
    
    if (typeof showNotification === 'function') {
        showNotification(message, level);
    }
}

/**
 * Get traceability status for an IP
 * @param {string} ipAddress - IP address
 * @returns {Object} Status information
 */
function getIpTraceabilityStatus(ipAddress) {
    const ipData = state.ipTraceability[ipAddress];
    if (!ipData) {
        return { level: 'unknown', status: 'No data', canUse: false };
    }
    
    const score = ipData.score;
    let level, status, canUse;
    
    if (ipData.status === 'burned') {
        level = 'burned';
        status = 'BRUCIATO';
        canUse = false;
    } else if (score >= TRACEABILITY_THRESHOLDS.CRITICAL) {
        level = 'critical';
        status = 'CRITICO';
        canUse = true;
    } else if (score >= TRACEABILITY_THRESHOLDS.HIGH) {
        level = 'high';
        status = 'ALTO';
        canUse = true;
    } else if (score >= TRACEABILITY_THRESHOLDS.MEDIUM) {
        level = 'medium';
        status = 'MEDIO';
        canUse = true;
    } else {
        level = 'low';
        status = 'SICURO';
        canUse = true;
    }
    
    return {
        level,
        status,
        canUse,
        score,
        usageCount: ipData.usageCount,
        lastUsed: ipData.lastUsed,
        type: ipData.type,
        canRegenerate: ipData.canRegenerate
    };
}

/**
 * Handle DDoS attack traceability
 * @param {Array} selectedHostIds - IDs of hosts used in attack
 * @param {string} targetIp - Target IP address
 * @param {Object} attackResult - Attack result
 */
function handleDDoSTraceability(selectedHostIds, targetIp, attackResult) {
    if (!selectedHostIds || selectedHostIds.length === 0) return;
    
    // Base traceability increase for DDoS
    const baseDDoSIncrease = 20;
    const impactMultiplier = (attackResult.impact || 1) / 10; // Scale by impact
    
    selectedHostIds.forEach(hostId => {
        const host = state.infectedHostPool?.find(h => h.id === hostId);
        if (!host) return;
        
        const increase = Math.round(baseDDoSIncrease * impactMultiplier);
        
        applyTraceabilityIncrease(host.ipAddress, increase, {
            event: 'ddos_attack',
            target: targetIp,
            flow: 'ddos',
            details: {
                impact: attackResult.impact,
                duration: attackResult.duration,
                hostId: hostId
            }
        });
        
        // Higher chance of host loss for burned IPs
        const ipStatus = getIpTraceabilityStatus(host.ipAddress);
        if (ipStatus.level === 'critical' && Math.random() < 0.3) {
            burnIpAddress(host.ipAddress);
        }
    });
}

/**
 * Handle mining operation traceability
 * @param {Array} selectedHostIds - IDs of hosts used in mining
 * @param {number} duration - Mining duration in seconds
 */
function handleMiningTraceability(selectedHostIds, duration) {
    if (!selectedHostIds || selectedHostIds.length === 0) return;
    
    // Lower but consistent traceability increase for mining
    const baseMiningIncrease = 5;
    const durationMultiplier = Math.min(duration / 3600, 2); // Max 2x for long operations
    
    selectedHostIds.forEach(hostId => {
        const host = state.infectedHostPool?.find(h => h.id === hostId);
        if (!host) return;
        
        const increase = Math.round(baseMiningIncrease * durationMultiplier);
        
        applyTraceabilityIncrease(host.ipAddress, increase, {
            event: 'mining_operation',
            target: 'cryptocurrency_mining',
            flow: 'mining',
            details: {
                duration: duration,
                hostId: hostId
            }
        });
    });
}

/**
 * Get all IP addresses with their traceability status
 * @returns {Array} Array of IP data with status
 */
function getAllIpTraceabilityData() {
    const ipList = [];
    
    Object.values(state.ipTraceability || {}).forEach(ipData => {
        const status = getIpTraceabilityStatus(ipData.ip);
        ipList.push({
            ...ipData,
            ...status
        });
    });
    
    return ipList.sort((a, b) => b.score - a.score);
}

// Export functions for global access
window.initializeIpTraceability = initializeIpTraceability;
window.ensureIpData = ensureIpData;
window.calculateTraceabilityIncrease = calculateTraceabilityIncrease;
window.applyTraceabilityIncrease = applyTraceabilityIncrease;
window.getIpTraceabilityStatus = getIpTraceabilityStatus;
window.handleDDoSTraceability = handleDDoSTraceability;
window.handleMiningTraceability = handleMiningTraceability;
window.getAllIpTraceabilityData = getAllIpTraceabilityData;
window.scheduleIpRegeneration = scheduleIpRegeneration;
window.registerNewInfectedHost = registerNewInfectedHost;
window.IP_TYPES = IP_TYPES;
window.TRACEABILITY_THRESHOLDS = TRACEABILITY_THRESHOLDS;