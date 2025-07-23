# Architettura del Codice 🏗️

Questo documento descrive l'architettura software di Hacker Tycoon, analizzando la struttura del codice, i pattern utilizzati e le decisioni di design.

## 📋 Indice

- [Panoramica Architetturale](#panoramica-architetturale)
- [Struttura dei File](#struttura-dei-file)
- [Pattern di Design](#pattern-di-design)
- [Gestione dello Stato](#gestione-dello-stato)
- [Architettura Modulare](#architettura-modulare)
- [Flusso dei Dati](#flusso-dei-dati)
- [Rendering e UI](#rendering-e-ui)
- [Persistenza](#persistenza)

## 🔍 Panoramica Architetturale

Hacker Tycoon implementa un'architettura **Single Page Application (SPA)** basata su JavaScript vanilla, strutturata secondo i seguenti principi:

- **Modulare**: Ogni funzionalità è incapsulata in moduli separati
- **Orientata agli Eventi**: Comunicazione tra componenti tramite eventi
- **Basata su Stato**: Stato globale centralizzato con persistenza locale
- **Reattiva**: UI che si aggiorna automaticamente ai cambiamenti di stato

### Architettura Layered

```
┌─────────────────────────────────────┐
│           Presentation Layer        │  ← UI Components & Event Handlers
├─────────────────────────────────────┤
│           Application Layer         │  ← Business Logic & Game Mechanics
├─────────────────────────────────────┤
│             Data Layer              │  ← State Management & Persistence
└─────────────────────────────────────┘
```

## 📁 Struttura dei File

### File Principali

| File | Responsabilità | Dimensione Approssimativa |
|------|----------------|---------------------------|
| `index.html` | Entry point e struttura base | ~90 righe |
| `main.js` | Coordinamento generale e inizializzazione | ~800 righe |
| `data.js` | Definizioni di configurazione e talenti | ~500 righe |
| `flow_logic.js` | Logica dell'editor di flussi | ~400 righe |
| `flow_validation.js` | Validazione flussi di attacco | ~200 righe |

### Moduli Specializzati

| Modulo | Funzione | Complessità |
|--------|----------|-------------|
| `hq.js` | Quartier generale e statistiche | Media |
| `world.js` | Mappa 3D e target globali | Alta |
| `botnet.js` | Gestione botnet multi-tab (Management/DDoS/Mining) | Molto Alta |
| `editor.js` | Editor drag-and-drop con validazione | Molto Alta |
| `market.js` | Mercato legale | Media |
| `dark_market.js` | Mercato nero | Media |
| `profile.js` | Sistema profilo e talenti | Media |
| `quests.js` | Sistema missioni | Bassa |
| `factions.js` | Sistema fazioni multi-level | Alta |
| `reputation_system.js` | Gestione reputazione avanzata | Alta |
| `intelligence.js` | Console intelligence e laboratorio dati | Media |
| `active_attacks.js` | Monitoring attacchi real-time | Alta |
| `admin.js` | Pannello amministrativo e debug | Media |

## 🎨 Pattern di Design

### 1. Module Pattern

Ogni modulo espone funzioni specifiche mantenendo privato lo stato interno:

```javascript
// Esempio da hq.js
function renderHqPage() {
    // Logica di rendering
}

function initHqListeners() {
    // Event listeners specifici
}
```

### 2. Observer Pattern

Sistema di notifiche per eventi del gioco:

```javascript
function showNotification(message, type = 'info') {
    // Gestione notifiche centralizzata
}
```

### 3. State Machine Pattern

Gestione stati dell'applicazione attraverso currentPage:

```javascript
const navigationStates = {
    'hq': renderHqPage,
    'world': renderWorldPage,
    'botnet': renderBotnetPage,
    // ...
};
```

### 4. Command Pattern

Flussi di attacco come sequenze di comandi:

```javascript
const blockCategories = {
    'access': [...],
    'acquisition': [...],
    'exfiltration': [...]
};
```

## 🗄️ Gestione dello Stato

### Stato Globale Centralizzato

Lo stato dell'applicazione è mantenuto in un oggetto JavaScript globale:

```javascript
let state = {
    // Profilo giocatore
    identity: {
        name: "Anonymous",
        level: 1,
        xp: 0,
        xpToNext: 100,
        realIp: "192.168.1.1"
    },
    
    // Economia
    btcBalance: 0,
    xmrBalance: 1000,
    talentPoints: 0,
    currentBtcValue: 50000,
    
    // Talenti acquisiti
    acquiredTalents: {},
    unlockedBlocks: [],
    
    // Botnet avanzata
    infectedHostPool: [],
    botnetGroups: {},           // Organizzazione host in gruppi
    activeDDoSAttacks: [],      // Attacchi DDoS attivi
    activeMiningOperation: {},  // Operazioni mining
    
    // Flussi salvati
    savedFlows: [],
    permanentFlows: {},
    
    // Hardware posseduto
    ownedHardware: {},
    
    // Sistema fazioni
    factionReputation: {
        governmental: 0,
        terrorist: 0,
        eco_terrorist: 0,
        population: 0
    },
    
    // Intelligence
    dataArchives: [],
    analysisResults: {},
    
    // Tracciabilità IP
    ipTraceability: {},
    
    // Operazioni attive
    activeAttacks: [],
    studyProgress: null
};
```

### Caratteristiche dello Stato

1. **Reattivo**: Modifiche allo stato scatenano aggiornamenti UI
2. **Persistente**: Salvato automaticamente in LocalStorage
3. **Versionato**: Gestione compatibilità versioni precedenti
4. **Validato**: Controlli di integrità al caricamento

## 🧩 Architettura Modulare

### Moduli Core

#### main.js - Orchestrator
- Inizializzazione applicazione
- Gestione navigazione
- Coordinamento moduli
- Salvataggio/caricamento stato

#### data.js - Configuration
- Definizioni talenti
- Configurazioni di gioco
- Costanti e parametri

#### flow_logic.js - Business Logic
- Logica flussi di attacco
- Categorie blocchi
- Validazioni

### Moduli Funzionali

#### editor.js - Flow Editor
```javascript
// Gestione drag-and-drop
interact('.flow-block').draggable({
    // Configurazione interazioni
});

// Sistema a griglia per posizionamento
const GRID_SIZE = 20;
```

#### world.js - 3D Visualization
```javascript
// Three.js scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
```

#### botnet.js - Network Management
```javascript
// Gestione host infetti
function updateBotnetAggregateStats() {
    // Calcolo statistiche aggregate
}
```

## 🔄 Flusso dei Dati

### Data Flow Architecture

```
User Input → Event Handler → State Update → UI Re-render
     ↑                                            ↓
     └─────────── LocalStorage Persistence ←──────┘
```

### Ciclo di Vita dei Dati

1. **Input Utente**: Click, drag, form submission
2. **Event Handling**: Gestori eventi specifici per modulo
3. **State Mutation**: Aggiornamento stato centralizzato
4. **Validation**: Controlli integrità e business rules
5. **Persistence**: Salvataggio automatico LocalStorage
6. **UI Update**: Re-rendering componenti interessati

### Esempio di Flusso Completo

```javascript
// 1. User clicks on talent
document.addEventListener('click', (event) => {
    // 2. Event handler processes action
    if (event.target.classList.contains('talent-btn')) {
        const talentId = event.target.dataset.talentId;
        
        // 3. State validation
        if (canAcquireTalent(talentId)) {
            // 4. State update
            acquireTalent(talentId);
            
            // 5. Persistence
            saveState();
            
            // 6. UI update
            renderTalentTree();
        }
    }
});
```

## 🖥️ Rendering e UI

### Rendering Strategy

**Imperative DOM Manipulation**: Utilizzo diretto delle DOM API per massimo controllo e performance.

```javascript
function renderHqPage() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
        <div class="hq-layout">
            ${generateStatsCards()}
            ${generateHardwareList()}
        </div>
    `;
    attachHqEventListeners();
}
```

### UI Components Pattern

1. **Generate HTML**: Template strings per struttura
2. **Attach Events**: Event listeners post-render
3. **Update State**: Modifiche basate su interazioni
4. **Re-render**: Aggiornamento selettivo componenti

### Styling Architecture

- **Utility-First**: Tailwind CSS per rapid prototyping
- **Custom CSS**: Componenti specifici in style.css
- **Responsive**: Design mobile-first
- **Theme Consistency**: Palette colori cyberpunk

## 💾 Persistenza

### LocalStorage Strategy

```javascript
function saveState() {
    const { permanentFlows, ...gameState } = state;
    localStorage.setItem('hackerAppState', JSON.stringify(gameState));
    localStorage.setItem('hackerAppPermanentFlows', JSON.stringify(permanentFlows));
}

function loadState() {
    const savedState = localStorage.getItem('hackerAppState');
    if (savedState) {
        try {
            const loadedState = JSON.parse(savedState);
            state = deepMerge(state, loadedState);
        } catch (e) {
            console.error("Errore nel parsing dello stato");
            localStorage.removeItem('hackerAppState');
        }
    }
}
```

### Caratteristiche Persistenza

- **Automatic**: Salvataggio automatico ad ogni modifica significativa
- **Robust**: Gestione errori e recovery
- **Versioned**: Compatibilità versioni precedenti
- **Selective**: Separazione dati permanenti e temporanei

## 🔧 Considerazioni Tecniche

### Performance

- **Lazy Loading**: Moduli caricati solo quando necessari
- **Event Delegation**: Gestori eventi ottimizzati
- **DOM Caching**: Reference DOM elementi frequentemente usati
- **Throttling**: Limitazione frequenza aggiornamenti

### Scalabilità

- **Modular Design**: Facilita aggiunta nuove funzionalità
- **State Management**: Centralizzato e prevedibile
- **Separation of Concerns**: Logica separata da presentazione
- **Configuration Driven**: Parametri facilmente modificabili

### Maintainability

- **Consistent Naming**: Convenzioni denominavzione uniformi
- **Documentation**: Commenti estensivi nel codice
- **Error Handling**: Gestione robusta eccezioni
- **Testing Hooks**: Funzioni esposte per testing

---

*Documentazione aggiornata per riflettere l'architettura corrente del sistema*