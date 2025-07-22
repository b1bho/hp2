# Riferimento API 📚

Questa documentazione fornisce un riferimento completo di tutte le funzioni, variabili globali e API disponibili nel sistema Hacker Tycoon.

## 📋 Indice

- [Stato Globale](#stato-globale)
- [API Core](#api-core)
- [API Moduli](#api-moduli)
- [Utility Functions](#utility-functions)
- [Event System](#event-system)
- [Data Structures](#data-structures)

## 🌐 Stato Globale

### Variabile State

L'oggetto `state` contiene tutto lo stato persistente del gioco:

```javascript
let state = {
    // Profilo giocatore
    identity: {
        name: string,           // Nome hacker
        level: number,          // Livello attuale (1+)
        xp: number,            // Esperienza totale
        xpToNext: number,      // XP necessaria per prossimo livello
        realIp: string         // IP reale del giocatore
    },
    
    // Economia
    btcBalance: number,        // Saldo Bitcoin
    xmrBalance: number,        // Saldo Monero
    talentPoints: number,      // Punti talento disponibili
    currentBtcValue: number,   // Valore attuale BTC in USD
    
    // Progressione
    acquiredTalents: {         // Talenti acquisiti
        [talentName]: level    // es. "Social Engineering": 2
    },
    unlockedBlocks: string[],  // Blocchi sbloccati per editor
    
    // Studio
    currentStudy: {            // Studio in corso (null se nessuno)
        talent: string,        // Nome talento
        level: number,         // Livello target
        startTime: timestamp,  // Inizio studio
        duration: number       // Durata totale in ms
    },
    
    // Botnet
    infectedHostPool: HostData[], // Array host infetti
    
    // Editor
    savedFlows: FlowData[],    // Flussi salvati
    permanentFlows: FlowData[], // Flussi permanenti sistema
    
    // Hardware
    ownedHardware: {           // Hardware posseduto
        [itemId]: boolean      // es. "better-cpu": true
    },
    hardwareBonuses: BonusData, // Bonus calcolati da hardware
    
    // Sicurezza
    ipTraceability: {          // Tracciabilità per IP
        [ip]: number           // Punteggio tracciabilità 0-100
    },
    
    // Sistema
    currentPage: string,       // Pagina attiva
    activeQuests: QuestData[], // Quest attive
    completedQuests: string[], // ID quest completate
    clanBonuses: BonusData,    // Bonus clan (se implementato)
    gameSettings: {            // Impostazioni di gioco
        autoSave: boolean,
        notifications: boolean
    }
};
```

### Variabili Globali di Sistema

```javascript
// Navigation e UI
let currentPage = 'hq';          // Pagina corrente
let lines = [];                  // Linee editor (LeaderLine objects)
let startSocket = null;          // Socket di partenza drag

// Timers
const QUEST_CHECK_INTERVAL_MS = 15000;    // Controllo quest
const NEWS_TICKER_INTERVAL_MS = 8000;     // Aggiornamento news
const BTC_VALUE_UPDATE_INTERVAL_MS = 120000; // Aggiornamento BTC

// Editor
const GRID_SIZE = 20;            // Dimensione griglia editor

// DOM References (cached)
const appContainer = document.getElementById('app-container');
const btcBalanceEl = document.getElementById('btc-balance');
const xmrBalanceEl = document.getElementById('xmr-balance');
const talentPointsEl = document.getElementById('talent-points');
```

## ⚙️ API Core

### main.js - Funzioni Principali

#### Inizializzazione

```javascript
/**
 * Inizializza l'applicazione
 * Carica stato, imposta listeners, avvia timers
 */
function init(): void

/**
 * Carica stato da localStorage
 * Include gestione errori e fallback
 */
function loadState(): void

/**
 * Salva stato corrente in localStorage
 * Separa dati permanenti da temporanei
 */
function saveState(): void

/**
 * Reset completo stato di gioco
 * Conferma utente richiesta
 */
function resetGameState(): void
```

#### Navigazione

```javascript
/**
 * Mostra pagina specifica
 * @param {string} pageName - Nome pagina da mostrare
 */
function showPage(pageName: string): void

/**
 * Aggiorna stato bottoni navigazione
 * Evidenzia pagina attiva
 */
function updateNavButtons(): void

/**
 * Inizializza event listeners comuni
 * Navigation, reset, modal management
 */
function initCommonListeners(): void
```

#### Sistema Notifiche

```javascript
/**
 * Mostra notifica toast
 * @param {string} message - Messaggio da mostrare
 * @param {string} type - Tipo: 'info'|'success'|'error'|'warning'
 */
function showNotification(message: string, type: string = 'info'): void
```

#### Timers e Aggiornamenti

```javascript
/**
 * Avvia tutti i timer di gioco
 * Quest check, news ticker, BTC updates
 */
function startGameTimers(): void

/**
 * Aggiorna valore Bitcoin
 * Simulazione mercato con volatilità
 */
function updateBtcValue(): void

/**
 * Controlla completamento quest attive
 * Chiamata periodica automatica
 */
function checkQuests(): void
```

### Utility Functions

#### Progressione e XP

```javascript
/**
 * Calcola XP necessaria per livello
 * @param {number} level - Livello target
 * @returns {number} XP richiesta
 */
function getXpForLevel(level: number): number

/**
 * Aggiunge XP al giocatore
 * Gestisce level-up automatico
 * @param {number} xp - XP da aggiungere
 */
function addXp(xp: number): void

/**
 * Calcola livello basato su XP totale
 * @param {number} totalXp - XP totale
 * @returns {number} Livello corrispondente
 */
function calculateLevel(totalXp: number): number
```

#### Talenti

```javascript
/**
 * Verifica se talento può essere acquisito
 * @param {string} talentName - Nome talento
 * @param {number} level - Livello target
 * @returns {boolean} True se acquisibile
 */
function canAcquireTalent(talentName: string, level: number): boolean

/**
 * Acquisisce talento specificato
 * @param {string} talentName - Nome talento
 * @param {number} level - Livello da acquisire
 * @returns {boolean} True se successo
 */
function acquireTalent(talentName: string, level: number): boolean

/**
 * Ottiene livello attuale di un talento
 * @param {string} talentName - Nome talento
 * @returns {number} Livello attuale (0 se non acquisito)
 */
function getTalentLevel(talentName: string): number
```

## 🔧 API Moduli

### hq.js - Quartier Generale

```javascript
/**
 * Renderizza pagina HQ
 * Include stats, hardware, news
 */
function renderHqPage(): void

/**
 * Renderizza statistiche computer
 * Hardware bonuses, global bonuses
 */
function renderComputerStats(): void

/**
 * Inizializza listeners specifici HQ
 * Hardware management, news interaction
 */
function initHqListeners(): void

/**
 * Aggiorna news ticker
 * Rotazione automatica notizie
 */
function updateNewsTicker(): void
```

### world.js - Mappa Mondiale

```javascript
/**
 * Inizializza globo 3D
 * Setup Three.js scene, camera, renderer
 */
function initGlobe(): void

/**
 * Renderizza lista nazioni
 * Include statistiche e target disponibili
 */
function renderNationsList(): void

/**
 * Mostra dettagli target specifico
 * @param {string} nationId - ID nazione
 * @param {string} targetId - ID target
 */
function renderTargetDetails(nationId: string, targetId: string): void

/**
 * Aggiunge marker nazione su globo
 * @param {Object} nation - Dati nazione
 * @param {THREE.Scene} scene - Scena Three.js
 */
function addNationMarker(nation: Object, scene: THREE.Scene): void

/**
 * Renderizza statistiche live globali
 * Attack rates, data transfer, vulnerabilities
 */
function renderLiveStats(): void

/**
 * Gestisce selezione target per attacco
 * @param {string} targetId - ID target selezionato
 */
function selectAttackTarget(targetId: string): void
```

### botnet.js - Gestione Botnet

```javascript
/**
 * Renderizza lista host infetti
 * Con filtri e sorting options
 */
function renderInfectedHostsList(): void

/**
 * Renderizza dettagli singolo host
 * @param {Object} host - Dati host
 */
function renderSingleHost(host: HostData): void

/**
 * Aggiorna statistiche aggregate botnet
 * Total hosts, active hosts, aggregate power
 */
function updateBotnetAggregateStats(): void

/**
 * Seleziona host per operazioni
 * @param {string} hostId - ID host
 * @param {boolean} selected - Stato selezione
 */
function toggleHostSelection(hostId: string, selected: boolean): void

/**
 * Lancia attacco DDoS con host selezionati
 * @param {string} targetId - Target dell'attacco
 * @param {string[]} hostIds - Host da utilizzare
 */
function launchDDoSAttack(targetId: string, hostIds: string[]): void
```

### editor.js - Editor Flussi

```javascript
/**
 * Renderizza editor flussi
 * Include palette blocchi e canvas
 */
function renderEditorPage(): void

/**
 * Inizializza sistema drag-and-drop
 * Interact.js setup per blocchi e connessioni
 */
function initDragAndDrop(): void

/**
 * Aggiunge blocco al canvas
 * @param {string} blockType - Tipo di blocco
 * @param {number} x - Posizione X
 * @param {number} y - Posizione Y
 */
function addBlockToCanvas(blockType: string, x: number, y: number): void

/**
 * Crea connessione tra blocchi
 * @param {string} sourceId - ID blocco sorgente
 * @param {string} targetId - ID blocco destinazione
 */
function createConnection(sourceId: string, targetId: string): void

/**
 * Valida flusso corrente
 * @returns {Object} Risultato validazione {isValid, errors}
 */
function validateCurrentFlow(): {isValid: boolean, errors: string[]}

/**
 * Salva flusso corrente
 * @param {string} flowName - Nome flusso
 */
function saveCurrentFlow(flowName: string): void

/**
 * Carica flusso salvato
 * @param {string} flowId - ID flusso da caricare
 */
function loadSavedFlow(flowId: string): void
```

### market.js - Mercato

```javascript
/**
 * Renderizza pagina mercato
 * Include categorie e filtri
 */
function renderMarketPage(): void

/**
 * Renderizza categoria specifica
 * @param {string} category - Categoria da mostrare
 */
function renderMarketCategory(category: string): void

/**
 * Gestisce acquisto articolo
 * @param {string} itemId - ID articolo
 * @param {string} itemType - Tipo articolo
 * @param {string} currency - Valuta ('btc'|'xmr')
 * @returns {boolean} True se acquisto riuscito
 */
function purchaseItem(itemId: string, itemType: string, currency: string): boolean

/**
 * Verifica se può permettersi articolo
 * @param {number} cost - Costo articolo
 * @param {string} currency - Valuta
 * @returns {boolean} True se può permetterselo
 */
function canAfford(cost: number, currency: string): boolean
```

### profile.js - Profilo e Talenti

```javascript
/**
 * Renderizza pagina profilo
 * Include stats e albero talenti
 */
function renderProfilePage(): void

/**
 * Renderizza albero talenti
 * Con stato acquisizioni e disponibilità
 */
function renderTalentTree(): void

/**
 * Renderizza singolo ramo talenti
 * @param {string} branchName - Nome ramo
 * @param {Object} branchData - Dati ramo
 */
function renderTalentBranch(branchName: string, branchData: Object): void

/**
 * Inizia studio di un talento
 * @param {string} talentName - Nome talento
 * @param {number} level - Livello da studiare
 */
function startStudying(talentName: string, level: number): void

/**
 * Aggiorna barra progresso studio
 * Chiamata periodicamente durante studio
 */
function updateStudyProgress(): void

/**
 * Completa studio corrente
 * Acquisisce talento e aggiorna UI
 */
function completeCurrentStudy(): void
```

## 🛠️ Data Structures

### HostData

```javascript
interface HostData {
    id: string;                    // ID unico host
    ip: string;                    // Indirizzo IP
    location: string;              // Posizione geografica
    infectionDate: number;         // Timestamp infezione
    status: 'Active'|'Inactive'|'Compromised';
    resources: {
        cpuPower: number;          // Potenza CPU in GHz
        ram: number;               // RAM in MB
        bandwidth: number;         // Banda in Mbps
    };
    capabilities: string[];        // Capacità disponibili
    riskLevel: 'Low'|'Medium'|'High';
    lastContact: number;           // Ultimo contatto
}
```

### FlowData

```javascript
interface FlowData {
    id: string;                    // ID unico flusso
    name: string;                  // Nome flusso
    blocks: {
        [blockId]: {
            type: string;          // Tipo blocco
            x: number;             // Posizione X
            y: number;             // Posizione Y
            settings: Object;      // Configurazioni blocco
        }
    };
    connections: {
        source: string;            // ID blocco sorgente
        target: string;            // ID blocco target
    }[];
    metadata: {
        created: number;           // Timestamp creazione
        lastModified: number;      // Ultima modifica
        category: string;          // Categoria flusso
    };
}
```

### BonusData

```javascript
interface BonusData {
    studyTimeModifier: number;     // Moltiplicatore tempo studio (0.8 = -20%)
    toolStatModifiers: {
        eo: number;                // Efficienza Operazionale bonus
        rc: number;                // Robustezza Codice bonus
    };
    economyBonuses: {
        btcMiningRate: number;     // Bonus mining BTC
        xmrMiningRate: number;     // Bonus mining XMR
        marketDiscount: number;    // Sconto acquisti
    };
}
```

### QuestData

```javascript
interface QuestData {
    id: string;                    // ID unico quest
    name: string;                  // Nome quest
    description: string;           // Descrizione
    type: 'tutorial'|'main'|'side'|'daily';
    objectives: {
        description: string;       // Descrizione obiettivo
        completed: boolean;        // Stato completamento
        checkCondition: () => boolean; // Funzione verifica
    }[];
    rewards: {
        xp: number;               // XP ricompensa
        btc: number;              // BTC ricompensa
        xmr: number;              // XMR ricompensa
        talentPoints: number;     // Punti talento
        items: string[];          // Articoli ricompensa
    };
    requirements: {
        level: number;            // Livello minimo
        talents: string[];        // Talenti richiesti
        completedQuests: string[]; // Quest prerequisite
    };
}
```

## 🎯 Event System

### Eventi Personalizzati

```javascript
// Acquisizione talento
document.dispatchEvent(new CustomEvent('talentAcquired', {
    detail: { 
        talentName: string,
        level: number,
        newAbilities: string[]
    }
}));

// Completamento quest
document.dispatchEvent(new CustomEvent('questCompleted', {
    detail: { 
        questId: string,
        rewards: Object
    }
}));

// Cambio pagina
document.dispatchEvent(new CustomEvent('pageChanged', {
    detail: { 
        from: string,
        to: string
    }
}));

// Attacco completato
document.dispatchEvent(new CustomEvent('attackCompleted', {
    detail: { 
        targetId: string,
        success: boolean,
        rewards: Object,
        traceback: number
    }
}));
```

### Event Listeners Setup

```javascript
// Ascolto eventi global
document.addEventListener('talentAcquired', (event) => {
    const { talentName, level } = event.detail;
    updateAvailableBlocks();
    showNotification(`Talento acquisito: ${talentName} LV${level}`, 'success');
});

document.addEventListener('questCompleted', (event) => {
    const { rewards } = event.detail;
    addXp(rewards.xp);
    state.btcBalance += rewards.btc;
    updateBalanceDisplay();
});
```

## 🔍 Debugging API

### Funzioni Helper Debug

```javascript
// Esposte in window per console debugging
window.debugHelpers = {
    /**
     * Mostra stato corrente formattato
     */
    showState: () => console.table(state),
    
    /**
     * Aggiunge XP per testing
     * @param {number} amount - XP da aggiungere
     */
    addXP: (amount) => addXp(amount),
    
    /**
     * Aggiunge valuta per testing
     * @param {string} currency - 'btc'|'xmr'
     * @param {number} amount - Quantità
     */
    addCurrency: (currency, amount) => {
        state[`${currency}Balance`] += amount;
        saveState();
    },
    
    /**
     * Sblocca tutti i talenti
     */
    unlockAllTalents: () => {
        Object.keys(talentData).forEach(branch => {
            Object.keys(talentData[branch].talents).forEach(talent => {
                const maxLevel = talentData[branch].talents[talent].levels.length;
                state.acquiredTalents[talent] = maxLevel;
            });
        });
    },
    
    /**
     * Trigger evento personalizzato
     * @param {string} eventName - Nome evento
     * @param {Object} detail - Dati evento
     */
    triggerEvent: (eventName, detail) => {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
};
```

---

*Riferimento completo delle API del sistema Hacker Tycoon*