# Sistema di Tracciabilità IP - Documentazione Completa 🕵️‍♂️

## Panoramica

Il Sistema di Tracciabilità IP è un nuovo componente avanzato di Hacker Tycoon che implementa un sistema dinamico per tracciare l'utilizzo degli indirizzi IP e le relative conseguenze per il giocatore.

## 🎯 Obiettivi del Sistema

1. **Realismo**: Ogni operazione lascia tracce digitali che si accumulano nel tempo
2. **Strategia**: I giocatori devono gestire attentamente l'uso degli IP per evitare detection
3. **Conseguenze**: IP "bruciati" diventano inutilizzabili e richiedono rigenerazione
4. **Progressione**: Il livello di indagine aumenta in base alle tracce accumulate

## 📊 Tipologie di IP Gestite

### 1. IP Computer Personale
- **Tipo**: `personal`
- **Caratteristiche**: 
  - Moltiplicatore di rischio più alto (2.0x)
  - Non rigenerabile automaticamente
  - Conseguenze gravi se bruciato

### 2. IP Server Clan
- **Tipo**: `clan_server`
- **Caratteristiche**:
  - Moltiplicatore moderato (1.5x)
  - Rigenerabile con costo XMR
  - Condiviso tra membri del clan

### 3. IP VPN Clan
- **Tipo**: `clan_vpn`
- **Caratteristiche**:
  - Moltiplicatore ridotto (1.2x)
  - Rigenerabile (50 XMR)
  - Maggiore anonimato

### 4. IP VPN/Proxy Pubblici
- **Tipo**: `public_vpn`
- **Caratteristiche**:
  - Moltiplicatore standard (1.0x)
  - Rigenerabile (25 XMR)
  - Facilmente sostituibili

### 5. IP Nodi Tor
- **Tipo**: `tor_node`
- **Caratteristiche**:
  - Moltiplicatore ridotto (0.8x)
  - Rigenerabile (10 XMR)
  - Massimo anonimato

### 6. IP Host Infetti
- **Tipo**: `infected_host`
- **Caratteristiche**:
  - Moltiplicatore moderato (1.1x)
  - Non rigenerabile (host viene rimosso se bruciato)
  - Utilizzati per DDoS e mining

## 🧮 Calcolo del Punteggio di Tracciabilità

### Fattori Base
- **Attacco Fallito**: +15 punti
- **Attacco Riuscito**: +5 punti
- **Attacco Parziale**: +10 punti

### Moltiplicatori per Caratteristiche del Flusso

#### Rilevabilità (RL)
- **Alta (>70)**: 1.5x
- **Media (40-70)**: 1.2x
- **Bassa (<40)**: 1.0x

#### Anonimato (AN)
- **Basso (<30)**: 1.8x
- **Medio (30-70)**: 1.3x
- **Alto (>70)**: 1.0x

#### Completezza Funzionale (FC)
- **Bassa (<50)**: 1.4x
- **Media (50-80)**: 1.1x
- **Alta (>80)**: 1.0x

### Moltiplicatori per Tier del Target
- **Tier 1**: 1.0x
- **Tier 2**: 1.5x
- **Tier 3**: 2.0x
- **Tier 4**: 3.0x

### Penalità per Uso Ripetuto
- **>3 utilizzi**: 1.3x

## 🚨 Soglie e Conseguenze

### Soglie di Rischio
```javascript
const TRACEABILITY_THRESHOLDS = {
    LOW: 0,        // Sicuro
    MEDIUM: 100,   // Attenzione
    HIGH: 200,     // Alto rischio
    CRITICAL: 350, // Critico
    BURNED: 500    // Bruciato
};
```

### Conseguenze per Livello

#### Livello Medio (100-199)
- Piccolo aumento del livello di indagine (+2)
- 20% di probabilità di attivare contromisure dei target
- Notifica di attenzione

#### Livello Alto (200-349)
- Aumento moderato del livello di indagine (+5)
- 50% di probabilità di attivare contromisure dei target
- Notifica di alto rischio

#### Livello Critico (350-499)
- Forte aumento del livello di indagine (+10)
- 80% di probabilità di attivare contromisure dei target
- Notifica di rischio critico

#### IP Bruciato (≥500)
- IP diventa inutilizzabile
- Azioni specifiche per tipo:
  - **Personal**: Forte aumento indagine (+50)
  - **Infected Host**: Rimozione automatica
  - **VPN/Proxy**: Scheduling rigenerazione automatica

## 🔄 Sistema di Rigenerazione IP

### IP Rigenerabili
- VPN Clan: 50 XMR
- VPN Pubbliche: 25 XMR
- Nodi Tor: 10 XMR
- Server Clan: 75 XMR

### Processo di Rigenerazione
1. Verifica disponibilità fondi XMR
2. Generazione nuovo IP casuale
3. Aggiornamento servizi/infrastrutture
4. Creazione nuova entry di tracciabilità
5. Marcatura vecchio IP come rigenerato

## 👤 Impatto sul Profilo Giocatore

### Variabili Tracciate
```javascript
playerTraces: {
    totalTraces: 0,           // Tracce totali accumulate
    investigationLevel: 0,    // Livello indagine (0-5)
    traceHistory: [],         // Storico delle tracce
    investigatedBy: 'Nessuna' // Agenzia che sta investigando
}
```

### Livelli di Indagine
0. **Nessuna** - Nessuna attenzione
1. **Locale** - Investigazioni locali (50+ tracce)
2. **Nazionale** - Attenzione nazionale (100+ tracce)
3. **Internazionale** - Cooperazione internazionale (200+ tracce)
4. **Globale** - Task force globali (500+ tracce)
5. **Massima** - Massima priorità (1000+ tracce)

### Agenzie Investigative
- FBI (Livello 1)
- NSA (Livello 2)
- Interpol (Livello 3)
- CIA (Livello 4)
- Europol (Livello 5)

## 🛡️ Contromisure Dinamiche dei Target

### Contromisure Tier 2+
Il sistema si integra con il modulo delle contromisure dinamiche per attivare:

#### 1. IP Rotation
- Cambio automatico dell'IP del target
- Interruzione attacchi in corso
- Necessità di nuova ricognizione

#### 2. Defense Hardening
- Aumento temporaneo parametri difensivi
- Durata basata sul tier del target
- Moltiplicatori crescenti per tier

#### 3. Last Node Detection
- Rilevamento migliorato della catena di routing
- Blocco tracce attraverso nodi anonimi
- Maggiore resistenza agli attacchi

### Probabilità di Attivazione
```javascript
const COUNTERMEASURE_PROBABILITIES = {
    1: { ip_rotation: 0.1, defense_hardening: 0.15, last_node_detection: 0.05 },
    2: { ip_rotation: 0.2, defense_hardening: 0.25, last_node_detection: 0.15 },
    3: { ip_rotation: 0.35, defense_hardening: 0.4, last_node_detection: 0.25 },
    4: { ip_rotation: 0.5, defense_hardening: 0.6, last_node_detection: 0.4 }
};
```

## 💥 Gestione Speciale DDoS e Mining

### Attacchi DDoS
- **Base**: +20 punti per host partecipante
- **Moltiplicatore Impatto**: Basato sull'efficacia dell'attacco
- **Rischio Perdita Host**: 30% se IP critico durante attacco fallito
- **Distribuzione Rischio**: Suddiviso tra tutti gli host partecipanti

### Operazioni Mining
- **Base**: +5 punti per host partecipante
- **Moltiplicatore Durata**: Fino a 2x per operazioni lunghe
- **Accumulo Graduale**: Tracce si accumulano nel tempo
- **Rischio Minore**: Meno rilevabile degli attacchi diretti

## 🔧 Integrazione con Sistemi Esistenti

### Flussi di Attacco (active_attacks.js)
- Integrazione automatica nel sistema di gestione attacchi
- Calcolo tracciabilità per ogni IP nella catena di routing
- Gestione host botnet e server clan

### Sistema Botnet (botnet.js)
- Tracciabilità per attacchi DDoS coordinati
- Gestione mining operation
- Pulizia automatica host compromessi

### Contromisure Dinamiche (dynamic_countermeasures.js)
- Attivazione contromisure basata su tracciabilità alta
- Integrazione con sistema di rotazione IP
- Feedback dinamico sui target

## 📱 Interfacce Utente

### Pagina Profilo - Sezione "Tracciabilità IP"
- **Stato Indagini**: Panoramica livello investigativo
- **Tabella IP**: Status dettagliato di tutti gli IP
- **Tracce Recenti**: Storico delle ultime attività
- **Azioni**: Pulsanti per rigenerazione IP

### HQ - Card Riassuntiva
- **Tracce Totali**: Contatore principale
- **Livello Indagine**: Status corrente
- **IP a Rischio**: Numero di IP critici
- **Agenzia**: Chi sta investigando

### Notifiche in Tempo Reale
- Incrementi di tracciabilità
- Cambi di livello di rischio
- IP bruciati
- Rigenerazioni completate
- Attivazione contromisure

## 🧪 Testing e Validazione

### Test Suite Completa
Il sistema include una suite di test completa (`ip-traceability-system.test.js`) che verifica:

1. **Inizializzazione Sistema**: Corretto setup delle strutture dati
2. **Calcolo Tracciabilità**: Algoritmi di calcolo score
3. **Applicazione Aumenti**: Gestione incrementi tracciabilità
4. **Status IP**: Recupero stato IP
5. **Integrazione DDoS**: Funzionalità specifiche DDoS
6. **Integrazione Mining**: Funzionalità specifiche mining
7. **Recupero Dati**: Funzioni di query dati

### Test Interattivo
File `ip-traceability-test.html` fornisce:
- **System Status**: Verifica caricamento moduli
- **Test Automatici**: Esecuzione suite di test
- **Demo Interattiva**: Simulazione funzionalità
- **Monitor IP**: Visualizzazione stato IP in tempo reale
- **Console Log**: Output dettagliato operazioni

## 🚀 Deployment e Configurazione

### File Richiesti
1. `js/modules/ip_traceability.js` - Modulo principale
2. Modifiche a `js/main.js` - Inizializzazione sistema
3. Modifiche a `js/data.js` - Strutture dati iniziali
4. Modifiche a `index.html` - Caricamento modulo
5. Aggiornamenti moduli esistenti per integrazione

### Configurazione Parametri
I parametri del sistema sono configurabili attraverso le costanti:
- `TRACEABILITY_FACTORS`: Fattori di calcolo base
- `TRACEABILITY_THRESHOLDS`: Soglie di rischio
- `REGENERATION_COSTS`: Costi rigenerazione IP

### Compatibilità
- **Backward Compatible**: Non rompe save esistenti
- **Graceful Degradation**: Funziona anche se alcuni moduli non sono disponibili
- **Progressive Enhancement**: Funzionalità avanzate solo se supportate

## 📈 Metriche e Analytics

### Dati Tracciati
- Numero totale di IP gestiti
- Distribuzioni score per tipo IP
- Frequenza rigenerazioni
- Efficacia contromisure
- Correlazione trace/successo attacchi

### Reportistica
- Top IP per rischio
- Trend tracciabilità nel tempo
- Impatto su success rate
- Costo totale rigenerazioni

## 🔮 Sviluppi Futuri

### Possibili Estensioni
1. **IP Reputation System**: Reputation globale per range IP
2. **Advanced Countermeasures**: Contromisure più sofisticate
3. **Collaborative Tracking**: Condivisione informazioni tra target
4. **Seasonal Events**: Eventi che modificano detection rates
5. **Advanced Analytics**: Dashboard dettagliate per power user

### Integrazione con Altri Sistemi
- **Faction System**: Contromisure specifiche per fazione
- **Market System**: Compravendita IP "puliti"
- **Quest System**: Missioni basate su tracciabilità
- **Reputation System**: Integrazione con reputazione player

---

*Documentazione v1.0 - Sistema di Tracciabilità IP*
*Implementato per Hacker Tycoon: Rise of the Root*