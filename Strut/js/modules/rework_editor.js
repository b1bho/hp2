// File: js/modules/rework_editor.js
// New Template-Based Editor System with Fixed Flow Interconnections

// Tool templates with predefined flows and fixed interconnections
const toolTemplates = {
    'ransomware': {
        name: 'Ransomware',
        description: 'Template per la creazione di ransomware con nodi di crittografia, payload e distribuzione',
        maxTemplateLevel: 3,
        templateLevel: 1,
        levelRequirements: {
            2: ['Malware Attivi LV2', 'Sviluppo LV2', 'Stealth LV2'],
            3: ['Malware Attivi LV3', 'Sviluppo LV3', 'Stealth LV3']
        },
        levels: {
            1: {
                nodes: [
                    {
                        id: 'entry',
                        type: 'entry',
                        name: 'Target Entry',
                        position: { x: 100, y: 100 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Target Singolo', description: 'Colpisce un singolo target' },
                            2: { name: 'Target Multipli', description: 'Colpisce più target simultaneamente', requires: ['Networking LV2'] },
                            3: { name: 'Scan Automatico', description: 'Identifica automaticamente target vulnerabili', requires: ['Malware Attivi LV2'] }
                        }
                    },
                    {
                        id: 'payload',
                        type: 'encryption',
                        name: 'Encryption Engine',
                        position: { x: 300, y: 100 },
                        level: 1,
                        maxLevel: 4,
                        upgrades: {
                            1: { name: 'AES-128', description: 'Crittografia base AES-128' },
                            2: { name: 'AES-256', description: 'Crittografia avanzata AES-256', requires: ['Stealth LV2'] },
                            3: { name: 'Multi-Layer', description: 'Crittografia a più livelli', requires: ['Stealth LV3'] },
                            4: { name: 'Quantum-Resistant', description: 'Resistente agli attacchi quantistici', requires: ['Stealth LV3', 'Malware Attivi LV2'] }
                        }
                    },
                    {
                        id: 'distribution',
                        type: 'delivery',
                        name: 'Distribution Module',
                        position: { x: 500, y: 100 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Email Phishing', description: 'Distribuzione tramite email di phishing' },
                            2: { name: 'Network Worm', description: 'Distribuzione automatica via rete', requires: ['Networking LV2'] },
                            3: { name: 'Multi-Vector', description: 'Distribuzione su più vettori', requires: ['Ingegneria Sociale LV2', 'Networking LV2'] }
                        }
                    },
                    {
                        id: 'persistence',
                        type: 'persistence',
                        name: 'Persistence Module',
                        position: { x: 300, y: 250 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Registry Entry', description: 'Persistenza tramite registro di sistema' },
                            2: { name: 'Service Creation', description: 'Crea servizio di sistema', requires: ['Sviluppo LV2'] },
                            3: { name: 'Rootkit Integration', description: 'Integrazione con rootkit', requires: ['Stealth LV3'] }
                        }
                    },
                    {
                        id: 'compiler',
                        type: 'compiler',
                        name: 'Compiler',
                        position: { x: 700, y: 175 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Basic Compilation', description: 'Compilazione base del ransomware' },
                            2: { name: 'Code Obfuscation', description: 'Offuscamento del codice', requires: ['Stealth LV2'] },
                            3: { name: 'Anti-Analysis', description: 'Tecniche anti-analisi', requires: ['Stealth LV3'] }
                        }
                    }
                ],
                connections: [
                    { from: 'entry', to: 'payload' },
                    { from: 'payload', to: 'distribution' },
                    { from: 'payload', to: 'persistence' },
                    { from: 'distribution', to: 'compiler' },
                    { from: 'persistence', to: 'compiler' }
                ]
            },
            2: {
                nodes: [
                    // Level 1 nodes remain
                    {
                        id: 'entry',
                        type: 'entry',
                        name: 'Target Entry',
                        position: { x: 100, y: 100 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Target Singolo', description: 'Colpisce un singolo target' },
                            2: { name: 'Target Multipli', description: 'Colpisce più target simultaneamente', requires: ['Networking LV2'] },
                            3: { name: 'Scan Automatico', description: 'Identifica automaticamente target vulnerabili', requires: ['Malware Attivi LV2'] }
                        }
                    },
                    // New Level 2 nodes as specified in requirements
                    {
                        id: 'antivirus_evasion',
                        type: 'stealth',
                        name: 'Evasione Antivirus (Base)',
                        position: { x: 100, y: 250 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Evasione Base', description: 'Tecniche base di evasione antivirus' },
                            2: { name: 'Evasione Standard', description: 'Evasione antivirus migliorata', requires: ['Stealth LV2'] }
                        }
                    },
                    {
                        id: 'file_encrypt',
                        type: 'encryption',
                        name: 'Crittografa File (Standard)',
                        position: { x: 300, y: 100 },
                        level: 2,
                        maxLevel: 3,
                        upgrades: {
                            2: { name: 'Crittografia Standard', description: 'Crittografia file con algoritmi standard' },
                            3: { name: 'Crittografia Avanzata', description: 'Crittografia file avanzata', requires: ['Sviluppo LV2'] }
                        }
                    },
                    {
                        id: 'persistence_base',
                        type: 'persistence',
                        name: 'Imposta Persistenza (Base)',
                        position: { x: 500, y: 250 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Persistenza Base', description: 'Meccanismi base di persistenza' },
                            2: { name: 'Persistenza Avanzata', description: 'Persistenza avanzata nel sistema', requires: ['Sviluppo LV2'] }
                        }
                    },
                    {
                        id: 'ransom_message',
                        type: 'payload',
                        name: 'Crea Messaggio Riscatto (Standard)',
                        position: { x: 300, y: 350 },
                        level: 2,
                        maxLevel: 3,
                        upgrades: {
                            2: { name: 'Messaggio Standard', description: 'Messaggio di riscatto standard' },
                            3: { name: 'Messaggio Avanzato', description: 'Messaggio di riscatto personalizzato', requires: ['Sviluppo LV2'] }
                        }
                    },
                    {
                        id: 'ransom_request',
                        type: 'communication',
                        name: 'Richiesta Riscatto',
                        position: { x: 500, y: 350 },
                        level: 1,
                        maxLevel: 1,
                        upgrades: {
                            1: { name: 'Richiesta Riscatto', description: 'Gestisce la richiesta di riscatto' }
                        }
                    },
                    {
                        id: 'self_delete',
                        type: 'stealth',
                        name: 'Self-Delete (Base)',
                        position: { x: 700, y: 300 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Auto-eliminazione Base', description: 'Eliminazione automatica base' },
                            2: { name: 'Auto-eliminazione Avanzata', description: 'Auto-eliminazione sicura', requires: ['Stealth LV2'] }
                        }
                    },
                    {
                        id: 'compiler',
                        type: 'compiler',
                        name: 'Compiler',
                        position: { x: 700, y: 175 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Basic Compilation', description: 'Compilazione base del ransomware' },
                            2: { name: 'Code Obfuscation', description: 'Offuscamento del codice', requires: ['Stealth LV2'] },
                            3: { name: 'Anti-Analysis', description: 'Tecniche anti-analisi', requires: ['Stealth LV3'] }
                        }
                    }
                ],
                connections: [
                    { from: 'entry', to: 'antivirus_evasion' },
                    { from: 'antivirus_evasion', to: 'file_encrypt' },
                    { from: 'file_encrypt', to: 'persistence_base' },
                    { from: 'persistence_base', to: 'ransom_message' },
                    { from: 'ransom_message', to: 'ransom_request' },
                    { from: 'ransom_request', to: 'self_delete' },
                    { from: 'self_delete', to: 'compiler' }
                ]
            },
            3: {
                nodes: [
                    // Level 1 and 2 nodes remain, plus new Level 3 nodes
                    {
                        id: 'entry',
                        type: 'entry',
                        name: 'Target Entry',
                        position: { x: 100, y: 50 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Target Singolo', description: 'Colpisce un singolo target' },
                            2: { name: 'Target Multipli', description: 'Colpisce più target simultaneamente', requires: ['Networking LV2'] },
                            3: { name: 'Scan Automatico', description: 'Identifica automaticamente target vulnerabili', requires: ['Malware Attivi LV2'] }
                        }
                    },
                    // New Level 3 nodes as specified in requirements
                    {
                        id: 'antivirus_evasion_advanced',
                        type: 'stealth',
                        name: 'Evasione Antivirus (Avanzato)',
                        position: { x: 100, y: 150 },
                        level: 3,
                        maxLevel: 4,
                        upgrades: {
                            3: { name: 'Evasione Avanzata', description: 'Tecniche avanzate di evasione antivirus' },
                            4: { name: 'Evasione Elite', description: 'Evasione antivirus di livello elite', requires: ['Stealth LV3'] }
                        }
                    },
                    {
                        id: 'sandbox_bypass',
                        type: 'stealth',
                        name: 'Bypassa Sandbox/VM (Base)',
                        position: { x: 300, y: 50 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Bypass Base', description: 'Bypass base di sandbox e VM' },
                            2: { name: 'Bypass Avanzato', description: 'Bypass avanzato di ambienti virtualizzati', requires: ['Stealth LV3'] }
                        }
                    },
                    {
                        id: 'file_scanner_advanced',
                        type: 'analysis',
                        name: 'Scanner File (Avanzato)',
                        position: { x: 300, y: 150 },
                        level: 3,
                        maxLevel: 4,
                        upgrades: {
                            3: { name: 'Scan Avanzato', description: 'Scanner file avanzato per target' },
                            4: { name: 'Scan Elite', description: 'Scanner file di livello elite', requires: ['Sviluppo LV3'] }
                        }
                    },
                    {
                        id: 'crypto_key_gen_advanced',
                        type: 'encryption',
                        name: 'Genera Chiave Crittografia (Avanzato)',
                        position: { x: 500, y: 50 },
                        level: 3,
                        maxLevel: 4,
                        upgrades: {
                            3: { name: 'Generazione Avanzata', description: 'Generazione avanzata chiavi crittografiche' },
                            4: { name: 'Generazione Elite', description: 'Generazione elite chiavi crittografiche', requires: ['Stealth LV3'] }
                        }
                    },
                    {
                        id: 'file_encrypt_advanced',
                        type: 'encryption',
                        name: 'Crittografa File (Avanzata)',
                        position: { x: 500, y: 150 },
                        level: 3,
                        maxLevel: 4,
                        upgrades: {
                            3: { name: 'Crittografia Avanzata', description: 'Crittografia file di livello avanzato' },
                            4: { name: 'Crittografia Elite', description: 'Crittografia file elite', requires: ['Sviluppo LV3'] }
                        }
                    },
                    {
                        id: 'persistence_advanced',
                        type: 'persistence',
                        name: 'Imposta Persistenza (Avanzata)',
                        position: { x: 100, y: 250 },
                        level: 3,
                        maxLevel: 3,
                        upgrades: {
                            3: { name: 'Persistenza Avanzata', description: 'Meccanismi avanzati di persistenza nel sistema' }
                        }
                    },
                    {
                        id: 'c2_communication',
                        type: 'communication',
                        name: 'Comunica C2 (Covert)',
                        position: { x: 300, y: 250 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Comunicazione Covert', description: 'Comunicazione nascosta con C2' },
                            2: { name: 'Comunicazione Elite', description: 'Comunicazione C2 di livello elite', requires: ['Stealth LV3'] }
                        }
                    },
                    {
                        id: 'data_exfiltration',
                        type: 'exfiltration',
                        name: 'Data Exfiltration (Base)',
                        position: { x: 500, y: 250 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Esfiltrazione Base', description: 'Esfiltrazione base di dati' },
                            2: { name: 'Esfiltrazione Avanzata', description: 'Esfiltrazione avanzata di dati', requires: ['Sviluppo LV3'] }
                        }
                    },
                    {
                        id: 'system_lock',
                        type: 'disruption',
                        name: 'Blocco Sistema Operativo (Base)',
                        position: { x: 100, y: 350 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Blocco Base', description: 'Blocco base del sistema operativo' },
                            2: { name: 'Blocco Avanzato', description: 'Blocco avanzato del sistema', requires: ['Sviluppo LV3'] }
                        }
                    },
                    {
                        id: 'ransom_message_advanced',
                        type: 'payload',
                        name: 'Crea Messaggio Riscatto (Avanzato)',
                        position: { x: 300, y: 350 },
                        level: 3,
                        maxLevel: 3,
                        upgrades: {
                            3: { name: 'Messaggio Avanzato', description: 'Messaggio di riscatto avanzato e personalizzato' }
                        }
                    },
                    {
                        id: 'ransom_request_advanced',
                        type: 'communication',
                        name: 'Richiesta Riscatto',
                        position: { x: 500, y: 350 },
                        level: 1,
                        maxLevel: 1,
                        upgrades: {
                            1: { name: 'Richiesta Riscatto', description: 'Gestisce la richiesta di riscatto' }
                        }
                    },
                    {
                        id: 'self_delete_advanced',
                        type: 'stealth',
                        name: 'Self-Delete (Avanzato)',
                        position: { x: 700, y: 250 },
                        level: 3,
                        maxLevel: 3,
                        upgrades: {
                            3: { name: 'Auto-eliminazione Avanzata', description: 'Auto-eliminazione avanzata e sicura' }
                        }
                    },
                    {
                        id: 'auto_propagation',
                        type: 'propagation',
                        name: 'Auto-Propagazione (Base)',
                        position: { x: 700, y: 150 },
                        level: 1,
                        maxLevel: 2,
                        upgrades: {
                            1: { name: 'Propagazione Base', description: 'Auto-propagazione base in rete' },
                            2: { name: 'Propagazione Avanzata', description: 'Auto-propagazione avanzata', requires: ['Networking LV3'] }
                        }
                    },
                    {
                        id: 'compiler',
                        type: 'compiler',
                        name: 'Compiler',
                        position: { x: 700, y: 350 },
                        level: 1,
                        maxLevel: 3,
                        upgrades: {
                            1: { name: 'Basic Compilation', description: 'Compilazione base del ransomware' },
                            2: { name: 'Code Obfuscation', description: 'Offuscamento del codice', requires: ['Stealth LV2'] },
                            3: { name: 'Anti-Analysis', description: 'Tecniche anti-analisi', requires: ['Stealth LV3'] }
                        }
                    }
                ],
                connections: [
                    { from: 'entry', to: 'antivirus_evasion_advanced' },
                    { from: 'entry', to: 'sandbox_bypass' },
                    { from: 'sandbox_bypass', to: 'file_scanner_advanced' },
                    { from: 'file_scanner_advanced', to: 'crypto_key_gen_advanced' },
                    { from: 'crypto_key_gen_advanced', to: 'file_encrypt_advanced' },
                    { from: 'antivirus_evasion_advanced', to: 'persistence_advanced' },
                    { from: 'persistence_advanced', to: 'c2_communication' },
                    { from: 'c2_communication', to: 'data_exfiltration' },
                    { from: 'data_exfiltration', to: 'system_lock' },
                    { from: 'system_lock', to: 'ransom_message_advanced' },
                    { from: 'ransom_message_advanced', to: 'ransom_request_advanced' },
                    { from: 'ransom_request_advanced', to: 'self_delete_advanced' },
                    { from: 'file_encrypt_advanced', to: 'auto_propagation' },
                    { from: 'auto_propagation', to: 'compiler' },
                    { from: 'self_delete_advanced', to: 'compiler' }
                ]
            }
        },
        requiredTalents: ['Malware Attivi LV1', 'Stealth LV1', 'Sviluppo LV1']
    },
    'keylogger': {
        name: 'Keylogger',
        description: 'Template per la creazione di keylogger con moduli di cattura, stealth e trasmissione',
        nodes: [
            {
                id: 'entry',
                type: 'entry',
                name: 'Target Entry',
                position: { x: 100, y: 100 },
                level: 1,
                maxLevel: 2,
                upgrades: {
                    1: { name: 'Local Target', description: 'Target locale singolo' },
                    2: { name: 'Remote Target', description: 'Target remoto via rete', requires: ['Networking LV2'] }
                }
            },
            {
                id: 'capture',
                type: 'capture',
                name: 'Keystroke Capture',
                position: { x: 300, y: 100 },
                level: 1,
                maxLevel: 4,
                upgrades: {
                    1: { name: 'Basic Keylogging', description: 'Cattura tasti base' },
                    2: { name: 'Form Detection', description: 'Rileva form e password', requires: ['Sviluppo LV2'] },
                    3: { name: 'Screenshot Capture', description: 'Cattura screenshot periodici', requires: ['Malware Passivi LV2'] },
                    4: { name: 'Audio Capture', description: 'Registrazione audio ambiente', requires: ['Malware Passivi LV3'] }
                }
            },
            {
                id: 'stealth',
                type: 'stealth',
                name: 'Stealth Module',
                position: { x: 300, y: 250 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Process Hiding', description: 'Nasconde il processo' },
                    2: { name: 'File Hiding', description: 'Nasconde i file di log', requires: ['Stealth LV2'] },
                    3: { name: 'Memory Injection', description: 'Injection in memoria', requires: ['Stealth LV3'] }
                }
            },
            {
                id: 'transmission',
                type: 'exfiltration',
                name: 'Data Transmission',
                position: { x: 500, y: 100 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'HTTP POST', description: 'Trasmissione via HTTP POST' },
                    2: { name: 'Encrypted Channel', description: 'Canale crittografato', requires: ['Stealth LV1'] },
                    3: { name: 'Covert Channel', description: 'Canale nascosto', requires: ['Stealth LV3', 'Networking LV3'] }
                }
            },
            {
                id: 'compiler',
                type: 'compiler',
                name: 'Compiler',
                position: { x: 700, y: 175 },
                level: 1,
                maxLevel: 2,
                upgrades: {
                    1: { name: 'Basic Compilation', description: 'Compilazione base del keylogger' },
                    2: { name: 'Polymorphic Code', description: 'Codice polimorfico', requires: ['Stealth LV2'] }
                }
            }
        ],
        connections: [
            { from: 'entry', to: 'capture' },
            { from: 'entry', to: 'stealth' },
            { from: 'capture', to: 'transmission' },
            { from: 'stealth', to: 'compiler' },
            { from: 'transmission', to: 'compiler' }
        ],
        requiredTalents: ['Malware Passivi LV1', 'Sviluppo LV1']
    },
    'botnet_agent': {
        name: 'Botnet Agent',
        description: 'Template per la creazione di agenti botnet con moduli C2, propagazione e payload',
        nodes: [
            {
                id: 'entry',
                type: 'entry',
                name: 'Infection Vector',
                position: { x: 100, y: 100 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Email Attachment', description: 'Infezione tramite allegato email' },
                    2: { name: 'Drive-by Download', description: 'Infezione tramite siti web', requires: ['Ingegneria Sociale LV2'] },
                    3: { name: 'Network Exploit', description: 'Sfrutta vulnerabilità di rete', requires: ['Networking LV3'] }
                }
            },
            {
                id: 'c2',
                type: 'command_control',
                name: 'C2 Communication',
                position: { x: 300, y: 100 },
                level: 1,
                maxLevel: 4,
                upgrades: {
                    1: { name: 'Direct Connection', description: 'Connessione diretta al C2' },
                    2: { name: 'Proxy Chain', description: 'Catena di proxy', requires: ['Stealth LV2'] },
                    3: { name: 'P2P Network', description: 'Rete peer-to-peer', requires: ['Networking LV3'] },
                    4: { name: 'Domain Flux', description: 'Algoritmo domain flux', requires: ['Stealth LV2', 'Malware di Rete LV1'] }
                }
            },
            {
                id: 'propagation',
                type: 'propagation',
                name: 'Propagation Module',
                position: { x: 300, y: 250 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Local Network', description: 'Propagazione rete locale' },
                    2: { name: 'USB Spreading', description: 'Propagazione via USB', requires: ['Malware di Rete LV2'] },
                    3: { name: 'Cross-Platform', description: 'Propagazione multi-piattaforma', requires: ['Sviluppo LV3'] }
                }
            },
            {
                id: 'payload',
                type: 'payload',
                name: 'Payload Module',
                position: { x: 500, y: 100 },
                level: 1,
                maxLevel: 4,
                upgrades: {
                    1: { name: 'Basic Commands', description: 'Comandi base di sistema' },
                    2: { name: 'File Operations', description: 'Operazioni su file', requires: ['Sviluppo LV2'] },
                    3: { name: 'Network Operations', description: 'Operazioni di rete', requires: ['Networking LV2'] },
                    4: { name: 'Advanced Modules', description: 'Moduli avanzati personalizzati', requires: ['Malware di Rete LV2'] }
                }
            },
            {
                id: 'compiler',
                type: 'compiler',
                name: 'Compiler',
                position: { x: 700, y: 175 },
                level: 1,
                maxLevel: 3,
                upgrades: {
                    1: { name: 'Basic Compilation', description: 'Compilazione base dell\'agente' },
                    2: { name: 'Runtime Packing', description: 'Packing runtime', requires: ['Stealth LV1'] },
                    3: { name: 'VM Evasion', description: 'Evasione macchine virtuali', requires: ['Stealth LV3'] }
                }
            }
        ],
        connections: [
            { from: 'entry', to: 'c2' },
            { from: 'entry', to: 'propagation' },
            { from: 'c2', to: 'payload' },
            { from: 'propagation', to: 'payload' },
            { from: 'payload', to: 'compiler' }
        ],
        requiredTalents: ['Malware di Rete LV1', 'Networking LV1', 'Sviluppo LV1']
    }
};

// Modifier nodes that can be applied to any template
const modifierNodes = {
    'obfuscator': {
        name: 'Code Obfuscator',
        description: 'Offusca il codice per evitare la rilevazione',
        type: 'modifier',
        applicableTo: ['compiler'],
        requiredTalents: ['Stealth LV2'],
        compilationTimeMultiplier: 1.5,
        upgrades: {
            1: { name: 'String Obfuscation', description: 'Offuscamento stringhe' },
            2: { name: 'Control Flow', description: 'Offuscamento flusso di controllo', requires: ['Stealth LV3'] },
            3: { name: 'Anti-Disassembly', description: 'Tecniche anti-disassemblaggio', requires: ['Stealth LV3'] }
        }
    },
    'crypter': {
        name: 'Crypter',
        description: 'Crittografa il payload finale',
        type: 'modifier',
        applicableTo: ['compiler'],
        requiredTalents: ['Stealth LV2'],
        compilationTimeMultiplier: 2.0,
        upgrades: {
            1: { name: 'XOR Encryption', description: 'Crittografia XOR semplice' },
            2: { name: 'AES Encryption', description: 'Crittografia AES avanzata', requires: ['Stealth LV3'] },
            3: { name: 'Custom Algorithm', description: 'Algoritmo crittografico personalizzato', requires: ['Stealth LV3'] }
        }
    },
    'self_delete': {
        name: 'Self-Delete',
        description: 'Auto-eliminazione dopo l\'esecuzione',
        type: 'modifier',
        applicableTo: ['any'],
        requiredTalents: ['Stealth LV1'],
        compilationTimeMultiplier: 1.2,
        upgrades: {
            1: { name: 'Simple Delete', description: 'Eliminazione semplice del file' },
            2: { name: 'Secure Wipe', description: 'Sovrascrittura sicura', requires: ['Stealth LV2'] },
            3: { name: 'Memory Cleanup', description: 'Pulizia memoria completa', requires: ['Stealth LV3'] }
        }
    }
};

// Compiler options unlockable through talents
const compilerOptions = {
    'code_encryption': {
        name: 'Code Encryption',
        description: 'Crittografa sezioni del codice',
        requiredTalents: ['Stealth LV2', 'Sviluppo LV2'],
        compilationTimeMultiplier: 1.8,
        effectivenessBonus: 0.15
    },
    'code_injection': {
        name: 'Code Injection',
        description: 'Inietta codice in processi legittimi',
        requiredTalents: ['Stealth LV3', 'Sviluppo LV2'],
        compilationTimeMultiplier: 2.5,
        stealthBonus: 0.25
    },
    'anti_debugging': {
        name: 'Anti-Debugging',
        description: 'Tecniche anti-debugging avanzate',
        requiredTalents: ['Stealth LV3', 'Sviluppo LV2'],
        compilationTimeMultiplier: 2.0,
        analysisResistance: 0.30
    },
    'polymorphic_engine': {
        name: 'Polymorphic Engine',
        description: 'Motore polimorfico per evitare signature detection',
        requiredTalents: ['Stealth LV3', 'Sviluppo LV3'],
        compilationTimeMultiplier: 3.0,
        signatureEvasion: 0.40
    }
};

let currentTemplate = null;
let selectedNodeId = null;
let compilationQueue = [];
let currentSection = 'editor'; // Track current section

function initReworkEditor() {
    console.log('Initializing Rework Editor...');
    
    // Initialize state if not exists
    if (!state.reworkEditor) {
        state.reworkEditor = {
            availableTemplates: Object.keys(toolTemplates),
            activeTemplate: null,
            templateLevels: {}, // Track template levels
            nodeUpgrades: {},
            appliedModifiers: {},
            compilationHistory: [],
            compiledMalware: [],
            unlockedOptions: [],
            selectedCompilerOptions: []
        };
    }
    
    // Initialize template levels if not exists
    if (!state.reworkEditor.templateLevels) {
        state.reworkEditor.templateLevels = {};
    }
    
    // Initialize all templates to level 1 if not set
    Object.keys(toolTemplates).forEach(templateKey => {
        if (!state.reworkEditor.templateLevels[templateKey]) {
            state.reworkEditor.templateLevels[templateKey] = 1;
        }
    });
    
    // Restore active compilations from programming timer state
    restoreActiveCompilations();
    
    renderReworkEditor();
}

function restoreActiveCompilations() {
    // Clear existing queue
    compilationQueue = [];
    
    // Restore from programming timer state
    if (state.programmingTimer && state.programmingTimer.activeCompilations) {
        Object.values(state.programmingTimer.activeCompilations).forEach(compilation => {
            if (compilation.isActive) {
                const elapsed = (Date.now() - compilation.startTime) / 1000;
                
                if (elapsed >= compilation.totalTime) {
                    // Compilation should have completed while away
                    compilation.progress = 100;
                    compilation.isActive = false;
                    compilation.phase = 'Completed';
                    delete state.programmingTimer.activeCompilations[compilation.id];
                    completeCompilation(compilation);
                } else {
                    // Resume compilation
                    compilation.progress = Math.min(100, (elapsed / compilation.totalTime) * 100);
                    compilation.timeRemaining = Math.max(0, compilation.totalTime - elapsed);
                    
                    compilationQueue.push(compilation);
                    startCompilation(compilation);
                }
            }
        });
    }
}

function renderReworkEditor() {
    const container = document.getElementById('rework-editor-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="rework-editor-panel">
            <div class="editor-header">
                <h2 class="text-2xl font-bold text-white mb-4">
                    <i class="fas fa-code text-purple-400 mr-3"></i>
                    Advanced Tool Editor v2.0
                </h2>
                <div class="editor-stats">
                    <div class="stat-item">
                        <span class="text-gray-400">Templates Disponibili:</span>
                        <span class="text-white font-bold">${(state.reworkEditor.availableTemplates || []).length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="text-gray-400">Tool Compilati:</span>
                        <span class="text-white font-bold">${(state.reworkEditor.compilationHistory || []).length}</span>
                    </div>
                </div>
            </div>
            
            <div class="editor-content">
                <div class="template-selector">
                    <h3 class="text-lg font-semibold text-white mb-3">Seleziona Template</h3>
                    <div class="template-grid">
                        ${renderTemplateCards()}
                    </div>
                </div>
                
                <div id="template-editor" class="template-editor ${currentTemplate ? 'active' : ''}">
                    ${currentTemplate ? renderTemplateEditor() : ''}
                </div>
                
                <div id="compilation-panel" class="compilation-panel">
                    ${renderCompilationPanel()}
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    addReworkEditorEventListeners();
}

function renderTemplateCards() {
    return Object.entries(toolTemplates).map(([key, template]) => {
        const isAvailable = checkTemplateRequirements(template);
        const isActive = currentTemplate === key;
        
        return `
            <div class="template-card ${isActive ? 'active' : ''} ${isAvailable ? '' : 'locked'}" 
                 data-template="${key}">
                <div class="template-icon">
                    <i class="fas ${getTemplateIcon(key)}"></i>
                </div>
                <div class="template-info">
                    <h4 class="template-name">${template.name}</h4>
                    <p class="template-description">${template.description}</p>
                    <div class="template-requirements">
                        ${template.requiredTalents.map(talent => 
                            `<span class="requirement ${checkTalentRequirement(talent) ? 'met' : 'unmet'}">${talent}</span>`
                        ).join('')}
                    </div>
                </div>
                ${isAvailable ? 
                    `<button class="template-select-btn" onclick="selectTemplate('${key}')">
                        <i class="fas fa-play"></i> ${isActive ? 'Attivo' : 'Seleziona'}
                    </button>` :
                    `<div class="template-locked">
                        <i class="fas fa-lock"></i> Bloccato
                    </div>`
                }
            </div>
        `;
    }).join('');
}

function renderTemplateEditor() {
    if (!currentTemplate) return '';
    
    const template = toolTemplates[currentTemplate];
    
    return `
        <div class="template-editor-content">
            <div class="editor-toolbar">
                <h3 class="text-lg font-semibold text-white">
                    <i class="fas ${getTemplateIcon(currentTemplate)} mr-2"></i>
                    ${template.name} Editor - Livello ${state.reworkEditor.templateLevels[currentTemplate] || 1}
                </h3>
                <div class="toolbar-actions">
                    ${canPowerUpTemplate(currentTemplate) ? `
                        <button class="btn-upgrade" onclick="powerUpTemplate('${currentTemplate}')" title="Potenzia il flusso al livello successivo">
                            <i class="fas fa-rocket"></i> Potenzia Flusso
                        </button>
                    ` : ''}
                    <button class="btn-secondary" onclick="resetTemplate()">
                        <i class="fas fa-undo"></i> Reset
                    </button>
                    <button class="btn-primary" onclick="compileTemplate()" ${compilationQueue.length > 0 ? 'disabled' : ''}>
                        <i class="fas fa-hammer"></i> ${compilationQueue.length > 0 ? 'Compilazione in corso...' : 'Compila'}
                    </button>
                </div>
            </div>
            
            <div class="template-canvas">
                <div class="canvas-grid">
                    ${renderTemplateNodes()}
                    ${renderTemplateConnections()}
                </div>
            </div>
            
            <div class="modifier-slots-panel">
                <h4 class="modifier-panel-title">
                    <i class="fas fa-puzzle-piece"></i> Modificatori del Flusso
                </h4>
                <div class="modifier-slots">
                    ${renderModifierSlots()}
                </div>
                <div class="available-modifiers">
                    <h5>Modificatori Disponibili:</h5>
                    <div class="modifier-list">
                        ${renderAvailableModifiers()}
                    </div>
                </div>
            </div>
            
            <div class="node-inspector" id="node-inspector">
                ${selectedNodeId ? renderNodeInspector() : '<p class="text-gray-400">Seleziona un nodo per visualizzarne i dettagli</p>'}
            </div>
        </div>
    `;
}

function renderTemplateNodes() {
    const template = toolTemplates[currentTemplate];
    const currentTemplateLevel = state.reworkEditor.templateLevels[currentTemplate] || 1;
    const currentLevelData = template.levels[currentTemplateLevel];
    
    return currentLevelData.nodes.map(node => {
        const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
        const isSelected = selectedNodeId === node.id;
        
        return `
            <div class="template-node ${node.type} ${isSelected ? 'selected' : ''}" 
                 data-node-id="${node.id}"
                 style="left: ${node.position.x}px; top: ${node.position.y}px;">
                <div class="node-header">
                    <span class="node-name">${node.name}</span>
                    <span class="node-level">LV${currentLevel}</span>
                </div>
                <div class="node-body">
                    <div class="node-upgrade-indicator">
                        <div class="upgrade-progress" style="width: ${(currentLevel / node.maxLevel) * 100}%"></div>
                    </div>
                    <div class="node-actions">
                        <button class="node-upgrade-btn" onclick="showNodeUpgradeMenu('${node.id}')" 
                                ${currentLevel >= node.maxLevel ? 'disabled' : ''}>
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="node-info-btn" onclick="selectNode('${node.id}')">
                            <i class="fas fa-info"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTemplateConnections() {
    const template = toolTemplates[currentTemplate];
    const currentTemplateLevel = state.reworkEditor.templateLevels[currentTemplate] || 1;
    const currentLevelData = template.levels[currentTemplateLevel];
    
    return `
        <svg class="connections-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
            ${currentLevelData.connections.map((conn, index) => {
                const fromNode = currentLevelData.nodes.find(n => n.id === conn.from);
                const toNode = currentLevelData.nodes.find(n => n.id === conn.to);
                
                if (!fromNode || !toNode) return '';
                
                // Calculate connection points (center of nodes)
                const x1 = fromNode.position.x + 90; // Half node width (180px)
                const y1 = fromNode.position.y + 50; // Half node height (100px)
                const x2 = toNode.position.x + 90;
                const y2 = toNode.position.y + 50;
                
                // Calculate control points for curved line
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const controlOffset = 30;
                
                return `
                    <g class="connection-group" data-connection="${index}">
                        <defs>
                            <marker id="arrowhead-${index}" markerWidth="10" markerHeight="7" 
                                    refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                            </marker>
                        </defs>
                        <path d="M ${x1} ${y1} Q ${midX} ${midY - controlOffset} ${x2} ${y2}"
                              stroke="#8b5cf6"
                              stroke-width="2"
                              fill="none"
                              marker-end="url(#arrowhead-${index})"
                              class="connection-line" />
                        <circle cx="${x1}" cy="${y1}" r="3" fill="#22c55e" class="connection-start" />
                        <circle cx="${x2}" cy="${y2}" r="3" fill="#ef4444" class="connection-end" />
                    </g>
                `;
            }).join('')}
        </svg>
    `;
}

function renderModifierSlots() {
    const maxSlots = 3; // Maximum modifier slots per template
    const appliedModifiers = state.reworkEditor.appliedModifiers[currentTemplate] || [];
    
    let slotsHTML = '';
    for (let i = 0; i < maxSlots; i++) {
        const modifier = appliedModifiers[i];
        slotsHTML += `
            <div class="modifier-slot ${modifier ? 'occupied' : 'empty'}" 
                 data-slot-index="${i}"
                 onclick="selectModifierSlot(${i})">
                ${modifier ? `
                    <div class="modifier-in-slot">
                        <span class="modifier-name">${modifierNodes[modifier].name}</span>
                        <button class="remove-modifier-btn" onclick="removeModifier(${i})" title="Rimuovi modificatore">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                ` : `
                    <div class="empty-slot-placeholder">
                        <i class="fas fa-plus"></i>
                        <span>Slot Modificatore</span>
                    </div>
                `}
            </div>
        `;
    }
    return slotsHTML;
}

function renderAvailableModifiers() {
    return Object.entries(modifierNodes).map(([key, modifier]) => {
        const isUnlocked = checkModifierRequirements(modifier);
        const isApplied = (state.reworkEditor.appliedModifiers[currentTemplate] || []).includes(key);
        
        return `
            <div class="available-modifier ${isUnlocked ? 'unlocked' : 'locked'} ${isApplied ? 'applied' : ''}"
                 data-modifier-key="${key}"
                 onclick="selectModifier('${key}')">
                <div class="modifier-icon">
                    <i class="fas fa-${getModifierIcon(modifier.type)}"></i>
                </div>
                <div class="modifier-info">
                    <span class="modifier-name">${modifier.name}</span>
                    <p class="modifier-description">${modifier.description}</p>
                    ${!isUnlocked ? `
                        <div class="modifier-requirements">
                            <small>Richiede: ${modifier.requiredTalents.join(', ')}</small>
                        </div>
                    ` : ''}
                </div>
                ${isUnlocked && !isApplied ? `
                    <button class="apply-modifier-btn" onclick="applyModifier('${key}')">
                        <i class="fas fa-plus"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }).join('');
}

function getModifierIcon(type) {
    const icons = {
        'modifier': 'cogs',
        'obfuscator': 'eye-slash',
        'crypter': 'lock',
        'self_delete': 'trash'
    };
    return icons[type] || 'puzzle-piece';
}

function checkModifierRequirements(modifier) {
    return modifier.requiredTalents.every(talent => checkTalentRequirement(talent));
}

function selectModifier(modifierKey) {
    // Implementation for selecting a modifier to view details
    console.log('Selected modifier:', modifierKey);
}

function applyModifier(modifierKey) {
    const appliedModifiers = state.reworkEditor.appliedModifiers[currentTemplate] || [];
    
    if (appliedModifiers.length >= 3) {
        alert('Hai raggiunto il limite massimo di modificatori per questo template');
        return;
    }
    
    if (appliedModifiers.includes(modifierKey)) {
        alert('Questo modificatore è già applicato');
        return;
    }
    
    if (!checkModifierRequirements(modifierNodes[modifierKey])) {
        alert('Non hai i talenti richiesti per questo modificatore');
        return;
    }
    
    appliedModifiers.push(modifierKey);
    
    if (!state.reworkEditor.appliedModifiers) {
        state.reworkEditor.appliedModifiers = {};
    }
    state.reworkEditor.appliedModifiers[currentTemplate] = appliedModifiers;
    
    saveState();
    renderReworkEditor();
}

function removeModifier(slotIndex) {
    const appliedModifiers = state.reworkEditor.appliedModifiers[currentTemplate] || [];
    
    if (slotIndex >= 0 && slotIndex < appliedModifiers.length) {
        appliedModifiers.splice(slotIndex, 1);
        state.reworkEditor.appliedModifiers[currentTemplate] = appliedModifiers;
        saveState();
        renderReworkEditor();
    }
}

function selectModifierSlot(slotIndex) {
    // Implementation for selecting a modifier slot
    console.log('Selected modifier slot:', slotIndex);
}

function renderNodeInspector() {
    const template = toolTemplates[currentTemplate];
    const currentTemplateLevel = state.reworkEditor.templateLevels[currentTemplate] || 1;
    const currentLevelData = template.levels[currentTemplateLevel];
    const node = currentLevelData.nodes.find(n => n.id === selectedNodeId);
    if (!node) return '';
    
    const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
    const currentUpgrade = node.upgrades[currentLevel];
    const nextUpgrade = node.upgrades[currentLevel + 1];
    
    return `
        <div class="node-inspector-content">
            <div class="inspector-header">
                <h4 class="text-lg font-semibold text-white">${node.name}</h4>
                <span class="node-type-badge ${node.type}">${node.type}</span>
            </div>
            
            <div class="current-upgrade">
                <h5 class="text-md font-semibold text-gray-300">Livello Attuale (${currentLevel})</h5>
                <div class="upgrade-details">
                    <p class="upgrade-name text-purple-400">${currentUpgrade.name}</p>
                    <p class="upgrade-description text-gray-400">${currentUpgrade.description}</p>
                </div>
            </div>
            
            ${nextUpgrade ? `
                <div class="next-upgrade">
                    <h5 class="text-md font-semibold text-gray-300">Prossimo Upgrade (${currentLevel + 1})</h5>
                    <div class="upgrade-details">
                        <p class="upgrade-name text-green-400">${nextUpgrade.name}</p>
                        <p class="upgrade-description text-gray-400">${nextUpgrade.description}</p>
                        ${nextUpgrade.requires ? `
                            <div class="upgrade-requirements">
                                <p class="text-sm text-yellow-400">Richiede:</p>
                                ${nextUpgrade.requires.map(req => 
                                    `<span class="requirement ${checkTalentRequirement(req) ? 'met' : 'unmet'}">${req}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                        <button class="upgrade-button ${canUpgradeNode(node.id) ? '' : 'disabled'}" 
                                onclick="upgradeNode('${node.id}')"
                                ${canUpgradeNode(node.id) ? '' : 'disabled'}>
                            <i class="fas fa-arrow-up"></i> Potenzia Nodo
                        </button>
                    </div>
                </div>
            ` : `
                <div class="max-level">
                    <p class="text-green-400"><i class="fas fa-star"></i> Nodo al livello massimo</p>
                </div>
            `}
        </div>
    `;
}

function renderCompilationPanel() {
    return `
        <div class="compilation-panel-content">
            <div class="panel-header">
                <h3 class="text-lg font-semibold text-white">
                    <i class="fas fa-cogs mr-2"></i>
                    Compiler & Options
                </h3>
            </div>
            
            <div class="compiler-options">
                <h4 class="text-md font-semibold text-gray-300 mb-2">Opzioni di Compilazione</h4>
                <div class="options-grid">
                    ${renderCompilerOptions()}
                </div>
            </div>
            
            <div class="compilation-queue">
                <h4 class="text-md font-semibold text-gray-300 mb-2">Coda di Compilazione</h4>
                <div class="queue-list">
                    ${renderCompilationQueue()}
                </div>
            </div>
            
            <div class="compiled-malware-storage">
                <h4 class="text-md font-semibold text-gray-300 mb-2">
                    <i class="fas fa-archive"></i> Malware Compilati
                </h4>
                <div class="storage-list">
                    ${renderCompiledMalwareStorage()}
                </div>
            </div>
        </div>
    `;
}

function renderCompiledMalwareStorage() {
    const compiledMalware = state.reworkEditor.compiledMalware || [];
    
    if (compiledMalware.length === 0) {
        return `
            <div class="empty-storage">
                <i class="fas fa-archive text-gray-500"></i>
                <p class="text-gray-400">Nessun malware compilato</p>
                <small class="text-gray-500">I malware completati appariranno qui</small>
            </div>
        `;
    }
    
    return compiledMalware.map(malware => `
        <div class="stored-malware-item">
            <div class="malware-header">
                <div class="malware-info">
                    <span class="malware-name">
                        <i class="fas ${getTemplateIcon(malware.template)}"></i>
                        ${malware.templateName}
                    </span>
                    <span class="malware-version">v${malware.version || '1.0'}</span>
                </div>
                <div class="malware-status">
                    <span class="status-badge ${malware.programmingStatus || 'ready'}">
                        ${getMalwareStatusText(malware.programmingStatus)}
                    </span>
                    <span class="compile-date">${formatDate(malware.completedAt)}</span>
                </div>
            </div>
            
            <div class="malware-details">
                <div class="malware-specs">
                    <div class="spec-item">
                        <span class="spec-label">Efficacia:</span>
                        <span class="spec-value">${malware.effectiveness}%</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Stealth:</span>
                        <span class="spec-value">${malware.stealthRating}%</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Complessità:</span>
                        <span class="spec-value">${malware.complexity}</span>
                    </div>
                </div>
                
                ${malware.appliedModifiers && malware.appliedModifiers.length > 0 ? `
                    <div class="malware-modifiers">
                        <span class="modifiers-label">Modificatori applicati:</span>
                        ${malware.appliedModifiers.map(mod => `
                            <span class="modifier-tag">${modifierNodes[mod]?.name || mod}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="malware-actions">
                ${(!malware.programmingStatus || malware.programmingStatus === 'ready') ? `
                    <button class="btn-primary" onclick="startProgrammingProcess('${malware.id}')">
                        <i class="fas fa-play"></i> Avvia Programmazione
                    </button>
                ` : malware.programmingStatus === 'programming' ? `
                    <button class="btn-warning" disabled>
                        <i class="fas fa-clock"></i> In Programmazione...
                    </button>
                ` : `
                    <button class="btn-success" onclick="deployMalware('${malware.id}')">
                        <i class="fas fa-rocket"></i> Deploy
                    </button>
                `}
                <button class="btn-secondary" onclick="viewMalwareDetails('${malware.id}')">
                    <i class="fas fa-info-circle"></i> Dettagli
                </button>
                <button class="btn-danger" onclick="deleteMalware('${malware.id}')">
                    <i class="fas fa-trash"></i> Elimina
                </button>
            </div>
        </div>
    `).join('');
}

function getMalwareStatusText(status) {
    const statusTexts = {
        'ready': 'Pronto',
        'programming': 'In Programmazione',
        'completed': 'Completato',
        'deployed': 'Distribuito'
    };
    return statusTexts[status] || 'Pronto';
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function startProgrammingProcess(malwareId) {
    // Navigate to programming section with the specific malware
    showReworkSection('programming');
    state.reworkProgramming = state.reworkProgramming || {};
    state.reworkProgramming.selectedMalware = malwareId;
    
    // Use the proper programming timer function to start the programming process
    if (typeof window.startTimedProgramming === 'function') {
        window.startTimedProgramming(malwareId);
    } else {
        // Fallback - just update malware status
        const malware = (state.reworkEditor.compiledMalware || []).find(m => m.id === malwareId);
        if (malware) {
            malware.programmingStatus = 'programming';
            saveState();
            showNotification('Processo di programmazione avviato', 'success');
        }
    }
}

function viewMalwareDetails(malwareId) {
    const malware = (state.reworkEditor.compiledMalware || []).find(m => m.id === malwareId);
    if (malware) {
        // Show detailed view modal or panel
        console.log('Viewing malware details:', malware);
        alert(`Dettagli Malware:\n\nNome: ${malware.templateName}\nEfficacia: ${malware.effectiveness}%\nStealth: ${malware.stealthRating}%\nCompletato: ${formatDate(malware.completedAt)}`);
    }
}

function deployMalware(malwareId) {
    const malware = (state.reworkEditor.compiledMalware || []).find(m => m.id === malwareId);
    if (malware) {
        malware.programmingStatus = 'deployed';
        malware.deployedAt = Date.now();
        saveState();
        renderReworkEditor();
        showNotification(`${malware.templateName} distribuito con successo!`, 'success');
    }
}

function deleteMalware(malwareId) {
    if (confirm('Sei sicuro di voler eliminare questo malware?')) {
        if (!state.reworkEditor.compiledMalware) {
            state.reworkEditor.compiledMalware = [];
        }
        
        // Convert malwareId to number if it's a string to handle any type inconsistencies
        const idToFind = typeof malwareId === 'string' ? parseInt(malwareId) : malwareId;
        
        const malwareIndex = state.reworkEditor.compiledMalware.findIndex(m => {
            const mId = typeof m.id === 'string' ? parseInt(m.id) : m.id;
            return mId === idToFind;
        });
        
        if (malwareIndex !== -1) {
            state.reworkEditor.compiledMalware.splice(malwareIndex, 1);
            saveState();
            renderReworkEditor();
            showNotification('Malware eliminato', 'info');
        } else {
            showNotification('Errore: Malware non trovato', 'error');
        }
    }
}

function renderCompilerOptions() {
    return Object.entries(compilerOptions).map(([key, option]) => {
        const isUnlocked = (state.reworkEditor.unlockedOptions || []).includes(key);
        const isAvailable = checkCompilerOptionRequirements(option);
        
        return `
            <div class="compiler-option ${isUnlocked && isAvailable ? 'available' : 'locked'}">
                <div class="option-info">
                    <h5 class="option-name">${option.name}</h5>
                    <p class="option-description">${option.description}</p>
                    <div class="option-effects">
                        <span class="effect-item">
                            <i class="fas fa-clock"></i> +${Math.round((option.compilationTimeMultiplier - 1) * 100)}% tempo
                        </span>
                        ${option.effectivenessBonus ? `
                            <span class="effect-item">
                                <i class="fas fa-arrow-up"></i> +${Math.round(option.effectivenessBonus * 100)}% efficacia
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="option-toggle">
                    <input type="checkbox" id="option-${key}" ${isUnlocked && isAvailable ? '' : 'disabled'}>
                    <label for="option-${key}"></label>
                </div>
            </div>
        `;
    }).join('');
}

function renderCompilationQueue() {
    if (compilationQueue.length === 0) {
        return `
            <div class="empty-queue">
                <i class="fas fa-clipboard-list text-gray-500"></i>
                <p class="text-gray-400">Nessuna compilazione in corso</p>
                <small class="text-gray-500">Seleziona un template e premi "Compila" per iniziare</small>
            </div>
        `;
    }
    
    return compilationQueue.map((item, index) => `
        <div class="queue-item ${item.isActive ? 'active' : 'completed'}">
            <div class="item-header">
                <div class="item-info">
                    <span class="item-name">
                        <i class="fas ${getTemplateIcon(item.template)}"></i>
                        ${item.templateName}
                    </span>
                    <span class="item-status ${item.isActive ? 'compiling' : 'completed'}">
                        ${item.isActive ? item.phase : 'Completato'}
                    </span>
                </div>
                <div class="item-progress-text">
                    ${Math.round(item.progress)}%
                </div>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill ${item.isActive ? 'animated' : 'completed'}" 
                         style="width: ${item.progress}%"></div>
                </div>
                <div class="progress-phases">
                    <div class="phase-indicator ${getPhaseStatus(item, 'Analysis')}">Analysis</div>
                    <div class="phase-indicator ${getPhaseStatus(item, 'Preprocessing')}">Preprocessing</div>
                    <div class="phase-indicator ${getPhaseStatus(item, 'Compilation')}">Compilation</div>
                    <div class="phase-indicator ${getPhaseStatus(item, 'Optimization')}">Optimization</div>
                    <div class="phase-indicator ${getPhaseStatus(item, 'Linking')}">Linking</div>
                    <div class="phase-indicator ${getPhaseStatus(item, 'Finalization')}">Finalization</div>
                </div>
            </div>
            
            <div class="item-details">
                <div class="item-modifiers">
                    ${item.appliedModifiers && item.appliedModifiers.length > 0 ? `
                        <span class="modifiers-label">Modificatori:</span>
                        ${item.appliedModifiers.map(mod => `
                            <span class="modifier-tag">${modifierNodes[mod]?.name || mod}</span>
                        `).join('')}
                    ` : '<span class="no-modifiers">Nessun modificatore</span>'}
                </div>
                <div class="item-time">
                    ${item.isActive ? `
                        <span class="time-remaining">
                            <i class="fas fa-clock"></i>
                            ${formatTime(item.timeRemaining)} rimanenti
                        </span>
                    ` : `
                        <span class="time-completed">
                            <i class="fas fa-check-circle"></i>
                            Completato in ${formatTime(item.totalTime)}
                        </span>
                    `}
                </div>
            </div>
            
            ${!item.isActive ? `
                <div class="item-actions">
                    <button class="btn-primary" onclick="startProgrammingProcess('${item.id}')">
                        <i class="fas fa-play"></i> Avvia Programmazione
                    </button>
                    <button class="btn-secondary" onclick="viewCompiledMalware('${item.id}')">
                        <i class="fas fa-eye"></i> Visualizza
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function getPhaseStatus(item, phase) {
    const phases = ['Analysis', 'Preprocessing', 'Compilation', 'Optimization', 'Linking', 'Finalization'];
    const currentPhaseIndex = phases.indexOf(item.phase);
    const phaseIndex = phases.indexOf(phase);
    
    if (phaseIndex < currentPhaseIndex) return 'completed';
    if (phaseIndex === currentPhaseIndex && item.isActive) return 'active';
    if (!item.isActive && item.progress >= 100) return 'completed';
    return 'pending';
}

// Helper functions
function getTemplateIcon(templateKey) {
    const icons = {
        'ransomware': 'fa-lock',
        'keylogger': 'fa-keyboard',
        'botnet_agent': 'fa-network-wired'
    };
    return icons[templateKey] || 'fa-code';
}

function checkTemplateRequirements(template) {
    return template.requiredTalents.every(talent => checkTalentRequirement(talent));
}

function checkTalentRequirement(talentRequirement) {
    // Temporary: Return true for testing to enable all templates
    // TODO: Fix state access issue for proper talent checking
    return true;
    
    /* Original implementation - commented for testing
    // Parse requirement like "Malware Attivi LV2" or "Sviluppo LV1"
    const parts = talentRequirement.split(' LV');
    const talentName = parts[0];
    const requiredLevel = parseInt(parts[1]) || 1;
    
    // Check if it's a core talent
    const fullTalentName = talentRequirement; // "Sviluppo LV1", "Malware Attivi LV1", etc.
    
    // First check if it's unlocked in the rework talents system
    if (state.reworkTalents) {
        const coreUnlocked = state.reworkTalents.unlockedCore[fullTalentName] || 0;
        const specializationUnlocked = state.reworkTalents.unlockedSpecialization[fullTalentName] || 0;
        
        if (coreUnlocked > 0 || specializationUnlocked > 0) {
            return true;
        }
    }
    
    // Fallback to old system for backward compatibility
    const unlockedLevel = state.unlocked[talentName] || 0;
    return unlockedLevel >= requiredLevel;
    */
}

function checkCompilerOptionRequirements(option) {
    return option.requiredTalents.every(talent => checkTalentRequirement(talent));
}

function canUpgradeNode(nodeId) {
    const template = toolTemplates[currentTemplate];
    const currentTemplateLevel = state.reworkEditor.templateLevels[currentTemplate] || 1;
    const currentLevelData = template.levels[currentTemplateLevel];
    const node = currentLevelData.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    
    const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
    if (currentLevel >= node.maxLevel) return false;
    
    const nextUpgrade = node.upgrades[currentLevel + 1];
    if (nextUpgrade && nextUpgrade.requires) {
        return nextUpgrade.requires.every(req => checkTalentRequirement(req));
    }
    
    return true;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Event handlers
function selectTemplate(templateKey) {
    currentTemplate = templateKey;
    selectedNodeId = null;
    renderReworkEditor();
}

function selectNode(nodeId) {
    selectedNodeId = nodeId;
    renderReworkEditor();
}

function canPowerUpTemplate(templateKey) {
    const template = toolTemplates[templateKey];
    const currentTemplateLevel = state.reworkEditor.templateLevels[templateKey] || 1;
    
    // Check if template has higher levels available
    if (currentTemplateLevel >= template.maxTemplateLevel) {
        return false;
    }
    
    // Check if player has required talents for next level
    const nextLevel = currentTemplateLevel + 1;
    const requiredTalents = template.levelRequirements[nextLevel];
    
    if (requiredTalents) {
        return requiredTalents.every(talent => checkTalentRequirement(talent));
    }
    
    return true;
}

function powerUpTemplate(templateKey) {
    const template = toolTemplates[templateKey];
    const currentTemplateLevel = state.reworkEditor.templateLevels[templateKey] || 1;
    
    if (canPowerUpTemplate(templateKey)) {
        const nextLevel = currentTemplateLevel + 1;
        state.reworkEditor.templateLevels[templateKey] = nextLevel;
        
        // Reset selected node since the canvas will change
        selectedNodeId = null;
        
        saveState();
        renderReworkEditor();
        
        showNotification(`Template ${template.name} potenziato al Livello ${nextLevel}! Nuovi nodi e interconnessioni disponibili.`, 'success');
    } else {
        const nextLevel = currentTemplateLevel + 1;
        const requiredTalents = template.levelRequirements[nextLevel];
        if (requiredTalents) {
            showNotification(`Per potenziare al Livello ${nextLevel} sono richiesti: ${requiredTalents.join(', ')}`, 'warning');
        } else {
            showNotification('Template già al livello massimo.', 'info');
        }
    }
}

function upgradeNode(nodeId) {
    const nodeKey = `${currentTemplate}_${nodeId}`;
    const currentLevel = state.reworkEditor.nodeUpgrades[nodeKey] || 1;
    
    if (canUpgradeNode(nodeId)) {
        state.reworkEditor.nodeUpgrades[nodeKey] = currentLevel + 1;
        saveState();
        renderReworkEditor();
        
        showNotification(`Nodo ${nodeId} potenziato al livello ${currentLevel + 1}!`, 'success');
    }
}

function compileTemplate() {
    if (!currentTemplate) return;
    
    // Check if there are any compilations in queue (single compilation limit)
    if (compilationQueue.length > 0) {
        showNotification('È già in corso una compilazione. Attendi il completamento prima di iniziarne una nuova.', 'warning');
        return;
    }
    
    const template = toolTemplates[currentTemplate];
    const appliedModifiers = state.reworkEditor.appliedModifiers[currentTemplate] || [];
    const selectedOptions = state.reworkEditor.selectedCompilerOptions || [];
    
    const compilationTime = calculateCompilationTime();
    
    const compilationItem = {
        id: Date.now(),
        templateName: template.name,
        template: currentTemplate,
        templateLevel: state.reworkEditor.templateLevels[currentTemplate] || 1,
        appliedModifiers: [...appliedModifiers],
        compilerOptions: [...selectedOptions],
        nodeUpgrades: {...(state.reworkEditor.nodeUpgrades || {})},
        startTime: Date.now(),
        totalTime: compilationTime,
        progress: 0,
        timeRemaining: compilationTime,
        phase: 'Analysis',
        isActive: true
    };
    
    compilationQueue.push(compilationItem);
    
    // Immediately update the display to show the new compilation
    if (currentSection === 'editor') {
        renderReworkEditor();
    }
    
    startCompilation(compilationItem);
    
    showNotification(`Iniziata compilazione di ${template.name} (${formatTime(compilationTime)})`, 'info');
}

function calculateCompilationTime() {
    const template = toolTemplates[currentTemplate];
    const currentTemplateLevel = state.reworkEditor.templateLevels[currentTemplate] || 1;
    const currentLevelData = template.levels[currentTemplateLevel];
    
    // Base time based on template complexity
    let baseTime = currentLevelData.nodes.length * 30; // 30 seconds per node
    
    // Add time based on node upgrades
    currentLevelData.nodes.forEach(node => {
        const currentLevel = state.reworkEditor.nodeUpgrades[`${currentTemplate}_${node.id}`] || 1;
        baseTime += currentLevel * 15; // 15 seconds per upgrade level
    });
    
    // Apply talent modifiers
    const developmentLevel = state.unlocked['Sviluppo'] || 0;
    const stealthLevel = state.unlocked['Stealth'] || 0;
    
    let timeModifier = 1.0;
    timeModifier -= developmentLevel * 0.1; // 10% reduction per development level
    timeModifier -= stealthLevel * 0.05; // 5% reduction per stealth level
    
    // Apply compiler option modifiers
    Object.entries(compilerOptions).forEach(([key, option]) => {
        const checkbox = document.getElementById(`option-${key}`);
        if (checkbox && checkbox.checked) {
            timeModifier *= option.compilationTimeMultiplier;
        }
    });
    
    return Math.max(30, Math.round(baseTime * timeModifier)); // Minimum 30 seconds
}

function startCompilation(item) {
    const phases = ['Analysis', 'Preprocessing', 'Compilation', 'Optimization', 'Linking', 'Finalization'];
    let phaseIndex = 0;
    
    // Save to programming timer state for persistence
    if (!state.programmingTimer) {
        state.programmingTimer = {
            activeCompilations: {},
            completedCompilations: [],
            totalCompilationTime: 0,
            efficiencyRating: 1.0
        };
    }
    
    state.programmingTimer.activeCompilations[item.id] = item;
    
    const updateInterval = setInterval(() => {
        const elapsed = (Date.now() - item.startTime) / 1000;
        const progress = Math.min(100, (elapsed / item.totalTime) * 100);
        
        // Update phase based on progress
        const progressPerPhase = 100 / phases.length;
        phaseIndex = Math.min(phases.length - 1, Math.floor(progress / progressPerPhase));
        
        item.progress = progress;
        item.timeRemaining = Math.max(0, item.totalTime - elapsed);
        item.phase = phases[phaseIndex];
        
        // Update state persistence
        state.programmingTimer.activeCompilations[item.id] = item;
        
        if (item.progress >= 100) {
            clearInterval(updateInterval);
            item.isActive = false;
            item.phase = 'Completed';
            
            // Remove from programming timer active compilations
            delete state.programmingTimer.activeCompilations[item.id];
            
            completeCompilation(item);
        } else {
            // Save state every few seconds for persistence
            if (Math.floor(elapsed) % 5 === 0) {
                saveState();
            }
        }
        
        // Update display if currently viewing the editor
        if (currentSection === 'editor') {
            // Only update the compilation panel part instead of the whole editor
            const queueElement = document.querySelector('.queue-list');
            if (queueElement) {
                queueElement.innerHTML = renderCompilationQueue();
            }
        }
    }, 1000);
    
    // Store interval reference for cleanup
    item.updateInterval = updateInterval;
}

function completeCompilation(item) {
    // Remove from queue
    const index = compilationQueue.findIndex(q => q.id === item.id);
    if (index !== -1) {
        compilationQueue.splice(index, 1);
    }
    
    // Calculate malware statistics
    const effectiveness = calculateMalwareEffectiveness(item);
    const stealthRating = calculateStealthRating(item);
    const complexity = calculateComplexityRating(item);
    
    // Create compiled malware entry
    const compiledMalware = {
        id: item.id,
        templateName: item.templateName,
        template: item.template,
        appliedModifiers: item.appliedModifiers || [],
        compilerOptions: item.compilerOptions || [],
        nodeUpgrades: item.nodeUpgrades || {},
        completedAt: Date.now(),
        effectiveness: effectiveness,
        stealthRating: stealthRating,
        complexity: complexity,
        version: '1.0',
        programmingStatus: 'ready'
    };
    
    // Add to compiled malware storage
    if (!state.reworkEditor.compiledMalware) {
        state.reworkEditor.compiledMalware = [];
    }
    state.reworkEditor.compiledMalware.push(compiledMalware);
    
    // Add to compilation history for statistics
    if (!state.reworkEditor.compilationHistory) {
        state.reworkEditor.compilationHistory = [];
    }
    state.reworkEditor.compilationHistory.push({
        templateName: item.templateName,
        template: item.template,
        completedAt: Date.now(),
        compilationTime: item.totalTime,
        effectiveness: effectiveness
    });
    
    // Award XP and resources
    const xpGained = 100 + (item.totalTime / 60) * 10; // More XP for longer compilations
    state.experience += xpGained;
    state.xmr += Math.round(item.totalTime / 30); // 1 XMR per 30 seconds
    
    saveState();
    
    showNotification(`${item.templateName} compilato con successo! +${Math.round(xpGained)} XP`, 'success');
    
    // Update display
    if (currentSection === 'editor') {
        renderReworkEditor();
    }
}

function calculateMalwareEffectiveness(item) {
    let baseEffectiveness = 70; // Base effectiveness
    
    // Node level bonuses
    Object.entries(item.nodeUpgrades || {}).forEach(([nodeKey, level]) => {
        baseEffectiveness += (level - 1) * 5; // +5% per node level
    });
    
    // Modifier bonuses
    (item.appliedModifiers || []).forEach(modKey => {
        const modifier = modifierNodes[modKey];
        if (modifier) {
            baseEffectiveness += 10; // +10% per modifier
        }
    });
    
    // Compiler option bonuses
    (item.compilerOptions || []).forEach(optKey => {
        const option = compilerOptions[optKey];
        if (option && option.effectivenessBonus) {
            baseEffectiveness += option.effectivenessBonus * 100; // Convert to percentage
        }
    });
    
    // Core talent bonuses
    const coreTalents = state.reworkTalents?.coreTalents || {};
    const sviluppoLevel = coreTalents['Sviluppo'] || 0;
    baseEffectiveness += sviluppoLevel * 5; // +5% per development level
    
    return Math.min(100, Math.max(0, Math.round(baseEffectiveness)));
}

function calculateStealthRating(item) {
    let baseStealth = 50; // Base stealth
    
    // Stealth talent bonuses
    const coreTalents = state.reworkTalents?.coreTalents || {};
    const stealthLevel = coreTalents['Stealth'] || 0;
    baseStealth += stealthLevel * 15; // +15% per stealth level
    
    // Modifier bonuses (especially crypter and obfuscator)
    (item.appliedModifiers || []).forEach(modKey => {
        if (modKey === 'crypter') baseStealth += 20;
        if (modKey === 'obfuscator') baseStealth += 15;
        if (modKey === 'self_delete') baseStealth += 10;
    });
    
    // Compiler option bonuses
    (item.compilerOptions || []).forEach(optKey => {
        if (optKey === 'code_encryption') baseStealth += 15;
        if (optKey === 'anti_debugging') baseStealth += 20;
        if (optKey === 'polymorphic_engine') baseStealth += 25;
    });
    
    return Math.min(100, Math.max(0, Math.round(baseStealth)));
}

function calculateComplexityRating(item) {
    const template = toolTemplates[item.template];
    if (!template) return 'Semplice';
    
    // Use template level from compilation item or default to 1
    const templateLevel = item.templateLevel || 1;
    const levelData = template.levels[templateLevel];
    
    let complexityScore = levelData.nodes.length * 10;
    
    // Add node level complexity
    Object.entries(item.nodeUpgrades || {}).forEach(([nodeKey, level]) => {
        complexityScore += level * 5;
    });
    
    // Add modifier complexity
    complexityScore += (item.appliedModifiers || []).length * 15;
    
    // Add compiler option complexity
    complexityScore += (item.compilerOptions || []).length * 10;
    
    if (complexityScore < 50) return 'Semplice';
    if (complexityScore < 100) return 'Intermedio';
    if (complexityScore < 150) return 'Avanzato';
    return 'Esperto';
}

function resetTemplate() {
    if (!currentTemplate) return;
    
    // Reset all node upgrades for this template
    Object.keys(state.reworkEditor.nodeUpgrades).forEach(key => {
        if (key.startsWith(`${currentTemplate}_`)) {
            delete state.reworkEditor.nodeUpgrades[key];
        }
    });
    
    selectedNodeId = null;
    saveState();
    renderReworkEditor();
    
    showNotification('Template reset alle impostazioni predefinite', 'info');
}

function addReworkEditorEventListeners() {
    // Template card click events
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('locked')) {
                const templateKey = card.dataset.template;
                selectTemplate(templateKey);
            }
        });
    });
    
    // Node click events
    document.querySelectorAll('.template-node').forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            const nodeId = node.dataset.nodeId;
            selectNode(nodeId);
        });
    });
    
    // Canvas click to deselect
    const canvas = document.querySelector('.canvas-grid');
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            if (e.target === canvas) {
                selectedNodeId = null;
                renderReworkEditor();
            }
        });
    }
}

// Export functions for global access
window.initReworkEditor = initReworkEditor;
window.selectTemplate = selectTemplate;
window.selectNode = selectNode;
window.upgradeNode = upgradeNode;
window.powerUpTemplate = powerUpTemplate;
window.canPowerUpTemplate = canPowerUpTemplate;
window.compileTemplate = compileTemplate;
window.resetTemplate = resetTemplate;
window.deleteMalware = deleteMalware;
window.deployMalware = deployMalware;
window.viewMalwareDetails = viewMalwareDetails;
window.startProgrammingProcess = startProgrammingProcess;
window.showNodeUpgradeMenu = function(nodeId) {
    selectNode(nodeId);
    // Could implement a modal here for more detailed upgrade interface
};