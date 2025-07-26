# Meccaniche di Gioco 🎮

Questa documentazione descrive in dettaglio tutte le meccaniche di gioco di Hacker Tycoon, fornendo una guida completa per comprendere il funzionamento del simulatore.

## 📋 Indice

- [Sistema di Progressione](#sistema-di-progressione)
- [Economia del Gioco](#economia-del-gioco)
- [Sistema Talenti](#sistema-talenti)
- [Editor di Flussi](#editor-di-flussi)
- [Editor 2.0 - Sistema Template Avanzato](#editor-20---sistema-template-avanzato)
- [Template OSINT - Open Source Intelligence](#template-osint---open-source-intelligence)
- [Template Ransomware - Aggiornamenti Livelli 2 e 3](#template-ransomware---aggiornamenti-livelli-2-e-3)
- [Meccaniche di Potenziamento](#meccaniche-di-potenziamento)
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

## 🎛️ Editor 2.0 - Sistema Template Avanzato

### Panoramica

L'Editor 2.0 rappresenta un'evoluzione significativa del sistema originale, introducendo un approccio template-based per la creazione di malware e strumenti specializzati. Invece di assemblare blocchi generici, i giocatori utilizzano template predefiniti con flussi di interconnessione fissi e nodi potenziabili.

### Funzionalità dell'Editor 2.0

#### Interface e Navigazione

**Selezione Template:**
- Griglia di template disponibili con icone distintive
- Filtro per disponibilità basato sui talenti posseduti
- Anteprima descrizione e requisiti per ogni template

**Canvas Template:**
- Visualizzazione template con nodi fissi e interconnessioni predefinite
- Zoom e pan per navigare template complessi
- Highlighting nodi selezionati con pannello upgrade

**Pannello di Controllo:**
- Informazioni livello template attuale
- Pulsante potenziamento template (se disponibile)
- Opzioni compilazione e reset

#### Logica di Navigazione

1. **Accesso Editor 2.0:** Dalla schermata principale, sezione "Rework Editor"
2. **Selezione Template:** Click su template card per caricarlo nell'editor
3. **Configurazione Nodi:** Click sui nodi per vedere upgrade disponibili
4. **Potenziamento Template:** Upgrade del template intero per sbloccare nuovi livelli
5. **Compilazione:** Generazione malware basato sulla configurazione attuale

### Template Disponibili

#### Template Ransomware
- **Livelli:** 3 (Base, Intermedio, Avanzato)
- **Specializzazione:** Crittografia dati e richiesta riscatto
- **Requisiti Base:** Malware Attivi LV1, Stealth LV1, Sviluppo LV1

#### Template OSINT
- **Livelli:** 3 (Base, Intermedio, Avanzato)  
- **Specializzazione:** Intelligence gathering e analisi dati
- **Requisiti Base:** Analisi Dati LV1, Net LV1, Network Security LV1

#### Template Keylogger  
- **Livelli:** 1 (Base)
- **Specializzazione:** Cattura keystroke e stealth
- **Requisiti Base:** Malware Passivi LV1, Sviluppo LV1

#### Template Botnet Agent
- **Livelli:** 1 (Base)
- **Specializzazione:** Command & Control e propagazione
- **Requisiti Base:** Malware di Rete LV1, Networking LV1, Sviluppo LV1

### Condizioni per Selezione Template

**Verifica Automatica:**
```javascript
function checkTemplateRequirements(template) {
    return template.requiredTalents.every(talent => 
        checkTalentRequirement(talent)
    );
}
```

**Stati Template:**
- **Disponibile:** Tutti i talenti richiesti posseduti (sfondo verde)
- **Bloccato:** Talenti mancanti (sfondo grigio, icona lucchetto)
- **Attivo:** Template attualmente selezionato (bordo dorato)

**Unlocking Progression:**
- I template si sbloccano automaticamente al raggiungimento dei talenti richiesti
- Notifica push quando un nuovo template diventa disponibile
- Progress tracking nel pannello talenti per vedere template quasi sbloccati

## 📊 Template OSINT - Open Source Intelligence

### Panoramica

Il template OSINT è specializzato nella raccolta e analisi di intelligence open-source, fornendo strumenti avanzati per la profilazione target, network discovery e correlazione dati. È ideale per operazioni di ricognizione e intelligence gathering.

### Livelli di Complessità

#### Livello 1 - Base
**Requisiti:** Analisi Dati LV1, Net LV1, Network Security LV1

**Nodi Fissi:**

1. **Profilazione Target**
   - *Tipo:* Reconnaissance  
   - *Funzione:* Identifica informazioni pubbliche base del target
   - *Potenziamenti:*
     - LV1: Profilo Base (informazioni pubbliche base)
     - LV2: Profilo Dettagliato (analisi approfondita attività) - *Richiede: Network Security LV1*
     - LV3: Profilo Comportamentale (modelli comportamentali e predizioni) - *Richiede: AI LV1*

2. **Network Discovery**
   - *Tipo:* Access
   - *Funzione:* Scansione rete e identificazione servizi
   - *Potenziamenti:*
     - LV1: Scan Base (scansione rete e port scan base)
     - LV2: Topology Mapping (mappatura topologia completa) - *Richiede: Net LV2*
     - LV3: Service Fingerprinting (fingerprinting servizi e versioni) - *Richiede: Network Security LV2*

3. **Data Gathering**
   - *Tipo:* Acquisition
   - *Funzione:* Raccolta informazioni da fonti multiple
   - *Potenziamenti:*
     - LV1: Info Base (raccolta informazioni pubbliche base)
     - LV2: Social Media Mining (estrazione dati social media) - *Richiede: Analisi Dati LV1*
     - LV3: Deep Web Search (ricerca nel deep web) - *Richiede: Analisi Dati LV2*
     - LV4: Automated Collection (raccolta automatizzata multi-fonte) - *Richiede: AI LV1*

4. **Analysis Engine**
   - *Tipo:* Reconnaissance
   - *Funzione:* Analisi e correlazione dati raccolti
   - *Potenziamenti:*
     - LV1: Analisi Base (analisi e correlazione dati base)
     - LV2: Pattern Recognition (riconoscimento pattern e anomalie) - *Richiede: Analisi Dati LV2*
     - LV3: Predictive Analysis (analisi predittiva comportamentale) - *Richiede: AI LV2*

5. **Intelligence Report**
   - *Tipo:* Exfiltration
   - *Funzione:* Generazione report intelligence strutturati
   - *Potenziamenti:*
     - LV1: Report Base (generazione report intelligence base)
     - LV2: Visual Analytics (report con visualizzazioni e grafi) - *Richiede: Analisi Dati LV1*
     - LV3: Actionable Intelligence (intelligence operativa con raccomandazioni) - *Richiede: AI LV1*

**Interconnessioni Livello 1:**
```
Profilazione Target → Network Discovery
Profilazione Target → Data Gathering
Network Discovery → Analysis Engine
Data Gathering → Analysis Engine
Analysis Engine → Intelligence Report
```

#### Livello 2 - Intermedio
**Requisiti Potenziamento:** Analisi Dati LV2, Network Security LV2, Rev Eng LV1

**Nodi Aggiuntivi:**

6. **Vulnerability Assessment**
   - *Tipo:* Reconnaissance
   - *Funzione:* Assessment automatico vulnerabilità
   - *Potenziamenti:*
     - LV2: Vuln Scanner (scanner automatico vulnerabilità)
     - LV3: Advanced Assessment (assessment vulnerabilità avanzato) - *Richiede: Network Security LV3*

7. **Social Engineering Intel**
   - *Tipo:* Acquisition
   - *Funzione:* Raccolta intelligence umana e profilazione sociale
   - *Potenziamenti:*
     - LV2: HUMINT Collection (raccolta intelligence umana)
     - LV3: Psychological Profiling (profilazione psicologica avanzata) - *Richiede: SocEng LV3*

**Interconnessioni Livello 2:**
```
Profilazione Target → Network Discovery
Profilazione Target → Vulnerability Assessment
Network Discovery → Social Engineering Intel
Vulnerability Assessment → Data Gathering
Social Engineering Intel → Analysis Engine
Data Gathering → Analysis Engine
Analysis Engine → Intelligence Report
```

#### Livello 3 - Avanzato
**Requisiti Potenziamento:** Analisi Dati LV3, Network Security LV3, AI LV2

**Nodi Specializzati:**

8. **AI Reconnaissance**
   - *Tipo:* Reconnaissance
   - *Funzione:* Ricognizione assistita da intelligenza artificiale
   - *Potenziamenti:*
     - LV3: AI Pattern Matcher (riconoscimento pattern AI-driven)
     - LV4: Deep Learning OSINT (deep learning per intelligence gathering) - *Richiede: AI LV3*

9. **Advanced Vuln Research**
   - *Tipo:* Reconnaissance
   - *Funzione:* Ricerca avanzata vulnerabilità e zero-day hunting
   - *Potenziamenti:*
     - LV3: Zero-Day Hunting (caccia a vulnerabilità zero-day)
     - LV4: AI Vuln Discovery (scoperta vulnerabilità assistita da AI) - *Richiede: AI LV3*

10. **Deep Web Crawler**
    - *Tipo:* Acquisition
    - *Funzione:* Accesso sistematico al deep/dark web
    - *Potenziamenti:*
      - LV3: Dark Web Access (accesso sistematico al dark web)
      - LV4: Quantum Search (algoritmi di ricerca quantistici) - *Richiede: AI LV3*

11. **Predictive Analytics**
    - *Tipo:* Reconnaissance
    - *Funzione:* Analisi predittiva e modellazione comportamentale
    - *Potenziamenti:*
      - LV3: Threat Prediction (predizione minacce e comportamenti)
      - LV4: Quantum Analytics (analisi predittiva quantistica) - *Richiede: AI LV3*

12. **Actionable Intelligence**
    - *Tipo:* Exfiltration
    - *Funzione:* Intelligence operativa con raccomandazioni strategiche
    - *Potenziamenti:*
      - LV3: Strategic Intel (intelligence strategica operativa)
      - LV4: AI-Driven Recommendations (raccomandazioni basate su AI) - *Richiede: AI LV2*

**Interconnessioni Livello 3:**
```
Profilazione Target → AI Reconnaissance
Profilazione Target → Network Discovery
AI Reconnaissance → Advanced Vuln Research
Network Discovery → Deep Web Crawler
Advanced Vuln Research → Social Engineering Intel
Deep Web Crawler → Predictive Analytics
Social Engineering Intel → Predictive Analytics
Predictive Analytics → Actionable Intelligence
```

### Talenti Necessari per Potenziamenti

**Talenti Fondamentali:**
- **Analisi Dati:** Requisito primario per la maggior parte dei potenziamenti
- **Network Security:** Essenziale per funzionalità di rete avanzate
- **AI (Intelligenza Artificiale):** Sblocca capacità predittive e analitiche avanzate

**Talenti Opzionali:**
- **SocEng (Social Engineering):** Per potenziamenti di profilazione psicologica
- **Rev Eng (Reverse Engineering):** Richiesto per accesso al Livello 2

**Progressione Consigliata:**
```
1. Analisi Dati LV1 → Net LV1 → Network Security LV1 (Accesso Livello 1)
2. Analisi Dati LV2 → Network Security LV2 → Rev Eng LV1 (Accesso Livello 2)
3. Analisi Dati LV3 → Network Security LV3 → AI LV2 (Accesso Livello 3)
4. AI LV3 → Potenziamenti quantistici e AI avanzata
```

## 🦠 Template Ransomware - Aggiornamenti Livelli 2 e 3

### Panoramica

Il template Ransomware è specializzato nella creazione di malware per crittografia dati e richiesta riscatto. Offre 3 livelli di complessità crescente, con nodi aggiuntivi e potenziamenti avanzati nei livelli superiori.

### Livello 2 - Intermedio
**Requisiti Potenziamento:** Malware Attivi LV2, Sviluppo LV2, Stealth LV2

**Nodi Aggiuntivi:**

1. **Evasione Antivirus (Base)**
   - *Tipo:* Stealth
   - *Posizione:* (50, 180)
   - *Funzione:* Tecniche di evasione per evitare rilevazione antivirus
   - *Potenziamenti:*
     - LV1: Evasione Base (tecniche base di evasione antivirus)
     - LV2: Evasione Standard (evasione antivirus migliorata) - *Richiede: Stealth LV2*

2. **Crittografa File (Standard)**
   - *Tipo:* Encryption
   - *Posizione:* (220, 50)
   - *Funzione:* Crittografia file con algoritmi standard
   - *Potenziamenti:*
     - LV2: Crittografia Standard (crittografia file con algoritmi standard)
     - LV3: Crittografia Avanzata (crittografia file avanzata) - *Richiede: Sviluppo LV2*

3. **Imposta Persistenza (Base)**
   - *Tipo:* Persistence
   - *Posizione:* (390, 180)
   - *Funzione:* Meccanismi base di persistenza nel sistema
   - *Potenziamenti:*
     - LV1: Persistenza Base (meccanismi base di persistenza)
     - LV2: Persistenza Avanzata (persistenza avanzata nel sistema) - *Richiede: Sviluppo LV2*

4. **Crea Messaggio Riscatto (Standard)**
   - *Tipo:* Payload
   - *Posizione:* (220, 310)
   - *Funzione:* Generazione messaggi di riscatto personalizzati
   - *Potenziamenti:*
     - LV2: Messaggio Standard (messaggio riscatto base)
     - LV3: Messaggio Personalizzato (messaggio riscatto avanzato) - *Richiede: SocEng LV2*

**Interconnessioni Livello 2:**
```
Target Entry → Evasione Antivirus
Target Entry → Crittografa File
Evasione Antivirus → Imposta Persistenza
Crittografa File → Crea Messaggio Riscatto
Imposta Persistenza → Compiler
Crea Messaggio Riscatto → Compiler
```

### Livello 3 - Avanzato
**Requisiti Potenziamento:** Malware Attivi LV3, Sviluppo LV3, Stealth LV3

**Nodi Specializzati:**

5. **Evasione Anti-Analisi (Avanzata)**
   - *Tipo:* Stealth
   - *Posizione:* (50, 280)
   - *Funzione:* Tecniche anti-analisi per evitare reverse engineering
   - *Potenziamenti:*
     - LV3: Anti-Analisi Avanzata (tecniche anti-analisi avanzate)
     - LV4: VM Detection & Evasion (rilevazione ed evasione macchine virtuali) - *Richiede: Stealth LV3*

6. **Crittografia File (Avanzata)**
   - *Tipo:* Encryption
   - *Posizione:* (220, 180)
   - *Funzione:* Crittografia file con algoritmi avanzati e multi-layer
   - *Potenziamenti:*
     - LV3: Multi-Layer Encryption (crittografia a più livelli)
     - LV4: Quantum-Resistant Crypto (crittografia resistente quantistica) - *Richiede: Stealth LV3, AI LV2*

7. **Auto-Propagazione**
   - *Tipo:* Propagation
   - *Posizione:* (390, 280)
   - *Funzione:* Capacità di auto-propagazione del ransomware
   - *Potenziamenti:*
     - LV3: Network Propagation (propagazione automatica via rete)
     - LV4: Multi-Vector Spread (propagazione multi-vettore) - *Richiede: Networking LV3*

8. **Auto-Eliminazione (Avanzata)**
   - *Tipo:* Cleanup
   - *Posizione:* (390, 380)
   - *Funzione:* Auto-eliminazione sicura dopo esecuzione
   - *Potenziamenti:*
     - LV3: Secure Self-Delete (auto-eliminazione sicura)
     - LV4: Memory Wipe (pulizia memoria completa) - *Richiede: Stealth LV3*

**Interconnessioni Livello 3:**
```
Target Entry → Evasione Anti-Analisi
Evasione Anti-Analisi → Crittografia File Avanzata
Crittografia File Avanzata → Auto-Propagazione
Auto-Propagazione → Compiler
Auto-Eliminazione Avanzata → Compiler
```

### Miglioramenti Specifici per Livello

**Ottimizzazioni Livello 2:**
- Canvas ridimensionato per nodi più compatti (140px width)
- Migliore utilizzo spazio con layout ottimizzato
- Nuove interconnessioni per flusso logico migliorato

**Specializzazioni Livello 3:**
- Nodi altamente specializzati per operazioni avanzate
- Requisiti talenti più stringenti per accesso
- Capacità di evasione e stealth significativamente migliorate
- Algoritmi di crittografia all'avanguardia

### Sinergie tra Potenziamenti

**Combinazioni Efficaci:**
- **Stealth + Encryption:** Massima furtività con crittografia robusta
- **Persistence + Propagation:** Diffusione e permanenza ottimali
- **Anti-Analysis + VM Evasion:** Resistenza completa all'analisi

**Progression Path Ottimale:**
```
Livello 1 → Sviluppo talenti base → Livello 2 → Specializzazione stealth → Livello 3
```

## ⚙️ Meccaniche di Potenziamento

### Sistema di Upgrade Nodi

#### Concetto Base

Ogni nodo all'interno dei template può essere potenziato individualmente attraverso un sistema di upgrade a livelli. Ogni upgrade migliora le capacità del nodo e può sbloccare nuove funzionalità.

#### Struttura Upgrade

**Formato Standard:**
```javascript
upgrades: {
    1: { 
        name: 'Nome Upgrade', 
        description: 'Descrizione funzionalità',
        requires: [] // Talenti opzionali richiesti
    },
    2: { 
        name: 'Nome Upgrade LV2', 
        description: 'Funzionalità migliorata',
        requires: ['Talento LV2'] // Talenti richiesti
    }
}
```

#### Meccaniche di Potenziamento

**Processo di Upgrade:**
1. **Selezione Nodo:** Click sul nodo per visualizzare upgrade disponibili
2. **Verifica Requisiti:** Controllo automatico talenti necessari  
3. **Conferma Upgrade:** Applicazione immediata del potenziamento
4. **Persistenza:** Salvataggio automatico della configurazione

**Requisiti Upgrade:**
- **Talenti Specifici:** Ogni upgrade può richiedere talenti specifici
- **Livello Minimo:** Alcuni upgrade sono disponibili solo a certi livelli del nodo
- **Progressione Lineare:** Gli upgrade devono essere acquisiti in ordine sequenziale

#### Categorie di Potenziamento

**Potenziamenti Funzionali:**
- Aggiungono nuove capacità al nodo
- Migliorano l'efficacia delle operazioni esistenti
- Sbloccano nuovi tipi di input/output

**Potenziamenti di Efficienza:**
- Riducono il tempo di esecuzione
- Migliorano il tasso di successo
- Ottimizzano l'utilizzo delle risorse

**Potenziamenti di Stealth:**
- Riducono la tracciabilità delle operazioni
- Migliorano l'evasione dai sistemi di sicurezza
- Aumentano la resistenza all'analisi

### Sistema Template Level

#### Potenziamento Template Globale

**Meccanica Power-Up:**
```javascript
function powerUpTemplate(templateKey) {
    const currentLevel = state.reworkEditor.templateLevels[templateKey];
    const nextLevel = currentLevel + 1;
    
    if (canPowerUpTemplate(templateKey)) {
        state.reworkEditor.templateLevels[templateKey] = nextLevel;
        unlockNewNodesAndConnections(templateKey, nextLevel);
    }
}
```

**Benefici del Template Level:**
- **Nuovi Nodi:** Sblocco di nodi specializzati aggiuntivi
- **Nuove Interconnessioni:** Flussi di dati più complessi
- **Capacità Avanzate:** Funzionalità non disponibili nei livelli inferiori

#### Requisiti per Template Level

**Verifica Talenti:**
```javascript
const levelRequirements = {
    2: ['Malware Attivi LV2', 'Sviluppo LV2', 'Stealth LV2'],
    3: ['Malware Attivi LV3', 'Sviluppo LV3', 'Stealth LV3']
};
```

**Progression Gates:**
- Ogni livello richiede un set specifico di talenti
- La verifica è automatica e in tempo reale
- Feedback visivo per requisiti mancanti

### Talenti Necessari per Livelli Template

#### Template OSINT

**Livello 1 → 2:**
- Analisi Dati LV2 (essenziale per data processing avanzato)
- Network Security LV2 (necessario per vulnerability assessment)
- Rev Eng LV1 (richiesto per analisi tecnica)

**Livello 2 → 3:**
- Analisi Dati LV3 (massima capacità di correlazione dati)
- Network Security LV3 (funzionalità di security avanzate)
- AI LV2 (capacità di machine learning e predizione)

#### Template Ransomware

**Livello 1 → 2:**
- Malware Attivi LV2 (capacità malware intermediate)
- Sviluppo LV2 (programmazione avanzata)
- Stealth LV2 (evasione antivirus standard)

**Livello 2 → 3:**
- Malware Attivi LV3 (tecniche malware expert)
- Sviluppo LV3 (programmazione sistemistica avanzata)
- Stealth LV3 (massima furtività e anti-analisi)

#### Template Keylogger

**Requisiti Base:**
- Malware Passivi LV1 (capacità keylogging base)
- Sviluppo LV1 (programmazione base)

#### Template Botnet Agent

**Requisiti Base:**
- Malware di Rete LV1 (malware con capacità di rete)
- Networking LV1 (conoscenze di rete base)
- Sviluppo LV1 (programmazione base)

### Sistema di Notifiche Upgrade

#### Feedback Visivo

**Indicatori Stato:**
- **Verde:** Upgrade disponibile e requisiti soddisfatti
- **Giallo:** Upgrade disponibile ma talenti mancanti  
- **Grigio:** Upgrade non ancora raggiungibile
- **Blu:** Upgrade già applicato

**Tooltips Informativi:**
```javascript
function generateUpgradeTooltip(upgrade, nodeId) {
    return `
        <div class="upgrade-tooltip">
            <h4>${upgrade.name}</h4>
            <p>${upgrade.description}</p>
            ${upgrade.requires ? 
                `<div class="requirements">
                    Richiede: ${upgrade.requires.join(', ')}
                </div>` : ''
            }
        </div>
    `;
}
```

#### Notifiche di Sblocco

**Push Notifications:**
- Avviso quando un nuovo upgrade diventa disponibile
- Notifica di sblocco nuovi template level
- Alert per template precedentemente bloccati ora accessibili

**Progress Tracking:**
- Barra di progresso per talenti mancanti
- Lista template quasi sbloccati
- Suggerimenti per ottimizzare la progressione talenti

### Ottimizzazione Configurazioni

#### Best Practices

**Progression Strategy:**
1. **Focus Specializzazione:** Concentrare talenti su un ramo specifico
2. **Template Sinergici:** Sviluppare template che condividono requisiti
3. **Upgrade Economici:** Prioritizzare upgrade con requisiti già posseduti

**Resource Management:**
- Pianificare la distribuzione punti talento
- Bilanciare ampiezza vs profondità delle competenze  
- Considerare i template level come obiettivi a lungo termine

**Template Optimization:**
- Configurare upgrade per massimizzare l'efficacia del template
- Bilanciare stealth, potenza e velocità di esecuzione
- Adattare configurazioni agli obiettivi specifici della missione

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