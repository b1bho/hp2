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

## 🕸️ Sistema Botnet

### Gestione Host Infetti

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
    lastContact: timestamp
};
```

### Meccaniche di Infezione

**Processo:**
1. Target identificato tramite flussi di scansione
2. Deploy di malware tramite exploit
3. Callback automatico dopo infezione
4. Aggiunta automatica al pool botnet

**Fattori di Successo:**
- Livello talenti dell'attaccante
- Sicurezza del target
- Qualità dell'exploit utilizzato
- Fattore casuale (20% del calcolo)

### Utilizzo Botnet

**DDoS Attacks:**
- Power richiesto: 100-10000 CPU units
- Durata: 30 secondi - 10 minuti
- Success rate basato su potenza totale

**Mining Operations:**
- Rendimento: 0.001 XMR per CPU-hour
- Risk detection: aumenta con durata
- Automatic rotation per evitare detection

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

### Sistema di Tracciabilità

**Concetto:** Ogni attacco aumenta la tracciabilità dell'IP utilizzato

**Fattori che Aumentano Tracciabilità:**
- Attacchi diretti senza routing: +20-50 punti
- Fallimento attacchi: +10-25 punti
- Target ad alta sicurezza: +15-40 punti

**Fattori che Diminuiscono Tracciabilità:**
- Tempo senza attività: -5 punti/ora
- Utilizzo VPN personali: -30% per attacco
- Cleanup tools: -10-30 punti (costo XMR)

### Sistema Reputazione

**Underground Reputation:**
- Aumenta con attacchi riusciti
- Diminuisce con fallimenti
- Influenza prezzi mercato nero
- Sblocca servizi esclusivi

**Law Enforcement Heat:**
- Tracking da parte delle autorità
- Aumenta con attacchi a target sensibili
- Porta a eventi casuali negativi
- Richiede periodo di "lay low"

### Eventi Casuali

**Tipi di Eventi:**
- **Security Breach:** Perdita dati/accessi
- **Law Enforcement:** Raid, confische
- **Market Crash:** Crollo prezzi crypto
- **Zero-day Discovery:** Nuovi exploit disponibili
- **Botnet Takedown:** Perdita host infetti

### Clan e Cooperative

**Funzionalità Multiplayer:**
- Formazione clan con altri giocatori
- Bonus cooperativi per studio
- Attacchi coordinati su larga scala
- Condivisione risorse e intelligence
- Competizioni inter-clan

### Seasonal Content

**Aggiornamenti Periodici:**
- Nuovi target mondiali
- Eventi tematici speciali
- Limited-time tools e malware
- Seasonal challenges
- Meta shifts nel gameplay

---

*Guida completa alle meccaniche di gioco di Hacker Tycoon*