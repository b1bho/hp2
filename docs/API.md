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
    xmrBalance: number,        // Saldo Monero (default 1000)
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
    
    // Botnet Avanzata
    infectedHostPool: [{       // Pool host infetti
        id: string,
        ip: string,
        location: string,
        status: string,        // "Active|Inactive|Compromised"
        resources: {
            cpuPower: number,  // GHz
            ram: number,       // MB
            bandwidth: number  // Mbps
        },
        capabilities: string[],
        riskLevel: string,
        groupId: string        // Assegnazione gruppo
    }],
    
    botnetGroups: {            // Organizzazione bot in gruppi
        [groupName]: {
            name: string,
            hostIds: string[],
            currentActivity: string, // "Idle|DDoSing|Mining"
            createdDate: timestamp
        }
    },
    
    activeDDoSAttacks: [{      // Attacchi DDoS attivi
        id: string,
        target: string,        // IP target
        botGroups: string[],   // Gruppi utilizzati
        flow: object,          // Flusso DDoS utilizzato
        startTime: timestamp,
        duration: number,      // Durata in secondi
        estimatedImpact: number,
        status: string         // "active|completed|failed"
    }],
    
    activeMiningOperation: {   // Operazione mining attiva
        groups: string[],      // Gruppi mining
        startTime: timestamp,
        hashrate: number,      // GFLOPS totali
        estimatedReward: number // XMR/ora stimato
    },
    
    // Sistema Fazioni
    factionReputation: {       // Reputazione per fazione (-100 a +100)
        governmental: number,
        terrorist: number,
        eco_terrorist: number,
        population: number
    },
    
    // Intelligence
    dataArchives: [{           // Archivi dati raccolti
        id: string,
        name: string,
        source: string,        // Fonte dei dati
        dateAcquired: timestamp,
        dataType: string,      // Tipo dati
        size: string,          // Dimensione
        purity: number,        // % utilizzabile (0-100)
        analysisStatus: string, // "pending|in_progress|completed"
        marketValue: number    // Valore XMR
    }],
    
    analysisResults: {         // Risultati analisi intelligence
        [archiveId]: {
            insights: string[],
            crossReferences: string[],
            actionableIntel: string[]
        }
    },
    
    // Operazioni Attive
    activeAttacks: [{          // Attacchi in corso monitoraggio
        id: string,
        type: string,          // Tipo attacco
        target: object,        // Dati target
        startTime: timestamp,
        finalTime: number,     // Tempo totale
        status: string,
        progress: number       // 0-100%
    }],
    
    // Altri stati esistenti
    savedFlows: array,         // Flussi salvati
    permanentFlows: object,    // Flussi permanenti sistema
    ownedHardware: object,     // Hardware posseduto
    ipTraceability: object,    // Tracciabilità IP
    hardwareBonuses: object,   // Bonus hardware calcolati
    clanBonuses: object        // Bonus clan (placeholder)
};
```
    
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

### botnet.js - Gestione Botnet Avanzata

```javascript
/**
 * Inizializza sistema botnet multi-tab
 */
function initBotnetPage(): void

/**
 * Switch tra tab botnet
 * @param {string} tabName - Nome tab ('management'|'ddos'|'mining')
 */
function switchTab(tabName: string): void

/**
 * Crea nuovo bot group
 * @param {string} groupName - Nome gruppo
 * @param {string[]} hostIds - Array ID host
 */
function createBotGroup(groupName: string, hostIds: string[]): void

/**
 * Calcola potenza totale gruppo
 * @param {Object} group - Oggetto gruppo
 * @returns {number} Potenza in GFLOPS
 */
function calculateGroupPower(group: Object): number

/**
 * Configura attacco DDoS
 * @param {Object} config - Configurazione attacco
 * @returns {Object} Configurazione validata
 */
function configureDDoSAttack(config: Object): Object

/**
 * Lancia attacco DDoS coordinato
 * @param {Object} attackConfig - Configurazione attacco
 * @returns {string} ID attacco
 */
function launchDDoSAttack(attackConfig: Object): string

/**
 * Calcola impatto attacco DDoS
 * @param {Object} config - Configurazione attacco
 * @returns {number} Impatto stimato
 */
function calculateAttackImpact(config: Object): number

/**
 * Avvia operazione mining
 * @param {string[]} selectedGroups - Gruppi selezionati
 */
function startMiningOperation(selectedGroups: string[]): void

/**
 * Calcola reward mining
 * @param {string[]} groups - Gruppi mining
 * @returns {number} XMR/ora stimato
 */
function calculateMiningReward(groups: string[]): number
```

### factions.js - Sistema Fazioni

```javascript
/**
 * Definizioni fazioni disponibili
 */
const FACTIONS: {
    GOVERNMENTAL: FactionData,
    TERRORIST: FactionData,
    ECO_TERRORIST: FactionData,
    POPULATION: FactionData
}

/**
 * Aggiorna reputazione fazione con spillover
 * @param {string} factionId - ID fazione
 * @param {number} change - Cambiamento reputazione
 * @param {string} reason - Motivo cambiamento
 */
function updateFactionReputation(factionId: string, change: number, reason?: string): void

/**
 * Calcola effetti spillover tra fazioni
 * @param {string} sourceFactionId - Fazione origine
 * @param {number} change - Cambiamento origine
 */
function calculateSpilloverEffects(sourceFactionId: string, change: number): void

/**
 * Controlla accesso basato su reputazione
 * @param {string} factionId - ID fazione
 * @param {number} minimumReputation - Reputazione minima richiesta
 * @returns {boolean} Access consentito
 */
function checkFactionAccess(factionId: string, minimumReputation: number): boolean

/**
 * Ottieni relazioni fazione
 * @param {string} factionId - ID fazione
 * @returns {Object} Matrix relazioni con altre fazioni
 */
function getFactionRelationships(factionId: string): Object
```

### intelligence.js - Console Intelligence

```javascript
/**
 * Renderizza pagina intelligence
 */
function renderIntelligencePage(): void

/**
 * Crea nuovo archivio dati
 * @param {Object} attackResult - Risultato attacco
 * @returns {string} ID archivio creato
 */
function createDataArchive(attackResult: Object): string

/**
 * Avvia analisi archivio dati
 * @param {string} archiveId - ID archivio
 */
function analyzeDataArchive(archiveId: string): void

/**
 * Esegue analisi dati e genera insights
 * @param {Object} archive - Archivio dati
 * @returns {Object} Risultati analisi
 */
function performDataAnalysis(archive: Object): Object

/**
 * Genera insights actionable
 * @param {Object} archive - Archivio dati
 * @returns {string[]} Array insights
 */
function generateInsights(archive: Object): string[]

/**
 * Trova cross-references tra archivi
 * @param {Object} archive - Archivio target
 * @returns {string[]} Array riferimenti incrociati
 */
function findCrossReferences(archive: Object): string[]
```

### active_attacks.js - Monitoring Real-Time

```javascript
/**
 * Aggiorna display attacchi attivi
 */
function updateActiveAttacks(): void

/**
 * Renderizza pannello attacchi attivi
 */
function renderActiveAttacksPanel(): void

/**
 * Registra nuovo attacco per monitoring
 * @param {Object} attackConfig - Configurazione attacco
 * @returns {string} ID attacco registrato
 */
function registerActiveAttack(attackConfig: Object): string

/**
 * Aggiorna progress attacco
 * @param {string} attackId - ID attacco
 */
function updateAttackProgress(attackId: string): void

/**
 * Risolve attacco completato
 * @param {Object} attack - Oggetto attacco
 */
function resolveAttack(attack: Object): void

/**
 * Genera host infetto da attacco riuscito
 * @param {Object} target - Target attacco
 * @returns {Object} Nuovo host infetto
 */
function generateInfectedHost(target: Object): Object
```

### admin.js - Pannello Amministrativo

```javascript
/**
 * Renderizza pannello admin
 */
function renderAdminPanel(): void

/**
 * Imposta valori economia
 * @param {number} btc - Saldo BTC
 * @param {number} xmr - Saldo XMR  
 * @param {number} talentPoints - Punti talento
 */
function setGameValues(btc: number, xmr: number, talentPoints: number): void

/**
 * Boost reputazione tutte fazioni
 * @param {number} amount - Quantità boost (default 150)
 */
function boostAllFactions(amount?: number): void

/**
 * Reset completo sistema botnet
 */
function resetBotnet(): void

/**
 * Reset sistema missioni
 */
function resetMissions(): void

/**
 * Sblocca tutto il mercato
 */
function unlockAllMarket(): void

/**
 * Test sistema notifiche
 */
function testNotifications(): void

/**
 * Aumenta livello giocatore
 * @param {number} levels - Livelli da aggiungere (default 1)
 */
function increaseLevels(levels?: number): void
```

### reputation_system.js - Gestione Reputazione

```javascript
/**
 * Classe principale sistema reputazione
 */
class ReputationSystem {
    /**
     * Inizializza sistema reputazione
     */
    init(): void
    
    /**
     * Calcola relazioni dinamiche tra fazioni
     * @param {string} questFactionId - ID fazione quest
     * @param {boolean} completedSuccessfully - Quest completata con successo
     * @returns {Object} Matrix effetti reputazione
     */
    calculateFactionRelationships(questFactionId: string, completedSuccessfully: boolean): Object
    
    /**
     * Aggiorna reputazione con gestione avanzata
     * @param {string} factionId - ID fazione
     * @param {number} change - Cambiamento reputazione
     * @param {string} reason - Motivo cambiamento
     */
    updateFactionReputation(factionId: string, change: number, reason?: string): void
    
    /**
     * Trigger eventi basati su reputazione
     * @param {string} factionId - ID fazione
     * @param {number} change - Cambiamento
     * @param {string} reason - Motivo
     */
    triggerReputationEvents(factionId: string, change: number, reason: string): void
    
    /**
     * Calcola modificatori prezzo basati su reputazione
     * @param {string} factionId - ID fazione venditore
     * @returns {number} Modificatore prezzo (0.0-2.0)
     */
    getPriceModifier(factionId: string): number
}
```

---

*Riferimento completo delle API del sistema Hacker Tycoon*