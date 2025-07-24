// File: js/modules/rework_talents.js
// New Talent System with Core and Specialization Categories

// Core Talents - Mandatory branches that represent fundamental and transversal competencies
const coreTalents = {
    "Sviluppo": {
        icon: "fas fa-code",
        description: "Competenze fondamentali nello sviluppo software e programmazione",
        color: "#3b82f6",
        mandatory: true,
        talents: {
            "Sviluppo LV1": {
                description: "Programmazione base e logica algoritmica",
                cost: 1,
                studyTime: 45,
                unlocks: [
                    "Riduce tempo di compilazione del 10%",
                    "Sblocca template di base",
                    "Abilita debug semplificato"
                ],
                effects: {
                    compilationTimeReduction: 0.1,
                    debuggingEfficiency: 0.15
                }
            },
            "Sviluppo LV2": {
                description: "Programmazione avanzata e ottimizzazione del codice",
                cost: 2,
                studyTime: 90,
                unlocks: [
                    "Riduce tempo di compilazione del 20%",
                    "Sblocca template intermedi",
                    "Abilita profiling del codice"
                ],
                effects: {
                    compilationTimeReduction: 0.2,
                    codeOptimization: 0.25
                }
            },
            "Sviluppo LV3": {
                description: "Architettura software e design patterns avanzati",
                cost: 3,
                studyTime: 180,
                unlocks: [
                    "Riduce tempo di compilazione del 30%",
                    "Sblocca template avanzati",
                    "Abilita modularità avanzata"
                ],
                effects: {
                    compilationTimeReduction: 0.3,
                    modularityBonus: 0.35
                }
            }
        }
    },
    "Networking": {
        icon: "fas fa-network-wired",
        description: "Competenze nelle reti, comunicazioni e protocolli",
        color: "#10b981",
        mandatory: true,
        talents: {
            "Networking LV1": {
                description: "Fondamenti di networking e protocolli TCP/IP",
                cost: 1,
                studyTime: 60,
                unlocks: [
                    "Sblocca nodi di rete base",
                    "Migliora efficienza comunicazioni C2",
                    "Abilita scanning di rete"
                ],
                effects: {
                    networkEfficiency: 0.15,
                    c2Reliability: 0.20
                }
            },
            "Networking LV2": {
                description: "Routing, switching e sicurezza di rete",
                cost: 2,
                studyTime: 120,
                unlocks: [
                    "Sblocca proxy chains",
                    "Migliora propagazione botnet",
                    "Abilita evasione firewall"
                ],
                effects: {
                    networkStealth: 0.25,
                    propagationSpeed: 0.30
                }
            },
            "Networking LV3": {
                description: "Protocolli avanzati e architetture di rete complesse",
                cost: 3,
                studyTime: 240,
                unlocks: [
                    "Sblocca reti P2P",
                    "Abilita tunneling avanzato",
                    "Implementa domain flux"
                ],
                effects: {
                    networkComplexity: 0.40,
                    tunnelingStealth: 0.35
                }
            }
        }
    },
    "Stealth": {
        icon: "fas fa-user-ninja",
        description: "Tecniche di occultamento, evasione e anonimato",
        color: "#8b5cf6",
        mandatory: true,
        talents: {
            "Stealth LV1": {
                description: "Tecniche base di occultamento e anonimizzazione",
                cost: 1,
                studyTime: 75,
                unlocks: [
                    "Migliora efficienza funzioni crittografiche del 15%",
                    "Sblocca obfuscation base",
                    "Riduce rilevabilità del 20%"
                ],
                effects: {
                    cryptographyEfficiency: 0.15,
                    detectionResistance: 0.20,
                    compilationStealth: 0.10
                }
            },
            "Stealth LV2": {
                description: "Evasione avanzata e anti-analisi",
                cost: 2,
                studyTime: 150,
                unlocks: [
                    "Migliora efficienza crittografia del 25%",
                    "Sblocca anti-debugging",
                    "Abilita code injection stealth"
                ],
                effects: {
                    cryptographyEfficiency: 0.25,
                    antiAnalysis: 0.30,
                    injectionStealth: 0.25
                }
            },
            "Stealth LV3": {
                description: "Stealth master e invisibilità totale",
                cost: 3,
                studyTime: 300,
                unlocks: [
                    "Migliora efficienza crittografia del 40%",
                    "Sblocca rootkit stealth",
                    "Abilita memory injection invisibile"
                ],
                effects: {
                    cryptographyEfficiency: 0.40,
                    rootkitStealth: 0.45,
                    memoryInvisibility: 0.50
                }
            }
        }
    },
    "Ingegneria Sociale": {
        icon: "fas fa-users",
        description: "Manipolazione psicologica e social engineering",
        color: "#f59e0b",
        mandatory: true,
        talents: {
            "Ingegneria Sociale LV1": {
                description: "Principi base di persuasione e manipolazione",
                cost: 1,
                studyTime: 90,
                unlocks: [
                    "Sblocca template phishing",
                    "Migliora successo campagne social",
                    "Abilita fake page creation"
                ],
                effects: {
                    phishingSuccess: 0.25,
                    socialManipulation: 0.20
                }
            },
            "Ingegneria Sociale LV2": {
                description: "Tecniche avanzate di social engineering",
                cost: 2,
                studyTime: 180,
                unlocks: [
                    "Sblocca spear phishing",
                    "Abilita vishing/smishing",
                    "Migliora targeting psicologico"
                ],
                effects: {
                    targetingAccuracy: 0.35,
                    manipulationEffectiveness: 0.30
                }
            },
            "Ingegneria Sociale LV3": {
                description: "Master manipolatore e psicologo sociale",
                cost: 3,
                studyTime: 360,
                unlocks: [
                    "Sblocca campagne multi-vector",
                    "Abilita deep fake integration",
                    "Implementa AI-powered social engineering"
                ],
                effects: {
                    multiVectorCampaigns: 0.50,
                    aiSocialEngineering: 0.45
                }
            }
        }
    }
};

// Specialization Talents - Vertical branches that unlock more complex and specific flow templates
const specializationTalents = {
    "Malware Avanzato": {
        icon: "fas fa-virus",
        description: "Specializzazione nella creazione di malware sofisticato",
        color: "#dc2626",
        requiredCore: ["Sviluppo LV2"],
        talents: {
            "Advanced Malware LV1": {
                description: "Tecniche avanzate di sviluppo malware",
                cost: 2,
                studyTime: 200,
                unlocks: [
                    "Sblocca template trojan avanzati",
                    "Abilita memory injection",
                    "Implementa polymorphic code"
                ],
                effects: {
                    malwareComplexity: 0.30,
                    evasionRate: 0.25
                }
            },
            "Advanced Malware LV2": {
                description: "Malware di nuova generazione e AI-assisted",
                cost: 3,
                studyTime: 400,
                unlocks: [
                    "Sblocca APT-style malware",
                    "Abilita AI-powered evolution",
                    "Implementa living-off-the-land techniques"
                ],
                effects: {
                    aptCapabilities: 0.50,
                    aiEvolution: 0.40
                }
            },
            "Advanced Malware LV3": {
                description: "Malware master - creazione di threat actors",
                cost: 4,
                studyTime: 600,
                unlocks: [
                    "Sblocca nation-state level malware",
                    "Abilita zero-day integration automatica",
                    "Implementa self-evolving malware ecosystem"
                ],
                effects: {
                    nationStateLevel: 0.70,
                    selfEvolution: 0.60
                }
            }
        }
    },
    "Crittografia Avanzata": {
        icon: "fas fa-key",
        description: "Specializzazione in crittografia e sicurezza dei dati",
        color: "#7c3aed",
        requiredCore: ["Stealth LV2"],
        talents: {
            "Advanced Cryptography LV1": {
                description: "Algoritmi crittografici avanzati e custom",
                cost: 2,
                studyTime: 180,
                unlocks: [
                    "Sblocca algoritmi custom",
                    "Abilita quantum-resistant encryption",
                    "Implementa steganografia avanzata"
                ],
                effects: {
                    encryptionStrength: 0.40,
                    quantumResistance: 0.30
                }
            },
            "Advanced Cryptography LV2": {
                description: "Crittografia post-quantistica e blockchain integration",
                cost: 3,
                studyTime: 360,
                unlocks: [
                    "Sblocca post-quantum algorithms",
                    "Abilita blockchain steganography",
                    "Implementa homomorphic encryption"
                ],
                effects: {
                    postQuantumSecurity: 0.60,
                    blockchainStealth: 0.45
                }
            }
        }
    },
    "Command & Control": {
        icon: "fas fa-satellite-dish",
        description: "Specializzazione in sistemi C2 e botnet management",
        color: "#059669",
        requiredCore: ["Networking LV2", "Sviluppo LV1"],
        talents: {
            "Advanced C2 LV1": {
                description: "Architetture C2 distribuite e resilienti",
                cost: 2,
                studyTime: 250,
                unlocks: [
                    "Sblocca P2P C2 networks",
                    "Abilita domain flux algorithms",
                    "Implementa decentralized command structure"
                ],
                effects: {
                    c2Resilience: 0.40,
                    decentralization: 0.35
                }
            },
            "Advanced C2 LV2": {
                description: "C2 di nuova generazione con AI e blockchain",
                cost: 3,
                studyTime: 400,
                unlocks: [
                    "Sblocca blockchain-based C2",
                    "Abilita AI-powered C2 management",
                    "Implementa adaptive communication protocols"
                ],
                effects: {
                    blockchainC2: 0.55,
                    aiManagement: 0.50
                }
            }
        }
    },
    "Reconnaissance Avanzata": {
        icon: "fas fa-search",
        description: "Specializzazione in intelligence gathering e OSINT",
        color: "#0891b2",
        requiredCore: ["Networking LV1", "Ingegneria Sociale LV1"],
        talents: {
            "Advanced OSINT LV1": {
                description: "Tecniche avanzate di Open Source Intelligence",
                cost: 2,
                studyTime: 150,
                unlocks: [
                    "Sblocca automated OSINT tools",
                    "Abilita social media mining",
                    "Implementa target profiling automatico"
                ],
                effects: {
                    osintEfficiency: 0.35,
                    profilingAccuracy: 0.30
                }
            },
            "Advanced OSINT LV2": {
                description: "Intelligence artificiale per reconnaissance",
                cost: 3,
                studyTime: 300,
                unlocks: [
                    "Sblocca AI-powered target analysis",
                    "Abilita predictive intelligence",
                    "Implementa deep web/dark web crawling"
                ],
                effects: {
                    aiAnalysis: 0.50,
                    predictiveIntel: 0.45
                }
            }
        }
    },
    "Anti-Forensics": {
        icon: "fas fa-eraser",
        description: "Specializzazione in evasione e cancellazione tracce",
        color: "#374151",
        requiredCore: ["Stealth LV1"],
        talents: {
            "Advanced Anti-Forensics LV1": {
                description: "Tecniche avanzate di cancellazione tracce",
                cost: 2,
                studyTime: 200,
                unlocks: [
                    "Sblocca secure data wiping",
                    "Abilita timeline manipulation",
                    "Implementa anti-memory forensics"
                ],
                effects: {
                    traceRemoval: 0.40,
                    memoryForensicsEvasion: 0.35
                }
            },
            "Advanced Anti-Forensics LV2": {
                description: "Ghost mode - invisibilità totale alle investigazioni",
                cost: 3,
                studyTime: 400,
                unlocks: [
                    "Sblocca quantum-secure deletion",
                    "Abilita reality distortion",
                    "Implementa false flag generation"
                ],
                effects: {
                    quantumSecureDeletion: 0.60,
                    falseFlagGeneration: 0.50
                }
            }
        }
    },
    "Compilazione Avanzata": {
        icon: "fas fa-cogs",
        description: "Specializzazione in tecniche di compilazione e optimizazione",
        color: "#9333ea",
        requiredCore: ["Sviluppo LV2"],
        talents: {
            "Compiler Technology LV1": {
                description: "Tecniche avanzate di compilazione e ottimizzazione",
                cost: 2,
                studyTime: 180,
                unlocks: [
                    "Sblocca just-in-time compilation",
                    "Abilita runtime code generation",
                    "Implementa dynamic optimization"
                ],
                effects: {
                    compilationSpeed: 0.25,
                    runtimeOptimization: 0.30
                }
            },
            "Compiler Technology LV2": {
                description: "Compilatori di nuova generazione con AI",
                cost: 3,
                studyTime: 360,
                unlocks: [
                    "Sblocca AI-assisted compilation",
                    "Abilita predictive optimization",
                    "Implementa self-modifying code generation"
                ],
                effects: {
                    aiCompilation: 0.45,
                    selfModifyingCode: 0.40
                }
            }
        }
    }
};

let activeReworkTalentBranch = null;

function initReworkTalents() {
    console.log('Initializing Rework Talent System...');
    
    // Initialize state if not exists
    if (!state.reworkTalents) {
        state.reworkTalents = {
            unlockedCore: {},
            unlockedSpecialization: {},
            studyingCore: {},
            studyingSpecialization: {},
            completedResearch: []
        };
    }
    
    renderReworkTalents();
}

function renderReworkTalents() {
    const container = document.getElementById('rework-talents-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="rework-talents-panel">
            <div class="talents-header">
                <h2 class="text-2xl font-bold text-white mb-4">
                    <i class="fas fa-graduation-cap text-purple-400 mr-3"></i>
                    Sistema Talenti v2.0
                </h2>
                <div class="talents-stats">
                    <div class="stat-item">
                        <span class="text-gray-400">Punti Talento:</span>
                        <span class="text-white font-bold">${state.talentPoints}</span>
                    </div>
                    <div class="stat-item">
                        <span class="text-gray-400">Talenti Core:</span>
                        <span class="text-white font-bold">${getTotalUnlockedCore()}/12</span>
                    </div>
                    <div class="stat-item">
                        <span class="text-gray-400">Specializzazioni:</span>
                        <span class="text-white font-bold">${getTotalUnlockedSpecialization()}</span>
                    </div>
                </div>
            </div>
            
            <div class="talents-content">
                <div class="talents-sidebar">
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">
                            <i class="fas fa-star text-yellow-400 mr-2"></i>
                            Talenti Core
                        </h3>
                        <p class="sidebar-description">
                            Competenze fondamentali e trasversali obbligatorie per tutti gli hacker.
                        </p>
                        <div class="sidebar-branches">
                            ${renderCoreTalentsBranches()}
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">
                            <i class="fas fa-rocket text-blue-400 mr-2"></i>
                            Specializzazioni
                        </h3>
                        <p class="sidebar-description">
                            Rami verticali che sbloccano template di flussi complessi e specifici.
                        </p>
                        <div class="sidebar-branches">
                            ${renderSpecializationBranches()}
                        </div>
                    </div>
                </div>
                
                <div class="talents-main">
                    <div id="talent-tree-display">
                        ${activeReworkTalentBranch ? renderTalentBranchDetails() : renderTalentOverview()}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    addReworkTalentsEventListeners();
}

function renderCoreTalentsBranches() {
    return Object.entries(coreTalents).map(([branchName, branch]) => {
        const totalTalents = Object.keys(branch.talents).length;
        const unlockedTalents = Object.keys(branch.talents).filter(talentName => 
            state.reworkTalents.unlockedCore[talentName] > 0
        ).length;
        const isActive = activeReworkTalentBranch === branchName;
        
        return `
            <div class="branch-item core ${isActive ? 'active' : ''}" 
                 data-branch="${branchName}" data-type="core">
                <div class="branch-icon" style="color: ${branch.color}">
                    <i class="${branch.icon}"></i>
                </div>
                <div class="branch-info">
                    <div class="branch-name">${branchName}</div>
                    <div class="branch-progress">
                        <span class="progress-text">${unlockedTalents}/${totalTalents}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(unlockedTalents / totalTalents) * 100}%; background-color: ${branch.color}"></div>
                        </div>
                    </div>
                </div>
                <div class="branch-status">
                    ${branch.mandatory ? '<i class="fas fa-exclamation-circle text-yellow-400" title="Obbligatorio"></i>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderSpecializationBranches() {
    return Object.entries(specializationTalents).map(([branchName, branch]) => {
        const totalTalents = Object.keys(branch.talents).length;
        const unlockedTalents = Object.keys(branch.talents).filter(talentName => 
            state.reworkTalents.unlockedSpecialization[talentName] > 0
        ).length;
        const isActive = activeReworkTalentBranch === branchName;
        const isUnlocked = checkSpecializationRequirements(branch);
        
        return `
            <div class="branch-item specialization ${isActive ? 'active' : ''} ${isUnlocked ? '' : 'locked'}" 
                 data-branch="${branchName}" data-type="specialization">
                <div class="branch-icon" style="color: ${isUnlocked ? branch.color : '#6b7280'}">
                    <i class="${branch.icon}"></i>
                    ${!isUnlocked ? '<i class="fas fa-lock lock-overlay"></i>' : ''}
                </div>
                <div class="branch-info">
                    <div class="branch-name">${branchName}</div>
                    <div class="branch-progress">
                        <span class="progress-text">${unlockedTalents}/${totalTalents}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(unlockedTalents / totalTalents) * 100}%; background-color: ${isUnlocked ? branch.color : '#6b7280'}"></div>
                        </div>
                    </div>
                    ${!isUnlocked ? `
                        <div class="branch-requirements">
                            Richiede: ${branch.requiredCore.join(', ')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderTalentBranchDetails() {
    const isCore = Object.keys(coreTalents).includes(activeReworkTalentBranch);
    const branch = isCore ? coreTalents[activeReworkTalentBranch] : specializationTalents[activeReworkTalentBranch];
    const talentCollection = isCore ? state.reworkTalents.unlockedCore : state.reworkTalents.unlockedSpecialization;
    const studyingCollection = isCore ? state.reworkTalents.studyingCore : state.reworkTalents.studyingSpecialization;
    
    return `
        <div class="talent-branch-details">
            <div class="branch-header">
                <button class="back-button" onclick="setActiveReworkTalentBranch(null)">
                    <i class="fas fa-arrow-left"></i> Indietro
                </button>
                <div class="branch-title">
                    <div class="branch-icon-large" style="color: ${branch.color}">
                        <i class="${branch.icon}"></i>
                    </div>
                    <div class="branch-info">
                        <h3 class="text-xl font-bold text-white">${activeReworkTalentBranch}</h3>
                        <p class="text-gray-400">${branch.description}</p>
                        ${!isCore && branch.requiredCore ? `
                            <div class="requirements">
                                <span class="text-yellow-400">Prerequisiti:</span> ${branch.requiredCore.join(', ')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="talents-grid">
                ${Object.entries(branch.talents).map(([talentName, talent]) => 
                    renderReworkTalentCard(talentName, talent, talentCollection, studyingCollection, isCore)
                ).join('')}
            </div>
        </div>
    `;
}

function renderReworkTalentCard(talentName, talent, talentCollection, studyingCollection, isCore) {
    const unlockedLevel = talentCollection[talentName] || 0;
    const isStudying = studyingCollection[talentName];
    const canStudy = canStudyReworkTalent(talentName, talent, isCore);
    const maxLevel = 1; // Each talent is just one level in the new system
    
    return `
        <div class="rework-talent-card ${unlockedLevel > 0 ? 'unlocked' : canStudy ? 'available' : 'locked'}">
            <div class="talent-header">
                <h4 class="talent-name">${talentName}</h4>
                <div class="talent-cost">
                    <i class="fas fa-star text-yellow-400"></i>
                    <span>${talent.cost}</span>
                </div>
            </div>
            
            <div class="talent-description">
                <p>${talent.description}</p>
            </div>
            
            <div class="talent-unlocks">
                <h5 class="unlocks-title">Sblocca:</h5>
                <ul class="unlocks-list">
                    ${talent.unlocks.map(unlock => `<li>${unlock}</li>`).join('')}
                </ul>
            </div>
            
            ${talent.effects ? `
                <div class="talent-effects">
                    <h5 class="effects-title">Effetti:</h5>
                    <div class="effects-list">
                        ${Object.entries(talent.effects).map(([effect, value]) => 
                            `<div class="effect-item">
                                <span class="effect-name">${formatEffectName(effect)}:</span>
                                <span class="effect-value">+${Math.round(value * 100)}%</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="talent-action">
                ${isStudying ? `
                    <div class="studying-indicator">
                        <i class="fas fa-spinner fa-spin text-yellow-400"></i>
                        <span class="text-yellow-400">In Studio...</span>
                        <div class="progress-bar-container">
                            <div id="progress-${talentName.replace(/\s/g, '')}" class="progress-bar"></div>
                        </div>
                    </div>
                ` : unlockedLevel > 0 ? `
                    <div class="unlocked-indicator">
                        <i class="fas fa-check-circle text-green-400"></i>
                        <span class="text-green-400">Sbloccato</span>
                    </div>
                ` : `
                    <button class="study-button ${canStudy ? '' : 'disabled'}" 
                            onclick="studyReworkTalent('${talentName}', ${isCore})"
                            ${canStudy ? '' : 'disabled'}>
                        <i class="fas fa-book"></i>
                        Studia (${talent.studyTime}s)
                    </button>
                `}
            </div>
        </div>
    `;
}

function renderTalentOverview() {
    return `
        <div class="talent-overview">
            <div class="overview-header">
                <h3 class="text-xl font-bold text-white mb-4">Panoramica del Sistema Talenti</h3>
                <p class="text-gray-400 mb-6">
                    Il nuovo sistema talenti è diviso in due categorie principali che rappresentano 
                    diverse filosofie di apprendimento e specializzazione.
                </p>
            </div>
            
            <div class="overview-sections">
                <div class="overview-section core">
                    <div class="section-header">
                        <i class="fas fa-star text-yellow-400 text-2xl"></i>
                        <h4 class="text-lg font-semibold text-white">Talenti Core</h4>
                    </div>
                    <div class="section-content">
                        <p class="text-gray-400 mb-4">
                            Competenze fondamentali e trasversali obbligatorie per tutti gli hacker. 
                            Questi talenti rappresentano le basi indispensabili per operazioni avanzate.
                        </p>
                        <div class="core-benefits">
                            <div class="benefit-item">
                                <i class="fas fa-clock text-blue-400"></i>
                                <span>Riducono i tempi di compilazione</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-shield-alt text-green-400"></i>
                                <span>Migliorano l'efficienza operativa</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-unlock text-purple-400"></i>
                                <span>Sbloccano funzionalità di base</span>
                            </div>
                        </div>
                        <div class="section-progress">
                            <div class="progress-label">Progresso Core: ${getTotalUnlockedCore()}/12</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(getTotalUnlockedCore() / 12) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="overview-section specialization">
                    <div class="section-header">
                        <i class="fas fa-rocket text-blue-400 text-2xl"></i>
                        <h4 class="text-lg font-semibold text-white">Talenti di Specializzazione</h4>
                    </div>
                    <div class="section-content">
                        <p class="text-gray-400 mb-4">
                            Rami verticali che sbloccano template di flussi più complessi e specifici. 
                            Permettono di specializzarsi in aree specifiche dell'hacking.
                        </p>
                        <div class="specialization-areas">
                            ${Object.entries(specializationTalents).map(([name, branch]) => `
                                <div class="specialization-item">
                                    <i class="${branch.icon}" style="color: ${branch.color}"></i>
                                    <span>${name}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="section-progress">
                            <div class="progress-label">Specializzazioni Attive: ${getActiveSpecializations()}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="overview-tips">
                <h4 class="text-lg font-semibold text-white mb-3">
                    <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
                    Consigli per la Progressione
                </h4>
                <div class="tips-grid">
                    <div class="tip-item">
                        <i class="fas fa-arrow-up text-green-400"></i>
                        <div>
                            <h5>Priorità ai Core</h5>
                            <p>Sviluppa prima i talenti core per sbloccare le specializzazioni</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-balance-scale text-blue-400"></i>
                        <div>
                            <h5>Bilanciamento</h5>
                            <p>Mantieni un equilibrio tra i diversi rami core per massimizzare l'efficacia</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-target text-purple-400"></i>
                        <div>
                            <h5>Specializzazione Mirata</h5>
                            <p>Scegli specializzazioni che si complementano con il tuo stile di gioco</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function getTotalUnlockedCore() {
    return Object.values(state.reworkTalents.unlockedCore).filter(level => level > 0).length;
}

function getTotalUnlockedSpecialization() {
    return Object.values(state.reworkTalents.unlockedSpecialization).filter(level => level > 0).length;
}

function getActiveSpecializations() {
    const activeSpecs = new Set();
    Object.keys(state.reworkTalents.unlockedSpecialization).forEach(talentName => {
        if (state.reworkTalents.unlockedSpecialization[talentName] > 0) {
            // Find which specialization this talent belongs to
            Object.keys(specializationTalents).forEach(specName => {
                if (specializationTalents[specName].talents[talentName]) {
                    activeSpecs.add(specName);
                }
            });
        }
    });
    return activeSpecs.size;
}

function checkSpecializationRequirements(branch) {
    if (!branch.requiredCore) return true;
    
    return branch.requiredCore.every(requirement => {
        return state.reworkTalents.unlockedCore[requirement] > 0;
    });
}

function canStudyReworkTalent(talentName, talent, isCore) {
    // Check if already unlocked
    const collection = isCore ? state.reworkTalents.unlockedCore : state.reworkTalents.unlockedSpecialization;
    if (collection[talentName] > 0) return false;
    
    // Check if currently studying
    const studyingCollection = isCore ? state.reworkTalents.studyingCore : state.reworkTalents.studyingSpecialization;
    if (studyingCollection[talentName]) return false;
    
    // Check talent points
    if (state.talentPoints < talent.cost) return false;
    
    // For specialization talents, check core requirements
    if (!isCore) {
        const branch = Object.values(specializationTalents).find(b => b.talents[talentName]);
        if (branch && !checkSpecializationRequirements(branch)) return false;
    }
    
    return true;
}

function formatEffectName(effectKey) {
    const effectNames = {
        compilationTimeReduction: 'Riduzione Tempo Compilazione',
        debuggingEfficiency: 'Efficienza Debugging',
        codeOptimization: 'Ottimizzazione Codice',
        modularityBonus: 'Bonus Modularità',
        networkEfficiency: 'Efficienza Rete',
        c2Reliability: 'Affidabilità C2',
        networkStealth: 'Stealth Rete',
        propagationSpeed: 'Velocità Propagazione',
        networkComplexity: 'Complessità Rete',
        tunnelingStealth: 'Stealth Tunneling',
        cryptographyEfficiency: 'Efficienza Crittografia',
        detectionResistance: 'Resistenza Rilevazione',
        compilationStealth: 'Stealth Compilazione',
        antiAnalysis: 'Anti-Analisi',
        injectionStealth: 'Stealth Injection',
        rootkitStealth: 'Stealth Rootkit',
        memoryInvisibility: 'Invisibilità Memoria',
        phishingSuccess: 'Successo Phishing',
        socialManipulation: 'Manipolazione Sociale',
        targetingAccuracy: 'Precisione Targeting',
        manipulationEffectiveness: 'Efficacia Manipolazione',
        multiVectorCampaigns: 'Campagne Multi-Vector',
        aiSocialEngineering: 'Social Engineering AI'
    };
    
    return effectNames[effectKey] || effectKey;
}

// Event handlers
function setActiveReworkTalentBranch(branchName) {
    activeReworkTalentBranch = branchName;
    renderReworkTalents();
}

function studyReworkTalent(talentName, isCore) {
    const talents = isCore ? coreTalents : specializationTalents;
    const collection = isCore ? state.reworkTalents.unlockedCore : state.reworkTalents.unlockedSpecialization;
    const studyingCollection = isCore ? state.reworkTalents.studyingCore : state.reworkTalents.studyingSpecialization;
    
    // Find the talent
    let talent = null;
    let branchName = null;
    
    Object.entries(talents).forEach(([branch, branchData]) => {
        if (branchData.talents[talentName]) {
            talent = branchData.talents[talentName];
            branchName = branch;
        }
    });
    
    if (!talent || !canStudyReworkTalent(talentName, talent, isCore)) return;
    
    // Deduct talent points
    state.talentPoints -= talent.cost;
    
    // Start studying
    studyingCollection[talentName] = {
        startTime: Date.now(),
        duration: talent.studyTime * 1000, // Convert to milliseconds
        branchName: branchName
    };
    
    // Apply talent modifiers to study time
    const totalStudyModifier = state.hardwareBonuses?.studyTimeModifier || 1.0;
    const finalStudyTime = Math.round(talent.studyTime * totalStudyModifier);
    studyingCollection[talentName].duration = finalStudyTime * 1000;
    
    saveState();
    
    // Start the study process
    startReworkTalentStudy(talentName, isCore);
    
    showNotification(`Iniziato studio di ${talentName} (${finalStudyTime}s)`, 'info');
    renderReworkTalents();
}

function startReworkTalentStudy(talentName, isCore) {
    const studyingCollection = isCore ? state.reworkTalents.studyingCore : state.reworkTalents.studyingSpecialization;
    const studyData = studyingCollection[talentName];
    
    const updateInterval = setInterval(() => {
        const elapsed = Date.now() - studyData.startTime;
        const progress = Math.min(100, (elapsed / studyData.duration) * 100);
        
        // Update progress bar if visible
        const progressElement = document.getElementById(`progress-${talentName.replace(/\s/g, '')}`);
        if (progressElement) {
            progressElement.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(updateInterval);
            completeReworkTalentStudy(talentName, isCore);
        }
    }, 1000);
}

function completeReworkTalentStudy(talentName, isCore) {
    const collection = isCore ? state.reworkTalents.unlockedCore : state.reworkTalents.unlockedSpecialization;
    const studyingCollection = isCore ? state.reworkTalents.studyingCore : state.reworkTalents.studyingSpecialization;
    
    // Complete the talent
    collection[talentName] = 1;
    delete studyingCollection[talentName];
    
    // Add to completed research
    state.reworkTalents.completedResearch.push({
        talentName: talentName,
        isCore: isCore,
        completedAt: Date.now()
    });
    
    // Award XP
    const xpGained = isCore ? 50 : 100;
    state.experience += xpGained;
    
    saveState();
    updateUI();
    renderReworkTalents();
    
    showNotification(`${talentName} completato! +${xpGained} XP`, 'success');
}

function addReworkTalentsEventListeners() {
    // Branch item click events
    document.querySelectorAll('.branch-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!item.classList.contains('locked')) {
                const branchName = item.dataset.branch;
                setActiveReworkTalentBranch(branchName);
            }
        });
    });
}

// Export functions for global access
window.initReworkTalents = initReworkTalents;
window.setActiveReworkTalentBranch = setActiveReworkTalentBranch;
window.studyReworkTalent = studyReworkTalent;