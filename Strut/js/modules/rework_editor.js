// File: js/modules/rework_editor.js
// New Template-Based Editor System with Fixed Flow Interconnections

// Tool templates with predefined flows and fixed interconnections
const toolTemplates = {
    'ransomware': {
        name: 'Ransomware',
        description: 'Template per la creazione di ransomware con nodi di crittografia, payload e distribuzione',
        nodes: [
            {
                id: 'entry',
                type: 'entry',
                name: 'Target Entry',
                position: { x: 100, y: 100 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Target Singolo', description: 'Colpisce un singolo target' },
                    2: { name: 'Target Multipli', description: 'Colpisce più target simultaneamente', requires: ['Networking LV2'] },
                    3: { name: 'Scan Automatico', description: 'Identifica automaticamente target vulnerabili', requires: ['Reconnaissance LV3'] }
                }
            },
            {
                id: 'payload',
                type: 'encryption',
                name: 'Encryption Engine',
                position: { x: 300, y: 100 },
                level: 1,
                maxLevel: 4,
                upgrades: {
                    1: { name: 'AES-128', description: 'Crittografia base AES-128' },
                    2: { name: 'AES-256', description: 'Crittografia avanzata AES-256', requires: ['Cryptography LV2'] },
                    3: { name: 'Multi-Layer', description: 'Crittografia a più livelli', requires: ['Cryptography LV3'] },
                    4: { name: 'Quantum-Resistant', description: 'Resistente agli attacchi quantistici', requires: ['Cryptography LV4', 'Research LV2'] }
                }
            },
            {
                id: 'distribution',
                type: 'delivery',
                name: 'Distribution Module',
                position: { x: 500, y: 100 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Email Phishing', description: 'Distribuzione tramite email di phishing' },
                    2: { name: 'Network Worm', description: 'Distribuzione automatica via rete', requires: ['Malware Development LV2'] },
                    3: { name: 'Multi-Vector', description: 'Distribuzione su più vettori', requires: ['Social Engineering LV3', 'Network Security LV2'] }
                }
            },
            {
                id: 'persistence',
                type: 'persistence',
                name: 'Persistence Module',
                position: { x: 300, y: 250 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Registry Entry', description: 'Persistenza tramite registro di sistema' },
                    2: { name: 'Service Creation', description: 'Crea servizio di sistema', requires: ['System Administration LV2'] },
                    3: { name: 'Rootkit Integration', description: 'Integrazione con rootkit', requires: ['Stealth LV3'] }
                }
            },
            {
                id: 'compiler',
                type: 'compiler',
                name: 'Compiler',
                position: { x: 700, y: 175 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Basic Compilation', description: 'Compilazione base del ransomware' },
                    2: { name: 'Code Obfuscation', description: 'Offuscamento del codice', requires: ['Stealth LV2'] },
                    3: { name: 'Anti-Analysis', description: 'Tecniche anti-analisi', requires: ['Anti-Forensics LV2'] }
                }
            }
        ],
        connections: [
            { from: 'entry', to: 'payload' },
            { from: 'payload', to: 'distribution' },
            { from: 'payload', to: 'persistence' },
            { from: 'distribution', to: 'compiler' },
            { from: 'persistence', to: 'compiler' }
        ],
        requiredTalents: ['Malware Development LV1', 'Cryptography LV1']
    },
    'keylogger': {
        name: 'Keylogger',
        description: 'Template per la creazione di keylogger con moduli di cattura, stealth e trasmissione',
        nodes: [
            {
                id: 'entry',
                type: 'entry',
                name: 'Target Entry',
                position: { x: 100, y: 100 },
                level: 1,
                maxLevel: 2,
                upgrades: {
                    1: { name: 'Local Target', description: 'Target locale singolo' },
                    2: { name: 'Remote Target', description: 'Target remoto via rete', requires: ['Networking LV2'] }
                }
            },
            {
                id: 'capture',
                type: 'capture',
                name: 'Keystroke Capture',
                position: { x: 300, y: 100 },
                level: 1,
                maxLevel: 4,
                upgrades: {
                    1: { name: 'Basic Keylogging', description: 'Cattura tasti base' },
                    2: { name: 'Form Detection', description: 'Rileva form e password', requires: ['Web Security LV1'] },
                    3: { name: 'Screenshot Capture', description: 'Cattura screenshot periodici', requires: ['System Access LV2'] },
                    4: { name: 'Audio Capture', description: 'Registrazione audio ambiente', requires: ['Hardware Access LV2'] }
                }
            },
            {
                id: 'stealth',
                type: 'stealth',
                name: 'Stealth Module',
                position: { x: 300, y: 250 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Process Hiding', description: 'Nasconde il processo' },
                    2: { name: 'File Hiding', description: 'Nasconde i file di log', requires: ['Stealth LV2'] },
                    3: { name: 'Memory Injection', description: 'Injection in memoria', requires: ['Advanced Malware LV1'] }
                }
            },
            {
                id: 'transmission',
                type: 'exfiltration',
                name: 'Data Transmission',
                position: { x: 500, y: 100 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'HTTP POST', description: 'Trasmissione via HTTP POST' },
                    2: { name: 'Encrypted Channel', description: 'Canale crittografato', requires: ['Cryptography LV1'] },
                    3: { name: 'Covert Channel', description: 'Canale nascosto', requires: ['Stealth LV3', 'Networking LV3'] }
                }
            },
            {
                id: 'compiler',
                type: 'compiler',
                name: 'Compiler',
                position: { x: 700, y: 175 },
                level: 1,
                maxLevel: 2,
                upgrades: {
                    1: { name: 'Basic Compilation', description: 'Compilazione base del keylogger' },
                    2: { name: 'Polymorphic Code', description: 'Codice polimorfico', requires: ['Anti-Detection LV2'] }
                }
            }
        ],
        connections: [
            { from: 'entry', to: 'capture' },
            { from: 'entry', to: 'stealth' },
            { from: 'capture', to: 'transmission' },
            { from: 'stealth', to: 'compiler' },
            { from: 'transmission', to: 'compiler' }
        ],
        requiredTalents: ['Malware Development LV1', 'System Access LV1']
    },
    'botnet_agent': {
        name: 'Botnet Agent',
        description: 'Template per la creazione di agenti botnet con moduli C2, propagazione e payload',
        nodes: [
            {
                id: 'entry',
                type: 'entry',
                name: 'Infection Vector',
                position: { x: 100, y: 100 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Email Attachment', description: 'Infezione tramite allegato email' },
                    2: { name: 'Drive-by Download', description: 'Infezione tramite siti web', requires: ['Web Exploitation LV2'] },
                    3: { name: 'Network Exploit', description: 'Sfrutta vulnerabilità di rete', requires: ['Network Security LV3'] }
                }
            },
            {
                id: 'c2',
                type: 'command_control',
                name: 'C2 Communication',
                position: { x: 300, y: 100 },
                level: 1,
                maxLevel: 4,
                upgrades: {
                    1: { name: 'Direct Connection', description: 'Connessione diretta al C2' },
                    2: { name: 'Proxy Chain', description: 'Catena di proxy', requires: ['Anonymity LV2'] },
                    3: { name: 'P2P Network', description: 'Rete peer-to-peer', requires: ['Networking LV3'] },
                    4: { name: 'Domain Flux', description: 'Algoritmo domain flux', requires: ['Cryptography LV2', 'Advanced C2 LV1'] }
                }
            },
            {
                id: 'propagation',
                type: 'propagation',
                name: 'Propagation Module',
                position: { x: 300, y: 250 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Local Network', description: 'Propagazione rete locale' },
                    2: { name: 'USB Spreading', description: 'Propagazione via USB', requires: ['Hardware Access LV1'] },
                    3: { name: 'Cross-Platform', description: 'Propagazione multi-piattaforma', requires: ['Multi-Platform Dev LV2'] }
                }
            },
            {
                id: 'payload',
                type: 'payload',
                name: 'Payload Module',
                position: { x: 500, y: 100 },
                level: 1,
                maxLevel: 4,
                upgrades: {
                    1: { name: 'Basic Commands', description: 'Comandi base di sistema' },
                    2: { name: 'File Operations', description: 'Operazioni su file', requires: ['System Administration LV1'] },
                    3: { name: 'Network Operations', description: 'Operazioni di rete', requires: ['Networking LV2'] },
                    4: { name: 'Advanced Modules', description: 'Moduli avanzati personalizzati', requires: ['Advanced Malware LV2'] }
                }
            },
            {
                id: 'compiler',
                type: 'compiler',
                name: 'Compiler',
                position: { x: 700, y: 175 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Basic Compilation', description: 'Compilazione base dell\'agente' },
                    2: { name: 'Runtime Packing', description: 'Packing runtime', requires: ['Packing LV1'] },
                    3: { name: 'VM Evasion', description: 'Evasione macchine virtuali', requires: ['Anti-Analysis LV3'] }
                }
            }
        ],
        connections: [
            { from: 'entry', to: 'c2' },
            { from: 'entry', to: 'propagation' },
            { from: 'c2', to: 'payload' },
            { from: 'propagation', to: 'payload' },
            { from: 'payload', to: 'compiler' }
        ],
        requiredTalents: ['Malware Development LV2', 'Networking LV1', 'Command & Control LV1']
    }
};

// Modifier nodes that can be applied to any template
const modifierNodes = {
    'obfuscator': {
        name: 'Code Obfuscator',
        description: 'Offusca il codice per evitare la rilevazione',
        type: 'modifier',
        applicableTo: ['compiler'],
        requiredTalents: ['Stealth LV2'],
        compilationTimeMultiplier: 1.5,
        upgrades: {
            1: { name: 'String Obfuscation', description: 'Offuscamento stringhe' },
            2: { name: 'Control Flow', description: 'Offuscamento flusso di controllo', requires: ['Advanced Stealth LV1'] },
            3: { name: 'Anti-Disassembly', description: 'Tecniche anti-disassemblaggio', requires: ['Anti-Forensics LV2'] }
        }
    },
    'crypter': {
        name: 'Crypter',
        description: 'Crittografa il payload finale',
        type: 'modifier',
        applicableTo: ['compiler'],
        requiredTalents: ['Cryptography LV2'],
        compilationTimeMultiplier: 2.0,
        upgrades: {
            1: { name: 'XOR Encryption', description: 'Crittografia XOR semplice' },
            2: { name: 'AES Encryption', description: 'Crittografia AES avanzata', requires: ['Cryptography LV3'] },
            3: { name: 'Custom Algorithm', description: 'Algoritmo crittografico personalizzato', requires: ['Cryptography LV4'] }
        }
    },
    'self_delete': {
        name: 'Self-Delete',
        description: 'Auto-eliminazione dopo l\'esecuzione',
        type: 'modifier',
        applicableTo: ['any'],
        requiredTalents: ['Anti-Forensics LV1'],
        compilationTimeMultiplier: 1.2,
        upgrades: {
            1: { name: 'Simple Delete', description: 'Eliminazione semplice del file' },
            2: { name: 'Secure Wipe', description: 'Sovrascrittura sicura', requires: ['Anti-Forensics LV2'] },
            3: { name: 'Memory Cleanup', description: 'Pulizia memoria completa', requires: ['Advanced Anti-Forensics LV1'] }
        }
    }
};

// Compiler options unlockable through talents
const compilerOptions = {
    'code_encryption': {
        name: 'Code Encryption',
        description: 'Crittografa sezioni del codice',
        requiredTalents: ['Cryptography LV2', 'Compiler Technology LV1'],
        compilationTimeMultiplier: 1.8,
        effectivenessBonus: 0.15
    },
    'code_injection': {
        name: 'Code Injection',
        description: 'Inietta codice in processi legittimi',
        requiredTalents: ['Advanced Malware LV2', 'System Internals LV2'],
        compilationTimeMultiplier: 2.5,
        stealthBonus: 0.25
    },
    'anti_debugging': {
        name: 'Anti-Debugging',
        description: 'Tecniche anti-debugging avanzate',
        requiredTalents: ['Anti-Analysis LV3', 'Reverse Engineering LV2'],
        compilationTimeMultiplier: 2.0,
        analysisResistance: 0.30
    },
    'polymorphic_engine': {
        name: 'Polymorphic Engine',
        description: 'Motore polimorfico per evitare signature detection',
        requiredTalents: ['Advanced Malware LV3', 'Cryptography LV3'],
        compilationTimeMultiplier: 3.0,
        signatureEvasion: 0.40
    }
};

let currentTemplate = null;
let selectedNodeId = null;
let compilationQueue = [];

function initReworkEditor() {
    console.log('Initializing Rework Editor...');
    
    // Initialize state if not exists
    if (!state.reworkEditor) {
        state.reworkEditor = {
            availableTemplates: Object.keys(toolTemplates),
            activeTemplate: null,
            nodeUpgrades: {},
            compilationHistory: [],
            unlockedOptions: []
        };
    }
    
    renderReworkEditor();
}

function renderReworkEditor() {
    const container = document.getElementById('rework-editor-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="rework-editor-panel">
            <div class="editor-header">
                <h2 class="text-2xl font-bold text-white mb-4">
                    <i class="fas fa-code text-purple-400 mr-3"></i>
                    Advanced Tool Editor v2.0
                </h2>
                <div class="editor-stats">
                    <div class="stat-item">
                        <span class="text-gray-400">Templates Disponibili:</span>
                        <span class="text-white font-bold">${state.reworkEditor.availableTemplates.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="text-gray-400">Tool Compilati:</span>
                        <span class="text-white font-bold">${state.reworkEditor.compilationHistory.length}</span>
                    </div>
                </div>
            </div>
            
            <div class="editor-content">
                <div class="template-selector">
                    <h3 class="text-lg font-semibold text-white mb-3">Seleziona Template</h3>
                    <div class="template-grid">
                        ${renderTemplateCards()}
                    </div>
                </div>
                
                <div id="template-editor" class="template-editor ${currentTemplate ? 'active' : ''}">
                    ${currentTemplate ? renderTemplateEditor() : ''}
                </div>
                
                <div id="compilation-panel" class="compilation-panel">
                    ${renderCompilationPanel()}
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    addReworkEditorEventListeners();
}

function renderTemplateCards() {
    return Object.entries(toolTemplates).map(([key, template]) => {
        const isAvailable = checkTemplateRequirements(template);
        const isActive = currentTemplate === key;
        
        return `
            <div class="template-card ${isActive ? 'active' : ''} ${isAvailable ? '' : 'locked'}" 
                 data-template="${key}">
                <div class="template-icon">
                    <i class="fas ${getTemplateIcon(key)}"></i>
                </div>
                <div class="template-info">
                    <h4 class="template-name">${template.name}</h4>
                    <p class="template-description">${template.description}</p>
                    <div class="template-requirements">
                        ${template.requiredTalents.map(talent => 
                            `<span class="requirement ${checkTalentRequirement(talent) ? 'met' : 'unmet'}">${talent}</span>`
                        ).join('')}
                    </div>
                </div>
                ${isAvailable ? 
                    `<button class="template-select-btn" onclick="selectTemplate('${key}')">
                        <i class="fas fa-play"></i> ${isActive ? 'Attivo' : 'Seleziona'}
                    </button>` :
                    `<div class="template-locked">
                        <i class="fas fa-lock"></i> Bloccato
                    </div>`
                }
            </div>
        `;
    }).join('');
}

function renderTemplateEditor() {
    if (!currentTemplate) return '';
    
    const template = toolTemplates[currentTemplate];
    
    return `
        <div class="template-editor-content">
            <div class="editor-toolbar">
                <h3 class="text-lg font-semibold text-white">
                    <i class="fas ${getTemplateIcon(currentTemplate)} mr-2"></i>
                    ${template.name} Editor
                </h3>
                <div class="toolbar-actions">
                    <button class="btn-secondary" onclick="resetTemplate()">
                        <i class="fas fa-undo"></i> Reset
                    </button>
                    <button class="btn-primary" onclick="compileTemplate()">
                        <i class="fas fa-hammer"></i> Compila
                    </button>
                </div>
            </div>
            
            <div class="template-canvas">
                <div class="canvas-grid">
                    ${renderTemplateNodes()}
                    ${renderTemplateConnections()}
                </div>
            </div>
            
            <div class="node-inspector" id="node-inspector">
                ${selectedNodeId ? renderNodeInspector() : '<p class="text-gray-400">Seleziona un nodo per visualizzarne i dettagli</p>'}
            </div>
        </div>
    `;
}

function renderTemplateNodes() {
    const template = toolTemplates[currentTemplate];
    
    return template.nodes.map(node => {
        const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
        const isSelected = selectedNodeId === node.id;
        
        return `
            <div class="template-node ${node.type} ${isSelected ? 'selected' : ''}" 
                 data-node-id="${node.id}"
                 style="left: ${node.position.x}px; top: ${node.position.y}px;">
                <div class="node-header">
                    <span class="node-name">${node.name}</span>
                    <span class="node-level">LV${currentLevel}</span>
                </div>
                <div class="node-body">
                    <div class="node-upgrade-indicator">
                        <div class="upgrade-progress" style="width: ${(currentLevel / node.maxLevel) * 100}%"></div>
                    </div>
                    <div class="node-actions">
                        <button class="node-upgrade-btn" onclick="showNodeUpgradeMenu('${node.id}')" 
                                ${currentLevel >= node.maxLevel ? 'disabled' : ''}>
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="node-info-btn" onclick="selectNode('${node.id}')">
                            <i class="fas fa-info"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTemplateConnections() {
    const template = toolTemplates[currentTemplate];
    
    return template.connections.map((conn, index) => {
        return `
            <div class="template-connection" 
                 data-connection="${index}"
                 data-from="${conn.from}" 
                 data-to="${conn.to}">
            </div>
        `;
    }).join('');
}

function renderNodeInspector() {
    const template = toolTemplates[currentTemplate];
    const node = template.nodes.find(n => n.id === selectedNodeId);
    if (!node) return '';
    
    const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
    const currentUpgrade = node.upgrades[currentLevel];
    const nextUpgrade = node.upgrades[currentLevel + 1];
    
    return `
        <div class="node-inspector-content">
            <div class="inspector-header">
                <h4 class="text-lg font-semibold text-white">${node.name}</h4>
                <span class="node-type-badge ${node.type}">${node.type}</span>
            </div>
            
            <div class="current-upgrade">
                <h5 class="text-md font-semibold text-gray-300">Livello Attuale (${currentLevel})</h5>
                <div class="upgrade-details">
                    <p class="upgrade-name text-purple-400">${currentUpgrade.name}</p>
                    <p class="upgrade-description text-gray-400">${currentUpgrade.description}</p>
                </div>
            </div>
            
            ${nextUpgrade ? `
                <div class="next-upgrade">
                    <h5 class="text-md font-semibold text-gray-300">Prossimo Upgrade (${currentLevel + 1})</h5>
                    <div class="upgrade-details">
                        <p class="upgrade-name text-green-400">${nextUpgrade.name}</p>
                        <p class="upgrade-description text-gray-400">${nextUpgrade.description}</p>
                        ${nextUpgrade.requires ? `
                            <div class="upgrade-requirements">
                                <p class="text-sm text-yellow-400">Richiede:</p>
                                ${nextUpgrade.requires.map(req => 
                                    `<span class="requirement ${checkTalentRequirement(req) ? 'met' : 'unmet'}">${req}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                        <button class="upgrade-button ${canUpgradeNode(node.id) ? '' : 'disabled'}" 
                                onclick="upgradeNode('${node.id}')"
                                ${canUpgradeNode(node.id) ? '' : 'disabled'}>
                            <i class="fas fa-arrow-up"></i> Potenzia Nodo
                        </button>
                    </div>
                </div>
            ` : `
                <div class="max-level">
                    <p class="text-green-400"><i class="fas fa-star"></i> Nodo al livello massimo</p>
                </div>
            `}
        </div>
    `;
}

function renderCompilationPanel() {
    return `
        <div class="compilation-panel-content">
            <div class="panel-header">
                <h3 class="text-lg font-semibold text-white">
                    <i class="fas fa-cogs mr-2"></i>
                    Compiler & Options
                </h3>
            </div>
            
            <div class="compiler-options">
                <h4 class="text-md font-semibold text-gray-300 mb-2">Opzioni di Compilazione</h4>
                <div class="options-grid">
                    ${renderCompilerOptions()}
                </div>
            </div>
            
            <div class="compilation-queue">
                <h4 class="text-md font-semibold text-gray-300 mb-2">Coda di Compilazione</h4>
                <div class="queue-list">
                    ${renderCompilationQueue()}
                </div>
            </div>
        </div>
    `;
}

function renderCompilerOptions() {
    return Object.entries(compilerOptions).map(([key, option]) => {
        const isUnlocked = state.reworkEditor.unlockedOptions.includes(key);
        const isAvailable = checkCompilerOptionRequirements(option);
        
        return `
            <div class="compiler-option ${isUnlocked && isAvailable ? 'available' : 'locked'}">
                <div class="option-info">
                    <h5 class="option-name">${option.name}</h5>
                    <p class="option-description">${option.description}</p>
                    <div class="option-effects">
                        <span class="effect-item">
                            <i class="fas fa-clock"></i> +${Math.round((option.compilationTimeMultiplier - 1) * 100)}% tempo
                        </span>
                        ${option.effectivenessBonus ? `
                            <span class="effect-item">
                                <i class="fas fa-arrow-up"></i> +${Math.round(option.effectivenessBonus * 100)}% efficacia
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="option-toggle">
                    <input type="checkbox" id="option-${key}" ${isUnlocked && isAvailable ? '' : 'disabled'}>
                    <label for="option-${key}"></label>
                </div>
            </div>
        `;
    }).join('');
}

function renderCompilationQueue() {
    if (compilationQueue.length === 0) {
        return '<p class="text-gray-400">Nessuna compilazione in corso</p>';
    }
    
    return compilationQueue.map((item, index) => `
        <div class="queue-item">
            <div class="item-info">
                <span class="item-name">${item.templateName}</span>
                <span class="item-progress">${Math.round(item.progress)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${item.progress}%"></div>
            </div>
            <div class="item-time">
                <span class="time-remaining">${formatTime(item.timeRemaining)}</span>
            </div>
        </div>
    `).join('');
}

// Helper functions
function getTemplateIcon(templateKey) {
    const icons = {
        'ransomware': 'fa-lock',
        'keylogger': 'fa-keyboard',
        'botnet_agent': 'fa-network-wired'
    };
    return icons[templateKey] || 'fa-code';
}

function checkTemplateRequirements(template) {
    return template.requiredTalents.every(talent => checkTalentRequirement(talent));
}

function checkTalentRequirement(talentRequirement) {
    // Parse requirement like "Malware Development LV2"
    const parts = talentRequirement.split(' LV');
    const talentName = parts[0];
    const requiredLevel = parseInt(parts[1]) || 1;
    
    const unlockedLevel = state.unlocked[talentName] || 0;
    return unlockedLevel >= requiredLevel;
}

function checkCompilerOptionRequirements(option) {
    return option.requiredTalents.every(talent => checkTalentRequirement(talent));
}

function canUpgradeNode(nodeId) {
    const template = toolTemplates[currentTemplate];
    const node = template.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    
    const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
    if (currentLevel >= node.maxLevel) return false;
    
    const nextUpgrade = node.upgrades[currentLevel + 1];
    if (nextUpgrade && nextUpgrade.requires) {
        return nextUpgrade.requires.every(req => checkTalentRequirement(req));
    }
    
    return true;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Event handlers
function selectTemplate(templateKey) {
    currentTemplate = templateKey;
    selectedNodeId = null;
    renderReworkEditor();
}

function selectNode(nodeId) {
    selectedNodeId = nodeId;
    renderReworkEditor();
}

function upgradeNode(nodeId) {
    const nodeKey = `${currentTemplate}_${nodeId}`;
    const currentLevel = state.reworkEditor.nodeUpgrades[nodeKey] || 1;
    
    if (canUpgradeNode(nodeId)) {
        state.reworkEditor.nodeUpgrades[nodeKey] = currentLevel + 1;
        saveState();
        renderReworkEditor();
        
        showNotification(`Nodo ${nodeId} potenziato al livello ${currentLevel + 1}!`, 'success');
    }
}

function compileTemplate() {
    if (!currentTemplate) return;
    
    const template = toolTemplates[currentTemplate];
    const compilationTime = calculateCompilationTime();
    
    const compilationItem = {
        id: Date.now(),
        templateName: template.name,
        template: currentTemplate,
        startTime: Date.now(),
        totalTime: compilationTime,
        progress: 0,
        timeRemaining: compilationTime
    };
    
    compilationQueue.push(compilationItem);
    startCompilation(compilationItem);
    
    showNotification(`Iniziata compilazione di ${template.name} (${formatTime(compilationTime)})`, 'info');
}

function calculateCompilationTime() {
    const template = toolTemplates[currentTemplate];
    
    // Base time based on template complexity
    let baseTime = template.nodes.length * 30; // 30 seconds per node
    
    // Add time based on node upgrades
    template.nodes.forEach(node => {
        const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
        baseTime += currentLevel * 15; // 15 seconds per upgrade level
    });
    
    // Apply talent modifiers
    const developmentLevel = state.unlocked['Sviluppo'] || 0;
    const stealthLevel = state.unlocked['Stealth'] || 0;
    
    let timeModifier = 1.0;
    timeModifier -= developmentLevel * 0.1; // 10% reduction per development level
    timeModifier -= stealthLevel * 0.05; // 5% reduction per stealth level
    
    // Apply compiler option modifiers
    Object.entries(compilerOptions).forEach(([key, option]) => {
        const checkbox = document.getElementById(`option-${key}`);
        if (checkbox && checkbox.checked) {
            timeModifier *= option.compilationTimeMultiplier;
        }
    });
    
    return Math.max(30, Math.round(baseTime * timeModifier)); // Minimum 30 seconds
}

function startCompilation(item) {
    const updateInterval = setInterval(() => {
        const elapsed = (Date.now() - item.startTime) / 1000;
        item.progress = Math.min(100, (elapsed / item.totalTime) * 100);
        item.timeRemaining = Math.max(0, item.totalTime - elapsed);
        
        if (item.progress >= 100) {
            clearInterval(updateInterval);
            completeCompilation(item);
        }
        
        renderCompilationPanel();
    }, 1000);
}

function completeCompilation(item) {
    // Remove from queue
    const index = compilationQueue.findIndex(q => q.id === item.id);
    if (index !== -1) {
        compilationQueue.splice(index, 1);
    }
    
    // Add to compilation history
    state.reworkEditor.compilationHistory.push({
        templateName: item.templateName,
        template: item.template,
        completedAt: Date.now(),
        nodeUpgrades: { ...state.reworkEditor.nodeUpgrades }
    });
    
    // Award XP and resources
    const xpGained = 100 + (item.totalTime / 60) * 10; // More XP for longer compilations
    state.experience += xpGained;
    state.xmr += Math.round(item.totalTime / 30); // 1 XMR per 30 seconds
    
    saveState();
    updateUI();
    renderReworkEditor();
    
    showNotification(`${item.templateName} compilato con successo! +${Math.round(xpGained)} XP`, 'success');
}

function resetTemplate() {
    if (!currentTemplate) return;
    
    // Reset all node upgrades for this template
    Object.keys(state.reworkEditor.nodeUpgrades).forEach(key => {
        if (key.startsWith(`${currentTemplate}_`)) {
            delete state.reworkEditor.nodeUpgrades[key];
        }
    });
    
    selectedNodeId = null;
    saveState();
    renderReworkEditor();
    
    showNotification('Template reset alle impostazioni predefinite', 'info');
}

function addReworkEditorEventListeners() {
    // Template card click events
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('locked')) {
                const templateKey = card.dataset.template;
                selectTemplate(templateKey);
            }
        });
    });
    
    // Node click events
    document.querySelectorAll('.template-node').forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            const nodeId = node.dataset.nodeId;
            selectNode(nodeId);
        });
    });
    
    // Canvas click to deselect
    const canvas = document.querySelector('.canvas-grid');
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            if (e.target === canvas) {
                selectedNodeId = null;
                renderReworkEditor();
            }
        });
    }
}

// Export functions for global access
window.initReworkEditor = initReworkEditor;
window.selectTemplate = selectTemplate;
window.selectNode = selectNode;
window.upgradeNode = upgradeNode;
window.compileTemplate = compileTemplate;
window.resetTemplate = resetTemplate;
window.showNodeUpgradeMenu = function(nodeId) {
    selectNode(nodeId);
    // Could implement a modal here for more detailed upgrade interface
};