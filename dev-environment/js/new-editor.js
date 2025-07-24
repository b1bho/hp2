// New Template-Based Flow Editor
// File: js/new-editor.js

// Flow Templates with Fixed Interconnections
const editorTemplates = {
    'ransomware-basic': {
        name: 'Ransomware Base',
        category: 'malware',
        description: 'Template base per ransomware con crittografia file',
        complexity: 3,
        requiredTalents: ['Sviluppo LV1'],
        nodes: [
            {
                id: 'entry',
                type: 'entry',
                name: 'Entry Point',
                position: { x: 50, y: 50 },
                enhancements: ['stealth-injection', 'privilege-escalation'],
                outputs: ['target-scan']
            },
            {
                id: 'target-scan',
                type: 'scanner',
                name: 'Target Scanner',
                position: { x: 200, y: 50 },
                enhancements: ['deep-scan', 'network-discovery'],
                inputs: ['entry'],
                outputs: ['file-crypto']
            },
            {
                id: 'file-crypto',
                type: 'crypto',
                name: 'File Encryption',
                position: { x: 350, y: 50 },
                enhancements: ['advanced-crypto', 'key-generation'],
                inputs: ['target-scan'],
                outputs: ['ransom-note']
            },
            {
                id: 'ransom-note',
                type: 'payload',
                name: 'Ransom Display',
                position: { x: 500, y: 50 },
                enhancements: ['psychological-pressure', 'payment-tracking'],
                inputs: ['file-crypto'],
                outputs: []
            }
        ],
        modifiers: ['obfuscator', 'crypter', 'self-delete']
    },
    'keylogger-advanced': {
        name: 'Keylogger Avanzato',
        category: 'surveillance',
        description: 'Template per keylogger con funzionalità stealth',
        complexity: 2,
        requiredTalents: ['Sviluppo LV1', 'Stealth LV1'],
        nodes: [
            {
                id: 'inject',
                type: 'injection',
                name: 'Code Injection',
                position: { x: 50, y: 50 },
                enhancements: ['dll-injection', 'process-hollowing'],
                outputs: ['hook-install']
            },
            {
                id: 'hook-install',
                type: 'hook',
                name: 'Keyboard Hook',
                position: { x: 200, y: 50 },
                enhancements: ['global-hook', 'input-filtering'],
                inputs: ['inject'],
                outputs: ['data-capture']
            },
            {
                id: 'data-capture',
                type: 'capture',
                name: 'Data Capture',
                position: { x: 350, y: 50 },
                enhancements: ['screen-capture', 'clipboard-monitor'],
                inputs: ['hook-install'],
                outputs: ['exfiltration']
            },
            {
                id: 'exfiltration',
                type: 'network',
                name: 'Data Exfiltration',
                position: { x: 500, y: 50 },
                enhancements: ['encrypted-channel', 'covert-channel'],
                inputs: ['data-capture'],
                outputs: []
            }
        ],
        modifiers: ['anti-debug', 'vm-detection', 'persistence']
    },
    'botnet-controller': {
        name: 'Botnet Controller',
        category: 'control',
        description: 'Template per controllo botnet distribuita',
        complexity: 4,
        requiredTalents: ['Networking LV2', 'Sviluppo LV2'],
        nodes: [
            {
                id: 'c2-server',
                type: 'server',
                name: 'C&C Server',
                position: { x: 50, y: 50 },
                enhancements: ['redundancy', 'load-balancing'],
                outputs: ['command-dispatch', 'data-aggregation']
            },
            {
                id: 'command-dispatch',
                type: 'command',
                name: 'Command Dispatcher',
                position: { x: 200, y: 30 },
                enhancements: ['bulk-operations', 'targeted-commands'],
                inputs: ['c2-server'],
                outputs: ['bot-communication']
            },
            {
                id: 'data-aggregation',
                type: 'aggregator',
                name: 'Data Aggregator',
                position: { x: 200, y: 80 },
                enhancements: ['real-time-analysis', 'data-mining'],
                inputs: ['c2-server'],
                outputs: ['bot-communication']
            },
            {
                id: 'bot-communication',
                type: 'network',
                name: 'Bot Communication',
                position: { x: 350, y: 50 },
                enhancements: ['p2p-protocol', 'domain-generation'],
                inputs: ['command-dispatch', 'data-aggregation'],
                outputs: []
            }
        ],
        modifiers: ['traffic-obfuscation', 'protocol-switching', 'failover']
    },
    'phishing-campaign': {
        name: 'Campagna Phishing',
        category: 'social',
        description: 'Template per campagne di social engineering',
        complexity: 2,
        requiredTalents: ['Ingegneria Sociale LV1'],
        nodes: [
            {
                id: 'target-research',
                type: 'research',
                name: 'Target Research',
                position: { x: 50, y: 50 },
                enhancements: ['osint-analysis', 'social-profiling'],
                outputs: ['content-generation']
            },
            {
                id: 'content-generation',
                type: 'generator',
                name: 'Content Generator',
                position: { x: 200, y: 50 },
                enhancements: ['ai-writing', 'template-cloning'],
                inputs: ['target-research'],
                outputs: ['delivery-system']
            },
            {
                id: 'delivery-system',
                type: 'delivery',
                name: 'Delivery System',
                position: { x: 350, y: 50 },
                enhancements: ['mass-mailing', 'sms-gateway'],
                inputs: ['content-generation'],
                outputs: ['credential-harvest']
            },
            {
                id: 'credential-harvest',
                type: 'harvest',
                name: 'Credential Harvester',
                position: { x: 500, y: 50 },
                enhancements: ['real-time-validation', 'data-enrichment'],
                inputs: ['delivery-system'],
                outputs: []
            }
        ],
        modifiers: ['url-shortening', 'geo-filtering', 'time-bombing']
    }
};

// Node Enhancement Options
const nodeEnhancements = {
    // Entry Point Enhancements
    'stealth-injection': {
        name: 'Stealth Injection',
        description: 'Riduce la rilevabilità durante l\'iniezione',
        cost: { time: 1.2, complexity: 0.5 },
        requiredTalents: ['Stealth LV1']
    },
    'privilege-escalation': {
        name: 'Privilege Escalation',
        description: 'Aumenta automaticamente i privilegi',
        cost: { time: 1.5, complexity: 1 },
        requiredTalents: ['Sviluppo LV2']
    },
    
    // Scanner Enhancements
    'deep-scan': {
        name: 'Deep Scan',
        description: 'Scansione approfondita del sistema',
        cost: { time: 1.3, complexity: 0.7 },
        requiredTalents: ['Networking LV1']
    },
    'network-discovery': {
        name: 'Network Discovery',
        description: 'Scopre altri sistemi nella rete',
        cost: { time: 1.4, complexity: 0.8 },
        requiredTalents: ['Networking LV2']
    },
    
    // Crypto Enhancements
    'advanced-crypto': {
        name: 'Advanced Encryption',
        description: 'Algoritmi di crittografia più forti',
        cost: { time: 1.6, complexity: 1.2 },
        requiredTalents: ['Sviluppo LV2']
    },
    'key-generation': {
        name: 'Dynamic Key Generation',
        description: 'Generazione dinamica delle chiavi',
        cost: { time: 1.3, complexity: 0.9 },
        requiredTalents: ['Sviluppo LV1']
    },
    
    // Network Enhancements
    'encrypted-channel': {
        name: 'Encrypted Channel',
        description: 'Canale di comunicazione crittografato',
        cost: { time: 1.4, complexity: 1 },
        requiredTalents: ['Networking LV2', 'Stealth LV1']
    },
    'covert-channel': {
        name: 'Covert Channel',
        description: 'Canale di comunicazione nascosto',
        cost: { time: 1.8, complexity: 1.5 },
        requiredTalents: ['Stealth LV2']
    }
};

// Global Modifiers
const globalModifiers = {
    'obfuscator': {
        name: 'Code Obfuscator',
        description: 'Offusca il codice per evitare il reverse engineering',
        cost: { time: 1.3, complexity: 0.5 },
        requiredTalents: ['Stealth LV1'],
        compilationOptions: ['anti-analysis', 'string-encryption']
    },
    'crypter': {
        name: 'Runtime Crypter',
        description: 'Cripta il payload e lo decripta a runtime',
        cost: { time: 1.5, complexity: 1 },
        requiredTalents: ['Stealth LV2'],
        compilationOptions: ['polymorphic-encryption', 'anti-emulation']
    },
    'self-delete': {
        name: 'Self Delete',
        description: 'Il malware si auto-elimina dopo l\'esecuzione',
        cost: { time: 1.1, complexity: 0.3 },
        requiredTalents: ['Stealth LV1'],
        compilationOptions: ['secure-wipe', 'trace-removal']
    }
};

class NewFlowEditor {
    constructor() {
        this.canvas = null;
        this.currentTemplate = null;
        this.activeNodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        this.canvas = document.getElementById('new-flow-canvas');
        this.setupEventListeners();
        this.renderTemplateList();
    }

    setupEventListeners() {
        // Template selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('template-card')) {
                this.selectTemplate(e.target.dataset.templateId);
            }
        });

        // Canvas controls
        document.getElementById('compile-flow-btn')?.addEventListener('click', () => {
            this.compileCurrentFlow();
        });

        document.getElementById('clear-flow-btn')?.addEventListener('click', () => {
            this.clearCanvas();
        });

        // Node interaction
        this.canvas?.addEventListener('click', (e) => {
            if (e.target.classList.contains('flow-node')) {
                this.selectNode(e.target.dataset.nodeId);
            }
        });
    }

    renderTemplateList() {
        const container = document.getElementById('template-list');
        if (!container) return;

        container.innerHTML = '';
        
        Object.entries(editorTemplates).forEach(([id, template]) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.dataset.templateId = id;
            
            const canUse = this.checkTalentRequirements(template.requiredTalents);
            if (!canUse) {
                card.classList.add('opacity-50', 'cursor-not-allowed');
            }
            
            card.innerHTML = `
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-xs px-2 py-1 bg-gray-600 rounded">${template.category}</span>
                    <span class="text-xs text-yellow-400">Complexity: ${template.complexity}</span>
                </div>
                <div class="mt-1 text-xs text-gray-400">
                    Richiede: ${template.requiredTalents.join(', ')}
                </div>
            `;
            
            container.appendChild(card);
        });
    }

    selectTemplate(templateId) {
        const template = editorTemplates[templateId];
        if (!template || !this.checkTalentRequirements(template.requiredTalents)) {
            return;
        }

        // Update UI
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-template-id="${templateId}"]`)?.classList.add('active');

        this.currentTemplate = template;
        devState.editorState.selectedTemplate = templateId;
        this.renderFlowCanvas();
        saveStateDebounced();
    }

    renderFlowCanvas() {
        if (!this.canvas || !this.currentTemplate) return;

        this.canvas.innerHTML = '';
        this.activeNodes = [];
        this.connections = [];

        // Render nodes
        this.currentTemplate.nodes.forEach(nodeData => {
            this.createFlowNode(nodeData);
        });

        // Render connections
        this.renderConnections();
    }

    createFlowNode(nodeData) {
        const node = document.createElement('div');
        node.className = 'flow-node';
        node.dataset.nodeId = nodeData.id;
        node.style.left = `${nodeData.position.x}px`;
        node.style.top = `${nodeData.position.y}px`;

        const hasEnhancements = devState.editorState.enhancements[nodeData.id]?.length > 0;
        if (hasEnhancements) {
            node.classList.add('enhanced');
        }

        node.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getNodeIcon(nodeData.type)} node-icon"></i>
                <h5>${nodeData.name}</h5>
            </div>
            <p>${this.getNodeDescription(nodeData.type)}</p>
            ${hasEnhancements ? '<div class="text-xs text-yellow-400 mt-1"><i class="fas fa-star mr-1"></i>Enhanced</div>' : ''}
            ${nodeData.inputs ? nodeData.inputs.map((_, i) => 
                `<div class="connection-point input" style="top: ${20 + i * 15}px;"></div>`
            ).join('') : ''}
            ${nodeData.outputs ? nodeData.outputs.map((_, i) => 
                `<div class="connection-point output" style="top: ${20 + i * 15}px;"></div>`
            ).join('') : ''}
        `;

        this.canvas.appendChild(node);
        this.activeNodes.push({ element: node, data: nodeData });
    }

    selectNode(nodeId) {
        // Clear previous selection
        document.querySelectorAll('.flow-node').forEach(node => {
            node.classList.remove('selected');
        });

        // Select new node
        const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeElement) {
            nodeElement.classList.add('selected');
            this.selectedNode = nodeId;
            this.showNodeEnhancementOptions(nodeId);
        }
    }

    showNodeEnhancementOptions(nodeId) {
        const nodeData = this.currentTemplate.nodes.find(n => n.id === nodeId);
        if (!nodeData) return;

        const panel = document.getElementById('node-enhancement');
        const optionsContainer = document.getElementById('enhancement-options');
        
        panel.classList.remove('hidden');
        optionsContainer.innerHTML = '';

        nodeData.enhancements.forEach(enhancementId => {
            const enhancement = nodeEnhancements[enhancementId];
            if (!enhancement) return;

            const canUse = this.checkTalentRequirements(enhancement.requiredTalents);
            const isActive = devState.editorState.enhancements[nodeId]?.includes(enhancementId);

            const option = document.createElement('div');
            option.className = `enhancement-option ${isActive ? 'selected' : ''} ${!canUse ? 'opacity-50 cursor-not-allowed' : ''}`;
            option.dataset.enhancementId = enhancementId;
            option.dataset.nodeId = nodeId;

            option.innerHTML = `
                <div>
                    <div class="font-semibold text-white">${enhancement.name}</div>
                    <div class="text-xs text-gray-400">${enhancement.description}</div>
                    <div class="text-xs text-yellow-400 mt-1">
                        +${Math.round((enhancement.cost.time - 1) * 100)}% tempo, 
                        +${Math.round(enhancement.cost.complexity * 100)}% complessità
                    </div>
                </div>
                <div class="flex items-center">
                    ${canUse ? 
                        `<button class="px-2 py-1 text-xs ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} rounded">
                            ${isActive ? 'Rimuovi' : 'Aggiungi'}
                        </button>` :
                        `<span class="text-xs text-gray-500">Talenti richiesti</span>`
                    }
                </div>
            `;

            if (canUse) {
                option.addEventListener('click', () => {
                    this.toggleEnhancement(nodeId, enhancementId);
                });
            }

            optionsContainer.appendChild(option);
        });
    }

    toggleEnhancement(nodeId, enhancementId) {
        if (!devState.editorState.enhancements[nodeId]) {
            devState.editorState.enhancements[nodeId] = [];
        }

        const enhancements = devState.editorState.enhancements[nodeId];
        const index = enhancements.indexOf(enhancementId);

        if (index > -1) {
            enhancements.splice(index, 1);
        } else {
            enhancements.push(enhancementId);
        }

        // Update UI
        this.renderFlowCanvas();
        this.showNodeEnhancementOptions(nodeId);
        saveStateDebounced();
    }

    renderConnections() {
        // This would implement the visual connections between nodes
        // For now, we'll show connections are fixed as per requirements
        this.currentTemplate.nodes.forEach(node => {
            if (node.outputs) {
                node.outputs.forEach(outputTarget => {
                    // Visual connection logic would go here
                    console.log(`Connection: ${node.id} -> ${outputTarget}`);
                });
            }
        });
    }

    compileCurrentFlow() {
        if (!this.currentTemplate) {
            alert('Seleziona un template prima di compilare');
            return;
        }

        const compilationJob = {
            id: Date.now(),
            templateId: Object.keys(editorTemplates).find(id => editorTemplates[id] === this.currentTemplate),
            template: this.currentTemplate,
            enhancements: { ...devState.editorState.enhancements },
            startTime: Date.now(),
            estimatedDuration: this.calculateCompilationTime(),
            status: 'pending'
        };

        // Add to compilation queue
        if (window.timeProgramming) {
            window.timeProgramming.addCompilationJob(compilationJob);
        }
    }

    calculateCompilationTime() {
        let baseTime = devState.compilationState.settings.baseCompilationTime;
        let complexityMultiplier = this.currentTemplate.complexity * devState.compilationState.settings.complexityMultiplier;
        
        // Factor in enhancements
        Object.values(devState.editorState.enhancements).forEach(nodeEnhancements => {
            nodeEnhancements.forEach(enhancementId => {
                const enhancement = nodeEnhancements[enhancementId];
                if (enhancement) {
                    baseTime *= enhancement.cost.time;
                    complexityMultiplier += enhancement.cost.complexity;
                }
            });
        });

        // Apply talent reductions
        const talentReduction = this.getTalentTimeReduction();
        const finalTime = (baseTime * complexityMultiplier) * (1 - talentReduction);
        
        return Math.max(5, Math.round(finalTime)); // Minimum 5 seconds
    }

    getTalentTimeReduction() {
        let reduction = 0;
        const sviluppoLevel = devState.talentState.unlockedTalents['Sviluppo']?.level || 0;
        reduction += sviluppoLevel * 0.1; // 10% per level
        
        return Math.min(0.5, reduction); // Max 50% reduction
    }

    clearCanvas() {
        this.canvas.innerHTML = '';
        this.activeNodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.currentTemplate = null;
        
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('active');
        });
        
        document.getElementById('node-enhancement')?.classList.add('hidden');
        
        devState.editorState.selectedTemplate = null;
        devState.editorState.activeFlow = null;
        devState.editorState.selectedNode = null;
        devState.editorState.enhancements = {};
        
        saveStateDebounced();
    }

    checkTalentRequirements(requiredTalents) {
        if (!requiredTalents || requiredTalents.length === 0) return true;
        
        return requiredTalents.every(requirement => {
            // Parse requirement like "Sviluppo LV2"
            const parts = requirement.split(' ');
            const branch = parts[0];
            const levelStr = parts[1] || 'LV1';
            const requiredLevel = parseInt(levelStr.replace('LV', ''));
            
            const currentLevel = devState.talentState.unlockedTalents[branch]?.level || 0;
            return currentLevel >= requiredLevel;
        });
    }

    getNodeIcon(type) {
        const icons = {
            entry: 'sign-in-alt',
            scanner: 'search',
            crypto: 'lock',
            payload: 'bomb',
            injection: 'syringe',
            hook: 'fish-hook',
            capture: 'camera',
            network: 'wifi',
            server: 'server',
            command: 'terminal',
            aggregator: 'database',
            research: 'user-secret',
            generator: 'magic',
            delivery: 'paper-plane',
            harvest: 'hand-holding-heart'
        };
        return icons[type] || 'cog';
    }

    getNodeDescription(type) {
        const descriptions = {
            entry: 'Punto di ingresso nel sistema',
            scanner: 'Scansiona il target per vulnerabilità',
            crypto: 'Crittografa i file target',
            payload: 'Esegue il payload finale',
            injection: 'Inietta codice nel processo',
            hook: 'Installa hook di sistema',
            capture: 'Cattura dati di input',
            network: 'Gestisce comunicazioni di rete',
            server: 'Server di comando e controllo',
            command: 'Invia comandi ai bot',
            aggregator: 'Aggrega dati dai bot',
            research: 'Ricerca informazioni sui target',
            generator: 'Genera contenuti personalizzati',
            delivery: 'Sistema di consegna',
            harvest: 'Raccoglie credenziali'
        };
        return descriptions[type] || 'Nodo generico';
    }
}

// Initialize the new editor
let newFlowEditor;
document.addEventListener('DOMContentLoaded', () => {
    newFlowEditor = new NewFlowEditor();
});