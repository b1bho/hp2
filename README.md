# Hacker Tycoon - Rise of the Root 🖥️⚡

Un simulatore interattivo di hacking che consente ai giocatori di esplorare il mondo della cybersecurity attraverso un'esperienza educativa e coinvolgente. Costruisci la tua botnet, sviluppa exploit, gestisci attacchi e diventa il più grande hacker del mondo digitale.

## 🎯 Caratteristiche Principali

- **Simulazione Realistica**: Meccaniche di hacking basate su tecniche reali di cybersecurity
- **Editor di Flussi**: Sistema drag-and-drop per creare catene di attacco personalizzate
- **Mappa Globale 3D**: Visualizzazione interattiva dei target mondiali con Three.js
- **Sistema di Talenti**: Albero delle competenze con specializzazioni in diverse aree
- **Economia Virtuale**: Sistema monetario basato su Bitcoin e Monero
- **Gestione Botnet**: Controlla e orchestra reti di computer infetti
- **Mercato Nero**: Compra e vendi strumenti, dati e servizi illeciti

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
├── index.html              # Punto di ingresso principale
├── css/
│   └── style.css          # Stili dell'applicazione
├── js/
│   ├── main.js            # Script principale e gestione stato
│   ├── data.js            # Definizioni talenti e configurazioni
│   ├── flow_logic.js      # Logica per l'editor di flussi
│   ├── flow_validation.js # Validazione flussi di attacco
│   ├── world_data.js      # Dati delle nazioni e target
│   ├── quest_data.js      # Definizioni missioni e quest
│   ├── news_data.js       # Sistema di notizie dinamiche
│   └── modules/           # Moduli specializzati
│       ├── hq.js          # Quartier generale
│       ├── world.js       # Mappa mondiale e target
│       ├── botnet.js      # Gestione botnet
│       ├── editor.js      # Editor flussi drag-and-drop
│       ├── market.js      # Mercato legale
│       ├── dark_market.js # Mercato nero
│       ├── profile.js     # Sistema profilo e talenti
│       ├── quests.js      # Sistema missioni
│       ├── intelligence.js # Raccolta intelligence
│       ├── active_attacks.js # Attacchi attivi
│       └── admin.js       # Pannello amministrativo
```

## 🎮 Meccaniche di Gioco

### Sistema di Progressione

- **Punti Esperienza (XP)**: Ottenuti completando attacchi e missioni
- **Livelli**: Progressione che sblocca nuove funzionalità
- **Punti Talento**: Valuta per acquisire nuove competenze
- **Reputazione**: Influenza l'accesso a mercati e servizi

### Specializzazioni

1. **Ingegneria Sociale**: Phishing, social engineering, manipolazione
2. **Sviluppo Software**: Python, automazione, creazione malware
3. **Network Security**: Scansioni, exploit, penetration testing
4. **Crittografia**: Protezione dati, anonimizzazione, steganografia
5. **Forensics**: Analisi, recupero dati, investigazione
6. **Hardware Hacking**: Modifiche fisiche, elettronica

### Economia del Gioco

- **Bitcoin (BTC)**: Valuta principale per acquisti legali
- **Monero (XMR)**: Valuta anonima per il mercato nero
- **Valore Dinamico**: I prezzi delle criptovalute fluttuano realisticamente

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