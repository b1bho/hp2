# Meccaniche di Gioco 🎮

Questa documentazione descrive in dettaglio tutte le meccaniche di gioco di Hacker Tycoon, fornendo una guida completa per comprendere il funzionamento del simulatore.

## 📋 Indice

- [Sistema di Progressione](#sistema-di-progressione)
- [Economia del Gioco](#economia-del-gioco)
- [Sistema Talenti](#sistema-talenti)
- [Editor di Flussi](#editor-di-flussi)
- [Sistema Botnet](#sistema-botnet)
- [Mappa Mondiale](#mappa-mondiale)
- [Sistema Mercato](#sistema-mercato)
- [Sistema Missioni](#sistema-missioni)
- [Meccaniche Avanzate](#meccaniche-avanzate)

## 🎯 Sistema di Progressione

### Livelli e Esperienza

Il giocatore progredisce attraverso un sistema di livelli basato su esperienza (XP):

```
Livello 1: 0-100 XP
Livello 2: 101-250 XP  
Livello 3: 251-500 XP
...
Formula: XP_necessaria = livello^2 * 50 + 50
```

**Fonti di XP:**
- Completamento attacchi riusciti: 10-50 XP
- Completamento missioni: 25-100 XP
- Scoperta vulnerabilità: 5-20 XP
- Primo utilizzo di un nuovo blocco: 5 XP

### Punti Talento

I punti talento sono la valuta di progressione principale:

**Acquisizione:**
- 1 punto ogni livello guadagnato
- Ricompense missioni speciali
- Completamento milestone di gioco

**Utilizzo:**
- Acquisizione nuovi talenti: 1 punto per livello
- Studio accelerato: variabile per talento
- Sblocco aree avanzate: 2-3 punti

## 💰 Economia del Gioco

### Sistema Monetario Duale

#### Bitcoin (BTC) - Economia Legale
- **Utilizzo:** Hardware, software legale, servizi pubblici
- **Acquisizione:**
  - Mining simulato: 0.001-0.01 BTC/ora
  - Vendita servizi legittimi
  - Completamento contratti

#### Monero (XMR) - Economia Underground
- **Utilizzo:** Mercato nero, servizi anonimi, malware
- **Acquisizione:**
  - Vendita dati rubati
  - Servizi hacking
  - Attacchi riusciti

### Prezzi Dinamici

I prezzi delle criptovalute fluttuano in tempo reale:

```javascript
// Simulazione mercato Bitcoin
function updateBtcValue() {
    const baseValue = 45000;
    const volatility = 0.02;
    const randomFactor = (Math.random() - 0.5) * volatility;
    currentBtcValue = baseValue * (1 + randomFactor);
}
```

### Sistema di Costi

| Categoria | Range Prezzi BTC | Range Prezzi XMR |
|-----------|------------------|------------------|
| Hardware Base | 0.1 - 2.0 | - |
| Hardware Avanzato | 2.0 - 10.0 | - |
| Software Tools | 0.05 - 1.0 | 0.1 - 5.0 |
| Malware | - | 1.0 - 50.0 |
| Dati Rubati | - | 0.01 - 10.0 |

## 🧠 Sistema Talenti

### Albero delle Competenze

Il sistema talenti è organizzato in 6 rami principali:

#### 1. Ingegneria Sociale
```
Social Engineering (4 livelli)
├── LV1: Fake login pages
├── LV2: AI persuasive text, Dark market export
├── LV3: Link tracking, Spear phishing
└── LV4: Vishing/Smishing, Baiting
```

#### 2. Sviluppo Software
```
Python (2 livelli) + Script Automation (2 livelli) + Malware Dev (3 livelli)
Python:
├── LV1: CSV import, Variables, Text manipulation
└── LV2: Automation scripts, Log analysis

Malware Development:
├── LV1: Keyloggers, Backdoors, Registry
├── LV2: Ransomware, Network worms, Screenshots
└── LV3: Rootkits, Advanced trojans
```

#### 3. Network Security
```
Network Scanning (3 livelli) + Exploit Development (3 livelli)
├── Network discovery e port scanning
├── Vulnerability assessment
└── Custom exploit development
```

#### 4. Crittografia e Privacy
```
Encryption/Decryption (3 livelli) + Anonymization (2 livelli)
├── Basic crypto operations
├── Advanced encryption algorithms
└── Steganography e privacy tools
```

#### 5. Digital Forensics
```
Data Recovery (2 livelli) + Traffic Analysis (2 livelli)
├── File recovery e analysis
├── Network traffic examination
└── Digital investigation techniques
```

#### 6. Hardware Hacking
```
Physical Access (2 livelli) + Hardware Modification (2 livelli)
├── Lock picking, RFID cloning
├── Hardware implants, Firmware modification
└── Advanced physical penetration
```

### Studio e Acquisizione

**Processo di Studio:**
1. Seleziona talento desiderato
2. Inizia periodo di studio (tempo variabile)
3. Studio può essere interrotto/ripreso
4. Completamento automatico alla fine del tempo

**Modificatori Tempo Studio:**
- Hardware personale: -15% a -50%
- Bonus clan: -5% a -25%
- Eventi speciali: variabile

## 🛠️ Editor di Flussi

### Concetto Fondamentale

L'editor permette di creare "flussi di attacco" combinando blocchi funzionali in sequenze logiche.

### Categorie di Blocchi

#### Blocchi di Accesso
- **Scopo:** Identificazione target e punti di ingresso
- **Esempi:** Port scan, Network scanning, Wi-Fi enumeration
- **Output:** Liste IP, servizi aperti, vulnerabilità

#### Blocchi di Acquisizione
- **Scopo:** Estrazione dati e credenziali
- **Esempi:** SQL injection, Keylogging, Phishing
- **Output:** Database, password, informazioni personali

#### Blocchi di Esfiltrazione
- **Scopo:** Trasferimento dati all'attaccante
- **Esempi:** Canali covert, Email automatiche, Upload FTP
- **Output:** Dati esportati, comunicazioni stabilite

#### Blocchi di Deploy
- **Scopo:** Installazione malware e persistenza
- **Esempi:** Shell web, Exploit deployment, Remote commands
- **Output:** Accesso remoto, controllo sistema

### Sistema di Validazione

```javascript
const validFlowSequences = {
    'basic_data_theft': ['access', 'acquisition', 'exfiltration'],
    'botnet_infection': ['access', 'deploy', 'c2', 'persistence'],
    'ddos_attack': ['access', 'deploy', 'dos_traffic', 'orchestration']
};
```

### Meccanica Drag-and-Drop

- **Griglia:** Snapping automatico a griglia 20x20px
- **Connessioni:** Linee visive tra blocchi compatibili
- **Validazione:** Real-time feedback su validità flusso
- **Export:** Salvataggio flussi per riutilizzo

## 🕸️ Sistema Botnet Avanzato

### Gestione Host Infetti Multi-Tab

**Interface Tabbed:**
- **Management Tab**: Gestione host e gruppi, selezione host, comandi individuali
- **DDoS Tab**: Configurazione attacchi distribuiti coordinati
- **Mining Tab**: Operazioni cryptocurrency mining parallele

**Struttura Host:**
```javascript
const infectedHost = {
    id: "unique_host_id",
    ip: "192.168.1.100",
    location: "Milano, IT",
    infectionDate: timestamp,
    status: "Active|Inactive|Compromised",
    resources: {
        cpuPower: 2.4, // GHz
        ram: 8192,     // MB
        bandwidth: 100  // Mbps
    },
    capabilities: ["dos_traffic", "mining", "proxy"],
    riskLevel: "Low|Medium|High",
    lastContact: timestamp,
    groupId: "Test Group" // Nuovo: assegnazione gruppo
};
```

### Sistema Bot Groups

**Organizzazione:**
- Host raggruppati per operazioni coordinate
- Gestione conflitti tra DDoS e Mining
- Status tracking per gruppo (Idle/DDoSing/Mining)
- Calcolo potenza aggregata per gruppo

**Funzionalità:**
```javascript
const botGroup = {
    name: "Italy Bots",
    hostIds: ["host1", "host2", "host3"],
    currentActivity: "Idle|DDoSing|Mining",
    createdDate: timestamp,
    totalPower: 7.2, // GFLOPS aggregati
    totalBandwidth: 330 // Mbps aggregata
};
```

### Sistema DDoS Impact

**Configurazione Attacco:**
1. **Selezione Bot Groups**: Checkbox selection con preview potenza
2. **Target IP**: Input validation per IP address
3. **DDoS Flow**: Selezione da flussi salvati con objective "denialOfService"
4. **Duration**: 30 secondi - 5 minuti con impact scaling
5. **Preview**: Calcolo real-time impatto, rischio tracciabilità, rischio perdita bot

**Calcolo Impatto:**
```javascript
function calculateAttackImpact(totalPower, duration) {
    const baseImpact = Math.log10(totalPower) * 2;
    const durationMultiplier = Math.sqrt(duration / 60);
    const flowMultiplier = getFlowComplexityMultiplier(selectedFlow);
    
    return Math.round(baseImpact * durationMultiplier * flowMultiplier * 10) / 10;
}

// Fattori di calcolo:
// - Potenza aggregata botnet (GFLOPS)
// - Durata attacco (minuti)
// - Complessità flow DDoS selezionato
// - Banda disponibile (Mbps)
// - Fattore random 0.8-1.2
```

**Gestione Multi-Attack:**
- Attacchi simultanei su target diversi
- Resource allocation intelligente
- Conflict detection con mining operations
- Progress monitoring real-time

### Meccaniche Mining

**Mining Operations:**
- Selezione bot groups per mining XMR
- Calcolo hashrate basato su CPU power
- Riduzione efficienza 50% se gruppo fa DDoS
- Rewards automatici in XMR

**Calcolo Mining:**
```javascript
function calculateMiningReward(hashrate, duration) {
    const baseReward = 0.001; // XMR per ora per GFLOP
    const efficiency = 0.7; // Efficienza mining botnet
    const difficultyFactor = getCurrentDifficulty();
    
    return hashrate * duration * baseReward * efficiency / difficultyFactor;
}
```

### Meccaniche di Infezione Avanzate

**Processo Automatico:**
1. Attacco riuscito tramite flow nell'editor
2. Host generato automaticamente se attack type supporta infezione
3. Callback automatico dopo tempo configurabile
4. Aggiunta automatica al pool botnet
5. Assegnazione gruppo basata su geolocalizzazione

**Fattori di Successo:**
- Livello talenti dell'attaccante (peso 40%)
- Sicurezza del target (peso 30%)
- Qualità dell'exploit utilizzato (peso 20%)
- Fattore casuale (peso 10%)

**Host Generation:**
```javascript
function generateInfectedHost(targetNation, attackComplexity) {
    return {
        ip: generateRealisticIP(targetNation),
        location: selectRandomCity(targetNation),
        resources: generateResourcesBasedOnComplexity(attackComplexity),
        capabilities: determineCapabilities(attackComplexity),
        riskLevel: calculateRiskLevel(targetNation.securityLevel)
    };
}
```

## 🌍 Mappa Mondiale

### Sistema Target Globali

**Struttura Nazioni:**
```javascript
const nation = {
    name: "Italia",
    code: "IT",
    position: { lat: 41.9, lon: 12.5 },
    difficultyLevel: 3,
    targets: [
        {
            id: "gov_portal",
            name: "Portale Governativo",
            type: "government",
            difficulty: 4,
            rewards: { xp: 50, btc: 1.5, data: "classified" },
            requirements: ["SQL Injection LV2", "VPN routing"]
        }
    ]
};
```

### Sistema di Routing

**Funzionalità:**
- Chain di VPN/proxy per anonimizzazione
- Tracciabilità inversa basata su routing
- Penalità per attacchi diretti
- Bonus per routing complessi

**Calcolo Tracciabilità:**
```javascript
function calculateTraceability(routingChain, targetDifficulty) {
    let baseTrace = targetDifficulty * 10;
    const routingReduction = routingChain.length * 15;
    const vpnBonus = countVPNs(routingChain) * 25;
    
    return Math.max(0, baseTrace - routingReduction - vpnBonus);
}
```

### Visualizzazione 3D

- **Three.js Earth:** Texture realistica della Terra
- **Markers Animati:** Indicatori target con pulsazione
- **Attack Lines:** Visualizzazione routing in tempo reale
- **Statistics Overlay:** Statistiche globali live

## 🛒 Sistema Mercato

### Mercato Legale

**Categorie Disponibili:**
- **Hardware Personale:** CPU, RAM, Storage, Network cards
- **Software Tools:** Ethical hacking tools, Development IDEs
- **Infrastructure:** VPN services, Cloud computing
- **Education:** Corsi online, Certificazioni

**Meccanica Prezzi:**
- Prezzi fissi in BTC
- Sconti per acquisti multipli
- Offerte speciali periodiche

### Mercato Nero

**Categorie Illegali:**
- **Malware:** Rootkit, Ransomware, Spyware
- **Exploits:** Zero-days, Vulnerability databases
- **Stolen Data:** Database, Identity information
- **Services:** Botnet rental, Attack-as-a-Service

**Meccaniche Speciali:**
- Prezzi in XMR per anonimità
- Reputation system per venditori
- Risk premium basato su tracciabilità
- Limited time offers
- Bidding system per articoli rari

## 🎖️ Sistema Missioni

### Tipi di Missioni

#### Tutorial Missions
- Guidano nei primi passi
- Insegnano meccaniche base
- Rewards: XP + Talent points

#### Main Story Quests
- Trama principale del gioco
- Unlock di nuove aree/funzionalità
- Boss battles contro altri hacker

#### Side Quests
- Contenuto opzionale
- Exploration e sperimentazione
- Unique rewards e collectibles

#### Daily/Weekly Challenges
- Contenuto ricorrente
- Competitive leaderboards
- Seasonal rewards

### Meccanica di Completamento

**Tracking Automatico:**
```javascript
const questObjectives = {
    "first_infection": {
        description: "Infetta il tuo primo host",
        checkCondition: () => state.infectedHostPool.length > 0,
        rewards: { xp: 25, talentPoints: 1 }
    },
    "master_social_eng": {
        description: "Raggiungi Social Engineering LV4",
        checkCondition: () => getTalentLevel("Social Engineering") >= 4,
        rewards: { xp: 100, btc: 5.0 }
    }
};
```

## ⚡ Meccaniche Avanzate

### Sistema Fazioni Multi-Level

**4 Fazioni Principali:**

#### 1. Governmental (Governativa)
- **Orientamento**: Lawful, protezione ordine pubblico
- **Motivazioni**: Sicurezza nazionale, controspionaggio, applicazione legge
- **Quest Types**: Anti-terrorismo digitale, sicurezza nazionale, controspionaggio
- **Colore**: Blu (#1e40af)

#### 2. Terrorist (Terroristica)
- **Orientamento**: Chaotic evil, destabilizzazione
- **Motivazioni**: Anarchia digitale, destabilizzazione governi
- **Quest Types**: Attacchi infrastrutture, leak dati governativi
- **Colore**: Rosso (#dc2626)

#### 3. Eco-Terrorist (Eco-Terroristica)
- **Orientamento**: Chaotic good, protezione ambiente
- **Motivazioni**: Protezione ambiente, anti-corporazioni inquinanti
- **Quest Types**: Leak dati ambientali, sabotaggio digitale corporations
- **Colore**: Verde (#059669)

#### 4. Population (Popolazione)
- **Orientamento**: Neutral good, protezione cittadini
- **Motivazioni**: Privacy digitale, diritti cittadini, trasparenza
- **Quest Types**: Leak corruzione, protezione whistleblowers
- **Colore**: Viola (#7c3aed)

### Sistema Reputazione Dinamica

**Meccaniche Inter-Fazioni:**
```javascript
const factionRelationships = {
    governmental: {
        terrorist: -0.2,       // Forte opposizione
        eco_terrorist: -0.1,   // Opposizione moderata  
        population: 0.05       // Lieve allineamento
    },
    terrorist: {
        governmental: -0.3,    // Forte opposizione
        eco_terrorist: 0.1,    // Lieve alleanza
        population: -0.15      // Opposizione cittadini
    }
    // ... matrix completa
};
```

**Spillover Effects:**
- Completamento quest positive → Boost fazioni alleate
- Completamento quest negative → Malus fazioni opposte
- Reputation decay nel tempo se inattivi
- Bonus/malus accesso contenuti basati su standing

**Range Reputazione:**
- **-100 a -51**: Nemici pubblici (quest impossibili, prezzi +100%)
- **-50 a -21**: Ostili (quest limitate, prezzi +50%)
- **-20 a +20**: Neutrale (accesso base)
- **+21 a +50**: Rispettati (quest bonus, sconti 10%)
- **+51 a +100**: Venerati (quest esclusive, sconti 25%)

### Sistema di Tracciabilità Avanzato

**Meccaniche Multi-Layer:**

1. **IP Traceability**: Tracking per IP utilizzato
2. **Attack Pattern Recognition**: Riconoscimento pattern attacchi
3. **Faction Heat**: Attenzione specifica fazioni governative
4. **Global Threat Level**: Level di allerta mondiale

**Fattori che Aumentano Tracciabilità:**
- Attacchi DDoS ad alta potenza: +15-40 punti
- Attacchi diretti senza VPN: +20-50 punti
- Fallimento attacchi con rilevamento: +10-25 punti
- Target governativi ad alta sicurezza: +25-60 punti
- Pattern ripetitivi riconoscibili: +10-30 punti

**Fattori che Diminuiscono Tracciabilità:**
- Tempo senza attività: -5 punti/ora
- Utilizzo VPN chains: -30-60% per attacco
- Uso proxy botnet: -20-40% per attacco
- Cleanup tools premium: -20-50 punti (costo XMR)
- Cambiamento identità digitale: -70% reset (costo alto)

### Console Intelligence Avanzata

**Sistema Data Archives:**
```javascript
const dataArchive = {
    id: "archive_001",
    name: "Government Database Leak",
    source: "DDoS Attack on target_gov_it",
    dateAcquired: timestamp,
    dataType: "classified_documents|financial_records|personal_data",
    size: "2.3 GB",
    purity: 85, // % dati utilizzabili
    analysisStatus: "pending|in_progress|completed",
    insights: [], // Array insights generati
    marketValue: 150 // XMR value
};
```

**Analysis Tools:**
- **Pattern Recognition**: Identificazione pattern nei dati
- **Cross-Reference Analysis**: Correlazione tra archivi diversi
- **Market Valuation**: Stima valore dati per mercato nero
- **Intelligence Reports**: Generazione report actionable
- **Leak Planning**: Identificazione target per leak strategici

### Economia Avanzata

**Dynamic Pricing:**
```javascript
function calculateDynamicPrice(item, playerReputation, marketConditions) {
    let basePrice = item.basePrice;
    
    // Reputation modifiers
    const reputationBonus = calculateReputationDiscount(playerReputation);
    
    // Market volatility
    const marketVolatility = getCurrentMarketVolatility();
    
    // Supply/demand
    const supplyDemandFactor = calculateSupplyDemand(item.category);
    
    return basePrice * (1 - reputationBonus) * marketVolatility * supplyDemandFactor;
}
```

**New Economic Mechanics:**
- **Reputation-based pricing**: Sconti per standing alto
- **Market manipulation**: Influence prezzi tramite attacchi
- **Intelligence marketplace**: Vendita dati raccolti
- **Service economy**: Botnet-as-a-Service per altri players
- **Insurance system**: Protezione asset da law enforcement

### Eventi Casuali Avanzati

**Faction-Based Events:**
- **Government Crackdown**: Raid coordinati, perdita asset
- **Terrorist Recruitment**: Inviti alleanze, nuove opportunità
- **Eco-Activist Campaigns**: Target corporations, boost eco reputation
- **Civil Unrest**: Opportunità hack durante disordini

**Technical Events:**
- **Zero-day Discovery**: Nuovi exploit disponibili mercato
- **Botnet Takedown**: Perdita percentuale host infetti
- **Cryptocurrency Crash/Boom**: Fluttuazioni severe prezzi
- **Security Patch Tuesday**: Alcuni exploit diventano inefficaci
- **Dark Market Raids**: Temporanea chiusura servizi illeciti

---

*Guida completa alle meccaniche avanzate di gioco di Hacker Tycoon*