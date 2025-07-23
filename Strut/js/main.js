// File: js/main.js
// VERSIONE AGGIORNATA: Aggiunto stato per i gruppi della botnet.

// --- STATO GLOBALE ---


let lines = [];
let startSocket = null;
const QUEST_CHECK_INTERVAL_MS = 15000;
const NEWS_TICKER_INTERVAL_MS = 8000;
const BTC_VALUE_UPDATE_INTERVAL_MS = 120000;

const appContainer = document.getElementById('app-container');
const btcBalanceEl = document.getElementById('btc-balance');
const xmrBalanceEl = document.getElementById('xmr-balance');
const talentPointsEl = document.getElementById('talent-points');
const resetButton = document.getElementById('reset-button');
const navButtons = document.querySelectorAll('.nav-btn');

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    let icon = 'fa-info-circle';
    if (type === 'error') icon = 'fa-exclamation-triangle';
    if (type === 'success') icon = 'fa-check-circle';
    notif.innerHTML = `<div class="flex items-center"><i class="fas ${icon} mr-3 text-lg"></i><p class="text-sm">${message}</p></div>`;
    container.appendChild(notif);
    setTimeout(() => { notif.remove(); }, 5000);
}

function saveState() {
    const { permanentFlows, ...gameState } = state;
    localStorage.setItem('hackerAppState', JSON.stringify(gameState));
    localStorage.setItem('hackerAppPermanentFlows', JSON.stringify(permanentFlows));
}

function loadState() {
    // Initialize state with the default game state if not already initialized
    if (!state || Object.keys(state).length === 0) {
        state = JSON.parse(JSON.stringify(initialGameState));
    }
    
    const savedState = localStorage.getItem('hackerAppState');
    const savedPermanentFlows = localStorage.getItem('hackerAppPermanentFlows');
    if (savedState) {
        try {
            const loadedState = JSON.parse(savedState);
            state = deepMerge(state, loadedState);
        } catch (e) {
            console.error("Errore nel parsing dello stato di gioco, reset in corso.", e);
            localStorage.removeItem('hackerAppState');
        }
    }
    if (savedPermanentFlows) {
        try {
            state.permanentFlows = JSON.parse(savedPermanentFlows);
        } catch (e) {
            console.error("Errore nel parsing dei flussi permanenti.", e);
            localStorage.removeItem('hackerAppPermanentFlows');
        }
    }
    initializeDynamicState();
}

function resetState() {
    if (confirm('Sei sicuro di voler resettare tutti i progressi? I flussi salvati come "permanenti" non verranno eliminati.')) {
        localStorage.removeItem('hackerAppState');
        window.location.reload();
    }
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (key in target && isObject(target[key])) {
                    output[key] = deepMerge(target[key], source[key]);
                } else {
                    output[key] = source[key];
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    return output;
}
function generateRandomIp() {
    return `${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
}
function refreshVpnIp(serviceId) {
    let serviceData, serviceState;
    let isClanService = false;
    let currency = 'XMR';
    let balance;
    const personalServiceData = marketData.networkServices.find(s => s.id === serviceId);
    if (personalServiceData && state.purchasedServices[serviceId]) {
        serviceData = personalServiceData;
        serviceState = state.purchasedServices[serviceId];
        balance = state.xmr;
    } 
    else if (state.clan && state.clan.infrastructure) {
        if (state.clan.infrastructure.c_vpn) {
            const clanVpnTier = state.clan.infrastructure.c_vpn.tier - 1;
            const clanVpnData = marketData.clanInfrastructure.c_vpn.tiers[clanVpnTier];
            if (clanVpnData && clanVpnData.id === serviceId) {
                serviceData = clanVpnData;
                serviceState = state.clan.infrastructure.c_vpn;
                isClanService = true;
                balance = state.clan.treasury;
                currency = 'BTC';
            }
        }
        if (!serviceData && state.clan.infrastructure.c_firewall) {
            const clanFirewallTier = state.clan.infrastructure.c_firewall.tier - 1;
            const clanFirewallData = marketData.clanInfrastructure.c_firewall.tiers[clanFirewallTier];
            if (clanFirewallData && clanFirewallData.id === serviceId) {
                serviceData = clanFirewallData;
                serviceState = state.clan.infrastructure.c_firewall;
                isClanService = true;
                balance = state.clan.treasury;
                currency = 'BTC';
            }
        }
    }
    if (!serviceData || !serviceState) {
        console.error("Servizio non trovato per il refresh IP:", serviceId);
        return;
    }
    const costXMR = serviceData.refreshCostXMR;
    const xmrToBtcRate = 0.0035; 
    const finalCost = isClanService ? costXMR * xmrToBtcRate : costXMR;
    if (balance < finalCost) {
        alert(`Fondi insufficienti. Costo: ${finalCost.toFixed(isClanService ? 6 : 0)} ${currency}.`);
        return;
    }
    if (confirm(`Vuoi spendere ${finalCost.toFixed(isClanService ? 6 : 0)} ${currency} per un nuovo IP per ${serviceData.name}?`)) {
        if (isClanService) {
            state.clan.treasury -= finalCost;
        } else {
            state.xmr -= finalCost;
        }
        delete state.ipTraceability[serviceState.currentIp];
        serviceState.currentIp = generateRandomIp();
        saveState();
        updateUI();
        if (state.activePage === 'hq') renderHqPage();
        if (state.activePage === 'profile' && state.activeProfileSection === 'clan') renderClanSection();
    }
}
async function updateBTCValue() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        if (!response.ok) throw new Error(`Errore API: ${response.statusText}`);
        const data = await response.json();
        if (data.bitcoin && data.bitcoin.usd) {
            state.btcValueInUSD = data.bitcoin.usd;
        }
    } catch (error) {
        console.error("Impossibile aggiornare il prezzo di BTC dall'API. Simulando fluttuazioni realistiche.", error);
        // Simulate realistic BTC price fluctuations instead of using fixed price
        simulateBTCPriceFluctuation();
    } finally {
        updateUI();
        if (state.activePage === 'market') renderMarket();
        if (state.activePage === 'hq') renderQuestBoard();
    }
}

function simulateBTCPriceFluctuation() {
    // Initialize with a realistic base price if not set
    if (!state.btcValueInUSD) {
        state.btcValueInUSD = 45000 + Math.random() * 20000; // Random between $45k-65k
    }
    
    // Simulate realistic price fluctuation (±2% typical daily volatility)
    const volatilityFactor = 0.02; // 2% max change per update
    const randomChange = (Math.random() - 0.5) * 2 * volatilityFactor; // -2% to +2%
    
    // Apply the change
    const newPrice = state.btcValueInUSD * (1 + randomChange);
    
    // Keep price within reasonable bounds ($20k - $100k)
    state.btcValueInUSD = Math.max(20000, Math.min(100000, newPrice));
    
    console.log(`BTC price simulated: $${state.btcValueInUSD.toFixed(2)}`);
}
function initializeDynamicState() {
    // Initialize real IP if not set
    if (!state.identity.realIp) {
        state.identity.realIp = generateRandomIp();
    }
    
    // Initialize currentActivity for existing botnet groups
    if (state.botnetGroups) {
        Object.keys(state.botnetGroups).forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group && !group.currentActivity) {
                group.currentActivity = 'Idle';
            }
        });
    }
    
    // Initialize IPs for purchased services
    for (const serviceId in state.purchasedServices) {
        if (state.purchasedServices[serviceId] && !state.purchasedServices[serviceId].currentIp) {
            const serviceData = marketData.networkServices.find(s => s.id === serviceId);
            state.purchasedServices[serviceId].currentIp = serviceData ? serviceData.ipAddress : generateRandomIp();
        }
    }
    
    // Initialize clan infrastructure
    if (state.clan && state.clan.infrastructure) {
        // Initialize VPN
        if (state.clan.infrastructure.c_vpn && !state.clan.infrastructure.c_vpn.currentIp) {
            const tier = state.clan.infrastructure.c_vpn.tier - 1;
            const vpnData = marketData.clanInfrastructure.c_vpn.tiers[tier];
            state.clan.infrastructure.c_vpn.currentIp = vpnData ? vpnData.ipAddress : generateRandomIp();
        }
        
        // Initialize Firewall
        if (state.clan.infrastructure.c_firewall && !state.clan.infrastructure.c_firewall.currentIp) {
             const tier = state.clan.infrastructure.c_firewall.tier - 1;
             const firewallData = marketData.clanInfrastructure.c_firewall.tiers[tier];
             state.clan.infrastructure.c_firewall.currentIp = firewallData ? firewallData.ipAddress : generateRandomIp();
        }
        
        // Initialize attachedFlows for all clan infrastructure
        Object.keys(state.clan.infrastructure).forEach(infraId => {
            const infra = state.clan.infrastructure[infraId];
            if (infra && infra.tier && marketData.clanInfrastructure[infraId]) {
                const infraData = marketData.clanInfrastructure[infraId];
                let tierData;
                
                if (infraData.tiers) {
                    tierData = infraData.tiers[infra.tier - 1];
                } else {
                    tierData = infraData;
                }
                
                if (tierData && tierData.flowSlots && !infra.attachedFlows) {
                    infra.attachedFlows = new Array(tierData.flowSlots).fill(null);
                }
            }
        });
        
        // Initialize attachedFlows for clan servers
        if (state.clan.infrastructure.servers) {
            state.clan.infrastructure.servers.forEach(server => {
                const serverData = marketData.clanInfrastructure.clanServer;
                if (serverData && serverData.flowSlots && !server.attachedFlows) {
                    server.attachedFlows = new Array(serverData.flowSlots).fill(null);
                }
            });
        }
    }
    
    // Ensure personalComputer has correct number of attachedFlows based on CPU cores
    if (!state.personalComputer || !state.personalComputer.attachedFlows) {
        const cores = state.hardware?.cpu?.cores || 4;
        state.personalComputer = {
            attachedFlows: new Array(cores).fill(null).map(() => ({
                flowName: null, 
                status: 'idle', 
                startTime: 0, 
                duration: 0
            }))
        };
    }
    
    // Ensure arrays are properly initialized
    if (!Array.isArray(state.news)) {
        state.news = [];
    }
    
    if (!Array.isArray(state.traceLogs)) {
        state.traceLogs = [];
    }
    
    if (!state.ownedHardware) {
        state.ownedHardware = {};
    }
    
    if (!state.purchasedServices) {
        state.purchasedServices = {};
    }
    
    if (!state.ipTraceability) {
        state.ipTraceability = {};
    }
    
    if (!state.permanentFlows) {
        state.permanentFlows = {};
    }
    
    if (typeof state.savedFlows !== 'object' || Array.isArray(state.savedFlows)) {
        state.savedFlows = {};
    }
    
    // Initialize dynamic countermeasures system
    if (typeof initializeDynamicTargetStates === 'function') {
        initializeDynamicTargetStates();
    }
}
function destroyLines() {
    lines.forEach(line => line.remove());
    lines = [];
}
async function switchPage(pageName) {
    if (!pageName) return;
    if (pageName === 'world' && !state.isWorldUnlocked) {
        appContainer.innerHTML = `<div class="text-center p-10"><h2 class="text-4xl font-bold text-red-500 mb-4">ACCESSO NEGATO</h2><p class="text-lg text-gray-400">Il cyber-spazio è vasto e sconosciuto.</p><p class="text-lg text-gray-400">Esegui una "Scansione Internet" dal tuo computer nell'HQ per mappare i primi obiettivi.</p></div>`;
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        return;
    }
    state.activePage = pageName;
    destroyLines();
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === pageName);
    });
    try {
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) throw new Error(`Pagina non trovata: ${pageName}.html`);
        appContainer.innerHTML = await response.text();
        switch (pageName) {
            case 'hq': initHqPage(); break;
            case 'profile': initProfilePage(); break;
            case 'editor': initEditorPage(); break;
            case 'world': initWorldPage(); break;
            case 'market': initMarketPage(); break;
            case 'botnet': initBotnetPage(); break;
            case 'dark_market': initDarkMarketPage(); break;
            case 'intelligence_console': initIntelligencePage(); break;
        }
    } catch (error) {
        console.error("Errore nel caricamento della pagina:", error);
        appContainer.innerHTML = `<p class="text-center text-red-500">Errore: Impossibile caricare la sezione ${pageName}.</p>`;
    }
    saveState();
}
function updateUI() {
    // Update legacy elements (if they exist)
    if (btcBalanceEl) btcBalanceEl.textContent = state.btc.toFixed(6);
    if (xmrBalanceEl) xmrBalanceEl.textContent = state.xmr;
    if (talentPointsEl) talentPointsEl.textContent = state.talentPoints;
    
    const btcValueEl = document.getElementById('btc-value');
    if (btcValueEl) {
        const btcValue = state.btcValueInUSD || 50000; // Default value if not set
        btcValueEl.textContent = `$${btcValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const playerLevelEl = document.getElementById('player-level');
    const playerXpEl = document.getElementById('player-xp');
    const playerXpNextEl = document.getElementById('player-xp-next');
    const playerXpFillEl = document.getElementById('player-xp-bar-fill');
    if (playerLevelEl) {
        playerLevelEl.textContent = state.level;
        playerXpEl.textContent = state.xp;
        playerXpNextEl.textContent = state.xpToNextLevel;
        playerXpFillEl.style.width = `${(state.xp / state.xpToNextLevel) * 100}%`;
    }
    const dynamicNavContainer = document.getElementById('dynamic-nav-container');
    if (dynamicNavContainer) {
        const existingBtn = dynamicNavContainer.querySelector('button');
        if (state.clan && state.clan.darkMarket) {
            if (!existingBtn) {
                dynamicNavContainer.innerHTML = `<button data-page="dark_market" class="nav-btn"><i class="fas fa-spider"></i><span>Dark Market</span></button>`;
                dynamicNavContainer.querySelector('button').addEventListener('click', () => switchPage('dark_market'));
            }
        } else {
            dynamicNavContainer.innerHTML = '';
        }
    }
    
    // Update sidebar information
    updateSidebarInfo();
    updateActivityIndicators();
    
    if (typeof updateAdminPanelUI === 'function') {
        updateAdminPanelUI();
    }
}
function addXp(amount, target = 'player') {
    if (target === 'player') {
        state.xp += amount;
        while (state.xp >= state.xpToNextLevel) {
            state.level++;
            state.xp -= state.xpToNextLevel;
            state.xpToNextLevel = Math.floor(state.xpToNextLevel * 1.5);
            state.talentPoints += 1;
        }
    } else if (target === 'clan' && state.clan) {
        state.clan.xp += amount;
        while (state.clan.xp >= state.clan.xpToNextLevel) {
            state.clan.level++;
            state.clan.xp -= state.clan.xpToNextLevel;
            state.clan.xpToNextLevel = Math.floor(state.clan.xpToNextLevel * 2);
        }
        if (state.activePage === 'profile' && state.activeProfileSection === 'clan') {
            renderClanSection();
        }
    }
    updateUI();
    checkTargetUnlocks();
}
function updateAllBonuses() {
    state.hardwareBonuses = { studyTimeModifier: 1, toolStatModifiers: { rc: 0, eo: 0, an: 0, rl: 0 } };
    state.clanBonuses = { studyTimeModifier: 1, toolStatModifiers: { rc: 0, eo: 0, an: 0, rl: 0 } };
    const allPersonalItems = [...marketData.personalHardware, ...marketData.personalInfrastructure, ...marketData.networkServices];
    for (const itemId in state.ownedHardware) {
        if (state.ownedHardware[itemId]) {
            const item = allPersonalItems.find(i => i.id === itemId);
            if (item && item.bonus) {
                if (item.bonus.type === 'studyTime') state.hardwareBonuses.studyTimeModifier *= item.bonus.value;
                else if (item.bonus.type === 'toolStat') {
                    state.hardwareBonuses.toolStatModifiers[item.bonus.stat] += item.bonus.value;
                }
            }
        }
    }
    if (state.clan) {
        for (const infraId in state.clan.infrastructure) {
            const infraState = state.clan.infrastructure[infraId];
            if (infraId === 'servers') continue;
            const infraData = marketData.clanInfrastructure[infraId];
            if (infraState && infraData && infraData.tiers) {
                const currentTier = infraData.tiers[infraState.tier - 1];
                if (currentTier && currentTier.bonus) {
                   if (currentTier.bonus.type === 'studyTime') state.clanBonuses.studyTimeModifier *= currentTier.bonus.value;
                   else if (currentTier.bonus.type === 'toolStat') {
                       state.clanBonuses.toolStatModifiers[currentTier.bonus.stat] += currentTier.bonus.value;
                   }
                }
            }
        }
    }
}
function updateClanEcosystemScore() {
    if (!state.clan) return;
    let securityScore = 0;
    let capacityScore = 0;
    for (const infraId in state.clan.infrastructure) {
        const infraState = state.clan.infrastructure[infraId];
        if (infraId === 'servers') {
            const serverData = marketData.clanInfrastructure.clanServer;
            const serverCount = infraState.length;
            securityScore += serverData.points.security * serverCount;
            capacityScore += serverData.points.capacity * serverCount;
        } else {
            const infraData = marketData.clanInfrastructure[infraId];
            if (infraData && infraData.tiers) {
                const currentTier = infraData.tiers[infraState.tier - 1];
                if (currentTier && currentTier.points) {
                    securityScore += currentTier.points.security || 0;
                    capacityScore += currentTier.points.capacity || 0;
                }
            }
        }
    }
    state.clan.ecosystem = {
        security: securityScore,
        capacity: capacityScore,
        total: securityScore + capacityScore
    };
    if (state.activePage === 'profile' && state.activeProfileSection === 'clan') {
        renderClanSection();
    }
}
function findTalentByName(talentName) {
    for (const branchName in talentData) {
        if (talentData[branchName].talents[talentName]) {
            return talentData[branchName].talents[talentName];
        }
    }
    return null;
}
function checkStudyProgress() {
    let changed = false;
    const talentModal = document.getElementById('talent-modal');
    const isModalOpen = talentModal && !talentModal.classList.contains('hidden');
    const currentOpenTalent = isModalOpen ? talentModal.querySelector('#modal-title')?.textContent : null;
    for (const levelId in state.studying) {
        const study = state.studying[levelId];
        const elapsed = Date.now() - study.startTime;
        const progress = Math.min(100, (elapsed / study.duration) * 100);
        const progressBar = document.getElementById(`progress-${levelId}`);
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (elapsed >= study.duration) {
            const [talentName] = levelId.split('-');
            state.unlocked[talentName] = (state.unlocked[talentName] || 0) + 1;
            delete state.studying[levelId];
            changed = true;
        }
    }
    if (changed) {
        saveState();
        checkTargetUnlocks();
        if (state.activePage === 'profile') {
            renderTalentTree(); 
            if (state.activeProfileSection === 'talents' && currentOpenTalent) {
                const talent = findTalentByName(currentOpenTalent);
                if (talent) openTalentModal(currentOpenTalent, talent);
            }
        }
        if (state.activePage === 'editor') {
            renderToolbox();
        }
    }
}
function checkTargetUnlocks() {
    let newlyDiscovered = false;
    Object.values(worldTargets).forEach(target => {
        if (state.discoveredTargets.includes(target.id)) {
            return;
        }
        const allConditionsMet = target.unlock_conditions.every(condition => {
            switch (condition.type) {
                case 'PLAYER_LEVEL':
                    return state.level >= condition.value;
                case 'TALENT':
                    const [talentName, levelStr] = condition.value.split('_LV');
                    const requiredLevel = parseInt(levelStr, 10);
                    return (state.unlocked[talentName] || 0) >= requiredLevel;
                default:
                    return false;
            }
        });
        if (allConditionsMet) {
            state.discoveredTargets.push(target.id);
            newlyDiscovered = true;
            console.log(`Nuovo target scoperto: ${target.name}!`);
        }
    });
    if (newlyDiscovered && state.activePage === 'world') {
        initWorldPage();
    }
}
// Lateral Menu Functionality
function initLateralMenu() {
    const lateralMenu = document.getElementById('lateral-menu');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    
    // Toggle menu function
    function toggleMenu() {
        lateralMenu.classList.toggle('expanded');
        
        // Update toggle button icon
        const toggleIcon = menuToggle.querySelector('i');
        if (lateralMenu.classList.contains('expanded')) {
            toggleIcon.className = 'fas fa-times';
        } else {
            toggleIcon.className = 'fas fa-chevron-right';
        }
    }
    
    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!lateralMenu.contains(e.target) && lateralMenu.classList.contains('expanded')) {
                lateralMenu.classList.remove('expanded');
                menuToggle.querySelector('i').className = 'fas fa-chevron-right';
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lateralMenu.classList.contains('expanded')) {
            toggleMenu();
        }
    });
    
    // Setup navigation buttons in sidebar
    lateralMenu.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            switchPage(button.dataset.page);
            // Close menu on mobile after navigation
            if (window.innerWidth <= 768) {
                lateralMenu.classList.remove('expanded');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    });
    
    // Setup reset button in sidebar
    const sidebarResetButton = lateralMenu.querySelector('#reset-button');
    if (sidebarResetButton) {
        sidebarResetButton.addEventListener('click', resetState);
    }
}

// Update sidebar information
function updateSidebarInfo() {
    // Update collapsed info
    const sidebarLevel = document.getElementById('sidebar-player-level');
    const sidebarPlayerName = document.getElementById('sidebar-player-name');
    const sidebarBtcBalance = document.getElementById('sidebar-btc-balance');
    const sidebarXmrBalance = document.getElementById('sidebar-xmr-balance');
    
    if (sidebarLevel) sidebarLevel.textContent = state.level || 1;
    if (sidebarPlayerName) sidebarPlayerName.textContent = state.playerName || 'Hacker';
    if (sidebarBtcBalance) sidebarBtcBalance.textContent = Math.floor(state.btc || 0);
    if (sidebarXmrBalance) sidebarXmrBalance.textContent = Math.floor(state.xmr || 0);
    
    // Update expanded info
    const sidebarExpandedLevel = document.getElementById('sidebar-expanded-player-level');
    const sidebarPlayerXp = document.getElementById('sidebar-player-xp');
    const sidebarPlayerXpNext = document.getElementById('sidebar-player-xp-next');
    const sidebarPlayerXpBarFill = document.getElementById('sidebar-player-xp-bar-fill');
    const sidebarBtcValue = document.getElementById('sidebar-btc-value');
    const sidebarExpandedBtcBalance = document.getElementById('sidebar-expanded-btc-balance');
    const sidebarExpandedXmrBalance = document.getElementById('sidebar-expanded-xmr-balance');
    const sidebarTalentPoints = document.getElementById('sidebar-talent-points');
    
    if (sidebarExpandedLevel) sidebarExpandedLevel.textContent = state.level || 1;
    if (sidebarPlayerXp) sidebarPlayerXp.textContent = state.xp || 0;
    if (sidebarPlayerXpNext) sidebarPlayerXpNext.textContent = state.xpToNextLevel || 100;
    if (sidebarBtcValue) sidebarBtcValue.textContent = `$${(state.btcValueInUSD || 50000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (sidebarExpandedBtcBalance) sidebarExpandedBtcBalance.textContent = Math.floor(state.btc || 0);
    if (sidebarExpandedXmrBalance) sidebarExpandedXmrBalance.textContent = Math.floor(state.xmr || 0);
    if (sidebarTalentPoints) sidebarTalentPoints.textContent = state.talentPoints || 0;
    
    // Update XP bar
    if (sidebarPlayerXpBarFill) {
        const xpPercentage = ((state.xp || 0) / (state.xpToNextLevel || 100)) * 100;
        sidebarPlayerXpBarFill.style.width = `${Math.min(xpPercentage, 100)}%`;
    }
}

// Update activity indicators
function updateActivityIndicators() {
    const miningIndicator = document.getElementById('mining-indicator');
    const ddosIndicator = document.getElementById('ddos-indicator');
    const attackIndicator = document.getElementById('attack-indicator');
    
    // Collapsed indicators
    const collapsedMiningIndicator = document.getElementById('collapsed-mining-indicator');
    const collapsedDdosIndicator = document.getElementById('collapsed-ddos-indicator');
    const collapsedAttackIndicator = document.getElementById('collapsed-attack-indicator');
    
    // Check for active mining
    let isMiningActive = false;
    if (typeof activeMiningOperation !== 'undefined' && activeMiningOperation) {
        isMiningActive = true;
    }
    
    // Check for active DDoS attacks
    let isDDoSActive = false;
    if (typeof activeDDoSAttacks !== 'undefined' && activeDDoSAttacks && activeDDoSAttacks.length > 0) {
        isDDoSActive = true;
    }
    
    // Check for active attacks (from world module)
    let isAttackActive = false;
    if (state.activeAttacks && state.activeAttacks.length > 0) {
        isAttackActive = true;
    }
    
    // Update expanded indicators
    if (miningIndicator) {
        if (isMiningActive) {
            miningIndicator.classList.remove('hidden');
        } else {
            miningIndicator.classList.add('hidden');
        }
    }
    
    if (ddosIndicator) {
        if (isDDoSActive) {
            ddosIndicator.classList.remove('hidden');
        } else {
            ddosIndicator.classList.add('hidden');
        }
    }
    
    if (attackIndicator) {
        if (isAttackActive) {
            attackIndicator.classList.remove('hidden');
        } else {
            attackIndicator.classList.add('hidden');
        }
    }
    
    // Update collapsed indicators
    if (collapsedMiningIndicator) {
        if (isMiningActive) {
            collapsedMiningIndicator.classList.remove('hidden');
        } else {
            collapsedMiningIndicator.classList.add('hidden');
        }
    }
    
    if (collapsedDdosIndicator) {
        if (isDDoSActive) {
            collapsedDdosIndicator.classList.remove('hidden');
        } else {
            collapsedDdosIndicator.classList.add('hidden');
        }
    }
    
    if (collapsedAttackIndicator) {
        if (isAttackActive) {
            collapsedAttackIndicator.classList.remove('hidden');
        } else {
            collapsedAttackIndicator.classList.add('hidden');
        }
    }
}

function init() {
    loadState();
    updateAllBonuses();
    updateUI();
    
    // Initialize lateral menu
    initLateralMenu();
    
    // Keep legacy navigation support for any remaining elements
    document.querySelectorAll('nav .nav-btn').forEach(button => {
        button.addEventListener('click', () => switchPage(button.dataset.page));
    });
    resetButton.addEventListener('click', resetState);
    switchPage(state.activePage || 'hq');
    initAdminPanel();
    setInterval(() => {
        checkStudyProgress();
        if (typeof updateActiveAttacks === 'function') {
            updateActiveAttacks();
        }
        if (typeof updatePersonalComputer === 'function') {
            updatePersonalComputer();
        }
        if (typeof processMiningRewards === 'function') {
            processMiningRewards();
        }
        if (typeof updateMiningUI === 'function') {
            updateMiningUI();
        }
        
        // Update sidebar info and activity indicators
        updateSidebarInfo();
        updateActivityIndicators();
    }, 1000);
    initQuestSystem();
    setInterval(() => {
        if (typeof manageQuests === 'function') {
            manageQuests();
        }
    }, QUEST_CHECK_INTERVAL_MS);
    setInterval(() => {
        if (typeof updateNewsTicker === 'function') {
            updateNewsTicker();
        }
    }, NEWS_TICKER_INTERVAL_MS);
    updateBTCValue();
    setInterval(() => {
        updateBTCValue();
    }, BTC_VALUE_UPDATE_INTERVAL_MS);
}
document.addEventListener('DOMContentLoaded', init);
