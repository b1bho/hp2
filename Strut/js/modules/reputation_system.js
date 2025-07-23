// File: js/modules/reputation_system.js
// Advanced Reputation Management System for Factions

// ===============================
// REPUTATION SYSTEM CORE
// ===============================

class ReputationSystem {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // Ensure faction reputation exists in state
        if (!state.factionReputation) {
            initFactionSystem();
        }
        
        this.initialized = true;
    }

    // Calculate faction relationship dynamics
    calculateFactionRelationships(questFactionId, completedSuccessfully = true) {
        const relationships = {
            governmental: {
                terrorist: -0.2,       // Opposing factions
                eco_terrorist: -0.1,   // Somewhat opposing
                population: 0.05       // Slight positive (protecting citizens)
            },
            terrorist: {
                governmental: -0.3,    // Strong opposition
                eco_terrorist: 0.1,    // Some alignment (anti-establishment)
                population: -0.1       // Negative (harm to civilians)
            },
            eco_terrorist: {
                governmental: -0.1,    // Opposition to authority
                terrorist: 0.05,       // Minimal alignment
                population: 0.1        // Positive (protecting environment for people)
            },
            population: {
                governmental: 0.05,    // Slight positive (law and order)
                terrorist: -0.2,       // Strong negative (fear)
                eco_terrorist: 0.05    // Slight positive (environmental benefits)
            }
        };

        const effects = [];
        const multiplier = completedSuccessfully ? 1 : -0.5; // Penalties for failed quests

        if (relationships[questFactionId]) {
            Object.entries(relationships[questFactionId]).forEach(([otherFactionId, relationValue]) => {
                const effectValue = Math.floor(relationValue * 20 * multiplier); // Convert to XP
                if (effectValue !== 0) {
                    effects.push({
                        factionId: otherFactionId,
                        xpChange: effectValue,
                        reason: completedSuccessfully ? 'Indirect relationship' : 'Quest failure penalty'
                    });
                }
            });
        }

        return effects;
    }

    // Process quest completion with faction relationships
    processQuestCompletion(questId, questFactionId, baseXpReward, success = true) {
        this.init();
        
        const faction = getFactionById(questFactionId);
        if (!faction) {
            console.error(`Unknown faction: ${questFactionId}`);
            return;
        }

        // Primary faction reputation gain
        const multiplier = success ? 1 : 0.3; // Reduced XP for failed quests
        const primaryXP = Math.floor(baseXpReward * multiplier);
        
        if (primaryXP > 0) {
            addFactionReputation(questFactionId, primaryXP, `Quest: ${questId}`);
        }

        // Secondary faction effects
        const secondaryEffects = this.calculateFactionRelationships(questFactionId, success);
        secondaryEffects.forEach(effect => {
            if (effect.xpChange !== 0) {
                addFactionReputation(effect.factionId, effect.xpChange, effect.reason);
            }
        });

        // Log the reputation changes for debugging
        console.log(`Reputation changes for quest ${questId}:`, {
            primary: { faction: questFactionId, xp: primaryXP },
            secondary: secondaryEffects
        });
    }

    // Get all faction standings for display
    getAllFactionStandings() {
        this.init();
        
        return Object.values(FACTIONS).map(faction => {
            const level = getFactionReputationLevel(faction.id);
            const xp = getFactionReputationXP(faction.id);
            const progress = getFactionReputationProgress(faction.id);
            const levelInfo = REPUTATION_LEVELS[level];
            
            return {
                ...faction,
                reputation: {
                    level,
                    xp,
                    progress,
                    levelName: levelInfo.name,
                    rewardMultiplier: levelInfo.rewardMultiplier,
                    nextLevelXP: level < 10 ? REPUTATION_XP_THRESHOLDS[level + 1] : null
                }
            };
        }).sort((a, b) => b.reputation.level - a.reputation.level); // Sort by level desc
    }

    // Check if player meets reputation requirements for a quest
    meetsReputationRequirements(questRequirements) {
        this.init();
        
        if (!questRequirements) return true;

        return Object.entries(questRequirements).every(([factionId, requiredLevel]) => {
            return hasReputationRequirement(factionId, requiredLevel);
        });
    }

    // Get reputation-based reward multiplier for a quest
    getQuestRewardMultiplier(questFactionId) {
        this.init();
        return getReputationMultiplier(questFactionId);
    }

    // Calculate faction favor - how much a faction likes/dislikes the player overall
    getFactionFavor(factionId) {
        this.init();
        
        const ownReputation = getFactionReputationLevel(factionId);
        const allStandings = this.getAllFactionStandings();
        
        // Calculate weighted favor based on faction relationships
        let favor = ownReputation * 10; // Base favor from direct reputation
        
        // Add relationship modifiers
        allStandings.forEach(otherFaction => {
            if (otherFaction.id !== factionId) {
                const relationshipMatrix = {
                    governmental: { terrorist: -2, eco_terrorist: -1, population: 1 },
                    terrorist: { governmental: -3, eco_terrorist: 1, population: -1 },
                    eco_terrorist: { governmental: -1, terrorist: 1, population: 1 },
                    population: { governmental: 1, terrorist: -2, eco_terrorist: 1 }
                };
                
                const relationModifier = relationshipMatrix[factionId]?.[otherFaction.id] || 0;
                favor += otherFaction.reputation.level * relationModifier;
            }
        });

        return Math.max(0, favor); // Ensure favor is never negative
    }

    // Get faction-specific quest availability
    getAvailableFactionsForQuests() {
        this.init();
        
        return Object.values(FACTIONS).filter(faction => {
            const level = getFactionReputationLevel(faction.id);
            const favor = this.getFactionFavor(faction.id);
            
            // Basic availability: level 0+ and favor 0+
            return level >= 0 && favor >= 0;
        });
    }

    // Reset all faction reputations (for testing/admin)
    resetAllReputations() {
        state.factionReputation = {};
        initFactionSystem();
        saveState();
        
        if (state.activePage === 'hq') {
            renderFactionReputationBars();
        }
        
        showNotification('🔄 Tutte le reputazioni delle fazioni sono state resettate', 'info');
    }

    // Debug function to add reputation to all factions
    debugAddReputationToAll(xpAmount) {
        Object.values(FACTIONS).forEach(faction => {
            addFactionReputation(faction.id, xpAmount, 'Debug Command');
        });
    }
}

// ===============================
// REPUTATION ANALYTICS
// ===============================

class ReputationAnalytics {
    static getReputationSummary() {
        const system = new ReputationSystem();
        system.init();
        
        const standings = system.getAllFactionStandings();
        const totalXP = standings.reduce((sum, faction) => sum + faction.reputation.xp, 0);
        const avgLevel = standings.reduce((sum, faction) => sum + faction.reputation.level, 0) / standings.length;
        const maxLevel = Math.max(...standings.map(f => f.reputation.level));
        const minLevel = Math.min(...standings.map(f => f.reputation.level));
        
        return {
            totalXP,
            averageLevel: Math.round(avgLevel * 100) / 100,
            maxLevel,
            minLevel,
            standings,
            favoriteFactio: standings[0]?.name || 'Nessuna',
            leastFavoredFaction: standings[standings.length - 1]?.name || 'Nessuna'
        };
    }

    static generateReputationReport() {
        const summary = this.getReputationSummary();
        
        return `
=== REPUTATION REPORT ===
Total XP Earned: ${summary.totalXP}
Average Level: ${summary.averageLevel}
Highest Level: ${summary.maxLevel}
Lowest Level: ${summary.minLevel}
Most Favored: ${summary.favoriteFactio}
Least Favored: ${summary.leastFavoredFaction}

=== DETAILED STANDINGS ===
${summary.standings.map(f => 
    `${f.name}: Level ${f.reputation.level} (${f.reputation.levelName}) - ${f.reputation.progress}%`
).join('\n')}
        `.trim();
    }
}

// ===============================
// GLOBAL REPUTATION SYSTEM INSTANCE
// ===============================

const reputationSystem = new ReputationSystem();

// ===============================
// UTILITY FUNCTIONS FOR QUEST INTEGRATION
// ===============================

function processQuestReputationRewards(quest, success = true) {
    if (quest.faction) {
        const baseXpReward = Math.floor(quest.rewards.xp * 0.3); // 30% of quest XP as reputation XP
        reputationSystem.processQuestCompletion(quest.id, quest.faction, baseXpReward, success);
    }
}

function getQuestReputationMultiplier(quest) {
    if (quest.faction) {
        return reputationSystem.getQuestRewardMultiplier(quest.faction);
    }
    return 1.0;
}

function canAccessQuest(quest) {
    if (quest.reputationRequirements) {
        return reputationSystem.meetsReputationRequirements(quest.reputationRequirements);
    }
    return true;
}

// Initialize the reputation system when the module loads
if (typeof state !== 'undefined') {
    reputationSystem.init();
}