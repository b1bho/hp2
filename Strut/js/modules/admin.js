// File: js/modules/admin.js
// VERSIONE AGGIORNATA: Aggiunta la funzione per impostare un livello specifico.

function setAdminValues() {
    const btc = parseInt(document.getElementById('admin-btc').value, 10);
    const xmr = parseInt(document.getElementById('admin-xmr').value, 10);
    const talents = parseInt(document.getElementById('admin-talents').value, 10);

    if (!isNaN(btc)) state.btc = btc;
    if (!isNaN(xmr)) state.xmr = xmr;
    if (!isNaN(talents)) state.talentPoints = talents;

    updateUI();
    saveState();
    alert('Valori admin impostati!');
}

function unlockAllTalents() {
    if (!confirm('Sei sicuro di voler sbloccare tutti i talenti?')) return;

    for (const branchName in talentData) {
        const branch = talentData[branchName];
        for (const talentName in branch.talents) {
            const talent = branch.talents[talentName];
            state.unlocked[talentName] = talent.levels.length;
        }
    }
    
    state.studying = {};
    saveState();
    
    if (state.activePage === 'profile') initProfilePage();
    if (state.activePage === 'editor') initEditorPage();
    alert('Tutti i talenti sono stati sbloccati!');
}

function unlockAllMarketItems() {
    if (!confirm('Sei sicuro di voler sbloccare tutti gli oggetti del mercato?')) return;
    
    marketData.personalHardware.forEach(item => state.ownedHardware[item.id] = true);
    marketData.personalInfrastructure.forEach(item => state.ownedHardware[item.id] = true);

    if (state.clan) {
        for(const infraId in marketData.clanInfrastructure) {
            const maxTier = marketData.clanInfrastructure[infraId].tiers.length;
            state.clan.infrastructure[infraId] = { tier: maxTier, attachedFlows: [] };
        }
    }

    updateAllBonuses();
    saveState();

    if (state.activePage === 'market') initMarketPage();
    if (state.activePage === 'hq') initHqPage();
    if (state.activePage === 'profile' && state.activeProfileSection === 'clan') renderClanSection();
    
    alert('Tutti gli oggetti del mercato sono stati sbloccati!');
}

function resetQuests() {
    if (!confirm('Sei sicuro di voler resettare lo stato di tutte le missioni? Le missioni completate e annullate torneranno disponibili.')) return;

    state.completedQuests = [];
    state.intelItems = [];
    state.activeQuests = [];

    saveState();

    if (typeof manageQuests === 'function') {
        manageQuests();
    }
    
    alert('Stato delle missioni resettato!');
}

function resetBotnet() {
    if (!confirm('Sei sicuro di voler resettare completamente la botnet? Tutti gli host infetti e i gruppi verranno eliminati permanentemente.')) return;

    // Reset del pool di host infetti
    const hostsCount = state.infectedHostPool.length;
    state.infectedHostPool = [];

    // Reset dei gruppi botnet
    const groupsCount = Object.keys(state.botnetGroups).length;
    state.botnetGroups = {};

    // Reset eventuali statistiche aggregate della botnet
    if (state.botnetStats) {
        state.botnetStats = {
            totalHostsInfected: 0,
            totalAttacksLaunched: 0,
            totalDataExfiltrated: 0
        };
    }

    // Salva lo stato e aggiorna l'interfaccia
    saveState();
    
    // Aggiorna la pagina botnet se è attiva
    if (state.activePage === 'botnet' && typeof initBotnetPage === 'function') {
        initBotnetPage();
    }
    
    // Aggiorna l'interfaccia generale
    if (typeof updateUI === 'function') {
        updateUI();
    }

    showNotification(`Botnet resettata! Eliminati ${hostsCount} host e ${groupsCount} gruppi.`, 'success');
    alert(`Botnet resettata con successo!\n- Host eliminati: ${hostsCount}\n- Gruppi eliminati: ${groupsCount}`);
}

function adminLevelUp() {
    const xpNeeded = state.xpToNextLevel - state.xp;
    addXp(xpNeeded, 'player');
    alert(`Livello aumentato a ${state.level}!`);
    updateAdminPanelUI();
}

// --- NUOVA FUNZIONE ---
function adminSetLevel() {
    const targetLevelInput = document.getElementById('admin-level');
    if (!targetLevelInput) return;

    const targetLevel = parseInt(targetLevelInput.value, 10);
    if (isNaN(targetLevel) || targetLevel <= state.level) {
        alert("Inserisci un livello valido e superiore a quello attuale.");
        return;
    }

    // Controllo di sicurezza per evitare livelli eccessivamente alti
    if (targetLevel > state.level + 100) {
        alert("Per sicurezza, non è possibile aumentare più di 100 livelli alla volta.");
        return;
    }

    // Disabilita il bottone durante il processo per evitare click multipli
    const setLevelBtn = document.getElementById('admin-set-level');
    if (setLevelBtn) setLevelBtn.disabled = true;

    showNotification(`Impostazione livello in corso... (${state.level} → ${targetLevel})`, 'info');

    // Esegue il level up graduale con timeout per evitare il blocco del browser
    adminLevelUpProgressive(targetLevel, setLevelBtn);
}

function adminLevelUpProgressive(targetLevel, button) {
    if (state.level >= targetLevel) {
        // Completato
        alert(`Livello impostato con successo a ${state.level}!`);
        updateAdminPanelUI();
        if (button) button.disabled = false;
        showNotification(`Livello raggiunto: ${state.level}`, 'success');
        return;
    }

    // Level up di un singolo livello
    const xpNeeded = (state.nextLevelXp || state.xpToNextLevel || 100) - (state.xp || 0);
    addXp(xpNeeded, 'player');
    
    // Mostra progresso ogni 5 livelli
    if (state.level % 5 === 0) {
        showNotification(`Livello raggiunto: ${state.level}/${targetLevel}`, 'info');
    }

    // Continua con il prossimo livello dopo un piccolo timeout
    setTimeout(() => {
        adminLevelUpProgressive(targetLevel, button);
    }, 10); // 10ms di pausa per non bloccare l'interfaccia
}
// --- FINE NUOVA FUNZIONE ---

function updateAdminPanelUI() {
    const adminBtcInput = document.getElementById('admin-btc');
    const adminXmrInput = document.getElementById('admin-xmr');
    const adminTalentsInput = document.getElementById('admin-talents');
    const adminLevelInput = document.getElementById('admin-level');

    if(adminBtcInput) adminBtcInput.value = state.btc;
    if(adminXmrInput) adminXmrInput.value = state.xmr;
    if(adminTalentsInput) adminTalentsInput.value = state.talentPoints;
    if(adminLevelInput) adminLevelInput.value = state.level;
}

function initAdminPanel() {
    // Fix property name inconsistency in the game state
    if (state.nextLevelXp && !state.xpToNextLevel) {
        state.xpToNextLevel = state.nextLevelXp;
    }
    if (isNaN(state.xp) || state.xp === null || state.xp === undefined) {
        state.xp = 0;
    }
    
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.innerHTML = `
        <button id="toggle-admin-panel" class="absolute -left-8 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-l-md hover:bg-indigo-700">
            <i class="fas fa-cogs"></i>
        </button>
        <h3 class="text-lg font-bold text-indigo-400 mb-4 text-center">Pannello Admin</h3>
        <div class="space-y-3">
            <div>
                <label for="admin-btc" class="block text-sm font-medium text-gray-300">BTC</label>
                <input type="number" id="admin-btc" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white">
            </div>
            <div>
                <label for="admin-xmr" class="block text-sm font-medium text-gray-300">XMR</label>
                <input type="number" id="admin-xmr" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white">
            </div>
            <div>
                <label for="admin-talents" class="block text-sm font-medium text-gray-300">Punti Talento</label>
                <input type="number" id="admin-talents" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white">
            </div>
            <button id="admin-set-values" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700">Imposta Valori</button>
            
            <!-- NUOVA SEZIONE LIVELLO -->
            <div>
                <label for="admin-level" class="block text-sm font-medium text-gray-300">Livello Giocatore</label>
                <div class="flex gap-2">
                    <input type="number" id="admin-level" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white" placeholder="Livello">
                    <button id="admin-set-level" class="px-3 py-1 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700">Imposta</button>
                </div>
            </div>
            <button id="admin-level-up" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-cyan-600 hover:bg-cyan-700">Aumenta Livello (+1)</button>
            <!-- FINE NUOVA SEZIONE -->

            <button id="admin-unlock-talents" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700">Sblocca Tutti i Talenti</button>
            <button id="admin-unlock-market" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-yellow-600 hover:bg-yellow-700 text-gray-900">Sblocca Tutto il Mercato</button>
            <button id="admin-reset-quests" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700">Reset Missioni</button>
            <button id="admin-reset-botnet" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700">Reset Botnet</button>
        </div>
    `;

    document.getElementById('toggle-admin-panel').addEventListener('click', () => adminPanel.classList.toggle('open'));
    document.getElementById('admin-set-values').addEventListener('click', setAdminValues);
    document.getElementById('admin-unlock-talents').addEventListener('click', unlockAllTalents);
    document.getElementById('admin-unlock-market').addEventListener('click', unlockAllMarketItems);
    document.getElementById('admin-reset-quests').addEventListener('click', resetQuests);
    document.getElementById('admin-reset-botnet').addEventListener('click', resetBotnet);
    document.getElementById('admin-level-up').addEventListener('click', adminLevelUp);
    // NUOVO LISTENER
    document.getElementById('admin-set-level').addEventListener('click', adminSetLevel);
    
    updateAdminPanelUI();
}
