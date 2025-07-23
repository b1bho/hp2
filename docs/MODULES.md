# Documentazione Moduli 📦

Questa documentazione fornisce una panoramica dettagliata di tutti i moduli del sistema Hacker Tycoon, analizzando le loro funzionalità, API e interazioni.

## 📋 Indice

- [Moduli Core](#moduli-core)
- [Moduli Interfaccia](#moduli-interfaccia)
- [Moduli Logica Business](#moduli-logica-business)
- [Moduli Dati](#moduli-dati)
- [Moduli Avanzati](#moduli-avanzati)
- [Interazioni tra Moduli](#interazioni-tra-moduli)

## 🔧 Moduli Core

### main.js - Coordinatore Principale

**Responsabilità:**
- Inizializzazione applicazione
- Gestione navigazione tra pagine
- Coordinamento inter-moduli
- Gestione stato globale
- Sistema notifiche

**Funzioni Chiave:**

```javascript
// Inizializzazione
function init() {
    loadState();
    showPage('hq');
    initCommonListeners();
    startGameTimers();
}

// Navigazione
function showPage(pageName) {
    currentPage = pageName;
    updateNavButtons();
    renderPageContent();
    saveState();
}

// Notifiche
function showNotification(message, type = 'info') {
    // Gestisce notifiche toast
}

// Persistenza
function saveState() {
    localStorage.setItem('hackerAppState', JSON.stringify(state));
}

function loadState() {
    // Carica stato da localStorage con gestione errori
}
```

**Stato Gestito:**
- `currentPage`: Pagina attualmente visualizzata
- `lines`: Array delle linee di connessione nell'editor
- Timer intervals per aggiornamenti periodici

### data.js - Configurazioni e Dati

**Responsabilità:**
- Definizioni albero talenti
- Configurazioni di gioco
- Dati statici per il sistema

**Strutture Dati Principali:**

```javascript
const talentData = {
    "Ramo 1: Ingegneria Sociale": {
        icon: "fas fa-user-secret",
        talents: {
            "Social Engineering (SocEng)": {
                description: "Migliora la capacità di creare contenuti persuasivi",
                levels: [
                    { name: "SocEng LV1", cost: 1, unlocks: [...], studyTime: 30 }
                ]
            }
        }
    }
};

const marketData = {
    personalHardware: [
        {
            id: "better-cpu",
            name: "CPU High-End",
            price: 5.0,
            description: "Processore avanzato per calcoli complessi",
            bonuses: {
                studyTimeModifier: 0.85,
                toolStatModifiers: { eo: 1, rc: 0.05 }
            }
        }
    ]
};
```

## 🎮 Moduli Interfaccia

### hq.js - Quartier Generale

**Responsabilità:**
- Dashboard principale del giocatore
- Visualizzazione statistiche globali
- Gestione hardware personale
- Monitoring stato rete

**Funzioni Principali:**

```javascript
function renderHqPage() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
        <div class="hq-layout">
            ${renderComputerStats()}
            ${renderNewsSection()}
            ${renderHardwareSection()}
        </div>
    `;
    initHqListeners();
}

function renderComputerStats() {
    // Calcola e mostra bonus hardware/clan
    const { hardwareBonuses, clanBonuses } = state;
    const totalStudyBonus = calculateTotalBonus();
    return statsHTML;
}
```

**Caratteristiche:**
- Real-time news ticker
- Hardware bonuses visualization
- Network traceability indicators
- Global game statistics

### world.js - Mappa Mondiale 3D

**Responsabilità:**
- Rendering mappa 3D con Three.js
- Gestione target globali
- Sistema routing attacchi
- Visualizzazione statistiche live

**Componenti Chiave:**

```javascript
function initGlobe() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    // Globe setup
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(5, 64, 64),
        new THREE.MeshPhongMaterial({ map: earthTexture })
    );
}

function renderNationsList() {
    // Genera lista nazioni con informazioni target
    worldData.nations.forEach(nation => {
        // Rendering singola nazione
    });
}

function renderTargetDetails(nationId, targetId) {
    // Mostra dettagli target selezionato
    // Include: difficoltà, rewards, stato
}
```

**Features Avanzate:**
- Interactive 3D globe con OrbitControls
- Dynamic nation markers
- Attack routing visualization
- Live global statistics

### botnet.js - Gestione Botnet Avanzata

**Responsabilità:**
- Management host infetti con interfaccia tabbed
- Sistema DDoS coordinato multi-target
- Operazioni mining cryptocurrency parallele
- Organizzazione bot in gruppi operativi
- Monitoring real-time attacchi e stato

**Architettura Tabbed:**

```javascript
// Sistema tab navigation
function switchTab(tabName) {
    currentActiveTab = tabName; // 'management', 'ddos', 'mining'
    updateTabDisplay();
    refreshTabContent();
}

// Tab Management - Gestione host e gruppi
function renderInfectedHostsList() {
    const hosts = state.infectedHostPool;
    const groups = state.botnetGroups;
    return groupedHostsHTML;
}

// Tab DDoS - Attacchi coordinati  
function renderBotGroupSelection() {
    // Selezione gruppi per attacchi DDoS
    // Calcolo potenza aggregata e bandwidth
    // Preview impatto e rischio
}

// Tab Mining - Operazioni cryptocurrency
function renderMiningGroups() {
    // Selezione gruppi per mining
    // Calcolo hashrate e profittabilità  
    // Monitoring operazioni attive
}
```

**Sistema DDoS Avanzato:**

```javascript
// Configurazione attacco DDoS
function configureDDoSAttack() {
    return {
        targetIP: selectedTarget,
        botGroups: selectedBotGroups,
        flow: selectedDDoSFlow,
        duration: attackDuration,
        estimatedImpact: calculateImpact(),
        traceabilityRisk: calculateRisk(),
        botLossRisk: calculateLossRisk()
    };
}

// Calcolo impatto real-time
function calculateAttackImpact(totalPower, duration) {
    const baseImpact = Math.log10(totalPower) * 2;
    const durationMultiplier = Math.sqrt(duration / 60);
    return Math.round(baseImpact * durationMultiplier * 10) / 10;
}

// Gestione attacchi multipli simultanei
let activeDDoSAttacks = []; // Array di attacchi attivi
function launchDDoSAttack(config) {
    const attack = {
        id: generateAttackId(),
        startTime: Date.now(),
        ...config
    };
    activeDDoSAttacks.push(attack);
    updateBotGroupStatus(config.botGroups, 'DDoSing');
}
```

**Mining Operations:**

```javascript
// Sistema mining integrato
function startMiningOperation(selectedGroups) {
    const operation = {
        groups: selectedGroups,
        startTime: Date.now(),
        hashrate: calculateTotalHashrate(selectedGroups),
        estimatedReward: calculateMiningReward()
    };
    
    activeMiningOperation = operation;
    updateGroupsActivity(selectedGroups, 'Mining');
    startMiningTimer();
}

// Calcolo rewards mining
function calculateMiningReward(hashrate, duration) {
    const baseReward = 0.001; // XMR per ora per GFLOP
    const efficiency = 0.7; // Efficienza mining botnet
    return hashrate * duration * baseReward * efficiency;
}
```

**Features Avanzate:**
- Conflict resolution tra DDoS e Mining
- Resource allocation dinamica
- Power calculation con modificatori
- Status tracking per gruppi e host
- Integration con sistema tracciabilità
- Preview impatto con risk assessment

### editor.js - Editor Flussi Drag-and-Drop

**Responsabilità:**
- Interface drag-and-drop per flussi
- Connessioni visuali tra blocchi
- Validazione flussi real-time
- Export/import flussi

**Sistema Drag-and-Drop:**

```javascript
// Configurazione interact.js
interact('.flow-block').draggable({
    inertia: true,
    modifiers: [
        interact.modifiers.snap({
            targets: [{ x: multiple(GRID_SIZE), y: multiple(GRID_SIZE) }]
        })
    ],
    listeners: {
        move: dragMoveListener,
        end: dragEndListener
    }
});

function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    
    updateElementPosition(target, x, y);
    updateConnections();
}
```

**Visual Connections:**

```javascript
function updateConnections() {
    // Aggiorna tutte le linee di connessione
    connections.forEach(conn => {
        if (conn.line) {
            conn.line.position();
        }
    });
}

function createConnection(sourceId, targetId) {
    const line = new LeaderLine(
        document.querySelector(`[data-block-id="${sourceId}"]`),
        document.querySelector(`[data-block-id="${targetId}"]`),
        { color: '#4f46e5', size: 2 }
    );
    return line;
}
```

## 💰 Moduli Business Logic

### market.js - Mercato Legale

**Responsabilità:**
- Gestione acquisti hardware/software
- Sistema pricing dinamico
- Inventory management
- Transaction history

**Sistema Transazioni:**

```javascript
function purchaseItem(itemId, itemType, currency = 'btc') {
    const item = findItemById(itemId, itemType);
    const cost = item.price;
    
    if (!canAfford(cost, currency)) {
        showNotification('Fondi insufficienti!', 'error');
        return false;
    }
    
    // Deduce cost
    state[`${currency}Balance`] -= cost;
    
    // Add to inventory
    if (itemType === 'personalHardware') {
        state.ownedHardware[itemId] = true;
        applyHardwareBonuses();
    }
    
    saveState();
    return true;
}
```

### dark_market.js - Mercato Nero

**Responsabilità:**
- Trading beni illeciti
- Gestione reputation system
- Pricing basato su rischiosità
- Anonimizzazione transazioni

**Features Speciali:**

```javascript
function calculateRiskPremium(item) {
    // Calcola premium basato su:
    // - Tracciabilità attuale
    // - Reputazione venditore
    // - Domanda/offerta
    const basePremium = item.riskFactor * 0.1;
    const reputationDiscount = state.reputation * 0.02;
    return Math.max(0, basePremium - reputationDiscount);
}
```

### quests.js - Sistema Missioni

**Responsabilità:**
- Gestione quest attive
- Progress tracking
- Reward distribution
- Unlock conditions

**Quest Engine:**

```javascript
function checkQuestCompletion() {
    state.activeQuests.forEach(quest => {
        if (quest.checkCompletion(state)) {
            completeQuest(quest.id);
        }
    });
}

function completeQuest(questId) {
    const quest = findQuestById(questId);
    
    // Award rewards
    state.xp += quest.rewards.xp;
    state.btcBalance += quest.rewards.btc;
    state.talentPoints += quest.rewards.talentPoints;
    
    // Remove from active
    state.activeQuests = state.activeQuests.filter(q => q.id !== questId);
    
    showNotification(`Quest completata: ${quest.name}`, 'success');
}
```

### profile.js - Sistema Profilo e Talenti

**Responsabilità:**
- Gestione albero talenti
- Calcolo XP e progressione livelli
- Study time management
- Talent dependencies

**Talent System:**

```javascript
function acquireTalent(talentName, level) {
    const talent = findTalent(talentName);
    const levelData = talent.levels[level - 1];
    
    if (!canAcquireTalent(talentName, level)) {
        return false;
    }
    
    // Deduct talent points
    state.talentPoints -= levelData.cost;
    
    // Mark as acquired
    if (!state.acquiredTalents[talentName]) {
        state.acquiredTalents[talentName] = 0;
    }
    state.acquiredTalents[talentName] = level;
    
    // Unlock new abilities
    unlockAbilities(levelData.unlocks);
    
    return true;
}

function startStudying(talentName, level) {
    const studyTime = getTalentStudyTime(talentName, level);
    const modifiedTime = studyTime * state.hardwareBonuses.studyTimeModifier;
    
    state.currentStudy = {
        talent: talentName,
        level: level,
        startTime: Date.now(),
        duration: modifiedTime * 1000
    };
}
```

## 🔄 Moduli Logica Business

### flow_logic.js - Logica Flussi

**Responsabilità:**
- Definizione categorie blocchi
- Validazione flussi di attacco
- Execution engine
- Success/failure calculation

**Block Categories:**

```javascript
const blockCategories = {
    // Fase di accesso
    'access': [
        'Scansione rete locale',
        'Esegui port scan avanzato',
        'Scansiona reti Wi-Fi vicine'
    ],
    
    // Acquisizione dati
    'acquisition': [
        'Esegui SQL Injection (base)',
        'Crea fake login page',
        'Sviluppa keylogger base'
    ],
    
    // Esfiltrazione
    'exfiltration': [
        'Salva IP raccolti',
        'Esfiltra dati da database'
    ]
};
```

### flow_validation.js - Validazione Flussi

**Responsabilità:**
- Validazione struttura flussi
- Dependency checking
- Flow requirements validation
- Error reporting

**Validation Rules:**

```javascript
function validateFlow(flowData) {
    const errors = [];
    
    // Verifica connessioni valide
    if (!hasValidConnections(flowData)) {
        errors.push('Flusso deve avere connessioni valide');
    }
    
    // Verifica sequenza logica
    if (!hasLogicalSequence(flowData)) {
        errors.push('Sequenza di blocchi non logica');
    }
    
    // Verifica prerequisiti talenti
    if (!hasRequiredTalents(flowData)) {
        errors.push('Talenti richiesti non acquisiti');
    }
    
    return { isValid: errors.length === 0, errors };
}
```

## 🔄 Moduli Avanzati

### factions.js - Sistema Fazioni Multi-Level

**Responsabilità:**
- Definizione 4 fazioni principali (Governmental, Terrorist, Eco-Terrorist, Population)
- Gestione relazioni inter-fazioni dinamiche
- Classificazione quest per fazione
- Sistema colorazione e tematizzazione

**Struttura Fazioni:**

```javascript
const FACTIONS = {
    GOVERNMENTAL: {
        id: 'governmental',
        name: 'Governativa',
        color: '#1e40af',
        colorLight: '#3b82f6',
        description: 'Organizzazioni governative e agenzie di sicurezza...',
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
            'Sicurezza nazionale'
        ]
    },
    // ... altre fazioni
};
```

**Relazioni Dinamiche:**
- Opposition matrix tra fazioni
- Reputation spillover effects
- Quest completion impact su multiple fazioni
- Bonus/malus basati su standing fazioni

### reputation_system.js - Gestione Reputazione Avanzata

**Responsabilità:**
- Tracking reputazione per tutte le fazioni
- Calcolo relazioni e spillover effects
- Gestione eventi reputazione
- Integration con sistema quest

**Sistema Calcolo:**

```javascript
class ReputationSystem {
    calculateFactionRelationships(questFactionId, completedSuccessfully = true) {
        const relationships = {
            governmental: {
                terrorist: -0.2,       // Fazioni opposte
                eco_terrorist: -0.1,   // Parzialmente opposte
                population: 0.05       // Lieve positivo
            },
            // ... matrix completa relazioni
        };
        
        return this.applyRelationshipEffects(relationships, questFactionId);
    }
    
    updateFactionReputation(factionId, change, reason = '') {
        const oldValue = state.factionReputation[factionId];
        state.factionReputation[factionId] = Math.max(-100, Math.min(100, oldValue + change));
        
        this.triggerReputationEvents(factionId, change, reason);
        this.calculateSpilloverEffects(factionId, change);
    }
}
```

### intelligence.js - Console Intelligence

**Responsabilità:**
- Gestione archivi dati da attacchi
- Interface laboratorio analisi
- Elaborazione intelligence raccolte
- Storage e categorizzazione dati

**Architettura Dati:**

```javascript
function renderIntelligencePage() {
    const dataArchives = state.dataArchives || [];
    
    return `
        <div class="intelligence-layout">
            <h2>Console di Intelligence</h2>
            <div class="data-archives">
                <h3>Archivi Dati Disponibili</h3>
                ${renderDataArchivesList(dataArchives)}
            </div>
            <div class="analysis-panel">
                ${renderAnalysisTools()}
            </div>
        </div>
    `;
}

// Gestione archivi dati
function processDataArchive(archiveId) {
    const archive = findArchiveById(archiveId);
    const analysisResults = performDataAnalysis(archive);
    
    // Update intelligence database
    state.analysisResults[archiveId] = analysisResults;
    
    // Generate actionable intelligence
    generateIntelligenceReports(analysisResults);
}
```

### active_attacks.js - Monitoring Real-Time

**Responsabilità:**
- Tracking operazioni attive in tempo reale
- Progress monitoring per attacchi lunghi
- Integration con host infection dalla risoluzione
- Display stato attacchi nel world panel

**Sistema Monitoring:**

```javascript
function updateActiveAttacks() {
    if (state.activePage !== 'world') {
        clearActiveAttacksDisplay();
        return;
    }
    renderActiveAttacksPanel();
}

function renderActiveAttacksPanel() {
    const attacks = state.activeAttacks || [];
    
    attacks.forEach(attack => {
        const elapsedTime = (Date.now() - attack.startTime) / 1000;
        const remainingTime = Math.max(0, attack.finalTime - elapsedTime);
        const progressPercentage = Math.min(100, (elapsedTime / attack.finalTime) * 100);
        
        renderAttackProgress(attack, progressPercentage, remainingTime);
    });
}

// Integration con host infection
function resolveAttackSuccess(attack) {
    if (attack.type === 'botnet_infection') {
        const newHost = generateInfectedHost(attack.target);
        state.infectedHostPool.push(newHost);
        showNotification(`Nuovo host infetto: ${newHost.ip}`, 'success');
    }
}
```

### admin.js - Pannello Amministrativo

**Responsabilità:**
- Controlli debug completi per sviluppo
- Manipolazione stato di gioco
- Testing funzionalità
- Reset selettivi sistema

**Controlli Debug:**

```javascript
// Controlli economia
function setGameValues() {
    const btcAmount = parseFloat(document.getElementById('admin-btc').value);
    const xmrAmount = parseFloat(document.getElementById('admin-xmr').value);
    const talentPoints = parseInt(document.getElementById('admin-talent-points').value);
    
    state.btcBalance = btcAmount;
    state.xmrBalance = xmrAmount;
    state.talentPoints = talentPoints;
    
    updateUI();
    saveState();
}

// Controlli fazioni
function boostAllFactions() {
    Object.keys(state.factionReputation).forEach(factionId => {
        state.factionReputation[factionId] += 150;
    });
    showNotification('Boost +150 XP applicato a tutte le fazioni', 'success');
}

// Reset selettivi
function resetBotnet() {
    state.infectedHostPool = [];
    state.botnetGroups = {};
    state.activeDDoSAttacks = [];
    state.activeMiningOperation = null;
    
    showNotification('Botnet reset completato', 'info');
}
```

## 🔗 Interazioni tra Moduli

### Pattern di Comunicazione

1. **Event-Driven Communication**
   ```javascript
   // Modulo A emette evento
   document.dispatchEvent(new CustomEvent('talentAcquired', {
       detail: { talentName, level }
   }));
   
   // Modulo B ascolta evento
   document.addEventListener('talentAcquired', (event) => {
       updateAvailableBlocks(event.detail);
   });
   ```

2. **Shared State Access**
   ```javascript
   // Accesso diretto allo stato globale
   function updateUI() {
       if (state.talentPoints > 0) {
           enableTalentPurchases();
       }
   }
   ```

3. **Function Exports**
   ```javascript
   // Moduli espongono funzioni globali
   window.editorFunctions = {
       saveFlow,
       loadFlow,
       validateFlow
   };
   ```

### Dependency Graph Aggiornato

```
main.js
├── data.js (config)
├── flow_logic.js (validation)
└── modules/
    ├── hq.js → market.js (hardware info)
    ├── world.js → active_attacks.js (attack monitoring)
    ├── botnet.js → intelligence.js (data from attacks)
    ├── editor.js → flow_logic.js (validation DDoS flows)
    ├── profile.js → data.js (talent tree)
    ├── quests.js → factions.js (faction-based quests)
    ├── factions.js → reputation_system.js (reputation effects)
    ├── reputation_system.js → ALL (faction interactions)
    └── admin.js → ALL (debug controls)
```

### Data Flow Patterns Avanzati

1. **DDoS Attack Flow**
   ```
   User selects bot groups → botnet.js validates selection → 
   editor.js provides DDoS flow → botnet.js calculates impact →
   active_attacks.js monitors progress → intelligence.js processes results
   ```

2. **Faction Reputation Flow**
   ```
   Quest completed → quests.js determines faction → 
   reputation_system.js calculates spillover → factions.js updates standing →
   ALL modules check faction requirements
   ```

3. **Intelligence Data Flow**
   ```
   Attack succeeds → active_attacks.js generates data →
   intelligence.js archives results → User analyzes in lab →
   Insights affect future strategy
   ```

### Module Template Esteso

```javascript
// modules/new_advanced_module.js

// State management
let moduleState = {
    // Module-specific state
};

// Main render function
function renderNewAdvancedModulePage() {
    const container = document.getElementById('app-container');
    container.innerHTML = generateModuleHTML();
    initModuleListeners();
    
    // Integration points
    subscribeToGlobalEvents();
    updateModuleFromGlobalState();
}

// Event integration
function subscribeToGlobalEvents() {
    document.addEventListener('stateChanged', handleStateChange);
    document.addEventListener('factionUpdate', handleFactionChange);
}

// Public API
window.newAdvancedModuleFunctions = {
    // Public functions for inter-module communication
    getModuleData: () => moduleState,
    processExternalData: (data) => processData(data),
    resetModule: () => resetModuleState()
};

// Cross-module integration
function integrateWithOtherModules() {
    // Check for dependencies
    if (typeof factionFunctions !== 'undefined') {
        // Use faction system
    }
    
    if (typeof reputationSystem !== 'undefined') {
        // Integrate with reputation
    }
}
```

---

*Documentazione completa dei moduli del sistema Hacker Tycoon con focus sulle nuove funzionalità avanzate*