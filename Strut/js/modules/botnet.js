// File: js/modules/botnet.js
// ENHANCED VERSION: Added DDoS Attack functionality and improved UI with tabbed interface

let selectedHostIds = new Set();
let currentActiveTab = 'management'; // Track current active tab
let selectedBotGroups = new Set(); // Track selected bot groups for DDoS attacks
let activeDDoSAttack = null; // Track active DDoS attack

// Funzione helper per garantire che i flussi salvati siano sempre un array,
// gestendo anche formati legacy dove potevano essere un oggetto.
function getSavedFlowsAsArray() {
    if (Array.isArray(state.savedFlows)) {
        return state.savedFlows;
    }
    if (typeof state.savedFlows === 'object' && state.savedFlows !== null) {
        // Converte un oggetto di flussi in un array
        return Object.keys(state.savedFlows).map(key => ({
            id: key,
            name: state.savedFlows[key].name || key,
            ...state.savedFlows[key]
        }));
    }
    return []; // Ritorna un array vuoto come fallback sicuro
}

function initBotnetPage() {
    setupTabNavigation();
    updateBotnetAggregateStats();
    renderInfectedHostsList();
    renderHostDetailsPanel();
    
    // Initialize DDoS panel
    renderBotGroupSelection();
    renderDDoSFlowOptions();
    updateSelectedResources();
    
    // Show management tab by default
    switchTab('management');
}

function setupTabNavigation() {
    const managementTab = document.getElementById('tab-management');
    const ddosTab = document.getElementById('tab-ddos');
    
    if (managementTab) {
        managementTab.addEventListener('click', () => switchTab('management'));
    }
    if (ddosTab) {
        ddosTab.addEventListener('click', () => switchTab('ddos'));
    }
}

function switchTab(tabName) {
    currentActiveTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.botnet-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.id === `tab-${tabName}`) {
            tab.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.botnet-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const activeContent = document.getElementById(`content-${tabName}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
    
    // Refresh content based on active tab
    if (tabName === 'management') {
        renderInfectedHostsList();
        renderHostDetailsPanel();
    } else if (tabName === 'ddos') {
        renderBotGroupSelection();
        updateSelectedResources();
    }
}

function updateBotnetAggregateStats() {
    const container = document.getElementById('botnet-aggregate-stats');
    if (!container) return;

    const totalHosts = state.infectedHostPool.length;
    const activeHosts = state.infectedHostPool.filter(h => h.status === 'Active').length;
    const offlineHosts = state.infectedHostPool.filter(h => h.status === 'Offline').length;
    const compromisedHosts = state.infectedHostPool.filter(h => h.status === 'Compromised').length;

    let aggregatePower = 0;
    let aggregateBandwidth = 0;
    state.infectedHostPool.forEach(host => {
        if (host.status === 'Active' && host.resources) {
            aggregatePower += host.resources.cpuPower;
            aggregateBandwidth += host.resources.bandwidth;
        }
    });

    const botGroupsCount = Object.keys(state.botnetGroups).length;

    container.innerHTML = `
        <div class="text-center">
            <div class="text-xs text-gray-400 uppercase tracking-wide">Total Hosts</div>
            <div class="text-2xl font-bold text-white">${totalHosts}</div>
        </div>
        <div class="text-center">
            <div class="text-xs text-gray-400 uppercase tracking-wide">Active</div>
            <div class="text-2xl font-bold text-green-400">${activeHosts}</div>
        </div>
        <div class="text-center">
            <div class="text-xs text-gray-400 uppercase tracking-wide">Bot Groups</div>
            <div class="text-2xl font-bold text-purple-400">${botGroupsCount}</div>
        </div>
        <div class="text-center">
            <div class="text-xs text-gray-400 uppercase tracking-wide">Combined Power</div>
            <div class="text-lg font-bold text-indigo-400">${aggregatePower.toFixed(1)} GFLOPS</div>
        </div>
    `;
    
    // Update geographic stats
    updateGeographicStats();
    
    const countEl = document.getElementById('infected-host-count');
    if(countEl) countEl.textContent = totalHosts;
}

function updateGeographicStats() {
    const container = document.getElementById('geographic-stats');
    if (!container || state.infectedHostPool.length === 0) return;

    const locationStats = {};
    state.infectedHostPool.forEach(host => {
        const location = host.location || 'Unknown';
        locationStats[location] = (locationStats[location] || 0) + 1;
    });

    const topLocations = Object.entries(locationStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

    container.innerHTML = topLocations.map(([location, count]) => `
        <div class="text-center">
            <div class="text-xs text-gray-500">${location}</div>
            <div class="text-sm font-bold text-white">${count}</div>
        </div>
    `).join('');
}

function renderInfectedHostsList() {
    const container = document.getElementById('infected-hosts-list');
    if (!container) return;

    if (state.infectedHostPool.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun host infetto nel pool. Esegui attacchi con obiettivi di controllo remoto per acquisirne.</p>`;
        return;
    }

    const groupedHosts = { 'unassigned': [] };
    Object.keys(state.botnetGroups).forEach(g => groupedHosts[g] = []);
    
    state.infectedHostPool.forEach(host => {
        const groupName = Object.keys(state.botnetGroups).find(g => state.botnetGroups[g].hostIds.includes(host.id));
        if (groupName) {
            groupedHosts[groupName].push(host);
        } else {
            groupedHosts['unassigned'].push(host);
        }
    });

    let html = '';
    for (const groupName in groupedHosts) {
        if (groupedHosts[groupName].length > 0) {
            html += `<h4 class="text-sm font-bold text-indigo-400 sticky top-0 bg-gray-800/80 backdrop-blur-sm py-1 px-2 rounded my-2">${groupName === 'unassigned' ? 'Non Raggruppati' : groupName}</h4>`;
            html += groupedHosts[groupName].map(host => {
                const traceScore = host.traceabilityScore || 0;
                let traceColorClass = 'trace-low';
                if (traceScore > 75) traceColorClass = 'trace-high';
                else if (traceScore > 40) traceColorClass = 'trace-medium';

                let statusColor = 'text-gray-400';
                if (host.status === 'Active') statusColor = 'text-green-400';
                if (host.status === 'Offline') statusColor = 'text-yellow-400';
                if (host.status === 'Compromised') statusColor = 'text-red-400';

                return `
                    <div class="host-card p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 ${selectedHostIds.has(host.id) ? 'bg-indigo-900/50 border border-indigo-500' : 'border-transparent'}" data-host-id="${host.id}">
                        <div class="flex justify-between items-center">
                            <p class="font-mono text-sm text-white">${host.ipAddress}</p>
                            <p class="text-xs font-bold ${statusColor}">${host.status}</p>
                        </div>
                        <p class="text-xs text-gray-400">${host.location}</p>
                        <div class="trace-bar-bg mt-2">
                            <div class="trace-bar-fill ${traceColorClass}" style="width: ${traceScore}%" title="Tracciabilità: ${traceScore}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    container.innerHTML = html;

    container.querySelectorAll('.host-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const hostId = card.dataset.hostId;
            const isMultiSelect = event.ctrlKey || event.metaKey;

            if (isMultiSelect) {
                if (selectedHostIds.has(hostId)) {
                    selectedHostIds.delete(hostId);
                } else {
                    selectedHostIds.add(hostId);
                }
            } else {
                if (selectedHostIds.has(hostId) && selectedHostIds.size === 1) {
                    selectedHostIds.clear();
                } else {
                    selectedHostIds.clear();
                    selectedHostIds.add(hostId);
                }
            }
            
            document.querySelectorAll('#infected-hosts-list .host-card').forEach(c => {
                if (selectedHostIds.has(c.dataset.hostId)) {
                    c.classList.add('bg-indigo-900/50', 'border-indigo-500');
                    c.classList.remove('border-transparent');
                } else {
                    c.classList.remove('bg-indigo-900/50', 'border-indigo-500');
                    c.classList.add('border-transparent');
                }
            });

            renderHostDetailsPanel();
        });
    });

    // Add select all/clear functionality
    const selectAllBtn = document.getElementById('select-all-hosts');
    const selectNoneBtn = document.getElementById('select-none-hosts');
    
    if (selectAllBtn) {
        selectAllBtn.replaceWith(selectAllBtn.cloneNode(true)); // Remove existing listeners
        document.getElementById('select-all-hosts').addEventListener('click', () => {
            selectedHostIds.clear();
            state.infectedHostPool.forEach(host => selectedHostIds.add(host.id));
            
            document.querySelectorAll('#infected-hosts-list .host-card').forEach(c => {
                c.classList.add('bg-indigo-900/50', 'border-indigo-500');
                c.classList.remove('border-transparent');
            });
            
            renderHostDetailsPanel();
        });
    }
    
    if (selectNoneBtn) {
        selectNoneBtn.replaceWith(selectNoneBtn.cloneNode(true)); // Remove existing listeners
        document.getElementById('select-none-hosts').addEventListener('click', () => {
            selectedHostIds.clear();
            
            document.querySelectorAll('#infected-hosts-list .host-card').forEach(c => {
                c.classList.remove('bg-indigo-900/50', 'border-indigo-500');
                c.classList.add('border-transparent');
            });
            
            renderHostDetailsPanel();
        });
    }
}

function renderHostDetailsPanel() {
    const container = document.getElementById('host-details-panel');
    if (!container) return;

    if (selectedHostIds.size === 0) {
        container.innerHTML = `<p class="text-center text-gray-500">Seleziona un host dalla lista per visualizzare i dettagli e lanciare comandi.</p>`;
        return;
    }

    const groupOptions = Object.keys(state.botnetGroups).map(g => `<option value="${g}">${g}</option>`).join('');
    const groupManagementHTML = `
        <div class="mt-6 p-4 bg-gray-900/50 rounded-lg">
            <h4 class="text-lg font-semibold text-indigo-300 mb-3">Gestione Gruppo</h4>
            <div class="flex gap-2 mb-2">
                <input type="text" id="new-group-name" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white w-full" placeholder="Nuovo nome gruppo...">
                <button id="create-group-btn" class="px-4 py-2 font-semibold rounded-md bg-green-600 hover:bg-green-700">Crea</button>
            </div>
            <div class="flex gap-2">
                <select id="assign-group-select" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white w-full">
                    <option value="unassigned">Nessun Gruppo</option>
                    ${groupOptions}
                </select>
                <button id="assign-group-btn" class="px-4 py-2 font-semibold rounded-md bg-blue-600 hover:bg-blue-700">Assegna</button>
            </div>
        </div>
    `;

    if (selectedHostIds.size > 1) {
        container.innerHTML = `<p class="text-center text-gray-300">${selectedHostIds.size} host selezionati. Pronti a ricevere un comando di gruppo.</p>${groupManagementHTML}`;
    } else {
        const hostId = selectedHostIds.values().next().value;
        const host = state.infectedHostPool.find(h => h.id === hostId);
        if (!host) {
            container.innerHTML = `<p class="text-center text-red-500">Errore: Host non trovato.</p>`;
            return;
        }

        let flowSlotsHTML = '';
        const numSlots = host.resources?.flowSlots || 1;
        
        const flowsArray = getSavedFlowsAsArray();

        for (let i = 0; i < numSlots; i++) {
            const hookedFlowId = host.hookedFlows?.[i];
            const flow = hookedFlowId ? flowsArray.find(f => f.id === hookedFlowId) : null;
            
            const flowsOptions = flowsArray.length > 0
                ? flowsArray.map(f => `<option value="${f.id}" ${f.id === hookedFlowId ? 'selected' : ''}>${f.name}</option>`).join('')
                : '<option value="" disabled>Nessun flusso salvato</option>';

            flowSlotsHTML += `
                <div class="flow-hook-slot p-3 rounded-lg ${flow ? 'hooked' : ''}">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-bold ${flow ? 'text-purple-300' : 'text-gray-500'}">
                            ${flow ? flow.name : `Slot Flusso ${i + 1}`}
                        </span>
                        <select class="hook-flow-select bg-gray-600 text-xs rounded" data-host-id="${hostId}" data-slot-index="${i}">
                            <option value="">- Aggancia Flusso -</option>
                            ${flowsOptions}
                        </select>
                    </div>
                </div>
            `;
        }
        
        let activityLogHTML = (host.activityLog && host.activityLog.length > 0) 
            ? host.activityLog.slice(-5).reverse().map(log => `<li class="text-xs">${log}</li>`).join('')
            : '<li class="text-xs text-gray-500">Nessuna attività recente.</li>';

        container.innerHTML = `
            <h3 class="text-xl font-bold font-mono text-white mb-2">${host.ipAddress}</h3>
            <p class="text-sm text-gray-400 mb-4">${host.location}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                <div><span class="font-semibold text-gray-300">Status:</span> <span class="font-bold text-green-400">${host.status}</span></div>
                <div><span class="font-semibold text-gray-300">Stabilità:</span> ${host.stabilityScore?.toFixed(0) || 'N/A'}%</div>
                <div><span class="font-semibold text-gray-300">Tracciabilità:</span> ${host.traceabilityScore?.toFixed(0) || 'N/A'}%</div>
                <div><span class="font-semibold text-gray-300">Potenza CPU:</span> ${host.resources?.cpuPower?.toFixed(2) || 'N/A'} GFLOPS</div>
                <div><span class="font-semibold text-gray-300">Banda:</span> ${host.resources?.bandwidth || 'N/A'} Mbps</div>
                <div><span class="font-semibold text-gray-300">Infezione:</span> ${host.infectionType}</div>
            </div>

            <div class="mb-6">
                <h4 class="text-lg font-semibold text-indigo-300 mb-3">Azioni Operative</h4>
                <div class="space-y-2 mb-4">
                    ${flowSlotsHTML}
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button id="execute-flow-btn" data-host-id="${hostId}" class="bg-purple-600 hover:bg-purple-700 p-2 rounded text-sm font-bold">Esegui Flussi</button>
                    <button id="propagate-btn" data-host-id="${hostId}" class="bg-green-600 hover:bg-green-700 p-2 rounded text-sm font-bold">Propaga Infezione</button>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-semibold text-indigo-300 mb-3">Manutenzione</h4>
                    <div class="grid grid-cols-1 gap-3">
                        <button id="reinforce-btn" data-host-id="${hostId}" class="bg-yellow-600 hover:bg-yellow-700 text-black p-2 rounded text-sm">Rinforza Infezione</button>
                        <button id="remove-traces-btn" data-host-id="${hostId}" class="bg-blue-600 hover:bg-blue-700 p-2 rounded text-sm">Rimuovi Tracce</button>
                        <button id="deactivate-btn" data-host-id="${hostId}" class="bg-red-600 hover:bg-red-700 p-2 rounded text-sm">Disattiva</button>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-indigo-300 mb-3">Log Attività</h4>
                    <ul class="activity-log-panel space-y-1">
                        ${activityLogHTML}
                    </ul>
                </div>
            </div>
            
            ${groupManagementHTML}
        `;
        
        document.getElementById('reinforce-btn')?.addEventListener('click', (e) => reinforceInfection(e.target.dataset.hostId));
        document.getElementById('remove-traces-btn')?.addEventListener('click', (e) => removeTraces(e.target.dataset.hostId));
        document.getElementById('deactivate-btn')?.addEventListener('click', (e) => deactivateHost(e.target.dataset.hostId));
        document.getElementById('execute-flow-btn')?.addEventListener('click', (e) => executeFlowOnHost(e.target.dataset.hostId));
        document.getElementById('propagate-btn')?.addEventListener('click', (e) => propagateFromHost(e.target.dataset.hostId));

        container.querySelectorAll('.hook-flow-select').forEach(select => {
            select.addEventListener('change', (event) => {
                const hostId = event.target.dataset.hostId;
                const slotIndex = parseInt(event.target.dataset.slotIndex);
                const flowId = event.target.value;
                hookFlowToSlot(hostId, slotIndex, flowId);
            });
        });
    }
    
    document.getElementById('create-group-btn')?.addEventListener('click', createBotnetGroup);
    document.getElementById('assign-group-btn')?.addEventListener('click', assignHostsToGroup);
}

function createBotnetGroup() {
    const input = document.getElementById('new-group-name');
    const groupName = input.value.trim();
    if (!groupName) {
        showNotification("Inserisci un nome valido per il gruppo.", "error");
        return;
    }
    if (state.botnetGroups[groupName]) {
        showNotification(`Un gruppo con il nome "${groupName}" esiste già.`, "error");
        return;
    }
    state.botnetGroups[groupName] = { hostIds: [], attachedFlows: [] };
    state.botnetGroups[groupName].hostIds.push(...selectedHostIds);
    
    Object.keys(state.botnetGroups).forEach(g => {
        if (g !== groupName) {
            state.botnetGroups[g].hostIds = state.botnetGroups[g].hostIds.filter(id => !selectedHostIds.has(id));
        }
    });

    saveState();
    showNotification(`Gruppo "${groupName}" creato con ${selectedHostIds.size} host.`, "success");
    selectedHostIds.clear();
    initBotnetPage();
}

function assignHostsToGroup() {
    const select = document.getElementById('assign-group-select');
    const groupName = select.value;

    Object.keys(state.botnetGroups).forEach(g => {
        state.botnetGroups[g].hostIds = state.botnetGroups[g].hostIds.filter(id => !selectedHostIds.has(id));
    });

    if (groupName !== 'unassigned' && state.botnetGroups[groupName]) {
        state.botnetGroups[groupName].hostIds.push(...selectedHostIds);
    }
    
    saveState();
    showNotification(`${selectedHostIds.size} host assegnati.`, "info");
    selectedHostIds.clear();
    initBotnetPage();
}

function reinforceInfection(hostId) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    const cost = 0.001;
    if (state.btc < cost) {
        showNotification(`BTC insufficienti. Costo: ${cost} BTC.`, "error");
        return;
    }
    state.btc -= cost;
    
    host.stabilityScore = Math.min(100, host.stabilityScore + 15);
    host.traceabilityScore = Math.min(100, host.traceabilityScore + 25);
    addLogToHost(hostId, "Infezione rinforzata. Stabilità e tracciabilità aumentate.");

    showNotification(`Infezione su ${host.ipAddress} rinforzata.`, "success");
    saveState();
    updateUI();
    renderHostDetailsPanel();
    renderInfectedHostsList();
}

function removeTraces(hostId) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    const cost = 0.0005;
    if (state.btc < cost) {
        showNotification(`BTC insufficienti. Costo: ${cost} BTC.`, "error");
        return;
    }
    state.btc -= cost;

    const antiForensicsLevel = state.unlocked['Anti-Forensics'] || 0;
    const effectiveness = (state.level * 2) + (antiForensicsLevel * 10);
    const reduction = Math.min(host.traceabilityScore, Math.floor(Math.random() * effectiveness));
    
    host.traceabilityScore -= reduction;
    addLogToHost(hostId, `Rimozione tracce. Tracciabilità ridotta di ${reduction} punti.`);

    showNotification(`Pulizia tracce su ${host.ipAddress} eseguita.`, "success");
    saveState();
    updateUI();
    renderHostDetailsPanel();
    renderInfectedHostsList();
}

function deactivateHost(hostId, skipConfirm = false) {
    const hostIndex = state.infectedHostPool.findIndex(h => h.id === hostId);
    if (hostIndex === -1) return;
    const host = state.infectedHostPool[hostIndex];

    const confirmed = skipConfirm || confirm(`Sei sicuro di voler disattivare permanentemente l'host ${host.ipAddress}? Questa azione è irreversibile.`);

    if (confirmed) {
        if (host.traceabilityScore > 50) {
            const penalty = Math.ceil(host.traceabilityScore / 10);
            state.identity.traces += penalty;
            showNotification(`Host disattivato, ma le tracce hanno aumentato il tuo livello di sospetto di +${penalty}!`, "error");
        } else {
            showNotification(`Host ${host.ipAddress} disattivato con successo.`, "info");
        }
        
        state.infectedHostPool.splice(hostIndex, 1);
        Object.keys(state.botnetGroups).forEach(g => {
            state.botnetGroups[g].hostIds = state.botnetGroups[g].hostIds.filter(id => id !== hostId);
        });
        
        selectedHostIds.clear();
        saveState();
        updateUI();
        initBotnetPage();
    }
}

function addLogToHost(hostId, message) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;
    if (!host.activityLog) {
        host.activityLog = [];
    }
    const timestamp = new Date().toLocaleTimeString('it-IT');
    host.activityLog.push(`[${timestamp}] ${message}`);
    if (host.activityLog.length > 20) {
        host.activityLog.shift();
    }
}

function hookFlowToSlot(hostId, slotIndex, flowId) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    const numSlots = host.resources?.flowSlots || 1;
    if (!Array.isArray(host.hookedFlows) || host.hookedFlows.length !== numSlots) {
        const oldFlows = host.hookedFlows || [];
        host.hookedFlows = new Array(numSlots).fill(null);
        for(let i=0; i < Math.min(oldFlows.length, numSlots); i++) {
            host.hookedFlows[i] = oldFlows[i];
        }
    }
    
    const flow = flowId ? getSavedFlowsAsArray().find(f => f.id === flowId) : null;
    const flowName = flow?.name || (flowId ? 'Sconosciuto' : 'Nessuno');
    const flowObjective = flow?.objective || 'sconosciuto';
    
    host.hookedFlows[slotIndex] = flowId || null;
    
    // Enhanced logging with objective information
    if (flowId) {
        addLogToHost(hostId, `Flusso "${flowName}" (Obiettivo: ${flowObjective}) agganciato allo slot ${slotIndex + 1}.`);
        showNotification(`Flusso "${flowName}" con obiettivo "${flowObjective}" agganciato.`, "info");
    } else {
        addLogToHost(hostId, `Slot ${slotIndex + 1} liberato.`);
        showNotification(`Slot ${slotIndex + 1} liberato.`, "info");
    }
    
    saveState();
    if (typeof updateUI === 'function') {
        updateUI();
    }
    renderHostDetailsPanel();
    renderInfectedHostsList();
}

// ====================================================================
// NUOVA LOGICA DI ESECUZIONE FLUSSO (SOSTITUISCE LA VECCHIA)
// ====================================================================

function executeFlowOnHost(hostId) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host || !host.hookedFlows || host.hookedFlows.every(f => f === null)) {
        showNotification("Nessun flusso agganciato a questo host.", "error");
        return;
    }

    addLogToHost(hostId, `Avvio esecuzione di tutti i flussi agganciati...`);
    showNotification(`Avvio esecuzione flussi su ${host.ipAddress}...`, 'info');

    host.hookedFlows.forEach((flowId, index) => {
        if (flowId) {
            const flow = getSavedFlowsAsArray().find(f => f.id === flowId);
            if (flow) {
                setTimeout(() => {
                    executeSingleFlow(host, flow, index);
                }, 1000 * (index + 1));
            }
        }
    });
}

function executeSingleFlow(host, flow, slotIndex) {
    // 1. NUOVA PROBABILITÀ DI SUCCESSO
    const failureChance = 5 + (100 - host.stabilityScore) / 5; // Il rischio base è 5%, aumenta con l'instabilità
    const successChance = 100 - failureChance;
    const roll = Math.random() * 100;

    if (roll < successChance) {
        // --- SUCCESSO ---
        // 2. RICOMPENSE BASATE SULL'OBIETTIVO DEL FLUSSO
        const rewards = determineRewardsByObjective(flow);
        let logMessage = `Flusso "${flow.name}" (Slot ${slotIndex + 1}) eseguito con successo.`;

        if (rewards.length > 0) {
            rewards.forEach(reward => {
                switch(reward.type) {
                    case 'btc':
                        state.btc += reward.amount;
                        logMessage += ` Trovato un wallet con ${reward.amount.toFixed(6)} BTC!`;
                        showNotification(`Jackpot! Trovati ${reward.amount.toFixed(6)} BTC!`, 'success');
                        break;
                    case 'data':
                        promptDataStorage(reward.packet);
                        logMessage += ` Dati "${reward.packet.name}" esfiltrati.`;
                        break;
                    case 'propagate':
                        const newHost = generateRandomHost();
                        state.infectedHostPool.push(newHost);
                        logMessage += ` Infezione propagata a un nuovo host: ${newHost.ipAddress}.`;
                        showNotification(`Propagazione riuscita! Nuovo host ${newHost.ipAddress} aggiunto.`, 'success');
                        break;
                }
            });
        } else {
            // Provide more informative message based on flow objective
            const objective = flow.objective || 'financial';
            switch (objective) {
                case 'dataExfiltration':
                    logMessage += " Operazione completata ma nessun dato utile trovato sui sistemi target.";
                    break;
                case 'financial':
                    logMessage += " Operazione completata ma nessun wallet o asset finanziario scoperto.";
                    break;
                case 'worm':
                    logMessage += " Operazione completata ma le condizioni di rete non erano favorevoli alla propagazione.";
                    break;
                case 'botnet':
                    logMessage += " Operazione completata ma non sono stati reclutati nuovi host per la botnet.";
                    break;
                case 'remoteControl':
                    logMessage += " Accesso remoto stabilito ma nessuna risorsa di valore identificata.";
                    break;
                case 'reconnaissance':
                    logMessage += " Ricognizione completata ma le informazioni raccolte non erano di valore significativo.";
                    break;
                case 'ransomware':
                    logMessage += " Operazione di crittografia completata ma il target non aveva asset di valore.";
                    break;
                case 'denialOfService':
                    logMessage += " Attacco DoS completato con successo, servizio target interrotto.";
                    break;
                default:
                    logMessage += " Operazione completata con successo ma senza ricompense immediate.";
            }
        }
        
        showNotification(logMessage, 'success');
        addLogToHost(host.id, logMessage);
        host.stabilityScore = Math.max(0, host.stabilityScore - (Math.random() * 5 + 1)); // Malus stabilità minimo
    
    } else {
        // --- FALLIMENTO ---
        // 3. MALUS INVARIATI
        const msg = `Esecuzione di "${flow.name}" (Slot ${slotIndex + 1}) fallita. Rilevate contromisure!`;
        showNotification(msg, 'error');
        addLogToHost(host.id, msg);
        host.stabilityScore = Math.max(0, host.stabilityScore - (Math.random() * 15 + 10));
        host.traceabilityScore = Math.min(100, host.traceabilityScore + (Math.random() * 20 + 10));
    }

    if (host.stabilityScore <= 0) {
        const cleanMsg = `Host ${host.ipAddress} è diventato instabile ed è stato perso!`;
        showNotification(cleanMsg, "error");
        addLogToHost(host.id, cleanMsg);
        deactivateHost(host.id, true);
        return; 
    }
    
    saveState();
    updateUI();
    renderHostDetailsPanel();
    renderInfectedHostsList();
}

function determineRewardsByObjective(flow) {
    const rewards = [];
    const objective = flow.objective || 'financial'; // Default a 'financial' se non specificato

    switch (objective) {
        case 'dataExfiltration':
            const dataExfiltrationBlocks = {
                'Esfiltra dati da database': { type: 'Credenziali di Accesso', value: 0.0005 },
                'Estrai email da database': { type: 'Lista Email', value: 0.0002 },
                'Cattura Screenshot': { type: 'Dati Personali', value: 0.0003 },
                'Crea fake login page': { type: 'Credenziali Phishing', value: 0.0008 }
            };
            
            let dataFound = false;
            (flow.blocks || []).forEach(block => {
                if (dataExfiltrationBlocks[block.type]) {
                    dataFound = true;
                    const lootInfo = dataExfiltrationBlocks[block.type];
                    const btcValue = lootInfo.value + (flow.stats.attack / 500000);
                    
                    const dataPacket = {
                        id: `data-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
                        name: `${lootInfo.type} da "${flow.name}"`,
                        description: `Pacchetto dati contenente ${lootInfo.type.toLowerCase()}. Qualità influenzata dalla potenza del flusso.`,
                        type: lootInfo.type,
                        value: parseFloat(btcValue.toFixed(6)),
                        purity: Math.min(100, 60 + (flow.stats.attack / 100000)), // Purity based on flow attack power
                        sensitivity: lootInfo.type === 'Credenziali di Accesso' ? 'High' : 
                                   lootInfo.type === 'Credenziali Phishing' ? 'High' :
                                   lootInfo.type === 'Dati Personali' ? 'Medium' : 'Low'
                    };
                    rewards.push({ type: 'data', packet: dataPacket });
                }
            });
            
            if (!dataFound) {
                 const lootInfo = { type: 'Dati Generici', value: 0.0001 };
                 const btcValue = lootInfo.value + (flow.stats.attack / 500000);
                 const dataPacket = {
                        id: `data-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
                        name: `${lootInfo.type} da "${flow.name}"`,
                        description: `Pacchetto dati contenente ${lootInfo.type.toLowerCase()}.`,
                        type: lootInfo.type,
                        value: parseFloat(btcValue.toFixed(6)),
                        purity: Math.min(100, 40 + (flow.stats.attack / 200000)), // Lower purity for generic data
                        sensitivity: 'Low'
                    };
                rewards.push({ type: 'data', packet: dataPacket });
            }

            if (rewards.length > 0 && Math.random() < 0.05) { // 5% chance di trovare un wallet
                 const btcAmount = Math.random() * 0.005 + 0.001;
                 rewards.push({ type: 'btc', amount: parseFloat(btcAmount.toFixed(6)) });
            }
            break;

        case 'financial':
            if (Math.random() < 0.10) { // 10% di chance di trovare BTC
                const btcAmount = Math.random() * 0.001;
                rewards.push({ type: 'btc', amount: parseFloat(btcAmount.toFixed(6)) });
            }
            break;

        case 'worm':
            rewards.push({ type: 'propagate' });
            break;

        case 'botnet':
            // Botnet flows should have high propagation probability like propagation flows
            rewards.push({ type: 'propagate' });
            if (Math.random() < 0.15) { // 15% chance of finding additional BTC for botnet operations
                const btcAmount = Math.random() * 0.002 + 0.0005;
                rewards.push({ type: 'btc', amount: parseFloat(btcAmount.toFixed(6)) });
            }
            break;

        case 'remoteControl':
            // Remote control flows may find some BTC wallets during system access
            if (Math.random() < 0.08) { // 8% chance of finding BTC
                const btcAmount = Math.random() * 0.0008 + 0.0002;
                rewards.push({ type: 'btc', amount: parseFloat(btcAmount.toFixed(6)) });
            }
            break;

        case 'reconnaissance':
            // Reconnaissance flows primarily generate intelligence data
            const reconData = {
                id: `data-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
                name: `Dati Intelligence da "${flow.name}"`,
                description: `Informazioni di ricognizione raccolte durante l'analisi del target.`,
                type: 'Intelligence',
                value: parseFloat((0.0001 + (flow.stats.attack / 1000000)).toFixed(6)),
                purity: Math.min(100, 50 + (flow.stats.attack / 80000)),
                sensitivity: 'Medium'
            };
            rewards.push({ type: 'data', packet: reconData });
            break;

        case 'ransomware':
            // Ransomware flows have high BTC reward potential
            if (Math.random() < 0.20) { // 20% chance of finding BTC (victims often have wallets)
                const btcAmount = Math.random() * 0.003 + 0.001;
                rewards.push({ type: 'btc', amount: parseFloat(btcAmount.toFixed(6)) });
            }
            break;

        case 'denialOfService':
            // DoS attacks don't typically yield direct rewards but may disrupt security
            // Small chance of finding accessible resources during the attack
            if (Math.random() < 0.05) { // 5% chance
                const btcAmount = Math.random() * 0.0005;
                rewards.push({ type: 'btc', amount: parseFloat(btcAmount.toFixed(6)) });
            }
            break;
    }

    return rewards;
}

function promptDataStorage(dataPacket) {
    const modal = document.getElementById('data-storage-modal');
    if (!modal) return;
    
    const infoContainer = document.getElementById('data-packet-info');
    const optionsContainer = document.getElementById('storage-options');

    infoContainer.innerHTML = `
        <p class="font-semibold text-white">${dataPacket.name}</p>
        <p class="text-xs text-gray-400">${dataPacket.description}</p>
        <p class="text-xs font-mono mt-2">Valore Stimato: <span class="text-yellow-400">${dataPacket.value} BTC</span></p>
    `;

    let optionsHtml = `<button class="storage-btn w-full text-left px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md" data-storage-type="personal">Archivio Personale</button>`;
    
    if (state.clan && state.clan.infrastructure && state.clan.infrastructure.servers.length > 0) {
        optionsHtml += state.clan.infrastructure.servers.map(server => `
            <button class="storage-btn w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md" data-storage-type="clan" data-server-id="${server.id}">
                Server Clan #${server.id}
            </button>
        `).join('');
    }
    
    optionsContainer.innerHTML = optionsHtml;

    const newOptionsContainer = optionsContainer.cloneNode(true);
    optionsContainer.parentNode.replaceChild(newOptionsContainer, optionsContainer);

    newOptionsContainer.addEventListener('click', e => {
        const target = e.target.closest('.storage-btn');
        if (!target) return;

        const { storageType, serverId } = target.dataset;

        if (storageType === 'personal') {
            state.dataLocker.personal.push(dataPacket);
        } else if (storageType === 'clan') {
            state.dataLocker.clan.push({ serverId: serverId, data: dataPacket });
        }
        
        showNotification(`Dati archiviati! Disponibili in Intelligence.`, 'success');
        saveState();
        
        // Refresh intelligence console if it's currently active
        if (state.activePage === 'intelligence_console' && typeof renderDataPacketsList === 'function') {
            renderDataPacketsList();
        }
        
        modal.classList.add('hidden');
    });

    modal.classList.remove('hidden');
}

function propagateFromHost(hostId) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    const flowId = host.hookedFlows?.[0];
    const flow = flowId ? getSavedFlowsAsArray().find(f => f.id === flowId) : null;

    if (!flowId) {
        showNotification("È necessario agganciare un flusso al primo slot per la propagazione.", "error");
        addLogToHost(hostId, "Tentativo di propagazione fallito: nessun flusso agganciato al primo slot.");
        return;
    }

    if (!flow) {
        showNotification("Flusso agganciato non trovato nell'archivio flussi.", "error");
        addLogToHost(hostId, "Tentativo di propagazione fallito: flusso agganciato non valido.");
        return;
    }

    if (flow.objective !== 'worm') {
        showNotification(`È necessario un flusso con obiettivo 'Propagazione' per questa azione. Il flusso "${flow.name}" ha obiettivo "${flow.objective || 'non specificato'}".`, "error");
        addLogToHost(hostId, `Tentativo di propagazione fallito: il flusso "${flow.name}" ha obiettivo "${flow.objective || 'non specificato'}" invece di "worm".`);
        return;
    }

    showNotification(`Tentativo di propagazione da ${host.ipAddress}...`, "info");
    addLogToHost(hostId, `Avvio propagazione con il flusso "${flow.name}" (obiettivo: ${flow.objective})...`);

    setTimeout(() => {
        // Use the same 95% base success rate as executeSingleFlow for consistency
        const failureChance = 5 + (100 - host.stabilityScore) / 5; // 5% base failure, increases with instability
        const successChance = 100 - failureChance;
        if (Math.random() * 100 < successChance) {
            const newHost = generateRandomHost();
            state.infectedHostPool.push(newHost);
            const msg = `Propagazione riuscita! Nuovo host ${newHost.ipAddress} aggiunto alla botnet.`;
            showNotification(msg, 'success');
            addLogToHost(hostId, `Propagazione riuscita. Infettato ${newHost.ipAddress}.`);
            host.stabilityScore = Math.max(0, host.stabilityScore - 10);
        } else {
            const msg = `Propagazione fallita. L'infezione è stata bloccata.`;
            showNotification(msg, 'error');
            addLogToHost(hostId, `Propagazione fallita.`);
            host.traceabilityScore = Math.min(100, host.traceabilityScore + 20);
        }

        saveState();
        updateUI();
        initBotnetPage();
    }, 2000);
}

function generateRandomHost() {
    const newId = `host_${Date.now()}`;
    const newResources = {
        cpuPower: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
        bandwidth: Math.floor(Math.random() * 900 + 100),
        flowSlots: Math.floor(Math.random() * 3 + 1)
    };
    return {
        id: newId,
        ipAddress: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        location: 'Unknown',
        status: 'Active',
        infectionType: 'Worm',
        stabilityScore: 95,
        traceabilityScore: 5,
        resources: newResources,
        hookedFlows: new Array(newResources.flowSlots).fill(null),
        activityLog: [`[${new Date().toLocaleTimeString('it-IT')}] Infezione riuscita tramite propagazione.`]
    };
}

function formatMoney(amount) {
    if (typeof amount !== 'number') return '$0';
    return '$' + amount.toLocaleString('en-US');
}

// ====================================================================
// NEW: DDoS ATTACK FUNCTIONALITY
// ====================================================================

function renderBotGroupSelection() {
    const container = document.getElementById('botgroup-selection');
    if (!container) return;

    const botGroups = Object.keys(state.botnetGroups);
    
    if (botGroups.length === 0) {
        container.innerHTML = `
            <div class="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-500">
                <i class="fas fa-exclamation-triangle text-yellow-400 text-2xl mb-2"></i>
                <p class="text-gray-400">No bot groups available.</p>
                <p class="text-xs text-gray-500 mt-1">Create bot groups in the Management tab first.</p>
            </div>
        `;
        return;
    }

    let html = '';
    botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        const activeHosts = group.hostIds.filter(hostId => {
            const host = state.infectedHostPool.find(h => h.id === hostId);
            return host && host.status === 'Active';
        }).length;
        
        const totalHosts = group.hostIds.length;
        const isSelected = selectedBotGroups.has(groupName);
        
        html += `
            <div class="bot-group-card ${isSelected ? 'selected' : ''}" data-group-name="${groupName}">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" class="bot-group-checkbox" ${isSelected ? 'checked' : ''}>
                    <div class="flex-grow">
                        <h4 class="font-semibold text-white">${groupName}</h4>
                        <p class="text-sm text-gray-400">${activeHosts}/${totalHosts} hosts active</p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-purple-400">${calculateGroupPower(group).toFixed(1)} GFLOPS</div>
                        <div class="text-xs text-blue-400">${calculateGroupBandwidth(group)} Mbps</div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('.bot-group-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') return; // Let checkbox handle itself
            
            const groupName = card.dataset.groupName;
            const checkbox = card.querySelector('.bot-group-checkbox');
            
            if (selectedBotGroups.has(groupName)) {
                selectedBotGroups.delete(groupName);
                checkbox.checked = false;
                card.classList.remove('selected');
            } else {
                selectedBotGroups.add(groupName);
                checkbox.checked = true;
                card.classList.add('selected');
            }
            
            updateSelectedResources();
            updateAttackPreview();
        });
        
        const checkbox = card.querySelector('.bot-group-checkbox');
        checkbox.addEventListener('change', (e) => {
            const groupName = card.dataset.groupName;
            
            if (e.target.checked) {
                selectedBotGroups.add(groupName);
                card.classList.add('selected');
            } else {
                selectedBotGroups.delete(groupName);
                card.classList.remove('selected');
            }
            
            updateSelectedResources();
            updateAttackPreview();
        });
    });
}

function calculateGroupPower(group) {
    let totalPower = 0;
    group.hostIds.forEach(hostId => {
        const host = state.infectedHostPool.find(h => h.id === hostId);
        if (host && host.status === 'Active' && host.resources) {
            totalPower += host.resources.cpuPower;
        }
    });
    return totalPower;
}

function calculateGroupBandwidth(group) {
    let totalBandwidth = 0;
    group.hostIds.forEach(hostId => {
        const host = state.infectedHostPool.find(h => h.id === hostId);
        if (host && host.status === 'Active' && host.resources) {
            totalBandwidth += host.resources.bandwidth;
        }
    });
    return totalBandwidth;
}

function updateSelectedResources() {
    const hostCountEl = document.getElementById('selected-host-count');
    const activeCountEl = document.getElementById('selected-active-count');
    const powerTotalEl = document.getElementById('selected-power-total');
    const bandwidthTotalEl = document.getElementById('selected-bandwidth-total');

    let totalHosts = 0;
    let activeHosts = 0;
    let totalPower = 0;
    let totalBandwidth = 0;

    selectedBotGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            totalHosts += group.hostIds.length;
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host) {
                    if (host.status === 'Active') {
                        activeHosts++;
                        if (host.resources) {
                            totalPower += host.resources.cpuPower;
                            totalBandwidth += host.resources.bandwidth;
                        }
                    }
                }
            });
        }
    });

    if (hostCountEl) hostCountEl.textContent = totalHosts;
    if (activeCountEl) activeCountEl.textContent = activeHosts;
    if (powerTotalEl) powerTotalEl.textContent = `${totalPower.toFixed(1)} GFLOPS`;
    if (bandwidthTotalEl) bandwidthTotalEl.textContent = `${totalBandwidth} Mbps`;

    // Enable/disable launch button
    const launchBtn = document.getElementById('launch-ddos-btn');
    if (launchBtn) {
        const targetIp = document.getElementById('ddos-target-ip')?.value;
        const selectedFlow = document.getElementById('ddos-flow-select')?.value;
        
        launchBtn.disabled = !(activeHosts > 0 && targetIp && selectedFlow);
    }
}

function renderDDoSFlowOptions() {
    const select = document.getElementById('ddos-flow-select');
    if (!select) return;

    const flows = getSavedFlowsAsArray();
    const ddosFlows = flows.filter(flow => isDDoSFlow(flow));

    let optionsHtml = '<option value="">-- Select DDoS Flow --</option>';
    
    if (ddosFlows.length === 0) {
        // Provide helpful guidance when no DDoS flows are available
        if (flows.length === 0) {
            optionsHtml += '<option value="" disabled>No flows available. Create flows in the Editor first.</option>';
        } else {
            optionsHtml += '<option value="" disabled>No DDoS flows available. Create flows with DDoS objective or DDoS blocks.</option>';
            
            // Show available flows that could be modified
            const nonDDoSFlows = flows.filter(flow => !isDDoSFlow(flow));
            if (nonDDoSFlows.length > 0) {
                optionsHtml += '<optgroup label="Available flows (not DDoS compatible)">';
                nonDDoSFlows.slice(0, 3).forEach(flow => {
                    const objective = flow.objective || 'none';
                    optionsHtml += `<option value="" disabled>${flow.name} (${objective})</option>`;
                });
                if (nonDDoSFlows.length > 3) {
                    optionsHtml += `<option value="" disabled>...and ${nonDDoSFlows.length - 3} more</option>`;
                }
                optionsHtml += '</optgroup>';
            }
        }
    } else {
        ddosFlows.forEach(flow => {
            const objective = flow.objective || 'denialOfService';
            const powerLevel = flow.stats?.attack ? Math.floor(flow.stats.attack / 50000) : 1;
            const powerIndicator = '★'.repeat(Math.min(powerLevel, 5)) + '☆'.repeat(Math.max(0, 5 - powerLevel));
            optionsHtml += `<option value="${flow.id}">${flow.name} (${objective}) ${powerIndicator}</option>`;
        });
        
        // Add helpful information about other flows
        const nonDDoSFlows = flows.filter(flow => !isDDoSFlow(flow));
        if (nonDDoSFlows.length > 0) {
            optionsHtml += '<optgroup label="Other flows (not DDoS compatible)">';
            optionsHtml += `<option value="" disabled>${nonDDoSFlows.length} flows available with different objectives</option>`;
            optionsHtml += '</optgroup>';
        }
    }

    select.innerHTML = optionsHtml;

    // Add event listeners
    select.addEventListener('change', updateAttackPreview);
    
    const targetInput = document.getElementById('ddos-target-ip');
    if (targetInput) {
        targetInput.addEventListener('input', updateAttackPreview);
    }
    
    const durationSelect = document.getElementById('ddos-duration');
    if (durationSelect) {
        durationSelect.addEventListener('change', updateAttackPreview);
    }
    
    const launchBtn = document.getElementById('launch-ddos-btn');
    if (launchBtn) {
        launchBtn.addEventListener('click', launchDDoSAttack);
    }
    
    // Show helpful tips if no DDoS flows are available
    if (ddosFlows.length === 0) {
        showDDoSFlowGuidance();
    }
}

function isDDoSFlow(flow) {
    if (!flow) return false;
    
    // Check if flow objective is explicitly set to denial of service
    if (flow.objective === 'denialOfService') {
        return true;
    }
    
    // Check if flow contains DDoS-specific blocks
    if (!flow.blocks) return false;
    
    const ddosBlocks = [
        'Lancia attacco SYN Flood',
        'Genera traffico UDP Flood', 
        'Coordina botnet per DDoS',
        'Attacco Layer 7 (HTTP Flood)'
    ];
    
    return flow.blocks.some(block => {
        const blockType = typeof block === 'string' ? block : block.type;
        return ddosBlocks.includes(blockType);
    });
}

function validateDDoSFlow(flow) {
    // Provide detailed validation feedback for DDoS flows
    const validation = {
        isValid: false,
        issues: [],
        suggestions: []
    };
    
    if (!flow) {
        validation.issues.push('No flow provided');
        return validation;
    }
    
    // Check objective
    if (flow.objective !== 'denialOfService') {
        if (flow.objective) {
            validation.issues.push(`Flow objective is "${flow.objective}" instead of "denialOfService"`);
            validation.suggestions.push('Set the flow objective to "Denial of Service (DoS/DDoS)" in the Editor');
        } else {
            validation.issues.push('Flow has no objective set');
            validation.suggestions.push('Set the flow objective to "Denial of Service (DoS/DDoS)" in the Editor');
        }
    }
    
    // Check for DDoS blocks
    const ddosBlocks = [
        'Lancia attacco SYN Flood',
        'Genera traffico UDP Flood', 
        'Coordina botnet per DDoS',
        'Attacco Layer 7 (HTTP Flood)'
    ];
    
    const hasBlocks = flow.blocks && flow.blocks.length > 0;
    const hasDDoSBlocks = hasBlocks && flow.blocks.some(block => {
        const blockType = typeof block === 'string' ? block : block.type;
        return ddosBlocks.includes(blockType);
    });
    
    if (!hasBlocks) {
        validation.issues.push('Flow has no blocks');
        validation.suggestions.push('Add DDoS blocks like "SYN Flood" or "UDP Flood" in the Editor');
    } else if (!hasDDoSBlocks) {
        validation.issues.push('Flow has no DDoS-specific blocks');
        validation.suggestions.push('Add at least one DDoS block: SYN Flood, UDP Flood, HTTP Flood, or Botnet Coordination');
    }
    
    // Check flow completeness (FC score)
    if (flow.fc && flow.fc < 50) {
        validation.issues.push(`Low flow completeness score (${flow.fc}%)`);
        validation.suggestions.push('Improve the flow by adding required blocks for DDoS attacks');
    }
    
    validation.isValid = validation.issues.length === 0;
    return validation;
}

function updateAttackPreview() {
    const previewEl = document.getElementById('attack-preview');
    const impactEl = document.getElementById('preview-impact');
    const traceRiskEl = document.getElementById('preview-trace-risk');
    const lossRiskEl = document.getElementById('preview-loss-risk');
    
    if (!previewEl || !impactEl || !traceRiskEl || !lossRiskEl) return;

    const targetIp = document.getElementById('ddos-target-ip')?.value;
    const selectedFlowId = document.getElementById('ddos-flow-select')?.value;
    const duration = parseInt(document.getElementById('ddos-duration')?.value || '60');

    if (!targetIp || !selectedFlowId || selectedBotGroups.size === 0) {
        previewEl.classList.add('hidden');
        return;
    }

    // Calculate attack metrics
    let totalPower = 0;
    let totalHosts = 0;
    selectedBotGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    totalHosts++;
                    if (host.resources) {
                        totalPower += host.resources.cpuPower;
                    }
                }
            });
        }
    });

    const impact = calculateAttackImpact(totalPower, duration);
    const traceRisk = calculateTraceabilityRisk(totalHosts, duration);
    const lossRisk = calculateBotLossRisk(totalHosts, duration);

    impactEl.textContent = impact;
    impactEl.className = `font-bold ${getImpactColor(impact)}`;
    
    traceRiskEl.textContent = traceRisk;
    traceRiskEl.className = `font-bold ${getRiskColor(traceRisk)}`;
    
    lossRiskEl.textContent = lossRisk;
    lossRiskEl.className = `font-bold ${getRiskColor(lossRisk)}`;

    previewEl.classList.remove('hidden');
}

function calculateAttackImpact(totalPower, duration) {
    const baseImpact = totalPower * duration / 60; // Impact per minute
    if (baseImpact < 50) return 'Low';
    if (baseImpact < 200) return 'Medium';
    if (baseImpact < 500) return 'High';
    return 'Critical';
}

function calculateTraceabilityRisk(hostCount, duration) {
    const riskScore = (hostCount * 2) + (duration / 10);
    if (riskScore < 20) return 'Low';
    if (riskScore < 50) return 'Medium';
    if (riskScore < 100) return 'High';
    return 'Critical';
}

function calculateBotLossRisk(hostCount, duration) {
    const lossScore = (hostCount / 10) + (duration / 30);
    if (lossScore < 5) return 'Low';
    if (lossScore < 15) return 'Medium';
    if (lossScore < 30) return 'High';
    return 'Critical';
}

function getImpactColor(impact) {
    switch (impact) {
        case 'Low': return 'text-green-400';
        case 'Medium': return 'text-yellow-400';
        case 'High': return 'text-orange-400';
        case 'Critical': return 'text-red-400';
        default: return 'text-gray-400';
    }
}

function getRiskColor(risk) {
    switch (risk) {
        case 'Low': return 'text-green-400';
        case 'Medium': return 'text-yellow-400';
        case 'High': return 'text-orange-400';
        case 'Critical': return 'text-red-400';
        default: return 'text-gray-400';
    }
}

function launchDDoSAttack() {
    const targetIp = document.getElementById('ddos-target-ip')?.value;
    const selectedFlowId = document.getElementById('ddos-flow-select')?.value;
    const duration = parseInt(document.getElementById('ddos-duration')?.value || '60');
    
    if (!targetIp || !selectedFlowId || selectedBotGroups.size === 0) {
        showNotification('Please configure all attack parameters.', 'error');
        return;
    }

    if (!isValidIP(targetIp)) {
        showNotification('Invalid IP address format.', 'error');
        return;
    }

    const flow = getSavedFlowsAsArray().find(f => f.id === selectedFlowId);
    if (!flow || !isDDoSFlow(flow)) {
        showNotification('Selected flow is not valid for DDoS attacks.', 'error');
        return;
    }

    // Start the attack
    activeDDoSAttack = {
        target: targetIp,
        flow: flow,
        botGroups: Array.from(selectedBotGroups),
        duration: duration,
        startTime: Date.now(),
        progress: 0
    };

    showNotification(`DDoS attack launched against ${targetIp}`, 'info');
    showAttackStatus();
    
    // Apply attack effects immediately
    applyDDoSAttackEffects();
    
    // Set up attack countdown
    const attackInterval = setInterval(() => {
        updateAttackProgress();
        
        if (activeDDoSAttack.progress >= 100) {
            clearInterval(attackInterval);
            completeDDoSAttack();
        }
    }, 1000);

    saveState();
    updateUI();
}

function isValidIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

function showAttackStatus() {
    const statusEl = document.getElementById('ddos-attack-status');
    const targetEl = document.getElementById('active-target');
    const launchBtn = document.getElementById('launch-ddos-btn');
    
    if (statusEl) statusEl.classList.remove('hidden');
    if (targetEl) targetEl.textContent = activeDDoSAttack.target;
    if (launchBtn) launchBtn.disabled = true;
}

function updateAttackProgress() {
    if (!activeDDoSAttack) return;

    const elapsed = Date.now() - activeDDoSAttack.startTime;
    const totalDuration = activeDDoSAttack.duration * 1000;
    activeDDoSAttack.progress = Math.min(100, (elapsed / totalDuration) * 100);

    const countdownEl = document.getElementById('attack-countdown');
    const progressBarEl = document.getElementById('attack-progress-bar');
    
    if (countdownEl) {
        const remaining = Math.max(0, activeDDoSAttack.duration - Math.floor(elapsed / 1000));
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (progressBarEl) {
        progressBarEl.style.width = `${activeDDoSAttack.progress}%`;
    }
}

function applyDDoSAttackEffects() {
    if (!activeDDoSAttack) return;

    // Apply traceability increases to all participating hosts
    activeDDoSAttack.botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    // Increase traceability based on attack duration
                    const traceIncrease = 5 + (activeDDoSAttack.duration / 20);
                    host.traceabilityScore = Math.min(100, host.traceabilityScore + traceIncrease);
                    
                    // Small stability decrease
                    host.stabilityScore = Math.max(0, host.stabilityScore - (Math.random() * 3 + 1));
                    
                    addLogToHost(hostId, `Participating in DDoS attack against ${activeDDoSAttack.target}`);
                }
            });
        }
    });
}

function completeDDoSAttack() {
    if (!activeDDoSAttack) return;

    const attack = activeDDoSAttack;
    activeDDoSAttack = null;

    // Calculate success and consequences
    const attackPower = calculateTotalAttackPower(attack.botGroups);
    const isSuccess = Math.random() < 0.8; // 80% base success rate

    if (isSuccess) {
        // Successful attack rewards
        const xpGain = Math.floor(attackPower / 10) + (attack.duration / 10);
        addXp(xpGain);
        
        const btcReward = (attackPower / 1000) * 0.001; // Small BTC reward
        state.btc += btcReward;
        
        showNotification(`DDoS attack successful! Gained ${xpGain} XP and ${btcReward.toFixed(6)} BTC`, 'success');
    } else {
        // Attack failed - increase consequences
        showNotification('DDoS attack failed! Target defenses held strong.', 'error');
        
        // Additional traceability increase for failure
        attack.botGroups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                group.hostIds.forEach(hostId => {
                    const host = state.infectedHostPool.find(h => h.id === hostId);
                    if (host) {
                        host.traceabilityScore = Math.min(100, host.traceabilityScore + 10);
                        
                        // Risk of losing some bots
                        if (host.traceabilityScore > 80 && Math.random() < 0.1) {
                            addLogToHost(hostId, 'Host compromised and lost due to failed DDoS attack');
                            deactivateHost(hostId, true);
                        }
                    }
                });
            }
        });
    }

    hideAttackStatus();
    saveState();
    updateUI();
    renderInfectedHostsList();
}

function calculateTotalAttackPower(botGroups) {
    let totalPower = 0;
    botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            totalPower += calculateGroupPower(group);
        }
    });
    return totalPower;
}

function showDDoSFlowGuidance() {
    // Add helpful guidance in the attack configuration section
    const configSection = document.querySelector('#content-ddos .bg-gray-800\\/50');
    if (!configSection) return;
    
    const existingGuidance = configSection.querySelector('.ddos-guidance');
    if (existingGuidance) return; // Don't add duplicate guidance
    
    const guidanceDiv = document.createElement('div');
    guidanceDiv.className = 'ddos-guidance bg-blue-900/30 rounded-lg p-4 mb-4 border border-blue-500';
    guidanceDiv.innerHTML = `
        <div class="flex items-start space-x-3">
            <i class="fas fa-info-circle text-blue-400 text-lg mt-1"></i>
            <div>
                <h4 class="font-semibold text-blue-300 mb-2">No DDoS Flows Available</h4>
                <p class="text-sm text-gray-300 mb-2">To launch DDoS attacks, you need flows with DDoS capabilities:</p>
                <ul class="text-xs text-gray-400 space-y-1 mb-3">
                    <li>• Go to the <strong>Editor</strong> to create attack flows</li>
                    <li>• Set the flow objective to <strong>"Denial of Service (DoS/DDoS)"</strong></li>
                    <li>• Include blocks like: SYN Flood, UDP Flood, HTTP Flood</li>
                    <li>• Save your flow and return here to use it</li>
                </ul>
                <div class="flex space-x-2">
                    <button onclick="switchPage('editor')" class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded">
                        Open Editor
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                            class="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insert guidance after the h3 title
    const title = configSection.querySelector('h3');
    if (title) {
        title.insertAdjacentElement('afterend', guidanceDiv);
    }
}

function hideAttackStatus() {
    const statusEl = document.getElementById('ddos-attack-status');
    const launchBtn = document.getElementById('launch-ddos-btn');
    
    if (statusEl) statusEl.classList.add('hidden');
    if (launchBtn) launchBtn.disabled = false;
    
    // Clear selections
    selectedBotGroups.clear();
    renderBotGroupSelection();
    updateSelectedResources();
}
