// New Four-Branch Talent System
// File: js/new-talents.js

// New Talent Tree with Four Core Branches
const newTalentTree = {
    'Sviluppo': {
        icon: 'fas fa-code',
        color: 'blue',
        description: 'Sblocca template di malware e potenzia nodi di sviluppo',
        levels: [
            {
                level: 1,
                name: 'Sviluppo LV1',
                cost: 2,
                xpRequired: 0,
                unlocks: [
                    'Template: Ransomware Base',
                    'Template: Keylogger Base',
                    'Nodo Enhancement: Key Generation',
                    'Compiler: Basic Encryption'
                ],
                nodeBoosts: [
                    'Crittografa File: +20% efficienza',
                    'Code Injection: +15% successo'
                ],
                compilerFeatures: [
                    'Basic code obfuscation',
                    'Simple anti-debugging'
                ]
            },
            {
                level: 2,
                name: 'Sviluppo LV2',
                cost: 3,
                xpRequired: 100,
                unlocks: [
                    'Template: Ransomware Avanzato',
                    'Template: Trojan Controller',
                    'Nodo Enhancement: Advanced Crypto',
                    'Nodo Enhancement: Privilege Escalation',
                    'Compiler: Advanced Encryption'
                ],
                nodeBoosts: [
                    'Crittografa File: +40% efficienza',
                    'Privilege Escalation: +25% successo',
                    'Code Injection: +30% successo'
                ],
                compilerFeatures: [
                    'Advanced polymorphic encryption',
                    'Runtime decryption',
                    'Anti-emulation techniques'
                ]
            },
            {
                level: 3,
                name: 'Sviluppo LV3',
                cost: 5,
                xpRequired: 250,
                unlocks: [
                    'Template: Zero-Day Exploit Kit',
                    'Template: Advanced Rootkit',
                    'Nodo Enhancement: Self-Modifying Code',
                    'Compiler: Military-Grade Encryption'
                ],
                nodeBoosts: [
                    'Tutti i nodi di sviluppo: +50% efficienza',
                    'Cancella Settori Disco: +60% velocità',
                    'Memory Injection: +45% stealth'
                ],
                compilerFeatures: [
                    'Metamorphic code generation',
                    'Hardware-based encryption',
                    'Zero-signature techniques'
                ]
            }
        ]
    },
    'Networking': {
        icon: 'fas fa-network-wired',
        color: 'green',
        description: 'Sblocca template di rete e potenzia propagazione',
        levels: [
            {
                level: 1,
                name: 'Networking LV1',
                cost: 2,
                xpRequired: 0,
                unlocks: [
                    'Template: Basic Botnet Controller',
                    'Template: Network Scanner',
                    'Nodo Enhancement: Deep Scan',
                    'Tool Difensivo: Firewall Monitor'
                ],
                nodeBoosts: [
                    'Network Scanner: +25% velocità',
                    'Propagazione Rete: +20% successo'
                ],
                compilerFeatures: [
                    'Network protocol obfuscation',
                    'Basic traffic encryption'
                ]
            },
            {
                level: 2,
                name: 'Networking LV2',
                cost: 3,
                xpRequired: 100,
                unlocks: [
                    'Template: Advanced Botnet',
                    'Template: DDoS Coordinator',
                    'Nodo Enhancement: Network Discovery',
                    'Nodo Enhancement: Encrypted Channel',
                    'Tool Difensivo: Intrusion Detection'
                ],
                nodeBoosts: [
                    'Gestione Botnet: +40% efficienza',
                    'DDoS Attack: +35% potenza',
                    'Network Discovery: +50% copertura'
                ],
                compilerFeatures: [
                    'P2P communication protocols',
                    'Domain generation algorithms',
                    'Traffic pattern randomization'
                ]
            },
            {
                level: 3,
                name: 'Networking LV3',
                cost: 5,
                xpRequired: 250,
                unlocks: [
                    'Template: Mesh Botnet Controller',
                    'Template: Nation-State Grade Network Tool',
                    'Nodo Enhancement: Quantum-Resistant Protocols',
                    'Tool Difensivo: AI-Powered IDS'
                ],
                nodeBoosts: [
                    'Tutti i nodi networking: +60% efficienza',
                    'Botnet Resilience: +80% uptime',
                    'Network Stealth: +70% detection avoidance'
                ],
                compilerFeatures: [
                    'Quantum communication protocols',
                    'AI-driven traffic analysis evasion',
                    'Blockchain-based C&C infrastructure'
                ]
            }
        ]
    },
    'Stealth': {
        icon: 'fas fa-user-ninja',
        color: 'purple',
        description: 'Sblocca template evasivi e potenzia anti-forensics',
        levels: [
            {
                level: 1,
                name: 'Stealth LV1',
                cost: 2,
                xpRequired: 0,
                unlocks: [
                    'Template: Basic AV Evasion',
                    'Template: Anti-Debug Tool',
                    'Nodo Enhancement: Stealth Injection',
                    'Modifier: Obfuscator'
                ],
                nodeBoosts: [
                    'Evasione Antivirus: +30% successo',
                    'Anti-Debug: +25% efficienza'
                ],
                compilerFeatures: [
                    'Basic code obfuscation',
                    'Simple anti-debugging',
                    'Process name spoofing'
                ]
            },
            {
                level: 2,
                name: 'Stealth LV2',
                cost: 3,
                xpRequired: 100,
                unlocks: [
                    'Template: Advanced Evasion Suite',
                    'Template: Forensics Cleaner',
                    'Nodo Enhancement: Covert Channel',
                    'Modifier: Runtime Crypter',
                    'Anti-Forensics: Secure Delete'
                ],
                nodeBoosts: [
                    'Covert Channel: +45% invisibilità',
                    'Anti-Forensics: +50% trace removal',
                    'VM Detection: +40% accuracy'
                ],
                compilerFeatures: [
                    'Runtime polymorphism',
                    'Memory-only execution',
                    'Behavioral analysis evasion'
                ]
            },
            {
                level: 3,
                name: 'Stealth LV3',
                cost: 5,
                xpRequired: 250,
                unlocks: [
                    'Template: Ghost Protocol Suite',
                    'Template: Nation-State Stealth Kit',
                    'Nodo Enhancement: Quantum Stealth',
                    'Anti-Forensics: Time Manipulation'
                ],
                nodeBoosts: [
                    'Tutti i nodi stealth: +70% efficienza',
                    'Zero-Detection Rate: 95%+ guarantee',
                    'Forensics Resistance: Military-grade'
                ],
                compilerFeatures: [
                    'Hardware-level hiding',
                    'AI-powered behavior mimicking',
                    'Quantum-encrypted communications'
                ]
            }
        ]
    },
    'Ingegneria Sociale': {
        icon: 'fas fa-user-secret',
        color: 'red',
        description: 'Sblocca template sociali e potenzia persuasione',
        levels: [
            {
                level: 1,
                name: 'Ingegneria Sociale LV1',
                cost: 2,
                xpRequired: 0,
                unlocks: [
                    'Template: Basic Phishing Campaign',
                    'Template: Social Media Scraper',
                    'Nodo Enhancement: OSINT Analysis',
                    'Content: Email Templates'
                ],
                nodeBoosts: [
                    'Target Research: +35% depth',
                    'Phishing Success: +25% click rate'
                ],
                compilerFeatures: [
                    'Personalized content generation',
                    'Social engineering optimization'
                ]
            },
            {
                level: 2,
                name: 'Ingegneria Sociale LV2',
                cost: 3,
                xpRequired: 100,
                unlocks: [
                    'Template: Advanced Spear Phishing',
                    'Template: Vishing/Smishing Suite',
                    'Nodo Enhancement: Social Profiling',
                    'Nodo Enhancement: AI Writing',
                    'Campaign: Mass Persuasion'
                ],
                nodeBoosts: [
                    'Social Profiling: +50% accuracy',
                    'Content Generation: +40% persuasiveness',
                    'Multi-channel Delivery: +45% reach'
                ],
                compilerFeatures: [
                    'AI-powered content adaptation',
                    'Psychological profiling integration',
                    'Real-time campaign optimization'
                ]
            },
            {
                level: 3,
                name: 'Ingegneria Sociale LV3',
                cost: 5,
                xpRequired: 250,
                unlocks: [
                    'Template: Nation-State Influence Operation',
                    'Template: Deep Fake Campaign',
                    'Nodo Enhancement: Psychological Manipulation',
                    'Campaign: Mass Social Engineering'
                ],
                nodeBoosts: [
                    'Tutti i nodi sociali: +65% efficienza',
                    'Influence Operations: +80% success',
                    'Deep Fake Generation: Professional-grade'
                ],
                compilerFeatures: [
                    'Deep fake integration',
                    'Mass psychological manipulation',
                    'Social network exploitation'
                ]
            }
        ]
    }
};

class NewTalentSystem {
    constructor() {
        this.selectedTalent = null;
        this.init();
    }

    init() {
        this.renderTalentTree();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('talent-level-btn')) {
                const branch = e.target.dataset.branch;
                const level = parseInt(e.target.dataset.level);
                this.unlockTalent(branch, level);
            }
            
            if (e.target.classList.contains('talent-level-card')) {
                const branch = e.target.dataset.branch;
                const level = parseInt(e.target.dataset.level);
                this.showTalentDetails(branch, level);
            }
        });
    }

    renderTalentTree() {
        const container = document.getElementById('new-talent-tree');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(newTalentTree).forEach(([branchName, branch]) => {
            const branchElement = this.createTalentBranch(branchName, branch);
            container.appendChild(branchElement);
        });
    }

    createTalentBranch(branchName, branch) {
        const branchDiv = document.createElement('div');
        branchDiv.className = 'talent-branch';
        
        const currentLevel = devState.talentState.unlockedTalents[branchName]?.level || 0;
        const currentXP = devState.talentState.unlockedTalents[branchName]?.xp || 0;

        branchDiv.innerHTML = `
            <h3 class="flex items-center text-${branch.color}-400">
                <i class="${branch.icon} mr-3"></i>
                ${branchName}
            </h3>
            <p class="text-sm text-gray-400 mb-4">${branch.description}</p>
            <div class="space-y-3">
                ${branch.levels.map((level, index) => 
                    this.createTalentLevel(branchName, level, index, currentLevel, currentXP)
                ).join('')}
            </div>
        `;

        return branchDiv;
    }

    createTalentLevel(branchName, level, index, currentLevel, currentXP) {
        const levelNum = index + 1;
        const isUnlocked = currentLevel >= levelNum;
        const canUnlock = (currentLevel === levelNum - 1) && 
                         (devState.talentState.talentPoints >= level.cost) && 
                         (currentXP >= level.xpRequired);
        const isAvailable = currentLevel === levelNum - 1;
        
        let statusClass = 'locked';
        let buttonContent = '';
        
        if (isUnlocked) {
            statusClass = 'unlocked';
            buttonContent = '<i class="fas fa-check text-green-400"></i>';
        } else if (canUnlock) {
            statusClass = 'available';
            buttonContent = `<button class="talent-level-btn px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 rounded" 
                                data-branch="${branchName}" data-level="${levelNum}">
                                Sblocca (${level.cost} TP)
                            </button>`;
        } else if (isAvailable) {
            statusClass = 'available';
            buttonContent = `<span class="text-xs text-gray-400">XP: ${currentXP}/${level.xpRequired}</span>`;
        } else {
            buttonContent = '<i class="fas fa-lock text-gray-500"></i>';
        }

        return `
            <div class="talent-level ${statusClass} talent-level-card cursor-pointer" 
                 data-branch="${branchName}" data-level="${levelNum}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-semibold text-white">${level.name}</h5>
                        <div class="text-xs text-gray-400 mt-1">
                            <div>Costo: ${level.cost} Punti Talento</div>
                            ${level.xpRequired > 0 ? `<div>XP Richiesta: ${level.xpRequired}</div>` : ''}
                        </div>
                        <div class="text-xs text-indigo-300 mt-2">
                            ${level.unlocks.slice(0, 2).join(', ')}
                            ${level.unlocks.length > 2 ? ` e altri ${level.unlocks.length - 2}...` : ''}
                        </div>
                    </div>
                    <div class="ml-3 flex items-center">
                        ${buttonContent}
                    </div>
                </div>
            </div>
        `;
    }

    showTalentDetails(branchName, level) {
        const branch = newTalentTree[branchName];
        const levelData = branch.levels[level - 1];
        if (!levelData) return;

        const container = document.getElementById('talent-details');
        if (!container) return;

        const currentLevel = devState.talentState.unlockedTalents[branchName]?.level || 0;
        const isUnlocked = currentLevel >= level;

        container.innerHTML = `
            <div class="space-y-4">
                <div>
                    <h4 class="text-lg font-semibold text-white flex items-center">
                        <i class="${branch.icon} mr-2 text-${branch.color}-400"></i>
                        ${levelData.name}
                    </h4>
                    <div class="text-sm text-gray-400 mt-1">
                        ${branchName} - Livello ${level}
                    </div>
                </div>

                <div class="bg-gray-700 rounded-lg p-4">
                    <h5 class="font-semibold text-indigo-300 mb-2">Template e Funzionalità Sbloccate</h5>
                    <ul class="space-y-1 text-sm">
                        ${levelData.unlocks.map(unlock => 
                            `<li class="flex items-center">
                                <i class="fas fa-unlock-alt text-green-400 mr-2 text-xs"></i>
                                ${unlock}
                            </li>`
                        ).join('')}
                    </ul>
                </div>

                <div class="bg-gray-700 rounded-lg p-4">
                    <h5 class="font-semibold text-yellow-300 mb-2">Potenziamenti Nodi</h5>
                    <ul class="space-y-1 text-sm">
                        ${levelData.nodeBoosts.map(boost => 
                            `<li class="flex items-center">
                                <i class="fas fa-arrow-up text-yellow-400 mr-2 text-xs"></i>
                                ${boost}
                            </li>`
                        ).join('')}
                    </ul>
                </div>

                <div class="bg-gray-700 rounded-lg p-4">
                    <h5 class="font-semibold text-purple-300 mb-2">Funzionalità Compiler</h5>
                    <ul class="space-y-1 text-sm">
                        ${levelData.compilerFeatures.map(feature => 
                            `<li class="flex items-center">
                                <i class="fas fa-cogs text-purple-400 mr-2 text-xs"></i>
                                ${feature}
                            </li>`
                        ).join('')}
                    </ul>
                </div>

                <div class="bg-gray-800 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium">Costo:</span>
                        <span class="text-indigo-400 font-bold">${levelData.cost} Punti Talento</span>
                    </div>
                    ${levelData.xpRequired > 0 ? `
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-sm font-medium">XP Richiesta:</span>
                            <span class="text-yellow-400 font-bold">${levelData.xpRequired}</span>
                        </div>
                    ` : ''}
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-sm font-medium">Stato:</span>
                        <span class="font-bold ${isUnlocked ? 'text-green-400' : 'text-red-400'}">
                            ${isUnlocked ? 'Sbloccato' : 'Bloccato'}
                        </span>
                    </div>
                </div>
            </div>
        `;

        this.selectedTalent = { branch: branchName, level: level };
        devState.talentState.selectedTalent = this.selectedTalent;
        saveStateDebounced();
    }

    unlockTalent(branchName, level) {
        const branch = newTalentTree[branchName];
        const levelData = branch.levels[level - 1];
        if (!levelData) return;

        const currentLevel = devState.talentState.unlockedTalents[branchName]?.level || 0;
        const currentXP = devState.talentState.unlockedTalents[branchName]?.xp || 0;

        // Check requirements
        if (currentLevel !== level - 1) {
            alert('Devi sbloccare i livelli precedenti prima');
            return;
        }

        if (devState.talentState.talentPoints < levelData.cost) {
            alert('Non hai abbastanza Punti Talento');
            return;
        }

        if (currentXP < levelData.xpRequired) {
            alert(`Hai bisogno di ${levelData.xpRequired} XP per sbloccare questo talento`);
            return;
        }

        // Unlock the talent
        devState.talentState.talentPoints -= levelData.cost;
        devState.talentState.unlockedTalents[branchName] = {
            level: level,
            xp: currentXP
        };

        // Update UI
        this.renderTalentTree();
        if (this.selectedTalent && this.selectedTalent.branch === branchName && this.selectedTalent.level === level) {
            this.showTalentDetails(branchName, level);
        }

        // Update editor templates if needed
        if (window.newFlowEditor) {
            window.newFlowEditor.renderTemplateList();
        }

        saveStateDebounced();

        // Show unlock notification
        this.showUnlockNotification(levelData.name, levelData.unlocks);
    }

    showUnlockNotification(talentName, unlocks) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-800 border border-green-600 rounded-lg p-4 z-50 fade-in';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-star text-yellow-400 mr-2"></i>
                <h5 class="font-semibold text-white">Talento Sbloccato!</h5>
            </div>
            <div class="text-sm text-green-300 mt-1">${talentName}</div>
            <div class="text-xs text-gray-300 mt-2">
                ${unlocks.slice(0, 3).join(', ')}
                ${unlocks.length > 3 ? ` e altri ${unlocks.length - 3}...` : ''}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    addXP(branchName, amount) {
        if (!devState.talentState.unlockedTalents[branchName]) {
            devState.talentState.unlockedTalents[branchName] = { level: 0, xp: 0 };
        }
        
        devState.talentState.unlockedTalents[branchName].xp += amount;
        saveStateDebounced();
        
        // Update UI if showing this talent
        if (this.selectedTalent && this.selectedTalent.branch === branchName) {
            this.showTalentDetails(branchName, this.selectedTalent.level);
        }
        
        this.renderTalentTree();
    }

    getTalentLevel(branchName) {
        return devState.talentState.unlockedTalents[branchName]?.level || 0;
    }

    getTalentBonus(branchName, type) {
        const level = this.getTalentLevel(branchName);
        const branch = newTalentTree[branchName];
        if (!branch || level === 0) return 0;

        let bonus = 0;
        for (let i = 0; i < level; i++) {
            const levelData = branch.levels[i];
            if (levelData) {
                // Calculate bonus based on type
                if (type === 'compilationTime') {
                    bonus += 0.1; // 10% reduction per level
                } else if (type === 'nodeEfficiency') {
                    bonus += 0.15; // 15% efficiency increase per level
                }
            }
        }
        
        return Math.min(bonus, 0.8); // Max 80% bonus
    }

    getUnlockedTemplates() {
        const unlocked = [];
        
        Object.entries(devState.talentState.unlockedTalents).forEach(([branchName, data]) => {
            const level = data.level;
            const branch = newTalentTree[branchName];
            
            if (branch && level > 0) {
                for (let i = 0; i < level; i++) {
                    const levelData = branch.levels[i];
                    if (levelData) {
                        levelData.unlocks.forEach(unlock => {
                            if (unlock.startsWith('Template:')) {
                                unlocked.push(unlock.replace('Template: ', ''));
                            }
                        });
                    }
                }
            }
        });
        
        return unlocked;
    }

    getUnlockedCompilerFeatures() {
        const features = [];
        
        Object.entries(devState.talentState.unlockedTalents).forEach(([branchName, data]) => {
            const level = data.level;
            const branch = newTalentTree[branchName];
            
            if (branch && level > 0) {
                for (let i = 0; i < level; i++) {
                    const levelData = branch.levels[i];
                    if (levelData) {
                        features.push(...levelData.compilerFeatures);
                    }
                }
            }
        });
        
        return features;
    }
}

// Initialize the new talent system
let newTalentSystem;
document.addEventListener('DOMContentLoaded', () => {
    newTalentSystem = new NewTalentSystem();
});