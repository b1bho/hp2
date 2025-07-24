// File: js/modules/dev_talents.js
// New Talents System - Vertical specialization branches with mandatory basic competencies

let devTalentsState = {
    availablePoints: 5, // Starting points for testing
    unlockedTalents: {},
    specializations: {},
    basicCompetencies: {
        // These are mandatory basic skills that unlock other branches
        'programming_basics': { level: 0, maxLevel: 3, required: true },
        'network_fundamentals': { level: 0, maxLevel: 3, required: true },
        'security_awareness': { level: 0, maxLevel: 3, required: true }
    }
};

// New talent tree structure with vertical specialization
const newTalentData = {
    "Basic Competencies": {
        icon: "fas fa-graduation-cap",
        description: "Essential skills required for all specializations",
        required: true,
        talents: {
            "Programming Basics": {
                id: "programming_basics",
                description: "Fundamental programming concepts and logic",
                maxLevel: 3,
                costs: [1, 2, 3],
                requirements: [],
                unlocks: ["software_dev", "malware_dev", "automation"],
                levels: [
                    { 
                        name: "Programming Basics I", 
                        unlocks: ["Basic scripting", "Variable manipulation", "Simple loops"],
                        studyTime: 30,
                        effect: "Unlock basic programming blocks in editor"
                    },
                    { 
                        name: "Programming Basics II", 
                        unlocks: ["Advanced data structures", "Function creation", "Error handling"],
                        studyTime: 60,
                        effect: "Reduce compilation time by 10%"
                    },
                    { 
                        name: "Programming Basics III", 
                        unlocks: ["Object-oriented programming", "Advanced algorithms", "Code optimization"],
                        studyTime: 120,
                        effect: "Reduce compilation time by 20%, unlock advanced editor features"
                    }
                ]
            },
            "Network Fundamentals": {
                id: "network_fundamentals",
                description: "Understanding of network protocols and architecture",
                maxLevel: 3,
                costs: [1, 2, 3],
                requirements: [],
                unlocks: ["network_security", "ddos_specialist", "reconnaissance"],
                levels: [
                    { 
                        name: "Network Fundamentals I", 
                        unlocks: ["Basic port scanning", "Protocol identification", "Network mapping"],
                        studyTime: 45,
                        effect: "Unlock network scanning blocks in editor"
                    },
                    { 
                        name: "Network Fundamentals II", 
                        unlocks: ["Advanced network analysis", "Traffic monitoring", "Packet crafting"],
                        studyTime: 90,
                        effect: "Improve network-based attack efficiency by 15%"
                    },
                    { 
                        name: "Network Fundamentals III", 
                        unlocks: ["Network topology analysis", "Advanced routing", "Protocol exploitation"],
                        studyTime: 180,
                        effect: "Improve network-based attack efficiency by 30%"
                    }
                ]
            },
            "Security Awareness": {
                id: "security_awareness",
                description: "Knowledge of cybersecurity principles and defense mechanisms",
                maxLevel: 3,
                costs: [1, 2, 3],
                requirements: [],
                unlocks: ["social_engineering", "crypto_specialist", "forensics"],
                levels: [
                    { 
                        name: "Security Awareness I", 
                        unlocks: ["Basic vulnerability identification", "Security tool usage", "Threat assessment"],
                        studyTime: 60,
                        effect: "Unlock security analysis blocks in editor"
                    },
                    { 
                        name: "Security Awareness II", 
                        unlocks: ["Advanced vulnerability analysis", "Defense evasion", "Security audit"],
                        studyTime: 120,
                        effect: "Reduce detection chance by 15%"
                    },
                    { 
                        name: "Security Awareness III", 
                        unlocks: ["Zero-day discovery", "Advanced evasion", "Security architecture"],
                        studyTime: 240,
                        effect: "Reduce detection chance by 30%, unlock stealth compiler options"
                    }
                ]
            }
        }
    },
    "Software Development": {
        icon: "fas fa-code",
        description: "Advanced programming and software creation skills",
        requires: ["programming_basics"],
        minLevel: 2,
        talents: {
            "Advanced Programming": {
                id: "advanced_programming",
                description: "Expert-level programming techniques and optimization",
                maxLevel: 5,
                costs: [2, 3, 4, 5, 6],
                requirements: ["programming_basics:2"],
                levels: [
                    { 
                        name: "Advanced Programming I", 
                        unlocks: ["Multi-threading", "Memory management", "Performance optimization"],
                        studyTime: 180,
                        effect: "Reduce malware compilation time by 25%"
                    },
                    { 
                        name: "Advanced Programming II", 
                        unlocks: ["Assembly integration", "System calls", "Low-level optimization"],
                        studyTime: 360,
                        effect: "Reduce malware compilation time by 40%"
                    },
                    { 
                        name: "Advanced Programming III", 
                        unlocks: ["Kernel-level programming", "Driver development", "System exploitation"],
                        studyTime: 720,
                        effect: "Unlock kernel-level malware blocks"
                    },
                    { 
                        name: "Advanced Programming IV", 
                        unlocks: ["Compiler design", "Code generation", "Advanced optimization"],
                        studyTime: 1440,
                        effect: "Create custom compilation profiles"
                    },
                    { 
                        name: "Advanced Programming V", 
                        unlocks: ["AI-assisted coding", "Automated vulnerability discovery", "Self-modifying code"],
                        studyTime: 2880,
                        effect: "Unlock AI-powered editor features"
                    }
                ]
            },
            "Malware Engineering": {
                id: "malware_engineering",
                description: "Specialized skills in creating sophisticated malware",
                maxLevel: 4,
                costs: [3, 4, 5, 6],
                requirements: ["programming_basics:3", "security_awareness:2"],
                levels: [
                    { 
                        name: "Malware Engineering I", 
                        unlocks: ["Advanced payload design", "Multi-stage malware", "Polymorphic code"],
                        studyTime: 300,
                        effect: "Unlock advanced malware blocks, +25% malware effectiveness"
                    },
                    { 
                        name: "Malware Engineering II", 
                        unlocks: ["Metamorphic malware", "Anti-analysis techniques", "Sandbox evasion"],
                        studyTime: 600,
                        effect: "+50% malware effectiveness, reduce detection by 40%"
                    },
                    { 
                        name: "Malware Engineering III", 
                        unlocks: ["AI-powered malware", "Adaptive payloads", "Living-off-the-land techniques"],
                        studyTime: 1200,
                        effect: "+75% malware effectiveness, unlock adaptive compiler"
                    },
                    { 
                        name: "Malware Engineering IV", 
                        unlocks: ["Self-replicating AI malware", "Autonomous attack systems", "Zero-footprint malware"],
                        studyTime: 2400,
                        effect: "+100% malware effectiveness, unlock autonomous deployment"
                    }
                ]
            }
        }
    },
    "Network Security": {
        icon: "fas fa-network-wired",
        description: "Specialized skills in network-based attacks and defense",
        requires: ["network_fundamentals"],
        minLevel: 2,
        talents: {
            "Penetration Testing": {
                id: "penetration_testing",
                description: "Professional penetration testing methodologies",
                maxLevel: 4,
                costs: [2, 3, 4, 5],
                requirements: ["network_fundamentals:2", "security_awareness:1"],
                levels: [
                    { 
                        name: "Penetration Testing I", 
                        unlocks: ["Advanced reconnaissance", "Vulnerability assessment", "Exploit chaining"],
                        studyTime: 240,
                        effect: "+30% reconnaissance effectiveness"
                    },
                    { 
                        name: "Penetration Testing II", 
                        unlocks: ["Advanced exploitation", "Post-exploitation", "Lateral movement"],
                        studyTime: 480,
                        effect: "+50% network penetration success rate"
                    },
                    { 
                        name: "Penetration Testing III", 
                        unlocks: ["Red team operations", "APT simulation", "Persistent access"],
                        studyTime: 960,
                        effect: "+75% network control effectiveness"
                    },
                    { 
                        name: "Penetration Testing IV", 
                        unlocks: ["Zero-day exploitation", "Infrastructure compromise", "Enterprise-level attacks"],
                        studyTime: 1920,
                        effect: "Unlock enterprise-level attack vectors"
                    }
                ]
            },
            "DDoS Orchestration": {
                id: "ddos_orchestration",
                description: "Advanced distributed denial of service attack coordination",
                maxLevel: 3,
                costs: [3, 4, 5],
                requirements: ["network_fundamentals:3"],
                levels: [
                    { 
                        name: "DDoS Orchestration I", 
                        unlocks: ["Multi-vector attacks", "Traffic amplification", "Botnet coordination"],
                        studyTime: 360,
                        effect: "+40% DDoS attack power, unlock coordination blocks"
                    },
                    { 
                        name: "DDoS Orchestration II", 
                        unlocks: ["Adaptive attack patterns", "Defense evasion", "Real-time optimization"],
                        studyTime: 720,
                        effect: "+75% DDoS attack power, reduce mitigation effectiveness by 50%"
                    },
                    { 
                        name: "DDoS Orchestration III", 
                        unlocks: ["AI-powered attacks", "Predictive scaling", "Autonomous botnet management"],
                        studyTime: 1440,
                        effect: "+125% DDoS attack power, unlock AI orchestration"
                    }
                ]
            }
        }
    },
    "Social Engineering": {
        icon: "fas fa-user-secret",
        description: "Psychological manipulation and human-based attack vectors",
        requires: ["security_awareness"],
        minLevel: 1,
        talents: {
            "Psychological Manipulation": {
                id: "psychological_manipulation",
                description: "Advanced understanding of human psychology for exploitation",
                maxLevel: 4,
                costs: [2, 3, 4, 5],
                requirements: ["security_awareness:1"],
                levels: [
                    { 
                        name: "Psychological Manipulation I", 
                        unlocks: ["Persuasive content creation", "Emotional triggers", "Trust exploitation"],
                        studyTime: 120,
                        effect: "+25% social engineering success rate"
                    },
                    { 
                        name: "Psychological Manipulation II", 
                        unlocks: ["Advanced persuasion techniques", "Profile-based targeting", "Behavioral analysis"],
                        studyTime: 240,
                        effect: "+50% social engineering success rate"
                    },
                    { 
                        name: "Psychological Manipulation III", 
                        unlocks: ["Mass psychological operations", "Cultural exploitation", "Long-term manipulation"],
                        studyTime: 480,
                        effect: "+75% social engineering success rate, unlock mass targeting"
                    },
                    { 
                        name: "Psychological Manipulation IV", 
                        unlocks: ["AI-assisted profiling", "Automated social engineering", "Predictive behavior modeling"],
                        studyTime: 960,
                        effect: "+100% social engineering success rate, unlock AI social engineering"
                    }
                ]
            }
        }
    },
    "Cryptography": {
        icon: "fas fa-lock",
        description: "Advanced cryptographic techniques and implementations",
        requires: ["security_awareness"],
        minLevel: 2,
        talents: {
            "Cryptographic Systems": {
                id: "cryptographic_systems",
                description: "Design and implementation of cryptographic systems",
                maxLevel: 3,
                costs: [3, 4, 5],
                requirements: ["security_awareness:2", "programming_basics:2"],
                levels: [
                    { 
                        name: "Cryptographic Systems I", 
                        unlocks: ["Custom encryption algorithms", "Key management", "Secure communications"],
                        studyTime: 480,
                        effect: "+30% encryption strength, unlock encryption blocks"
                    },
                    { 
                        name: "Cryptographic Systems II", 
                        unlocks: ["Advanced cryptanalysis", "Quantum-resistant algorithms", "Zero-knowledge proofs"],
                        studyTime: 960,
                        effect: "+60% encryption strength, unlock cryptanalysis tools"
                    },
                    { 
                        name: "Cryptographic Systems III", 
                        unlocks: ["Post-quantum cryptography", "Homomorphic encryption", "Blockchain integration"],
                        studyTime: 1920,
                        effect: "+100% encryption strength, unlock quantum-level security"
                    }
                ]
            }
        }
    }
};

function renderNewTalentsSystem() {
    const container = document.getElementById('dev-talents-tab');
    container.innerHTML = `
        <div class="new-talents-system h-full flex flex-col bg-gray-900">
            <!-- Talents Header -->
            <div class="talents-header bg-gray-800 border-b border-gray-600 p-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-purple-400">
                            <i class="fas fa-tree mr-2"></i>
                            Advanced Talent System
                        </h2>
                        <p class="text-gray-400">Specialized vertical progression with mandatory competencies</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="talent-points bg-purple-600 px-4 py-2 rounded-lg">
                            <span class="text-sm">Available Points:</span>
                            <span id="dev-talent-points" class="font-bold text-xl ml-2">${devTalentsState.availablePoints}</span>
                        </div>
                        <button onclick="resetDevTalents()" class="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg">
                            <i class="fas fa-undo mr-1"></i>Reset
                        </button>
                    </div>
                </div>
            </div>

            <!-- Talents Content -->
            <div class="talents-content flex-1 overflow-auto p-4">
                <div class="talent-branches space-y-6" id="talent-branches-container">
                    <!-- Talent branches will be rendered here -->
                </div>
            </div>

            <!-- Talent Progression Summary -->
            <div class="talents-footer bg-gray-800 border-t border-gray-600 p-4">
                <div class="grid grid-cols-3 gap-4">
                    <div class="stat-card bg-gray-700 p-3 rounded-lg">
                        <div class="text-sm text-gray-400">Total Specializations</div>
                        <div id="total-specializations" class="text-2xl font-bold text-blue-400">0</div>
                    </div>
                    <div class="stat-card bg-gray-700 p-3 rounded-lg">
                        <div class="text-sm text-gray-400">Compilation Speed Bonus</div>
                        <div id="compilation-speed-bonus" class="text-2xl font-bold text-green-400">+0%</div>
                    </div>
                    <div class="stat-card bg-gray-700 p-3 rounded-lg">
                        <div class="text-sm text-gray-400">Effectiveness Bonus</div>
                        <div id="effectiveness-bonus" class="text-2xl font-bold text-orange-400">+0%</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderTalentBranches();
    updateTalentSummary();
}

function renderTalentBranches() {
    const container = document.getElementById('talent-branches-container');
    container.innerHTML = '';

    for (const [branchName, branchData] of Object.entries(newTalentData)) {
        const branchElement = createTalentBranch(branchName, branchData);
        container.appendChild(branchElement);
    }
}

function createTalentBranch(branchName, branchData) {
    const branchDiv = document.createElement('div');
    branchDiv.className = 'talent-branch bg-gray-800 rounded-lg border border-gray-600 overflow-hidden';

    const isLocked = branchData.requires && !checkBranchRequirements(branchData.requires, branchData.minLevel);
    const lockClass = isLocked ? 'opacity-50' : '';

    branchDiv.innerHTML = `
        <div class="branch-header bg-gray-700 p-4 border-b border-gray-600">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="${branchData.icon} text-2xl mr-3 ${branchData.required ? 'text-yellow-400' : 'text-purple-400'}"></i>
                    <div>
                        <h3 class="text-xl font-bold text-white">${branchName}</h3>
                        <p class="text-sm text-gray-400">${branchData.description}</p>
                        ${branchData.required ? '<span class="inline-block mt-1 px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded">REQUIRED</span>' : ''}
                        ${isLocked ? '<span class="inline-block mt-1 px-2 py-1 bg-red-600 text-red-100 text-xs rounded">LOCKED</span>' : ''}
                    </div>
                </div>
                <button onclick="toggleBranch('${branchName}')" class="text-gray-400 hover:text-white">
                    <i class="fas fa-chevron-down branch-toggle"></i>
                </button>
            </div>
            ${branchData.requires ? `
                <div class="mt-2 text-sm text-orange-400">
                    <i class="fas fa-lock mr-1"></i>
                    Requires: ${branchData.requires.join(', ')} (Level ${branchData.minLevel}+)
                </div>
            ` : ''}
        </div>
        <div class="branch-content ${lockClass}" style="display: none;">
            <div class="talents-grid p-4 space-y-4">
                ${Object.entries(branchData.talents).map(([talentName, talentData]) => 
                    createTalentCard(talentName, talentData, isLocked)
                ).join('')}
            </div>
        </div>
    `;

    return branchDiv;
}

function createTalentCard(talentName, talentData, branchLocked) {
    const currentLevel = devTalentsState.unlockedTalents[talentData.id] || 0;
    const canUpgrade = !branchLocked && 
                      currentLevel < talentData.maxLevel && 
                      devTalentsState.availablePoints >= talentData.costs[currentLevel] &&
                      checkTalentRequirements(talentData.requirements);

    const nextLevel = currentLevel + 1;
    const nextCost = currentLevel < talentData.maxLevel ? talentData.costs[currentLevel] : null;

    return `
        <div class="talent-card bg-gray-700 rounded-lg border border-gray-600 p-4 ${currentLevel > 0 ? 'border-purple-500' : ''}">
            <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                    <h4 class="text-lg font-bold text-white">${talentName}</h4>
                    <p class="text-sm text-gray-400 mb-2">${talentData.description}</p>
                    <div class="talent-level-indicator">
                        <span class="text-sm font-semibold">Level: ${currentLevel}/${talentData.maxLevel}</span>
                        <div class="w-full bg-gray-600 rounded-full h-2 mt-1">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: ${(currentLevel / talentData.maxLevel) * 100}%"></div>
                        </div>
                    </div>
                </div>
                <div class="ml-4 text-right">
                    ${nextCost !== null ? `
                        <button onclick="upgradeTalent('${talentData.id}', ${nextCost})" 
                                class="px-3 py-2 rounded-lg font-semibold transition-colors ${
                                    canUpgrade 
                                        ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer' 
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }" 
                                ${!canUpgrade ? 'disabled' : ''}>
                            ${canUpgrade ? `Upgrade (${nextCost} pts)` : 'Locked'}
                        </button>
                    ` : `
                        <span class="px-3 py-2 bg-green-600 text-white rounded-lg">MAXED</span>
                    `}
                </div>
            </div>
            
            ${currentLevel > 0 && talentData.levels[currentLevel - 1] ? `
                <div class="current-level-info bg-gray-800 p-3 rounded-lg mb-2">
                    <h5 class="font-semibold text-green-400 mb-1">${talentData.levels[currentLevel - 1].name}</h5>
                    <p class="text-sm text-gray-300 mb-2">${talentData.levels[currentLevel - 1].effect}</p>
                    <div class="text-xs text-blue-400">
                        <strong>Unlocks:</strong> ${talentData.levels[currentLevel - 1].unlocks.join(', ')}
                    </div>
                </div>
            ` : ''}
            
            ${nextLevel <= talentData.maxLevel && talentData.levels[nextLevel - 1] ? `
                <div class="next-level-preview bg-gray-800 p-3 rounded-lg border border-purple-500 border-opacity-50">
                    <h5 class="font-semibold text-purple-400 mb-1">Next: ${talentData.levels[nextLevel - 1].name}</h5>
                    <p class="text-sm text-gray-300 mb-2">${talentData.levels[nextLevel - 1].effect}</p>
                    <div class="text-xs text-blue-400 mb-2">
                        <strong>Will unlock:</strong> ${talentData.levels[nextLevel - 1].unlocks.join(', ')}
                    </div>
                    <div class="text-xs text-orange-400">
                        <i class="fas fa-clock mr-1"></i>
                        Study time: ${talentData.levels[nextLevel - 1].studyTime} minutes
                    </div>
                </div>
            ` : ''}
            
            ${talentData.requirements && talentData.requirements.length > 0 ? `
                <div class="requirements mt-2 text-xs text-orange-400">
                    <i class="fas fa-lock mr-1"></i>
                    Requires: ${talentData.requirements.join(', ')}
                </div>
            ` : ''}
        </div>
    `;
}

function checkBranchRequirements(requires, minLevel) {
    if (!requires || requires.length === 0) return true;
    
    for (const req of requires) {
        const currentLevel = devTalentsState.unlockedTalents[req] || 0;
        if (currentLevel < minLevel) return false;
    }
    return true;
}

function checkTalentRequirements(requirements) {
    if (!requirements || requirements.length === 0) return true;
    
    for (const req of requirements) {
        const [talentId, requiredLevel] = req.split(':');
        const currentLevel = devTalentsState.unlockedTalents[talentId] || 0;
        if (currentLevel < parseInt(requiredLevel)) return false;
    }
    return true;
}

function upgradeTalent(talentId, cost) {
    if (devTalentsState.availablePoints < cost) {
        showNotification('Not enough talent points!', 'error');
        return;
    }
    
    const currentLevel = devTalentsState.unlockedTalents[talentId] || 0;
    devTalentsState.unlockedTalents[talentId] = currentLevel + 1;
    devTalentsState.availablePoints -= cost;
    
    // Update UI
    document.getElementById('dev-talent-points').textContent = devTalentsState.availablePoints;
    
    // Re-render talents to update state
    renderTalentBranches();
    updateTalentSummary();
    
    showNotification(`Talent upgraded successfully!`, 'success');
}

function toggleBranch(branchName) {
    const branchElement = Array.from(document.querySelectorAll('.talent-branch')).find(
        el => el.querySelector('.branch-header h3').textContent === branchName
    );
    
    if (branchElement) {
        const content = branchElement.querySelector('.branch-content');
        const toggle = branchElement.querySelector('.branch-toggle');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.classList.add('fa-chevron-up');
            toggle.classList.remove('fa-chevron-down');
        } else {
            content.style.display = 'none';
            toggle.classList.add('fa-chevron-down');
            toggle.classList.remove('fa-chevron-up');
        }
    }
}

function resetDevTalents() {
    if (confirm('Are you sure you want to reset all talents? This cannot be undone.')) {
        devTalentsState.unlockedTalents = {};
        devTalentsState.availablePoints = 20; // Give more points for testing
        
        renderNewTalentsSystem();
        showNotification('Talents reset successfully!', 'success');
    }
}

function updateTalentSummary() {
    const totalSpecializations = Object.keys(devTalentsState.unlockedTalents).length;
    
    // Calculate bonuses based on talents
    let compilationSpeedBonus = 0;
    let effectivenessBonus = 0;
    
    // Basic competencies provide compilation speed bonus
    const programmingLevel = devTalentsState.unlockedTalents['programming_basics'] || 0;
    compilationSpeedBonus += programmingLevel * 10;
    
    // Advanced programming provides additional speed bonus
    const advancedProgrammingLevel = devTalentsState.unlockedTalents['advanced_programming'] || 0;
    compilationSpeedBonus += advancedProgrammingLevel * 15;
    
    // Malware engineering provides effectiveness bonus
    const malwareEngineeringLevel = devTalentsState.unlockedTalents['malware_engineering'] || 0;
    effectivenessBonus += malwareEngineeringLevel * 25;
    
    // Update summary display
    document.getElementById('total-specializations').textContent = totalSpecializations;
    document.getElementById('compilation-speed-bonus').textContent = `+${compilationSpeedBonus}%`;
    document.getElementById('effectiveness-bonus').textContent = `+${effectivenessBonus}%`;
}

// Export functions for global access
window.renderNewTalentsSystem = renderNewTalentsSystem;
window.upgradeTalent = upgradeTalent;
window.toggleBranch = toggleBranch;
window.resetDevTalents = resetDevTalents;