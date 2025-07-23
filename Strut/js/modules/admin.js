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
    alert('Tutti gli oggetti del mercato sono stati sbloccati!');
}

// === FACTION SYSTEM ADMIN FUNCTIONS ===

function addReputationToAllFactions() {
    const xpAmount = 150; // Good amount to test level progression
    
    if (typeof addFactionReputation !== 'undefined') {
        Object.values(FACTIONS).forEach(faction => {
            addFactionReputation(faction.id, xpAmount, 'Admin Test');
        });
        
        if (state.activePage === 'hq') {
            renderFactionReputationBars();
        }
        
        alert(`Aggiunto ${xpAmount} XP di reputazione a tutte le fazioni!`);
    } else {
        alert('Sistema fazioni non disponibile!');
    }
}

function resetAllFactionsReputation() {
    if (!confirm('Sei sicuro di voler resettare tutta la reputazione delle fazioni?')) return;
    
    if (typeof reputationSystem !== 'undefined' && reputationSystem.resetAllReputations) {
        reputationSystem.resetAllReputations();
        alert('Reputazione di tutte le fazioni resettata!');
    } else {
        // Fallback manual reset
        if (state.factionReputation) {
            Object.keys(state.factionReputation).forEach(factionId => {
                state.factionReputation[factionId] = {
                    xp: 0,
                    level: 0,
                    totalXpEarned: 0
                };
            });
            saveState();
            
            if (state.activePage === 'hq') {
                renderFactionReputationBars();
            }
            
            alert('Reputazione di tutte le fazioni resettata manualmente!');
        }
    }
}

function testFactionNotifications() {
    if (typeof showNotification !== 'undefined') {
        const testMessages = [
            'Test notifica Governativa - Livello 2 raggiunto!',
            'Test notifica Terrorista - Operazione completata',
            'Test notifica Eco-Terrorista - Sabotaggio riuscito',
            'Test notifica Popolazione - Caso risolto'
        ];
        
        testMessages.forEach((msg, index) => {
            setTimeout(() => {
                showNotification(msg, 'success');
            }, index * 1000);
        });
    } else {
        alert('Sistema notifiche non disponibile!');
    }
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
    // Ensure xpToNextLevel exists and has a valid value
    if (!state.xpToNextLevel || state.xpToNextLevel <= 0) {
        state.xpToNextLevel = 100;
    }
    
    const xpNeeded = state.xpToNextLevel - (state.xp || 0);
    addXp(xpNeeded, 'player');
    alert(`Livello aumentato a ${state.level}!`);
    updateAdminPanelUI();
}

// === INVESTIGATION LEVEL ADMIN FUNCTIONS ===

function adminIncreaseInvestigation() {
    const increaseInput = document.getElementById('admin-investigation-increase');
    const increaseAmount = parseFloat(increaseInput.value) || 5;
    
    if (increaseAmount <= 0 || increaseAmount > 50) {
        alert('Inserisci un valore tra 0.1 e 50.');
        return;
    }
    
    // Initialize investigation system if needed
    if (typeof initializeInvestigationSystem === 'function') {
        initializeInvestigationSystem();
    }
    
    const oldLevel = state.identity.investigationLevel || 0;
    const newLevel = Math.min(100, oldLevel + increaseAmount);
    state.identity.investigationLevel = newLevel;
    
    // Log the change
    if (!state.identity.investigationHistory) {
        state.identity.investigationHistory = [];
    }
    
    state.identity.investigationHistory.push({
        timestamp: Date.now(),
        oldLevel: oldLevel,
        newLevel: newLevel,
        increase: increaseAmount,
        reason: 'Admin Increase',
        context: { adminAction: true }
    });
    
    saveState();
    updateAdminPanelUI();
    
    // Update investigation UI if function exists
    if (typeof updateInvestigationUI === 'function') {
        updateInvestigationUI();
    }
    
    showNotification(`Livello indagine aumentato di ${increaseAmount} punti (ora al ${newLevel.toFixed(1)}%).`, 'success');
    alert(`Livello indagine aggiornato: ${oldLevel.toFixed(1)}% → ${newLevel.toFixed(1)}%`);
}

function adminDecreaseInvestigation() {
    const decreaseInput = document.getElementById('admin-investigation-decrease');
    const decreaseAmount = parseFloat(decreaseInput.value) || 5;
    
    if (decreaseAmount <= 0 || decreaseAmount > 50) {
        alert('Inserisci un valore tra 0.1 e 50.');
        return;
    }
    
    // Initialize investigation system if needed  
    if (typeof initializeInvestigationSystem === 'function') {
        initializeInvestigationSystem();
    }
    
    const oldLevel = state.identity.investigationLevel || 0;
    const newLevel = Math.max(0, oldLevel - decreaseAmount);
    state.identity.investigationLevel = newLevel;
    
    // Log the change
    if (!state.identity.investigationHistory) {
        state.identity.investigationHistory = [];
    }
    
    state.identity.investigationHistory.push({
        timestamp: Date.now(),
        oldLevel: oldLevel,
        newLevel: newLevel,
        increase: -decreaseAmount,
        reason: 'Admin Decrease',
        context: { adminAction: true }
    });
    
    saveState();
    updateAdminPanelUI();
    
    // Update investigation UI if function exists
    if (typeof updateInvestigationUI === 'function') {
        updateInvestigationUI();
    }
    
    showNotification(`Livello indagine ridotto di ${decreaseAmount} punti (ora al ${newLevel.toFixed(1)}%).`, 'success');
    alert(`Livello indagine aggiornato: ${oldLevel.toFixed(1)}% → ${newLevel.toFixed(1)}%`);
}

function adminSetInvestigationLevel() {
    const targetInput = document.getElementById('admin-investigation');
    const targetLevel = parseFloat(targetInput.value);
    
    if (isNaN(targetLevel) || targetLevel < 0 || targetLevel > 100) {
        alert('Inserisci un livello valido tra 0 e 100.');
        return;
    }
    
    // Initialize investigation system if needed
    if (typeof initializeInvestigationSystem === 'function') {
        initializeInvestigationSystem();
    }
    
    const oldLevel = state.identity.investigationLevel || 0;
    state.identity.investigationLevel = targetLevel;
    
    // Log the change
    if (!state.identity.investigationHistory) {
        state.identity.investigationHistory = [];
    }
    
    state.identity.investigationHistory.push({
        timestamp: Date.now(),
        oldLevel: oldLevel,
        newLevel: targetLevel,
        increase: targetLevel - oldLevel,
        reason: 'Admin Set Level',
        context: { adminAction: true, targetLevel: targetLevel }
    });
    
    saveState();
    updateAdminPanelUI();
    
    // Update investigation UI if function exists
    if (typeof updateInvestigationUI === 'function') {
        updateInvestigationUI();
    }
    
    showNotification(`Livello indagine impostato al ${targetLevel}%.`, 'success');
    alert(`Livello indagine impostato: ${oldLevel.toFixed(1)}% → ${targetLevel}%`);
}

function adminResetInvestigation() {
    if (!confirm('Sei sicuro di voler azzerare il livello di indagine?')) return;
    
    // Initialize investigation system if needed
    if (typeof initializeInvestigationSystem === 'function') {
        initializeInvestigationSystem();
    }
    
    const oldLevel = state.identity.investigationLevel || 0;
    state.identity.investigationLevel = 0;
    
    // Clear investigation history
    state.identity.investigationHistory = [];
    
    // Reset IP traceability as well
    state.ipTraceability = {};
    
    // Log the reset
    state.identity.investigationHistory.push({
        timestamp: Date.now(),
        oldLevel: oldLevel,
        newLevel: 0,
        increase: -oldLevel,
        reason: 'Admin Reset',
        context: { adminAction: true, fullReset: true }
    });
    
    saveState();
    updateAdminPanelUI();
    
    // Update investigation UI if function exists
    if (typeof updateInvestigationUI === 'function') {
        updateInvestigationUI();
    }
    
    showNotification('Livello indagine e tracciabilità IP resettati completamente.', 'success');
    alert(`Livello indagine resettato: ${oldLevel.toFixed(1)}% → 0%\nTracciabilità IP azzerata.`);
}

function showInvestigationHistory() {
    if (!state.identity.investigationHistory || state.identity.investigationHistory.length === 0) {
        alert('Nessuna storia delle indagini disponibile.');
        return;
    }
    
    const history = state.identity.investigationHistory.slice(-20); // Show last 20 events
    let historyText = 'STORIA INDAGINI (Ultimi 20 eventi):\n\n';
    
    history.reverse().forEach(event => {
        const date = new Date(event.timestamp).toLocaleString();
        const change = event.increase >= 0 ? `+${event.increase.toFixed(1)}` : event.increase.toFixed(1);
        historyText += `${date}\n`;
        historyText += `${event.reason}: ${event.oldLevel.toFixed(1)}% → ${event.newLevel.toFixed(1)}% (${change})\n\n`;
    });
    
    // Create a modal to show the history
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <h3 class="text-lg font-bold text-indigo-400 mb-4">Storia Indagini</h3>
            <pre class="text-sm text-gray-300 whitespace-pre-wrap">${historyText}</pre>
            <button id="close-history" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white">Chiudi</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('close-history').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
function adminSetLevel() {
    const targetLevelInput = document.getElementById('admin-level');
    if (!targetLevelInput) {
        alert("Errore: Campo livello non trovato.");
        return;
    }

    const targetLevel = parseInt(targetLevelInput.value, 10);
    if (isNaN(targetLevel) || targetLevel <= 0) {
        alert("Inserisci un livello valido (maggiore di 0).");
        return;
    }

    if (targetLevel <= state.level) {
        alert("Il livello inserito deve essere superiore al livello attuale.");
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

    // Ensure xpToNextLevel exists and has a valid value
    if (!state.xpToNextLevel || state.xpToNextLevel <= 0) {
        state.xpToNextLevel = 100;
    }

    // Level up di un singolo livello
    const xpNeeded = state.xpToNextLevel - (state.xp || 0);
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
    const adminInvestigationInput = document.getElementById('admin-investigation');
    const adminInvestigationValue = document.getElementById('admin-investigation-value');

    // Only update if elements exist and have valid values
    if(adminBtcInput && state.btc !== undefined) adminBtcInput.value = state.btc;
    if(adminXmrInput && state.xmr !== undefined) adminXmrInput.value = state.xmr;
    if(adminTalentsInput && state.talentPoints !== undefined) adminTalentsInput.value = state.talentPoints;
    if(adminLevelInput && state.level !== undefined) adminLevelInput.value = state.level;
    
    // Update investigation level controls
    if(adminInvestigationInput && state.identity && state.identity.investigationLevel !== undefined) {
        adminInvestigationInput.value = Math.round(state.identity.investigationLevel);
    }
    if(adminInvestigationValue && state.identity && state.identity.investigationLevel !== undefined) {
        adminInvestigationValue.textContent = `${Math.round(state.identity.investigationLevel)}%`;
    }
}

function initAdminPanel() {
    // Fix property name inconsistency in the game state
    if (state.nextLevelXp && !state.xpToNextLevel) {
        state.xpToNextLevel = state.nextLevelXp;
    }
    if (isNaN(state.xp) || state.xp === null || state.xp === undefined) {
        state.xp = 0;
    }
    
    // Initialize investigation system if needed
    if (typeof initializeInvestigationSystem === 'function') {
        initializeInvestigationSystem();
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
            
            <!-- LIVELLO GIOCATORE -->
            <div>
                <label for="admin-level" class="block text-sm font-medium text-gray-300">Livello Giocatore</label>
                <div class="flex gap-2">
                    <input type="number" id="admin-level" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white" placeholder="Livello">
                    <button id="admin-set-level" class="px-3 py-1 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700">Imposta</button>
                </div>
            </div>
            <button id="admin-level-up" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-cyan-600 hover:bg-cyan-700">Aumenta Livello (+1)</button>

            <!-- NUOVA SEZIONE INDAGINE -->
            <hr class="border-gray-600 my-3">
            <h4 class="text-sm font-bold text-red-400 text-center">Controlli Indagine</h4>
            <div>
                <label for="admin-investigation" class="block text-sm font-medium text-gray-300">Livello Indagine <span id="admin-investigation-value" class="text-red-400 font-bold">0%</span></label>
                <div class="flex gap-1">
                    <input type="number" id="admin-investigation" min="0" max="100" step="0.1" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white" placeholder="0-100">
                    <button id="admin-set-investigation" class="px-2 py-1 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700">Set</button>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <input type="number" id="admin-investigation-increase" min="0.1" max="50" step="0.1" value="5" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs" placeholder="5">
                    <button id="admin-increase-investigation" class="w-full px-2 py-1 text-xs font-semibold rounded-md bg-orange-600 hover:bg-orange-700 mt-1">+Aumenta</button>
                </div>
                <div>
                    <input type="number" id="admin-investigation-decrease" min="0.1" max="50" step="0.1" value="5" class="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs" placeholder="5">
                    <button id="admin-decrease-investigation" class="w-full px-2 py-1 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700 mt-1">-Riduci</button>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button id="admin-reset-investigation" class="px-3 py-1 text-xs font-semibold rounded-md bg-gray-600 hover:bg-gray-700">Reset (0%)</button>
                <button id="admin-investigation-history" class="px-3 py-1 text-xs font-semibold rounded-md bg-purple-600 hover:bg-purple-700">Storia</button>
            </div>
            <!-- FINE SEZIONE INDAGINE -->

            <button id="admin-unlock-talents" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-green-600 hover:bg-green-700">Sblocca Tutti i Talenti</button>
            <button id="admin-unlock-market" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-yellow-600 hover:bg-yellow-700 text-gray-900">Sblocca Tutto il Mercato</button>
            <button id="admin-reset-quests" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-purple-600 hover:bg-purple-700">Reset Missioni</button>
            <button id="admin-reset-botnet" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700">Reset Botnet</button>
            
            <!-- FACTION SYSTEM ADMIN CONTROLS -->
            <hr class="border-gray-600 my-3">
            <h4 class="text-sm font-bold text-orange-400 text-center">Controlli Fazioni</h4>
            <button id="admin-add-faction-rep" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 hover:bg-indigo-700">+150 XP Tutte Fazioni</button>
            <button id="admin-reset-faction-rep" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700">Reset Reputazione</button>
            <button id="admin-test-notifications" class="w-full px-4 py-2 text-sm font-medium rounded-md bg-orange-600 hover:bg-orange-700">Test Notifiche</button>
        </div>
    `;

    document.getElementById('toggle-admin-panel').addEventListener('click', () => adminPanel.classList.toggle('open'));
    document.getElementById('admin-set-values').addEventListener('click', setAdminValues);
    document.getElementById('admin-unlock-talents').addEventListener('click', unlockAllTalents);
    document.getElementById('admin-unlock-market').addEventListener('click', unlockAllMarketItems);
    document.getElementById('admin-reset-quests').addEventListener('click', resetQuests);
    document.getElementById('admin-reset-botnet').addEventListener('click', resetBotnet);
    document.getElementById('admin-level-up').addEventListener('click', adminLevelUp);
    document.getElementById('admin-set-level').addEventListener('click', adminSetLevel);
    
    // INVESTIGATION SYSTEM LISTENERS
    document.getElementById('admin-set-investigation').addEventListener('click', adminSetInvestigationLevel);
    document.getElementById('admin-increase-investigation').addEventListener('click', adminIncreaseInvestigation);
    document.getElementById('admin-decrease-investigation').addEventListener('click', adminDecreaseInvestigation);
    document.getElementById('admin-reset-investigation').addEventListener('click', adminResetInvestigation);
    document.getElementById('admin-investigation-history').addEventListener('click', showInvestigationHistory);
    
    // FACTION SYSTEM ADMIN LISTENERS
    document.getElementById('admin-add-faction-rep').addEventListener('click', addReputationToAllFactions);
    document.getElementById('admin-reset-faction-rep').addEventListener('click', resetAllFactionsReputation);
    document.getElementById('admin-test-notifications').addEventListener('click', testFactionNotifications);
    
    updateAdminPanelUI();
}
