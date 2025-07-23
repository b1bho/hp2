/**
 * js/modules/ip_traceability_system.js  
 * Enhanced IP Traceability System
 * 
 * Manages comprehensive IP traceability scoring for all IP types:
 * - Personal IPs, Clan IPs, Botnet IPs, Proxy services, Tor Exit Nodes
 * - Dynamic scoring based on attack failures, detectability, anonymity, etc.
 * - Integration with Investigation Level system
 */

// IP traceability constants
const IP_TRACEABILITY_CONSTANTS = {
    MAX_SCORE: 100,
    UNUSABLE_THRESHOLD: 85,
    WARNING_THRESHOLD: 70,
    
    // Base increase rates by IP type
    BASE_INCREASES: {
        personal: 8,        // Highest risk
        clan: 6,           // High risk
        botnet: 4,         // Medium risk (distributed)
        proxy: 5,          // Medium-high risk
        vpn: 4,           // Medium risk
        tor: 2,           // Lowest risk
        tor_exit: 3       // Low-medium risk
    },
    
    // Multipliers based on attack performance factors
    PERFORMANCE_MULTIPLIERS: {
        // Rilevabilità del Flusso (RL) - Higher RL = more detectable = higher increase
        RL: { 
            low: 0.5,     // RL 0-30
            medium: 1.0,  // RL 31-60  
            high: 1.5,    // RL 61-80
            critical: 2.0 // RL 81-100
        },
        
        // Anonimato del Flusso (AN) - Higher AN = less traceable = lower increase
        AN: {
            low: 2.0,     // AN 0-30 - Very traceable
            medium: 1.0,  // AN 31-60 - Moderately traceable
            high: 0.5,    // AN 61-80 - Hard to trace
            critical: 0.3 // AN 81-100 - Nearly untraceable
        },
        
        // Completezza Funzionale (FC) - Higher FC = more successful = lower increase
        FC: {
            low: 2.0,     // FC 0-30 - Many failures
            medium: 1.0,  // FC 31-60 - Some failures
            high: 0.5,    // FC 61-80 - Few failures
            critical: 0.2 // FC 81-100 - Rare failures
        },
        
        // Target tier multiplier
        TARGET_TIER: {
            1: 1.0,   // Basic targets
            2: 1.3,   // Advanced targets  
            3: 1.7,   // High-security targets
            4: 2.2    // Maximum security targets
        },
        
        // Repeated use penalty (based on usage count)
        REPEATED_USE: {
            first: 1.0,
            second: 1.2,
            third: 1.5,
            fourth: 1.8,
            fifth_plus: 2.2
        }
    }
};

// IP usage tracking
const IP_USAGE_TRACKING = {
    // Track usage count per IP
    usageCounts: {},
    
    // Track last attack time per IP
    lastUsed: {},
    
    // Track success/failure ratio per IP
    performanceHistory: {}
};

/**
 * Initialize IP traceability system
 */
function initializeIPTraceabilitySystem() {
    if (!state.ipTraceability) {
        state.ipTraceability = {};
    }
    
    if (!state.ipUsageTracking) {
        state.ipUsageTracking = {
            usageCounts: {},
            lastUsed: {},
            performanceHistory: {}
        };
    }
}

/**
 * Calculate traceability increase for an IP based on attack failure
 * @param {string} ip - IP address
 * @param {string} ipType - Type of IP (personal, clan, botnet, proxy, vpn, tor, tor_exit)
 * @param {Object} attackStats - Attack statistics (rl, an, fc, etc.)
 * @param {number} targetTier - Target security tier (1-4)
 * @param {number} successRatio - Attack success ratio (0-1)
 * @returns {number} Traceability increase amount
 */
function calculateTraceabilityIncrease(ip, ipType, attackStats, targetTier, successRatio) {
    initializeIPTraceabilitySystem();
    
    // Get base increase for IP type
    let baseIncrease = IP_TRACEABILITY_CONSTANTS.BASE_INCREASES[ipType] || IP_TRACEABILITY_CONSTANTS.BASE_INCREASES.personal;
    
    // Failure severity multiplier (more failure = more increase)
    const failureSeverity = 1 - successRatio;
    baseIncrease *= (1 + failureSeverity);
    
    // Apply RL multiplier (Rilevabilità del Flusso)
    if (attackStats.rl !== undefined) {
        let rlMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.RL.medium;
        if (attackStats.rl >= 81) rlMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.RL.critical;
        else if (attackStats.rl >= 61) rlMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.RL.high;
        else if (attackStats.rl <= 30) rlMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.RL.low;
        
        baseIncrease *= rlMultiplier;
    }
    
    // Apply AN multiplier (Anonimato del Flusso)
    if (attackStats.an !== undefined) {
        let anMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.AN.medium;
        if (attackStats.an >= 81) anMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.AN.critical;
        else if (attackStats.an >= 61) anMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.AN.high;
        else if (attackStats.an <= 30) anMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.AN.low;
        
        baseIncrease *= anMultiplier;
    }
    
    // Apply FC multiplier (Completezza Funzionale)
    if (attackStats.fc !== undefined) {
        let fcMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.FC.medium;
        if (attackStats.fc >= 81) fcMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.FC.critical;
        else if (attackStats.fc >= 61) fcMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.FC.high;
        else if (attackStats.fc <= 30) fcMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.FC.low;
        
        baseIncrease *= fcMultiplier;
    }
    
    // Apply target tier multiplier
    const tierMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.TARGET_TIER[targetTier] || 1.0;
    baseIncrease *= tierMultiplier;
    
    // Apply repeated use penalty
    const usageCount = state.ipUsageTracking.usageCounts[ip] || 0;
    let repeatMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.REPEATED_USE.first;
    if (usageCount >= 5) repeatMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.REPEATED_USE.fifth_plus;
    else if (usageCount === 4) repeatMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.REPEATED_USE.fourth;
    else if (usageCount === 3) repeatMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.REPEATED_USE.third;
    else if (usageCount === 2) repeatMultiplier = IP_TRACEABILITY_CONSTANTS.PERFORMANCE_MULTIPLIERS.REPEATED_USE.second;
    
    baseIncrease *= repeatMultiplier;
    
    return Math.round(baseIncrease * 100) / 100;
}

/**
 * Process IP traceability increase after an attack
 * @param {string} ip - IP address used
 * @param {string} ipType - Type of IP
 * @param {Object} attackStats - Attack flow statistics
 * @param {number} targetTier - Target security tier
 * @param {number} successRatio - Attack success ratio (0-1)
 * @param {string} targetName - Target name for notifications
 */
function processIPTraceabilityIncrease(ip, ipType, attackStats, targetTier, successRatio, targetName) {
    initializeIPTraceabilitySystem();
    
    // Calculate increase
    const increase = calculateTraceabilityIncrease(ip, ipType, attackStats, targetTier, successRatio);
    
    // Update IP traceability score
    const oldScore = state.ipTraceability[ip] || 0;
    const newScore = Math.min(IP_TRACEABILITY_CONSTANTS.MAX_SCORE, oldScore + increase);
    state.ipTraceability[ip] = newScore;
    
    // Update usage tracking
    state.ipUsageTracking.usageCounts[ip] = (state.ipUsageTracking.usageCounts[ip] || 0) + 1;
    state.ipUsageTracking.lastUsed[ip] = Date.now();
    
    // Track performance history
    if (!state.ipUsageTracking.performanceHistory[ip]) {
        state.ipUsageTracking.performanceHistory[ip] = [];
    }
    state.ipUsageTracking.performanceHistory[ip].push({
        timestamp: Date.now(),
        successRatio: successRatio,
        targetTier: targetTier,
        increase: increase,
        targetName: targetName
    });
    
    // Keep only last 10 performance records per IP
    if (state.ipUsageTracking.performanceHistory[ip].length > 10) {
        state.ipUsageTracking.performanceHistory[ip] = state.ipUsageTracking.performanceHistory[ip].slice(-10);
    }
    
    // Show notifications based on severity
    if (newScore >= IP_TRACEABILITY_CONSTANTS.UNUSABLE_THRESHOLD) {
        showNotification(
            `🚨 IP ${ip} è ora INUTILIZZABILE (${Math.round(newScore)}% tracciabilità)! Non utilizzarlo più per attacchi.`,
            'error'
        );
        
        // Mark IP as unusable
        markIPAsUnusable(ip, ipType);
        
    } else if (newScore >= IP_TRACEABILITY_CONSTANTS.WARNING_THRESHOLD) {
        showNotification(
            `⚠️ IP ${ip} ha raggiunto il ${Math.round(newScore)}% di tracciabilità. Usa con estrema cautela!`,
            'error'
        );
        
    } else if (increase > 0) {
        showNotification(
            `📍 Tracciabilità IP ${ip} aumentata di ${increase.toFixed(1)} punti (ora al ${Math.round(newScore)}%).`,
            'info'
        );
    }
    
    // Integrate with investigation system
    if (typeof increaseInvestigationLevel === 'function') {
        const investigationIncrease = calculateInvestigationLevelIncrease(increase, newScore, ipType);
        if (investigationIncrease > 0) {
            increaseInvestigationLevel(
                investigationIncrease,
                `IP traceability increase for ${ip}`,
                {
                    ip: ip,
                    ipType: ipType,
                    targetTier: targetTier,
                    ipTraceability: newScore,
                    targetName: targetName
                }
            );
        }
    }
    
    saveState();
    
    return newScore;
}

/**
 * Calculate investigation level increase based on IP traceability
 * @param {number} traceabilityIncrease - Amount of traceability increase
 * @param {number} currentScore - Current IP traceability score
 * @param {string} ipType - Type of IP
 * @returns {number} Investigation level increase
 */
function calculateInvestigationLevelIncrease(traceabilityIncrease, currentScore, ipType) {
    // Base conversion rate (how much traceability translates to investigation)
    const baseRate = 0.1; // 10% of traceability increase becomes investigation increase
    
    // IP type risk multipliers for investigation
    const ipTypeMultipliers = {
        personal: 1.5,  // Personal IPs are most risky for investigation
        clan: 1.2,      // Clan IPs are high risk
        botnet: 0.8,    // Botnet IPs are distributed risk
        proxy: 1.0,     // Proxy IPs are medium risk
        vpn: 0.9,       // VPN IPs are lower risk
        tor: 0.5,       // Tor IPs are lowest risk
        tor_exit: 0.6   // Tor exit nodes are low risk
    };
    
    // Score threshold multipliers (higher scores are more dangerous)
    let scoreMultiplier = 1.0;
    if (currentScore >= 80) scoreMultiplier = 2.0;
    else if (currentScore >= 60) scoreMultiplier = 1.5;
    else if (currentScore >= 40) scoreMultiplier = 1.2;
    
    const ipMultiplier = ipTypeMultipliers[ipType] || 1.0;
    
    return traceabilityIncrease * baseRate * ipMultiplier * scoreMultiplier;
}

/**
 * Mark an IP as unusable and handle consequences
 * @param {string} ip - IP address to mark as unusable
 * @param {string} ipType - Type of IP
 */
function markIPAsUnusable(ip, ipType) {
    // Handle different IP types
    switch (ipType) {
        case 'personal':
            handlePersonalIPBurn(ip);
            break;
        case 'clan':
            handleClanIPBurn(ip);
            break;
        case 'botnet':
            handleBotnetIPBurn(ip);
            break;
        case 'proxy':
        case 'vpn':
            handleServiceIPBurn(ip);
            break;
        case 'tor':
        case 'tor_exit':
            handleTorIPBurn(ip);
            break;
    }
}

/**
 * Handle personal IP becoming unusable
 * @param {string} ip - Personal IP address
 */
function handlePersonalIPBurn(ip) {
    // Force IP change for personal connection
    if (state.identity.realIp === ip) {
        state.identity.realIp = generateRandomIp();
        showNotification(
            `🔄 Il tuo ISP ha cambiato il tuo IP personale a causa di attività sospette. Nuovo IP: ${state.identity.realIp}`,
            'info'
        );
    }
    
    // Increase investigation level significantly
    if (typeof increaseInvestigationLevel === 'function') {
        increaseInvestigationLevel(
            15,
            'Personal IP burned',
            { ip: ip, ipType: 'personal' }
        );
    }
}

/**
 * Handle clan IP becoming unusable
 * @param {string} ip - Clan IP address
 */
function handleClanIPBurn(ip) {
    if (state.clan && state.clan.infrastructure.c_vpn) {
        // Force clan VPN IP rotation
        state.clan.infrastructure.c_vpn.currentIp = generateRandomIp();
        showNotification(
            `🔄 La VPN del clan ha cambiato IP a causa di attività sospette.`,
            'info'
        );
    }
}

/**
 * Handle botnet IP becoming unusable
 * @param {string} ip - Botnet IP address
 */
function handleBotnetIPBurn(ip) {
    // Find and remove the infected host with this IP
    const hostIndex = state.infectedHostPool.findIndex(host => host.ip === ip);
    if (hostIndex !== -1) {
        const host = state.infectedHostPool[hostIndex];
        state.infectedHostPool.splice(hostIndex, 1);
        
        showNotification(
            `🖥️ Host infetto ${ip} (${host.country}) è stato disconnesso dalla botnet per sicurezza.`,
            'info'
        );
        
        // Remove from botnet groups
        Object.keys(state.botnetGroups).forEach(groupId => {
            const group = state.botnetGroups[groupId];
            group.hosts = group.hosts.filter(hostId => 
                state.infectedHostPool.find(h => h.id === hostId)
            );
        });
        
        // Update botnet page if active
        if (state.activePage === 'botnet' && typeof initBotnetPage === 'function') {
            initBotnetPage();
        }
    }
}

/**
 * Handle proxy/VPN service IP becoming unusable
 * @param {string} ip - Service IP address
 */
function handleServiceIPBurn(ip) {
    // Force IP refresh for the service
    Object.keys(state.purchasedServices).forEach(serviceId => {
        const service = state.purchasedServices[serviceId];
        if (service.currentIp === ip) {
            service.currentIp = generateRandomIp();
            showNotification(
                `🔄 Il servizio ${serviceId} ha cambiato IP per sicurezza.`,
                'info'
            );
        }
    });
}

/**
 * Handle Tor IP becoming unusable
 * @param {string} ip - Tor IP address
 */
function handleTorIPBurn(ip) {
    // Tor IPs are automatically rotated, just show notification
    showNotification(
        `🧅 Il nodo Tor ${ip} è stato bruciato. La rete Tor ha automaticamente fornito un nuovo circuito.`,
        'info'
    );
}

/**
 * Check if an IP is usable for attacks
 * @param {string} ip - IP address to check
 * @returns {boolean} True if usable, false if burned
 */
function isIPUsable(ip) {
    initializeIPTraceabilitySystem();
    const score = state.ipTraceability[ip] || 0;
    return score < IP_TRACEABILITY_CONSTANTS.UNUSABLE_THRESHOLD;
}

/**
 * Get IP traceability information for display
 * @param {string} ip - IP address
 * @returns {Object} IP traceability info
 */
function getIPTraceabilityInfo(ip) {
    initializeIPTraceabilitySystem();
    
    const score = state.ipTraceability[ip] || 0;
    const usageCount = state.ipUsageTracking.usageCounts[ip] || 0;
    const lastUsed = state.ipUsageTracking.lastUsed[ip];
    const performanceHistory = state.ipUsageTracking.performanceHistory[ip] || [];
    
    let status, color, warning;
    
    if (score >= IP_TRACEABILITY_CONSTANTS.UNUSABLE_THRESHOLD) {
        status = 'INUTILIZZABILE';
        color = 'text-red-500';
        warning = 'Non utilizzare questo IP per attacchi!';
    } else if (score >= IP_TRACEABILITY_CONSTANTS.WARNING_THRESHOLD) {
        status = 'PERICOLOSO';
        color = 'text-orange-500';
        warning = 'Usa con estrema cautela.';
    } else if (score >= 40) {
        status = 'Rischioso';
        color = 'text-yellow-500';
        warning = 'Monitora attentamente.';
    } else {
        status = 'Sicuro';
        color = 'text-green-400';
        warning = null;
    }
    
    return {
        ip: ip,
        score: Math.round(score * 100) / 100,
        status: status,
        color: color,
        warning: warning,
        usageCount: usageCount,
        lastUsed: lastUsed,
        performanceHistory: performanceHistory,
        isUsable: score < IP_TRACEABILITY_CONSTANTS.UNUSABLE_THRESHOLD
    };
}

/**
 * Get all tracked IPs with their traceability info
 * @returns {Array} Array of IP traceability info objects
 */
function getAllTrackedIPs() {
    initializeIPTraceabilitySystem();
    
    const trackedIPs = [];
    
    Object.keys(state.ipTraceability).forEach(ip => {
        trackedIPs.push(getIPTraceabilityInfo(ip));
    });
    
    // Sort by score (highest first)
    return trackedIPs.sort((a, b) => b.score - a.score);
}

/**
 * Clean up old IP tracking data (for IPs not used in 30+ days)
 */
function cleanupOldIPData() {
    initializeIPTraceabilitySystem();
    
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const ipsToClean = [];
    
    Object.keys(state.ipUsageTracking.lastUsed).forEach(ip => {
        if (state.ipUsageTracking.lastUsed[ip] < thirtyDaysAgo) {
            ipsToClean.push(ip);
        }
    });
    
    ipsToClean.forEach(ip => {
        delete state.ipTraceability[ip];
        delete state.ipUsageTracking.usageCounts[ip];
        delete state.ipUsageTracking.lastUsed[ip];
        delete state.ipUsageTracking.performanceHistory[ip];
    });
    
    if (ipsToClean.length > 0) {
        showNotification(
            `🧹 Puliti ${ipsToClean.length} IP vecchi dai dati di tracciamento.`,
            'info'
        );
        saveState();
    }
}

// Export functions for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeIPTraceabilitySystem,
        processIPTraceabilityIncrease,
        calculateTraceabilityIncrease,
        isIPUsable,
        getIPTraceabilityInfo,
        getAllTrackedIPs,
        cleanupOldIPData,
        markIPAsUnusable,
        IP_TRACEABILITY_CONSTANTS
    };
}