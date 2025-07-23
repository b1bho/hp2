/**
 * js/world_data.js
 * VERSIONE AGGIORNATA: Contiene nuove nazioni e l'assegnazione dei nuovi target.
 */
const worldData = {
    // Nazioni Esistenti Aggiornate
    "USA": {
        "lat": 39.8283, "lon": -98.5795, "flag": "🇺🇸", "security": 90, "economy": 95, "alignment": "White Hat",
        "targets": ["usa_pentagon", "usa_wallstreet", "usa_faa_atc", "generic_swift_node", "generic_regional_bank", "generic_power_plant", "generic_isp", "generic_hospital", "generic_population", "generic_data_center", "generic_university", "generic_research_lab", "generic_stock_exchange", "generic_airport_control"]
    },
    "Regno Unito": {
        "lat": 55.3781, "lon": -3.4360, "flag": "🇬🇧", "security": 85, "economy": 80, "alignment": "Grey Hat",
        "targets": ["uk_mi6", "generic_hospital", "generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_data_center", "generic_university", "generic_stock_exchange", "generic_court_system"]
    },
    "Italia": {
        "lat": 41.8719, "lon": 12.5674, "flag": "🇮🇹", "security": 65, "economy": 70, "alignment": "Grey Hat",
        "targets": ["it_gov", "it_telecom", "generic_regional_bank", "generic_power_plant", "generic_population", "generic_university", "generic_municipality", "generic_logistics_hub", "generic_tourism_system"]
    },
    "Germania": {
        "lat": 51.1657, "lon": 10.4515, "flag": "🇩🇪", "security": 85, "economy": 93, "alignment": "White Hat",
        "targets": ["de_datacenter_frankfurt", "de_automotive_scada", "generic_regional_bank", "generic_power_plant", "generic_isp", "generic_pharma_lab", "generic_population", "generic_university", "generic_data_center", "generic_research_lab", "generic_manufacturing_plant"]
    },
    "Russia": {
        "lat": 61.5240, "lon": 105.3188, "flag": "🇷🇺", "security": 89, "economy": 75, "alignment": "Black Hat",
        "targets": ["ru_kremlin", "ru_gazprom", "generic_regional_bank", "generic_isp", "generic_population", "generic_power_plant", "generic_military_base", "generic_data_center"]
    },
    "Svizzera": {
        "lat": 46.8182, "lon": 8.2275, "flag": "🇨🇭", "security": 94, "economy": 96, "alignment": "White Hat",
        "targets": ["ch_swiss_banks", "ch_cern", "generic_pharma_lab", "generic_who_database", "generic_population", "generic_regional_bank", "generic_data_center", "generic_research_lab"]
    },
    "Cina": {
        "lat": 35.8617, "lon": 104.1954, "flag": "🇨🇳", "security": 92, "economy": 98, "alignment": "Black Hat",
        "targets": ["cn_gfw", "cn_shanghai_port", "cn_bank_of_china", "generic_power_plant", "generic_isp", "generic_population", "generic_manufacturing_plant", "generic_data_center", "generic_university"]
    },
    "Giappone": {
        "lat": 36.2048, "lon": 138.2529, "flag": "🇯🇵", "security": 88, "economy": 92, "alignment": "White Hat",
        "targets": ["jp_tokyo_stock_exchange", "jp_shinkansen_control", "generic_regional_bank", "generic_isp", "generic_population", "generic_research_lab", "generic_manufacturing_plant", "generic_data_center"]
    },
    "Francia": {
        "lat": 46.2276, "lon": 2.2137, "flag": "🇫🇷", "security": 84, "economy": 88, "alignment": "Grey Hat",
        "targets": ["fr_dgse_hq", "fr_nuclear_plant", "generic_regional_bank", "generic_isp", "generic_population", "generic_university", "generic_data_center", "generic_research_lab", "generic_tourism_system"]
    },
    "Canada": {
        "lat": 56.1304, "lon": -106.3468, "flag": "🇨🇦", "security": 86, "economy": 87, "alignment": "White Hat",
        "targets": ["ca_hydro_dam", "ca_csis_hq", "generic_regional_bank", "generic_isp", "generic_population", "generic_university", "generic_data_center", "generic_research_lab"]
    },
    "Brasile": {
        "lat": -14.2350, "lon": -51.9253, "flag": "🇧🇷", "security": 55, "economy": 65, "alignment": "Grey Hat",
        "targets": ["br_election_system", "generic_regional_bank", "generic_power_plant", "generic_population"]
    },
    "India": {
        "lat": 20.5937, "lon": 78.9629, "flag": "🇮🇳", "security": 68, "economy": 88, "alignment": "Grey Hat",
        "targets": ["in_aadhaar_db", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Israele": {
        "lat": 31.0461, "lon": 34.8516, "flag": "🇮🇱", "security": 95, "economy": 85, "alignment": "Grey Hat",
        "targets": ["il_mossad_hq", "il_iron_dome", "generic_isp", "generic_population"]
    },
    "Arabia Saudita": {
        "lat": 23.8859, "lon": 45.0792, "flag": "🇸🇦", "security": 78, "economy": 94, "alignment": "Black Hat",
        "targets": ["sa_aramco_refinery", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Turchia": {
        "lat": 38.9637, "lon": 35.2433, "flag": "🇹🇷", "security": 72, "economy": 65, "alignment": "Grey Hat",
        "targets": ["tr_bayraktar_hq", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Sudafrica": {
        "lat": -30.5595, "lon": 22.9375, "flag": "🇿🇦", "security": 50, "economy": 62, "alignment": "Grey Hat",
        "targets": ["za_eskom_grid", "generic_regional_bank", "generic_population"]
    },
    "Australia": {
        "lat": -25.2744, "lon": 133.7751, "flag": "🇦🇺", "security": 82, "economy": 85, "alignment": "White Hat",
        "targets": ["au_mining_corp", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Corea del Sud": {
        "lat": 35.9078, "lon": 127.7669, "flag": "🇰🇷", "security": 91, "economy": 90, "alignment": "White Hat",
        "targets": ["sk_samsung_rd", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Taiwan": {
        "lat": 23.6978, "lon": 120.9605, "flag": "🇹🇼", "security": 88, "economy": 92, "alignment": "White Hat",
        "targets": ["tw_tsmc_fab", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Iran": {
        "lat": 32.4279, "lon": 53.6880, "flag": "🇮🇷", "security": 75, "economy": 50, "alignment": "Black Hat",
        "targets": ["ir_nuclear_program", "generic_isp", "generic_population"]
    },
    
    // Nazioni Nuove
    "Paesi Bassi": {
        "lat": 52.1326, "lon": 5.2913, "flag": "🇳🇱", "security": 87, "economy": 91, "alignment": "White Hat",
        "targets": ["nl_port_rotterdam", "nl_asml_hq", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Svezia": {
        "lat": 60.1282, "lon": 18.6435, "flag": "🇸🇪", "security": 88, "economy": 91, "alignment": "White Hat",
        "targets": ["se_saab_defence", "se_bankid_system", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Spagna": {
        "lat": 40.4637, "lon": -3.7492, "flag": "🇪🇸", "security": 70, "economy": 75, "alignment": "Grey Hat",
        "targets": ["es_cni_intel", "es_tourism_db", "generic_regional_bank", "generic_power_plant", "generic_population"]
    },
    "Messico": {
        "lat": 23.6345, "lon": -102.5528, "flag": "🇲🇽", "security": 52, "economy": 68, "alignment": "Grey Hat",
        "targets": ["mx_cartel_comms", "mx_pemex_oil", "generic_regional_bank", "generic_population"]
    },
    "Nigeria": {
        "lat": 9.0820, "lon": 8.6753, "flag": "🇳🇬", "security": 40, "economy": 60, "alignment": "Grey Hat",
        "targets": ["ng_oil_industry", "ng_banking_system", "generic_power_plant", "generic_population"]
    },
    "Egitto": {
        "lat": 26.8206, "lon": 30.8025, "flag": "🇪🇬", "security": 60, "economy": 55, "alignment": "Black Hat",
        "targets": ["eg_suez_control", "eg_mukhabarat_hq", "generic_isp", "generic_population"]
    },
    "Norvegia": {
        "lat": 60.4720, "lon": 8.4689, "flag": "🇳🇴", "security": 89, "economy": 93, "alignment": "White Hat",
        "targets": ["no_seed_vault", "no_oil_platform", "generic_regional_bank", "generic_isp", "generic_population"]
    },
    "Singapore": {
        "lat": 1.3521, "lon": 103.8198, "flag": "🇸🇬", "security": 93, "economy": 97, "alignment": "Grey Hat",
        "targets": ["sg_port_authority", "sg_mas_financial", "generic_swift_node", "generic_isp", "generic_population"]
    },
    "Emirati Arabi Uniti": {
        "lat": 23.4241, "lon": 53.8478, "flag": "🇦🇪", "security": 80, "economy": 95, "alignment": "Grey Hat",
        "targets": ["ae_burj_khalifa_scada", "ae_dubai_financial_market", "generic_isp", "generic_population"]
    },
    "Corea del Nord": {
        "lat": 40.3399, "lon": 127.5101, "flag": "🇰🇵", "security": 85, "economy": 30, "alignment": "Black Hat",
        "targets": ["kp_bureau_121", "kp_national_intranet", "generic_population"]
    },

    // === ADDITIONAL COUNTRIES ===
    "Argentina": {
        "lat": -38.4161, "lon": -63.6167, "flag": "🇦🇷", "security": 55, "economy": 62, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_university", "generic_logistics_hub"]
    },
    "Belgio": {
        "lat": 50.5039, "lon": 4.4699, "flag": "🇧🇪", "security": 82, "economy": 87, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_isp", "generic_data_center", "generic_population", "generic_pharma_lab"]
    },
    "Cile": {
        "lat": -35.6751, "lon": -71.5430, "flag": "🇨🇱", "security": 64, "economy": 70, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_mining_corp", "generic_population", "generic_logistics_hub"]
    },
    "Danimarca": {
        "lat": 55.6761, "lon": 12.5683, "flag": "🇩🇰", "security": 88, "economy": 90, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_isp", "generic_data_center", "generic_population", "generic_pharma_lab", "generic_research_lab"]
    },
    "Estonia": {
        "lat": 58.5953, "lon": 25.0136, "flag": "🇪🇪", "security": 85, "economy": 78, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_isp", "generic_data_center", "generic_population", "generic_government_portal"]
    },
    "Finlandia": {
        "lat": 61.9241, "lon": 25.7482, "flag": "🇫🇮", "security": 89, "economy": 88, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_isp", "generic_data_center", "generic_population", "generic_research_lab", "generic_pharma_lab"]
    },
    "Grecia": {
        "lat": 39.0742, "lon": 21.8243, "flag": "🇬🇷", "security": 68, "economy": 65, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_logistics_hub"]
    },
    "Hong Kong": {
        "lat": 22.3193, "lon": 114.1694, "flag": "🇭🇰", "security": 83, "economy": 95, "alignment": "Grey Hat",
        "targets": ["generic_swift_node", "generic_regional_bank", "generic_isp", "generic_population", "generic_data_center", "generic_stock_exchange"]
    },
    "Islanda": {
        "lat": 64.9631, "lon": -19.0208, "flag": "🇮🇸", "security": 87, "economy": 82, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_isp", "generic_data_center", "generic_population", "generic_research_lab"]
    },
    "Irlanda": {
        "lat": 53.1424, "lon": -7.6921, "flag": "🇮🇪", "security": 84, "economy": 89, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_isp", "generic_data_center", "generic_population", "generic_pharma_lab", "generic_social_network"]
    },
    "Kenya": {
        "lat": -0.0236, "lon": 37.9062, "flag": "🇰🇪", "security": 48, "economy": 55, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_mobile_money"]
    },
    "Lussemburgo": {
        "lat": 49.8153, "lon": 6.1296, "flag": "🇱🇺", "security": 91, "economy": 96, "alignment": "White Hat",
        "targets": ["generic_swift_node", "generic_regional_bank", "generic_isp", "generic_population", "generic_data_center"]
    },
    "Malesia": {
        "lat": 4.2105, "lon": 101.9758, "flag": "🇲🇾", "security": 62, "economy": 74, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_logistics_hub", "generic_palm_oil_plantation"]
    },
    "Nuova Zelanda": {
        "lat": -40.9006, "lon": 174.8860, "flag": "🇳🇿", "security": 80, "economy": 76, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_agriculture_system"]
    },
    "Polonia": {
        "lat": 51.9194, "lon": 19.1451, "flag": "🇵🇱", "security": 74, "economy": 73, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_manufacturing_plant", "generic_logistics_hub"]
    },
    "Portogallo": {
        "lat": 39.3999, "lon": -8.2245, "flag": "🇵🇹", "security": 72, "economy": 71, "alignment": "White Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_tourism_system"]
    },
    "Qatar": {
        "lat": 25.3548, "lon": 51.1839, "flag": "🇶🇦", "security": 79, "economy": 92, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_oil_refinery", "generic_sports_venue"]
    },
    "Romania": {
        "lat": 45.9432, "lon": 24.9668, "flag": "🇷🇴", "security": 66, "economy": 69, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_manufacturing_plant"]
    },
    "Thailandia": {
        "lat": 15.8700, "lon": 100.9925, "flag": "🇹🇭", "security": 58, "economy": 68, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_tourism_system", "generic_logistics_hub"]
    },
    "Ucraina": {
        "lat": 48.3794, "lon": 31.1656, "flag": "🇺🇦", "security": 45, "economy": 52, "alignment": "Grey Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_government_portal", "generic_military_communications"]
    },
    "Venezuela": {
        "lat": 6.4238, "lon": -66.5897, "flag": "🇻🇪", "security": 38, "economy": 35, "alignment": "Black Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_oil_refinery"]
    },
    "Vietnam": {
        "lat": 14.0583, "lon": 108.2772, "flag": "🇻🇳", "security": 59, "economy": 71, "alignment": "Black Hat",
        "targets": ["generic_regional_bank", "generic_power_plant", "generic_isp", "generic_population", "generic_manufacturing_plant", "generic_logistics_hub"]
    }
};
