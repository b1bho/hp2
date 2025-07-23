// File: js/ddos_impact_system.js
// DDoS Impact System - Core functionality for calculating and managing DDoS impact scores

/**
 * DDoS Impact Score (DIS) calculation and management system
 * This system provides real-time feedback on target status during DDoS attacks
 */

// Target status constants
const TARGET_STATUS = {
    STABLE: 'stable',      // Green - No impact
    PARTIAL: 'partial',    // Yellow - Partial impact
    DOWN: 'down'           // Red - Complete saturation
};

// Status display configuration
const STATUS_CONFIG = {
    [TARGET_STATUS.STABLE]: {
        color: 'green',
        label: 'Stabile',
        description: 'Nessun Impatto',
        bgClass: 'bg-green-900/30',
        borderClass: 'border-green-500',
        textClass: 'text-green-400'
    },
    [TARGET_STATUS.PARTIAL]: {
        color: 'yellow', 
        label: 'Problemi',
        description: 'Impatto Parziale',
        bgClass: 'bg-yellow-900/30',
        borderClass: 'border-yellow-500',
        textClass: 'text-yellow-400'
    },
    [TARGET_STATUS.DOWN]: {
        color: 'red',
        label: 'Down',
        description: 'Saturazione Totale',
        bgClass: 'bg-red-900/30',
        borderClass: 'border-red-500', 
        textClass: 'text-red-400'
    }
};

/**
 * Calculate DDoS Impact Score (DIS) based on multiple factors
 * @param {Object} params - Calculation parameters
 * @param {number} params.effectiveResourcesDDoS - Combined effective resources for DDoS
 * @param {Object} params.ddosFlowParams - DDoS flow parameters (attack power, etc.)
 * @param {Object} params.targetDefenses - Target defense characteristics
 * @param {number} params.playerLevel - Current player level
 * @param {number} params.routingFactor - Quality of routing chain (0-1)
 * @param {number} params.duration - Attack duration in seconds
 * @returns {Object} DIS calculation result
 */
function calculateDDoSImpactScore(params) {
    const {
        effectiveResourcesDDoS = 0,
        ddosFlowParams = {},
        targetDefenses = {},
        playerLevel = 1,
        routingFactor = 0.8,
        duration = 60
    } = params;

    // Base DIS calculation using effective resources
    let baseDIS = effectiveResourcesDDoS * 10;

    // Flow-based modifiers
    const flowPowerModifier = (ddosFlowParams.attackPower || 1000) / 1000;
    const flowQualityModifier = (ddosFlowParams.completeness || 100) / 100;
    baseDIS *= flowPowerModifier * flowQualityModifier;

    // Target defense modifiers
    const defenseStrength = targetDefenses.ddosResistance || 50;
    const defenseModifier = Math.max(0.1, 1 - (defenseStrength / 200));
    baseDIS *= defenseModifier;

    // Player skill modifier
    const skillModifier = 1 + (playerLevel * 0.05);
    baseDIS *= skillModifier;

    // Routing quality modifier  
    const routingModifier = 0.7 + (routingFactor * 0.3);
    baseDIS *= routingModifier;

    // Duration impact modifier
    const durationModifier = Math.min(2.0, 1 + (duration / 300));
    baseDIS *= durationModifier;

    // Calculate final DIS with some randomness for realism
    const randomVariation = 0.9 + (Math.random() * 0.2);
    const finalDIS = baseDIS * randomVariation;

    return {
        score: Math.round(finalDIS),
        baseDIS: Math.round(baseDIS),
        modifiers: {
            flowPower: flowPowerModifier,
            flowQuality: flowQualityModifier,
            defenseStrength: defenseModifier,
            playerSkill: skillModifier,
            routing: routingModifier,
            duration: durationModifier,
            random: randomVariation
        }
    };
}

/**
 * Determine target status based on DIS score
 * @param {number} disScore - DDoS Impact Score
 * @param {Object} targetDefenses - Target defense characteristics
 * @returns {string} Target status (stable/partial/down)
 */
function determineTargetStatus(disScore, targetDefenses = {}) {
    const defenseThreshold = targetDefenses.ddosResistance || 50;

    // Adjust thresholds based on target defenses
    const partialThreshold = 100 + (defenseThreshold * 2);
    const downThreshold = 300 + (defenseThreshold * 4);

    if (disScore < partialThreshold) {
        return TARGET_STATUS.STABLE;
    } else if (disScore < downThreshold) {
        return TARGET_STATUS.PARTIAL;
    } else {
        return TARGET_STATUS.DOWN;
    }
}

/**
 * Get status display configuration for a given status
 * @param {string} status - Target status
 * @returns {Object} Status display configuration
 */
function getStatusConfig(status) {
    return STATUS_CONFIG[status] || STATUS_CONFIG[TARGET_STATUS.STABLE];
}

/**
 * Calculate effective DDoS resources from selected bot groups
 * @param {Set} selectedBotGroups - Set of selected bot group names
 * @returns {Object} Effective resources calculation
 */
function calculateEffectiveDDoSResources(selectedBotGroups) {
    let totalEffectivePower = 0;
    let totalBandwidth = 0;
    let totalActiveHosts = 0;
    let avgStability = 0;
    let conflictPenalty = 0;

    const groupResults = [];

    selectedBotGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (!group) return;

        let groupPower = 0;
        let groupBandwidth = 0;
        let groupActiveHosts = 0;
        let groupStability = 0;
        let validHosts = 0;

        group.hostIds.forEach(hostId => {
            const host = state.infectedHostPool.find(h => h.id === hostId);
            if (host && host.status === 'Active' && host.resources) {
                let effectivePower = host.resources.cpuPower;
                
                // Apply mining conflict penalty (50% reduction)
                if (group.currentActivity === 'Mining') {
                    effectivePower *= 0.5;
                    conflictPenalty += 0.1; // Accumulate conflict penalty
                }

                groupPower += effectivePower;
                groupBandwidth += host.resources.bandwidth;
                groupActiveHosts++;
                groupStability += (host.stabilityScore || 80);
                validHosts++;
            }
        });

        if (validHosts > 0) {
            groupStability /= validHosts;
        }

        groupResults.push({
            name: groupName,
            power: groupPower,
            bandwidth: groupBandwidth,
            activeHosts: groupActiveHosts,
            stability: groupStability,
            hasConflict: group.currentActivity === 'Mining'
        });

        totalEffectivePower += groupPower;
        totalBandwidth += groupBandwidth;
        totalActiveHosts += groupActiveHosts;
        avgStability += groupStability;
    });

    if (selectedBotGroups.size > 0) {
        avgStability /= selectedBotGroups.size;
    }

    // Apply overall conflict penalty
    const finalConflictModifier = Math.max(0.5, 1 - conflictPenalty);
    totalEffectivePower *= finalConflictModifier;

    return {
        totalPower: totalEffectivePower,
        totalBandwidth: totalBandwidth,
        totalActiveHosts: totalActiveHosts,
        avgStability: avgStability,
        conflictPenalty: conflictPenalty,
        conflictModifier: finalConflictModifier,
        groupResults: groupResults
    };
}

/**
 * Simulate dynamic target reactions based on DIS status
 * @param {string} targetStatus - Current target status
 * @param {string} targetIp - Target IP address
 * @param {number} duration - Time spent in current status (seconds)
 * @returns {Object} Target reaction result
 */
function simulateTargetReactions(targetStatus, targetIp, duration) {
    const reactions = {
        triggered: false,
        type: null,
        description: '',
        consequence: null
    };

    switch (targetStatus) {
        case TARGET_STATUS.PARTIAL:
            // Yellow status reactions
            if (duration > 30 && Math.random() < 0.3) {
                reactions.triggered = true;
                reactions.type = 'defense_activation';
                reactions.description = 'Il target ha attivato difese aggiuntive DDoS';
                reactions.consequence = {
                    type: 'defense_increase',
                    value: 20,
                    duration: 120
                };
            } else if (duration > 60 && Math.random() < 0.2) {
                reactions.triggered = true;
                reactions.type = 'trace_attempt';
                reactions.description = 'Il target sta tentando di tracciare la fonte dell\'attacco';
                reactions.consequence = {
                    type: 'traceability_increase',
                    value: 15
                };
            }
            break;

        case TARGET_STATUS.DOWN:
            // Red status reactions  
            if (duration > 45 && Math.random() < 0.4) {
                reactions.triggered = true;
                reactions.type = 'ip_change';
                reactions.description = 'Il target ha cambiato il suo indirizzo IP!';
                reactions.consequence = {
                    type: 'target_ip_change',
                    newIp: generateRandomIp()
                };
            } else if (duration > 90 && Math.random() < 0.3) {
                reactions.triggered = true;
                reactions.type = 'severe_countermeasures';
                reactions.description = 'Il target ha attivato contromisure severe - alcuni bot potrebbero essere compromessi';
                reactions.consequence = {
                    type: 'bot_loss_risk',
                    riskPercentage: 25
                };
            }
            break;
    }

    return reactions;
}

/**
 * Apply target reaction consequences to the attack
 * @param {Object} attack - Current attack object
 * @param {Object} reaction - Target reaction result
 */
function applyTargetReactions(attack, reaction) {
    if (!reaction.triggered || !reaction.consequence) return;

    const consequence = reaction.consequence;

    switch (consequence.type) {
        case 'defense_increase':
            // Temporarily increase target defenses
            if (!attack.targetDefenseModifiers) {
                attack.targetDefenseModifiers = {};
            }
            attack.targetDefenseModifiers.ddosResistance = (attack.targetDefenseModifiers.ddosResistance || 0) + consequence.value;
            
            // Set timer to remove the defense boost
            setTimeout(() => {
                if (attack.targetDefenseModifiers) {
                    attack.targetDefenseModifiers.ddosResistance -= consequence.value;
                }
            }, consequence.duration * 1000);
            break;

        case 'traceability_increase':
            // Increase traceability for all participating bots
            attack.botGroups.forEach(groupName => {
                const group = state.botnetGroups[groupName];
                if (group) {
                    group.hostIds.forEach(hostId => {
                        const host = state.infectedHostPool.find(h => h.id === hostId);
                        if (host) {
                            host.traceabilityScore = Math.min(100, host.traceabilityScore + consequence.value);
                        }
                    });
                }
            });
            
            // Integrate with Investigation State System
            if (window.InvestigationState) {
                const investigationIncrease = consequence.value * 0.2; // Convert traceability to investigation increase
                window.InvestigationState.increaseInvestigationLevel(
                    investigationIncrease, 
                    `Tracciabilità aumentata durante attacco DDoS (+${consequence.value})`
                );
            }
            break;

        case 'target_ip_change':
            // Update attack target IP
            attack.target = consequence.newIp;
            showNotification(`ALERT: Target changed IP to ${consequence.newIp}!`, 'error');
            break;

        case 'bot_loss_risk':
            // Risk of losing some bots
            attack.botGroups.forEach(groupName => {
                const group = state.botnetGroups[groupName];
                if (group) {
                    group.hostIds.forEach(hostId => {
                        if (Math.random() * 100 < consequence.riskPercentage) {
                            const host = state.infectedHostPool.find(h => h.id === hostId);
                            if (host) {
                                addLogToHost(hostId, 'Host compromesso dalle contromisure del target');
                                // Mark for potential removal
                                host.compromised = true;
                            }
                        }
                    });
                }
            });
            break;
    }
}

/**
 * Handle "Cleaned" events for infected hosts during active attacks
 * @param {string} hostId - ID of the cleaned host
 */
function handleInfectedHostCleaned(hostId) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    // Find all active DDoS attacks using this host
    const affectedAttacks = activeDDoSAttacks.filter(attack => {
        return attack.botGroups.some(groupName => {
            const group = state.botnetGroups[groupName];
            return group && group.hostIds.includes(hostId);
        });
    });

    if (affectedAttacks.length > 0) {
        // Remove host from all groups
        Object.keys(state.botnetGroups).forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group && group.hostIds.includes(hostId)) {
                group.hostIds = group.hostIds.filter(id => id !== hostId);
                addLogToAttackingSources([host.ipAddress], `Host ${host.ipAddress} cleaned and removed from group ${groupName}`);
            }
        });

        // Remove host from infected pool
        const hostIndex = state.infectedHostPool.findIndex(h => h.id === hostId);
        if (hostIndex !== -1) {
            state.infectedHostPool.splice(hostIndex, 1);
        }

        // Recalculate effective resources for affected attacks
        affectedAttacks.forEach(attack => {
            const newResources = calculateEffectiveDDoSResources(new Set(attack.botGroups));
            attack.effectivePower = newResources.totalPower;
            
            showNotification(`Host cleaned! Attack power reduced to ${newResources.totalPower.toFixed(1)} GFLOPS`, 'warning');
        });

        // Clean up empty groups
        cleanupEmptyGroups();
        
        // Update UI if on botnet page
        if (state.activePage === 'botnet') {
            renderBotGroupSelection();
            updateSelectedResources();
        }
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TARGET_STATUS,
        STATUS_CONFIG,
        calculateDDoSImpactScore,
        determineTargetStatus,
        getStatusConfig,
        calculateEffectiveDDoSResources,
        simulateTargetReactions,
        applyTargetReactions,
        handleInfectedHostCleaned
    };
}