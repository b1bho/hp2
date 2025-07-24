// File: js/modules/rework_programming_timer.js
// Time-Based Programming Logic System

// Time calculation constants
const BASE_COMPILATION_TIMES = {
    'simple': 60,      // Simple tools (keylogger basic)
    'intermediate': 120, // Intermediate tools (ransomware)
    'complex': 300,     // Complex tools (advanced botnet)
    'expert': 600      // Expert-level tools (APT-style malware)
};

const COMPLEXITY_MULTIPLIERS = {
    'entry': 1.0,
    'capture': 1.2,
    'encryption': 1.5,
    'delivery': 1.3,
    'persistence': 1.4,
    'command_control': 2.0,
    'propagation': 1.6,
    'payload': 1.3,
    'stealth': 1.8,
    'exfiltration': 1.2,
    'compiler': 2.5
};

const NODE_LEVEL_MULTIPLIERS = {
    1: 1.0,
    2: 1.4,
    3: 1.8,
    4: 2.3
};

let activeCompilations = new Map();
let compilationHistory = [];

function initProgrammingTimer() {
    console.log('Initializing Programming Timer System...');
    
    // Initialize state if not exists
    if (!state.programmingTimer) {
        state.programmingTimer = {
            activeCompilations: {},
            completedCompilations: [],
            totalCompilationTime: 0,
            efficiencyRating: 1.0
        };
    }
    
    // Restore active compilations from state
    Object.entries(state.programmingTimer.activeCompilations).forEach(([id, compilation]) => {
        if (compilation.isActive) {
            restoreCompilation(id, compilation);
        }
    });
}

function calculateToolComplexity(template, nodeUpgrades) {
    const templateData = window.toolTemplates[template];
    if (!templateData) return BASE_COMPILATION_TIMES.simple;
    
    let complexityScore = 0;
    let nodeCount = templateData.nodes.length;
    
    // Base complexity from number of nodes
    complexityScore += nodeCount * 20;
    
    // Add complexity based on node types and levels
    templateData.nodes.forEach(node => {
        const nodeLevel = nodeUpgrades[`${template}_${node.id}`] || 1;
        const typeMultiplier = COMPLEXITY_MULTIPLIERS[node.type] || 1.0;
        const levelMultiplier = NODE_LEVEL_MULTIPLIERS[nodeLevel] || 1.0;
        
        complexityScore += 30 * typeMultiplier * levelMultiplier;
    });
    
    // Add complexity based on connections (more connections = more complex integration)
    complexityScore += templateData.connections.length * 10;
    
    // Determine complexity tier
    if (complexityScore < 200) return BASE_COMPILATION_TIMES.simple;
    if (complexityScore < 400) return BASE_COMPILATION_TIMES.intermediate;
    if (complexityScore < 800) return BASE_COMPILATION_TIMES.complex;
    return BASE_COMPILATION_TIMES.expert;
}

function calculateCompilationTime(template, nodeUpgrades, compilerOptions = []) {
    // Start with base complexity
    let baseTime = calculateToolComplexity(template, nodeUpgrades);
    
    // Apply Core Talent modifiers
    const coreEffects = calculateCoreTalentEffects();
    baseTime *= (1 - coreEffects.compilationTimeReduction);
    
    // Apply Specialization Talent modifiers
    const specEffects = calculateSpecializationEffects();
    baseTime *= (1 - specEffects.compilationSpeedBonus);
    
    // Apply Compiler Options modifiers
    compilerOptions.forEach(option => {
        const optionData = window.compilerOptions[option];
        if (optionData) {
            baseTime *= optionData.compilationTimeMultiplier;
        }
    });
    
    // Apply Node Modifier effects (Obfuscator, Crypter, etc.)
    const modifierEffects = calculateModifierEffects(template, nodeUpgrades);
    baseTime *= modifierEffects.timeMultiplier;
    
    // Apply Hardware bonuses (if available)
    if (state.hardwareBonuses && state.hardwareBonuses.compilationSpeedModifier) {
        baseTime *= state.hardwareBonuses.compilationSpeedModifier;
    }
    
    // Apply efficiency rating based on past performance
    baseTime *= (2.0 - state.programmingTimer.efficiencyRating); // Higher efficiency = lower time
    
    // Ensure minimum compilation time
    return Math.max(30, Math.round(baseTime));
}

function calculateCoreTalentEffects() {
    const effects = {
        compilationTimeReduction: 0,
        debuggingEfficiency: 0,
        networkEfficiency: 0,
        cryptographyEfficiency: 0
    };
    
    if (!state.reworkTalents) return effects;
    
    // Check each core talent for its effects
    Object.entries(window.coreTalents || {}).forEach(([branchName, branch]) => {
        Object.entries(branch.talents).forEach(([talentName, talent]) => {
            if (state.reworkTalents.unlockedCore[talentName] > 0 && talent.effects) {
                Object.entries(talent.effects).forEach(([effectType, value]) => {
                    if (effects.hasOwnProperty(effectType)) {
                        effects[effectType] += value;
                    }
                });
            }
        });
    });
    
    return effects;
}

function calculateSpecializationEffects() {
    const effects = {
        compilationSpeedBonus: 0,
        malwareComplexityBonus: 0,
        stealthBonus: 0,
        c2EfficiencyBonus: 0
    };
    
    if (!state.reworkTalents) return effects;
    
    // Check specialization talents for compilation-related effects
    Object.entries(window.specializationTalents || {}).forEach(([branchName, branch]) => {
        Object.entries(branch.talents).forEach(([talentName, talent]) => {
            if (state.reworkTalents.unlockedSpecialization[talentName] > 0 && talent.effects) {
                // Map talent effects to compilation benefits
                if (talent.effects.compilationSpeed) {
                    effects.compilationSpeedBonus += talent.effects.compilationSpeed;
                }
                if (talent.effects.aiCompilation) {
                    effects.compilationSpeedBonus += talent.effects.aiCompilation * 0.6; // AI compilation helps speed
                }
                if (talent.effects.runtimeOptimization) {
                    effects.compilationSpeedBonus += talent.effects.runtimeOptimization * 0.4;
                }
            }
        });
    });
    
    return effects;
}

function calculateModifierEffects(template, nodeUpgrades) {
    let timeMultiplier = 1.0;
    let effectivenessBonus = 0;
    
    // Check if any modifier nodes are applied
    // This would be determined by the editor state showing which modifiers are active
    // For now, we'll simulate based on node upgrade levels
    
    const templateData = window.toolTemplates[template];
    if (!templateData) return { timeMultiplier, effectivenessBonus };
    
    templateData.nodes.forEach(node => {
        const nodeLevel = nodeUpgrades[`${template}_${node.id}`] || 1;
        
        // Higher level nodes take more time but provide better results
        if (nodeLevel > 2) {
            timeMultiplier *= 1.2; // 20% more time for advanced features
            effectivenessBonus += 0.1; // 10% effectiveness bonus
        }
        if (nodeLevel > 3) {
            timeMultiplier *= 1.15; // Additional 15% more time
            effectivenessBonus += 0.15; // Additional 15% effectiveness
        }
    });
    
    return { timeMultiplier, effectivenessBonus };
}

function startCompilation(templateName, template, nodeUpgrades, compilerOptions = []) {
    const compilationTime = calculateCompilationTime(template, nodeUpgrades, compilerOptions);
    const compilationId = `compilation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const compilation = {
        id: compilationId,
        templateName: templateName,
        template: template,
        nodeUpgrades: { ...nodeUpgrades },
        compilerOptions: [...compilerOptions],
        startTime: Date.now(),
        totalTime: compilationTime,
        progress: 0,
        isActive: true,
        phase: 'initialization',
        estimatedCompletion: Date.now() + (compilationTime * 1000)
    };
    
    // Store in both active map and state
    activeCompilations.set(compilationId, compilation);
    state.programmingTimer.activeCompilations[compilationId] = compilation;
    
    // Start the compilation process
    processCompilation(compilationId);
    
    // Update UI
    renderProgrammingTimerUI();
    
    showNotification(
        `Compilation started: ${templateName} (${formatCompilationTime(compilationTime)})`, 
        'info'
    );
    
    return compilationId;
}

function processCompilation(compilationId) {
    const compilation = activeCompilations.get(compilationId);
    if (!compilation || !compilation.isActive) return;
    
    const updateInterval = setInterval(() => {
        const elapsed = (Date.now() - compilation.startTime) / 1000;
        const progress = Math.min(100, (elapsed / compilation.totalTime) * 100);
        
        compilation.progress = progress;
        
        // Update compilation phases
        if (progress < 20) {
            compilation.phase = 'analysis';
        } else if (progress < 40) {
            compilation.phase = 'preprocessing';
        } else if (progress < 60) {
            compilation.phase = 'compilation';
        } else if (progress < 80) {
            compilation.phase = 'optimization';
        } else if (progress < 95) {
            compilation.phase = 'linking';
        } else {
            compilation.phase = 'finalization';
        }
        
        // Update state
        state.programmingTimer.activeCompilations[compilationId] = compilation;
        
        // Update UI if visible
        updateCompilationUI(compilationId);
        
        if (progress >= 100) {
            clearInterval(updateInterval);
            completeCompilation(compilationId);
        }
    }, 1000);
    
    // Store interval reference for potential cleanup
    compilation.updateInterval = updateInterval;
}

function completeCompilation(compilationId) {
    const compilation = activeCompilations.get(compilationId);
    if (!compilation) return;
    
    // Mark as completed
    compilation.isActive = false;
    compilation.completedAt = Date.now();
    compilation.phase = 'completed';
    compilation.progress = 100;
    
    // Calculate rewards and effectiveness
    const rewards = calculateCompilationRewards(compilation);
    const effectiveness = calculateToolEffectiveness(compilation);
    
    // Apply rewards
    state.experience += rewards.xp;
    state.xmr += rewards.xmr;
    if (rewards.btc > 0) {
        state.btc += rewards.btc;
    }
    
    // Update efficiency rating based on performance
    updateEfficiencyRating(compilation);
    
    // Move to completed compilations
    state.programmingTimer.completedCompilations.push({
        ...compilation,
        rewards: rewards,
        effectiveness: effectiveness
    });
    
    // Remove from active compilations
    activeCompilations.delete(compilationId);
    delete state.programmingTimer.activeCompilations[compilationId];
    
    // Update total compilation time
    state.programmingTimer.totalCompilationTime += compilation.totalTime;
    
    // Save state
    saveState();
    updateUI();
    renderProgrammingTimerUI();
    
    // Show completion notification
    showNotification(
        `Compilation completed: ${compilation.templateName}! +${rewards.xp} XP, +${rewards.xmr} XMR`, 
        'success'
    );
    
    // Add compiled tool to inventory (if inventory system exists)
    if (typeof addCompiledToolToInventory === 'function') {
        addCompiledToolToInventory(compilation, effectiveness);
    }
}

function calculateCompilationRewards(compilation) {
    const baseXP = 50;
    const timeBonus = Math.floor(compilation.totalTime / 60) * 10; // 10 XP per minute
    const complexityBonus = compilation.nodeUpgrades ? Object.keys(compilation.nodeUpgrades).length * 5 : 0;
    
    const xp = baseXP + timeBonus + complexityBonus;
    const xmr = Math.max(1, Math.floor(compilation.totalTime / 30)); // 1 XMR per 30 seconds
    const btc = compilation.totalTime > 300 ? 0.001 : 0; // BTC reward for long compilations
    
    return { xp, xmr, btc };
}

function calculateToolEffectiveness(compilation) {
    let effectiveness = 0.5; // Base effectiveness
    
    // Node upgrade effects
    if (compilation.nodeUpgrades) {
        const avgLevel = Object.values(compilation.nodeUpgrades).reduce((sum, level) => sum + level, 0) / 
                        Object.values(compilation.nodeUpgrades).length;
        effectiveness += (avgLevel - 1) * 0.15; // +15% per average upgrade level
    }
    
    // Compiler options effects
    compilation.compilerOptions.forEach(option => {
        const optionData = window.compilerOptions[option];
        if (optionData) {
            effectiveness += optionData.effectivenessBonus || 0;
        }
    });
    
    // Talent effects
    const coreEffects = calculateCoreTalentEffects();
    const specEffects = calculateSpecializationEffects();
    effectiveness += coreEffects.debuggingEfficiency * 0.3;
    effectiveness += specEffects.malwareComplexityBonus * 0.4;
    
    // Efficiency rating effect
    effectiveness *= state.programmingTimer.efficiencyRating;
    
    return Math.min(1.0, Math.max(0.1, effectiveness)); // Clamp between 10% and 100%
}

function updateEfficiencyRating(compilation) {
    // Efficiency improves based on successful compilations
    // Longer compilations improve efficiency more
    const efficiencyGain = Math.min(0.05, compilation.totalTime / 6000); // Max 5% gain, scale with time
    
    state.programmingTimer.efficiencyRating = Math.min(1.5, 
        state.programmingTimer.efficiencyRating + efficiencyGain
    );
}

function restoreCompilation(compilationId, compilationData) {
    // Restore an active compilation from saved state (e.g., after page reload)
    const elapsed = (Date.now() - compilationData.startTime) / 1000;
    
    if (elapsed >= compilationData.totalTime) {
        // Compilation should have completed while away
        completeCompilation(compilationId);
    } else {
        // Resume compilation
        activeCompilations.set(compilationId, compilationData);
        processCompilation(compilationId);
    }
}

function cancelCompilation(compilationId) {
    const compilation = activeCompilations.get(compilationId);
    if (!compilation) return;
    
    // Clear update interval
    if (compilation.updateInterval) {
        clearInterval(compilation.updateInterval);
    }
    
    // Partial rewards based on progress
    const partialRewards = {
        xp: Math.floor((compilation.progress / 100) * 25), // 50% of base XP
        xmr: Math.floor((compilation.progress / 100) * 1),
        btc: 0
    };
    
    state.experience += partialRewards.xp;
    state.xmr += partialRewards.xmr;
    
    // Remove from active compilations
    activeCompilations.delete(compilationId);
    delete state.programmingTimer.activeCompilations[compilationId];
    
    saveState();
    updateUI();
    renderProgrammingTimerUI();
    
    showNotification(
        `Compilation cancelled: ${compilation.templateName}. Partial rewards: +${partialRewards.xp} XP`, 
        'warning'
    );
}

function speedUpCompilation(compilationId, speedUpFactor = 2) {
    const compilation = activeCompilations.get(compilationId);
    if (!compilation) return false;
    
    // Calculate cost (in XMR)
    const remainingTime = compilation.totalTime * (1 - compilation.progress / 100);
    const cost = Math.ceil(remainingTime / 60) * 5; // 5 XMR per minute remaining
    
    if (state.xmr < cost) {
        showNotification('XMR insufficienti per accelerare la compilazione', 'error');
        return false;
    }
    
    // Deduct cost
    state.xmr -= cost;
    
    // Apply speed up by reducing total time
    const newTotalTime = compilation.totalTime / speedUpFactor;
    const elapsed = (Date.now() - compilation.startTime) / 1000;
    
    compilation.totalTime = Math.max(elapsed + 10, newTotalTime); // Ensure at least 10 seconds remaining
    compilation.estimatedCompletion = compilation.startTime + (compilation.totalTime * 1000);
    
    // Update state
    state.programmingTimer.activeCompilations[compilationId] = compilation;
    
    saveState();
    updateUI();
    renderProgrammingTimerUI();
    
    showNotification(
        `Compilation accelerated! Cost: ${cost} XMR`, 
        'success'
    );
    
    return true;
}

function renderProgrammingTimerUI() {
    const container = document.getElementById('programming-timer-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="programming-timer-panel">
            <div class="timer-header">
                <h3 class="text-lg font-semibold text-white">
                    <i class="fas fa-clock text-blue-400 mr-2"></i>
                    Programmazione a Tempo
                </h3>
                <div class="timer-stats">
                    <div class="stat-item">
                        <span class="text-gray-400">Efficienza:</span>
                        <span class="text-white font-bold">${Math.round(state.programmingTimer.efficiencyRating * 100)}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="text-gray-400">Tempo Totale:</span>
                        <span class="text-white font-bold">${formatCompilationTime(state.programmingTimer.totalCompilationTime)}</span>
                    </div>
                </div>
            </div>
            
            <div class="active-compilations">
                <h4 class="text-md font-semibold text-gray-300 mb-3">Compilazioni Attive</h4>
                ${renderActiveCompilations()}
            </div>
            
            <div class="compilation-history">
                <h4 class="text-md font-semibold text-gray-300 mb-3">Cronologia Recente</h4>
                ${renderCompilationHistory()}
            </div>
        </div>
    `;
}

function renderActiveCompilations() {
    if (activeCompilations.size === 0) {
        return '<p class="text-gray-400">Nessuna compilazione in corso</p>';
    }
    
    return Array.from(activeCompilations.values()).map(compilation => `
        <div class="compilation-item active" id="compilation-${compilation.id}">
            <div class="compilation-header">
                <div class="compilation-info">
                    <span class="compilation-name">${compilation.templateName}</span>
                    <span class="compilation-phase">${getPhaseDisplayName(compilation.phase)}</span>
                </div>
                <div class="compilation-actions">
                    <button class="speedup-btn" onclick="speedUpCompilation('${compilation.id}')" 
                            title="Accelera (costa XMR)">
                        <i class="fas fa-forward"></i>
                    </button>
                    <button class="cancel-btn" onclick="cancelCompilation('${compilation.id}')" 
                            title="Annulla">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="compilation-progress">
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${compilation.progress}%"></div>
                </div>
                <div class="progress-info">
                    <span class="progress-percent">${Math.round(compilation.progress)}%</span>
                    <span class="time-remaining">
                        ${formatCompilationTime(Math.max(0, compilation.totalTime - ((Date.now() - compilation.startTime) / 1000)))} rimasti
                    </span>
                </div>
            </div>
            
            <div class="compilation-details">
                <div class="detail-item">
                    <i class="fas fa-cogs"></i>
                    <span>Nodi: ${Object.keys(compilation.nodeUpgrades || {}).length}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tools"></i>
                    <span>Opzioni: ${compilation.compilerOptions.length}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Durata: ${formatCompilationTime(compilation.totalTime)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCompilationHistory() {
    const recentCompilations = state.programmingTimer.completedCompilations.slice(-5).reverse();
    
    if (recentCompilations.length === 0) {
        return '<p class="text-gray-400">Nessuna compilazione completata</p>';
    }
    
    return recentCompilations.map(compilation => `
        <div class="compilation-item completed">
            <div class="compilation-summary">
                <div class="compilation-info">
                    <span class="compilation-name">${compilation.templateName}</span>
                    <span class="completion-time">${formatDateTime(compilation.completedAt)}</span>
                </div>
                <div class="compilation-results">
                    <span class="effectiveness">Efficacia: ${Math.round(compilation.effectiveness * 100)}%</span>
                    <span class="rewards">
                        +${compilation.rewards.xp} XP, +${compilation.rewards.xmr} XMR
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCompilationUI(compilationId) {
    const compilation = activeCompilations.get(compilationId);
    if (!compilation) return;
    
    const element = document.getElementById(`compilation-${compilationId}`);
    if (!element) return;
    
    // Update progress bar
    const progressBar = element.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${compilation.progress}%`;
    }
    
    // Update progress percentage
    const progressPercent = element.querySelector('.progress-percent');
    if (progressPercent) {
        progressPercent.textContent = `${Math.round(compilation.progress)}%`;
    }
    
    // Update time remaining
    const timeRemaining = element.querySelector('.time-remaining');
    if (timeRemaining) {
        const remaining = Math.max(0, compilation.totalTime - ((Date.now() - compilation.startTime) / 1000));
        timeRemaining.textContent = `${formatCompilationTime(remaining)} rimasti`;
    }
    
    // Update phase
    const phaseElement = element.querySelector('.compilation-phase');
    if (phaseElement) {
        phaseElement.textContent = getPhaseDisplayName(compilation.phase);
    }
}

// Helper functions
function formatCompilationTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });
}

function getPhaseDisplayName(phase) {
    const phaseNames = {
        'initialization': 'Inizializzazione',
        'analysis': 'Analisi',
        'preprocessing': 'Pre-elaborazione',
        'compilation': 'Compilazione',
        'optimization': 'Ottimizzazione',
        'linking': 'Collegamento',
        'finalization': 'Finalizzazione',
        'completed': 'Completato'
    };
    
    return phaseNames[phase] || phase;
}

// Public API
window.programmingTimer = {
    init: initProgrammingTimer,
    startCompilation: startCompilation,
    cancelCompilation: cancelCompilation,
    speedUpCompilation: speedUpCompilation,
    calculateCompilationTime: calculateCompilationTime,
    renderUI: renderProgrammingTimerUI
};

// Auto-initialize
if (typeof state !== 'undefined') {
    initProgrammingTimer();
}