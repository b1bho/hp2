# Sistema DDoS Impact - Guida Completa 🚨

Questa documentazione fornisce una guida dettagliata del sistema DDoS Impact implementato in Hacker Tycoon, dalle meccaniche base alle strategie avanzate.

## 📋 Indice

- [Panoramica Sistema](#panoramica-sistema)
- [Interface Utente](#interface-utente)
- [Configurazione Attacchi](#configurazione-attacchi)
- [Meccaniche di Calcolo](#meccaniche-di-calcolo)
- [Bot Groups Management](#bot-groups-management)
- [Strategie Avanzate](#strategie-avanzate)
- [Troubleshooting](#troubleshooting)

## 🔍 Panoramica Sistema

### Concetto Fondamentale

Il sistema DDoS Impact consente di orchestrare attacchi distribuiti coordinati utilizzando la propria botnet. Il sistema si basa su:

- **Bot Groups**: Organizzazione host infetti in gruppi operativi
- **DDoS Flows**: Flussi di attacco creati nell'editor con objective "denialOfService"
- **Impact Calculation**: Calcolo real-time dell'impatto basato su potenza aggregata
- **Risk Assessment**: Valutazione rischi tracciabilità e perdita bot
- **Multi-Attack Support**: Gestione attacchi simultanei su target diversi

### Architettura Tecnica

```
┌─────────────────────────────────────────────────────────────┐
│                    DDoS Impact System                       │
├─────────────────────────────────────────────────────────────┤
│  Bot Groups    │  Flow Selection  │  Target Config          │
│  Management    │  & Validation    │  & Impact Preview       │
├─────────────────────────────────────────────────────────────┤
│           Attack Coordination & Monitoring                  │
├─────────────────────────────────────────────────────────────┤
│     Real-time Progress Tracking & Results Processing       │
└─────────────────────────────────────────────────────────────┘
```

## 🖥️ Interface Utente

### Tab DDoS nella Botnet

L'accesso al sistema DDoS avviene tramite il tab "DDoS" nel pannello Botnet Control. L'interface è divisa in tre sezioni principali:

#### 1. Select Bot Groups
```
┌─────────────────────────────────────────────────────────────┐
│ ☐ Test Group                                    │ 5.6 GFLOPS │
│   Idle                                          │ 250 Mbps   │  
│   2/2 hosts active                              │             │
├─────────────────────────────────────────────────────────────┤
│ ☐ Italy Bots                                   │ 1.8 GFLOPS │
│   Mining (-50% power)                          │ 80 Mbps    │
│   1/1 hosts active                             │             │
└─────────────────────────────────────────────────────────────┘
```

**Elementi Interface:**
- **Checkbox Selection**: Multi-selezione gruppi per attacco coordinato
- **Group Status**: Visualizzazione stato corrente (Idle/DDoSing/Mining)
- **Power Display**: Potenza effettiva disponibile (considerando conflitti)
- **Activity Indicators**: Icone stato e limitazioni correnti

#### 2. Selected Resources Preview
```
┌─────────────────────────────────────────────────────────────┐
│ Total Hosts: 3        │ Active Hosts: 3                     │
│ Combined Power: 7.4   │ Bandwidth: 330 Mbps                 │
│ GFLOPS                │                                      │
└─────────────────────────────────────────────────────────────┘
```

**Metriche Real-time:**
- **Total/Active Hosts**: Conteggio host coinvolti
- **Combined Power**: Potenza aggregata in GFLOPS
- **Bandwidth**: Banda totale disponibile in Mbps
- **Auto-update**: Aggiornamento automatico alla selezione

#### 3. DDoS Attack Configuration
```
┌─────────────────────────────────────────────────────────────┐
│ Target IP: [192.168.1.100        ]                         │
│ DDoS Flow: [Advanced DDoS Attack ▼]                        │
│ Duration:  [1 minute (Medium)    ▼]                        │
│                                                             │
│ Attack Preview:                                             │
│ • Estimated Impact: 8.5                                     │
│ • Traceability Risk: Medium                                 │
│ • Bot Loss Risk: Low                                        │
│                                                             │
│ [Launch DDoS Attack]                                        │
└─────────────────────────────────────────────────────────────┘
```

## ⚙️ Configurazione Attacchi

### Step 1: Selezione Bot Groups

**Criteri Selezione:**
- Gruppi in stato "Idle" (non impegnati in altre operazioni)
- Considerare power reduction se gruppo sta mining (-50%)
- Valutare distribuzione geografica per efficacia
- Bilanciare potenza vs. rischio esposizione

**Conflict Resolution:**
- Gruppi in DDoS attivi: Non selezionabili
- Gruppi in Mining: Selezionabili ma potenza ridotta
- Automatic status update alla selezione

### Step 2: Target IP Configuration

**Validazione Input:**
- Format validation IP address (IPv4)
- Range validation (no localhost, private ranges limitati)
- Historical data check (precedenti attacchi stesso target)
- Geolocation lookup per risk assessment

**Target Intelligence:**
- Lookup automatico informazioni target
- Stima level sicurezza basato su IP range
- Risk assessment basato su geolocalizzazione
- Integration con intelligence database

### Step 3: DDoS Flow Selection

**Requisiti Flow:**
- Objective deve essere "denialOfService"
- Flow deve essere validato e funzionante
- Blocchi DDoS supportati: SYN Flood, UDP Flood, HTTP Flood, etc.
- Complexity rating influenza impatto finale

**Flow Examples:**
```javascript
// Basic DDoS Flow (★★★☆☆)
{
    name: "Basic DDoS Attack",
    objective: "denialOfService",
    blocks: [
        "SYN Flood Attack",
        "UDP Flood Traffic", 
        "Monitor Target Response"
    ],
    complexity: 3
}

// Advanced DDoS Flow (★★★★★)
{
    name: "Advanced DDoS Attack", 
    objective: "denialOfService",
    blocks: [
        "Multi-vector DDoS",
        "HTTP Flood with SSL",
        "Slowloris Connection",
        "DNS Amplification",
        "Application Layer Attack"
    ],
    complexity: 5
}
```

### Step 4: Duration Selection

**Opzioni Disponibili:**
- **30 seconds (Low Impact)**: Test rapidi, basso rischio
- **1 minute (Medium Impact)**: Bilanciamento efficacia/rischio
- **2 minutes (High Impact)**: Impatto significativo, rischio moderato
- **5 minutes (Maximum Impact)**: Massimo impatto, alto rischio

**Considerazioni Duration:**
- Durata maggiore = Impatto maggiore ma rischio detection alto
- Host loss probability aumenta con durata
- Traceability accumulation proporzionale al tempo
- XMR cost per early termination disponibile

## 🧮 Meccaniche di Calcolo

### Impact Calculation Algorithm

```javascript
function calculateAttackImpact(totalPower, duration, flowComplexity) {
    // Base impact da potenza logaritmica
    const baseImpact = Math.log10(totalPower) * 2;
    
    // Duration multiplier (radice quadrata per diminishing returns)
    const durationMultiplier = Math.sqrt(duration / 60);
    
    // Flow complexity multiplier
    const flowMultiplier = flowComplexity * 0.3;
    
    // Bandwidth factor (bonus se bandwidth alta)
    const bandwidthBonus = Math.min(1.5, totalBandwidth / 1000);
    
    // Random factor per incertezza
    const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8-1.2
    
    const finalImpact = baseImpact * durationMultiplier * 
                       (1 + flowMultiplier) * bandwidthBonus * randomFactor;
    
    return Math.round(finalImpact * 10) / 10;
}
```

**Fattori Impact:**
1. **Potenza Botnet (40%)**: GFLOPS totali disponibili
2. **Durata Attacco (25%)**: Tempo sostenuto dell'attacco  
3. **Complessità Flow (20%)**: Sofisticazione tecniche utilizzate
4. **Bandwidth (10%)**: Banda disponibile per traffico
5. **Fattore Casuale (5%)**: Incertezza e variabili esterne

### Risk Assessment Calculations

#### Traceability Risk
```javascript
function calculateTraceabilityRisk(config) {
    let baseRisk = config.targetSecurityLevel * 0.1;
    
    // Duration risk (esponenziale)
    baseRisk += Math.pow(config.duration / 300, 1.5) * 0.3;
    
    // Power visibility (logaritmico)  
    baseRisk += Math.log10(config.totalPower) * 0.05;
    
    // Target type modifier
    if (config.targetType === 'government') baseRisk *= 1.8;
    if (config.targetType === 'financial') baseRisk *= 1.5;
    
    // VPN/Proxy reduction
    baseRisk *= (1 - config.anonymizationLevel * 0.3);
    
    return Math.min(1.0, Math.max(0.0, baseRisk));
}
```

#### Bot Loss Risk
```javascript
function calculateBotLossRisk(config) {
    let lossRisk = 0.02; // Base 2% loss risk
    
    // Duration increases loss risk
    lossRisk += (config.duration / 300) * 0.05;
    
    // High security targets fight back
    lossRisk += config.targetSecurityLevel * 0.01;
    
    // More bots = higher chance some get caught
    lossRisk += Math.log10(config.totalHosts) * 0.01;
    
    return Math.min(0.25, lossRisk); // Cap al 25%
}
```

## 🤖 Bot Groups Management

### Creazione e Organizzazione

**Best Practices:**
- Raggruppa host per geolocalizzazione (latenza ridotta)
- Bilancia potenza per gruppi multi-purpose
- Mantieni gruppi sacrificabili per attacchi high-risk
- Riserva top-tier hosts per operazioni critiche

**Esempio Organizzazione:**
```
European Cluster (Low Latency)
├── DE_Premium (High Power, Low Risk)
├── IT_Standard (Medium Power, Medium Risk)  
└── FR_Expendable (Low Power, High Risk OK)

APAC Cluster (High Anonymity)
├── CN_Mining (Dual Purpose Mining/DDoS)
├── JP_Stealth (High Anonymity, Premium)
└── SG_Backup (Emergency Reserve)
```

### Conflict Management

**Scenario Handling:**
1. **DDoS vs Mining**: Mining può continuare con 50% power reduction
2. **Multiple DDoS**: Resource allocation automatica tra attacchi
3. **Host Loss**: Automatic rebalancing dei gruppi rimanenti
4. **Emergency Stop**: XMR cost per terminazione anticipata

### Status Tracking

**Group States:**
- **Idle**: Disponibile per qualsiasi operazione
- **DDoSing**: Attualmente in attacco DDoS (+ target info)
- **Mining**: Operazione mining attiva (-50% DDoS power)
- **Compromised**: Host rilevati, temporaneamente non utilizzabili
- **Recovery**: In recovery post-detection (timer countdown)

## 🎯 Strategie Avanzate

### Multi-Target Coordination

**Synchronized Attacks:**
```javascript
// Esempio attacco coordinato
const coordinated = [
    {
        target: "gov.target1.com",
        groups: ["EU_Power", "NA_Stealth"],
        timing: "simultaneous"
    },
    {
        target: "corp.target2.com", 
        groups: ["APAC_Mining", "SA_Backup"],
        timing: "delayed_30s"
    }
];
```

**Benefits:**
- Divide l'attenzione del target
- Complica il trace-back
- Massimizza l'impatto mediatico
- Sfrutta different time zones

### Resource Optimization

**Power Allocation Matrix:**
```
         │ Low    │ Medium │ High   │ Critical
─────────┼────────┼────────┼────────┼─────────
Gov      │ Skip   │ 70%    │ 90%    │ 100%
Corp     │ 40%    │ 60%    │ 80%    │ 95%
Infra    │ 30%    │ 50%    │ 70%    │ 85%
Personal │ 20%    │ 40%    │ 60%    │ 75%
```

**Allocation Strategy:**
- Riserva power per target high-value
- Scala intensità basato su risk tolerance
- Mantieni emergency reserve (15-20%)
- Considera timing attacks per massimo impatto

### Anonymization Techniques

**Layered Approach:**
1. **Bot Diversity**: Mix geografico e ISP diversi
2. **Traffic Shaping**: Randomization patterns e timing
3. **Flow Variation**: Alternanza tecniche attacco
4. **Decoy Traffic**: Traffic noise per confondere analisi
5. **Exit Strategy**: Automatic retreat triggers

### Economic Considerations

**Cost-Benefit Analysis:**
```javascript
const attackROI = {
    xmrCost: estimateOperationCost(config),
    expectedGain: estimateReputationGain(config) * xmrPerReputation,
    riskCost: calculateRiskCost(config),
    opportunityCost: lostMiningRevenue(config.duration)
};

const netBenefit = expectedGain - (xmrCost + riskCost + opportunityCost);
```

## 🔧 Troubleshooting

### Problemi Comuni

#### "No DDoS Flows Available"
**Causa**: Nessun flusso con objective "denialOfService" salvato
**Soluzione**: 
1. Vai nell'Editor
2. Crea nuovo flusso o modifica esistente
3. Imposta Objective su "Denial of Service (DoS/DDoS)"
4. Includi blocchi DDoS (SYN Flood, UDP Flood, etc.)
5. Salva e torna alla tab DDoS

#### "Launch DDoS Attack" Disabilitato
**Possibili Cause:**
- Nessun bot group selezionato
- Target IP non valido o vuoto
- Nessun DDoS flow selezionato
- Tutti i gruppi selezionati in conflitto

**Verifica Checklist:**
- [ ] Almeno un gruppo selezionato
- [ ] IP target formato valido
- [ ] DDoS flow selezionato dal dropdown
- [ ] Gruppi non tutti impegnati in altri attacchi

#### "Insufficient Power" Warning
**Causa**: Potenza aggregata troppo bassa per target
**Soluzioni**:
- Seleziona gruppi aggiuntivi
- Termina operazioni mining per recuperare power
- Aspetta completamento altri attacchi DDoS
- Considera target meno protetti

#### Performance Degradation
**Sintomi**: Lag nell'interface, attacchi lenti
**Possibili Cause**:
- Troppi attacchi simultanei
- Host pool molto grande (>100 host)
- Browser resource limitations

**Ottimizzazioni**:
- Limita attacchi simultanei (max 3-4)
- Cleanup host inattivi periodicamente
- Usa bot groups più piccoli ma efficienti
- Restart browser se memory leak

### Debug Tools

**Console Commands:**
```javascript
// Inspection stato DDoS
console.log('Active DDoS:', state.activeDDoSAttacks);
console.log('Bot Groups:', state.botnetGroups);

// Force cleanup
cleanupExpiredAttacks();
resetStuckOperations();

// Manual power calculation
const group = state.botnetGroups['TestGroup'];
console.log('Group Power:', calculateGroupPower(group));
```

**Admin Panel Shortcuts:**
- "Reset Botnet": Cleanup completo stato botnet
- "Test Notifiche": Verifica sistema notifiche
- Controlli fazioni per testing reputazione

---

*Guida completa al sistema DDoS Impact - Versione 2.0*