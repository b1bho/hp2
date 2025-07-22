# Documentazione Moduli 📦

Questa documentazione fornisce una panoramica dettagliata di tutti i moduli del sistema Hacker Tycoon, analizzando le loro funzionalità, API e interazioni.

## 📋 Indice

- [Moduli Core](#moduli-core)
- [Moduli Interfaccia](#moduli-interfaccia)
- [Moduli Logica Business](#moduli-logica-business)
- [Moduli Dati](#moduli-dati)
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

### botnet.js - Gestione Botnet

**Responsabilità:**
- Management host infetti
- Orchestrazione attacchi distribuiti
- Statistiche aggregate botnet
- Grouping e controllo host

**Architettura:**

```javascript
function renderInfectedHostsList() {
    const hosts = state.infectedHostPool;
    hosts.forEach(host => {
        renderSingleHost(host);
    });
}

function renderSingleHost(host) {
    // Visualizza: IP, location, status, capabilities
    return `
        <div class="host-card" data-host-id="${host.id}">
            <div class="host-info">
                <span class="host-ip">${host.ip}</span>
                <span class="host-location">${host.location}</span>
            </div>
            <div class="host-stats">
                CPU: ${host.resources.cpuPower}
                RAM: ${host.resources.ram}MB
            </div>
        </div>
    `;
}

function updateBotnetAggregateStats() {
    const totalHosts = state.infectedHostPool.length;
    const activeHosts = hosts.filter(h => h.status === 'Active').length;
    const aggregatePower = calculateTotalPower();
}
```

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

### Dependency Graph

```
main.js
├── data.js (config)
├── flow_logic.js (validation)
└── modules/
    ├── hq.js → market.js (hardware info)
    ├── world.js → botnet.js (attack routing)
    ├── editor.js → flow_logic.js (validation)
    ├── profile.js → data.js (talent tree)
    └── quests.js → ALL (progress tracking)
```

### Data Flow Patterns

1. **User Action → State Update → UI Refresh**
2. **Timer Event → Data Calculation → Notification**
3. **Module Init → Data Load → Event Binding**

## 🧪 Extensibility Points

### Adding New Modules

1. Create module file in `/modules/`
2. Implement standard functions:
   - `render[ModuleName]Page()`
   - `init[ModuleName]Listeners()`
3. Register in navigation system
4. Add to main.js initialization

### Module Template

```javascript
// modules/new_module.js

function renderNewModulePage() {
    const container = document.getElementById('app-container');
    container.innerHTML = generateModuleHTML();
    initNewModuleListeners();
}

function initNewModuleListeners() {
    // Event bindings specific to this module
}

function generateModuleHTML() {
    return `<div class="new-module-layout">
        <!-- Module content -->
    </div>`;
}

// Export functions if needed
window.newModuleFunctions = {
    // Public API
};
```

---

*Documentazione completa dei moduli del sistema Hacker Tycoon*