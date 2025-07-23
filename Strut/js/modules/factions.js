// File: js/modules/factions.js
// Factions and Reputation System for Hacker Tycoon: Rise of the Root

// ===============================
// FACTION DEFINITIONS
// ===============================

const FACTIONS = {
    GOVERNMENTAL: {
        id: 'governmental',
        name: 'Governativa',
        color: '#1e40af', // Blue
        colorLight: '#3b82f6',
        description: 'Organizzazioni governative e agenzie di sicurezza che cercano di mantenere l\'ordine e la stabilità.',
        moralOrientation: 'lawful',
        motivations: [
            'Sicurezza nazionale',
            'Controspionaggio', 
            'Applicazione della legge',
            'Protezione dei cittadini'
        ],
        questTypes: [
            'Terrorismo digitale',
            'Spionaggio industriale',
            'Sicurezza nazionale',
            'Controspionaggio'
        ]
    },
    TERRORIST: {
        id: 'terrorist',
        name: 'Terrorista/Estremista',
        color: '#dc2626', // Red
        colorLight: '#ef4444',
        description: 'Gruppi estremisti e organizzazioni terroristiche che operano al di fuori della legge.',
        moralOrientation: 'chaotic_evil',
        motivations: [
            'Destabilizzazione',
            'Ideologia estremista',
            'Vendetta',
            'Caos e distruzione'
        ],
        questTypes: [
            'Attacchi informatici',
            'Sabotaggio',
            'Intelligence criminale',
            'Operazioni clandestine'
        ]
    },
    ECO_TERRORIST: {
        id: 'eco_terrorist',
        name: 'Eco-Terrorista',
        color: '#059669', // Green
        colorLight: '#10b981',
        description: 'Attivisti ambientali radicali che usano metodi estremi per proteggere l\'ambiente.',
        moralOrientation: 'chaotic_good',
        motivations: [
            'Protezione ambientale',
            'Giustizia climatica',
            'Anti-corporativismo',
            'Attivismo radicale'
        ],
        questTypes: [
            'Crimine ambientale',
            'Sabotaggio industriale',
            'Leak di dati corporativi',
            'Esposizione di cover-up'
        ]
    },
    POPULATION: {
        id: 'population',
        name: 'Popolazione',
        color: '#7c3aed', // Purple
        colorLight: '#8b5cf6',
        description: 'Cittadini comuni, famiglie e individui che cercano aiuto per problemi personali.',
        moralOrientation: 'neutral',
        motivations: [
            'Problemi personali',
            'Giustizia privata',
            'Ricerca di verità',
            'Protezione della famiglia'
        ],
        questTypes: [
            'Infedeltà coniugali',
            'Persone scomparse',
            'Frodi personali',
            'Stalking e molestie'
        ]
    }
};

// ===============================
// REPUTATION LEVELS
// ===============================

const REPUTATION_LEVELS = {
    0: { name: 'Sconosciuto', rewardMultiplier: 1.0, unlocks: [] },
    1: { name: 'Novizio', rewardMultiplier: 1.1, unlocks: ['basic_quests'] },
    2: { name: 'Affiliato', rewardMultiplier: 1.2, unlocks: ['intermediate_quests'] },
    3: { name: 'Collaboratore', rewardMultiplier: 1.3, unlocks: ['special_equipment'] },
    4: { name: 'Esperto', rewardMultiplier: 1.4, unlocks: ['faction_contacts'] },
    5: { name: 'Veterano', rewardMultiplier: 1.5, unlocks: ['exclusive_quests'] },
    6: { name: 'Specialista', rewardMultiplier: 1.6, unlocks: ['rare_equipment'] },
    7: { name: 'Operativo Senior', rewardMultiplier: 1.8, unlocks: ['high_value_targets'] },
    8: { name: 'Agente Speciale', rewardMultiplier: 2.0, unlocks: ['classified_operations'] },
    9: { name: 'Comandante', rewardMultiplier: 2.2, unlocks: ['faction_resources'] },
    10: { name: 'Leggenda', rewardMultiplier: 2.5, unlocks: ['ultimate_rewards'] }
};

// XP required for each level (cumulative)
const REPUTATION_XP_THRESHOLDS = [
    0,      // Level 0 
    100,    // Level 1
    250,    // Level 2  
    450,    // Level 3
    700,    // Level 4
    1000,   // Level 5
    1350,   // Level 6
    1750,   // Level 7
    2200,   // Level 8
    2700,   // Level 9
    3250    // Level 10
];

// ===============================
// FACTION SYSTEM FUNCTIONS
// ===============================

function initFactionSystem() {
    // Initialize faction reputation in game state if not present
    if (!state.factionReputation) {
        state.factionReputation = {};
        
        // Initialize each faction with 0 XP and level 0
        Object.keys(FACTIONS).forEach(factionKey => {
            const factionId = FACTIONS[factionKey].id;
            state.factionReputation[factionId] = {
                xp: 0,
                level: 0,
                totalXpEarned: 0
            };
        });
        
        saveState();
    }
}

function getFactionById(factionId) {
    return Object.values(FACTIONS).find(faction => faction.id === factionId);
}

function getFactionReputationLevel(factionId) {
    if (!state.factionReputation || !state.factionReputation[factionId]) {
        return 0;
    }
    return state.factionReputation[factionId].level;
}

function getFactionReputationXP(factionId) {
    if (!state.factionReputation || !state.factionReputation[factionId]) {
        return 0;
    }
    return state.factionReputation[factionId].xp;
}

function getFactionReputationProgress(factionId) {
    const currentXP = getFactionReputationXP(factionId);
    const currentLevel = getFactionReputationLevel(factionId);
    
    if (currentLevel >= 10) {
        return 100; // Max level reached
    }
    
    const currentThreshold = REPUTATION_XP_THRESHOLDS[currentLevel];
    const nextThreshold = REPUTATION_XP_THRESHOLDS[currentLevel + 1];
    const progressXP = currentXP - currentThreshold;
    const requiredXP = nextThreshold - currentThreshold;
    
    return Math.floor((progressXP / requiredXP) * 100);
}

function addFactionReputation(factionId, xpAmount, source = 'Quest Completion') {
    if (!state.factionReputation) {
        initFactionSystem();
    }
    
    if (!state.factionReputation[factionId]) {
        console.error(`Unknown faction ID: ${factionId}`);
        return false;
    }
    
    const faction = getFactionById(factionId);
    const oldLevel = state.factionReputation[factionId].level;
    const oldXP = state.factionReputation[factionId].xp;
    
    // Add XP
    state.factionReputation[factionId].xp += xpAmount;
    state.factionReputation[factionId].totalXpEarned += xpAmount;
    
    // Check for level up
    const newLevel = calculateReputationLevel(state.factionReputation[factionId].xp);
    const leveledUp = newLevel > oldLevel;
    
    if (leveledUp) {
        state.factionReputation[factionId].level = newLevel;
        
        // Show level up notification
        const levelInfo = REPUTATION_LEVELS[newLevel];
        showNotification(
            `🎉 Livello di reputazione aumentato! ${faction.name} - Livello ${newLevel}: ${levelInfo.name}`, 
            'success'
        );
        
        // Award level up rewards
        awardLevelUpRewards(factionId, newLevel);
    }
    
    // Show XP gain notification
    const progress = getFactionReputationProgress(factionId);
    showNotification(
        `+${xpAmount} Rep XP ${faction.name} (${progress}%)`, 
        'info'
    );
    
    saveState();
    
    // Update UI if on HQ page
    if (state.activePage === 'hq') {
        renderFactionReputationBars();
    }
    
    return {
        leveledUp,
        oldLevel,
        newLevel,
        oldXP,
        newXP: state.factionReputation[factionId].xp
    };
}

function calculateReputationLevel(totalXP) {
    for (let level = REPUTATION_XP_THRESHOLDS.length - 1; level >= 0; level--) {
        if (totalXP >= REPUTATION_XP_THRESHOLDS[level]) {
            return level;
        }
    }
    return 0;
}

function awardLevelUpRewards(factionId, newLevel) {
    const faction = getFactionById(factionId);
    const levelInfo = REPUTATION_LEVELS[newLevel];
    
    // Base rewards for leveling up
    const btcReward = newLevel * 0.01; // Increasing BTC reward per level
    const xpReward = newLevel * 50;    // Increasing XP reward per level
    
    state.btc += btcReward;
    addXp(xpReward);
    
    showNotification(
        `🏆 Ricompensa Livello ${newLevel}: +${btcReward.toFixed(3)} BTC, +${xpReward} XP`, 
        'success'
    );
    
    // Special rewards at milestone levels
    if (newLevel === 5) {
        state.talentPoints += 1;
        showNotification(`🌟 Milestone raggiunto! +1 Punto Talento per ${faction.name}`, 'success');
    } else if (newLevel === 10) {
        state.talentPoints += 2;
        showNotification(`👑 Livello Massimo! +2 Punti Talento per ${faction.name}`, 'success');
    }
    
    saveState();
    updateUI();
}

function getReputationMultiplier(factionId) {
    const level = getFactionReputationLevel(factionId);
    return REPUTATION_LEVELS[level]?.rewardMultiplier || 1.0;
}

function hasReputationRequirement(factionId, requiredLevel) {
    const currentLevel = getFactionReputationLevel(factionId);
    return currentLevel >= requiredLevel;
}

function renderFactionReputationBars() {
    const container = document.getElementById('faction-reputation-container');
    if (!container) return;
    
    const factionsHTML = Object.values(FACTIONS).map(faction => {
        const level = getFactionReputationLevel(faction.id);
        const progress = getFactionReputationProgress(faction.id);
        const levelInfo = REPUTATION_LEVELS[level];
        const multiplier = (levelInfo.rewardMultiplier * 100 - 100).toFixed(0);
        
        return `
            <div class="faction-reputation-card p-3 border border-gray-700 rounded-lg mb-3" style="border-left: 4px solid ${faction.color};">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="font-bold text-sm" style="color: ${faction.colorLight};">${faction.name}</h4>
                    <div class="text-right">
                        <span class="text-xs text-gray-400">Livello ${level}</span>
                        <div class="text-xs font-bold" style="color: ${faction.colorLight};">${levelInfo.name}</div>
                    </div>
                </div>
                <div class="faction-progress-bar bg-gray-700 rounded-full h-2 mb-2">
                    <div class="h-2 rounded-full transition-all duration-300" 
                         style="width: ${progress}%; background-color: ${faction.color};"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                    <span>${progress}%</span>
                    <span>Bonus: +${multiplier}%</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = factionsHTML;
}

// ===============================
// EXPORT FOR MODULE SYSTEM
// ===============================

// Initialize when module loads
if (typeof state !== 'undefined') {
    initFactionSystem();
}