/**
 * Block Management Module
 * Handles block consolidation, categorization, and toolbox organization
 */

// Enhanced block categories with better organization
const ENHANCED_BLOCK_CATEGORIES = {
    // === CORE FRAMEWORK ===
    'framework': {
        name: 'Framework Base',
        color: '#8b5cf6',
        blocks: [
            'Punto di Ingresso (Target)',
            'Condizione (IF/ELSE)',
            'Ciclo (LOOP)',
            'Gestisci eccezioni script',
            'Ricevi segnale trigger'
        ]
    },
    
    // === DATA MANIPULATION ===
    'data_manipulation': {
        name: 'Manipolazione Dati',
        color: '#3b82f6',
        blocks: [
            'Crea Stringa',
            'Unisci Stringhe',
            'Inserisci Variabile in Testo',
            'Variabile (Imposta)',
            'Variabile (Ottieni)',
            'Importa file .CSV',
            'Filtra Dati per Attributo',
            'Estrai Pattern (Regex)',
            'Compara Archivi Dati'
        ]
    },

    // === RECONNAISSANCE ===
    'reconnaissance': {
        name: 'Ricognizione',
        color: '#10b981',
        blocks: [
            'Scansione rete locale',
            'Esegui port scan avanzato',
            'Scansiona reti Wi-Fi vicine',
            'Trova vulnerabilità software (scanner)',
            'Analisi Vulnerabilità (AI)',
            'Mappa topologia di rete',
            'Intercetta traffico di rete',
            'Intercetta chiamate API',
            'Analizza traffico di rete (base)',
            'Analizza log file',
            'Prendi Info da Archivio'
        ]
    },

    // === SOCIAL ENGINEERING ===
    'social_engineering': {
        name: 'Ingegneria Sociale',
        color: '#f59e0b',
        blocks: [
            'Genera Testo Persuasivo (AI)',
            'Crea fake login page',
            'Crea campagna spear phishing',
            'Simula attacco vishing/smishing',
            'Baiting/Quid Pro Quo',
            'Include link traccianti',
            'Crea Link Falso'
        ]
    },

    // === EXPLOITATION ===
    'exploitation': {
        name: 'Sfruttamento',
        color: '#ef4444',
        blocks: [
            'Esegui SQL Injection (base)',
            'Enumera tabelle database',
            'Bypassa autenticazione SQL',
            'Identifica vulnerabilità XSS (base)',
            'Esegui Cross-Site Scripting (XSS)',
            'Sfrutta Cross-Site Request Forgery (CSRF)',
            'Crea exploit per buffer overflow',
            'Sviluppa exploit per zero-day',
            'Cracka password Wi-Fi (WEP/WPA)'
        ]
    },

    // === MALWARE DEVELOPMENT ===
    'malware_development': {
        name: 'Sviluppo Malware',
        color: '#a855f7',
        blocks: [
            'Crea keylogger base',
            'Sviluppa backdoor semplice',
            'Sviluppa ransomware semplice',
            'Genera worm di rete',
            'Genera rootkit (base)',
            'Crea trojan avanzato',
            'Sviluppa Modulo Malware (AI)',
            'Crea shellcode base'
        ]
    },

    // === DEPLOYMENT & CONTROL ===
    'deployment_control': {
        name: 'Deploy e Controllo',
        color: '#dc2626',
        blocks: [
            'Esegui Comando Remoto',
            'Automatizza deploy tool',
            'Carica shell web',
            'Scrivi su Registro di Sistema',
            'Integra con rete Tor',
            'Crea VPN personalizzata',
            'Crea canale covert'
        ]
    },

    // === NETWORK ATTACKS ===
    'network_attacks': {
        name: 'Attacchi di Rete',
        color: '#dc2626',
        blocks: [
            'Lancia attacco SYN Flood',
            'Genera traffico UDP Flood',
            'Attacco Layer 7 (HTTP Flood)',
            'Coordina botnet per DDoS',
            'Esegui attacco deautenticazione',
            'Crea fake AP (Evil Twin)'
        ]
    },

    // === DATA ACQUISITION ===
    'data_acquisition': {
        name: 'Acquisizione Dati',
        color: '#059669',
        blocks: [
            'Esfiltra intero database',
            'Cattura Screenshot',
            'Estrai email da database',
            'Cerca Stringa in Archivio',
            'Decompila eseguibile (base)',
            'Analizza codice binario'
        ]
    },

    // === STEALTH & EVASION ===
    'stealth_evasion': {
        name: 'Stealth e Evasione',
        color: '#6b7280',
        blocks: [
            'Usa proxy singolo',
            'Configura catena di proxy',
            'Bypassa geolocalizzazione',
            'Crittografa payload',
            'Offusca codice sorgente',
            'Nascondi messaggio in immagine'
        ]
    },

    // === CLEANUP & PERSISTENCE ===
    'cleanup_persistence': {
        name: 'Pulizia e Persistenza',
        color: '#374151',
        blocks: [
            'Cancella log di sistema',
            'Pulisci database (rimuovi tracce)',
            'Imposta loop di esecuzione'
        ]
    },

    // === COMMUNICATION ===
    'communication': {
        name: 'Comunicazione',
        color: '#1d4ed8',
        blocks: [
            'Imposta Oggetto Email',
            'Imposta Corpo Email',
            'Invia Email',
            'Genera Testo (AI)',
            'Genera Immagine (AI)'
        ]
    },

    // === OUTPUT & STORAGE ===
    'output_storage': {
        name: 'Output e Storage',
        color: '#7c3aed',
        blocks: [
            'Salva IP raccolti',
            'Esporta in dark market'
        ]
    },

    // === DEVELOPMENT TOOLS ===
    'development_tools': {
        name: 'Strumenti Sviluppo',
        color: '#0d9488',
        blocks: [
            'Crea script per automazione base',
            'Compila pacchetto eseguibile',
            'Crea tool eseguibile',
            'Ottimizza performance tool',
            'Ricostruisci protocollo di comunicazione'
        ]
    },

    // === DEFENSIVE TOOLS ===
    'defensive_tools': {
        name: 'Strumenti Difensivi',
        color: '#65a30d',
        blocks: [
            'Costruisci firewall base',
            'Deploy honeypot',
            'Configura IDS/IPS',
            'Analizza alert di sicurezza'
        ]
    }
};

// Blocks to be deprecated or merged (based on audit)
const DEPRECATED_BLOCKS = [
    'Genera Testo (AI)', // Redundant with "Genera Testo Persuasivo (AI)"
    'Baiting/Quid Pro Quo', // Too niche, merge with social engineering
    'Enumera tabelle database', // Redundant with SQL Injection
    'Bypassa autenticazione SQL', // Merge with SQL Injection
    'Usa proxy singolo', // Redundant with proxy chain
    'Imposta Oggetto Email', // Merge with Email sending
    'Imposta Corpo Email', // Merge with Email sending
    'Variabile (Imposta)', // Simplify variable handling
    'Variabile (Ottieni)', // Simplify variable handling
];

// Consolidated blocks that replace multiple existing blocks
const CONSOLIDATED_BLOCKS = {
    'Gestione Avanzata Email': {
        description: 'Crea, personalizza e invia email con contenuti dinamici',
        replaces: ['Imposta Oggetto Email', 'Imposta Corpo Email', 'Invia Email'],
        inputs: [
            { type: 'ControlFlow', name: 'In' },
            { type: 'EmailAddress', name: 'Recipient' },
            { type: 'Text', name: 'Subject', optional: true },
            { type: 'Text', name: 'Body', optional: true }
        ],
        outputs: [
            { type: 'ControlFlow', name: 'Out' }
        ],
        category: 'communication'
    },
    
    'SQL Exploitation Suite': {
        description: 'Toolkit completo per attacchi SQL: injection, bypass, enumerazione',
        replaces: ['Esegui SQL Injection (base)', 'Enumera tabelle database', 'Bypassa autenticazione SQL'],
        inputs: [
            { type: 'ControlFlow', name: 'In' },
            { type: 'Target', name: 'Target' }
        ],
        outputs: [
            { type: 'ControlFlow', name: 'Out' },
            { type: 'DataPacket', name: 'Result Data' },
            { type: 'List<Text>', name: 'Table Names' },
            { type: 'Boolean', name: 'Auth Bypassed' }
        ],
        category: 'exploitation'
    },

    'Generatore Contenuti AI': {
        description: 'Genera testi persuasivi, immagini e contenuti mirati con AI',
        replaces: ['Genera Testo (AI)', 'Genera Testo Persuasivo (AI)', 'Genera Immagine (AI)'],
        inputs: [
            { type: 'ControlFlow', name: 'In' },
            { type: 'Text', name: 'Prompt' },
            { type: 'Text', name: 'Content Type', optional: true }
        ],
        outputs: [
            { type: 'ControlFlow', name: 'Out' },
            { type: 'Text', name: 'Generated Text' },
            { type: 'Image', name: 'Generated Image', optional: true }
        ],
        category: 'social_engineering'
    },

    'Sistema Proxy Avanzato': {
        description: 'Gestione completa proxy: singolo, catena, Tor, VPN',
        replaces: ['Usa proxy singolo', 'Configura catena di proxy', 'Bypassa geolocalizzazione'],
        inputs: [
            { type: 'ControlFlow', name: 'In' },
            { type: 'Text', name: 'Proxy Type', optional: true }
        ],
        outputs: [
            { type: 'ControlFlow', name: 'Out' }
        ],
        category: 'stealth_evasion'
    },

    'Gestione Variabili Intelligente': {
        description: 'Sistema unificato per creare, impostare e utilizzare variabili',
        replaces: ['Variabile (Imposta)', 'Variabile (Ottieni)', 'Inserisci Variabile in Testo'],
        inputs: [
            { type: 'ControlFlow', name: 'In' },
            { type: 'Text', name: 'Variable Name' },
            { type: 'Text', name: 'Value', optional: true },
            { type: 'Text', name: 'Template', optional: true }
        ],
        outputs: [
            { type: 'ControlFlow', name: 'Out' },
            { type: 'Text', name: 'Variable Value' },
            { type: 'Text', name: 'Processed Text', optional: true }
        ],
        category: 'data_manipulation'
    }
};

/**
 * Get enhanced block descriptions for tooltips
 */
function getEnhancedBlockDescription(blockName) {
    const category = getBlockCategory(blockName);
    const categoryInfo = ENHANCED_BLOCK_CATEGORIES[category];
    
    // Basic description from interface
    const basicDescription = getBasicBlockDescription(blockName);
    
    // Enhanced with category context and usage hints
    const enhancements = {
        'Scansione rete locale': {
            description: 'Identifica dispositivi e servizi nella rete locale. Primo passo per mappare l\'infrastruttura del target.',
            usage: 'Essenziale per reconnaissance. Combina con port scan per risultati dettagliati.',
            risk: 'Visibilità: Media'
        },
        'Coordina botnet per DDoS': {
            description: 'Orchestrata attacchi DDoS distribuiti utilizzando una rete di bot compromessi.',
            usage: 'Richiede altri blocchi di generazione traffico per massima efficacia.',
            risk: 'Rischio legale: Alto'
        },
        'Sviluppa Modulo Malware (AI)': {
            description: 'Utilizza intelligenza artificiale per creare malware personalizzato e difficile da rilevare.',
            usage: 'Combina con deploy tool per distribuzione automatica.',
            risk: 'Efficacia: Alta, Rilevabilità: Bassa'
        }
        // Add more enhanced descriptions...
    };

    const enhanced = enhancements[blockName];
    if (enhanced) {
        return {
            description: enhanced.description,
            usage: enhanced.usage,
            risk: enhanced.risk,
            category: categoryInfo?.name || 'Generale'
        };
    }

    return {
        description: basicDescription || 'Blocco per operazioni specializzate.',
        category: categoryInfo?.name || 'Generale'
    };
}

/**
 * Get the category of a block
 */
function getBlockCategory(blockName) {
    for (const [categoryId, categoryInfo] of Object.entries(ENHANCED_BLOCK_CATEGORIES)) {
        if (categoryInfo.blocks.includes(blockName)) {
            return categoryId;
        }
    }
    return 'misc';
}

/**
 * Get basic block description (placeholder for existing function)
 */
function getBasicBlockDescription(blockName) {
    // This would interface with existing description system
    return null;
}

/**
 * Check if a block is deprecated
 */
function isBlockDeprecated(blockName) {
    return DEPRECATED_BLOCKS.includes(blockName);
}

/**
 * Get consolidation suggestion for a block
 */
function getConsolidationSuggestion(blockName) {
    for (const [consolidatedName, consolidatedInfo] of Object.entries(CONSOLIDATED_BLOCKS)) {
        if (consolidatedInfo.replaces.includes(blockName)) {
            return {
                suggestion: consolidatedName,
                description: consolidatedInfo.description,
                benefits: `Sostituisce ${consolidatedInfo.replaces.length} blocchi con funzionalità unificate`
            };
        }
    }
    return null;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ENHANCED_BLOCK_CATEGORIES,
        DEPRECATED_BLOCKS,
        CONSOLIDATED_BLOCKS,
        getEnhancedBlockDescription,
        getBlockCategory,
        isBlockDeprecated,
        getConsolidationSuggestion
    };
}