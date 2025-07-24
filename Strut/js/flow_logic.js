// File: js/flow_logic.js
// VERSIONE CORRETTA: Aggiornate le categorie dei blocchi malware per la validazione della botnet.

const blockCategories = {
    // --- Accesso / Identificazione ---
    'Scansione rete locale': 'access',
    'Esegui port scan avanzato': 'access',
    'Scansiona reti Wi-Fi vicine': 'access',
    'Identifica vulnerabilità XSS (base)': 'access',
    
    // --- Acquisizione Dati ---
    'Esegui SQL Injection (base)': 'acquisition',
    'Crea fake login page': 'acquisition',
    'Sviluppa keylogger base': 'acquisition',
    'Esfiltra intero database': 'acquisition',
    'Cattura Screenshot': 'acquisition',
    'Estrai email da database': 'acquisition',
    'Importa file .CSV': 'acquisition',
    
    // --- Esfiltrazione / Archiviazione ---
    'Salva IP raccolti': 'exfiltration',
    'Esfiltra dati da database': 'exfiltration',
    'Crea canale covert': 'exfiltration',
    'Invia Email': 'exfiltration',
    'Esporta in dark market': 'exfiltration',
    'Nascondi messaggio in immagine': 'exfiltration',

    // --- Deploy / Infezione / Exploit ---
    'Esegui Comando Remoto': 'deploy',
    'Automatizza deploy tool': 'deploy',
    'Carica shell web': 'deploy',
    'Crea exploit per buffer overflow': 'deploy',
    'Sviluppa exploit per zero-day': 'deploy',
    'Esegui Cross-Site Scripting (XSS)': 'deploy',

    // --- Controllo Remoto / C2 ---
    'Integra con rete Tor': 'c2',
    'Crea VPN personalizzata': 'c2',

    // --- Persistenza ---
    'Scrivi su Registro di Sistema': 'persistence',
    'Imposta loop di esecuzione': 'persistence',
    'Genera rootkit (base)': 'persistence',

    // --- Generazione Traffico (DoS) ---
    'Lancia attacco SYN Flood': 'dos_traffic',
    'Genera traffico UDP Flood': 'dos_traffic',
    'Attacco Layer 7 (HTTP Flood)': 'dos_traffic',
    
    // --- Orchestrazione (DDoS) ---
    'Coordina botnet per DDoS': 'dos_orchestration',

    // --- Propagazione / Replicazione (Worm) ---
    'Genera worm di rete': 'replication',

    // --- Cifratura (Ransomware / Stealth) ---
    'Sviluppa ransomware semplice': 'encryption',
    'Crittografa payload': 'encryption',
    
    // --- Pulizia Tracce ---
    'Cancella log di sistema': 'cleanup',
    'Pulisci database (rimuovi tracce)': 'cleanup',
    'Modifica timestamp file': 'cleanup',
    'Sovrascrivi dati (sicurezza)': 'cleanup',

    // --- Ingegneria Sociale ---
    'Genera Testo Persuasivo (AI)': 'social_engineering',
    'Crea campagna spear phishing': 'social_engineering',
    'Simula attacco vishing/smishing': 'social_engineering',
    'Crea Link Falso': 'social_engineering',

    // --- Componenti Malware / Bot ---
    'Sviluppa backdoor semplice': 'bot_component', // CORRETTO
    'Sviluppa Modulo Malware (AI)': 'bot_component', // CORRETTO
    'Crea trojan avanzato': 'malware_component',

    // --- Ricognizione ---
    'Trova vulnerabilità software (scanner)': 'recon',
    'Intercetta chiamate API': 'recon',
    'Prendi Info da Archivio': 'recon',
    'Analizza endpoint API': 'recon',
    'Analizza log file': 'recon',
    'Decompila eseguibile (base)': 'recon',
    'Analizza traffico di rete (base)': 'recon',
    'Analisi Vulnerabilità (AI)': 'recon',
    'Mappa topologia di rete': 'recon',
};

const flowObjectives = {
    'none': {
        label: 'Nessuno',
        description: 'Un flusso generico senza un obiettivo specifico. La sua efficacia non verrà validata.',
        pfe: {}
    },
    'dataExfiltration': {
        label: 'Esfiltrazione Dati',
        description: 'Ruba informazioni specifiche da un target. Richiede almeno 4 blocchi per essere considerato efficace.',
        minBlocks: 4,
        pfe: {
            access_path: {
                required: true,
                weight: 0.25,
                hint: "Manca un percorso di accesso valido (es. Scansione Rete oppure Analisi Vulnerabilità + Deploy).",
                paths: [
                    ['access'],
                    ['recon', 'deploy']
                ]
            },
            acquisition: { required: true, weight: 0.35, hint: "Manca un blocco per l'acquisizione dei dati (es. SQL Injection, Keylogger)." },
            exfiltration: { required: true, weight: 0.25, hint: "Manca un blocco per salvare o inviare i dati rubati (es. Salva IP, Invia Email)." },
            cleanup: { required: false, weight: 0.15, hint: "Consigliato: aggiungi un blocco per la pulizia delle tracce per ridurre il rischio." }
        }
    },
    'remoteControl': {
        label: 'Controllo Remoto',
        description: 'Ottieni e mantieni un accesso non autorizzato a un sistema. Richiede almeno 5 blocchi per persistenza efficace.',
        minBlocks: 5,
        pfe: {
            access: { required: true, weight: 0.2, hint: "Manca un blocco per accedere inizialmente al target." },
            deploy: { required: true, weight: 0.3, hint: "Manca un blocco per installare il tool sul target (es. Esegui Comando Remoto)." },
            c2: { required: true, weight: 0.3, hint: "Manca un componente di controllo remoto (es. Backdoor, Canale Covert)." },
            persistence: { required: true, weight: 0.2, hint: "Manca un meccanismo di persistenza (es. Scrivi su Registro di Sistema)." }
        }
    },
    'denialOfService': {
        label: 'Denial of Service (DoS/DDoS)',
        description: 'Rendi un servizio o un sito inaccessibile. Per DDoS efficace servono almeno 4 blocchi.',
        minBlocks: 3,
        pfe: {
            access: { required: true, weight: 0.2, hint: "Manca un blocco per identificare il target (es. Scansione Rete)." },
            dos_traffic: { required: true, weight: 0.6, hint: "Manca un blocco per la generazione di traffico (es. SYN Flood). OBBLIGATORIO per DoS/DDoS." },
            dos_orchestration: { required: false, weight: 0.2, hint: "Per un DDoS devastante, aggiungi coordinamento botnet (es. Coordina Botnet)." }
        }
    },
    'reconnaissance': {
        label: 'Ricognizione / Intelligence',
        description: 'Raccogli informazioni dettagliate su un target e le sue vulnerabilità. Almeno 3 blocchi per analisi completa.',
        minBlocks: 3,
        pfe: {
            recon: { required: true, weight: 0.6, hint: "Manca un blocco di analisi o scansione (es. Analizza Log, Trova Vulnerabilità)." },
            access: { required: false, weight: 0.2, hint: "Consigliato: aggiungi scansione rete per mappatura completa." },
            exfiltration: { required: true, weight: 0.2, hint: "Manca un blocco per salvare o visualizzare i risultati (es. Salva IP, Mappa Rete)." }
        }
    },
    'ransomware': {
        label: 'Cifratura Dati (Ransomware)',
        description: 'Cripta i dati di un target per richiederne un riscatto. Richiede almeno 4 blocchi per essere efficace.',
        minBlocks: 4,
        pfe: {
            access: { required: true, weight: 0.2, hint: "Serve un modo per accedere al target prima di distribuire il ransomware." },
            deploy: { required: true, weight: 0.3, hint: "Manca un blocco per distribuire il payload sul target (es. Automatizza Deploy)." },
            encryption: { required: true, weight: 0.4, hint: "Manca il componente fondamentale di cifratura (es. Sviluppa Ransomware). OBBLIGATORIO." },
            c2: { required: false, weight: 0.1, hint: "Consigliato: canale di comunicazione per richiesta riscatto." }
        }
    },
    'worm': {
        label: 'Propagazione Malware (Worm)',
        description: 'Diffondi un malware che si replica autonomamente su nuovi sistemi. Richiede almeno 4 blocchi.',
        minBlocks: 4,
        pfe: {
            replication: { required: true, weight: 0.4, hint: "Manca il componente di replicazione (es. Genera Worm di Rete). OBBLIGATORIO." },
            access: { required: true, weight: 0.3, hint: "Manca un blocco per trovare nuovi target da infettare (es. Scansione Rete)." },
            deploy: { required: true, weight: 0.3, hint: "Manca un vettore di infezione per raggiungere i nuovi target (es. Esegui Comando Remoto)." }
        }
    },
    'botnet': {
        label: 'Creazione Botnet',
        description: 'Infetta e recluta sistemi per formare una rete di "bot" controllabili. Richiede almeno 5 blocchi per essere efficace.',
        minBlocks: 5,
        pfe: {
            bot_component: { required: true, weight: 0.3, hint: "Manca il componente malware del bot (es. Sviluppa Backdoor, Modulo Malware AI). OBBLIGATORIO." },
            deploy: { required: true, weight: 0.25, hint: "Manca un meccanismo per infettare i target (es. Automatizza Deploy Tool)." },
            access: { required: true, weight: 0.2, hint: "Manca un blocco per trovare nuovi target da reclutare (es. Scansione Rete)." },
            c2: { required: true, weight: 0.25, hint: "Manca un canale di Command & Control per gestire la botnet (es. Integra con Tor). OBBLIGATORIO." }
        }
    },
    'socialEngineering': {
        label: 'Ingegneria Sociale Avanzata',
        description: 'Campagna completa di manipolazione psicologica per compromettere target umani. Almeno 4 blocchi per efficacia.',
        minBlocks: 4,
        pfe: {
            social_engineering: { required: true, weight: 0.4, hint: "Manca un blocco di ingegneria sociale (es. Genera Testo Persuasivo, Spear Phishing). OBBLIGATORIO." },
            acquisition: { required: true, weight: 0.3, hint: "Manca un metodo per acquisire informazioni/credenziali (es. Fake Login Page)." },
            exfiltration: { required: false, weight: 0.2, hint: "Consigliato: salva i dati ottenuti per uso futuro." },
            cleanup: { required: false, weight: 0.1, hint: "Consigliato: pulizia tracce per non insospettire la vittima." }
        }
    }
};
