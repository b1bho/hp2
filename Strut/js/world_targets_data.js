/**
 * js/world_targets_data.js
 * VERSIONE AGGIORNATA: Aggiunti TIER e CONDIZIONI DI SBLOCCO a ogni target.
 */

const targetCategories = {
    "financial": { name: "Istituzioni Finanziarie", icon: "fas fa-landmark" },
    "energy": { name: "Infrastrutture Energetiche", icon: "fas fa-bolt" },
    "transport": { name: "Infrastrutture di Trasporto", icon: "fas fa-plane-departure" },
    "communication": { name: "Infrastrutture di Comunicazione", icon: "fas fa-satellite-dish" },
    "public": { name: "Servizi Pubblici Essenziali", icon: "fas fa-hospital" },
    "government": { name: "Enti Governativi e Difesa", icon: "fas fa-shield-alt" },
    "industry": { name: "Ricerca e Industria", icon: "fas fa-industry" },
    "population": { name: "Popolazione Civile", icon: "fas fa-users" },
    "network_nodes": { name: "Nodi di Rete Globali", icon: "fas fa-globe" }
};

const worldTargets = {
    // --- TIER 1 (Iniziali - Sbloccati con la Scansione Globale) ---
    "generic_population": {
        id: "generic_population", name: "Popolazione Generale", ipAddress: "100.64.0.0/10",
        category: "population", req: { lso: 4, rc: 1.8, lcs: 2, an: 3, eo: 4, rl: 6 },
        rewardType: "Dati Anagrafici", rewardScale: 30000, sensitivity: 4, baseExecutionTime: 600,
        tier: 1,
        unlock_conditions: [] // Sbloccato di default con la pagina del mondo
    },

    // --- TIER 2 (Intermedi) ---
    "generic_regional_bank": {
        id: "generic_regional_bank", name: "Banca Commerciale Regionale", ipAddress: "172.21.10.5",
        category: "financial", req: { lso: 6, rc: 2.5, lcs: 4, an: 5, eo: 6, rl: 5 },
        rewardType: "Dati Carte di Credito", rewardScale: 10000, sensitivity: 6, baseExecutionTime: 3600,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 5 }]
    },
    "generic_isp": {
        id: "generic_isp", name: "Provider Internet Nazionale", ipAddress: "198.51.100.1",
        category: "communication", req: { lso: 7, rc: 2.8, lcs: 4, an: 6, eo: 8, rl: 4 },
        rewardType: "Log di Traffico Utenti", rewardScale: 5000, sensitivity: 6, baseExecutionTime: 5400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 7 }, { type: "TALENT", value: "Networking (Net)_LV1" }]
    },
    "it_gov": { 
        id: "it_gov", name: "Server Governativi", ipAddress: "212.48.24.25", category: "government", 
        req: { lso: 7, rc: 2.5, lcs: 5, an: 6, eo: 4, rl: 3 }, rewardType: "Comunicazioni Ministeriali", 
        rewardScale: 5, sensitivity: 7, baseExecutionTime: 10800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 8 }]
    },
    
    // --- TIER 3 (Avanzati) ---
    "generic_power_plant": {
        id: "generic_power_plant", name: "Centrale Elettrica Locale", ipAddress: "10.200.5.1",
        category: "energy", req: { lso: 8, rc: 3.0, lcs: 5, an: 6, eo: 7, rl: 4 },
        rewardType: "Controllo Rete Elettrica Locale", rewardScale: 1, sensitivity: 7, baseExecutionTime: 7200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 12 }, { type: "TALENT", value: "Networking (Net)_LV2" }]
    },
    "generic_hospital": {
        id: "generic_hospital", name: "Sistema Sanitario Regionale", ipAddress: "192.0.2.123",
        category: "public", req: { lso: 8, rc: 3.0, lcs: 7, an: 8, eo: 6, rl: 4 },
        rewardType: "Cartelle Cliniche", rewardScale: 10000, sensitivity: 8, baseExecutionTime: 14400,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }, { type: "TALENT", value: "SQL_LV2" }]
    },
    "usa_wallstreet": { 
        id: "usa_wallstreet", name: "Borsa di Wall Street", ipAddress: "72.21.206.6", category: "financial", 
        req: { lso: 12, rc: 4.0, lcs: 8, an: 10, eo: 10, rl: 2 }, rewardType: "Dati Finanziari Top-Tier", 
        rewardScale: 500, sensitivity: 9, baseExecutionTime: 43200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 18 }, { type: "TALENT", value: "SQL_LV3" }]
    },

    // --- TIER 4 (Elite) ---
    "usa_pentagon": { 
        id: "usa_pentagon", name: "Pentagono", ipAddress: "208.111.153.100", category: "government", 
        req: { lso: 15, rc: 4.5, lcs: 10, an: 12, eo: 8, rl: 0 }, rewardType: "Informazioni Governative Riservate", 
        rewardScale: 1, sensitivity: 10, baseExecutionTime: 86400,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 25 }, { type: "TALENT", value: "Exploit Development_LV2" }]
    },
    "il_mossad_hq": { 
        id: "il_mossad_hq", name: "Quartier Generale Mossad", ipAddress: "82.80.11.18", category: "government", 
        req: { lso: 19, rc: 5.0, lcs: 14, an: 15, eo: 10, rl: 0 }, rewardType: "Identità Agenti Sotto Copertura", 
        rewardScale: 1, sensitivity: 10, baseExecutionTime: 259200,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 30 }, { type: "TALENT", value: "Stealth_LV3" }, { type: "TALENT", value: "Social Engineering (SocEng)_LV4" }]
    },
     "dns_root_server": {
        id: "dns_root_server", name: "DNS Root Server (Simulato)", ipAddress: "199.7.83.42", category: "network_nodes",
        lat: 48.8566, lon: 2.3522, req: { lso: 20, rc: 5.0, lcs: 15, an: 15, eo: 10, rl: 0 },
        rewardType: "Chiavi DNS Globali", rewardScale: 1, sensitivity: 10, baseExecutionTime: 300000,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 35 }, { type: "TALENT", value: "Exploit Development_LV3" }]
    },

    // === ADDITIONAL TIER 1 TARGETS ===
    "generic_university": {
        id: "generic_university", name: "Sistema Universitario", ipAddress: "192.168.10.0/24",
        category: "public", req: { lso: 3, rc: 1.5, lcs: 2, an: 2, eo: 3, rl: 7 },
        rewardType: "Database Studenti", rewardScale: 15000, sensitivity: 3, baseExecutionTime: 1800,
        tier: 1,
        unlock_conditions: []
    },
    "generic_municipality": {
        id: "generic_municipality", name: "Comune Locale", ipAddress: "10.100.0.0/16",
        category: "government", req: { lso: 4, rc: 1.8, lcs: 3, an: 3, eo: 2, rl: 6 },
        rewardType: "Registri Anagrafici", rewardScale: 20000, sensitivity: 4, baseExecutionTime: 2400,
        tier: 1,
        unlock_conditions: []
    },
    "generic_retail_chain": {
        id: "generic_retail_chain", name: "Catena di Negozi", ipAddress: "172.16.50.0/24",
        category: "industry", req: { lso: 4, rc: 2.0, lcs: 2, an: 3, eo: 4, rl: 7 },
        rewardType: "Database Clienti", rewardScale: 25000, sensitivity: 3, baseExecutionTime: 1200,
        tier: 1,
        unlock_conditions: []
    },
    "generic_social_network": {
        id: "generic_social_network", name: "Social Network Locale", ipAddress: "203.0.113.0/24",
        category: "communication", req: { lso: 5, rc: 2.2, lcs: 3, an: 4, eo: 5, rl: 6 },
        rewardType: "Profili e Messaggi", rewardScale: 50000, sensitivity: 5, baseExecutionTime: 3600,
        tier: 1,
        unlock_conditions: []
    },
    "generic_insurance_company": {
        id: "generic_insurance_company", name: "Compagnia Assicurativa", ipAddress: "198.18.0.0/15",
        category: "financial", req: { lso: 5, rc: 2.3, lcs: 3, an: 4, eo: 3, rl: 5 },
        rewardType: "Polizze Assicurative", rewardScale: 12000, sensitivity: 4, baseExecutionTime: 2700,
        tier: 1,
        unlock_conditions: []
    },

    // === ADDITIONAL TIER 2 TARGETS ===
    "generic_logistics_hub": {
        id: "generic_logistics_hub", name: "Hub Logistico", ipAddress: "10.50.0.0/16",
        category: "transport", req: { lso: 6, rc: 2.8, lcs: 4, an: 5, eo: 6, rl: 4 },
        rewardType: "Tracciamento Spedizioni", rewardScale: 8000, sensitivity: 5, baseExecutionTime: 4500,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 6 }]
    },
    "generic_media_company": {
        id: "generic_media_company", name: "Società Mediatica", ipAddress: "192.0.2.0/24",
        category: "communication", req: { lso: 7, rc: 2.6, lcs: 4, an: 6, eo: 5, rl: 5 },
        rewardType: "Archivio Giornalistico", rewardScale: 3000, sensitivity: 6, baseExecutionTime: 5400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 8 }]
    },
    "generic_telecom_provider": {
        id: "generic_telecom_provider", name: "Operatore Telecomunicazioni", ipAddress: "203.0.113.128/25",
        category: "communication", req: { lso: 8, rc: 3.0, lcs: 5, an: 7, eo: 8, rl: 3 },
        rewardType: "Metadati Chiamate", rewardScale: 100000, sensitivity: 7, baseExecutionTime: 7200,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 9 }, { type: "TALENT", value: "Networking (Net)_LV1" }]
    },
    "generic_data_center": {
        id: "generic_data_center", name: "Data Center Commerciale", ipAddress: "8.8.8.0/24",
        category: "network_nodes", req: { lso: 8, rc: 3.2, lcs: 6, an: 7, eo: 9, rl: 2 },
        rewardType: "Accesso Server Hosting", rewardScale: 500, sensitivity: 7, baseExecutionTime: 9000,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 10 }, { type: "TALENT", value: "Exploit Development_LV1" }]
    },
    "generic_credit_union": {
        id: "generic_credit_union", name: "Cooperativa di Credito", ipAddress: "172.20.10.0/24",
        category: "financial", req: { lso: 7, rc: 2.7, lcs: 5, an: 6, eo: 5, rl: 4 },
        rewardType: "Prestiti e Mutui", rewardScale: 8000, sensitivity: 6, baseExecutionTime: 5400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 8 }, { type: "TALENT", value: "SQL_LV1" }]
    },
    "generic_court_system": {
        id: "generic_court_system", name: "Sistema Giudiziario", ipAddress: "10.120.0.0/16",
        category: "government", req: { lso: 8, rc: 2.9, lcs: 6, an: 7, eo: 4, rl: 3 },
        rewardType: "Fascicoli Processuali", rewardScale: 2000, sensitivity: 8, baseExecutionTime: 10800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 11 }]
    },

    // === ADDITIONAL TIER 3 TARGETS ===
    "generic_airport_control": {
        id: "generic_airport_control", name: "Controllo Traffico Aereo", ipAddress: "192.88.99.0/24",
        category: "transport", req: { lso: 9, rc: 3.5, lcs: 7, an: 8, eo: 9, rl: 2 },
        rewardType: "Piano Voli e Controllo", rewardScale: 100, sensitivity: 9, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 16 }, { type: "TALENT", value: "Stealth_LV1" }]
    },
    "generic_water_treatment": {
        id: "generic_water_treatment", name: "Impianto Trattamento Acqua", ipAddress: "10.250.0.0/16",
        category: "public", req: { lso: 9, rc: 3.3, lcs: 6, an: 7, eo: 8, rl: 3 },
        rewardType: "Controllo Sistema Idrico", rewardScale: 50, sensitivity: 8, baseExecutionTime: 14400,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 14 }, { type: "TALENT", value: "Networking (Net)_LV2" }]
    },
    "generic_stock_exchange": {
        id: "generic_stock_exchange", name: "Borsa Valori Nazionale", ipAddress: "192.0.2.100/26",
        category: "financial", req: { lso: 10, rc: 4.0, lcs: 8, an: 9, eo: 10, rl: 1 },
        rewardType: "Transazioni Borsistiche", rewardScale: 1000, sensitivity: 9, baseExecutionTime: 28800,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 18 }, { type: "TALENT", value: "SQL_LV2" }]
    },
    "generic_research_lab": {
        id: "generic_research_lab", name: "Laboratorio di Ricerca", ipAddress: "198.51.100.64/26",
        category: "industry", req: { lso: 9, rc: 3.4, lcs: 7, an: 8, eo: 6, rl: 3 },
        rewardType: "Ricerche Scientifiche", rewardScale: 500, sensitivity: 7, baseExecutionTime: 12600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }]
    },
    "generic_military_base": {
        id: "generic_military_base", name: "Base Militare", ipAddress: "172.30.0.0/16",
        category: "government", req: { lso: 12, rc: 4.0, lcs: 9, an: 11, eo: 8, rl: 1 },
        rewardType: "Intelligence Militare", rewardScale: 10, sensitivity: 10, baseExecutionTime: 36000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 20 }, { type: "TALENT", value: "Stealth_LV2" }]
    },

    // === SPECIFIC COUNTRY TARGETS (TIER 2-4) ===
    "it_telecom": {
        id: "it_telecom", name: "TIM - Telecom Italia", ipAddress: "151.12.0.0/16",
        category: "communication", req: { lso: 8, rc: 3.0, lcs: 5, an: 7, eo: 7, rl: 4 },
        rewardType: "Database Utenti TIM", rewardScale: 80000, sensitivity: 7, baseExecutionTime: 9000,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 10 }]
    },
    "uk_mi6": {
        id: "uk_mi6", name: "MI6 Intelligence Service", ipAddress: "194.36.173.0/24",
        category: "government", req: { lso: 14, rc: 4.2, lcs: 10, an: 12, eo: 9, rl: 0 },
        rewardType: "Operazioni Segrete MI6", rewardScale: 5, sensitivity: 10, baseExecutionTime: 72000,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 28 }, { type: "TALENT", value: "Social Engineering (SocEng)_LV3" }]
    },
    "de_datacenter_frankfurt": {
        id: "de_datacenter_frankfurt", name: "Data Center Francoforte", ipAddress: "217.160.0.0/16",
        category: "network_nodes", req: { lso: 9, rc: 3.5, lcs: 7, an: 8, eo: 9, rl: 2 },
        rewardType: "Accesso Hosting Europeo", rewardScale: 800, sensitivity: 7, baseExecutionTime: 12000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 16 }]
    },
    "de_automotive_scada": {
        id: "de_automotive_scada", name: "Sistema SCADA Automotive", ipAddress: "192.53.103.0/24",
        category: "industry", req: { lso: 10, rc: 3.6, lcs: 8, an: 9, eo: 7, rl: 2 },
        rewardType: "Controllo Produzione Auto", rewardScale: 50, sensitivity: 8, baseExecutionTime: 21600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 17 }, { type: "TALENT", value: "Exploit Development_LV1" }]
    },
    "ru_kremlin": {
        id: "ru_kremlin", name: "Sistema del Cremlino", ipAddress: "81.177.140.0/24",
        category: "government", req: { lso: 18, rc: 4.8, lcs: 12, an: 14, eo: 10, rl: 0 },
        rewardType: "Comunicazioni Governo Russo", rewardScale: 1, sensitivity: 10, baseExecutionTime: 172800,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 32 }, { type: "TALENT", value: "Stealth_LV3" }]
    },
    "ru_gazprom": {
        id: "ru_gazprom", name: "Gazprom Energy Network", ipAddress: "195.161.0.0/16",
        category: "energy", req: { lso: 11, rc: 3.8, lcs: 8, an: 10, eo: 9, rl: 1 },
        rewardType: "Controllo Rete Gas", rewardScale: 25, sensitivity: 9, baseExecutionTime: 43200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 19 }, { type: "TALENT", value: "Networking (Net)_LV3" }]
    },
    "ch_swiss_banks": {
        id: "ch_swiss_banks", name: "Sistema Bancario Svizzero", ipAddress: "130.59.0.0/16",
        category: "financial", req: { lso: 15, rc: 4.5, lcs: 11, an: 13, eo: 12, rl: 0 },
        rewardType: "Conti Bancari Svizzeri", rewardScale: 500, sensitivity: 10, baseExecutionTime: 129600,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 26 }, { type: "TALENT", value: "SQL_LV3" }]
    },
    "ch_cern": {
        id: "ch_cern", name: "CERN Research Network", ipAddress: "137.138.0.0/16",
        category: "industry", req: { lso: 12, rc: 4.0, lcs: 9, an: 10, eo: 8, rl: 2 },
        rewardType: "Ricerche Fisiche CERN", rewardScale: 100, sensitivity: 8, baseExecutionTime: 32400,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 21 }]
    },
    "cn_gfw": {
        id: "cn_gfw", name: "Great Firewall Control", ipAddress: "59.24.3.0/24",
        category: "network_nodes", req: { lso: 16, rc: 4.6, lcs: 12, an: 14, eo: 11, rl: 0 },
        rewardType: "Controlli Internet Cinese", rewardScale: 10, sensitivity: 10, baseExecutionTime: 86400,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 29 }, { type: "TALENT", value: "Networking (Net)_LV3" }]
    },
    "cn_shanghai_port": {
        id: "cn_shanghai_port", name: "Porto di Shanghai", ipAddress: "202.96.209.0/24",
        category: "transport", req: { lso: 10, rc: 3.6, lcs: 8, an: 9, eo: 8, rl: 2 },
        rewardType: "Logistica Portuale", rewardScale: 2000, sensitivity: 7, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 17 }]
    },
    "cn_bank_of_china": {
        id: "cn_bank_of_china", name: "Bank of China", ipAddress: "202.108.22.0/24",
        category: "financial", req: { lso: 13, rc: 4.1, lcs: 9, an: 11, eo: 10, rl: 1 },
        rewardType: "Sistema Bancario Cinese", rewardScale: 800, sensitivity: 9, baseExecutionTime: 57600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 22 }, { type: "TALENT", value: "SQL_LV2" }]
    },
    "jp_tokyo_stock_exchange": {
        id: "jp_tokyo_stock_exchange", name: "Borsa di Tokyo", ipAddress: "203.174.65.0/24",
        category: "financial", req: { lso: 11, rc: 3.9, lcs: 8, an: 10, eo: 9, rl: 1 },
        rewardType: "Trading Borsa Tokyo", rewardScale: 1200, sensitivity: 8, baseExecutionTime: 36000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 19 }, { type: "TALENT", value: "SQL_LV2" }]
    },
    "jp_shinkansen_control": {
        id: "jp_shinkansen_control", name: "Controllo Shinkansen", ipAddress: "210.173.160.0/24",
        category: "transport", req: { lso: 10, rc: 3.7, lcs: 8, an: 9, eo: 8, rl: 2 },
        rewardType: "Sistema Treni Veloce", rewardScale: 50, sensitivity: 8, baseExecutionTime: 25200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 18 }, { type: "TALENT", value: "Stealth_LV1" }]
    },
    "fr_dgse_hq": {
        id: "fr_dgse_hq", name: "DGSE Intelligence", ipAddress: "193.252.19.0/24",
        category: "government", req: { lso: 13, rc: 4.1, lcs: 10, an: 11, eo: 9, rl: 0 },
        rewardType: "Intelligence Francese", rewardScale: 8, sensitivity: 10, baseExecutionTime: 86400,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 27 }, { type: "TALENT", value: "Social Engineering (SocEng)_LV3" }]
    },
    "fr_nuclear_plant": {
        id: "fr_nuclear_plant", name: "Centrale Nucleare", ipAddress: "194.214.0.0/16",
        category: "energy", req: { lso: 12, rc: 4.0, lcs: 9, an: 10, eo: 9, rl: 1 },
        rewardType: "Controllo Nucleare", rewardScale: 15, sensitivity: 10, baseExecutionTime: 64800,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 24 }, { type: "TALENT", value: "Exploit Development_LV2" }]
    },
    "ca_hydro_dam": {
        id: "ca_hydro_dam", name: "Diga Idroelettrica", ipAddress: "142.103.0.0/16",
        category: "energy", req: { lso: 9, rc: 3.4, lcs: 7, an: 8, eo: 7, rl: 3 },
        rewardType: "Controllo Sistema Idrico", rewardScale: 30, sensitivity: 8, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }]
    },
    "ca_csis_hq": {
        id: "ca_csis_hq", name: "CSIS Intelligence Canada", ipAddress: "192.197.82.0/24",
        category: "government", req: { lso: 12, rc: 3.9, lcs: 9, an: 10, eo: 8, rl: 1 },
        rewardType: "Intelligence Canadese", rewardScale: 12, sensitivity: 9, baseExecutionTime: 72000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 21 }, { type: "TALENT", value: "Stealth_LV2" }]
    },
    "br_election_system": {
        id: "br_election_system", name: "Sistema Elettorale Brasiliano", ipAddress: "200.130.0.0/16",
        category: "government", req: { lso: 8, rc: 3.1, lcs: 6, an: 7, eo: 5, rl: 3 },
        rewardType: "Database Elettorale", rewardScale: 150000, sensitivity: 8, baseExecutionTime: 14400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 12 }]
    },
    "in_aadhaar_db": {
        id: "in_aadhaar_db", name: "Database Aadhaar", ipAddress: "164.100.0.0/16",
        category: "government", req: { lso: 10, rc: 3.6, lcs: 8, an: 9, eo: 6, rl: 2 },
        rewardType: "Identità Biometriche", rewardScale: 1000000, sensitivity: 9, baseExecutionTime: 32400,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 18 }, { type: "TALENT", value: "SQL_LV2" }]
    },
    "il_iron_dome": {
        id: "il_iron_dome", name: "Sistema Iron Dome", ipAddress: "212.179.0.0/16",
        category: "government", req: { lso: 14, rc: 4.3, lcs: 11, an: 12, eo: 10, rl: 0 },
        rewardType: "Controllo Difesa Missilistica", rewardScale: 5, sensitivity: 10, baseExecutionTime: 108000,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 28 }, { type: "TALENT", value: "Exploit Development_LV2" }]
    },
    "sa_aramco_refinery": {
        id: "sa_aramco_refinery", name: "Raffineria Aramco", ipAddress: "213.42.0.0/16",
        category: "energy", req: { lso: 11, rc: 3.8, lcs: 8, an: 9, eo: 8, rl: 2 },
        rewardType: "Controllo Raffineria", rewardScale: 20, sensitivity: 9, baseExecutionTime: 28800,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 19 }]
    },
    "tr_bayraktar_hq": {
        id: "tr_bayraktar_hq", name: "Bayraktar Defense Systems", ipAddress: "212.156.0.0/16",
        category: "industry", req: { lso: 9, rc: 3.4, lcs: 7, an: 8, eo: 7, rl: 3 },
        rewardType: "Progetti Droni Militari", rewardScale: 100, sensitivity: 8, baseExecutionTime: 21600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 16 }]
    },
    "za_eskom_grid": {
        id: "za_eskom_grid", name: "Rete Elettrica Eskom", ipAddress: "196.25.0.0/16",
        category: "energy", req: { lso: 7, rc: 2.8, lcs: 5, an: 6, eo: 6, rl: 4 },
        rewardType: "Controllo Rete Sudafricana", rewardScale: 80, sensitivity: 7, baseExecutionTime: 14400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 11 }]
    },
    "au_mining_corp": {
        id: "au_mining_corp", name: "Corporazione Mineraria", ipAddress: "203.21.0.0/16",
        category: "industry", req: { lso: 8, rc: 3.1, lcs: 6, an: 7, eo: 6, rl: 3 },
        rewardType: "Dati Estrazione Mineraria", rewardScale: 500, sensitivity: 6, baseExecutionTime: 10800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 13 }]
    },
    "sk_samsung_rd": {
        id: "sk_samsung_rd", name: "Samsung R&D Center", ipAddress: "211.249.0.0/16",
        category: "industry", req: { lso: 10, rc: 3.7, lcs: 8, an: 9, eo: 8, rl: 2 },
        rewardType: "Ricerche Tecnologiche", rewardScale: 300, sensitivity: 8, baseExecutionTime: 25200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 17 }]
    },
    "tw_tsmc_fab": {
        id: "tw_tsmc_fab", name: "TSMC Semiconductor Fab", ipAddress: "140.109.0.0/16",
        category: "industry", req: { lso: 11, rc: 3.9, lcs: 9, an: 10, eo: 9, rl: 1 },
        rewardType: "Processi Produzione Chip", rewardScale: 200, sensitivity: 9, baseExecutionTime: 36000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 20 }, { type: "TALENT", value: "Stealth_LV1" }]
    },
    "ir_nuclear_program": {
        id: "ir_nuclear_program", name: "Programma Nucleare Iraniano", ipAddress: "85.15.0.0/16",
        category: "government", req: { lso: 13, rc: 4.2, lcs: 10, an: 11, eo: 9, rl: 0 },
        rewardType: "Dati Programma Nucleare", rewardScale: 10, sensitivity: 10, baseExecutionTime: 86400,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 25 }, { type: "TALENT", value: "Stealth_LV2" }]
    },

    // === ADDITIONAL GENERIC TARGETS ===
    "generic_manufacturing_plant": {
        id: "generic_manufacturing_plant", name: "Impianto Manifatturiero", ipAddress: "10.150.0.0/16",
        category: "industry", req: { lso: 6, rc: 2.6, lcs: 4, an: 5, eo: 5, rl: 5 },
        rewardType: "Dati Produzione Industriale", rewardScale: 3000, sensitivity: 5, baseExecutionTime: 4800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 7 }]
    },
    "generic_mobile_money": {
        id: "generic_mobile_money", name: "Sistema Mobile Money", ipAddress: "41.57.0.0/16",
        category: "financial", req: { lso: 5, rc: 2.4, lcs: 3, an: 4, eo: 4, rl: 6 },
        rewardType: "Transazioni Mobile", rewardScale: 50000, sensitivity: 4, baseExecutionTime: 3600,
        tier: 1,
        unlock_conditions: []
    },
    "generic_palm_oil_plantation": {
        id: "generic_palm_oil_plantation", name: "Piantagione Olio di Palma", ipAddress: "180.129.0.0/16",
        category: "industry", req: { lso: 4, rc: 2.0, lcs: 2, an: 3, eo: 3, rl: 7 },
        rewardType: "Dati Produzione Agricola", rewardScale: 1000, sensitivity: 3, baseExecutionTime: 2400,
        tier: 1,
        unlock_conditions: []
    },
    "generic_agriculture_system": {
        id: "generic_agriculture_system", name: "Sistema Agricolo Automatizzato", ipAddress: "192.168.200.0/24",
        category: "industry", req: { lso: 6, rc: 2.7, lcs: 4, an: 5, eo: 4, rl: 5 },
        rewardType: "Controllo Sistemi Agricoli", rewardScale: 200, sensitivity: 4, baseExecutionTime: 4800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 8 }]
    },
    "generic_tourism_system": {
        id: "generic_tourism_system", name: "Sistema Gestione Turismo", ipAddress: "192.0.3.0/24",
        category: "public", req: { lso: 5, rc: 2.3, lcs: 3, an: 4, eo: 3, rl: 6 },
        rewardType: "Database Turisti", rewardScale: 30000, sensitivity: 4, baseExecutionTime: 3600,
        tier: 1,
        unlock_conditions: []
    },
    "generic_oil_refinery": {
        id: "generic_oil_refinery", name: "Raffineria Petrolifera", ipAddress: "172.25.0.0/16",
        category: "energy", req: { lso: 9, rc: 3.4, lcs: 7, an: 8, eo: 7, rl: 3 },
        rewardType: "Controllo Raffineria", rewardScale: 50, sensitivity: 8, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }]
    },
    "generic_sports_venue": {
        id: "generic_sports_venue", name: "Stadio/Impianto Sportivo", ipAddress: "10.180.0.0/16",
        category: "public", req: { lso: 5, rc: 2.2, lcs: 3, an: 4, eo: 3, rl: 6 },
        rewardType: "Database Tifosi", rewardScale: 80000, sensitivity: 3, baseExecutionTime: 2400,
        tier: 1,
        unlock_conditions: []
    },
    "generic_government_portal": {
        id: "generic_government_portal", name: "Portale Governativo", ipAddress: "10.110.0.0/16",
        category: "government", req: { lso: 7, rc: 2.8, lcs: 5, an: 6, eo: 4, rl: 4 },
        rewardType: "Servizi Online Cittadini", rewardScale: 100000, sensitivity: 6, baseExecutionTime: 9000,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 9 }]
    },
    "generic_military_communications": {
        id: "generic_military_communications", name: "Comunicazioni Militari", ipAddress: "172.31.0.0/16",
        category: "government", req: { lso: 10, rc: 3.6, lcs: 8, an: 9, eo: 7, rl: 2 },
        rewardType: "Comunicazioni Tattiche", rewardScale: 20, sensitivity: 9, baseExecutionTime: 21600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 17 }, { type: "TALENT", value: "Stealth_LV1" }]
    },
    "generic_mining_corp": {
        id: "generic_mining_corp", name: "Corporazione Mineraria", ipAddress: "203.21.0.0/16",
        category: "industry", req: { lso: 8, rc: 3.1, lcs: 6, an: 7, eo: 6, rl: 3 },
        rewardType: "Dati Estrazione Mineraria", rewardScale: 500, sensitivity: 6, baseExecutionTime: 10800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 13 }]
    },
    "generic_cloud_provider": {
        id: "generic_cloud_provider", name: "Provider Cloud Services", ipAddress: "185.199.108.0/24",
        category: "network_nodes", req: { lso: 11, rc: 3.8, lcs: 8, an: 10, eo: 10, rl: 1 },
        rewardType: "Accesso Infrastruttura Cloud", rewardScale: 2000, sensitivity: 8, baseExecutionTime: 32400,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 19 }, { type: "TALENT", value: "Networking (Net)_LV2" }]
    },
    "generic_streaming_service": {
        id: "generic_streaming_service", name: "Servizio Streaming", ipAddress: "23.246.0.0/18",
        category: "communication", req: { lso: 6, rc: 2.6, lcs: 4, an: 5, eo: 6, rl: 5 },
        rewardType: "Database Utenti Streaming", rewardScale: 250000, sensitivity: 5, baseExecutionTime: 5400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 8 }]
    },
    "generic_gaming_platform": {
        id: "generic_gaming_platform", name: "Piattaforma Gaming", ipAddress: "104.16.0.0/12",
        category: "communication", req: { lso: 7, rc: 2.8, lcs: 5, an: 6, eo: 7, rl: 4 },
        rewardType: "Account Giocatori", rewardScale: 500000, sensitivity: 5, baseExecutionTime: 7200,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 10 }]
    },
    "generic_cryptocurrency_exchange": {
        id: "generic_cryptocurrency_exchange", name: "Exchange Criptovalute", ipAddress: "66.42.0.0/16",
        category: "financial", req: { lso: 10, rc: 3.7, lcs: 8, an: 9, eo: 9, rl: 2 },
        rewardType: "Wallet e Transazioni Crypto", rewardScale: 5000, sensitivity: 8, baseExecutionTime: 28800,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 18 }, { type: "TALENT", value: "SQL_LV2" }]
    },
    "generic_dating_app": {
        id: "generic_dating_app", name: "App di Incontri", ipAddress: "199.232.0.0/16",
        category: "communication", req: { lso: 6, rc: 2.5, lcs: 4, an: 5, eo: 5, rl: 5 },
        rewardType: "Profili Dating", rewardScale: 100000, sensitivity: 6, baseExecutionTime: 4800,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 7 }]
    },
    "generic_food_delivery": {
        id: "generic_food_delivery", name: "Servizio Food Delivery", ipAddress: "172.67.0.0/16",
        category: "public", req: { lso: 5, rc: 2.3, lcs: 3, an: 4, eo: 4, rl: 6 },
        rewardType: "Ordini e Pagamenti", rewardScale: 150000, sensitivity: 4, baseExecutionTime: 3600,
        tier: 1,
        unlock_conditions: []
    },
    "generic_ride_sharing": {
        id: "generic_ride_sharing", name: "App Ride Sharing", ipAddress: "54.230.0.0/16",
        category: "transport", req: { lso: 6, rc: 2.6, lcs: 4, an: 5, eo: 5, rl: 5 },
        rewardType: "Dati GPS e Viaggi", rewardScale: 200000, sensitivity: 6, baseExecutionTime: 5400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 8 }]
    },
    "generic_smart_city": {
        id: "generic_smart_city", name: "Sistema Smart City", ipAddress: "10.200.0.0/16",
        category: "public", req: { lso: 9, rc: 3.3, lcs: 7, an: 8, eo: 7, rl: 3 },
        rewardType: "Controllo Infrastrutture Urbane", rewardScale: 100, sensitivity: 8, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 16 }]
    },

    // === ADDITIONAL SPECIFIC COUNTRY TARGETS ===
    "usa_faa_atc": {
        id: "usa_faa_atc", name: "FAA Air Traffic Control", ipAddress: "192.55.83.0/24",
        category: "transport", req: { lso: 12, rc: 4.0, lcs: 9, an: 11, eo: 9, rl: 1 },
        rewardType: "Controllo Traffico Aereo USA", rewardScale: 50, sensitivity: 10, baseExecutionTime: 43200,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 23 }, { type: "TALENT", value: "Stealth_LV2" }]
    },
    "ae_burj_khalifa_scada": {
        id: "ae_burj_khalifa_scada", name: "Sistema SCADA Burj Khalifa", ipAddress: "91.74.0.0/16",
        category: "industry", req: { lso: 8, rc: 3.2, lcs: 6, an: 7, eo: 6, rl: 3 },
        rewardType: "Controllo Grattacielo", rewardScale: 80, sensitivity: 6, baseExecutionTime: 14400,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 12 }]
    },
    "ae_dubai_financial_market": {
        id: "ae_dubai_financial_market", name: "Dubai Financial Market", ipAddress: "195.229.0.0/16",
        category: "financial", req: { lso: 9, rc: 3.5, lcs: 7, an: 8, eo: 8, rl: 2 },
        rewardType: "Mercato Finanziario Dubai", rewardScale: 2000, sensitivity: 7, baseExecutionTime: 21600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 16 }]
    },
    "kp_bureau_121": {
        id: "kp_bureau_121", name: "Bureau 121 Cyber Unit", ipAddress: "175.45.176.0/24",
        category: "government", req: { lso: 16, rc: 4.6, lcs: 12, an: 14, eo: 11, rl: 0 },
        rewardType: "Cyber Operations Unit", rewardScale: 3, sensitivity: 10, baseExecutionTime: 129600,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 30 }, { type: "TALENT", value: "Exploit Development_LV3" }]
    },
    "kp_national_intranet": {
        id: "kp_national_intranet", name: "Kwangmyong Intranet", ipAddress: "175.45.0.0/16",
        category: "network_nodes", req: { lso: 14, rc: 4.3, lcs: 11, an: 12, eo: 10, rl: 0 },
        rewardType: "Rete Interna Nord Coreana", rewardScale: 8, sensitivity: 10, baseExecutionTime: 86400,
        tier: 4,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 26 }, { type: "TALENT", value: "Networking (Net)_LV3" }]
    },
    "nl_port_rotterdam": {
        id: "nl_port_rotterdam", name: "Porto di Rotterdam", ipAddress: "145.76.0.0/16",
        category: "transport", req: { lso: 9, rc: 3.4, lcs: 7, an: 8, eo: 7, rl: 2 },
        rewardType: "Logistica Porto Europeo", rewardScale: 1500, sensitivity: 7, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }]
    },
    "nl_asml_hq": {
        id: "nl_asml_hq", name: "ASML Semiconductor Systems", ipAddress: "134.221.0.0/16",
        category: "industry", req: { lso: 11, rc: 3.9, lcs: 9, an: 10, eo: 9, rl: 1 },
        rewardType: "Tecnologie Litografia", rewardScale: 150, sensitivity: 9, baseExecutionTime: 36000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 20 }]
    },
    "se_saab_defence": {
        id: "se_saab_defence", name: "Saab Defence Systems", ipAddress: "130.237.0.0/16",
        category: "industry", req: { lso: 10, rc: 3.6, lcs: 8, an: 9, eo: 8, rl: 2 },
        rewardType: "Progetti Difesa Aerea", rewardScale: 80, sensitivity: 8, baseExecutionTime: 28800,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 17 }]
    },
    "se_bankid_system": {
        id: "se_bankid_system", name: "Sistema BankID", ipAddress: "213.115.0.0/16",
        category: "financial", req: { lso: 9, rc: 3.4, lcs: 7, an: 8, eo: 7, rl: 2 },
        rewardType: "Sistema Identità Digitale", rewardScale: 80000, sensitivity: 8, baseExecutionTime: 21600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 16 }]
    },
    "es_cni_intel": {
        id: "es_cni_intel", name: "CNI Intelligence España", ipAddress: "193.146.0.0/16",
        category: "government", req: { lso: 11, rc: 3.8, lcs: 8, an: 10, eo: 8, rl: 1 },
        rewardType: "Intelligence Spagnola", rewardScale: 15, sensitivity: 9, baseExecutionTime: 64800,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 20 }, { type: "TALENT", value: "Stealth_LV2" }]
    },
    "mx_cartel_comms": {
        id: "mx_cartel_comms", name: "Comunicazioni Cartello", ipAddress: "201.131.0.0/16",
        category: "communication", req: { lso: 8, rc: 3.0, lcs: 6, an: 7, eo: 6, rl: 4 },
        rewardType: "Comunicazioni Criminali", rewardScale: 5000, sensitivity: 7, baseExecutionTime: 12600,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 12 }, { type: "TALENT", value: "Social Engineering (SocEng)_LV2" }]
    },
    "mx_pemex_oil": {
        id: "mx_pemex_oil", name: "PEMEX Oil Corporation", ipAddress: "189.240.0.0/16",
        category: "energy", req: { lso: 9, rc: 3.3, lcs: 7, an: 8, eo: 7, rl: 3 },
        rewardType: "Controllo Petrolifero", rewardScale: 40, sensitivity: 8, baseExecutionTime: 21600,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }]
    },
    "ng_oil_industry": {
        id: "ng_oil_industry", name: "Industria Petrolifera Nigeriana", ipAddress: "196.3.0.0/16",
        category: "energy", req: { lso: 6, rc: 2.7, lcs: 4, an: 5, eo: 5, rl: 5 },
        rewardType: "Controllo Petrolifero Africano", rewardScale: 30, sensitivity: 6, baseExecutionTime: 9000,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 9 }]
    },
    "ng_banking_system": {
        id: "ng_banking_system", name: "Sistema Bancario Nigeriano", ipAddress: "41.184.0.0/16",
        category: "financial", req: { lso: 7, rc: 2.8, lcs: 5, an: 6, eo: 5, rl: 4 },
        rewardType: "Sistema Bancario Lagos", rewardScale: 15000, sensitivity: 6, baseExecutionTime: 7200,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 10 }]
    },
    "eg_suez_control": {
        id: "eg_suez_control", name: "Controllo Canale di Suez", ipAddress: "196.218.0.0/16",
        category: "transport", req: { lso: 8, rc: 3.1, lcs: 6, an: 7, eo: 6, rl: 3 },
        rewardType: "Controllo Canale Marittimo", rewardScale: 200, sensitivity: 8, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 14 }]
    },
    "eg_mukhabarat_hq": {
        id: "eg_mukhabarat_hq", name: "Mukhabarat Intelligence", ipAddress: "62.114.0.0/16",
        category: "government", req: { lso: 10, rc: 3.5, lcs: 8, an: 9, eo: 7, rl: 2 },
        rewardType: "Intelligence Egiziana", rewardScale: 20, sensitivity: 9, baseExecutionTime: 43200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 18 }]
    },
    "no_seed_vault": {
        id: "no_seed_vault", name: "Svalbard Seed Vault", ipAddress: "129.241.0.0/16",
        category: "industry", req: { lso: 7, rc: 2.9, lcs: 5, an: 6, eo: 5, rl: 4 },
        rewardType: "Database Semi Globali", rewardScale: 500, sensitivity: 6, baseExecutionTime: 12600,
        tier: 2,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 11 }]
    },
    "no_oil_platform": {
        id: "no_oil_platform", name: "Piattaforma Petrolifera Mare del Nord", ipAddress: "129.177.0.0/16",
        category: "energy", req: { lso: 9, rc: 3.4, lcs: 7, an: 8, eo: 7, rl: 3 },
        rewardType: "Controllo Piattaforma Off-shore", rewardScale: 35, sensitivity: 7, baseExecutionTime: 18000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 15 }]
    },
    "sg_port_authority": {
        id: "sg_port_authority", name: "Singapore Port Authority", ipAddress: "202.156.0.0/16",
        category: "transport", req: { lso: 10, rc: 3.6, lcs: 8, an: 9, eo: 8, rl: 2 },
        rewardType: "Controllo Porto Singapore", rewardScale: 3000, sensitivity: 8, baseExecutionTime: 25200,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 17 }]
    },
    "sg_mas_financial": {
        id: "sg_mas_financial", name: "Monetary Authority Singapore", ipAddress: "202.61.0.0/16",
        category: "financial", req: { lso: 11, rc: 3.9, lcs: 9, an: 10, eo: 9, rl: 1 },
        rewardType: "Controllo Monetario Singapore", rewardScale: 1200, sensitivity: 9, baseExecutionTime: 36000,
        tier: 3,
        unlock_conditions: [{ type: "PLAYER_LEVEL", value: 19 }, { type: "TALENT", value: "SQL_LV2" }]
    }
};
