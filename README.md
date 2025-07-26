# Hacker Tycoon - Rise of the Root 🖥️⚡

Un simulatore interattivo di hacking che consente ai giocatori di esplorare il mondo della cybersecurity attraverso un'esperienza educativa e coinvolgente. Costruisci la tua botnet, sviluppa exploit, gestisci attacchi e diventa il più grande hacker del mondo digitale.

## 🎯 Caratteristiche Principali

- **Simulazione Realistica**: Meccaniche di hacking basate su tecniche reali di cybersecurity
- **Editor di Flussi**: Sistema drag-and-drop per creare catene di attacco personalizzate
- **Editor 2.0**: Sistema template-based avanzato con template OSINT, Ransomware, Keylogger e Botnet Agent
- **Template OSINT**: Sistema completo per Open Source Intelligence con 3 livelli di complessità
- **Mappa Globale 3D**: Visualizzazione interattiva dei target mondiali con Three.js
- **Sistema di Talenti**: Albero delle competenze con specializzazioni in diverse aree
- **Economia Virtuale**: Sistema monetario basato su Bitcoin e Monero
- **Gestione Botnet Avanzata**: Interfaccia tabbed per gestione, DDoS e mining
- **Sistema DDoS Impact**: Attacchi coordinati multi-target con calcolo impatto real-time
- **Sistema Fazioni**: Reputazione dinamica con governmental, terrorist, eco-terrorist e population
- **Console Intelligence**: Laboratorio dati per analisi intelligence e archivi
- **Menu Laterale Dinamico**: Interface collapsible con indicators di stato e news feed
- **Mercato Nero**: Compra e vendi strumenti, dati e servizi illeciti
- **Pannello Admin**: Controlli debug completi per sviluppo e testing

## 🚀 Avvio Rapido

### Prerequisiti

- Browser web moderno (Chrome, Firefox, Safari, Edge)
- Server web locale (opzionale per sviluppo)

### Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/b1bho/hp2.git
   cd hp2
   ```

2. Avvia un server web locale:
   ```bash
   cd Strut
   python3 -m http.server 8000
   # oppure
   npx serve .
   ```

3. Apri il browser e naviga su:
   ```
   http://localhost:8000
   ```

### Utilizzo Base

1. **Inizia dal HQ**: Il tuo quartier generale per monitorare statistiche e hardware
2. **Esplora il Mondo**: Utilizza la mappa 3D per identificare obiettivi globali
3. **Sviluppa Talenti**: Investi punti talento per sbloccare nuove abilità
4. **Crea Flussi**: Usa l'editor per progettare catene di attacco personalizzate
5. **Gestisci Botnet**: Coordina i tuoi host infetti per massimizzare l'efficacia

## 🏗️ Architettura del Progetto

```
Strut/
├── index.html              # Punto di ingresso principale con menu laterale avanzato
├── css/
│   └── style.css          # Stili dell'applicazione con tema cyberpunk
├── js/
│   ├── main.js            # Script principale e gestione stato globale
│   ├── data.js            # Definizioni talenti e configurazioni di gioco
│   ├── flow_logic.js      # Logica per l'editor di flussi e validazione
│   ├── flow_validation.js # Validazione avanzata flussi di attacco
│   ├── world_data.js      # Dati delle nazioni e target globali
│   ├── world_targets_data.js # Dati dettagliati target per nazione
│   ├── quest_data.js      # Definizioni missioni e quest system
│   ├── news_data.js       # Sistema di notizie dinamiche e eventi
│   └── modules/           # Moduli specializzati per funzionalità
│       ├── hq.js          # Quartier generale e dashboard
│       ├── world.js       # Mappa mondiale 3D con Three.js
│       ├── botnet.js      # Gestione botnet avanzata (Management/DDoS/Mining)
│       ├── editor.js      # Editor flussi drag-and-drop con griglia
│       ├── market.js      # Mercato legale per hardware/software
│       ├── dark_market.js # Mercato nero per servizi illeciti
│       ├── profile.js     # Sistema profilo, talenti e progressione
│       ├── quests.js      # Sistema missioni e obiettivi
│       ├── intelligence.js # Console intelligence e laboratorio dati
│       ├── active_attacks.js # Monitoring attacchi in tempo reale
│       ├── admin.js       # Pannello amministrativo e debug
│       ├── factions.js    # Sistema fazioni (governmental/terrorist/eco/population)
│       └── reputation_system.js # Gestione reputazione e relazioni fazioni
```

## 🎮 Meccaniche di Gioco

### Sistema di Progressione

- **Punti Esperienza (XP)**: Ottenuti completando attacchi e missioni
- **Livelli**: Progressione che sblocca nuove funzionalità e aumenta capacità
- **Punti Talento**: Valuta per acquisire nuove competenze specializzate
- **Reputazione Multi-Faction**: Sistema avanzato con 4 fazioni (Governmental, Terrorist, Eco-Terrorist, Population)

### Specializzazioni

1. **Ingegneria Sociale**: Phishing, social engineering, manipolazione psicologica
2. **Sviluppo Software**: Python, automazione, creazione malware avanzato
3. **Network Security**: Scansioni, exploit, penetration testing avanzato
4. **Crittografia**: Protezione dati, anonimizzazione, steganografia
5. **Forensics**: Analisi digitale, recupero dati, investigazione
6. **Hardware Hacking**: Modifiche fisiche, elettronica, firmware

### Sistema Botnet Avanzato

- **Gestione Multi-Tab**: Interface separata per Management, DDoS e Mining
- **Bot Groups**: Organizzazione host infetti in gruppi per operazioni coordinate
- **DDoS Impact System**: Attacchi distribuiti con calcolo impatto real-time
- **Mining Operations**: Operazioni cryptocurrency parallele agli attacchi
- **Monitoring Real-time**: Dashboard live per stato botnet e operazioni attive

### Sistema DDoS

- **Target Selection**: Selezione IP target con validazione
- **Flow Integration**: Utilizzo flussi DDoS creati nell'editor
- **Impact Calculation**: Calcolo automatico impatto basato su potenza botnet
- **Risk Assessment**: Valutazione rischio tracciabilità e perdita bot
- **Multi-Attack**: Gestione attacchi simultanei su target multipli

### Economia del Gioco

- **Bitcoin (BTC)**: Valuta principale per acquisti legali con prezzi fluttuanti
- **Monero (XMR)**: Valuta anonima per il mercato nero e operazioni illecite
- **Valore Dinamico**: Simulazione realistica mercato cryptocurrency
- **Mining Integration**: Generazione XMR tramite botnet mining operations

## 🔧 Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI Framework**: Tailwind CSS
- **3D Graphics**: Three.js per la mappa mondiale
- **Interattività**: Interact.js per drag-and-drop
- **Visualizzazioni**: Leader Line per connessioni
- **Storage**: LocalStorage per persistenza dati

## 📚 Documentazione Dettagliata

- [Architettura del Codice](docs/ARCHITECTURE.md)
- [Documentazione Moduli](docs/MODULES.md)
- [Meccaniche di Gioco](docs/GAME_MECHANICS.md)
- [Guida Sviluppatori](docs/DEVELOPMENT.md)
- [API Reference](docs/API.md)

## 🎯 Obiettivi Educativi

Questo simulatore ha scopi puramente educativi e mira a:

- Sensibilizzare sui rischi della cybersecurity
- Insegnare tecniche di protezione e difesa
- Promuovere lo sviluppo di competenze etiche
- Fornire una comprensione pratica delle minacce digitali

## ⚖️ Considerazioni Etiche

**IMPORTANTE**: Questo software è destinato esclusivamente a scopi educativi e di ricerca. L'uso delle tecniche descritte deve sempre rispettare:

- Leggi locali e internazionali
- Codice etico dei professionisti IT
- Consenso esplicito per test di penetrazione
- Principi di responsible disclosure

## 🤝 Contributi

I contributi sono benvenuti! Per contribuire:

1. Fork il repository
2. Crea un branch per la tua feature (`git checkout -b feature/nuova-funzionalita`)
3. Commit le modifiche (`git commit -am 'Aggiunta nuova funzionalità'`)
4. Push del branch (`git push origin feature/nuova-funzionalita`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza [MIT](LICENSE). Vedi il file LICENSE per maggiori dettagli.

## 🙏 Riconoscimenti

- Three.js per la grafica 3D
- Tailwind CSS per il framework UI
- Font Awesome per le icone
- La comunità cybersecurity per l'ispirazione

---

*Sviluppato con ❤️ per promuovere l'educazione alla cybersecurity*