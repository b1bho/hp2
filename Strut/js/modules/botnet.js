// File: js/modules/botnet.js
// ENHANCED VERSION: Added DDoS Attack functionality and improved UI with tabbed interface

let selectedHostIds = new Set();
let currentActiveTab = 'management'; // Track current active tab
let selectedBotGroups = new Set(); // Track selected bot groups for DDoS attacks
let activeDDoSAttacks = []; // Track multiple active DDoS attacks
let ddosImpactTracking = new Map(); // Track DIS scores and status for active attacks
let selectedMiningGroups = new Set(); // Track selected bot groups for Mining
let activeMiningOperation = null; // Track active Mining operation
let selectedRansomwareGroups = new Set(); // Track selected bot groups for Ransomware
let activeRansomwareOperations = []; // Track active Ransomware operations
let activeRansomRequests = []; // Track active ransom requests

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
    
    // Clean up any empty groups on page initialization
    cleanupEmptyGroups();
    
    updateBotnetAggregateStats();
    renderInfectedHostsList();
    renderHostDetailsPanel();
    
    // Initialize DDoS panel
    renderBotGroupSelection();
    renderDDoSFlowOptions();
    updateSelectedResources();
    
    // Initialize Mining panel
    renderMiningGroups();
    updateMiningSelectedResources();
    setupMiningControls();
    
    // Show management tab by default
    switchTab('management');
}

function setupTabNavigation() {
    const managementTab = document.getElementById('tab-management');
    const ddosTab = document.getElementById('tab-ddos');
    const miningTab = document.getElementById('tab-mining');
    const ransomwareTab = document.getElementById('tab-ransomware');
    
    if (managementTab) {
        managementTab.addEventListener('click', () => switchTab('management'));
    }
    if (ddosTab) {
        ddosTab.addEventListener('click', () => switchTab('ddos'));
    }
    if (miningTab) {
        miningTab.addEventListener('click', () => switchTab('mining'));
    }
    if (ransomwareTab) {
        ransomwareTab.addEventListener('click', () => switchTab('ransomware'));
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
    } else if (tabName === 'mining') {
        renderMiningGroups();
        updateMiningSelectedResources();
        updateMiningStats();
        if (typeof updateMiningLogsDisplay === 'function') {
            updateMiningLogsDisplay();
        }
    } else if (tabName === 'ransomware') {
        renderRansomwareBotGroupSelection();
        updateRansomwareSelectedResources();
        renderRansomwareFlowOptions();
        updateRansomwarePARPreview();
        renderActiveRansomwareOperations();
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
    state.botnetGroups[groupName] = { hostIds: [], attachedFlows: [], currentActivity: 'Idle' };
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
    
    // Clean up any empty groups after host reassignment
    cleanupEmptyGroups();
    
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
        // Handle DDoS impact if host is involved in active attacks
        if (typeof handleInfectedHostCleaned === 'function') {
            handleInfectedHostCleaned(hostId);
        }
        
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
        
        // Clean up any empty groups after host removal
        cleanupEmptyGroups();
        
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
// EMPTY GROUP CLEANUP FUNCTIONALITY
// ====================================================================

function cleanupEmptyGroups() {
    if (!state.botnetGroups) return;
    
    const groupsToRemove = [];
    
    // Find groups with no hosts
    Object.keys(state.botnetGroups).forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group && (!group.hostIds || group.hostIds.length === 0)) {
            groupsToRemove.push(groupName);
        }
    });
    
    // Remove empty groups
    groupsToRemove.forEach(groupName => {
        delete state.botnetGroups[groupName];
        console.log(`Empty botnet group "${groupName}" automatically cleaned up`);
    });
    
    // If any groups were removed, save state and update UI
    if (groupsToRemove.length > 0) {
        saveState();
        showNotification(`${groupsToRemove.length} gruppo${groupsToRemove.length > 1 ? 'i' : ''} vuot${groupsToRemove.length > 1 ? 'i' : 'o'} rimoss${groupsToRemove.length > 1 ? 'i' : 'o'} automaticamente.`, "info");
        return groupsToRemove.length;
    }
    
    return 0;
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
        const currentActivity = group.currentActivity || 'Idle';
        
        // Check if this group is involved in any active operations
        const isInActiveDDoS = activeDDoSAttacks.some(attack => attack.botGroups.includes(groupName));
        const isInActiveRansomware = activeRansomwareOperations.some(op => op.botGroups.includes(groupName));
        const currentDDoSTarget = isInActiveDDoS ? activeDDoSAttacks.find(attack => attack.botGroups.includes(groupName))?.target : null;
        
        let activityIcon = 'fa-circle';
        let activityColor = 'text-gray-400';
        let activityText = currentActivity;
        
        if (currentActivity === 'Mining') {
            activityIcon = 'fa-coins';
            activityColor = 'text-yellow-400';
        } else if (currentActivity === 'DDoSing' || isInActiveDDoS) {
            activityIcon = 'fa-crosshairs';
            activityColor = 'text-red-400';
            if (currentDDoSTarget) {
                activityText = `DDoSing ${currentDDoSTarget}`;
            }
        } else if (currentActivity === 'Ransomware' || isInActiveRansomware) {
            activityIcon = 'fa-lock';
            activityColor = 'text-red-400';
            if (isInActiveRansomware) {
                const operation = activeRansomwareOperations.find(op => op.botGroups.includes(groupName));
                if (operation) {
                    activityText = `Ransomware ${operation.targetType}`;
                }
            }
        }
        
        const isDisabled = currentActivity !== 'Idle' && !isSelected;
        
        html += `
            <div class="bot-group-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-group-name="${groupName}">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" class="bot-group-checkbox" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                    <div class="flex-grow">
                        <div class="flex items-center space-x-2">
                            <h4 class="font-semibold text-white">${groupName}</h4>
                            <div class="flex items-center space-x-1">
                                <i class="fas ${activityIcon} ${activityColor} text-xs"></i>
                                <span class="text-xs ${activityColor}" title="${activityText}">${activityText.length > 15 ? activityText.substring(0, 15) + '...' : activityText}</span>
                            </div>
                        </div>
                        <p class="text-sm text-gray-400">${activeHosts}/${totalHosts} hosts active</p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-purple-400">${calculateEffectiveGroupPowerForDDoS(group).toFixed(1)} GFLOPS</div>
                        <div class="text-xs text-blue-400">${calculateGroupBandwidth(group)} Mbps</div>
                        ${currentActivity === 'Mining' ? '<div class="text-xs text-orange-400">(-50% power)</div>' : ''}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('.bot-group-card:not(.disabled)').forEach(card => {
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
        if (checkbox && !checkbox.disabled) {
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
        }
    });
    
    // Update the multi-attack status display
    updateMultiAttackStatus();
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

function calculateEffectiveGroupPowerForDDoS(group) {
    const basePower = calculateGroupPower(group);
    // Apply 50% reduction if group is currently mining
    if (group.currentActivity === 'Mining') {
        return basePower * 0.5;
    }
    return basePower;
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
                            // Use effective power calculation for DDoS
                            const effectivePower = group.currentActivity === 'Mining' ? 
                                host.resources.cpuPower * 0.5 : host.resources.cpuPower;
                            totalPower += effectivePower;
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

    // Update DIS prediction if we have valid parameters
    updateDISPreview(totalPower, activeHosts);
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

    // Calculate attack metrics with conflict consideration
    let totalPower = 0;
    let totalHosts = 0;
    let hasMininingConflicts = false;
    
    selectedBotGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            if (group.currentActivity === 'Mining') {
                hasMininingConflicts = true;
            }
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    totalHosts++;
                    if (host.resources) {
                        // Apply conflict reduction
                        const effectivePower = group.currentActivity === 'Mining' ? 
                            host.resources.cpuPower * 0.5 : host.resources.cpuPower;
                        totalPower += effectivePower;
                    }
                }
            });
        }
    });

    const impact = calculateAttackImpact(totalPower, duration);
    const traceRisk = calculateTraceabilityRisk(totalHosts, duration, hasMininingConflicts);
    const lossRisk = calculateBotLossRisk(totalHosts, duration, hasMininingConflicts);

    impactEl.textContent = impact;
    impactEl.className = `font-bold ${getImpactColor(impact)}`;
    
    traceRiskEl.textContent = traceRisk;
    traceRiskEl.className = `font-bold ${getRiskColor(traceRisk)}`;
    
    lossRiskEl.textContent = lossRisk;
    lossRiskEl.className = `font-bold ${getRiskColor(lossRisk)}`;

    previewEl.classList.remove('hidden');
    
    // Also update DIS preview
    updateDISPreview(totalPower, totalHosts);
}

function calculateAttackImpact(totalPower, duration) {
    const baseImpact = totalPower * duration / 60; // Impact per minute
    if (baseImpact < 50) return 'Low';
    if (baseImpact < 200) return 'Medium';
    if (baseImpact < 500) return 'High';
    return 'Critical';
}

function calculateTraceabilityRisk(hostCount, duration, hasConflicts = false) {
    const baseRiskScore = (hostCount * 2) + (duration / 10);
    const conflictPenalty = hasConflicts ? 10 : 0; // Additional risk for conflicts
    const riskScore = baseRiskScore + conflictPenalty;
    
    if (riskScore < 20) return 'Low';
    if (riskScore < 50) return 'Medium';
    if (riskScore < 100) return 'High';
    return 'Critical';
}

function calculateBotLossRisk(hostCount, duration, hasConflicts = false) {
    const baseLossScore = (hostCount / 10) + (duration / 30);
    const conflictPenalty = hasConflicts ? 5 : 0; // Additional risk for conflicts
    const lossScore = baseLossScore + conflictPenalty;
    
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

    // Check if any selected groups are already in use
    let busyGroups = [];
    selectedBotGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group && (group.currentActivity === 'Mining' || group.currentActivity === 'DDoSing' || group.currentActivity === 'Ransomware')) {
            busyGroups.push(groupName);
        }
        
        // Also check for active ransomware operations
        const isInActiveRansomware = activeRansomwareOperations.some(op => op.botGroups.includes(groupName));
        if (isInActiveRansomware) {
            busyGroups.push(`${groupName} (Ransomware)`);
        }
    });

    if (busyGroups.length > 0) {
        showNotification(`Groups ${busyGroups.join(', ')} are currently busy with other operations. Please wait or select different groups.`, 'error');
        return;
    }

    // Check for conflicts and calculate effective resources
    let hasConflicts = false;
    let conflictGroups = [];
    let attackSourceIPs = [];
    
    selectedBotGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            if (group.currentActivity === 'Mining' || group.currentActivity === 'Ransomware') {
                hasConflicts = true;
                conflictGroups.push(groupName);
            }
            
            // Collect bot IPs for realistic routing
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    attackSourceIPs.push(host.ipAddress);
                }
            });
            
            // Set CurrentActivity to DDoSing
            group.currentActivity = 'DDoSing';
        }
    });

    // Notify about conflicts
    if (hasConflicts) {
        showNotification(`Resource conflict detected! Groups ${conflictGroups.join(', ')} are busy with other operations. Attack power reduced by 50%.`, 'warning');
    }

    // Calculate effective Operational Efficiency (EO) and Code Robustness (RC)
    let totalEffectivePower = 0;
    selectedBotGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            totalEffectivePower += calculateEffectiveGroupPowerForDDoS(group);
        }
    });

    // Create unique attack ID
    const attackId = `ddos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Start the attack with realistic routing
    const newAttack = {
        id: attackId,
        target: targetIp,
        flow: flow,
        botGroups: Array.from(selectedBotGroups),
        duration: duration,
        startTime: Date.now(),
        progress: 0,
        sourceIPs: attackSourceIPs,
        effectivePower: totalEffectivePower,
        hasConflicts: hasConflicts
    };

    activeDDoSAttacks.push(newAttack);

    showNotification(`DDoS attack launched against ${targetIp} using ${attackSourceIPs.length} bot sources from ${selectedBotGroups.size} groups`, 'info');
    updateMultiAttackStatus();
    
    // Apply attack effects immediately
    applyDDoSAttackEffects(newAttack);
    
    // Set up attack countdown with DIS tracking
    const attackInterval = setInterval(() => {
        updateAttackProgress(attackId);
        updateDDoSImpactTracking(attackId); // Add DIS tracking update
        
        const attack = activeDDoSAttacks.find(a => a.id === attackId);
        if (attack && attack.progress >= 100) {
            clearInterval(attackInterval);
            completeDDoSAttackEnhanced(attackId); // Use enhanced completion
        }
    }, 1000);

    saveState();
    updateUI();
    renderBotGroupSelection(); // Refresh to show updated CurrentActivity status
}

function isValidIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

function updateMultiAttackStatus() {
    const statusContainer = document.getElementById('multi-ddos-status');
    if (!statusContainer) return;

    if (activeDDoSAttacks.length === 0) {
        statusContainer.classList.add('hidden');
        // Enable launch button
        const launchBtn = document.getElementById('launch-ddos-btn');
        if (launchBtn) launchBtn.disabled = false;
        return;
    }

    statusContainer.classList.remove('hidden');
    
    let statusHTML = `
        <h4 class="text-lg font-semibold text-orange-300 mb-3">
            <i class="fas fa-crosshairs mr-2"></i>
            Active DDoS Attacks (${activeDDoSAttacks.length})
        </h4>
        <div class="space-y-3 max-h-60 overflow-y-auto">
    `;

    activeDDoSAttacks.forEach(attack => {
        const elapsed = Date.now() - attack.startTime;
        const remaining = Math.max(0, attack.duration - Math.floor(elapsed / 1000));
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const groupNames = attack.botGroups.join(', ');
        const sourceCount = attack.sourceIPs.length;
        
        statusHTML += `
            <div class="bg-gray-900/70 rounded-lg p-3 border border-orange-500">
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <div class="font-semibold text-white">Target: ${attack.target}</div>
                        <div class="text-xs text-gray-400">Groups: ${groupNames}</div>
                        <div class="text-xs text-gray-400">${sourceCount} bot sources</div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-orange-300">${timeString}</div>
                        <button class="text-xs text-red-400 hover:text-red-300 mt-1" onclick="stopDDoSAttack('${attack.id}')">
                            <i class="fas fa-stop mr-1"></i>Stop
                        </button>
                    </div>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full transition-all" style="width: ${attack.progress}%"></div>
                </div>
            </div>
        `;
    });

    statusHTML += '</div>';
    statusContainer.innerHTML = statusHTML;
    
    // Disable launch button if any attacks are running
    const launchBtn = document.getElementById('launch-ddos-btn');
    if (launchBtn) launchBtn.disabled = false; // Allow new attacks to be launched
}

function stopDDoSAttack(attackId) {
    const attackIndex = activeDDoSAttacks.findIndex(a => a.id === attackId);
    if (attackIndex === -1) return;
    
    const attack = activeDDoSAttacks[attackIndex];
    
    // Reset CurrentActivity to Idle for all participating groups
    attack.botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.currentActivity = 'Idle';
        }
    });
    
    // Remove attack from active list and clean up tracking
    activeDDoSAttacks.splice(attackIndex, 1);
    ddosImpactTracking.delete(attackId);
    
    showNotification(`DDoS attack against ${attack.target} stopped manually.`, 'info');
    
    updateMultiAttackStatus();
    saveState();
    updateUI();
    renderBotGroupSelection();
}

function updateAttackProgress(attackId) {
    const attack = activeDDoSAttacks.find(a => a.id === attackId);
    if (!attack) return;

    const elapsed = Date.now() - attack.startTime;
    const totalDuration = attack.duration * 1000;
    attack.progress = Math.min(100, (elapsed / totalDuration) * 100);

    // Update the UI for this specific attack
    updateMultiAttackStatus();
}

function applyDDoSAttackEffects(attack) {
    if (!attack) return;

    // Apply traceability increases to all participating hosts
    attack.botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    // Increase traceability based on attack duration
                    const traceIncrease = 5 + (attack.duration / 20);
                    host.traceabilityScore = Math.min(100, host.traceabilityScore + traceIncrease);
                    
                    // Small stability decrease
                    host.stabilityScore = Math.max(0, host.stabilityScore - (Math.random() * 3 + 1));
                    
                    addLogToHost(hostId, `Participating in DDoS attack against ${attack.target}`);
                }
            });
        }
    });
}

function addLogToAttackingSources(sourceIPs, message) {
    sourceIPs.forEach(ip => {
        const host = state.infectedHostPool.find(h => h.ipAddress === ip);
        if (host) {
            addLogToHost(host.id, message);
        }
    });
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

// ====================================================================
// DDoS IMPACT SYSTEM FUNCTIONS
// ====================================================================

/**
 * Update DDoS Impact tracking for an active attack
 * @param {string} attackId - Attack ID to update
 */
function updateDDoSImpactTracking(attackId) {
    const attack = activeDDoSAttacks.find(a => a.id === attackId);
    if (!attack) return;

    // Get current effective resources (may have changed due to cleaned hosts)
    const currentResources = calculateEffectiveDDoSResources(new Set(attack.botGroups));
    
    // Get DDoS flow parameters
    const ddosFlowParams = {
        attackPower: attack.flow.stats?.attack || 1000,
        completeness: attack.flow.fc || 100
    };

    // Get target defenses (with any temporary modifications)
    const targetDefenses = {
        ddosResistance: 50 + (attack.targetDefenseModifiers?.ddosResistance || 0)
    };

    // Calculate current DIS
    const elapsed = (Date.now() - attack.startTime) / 1000;
    const disResult = calculateDDoSImpactScore({
        effectiveResourcesDDoS: currentResources.totalPower,
        ddosFlowParams: ddosFlowParams,
        targetDefenses: targetDefenses,
        playerLevel: state.level,
        routingFactor: 0.8, // Could be enhanced with actual routing quality
        duration: elapsed
    });

    // Determine target status
    const targetStatus = determineTargetStatus(disResult.score, targetDefenses);
    
    // Get or create tracking data
    let trackingData = ddosImpactTracking.get(attackId);
    if (!trackingData) {
        trackingData = {
            disHistory: [],
            statusHistory: [],
            currentStatus: TARGET_STATUS.STABLE,
            statusDuration: 0,
            lastReactionCheck: Date.now()
        };
        ddosImpactTracking.set(attackId, trackingData);
    }

    // Update tracking data
    const now = Date.now();
    if (targetStatus !== trackingData.currentStatus) {
        // Status changed - reset duration
        trackingData.statusHistory.push({
            status: trackingData.currentStatus,
            duration: trackingData.statusDuration,
            timestamp: now
        });
        trackingData.currentStatus = targetStatus;
        trackingData.statusDuration = 0;
    } else {
        // Same status - increment duration
        trackingData.statusDuration += 1; // 1 second interval
    }

    // Add to DIS history (keep last 60 data points for 1-minute graph)
    trackingData.disHistory.push({
        timestamp: now,
        score: disResult.score,
        status: targetStatus
    });
    
    if (trackingData.disHistory.length > 60) {
        trackingData.disHistory.shift();
    }

    // Check for target reactions every 15 seconds
    if (now - trackingData.lastReactionCheck > 15000) {
        const reaction = simulateTargetReactions(targetStatus, attack.target, trackingData.statusDuration);
        if (reaction.triggered) {
            applyTargetReactions(attack, reaction);
            showNotification(reaction.description, 'warning');
            
            // Log the reaction
            addLogToAttackingSources(attack.sourceIPs.slice(0, 3), `Target reaction: ${reaction.description}`);
        }
        trackingData.lastReactionCheck = now;
    }

    // Update UI if visible
    updateDDoSStatusDisplay();
}

/**
 * Update the DDoS status display in the UI
 */
function updateDDoSStatusDisplay() {
    if (state.activePage !== 'botnet' || currentActiveTab !== 'ddos') return;

    // Update multi-attack status with DIS information
    updateMultiAttackStatusWithDIS();
    
    // Update any visible impact graphs
    updateDDoSImpactGraphs();
}

/**
 * Enhanced multi-attack status display with DIS information
 */
function updateMultiAttackStatusWithDIS() {
    const statusContainer = document.getElementById('multi-ddos-status');
    if (!statusContainer) return;

    if (activeDDoSAttacks.length === 0) {
        statusContainer.classList.add('hidden');
        return;
    }

    statusContainer.classList.remove('hidden');
    
    let statusHTML = `
        <h4 class="text-lg font-semibold text-orange-300 mb-3">
            <i class="fas fa-crosshairs mr-2"></i>
            Active DDoS Attacks (${activeDDoSAttacks.length})
        </h4>
        <div class="space-y-3 max-h-60 overflow-y-auto">
    `;

    activeDDoSAttacks.forEach(attack => {
        const elapsed = Date.now() - attack.startTime;
        const remaining = Math.max(0, attack.duration - Math.floor(elapsed / 1000));
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const groupNames = attack.botGroups.join(', ');
        const sourceCount = attack.sourceIPs.length;
        
        // Get DIS tracking data
        const trackingData = ddosImpactTracking.get(attack.id);
        const currentStatus = trackingData?.currentStatus || TARGET_STATUS.STABLE;
        const currentDIS = trackingData?.disHistory[trackingData.disHistory.length - 1]?.score || 0;
        const statusConfig = getStatusConfig(currentStatus);
        
        statusHTML += `
            <div class="bg-gray-900/70 rounded-lg p-3 border ${statusConfig.borderClass}">
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <div class="font-semibold text-white">Target: ${attack.target}</div>
                        <div class="text-xs text-gray-400">Groups: ${groupNames}</div>
                        <div class="text-xs text-gray-400">${sourceCount} bot sources</div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-orange-300">${timeString}</div>
                        <button class="text-xs text-red-400 hover:text-red-300 mt-1" onclick="stopDDoSAttack('${attack.id}')">
                            <i class="fas fa-stop mr-1"></i>Stop
                        </button>
                    </div>
                </div>
                
                <!-- DIS Status Display -->
                <div class="flex items-center space-x-2 mb-2">
                    <div class="w-3 h-3 rounded-full ${statusConfig.color === 'green' ? 'bg-green-400' : statusConfig.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'}"></div>
                    <span class="text-xs font-semibold ${statusConfig.textClass}">${statusConfig.label} - ${statusConfig.description}</span>
                    <span class="text-xs text-gray-400">DIS: ${currentDIS}</span>
                </div>
                
                <!-- Progress Bar -->
                <div class="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div class="bg-orange-500 h-2 rounded-full transition-all" style="width: ${attack.progress}%"></div>
                </div>
                
                <!-- Mini Impact Graph -->
                <div class="mini-impact-graph bg-gray-800/50 rounded p-2 h-12" data-attack-id="${attack.id}">
                    <canvas class="w-full h-full" id="mini-graph-${attack.id}"></canvas>
                </div>
            </div>
        `;
    });

    statusHTML += '</div>';
    statusContainer.innerHTML = statusHTML;
    
    // Update mini graphs
    activeDDoSAttacks.forEach(attack => {
        updateMiniImpactGraph(attack.id);
    });
}

/**
 * Update mini impact graph for an attack
 * @param {string} attackId - Attack ID
 */
function updateMiniImpactGraph(attackId) {
    const canvas = document.getElementById(`mini-graph-${attackId}`);
    if (!canvas) return;

    const trackingData = ddosImpactTracking.get(attackId);
    if (!trackingData || trackingData.disHistory.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const history = trackingData.disHistory;
    if (history.length < 2) return;

    // Find max DIS for scaling
    const maxDIS = Math.max(...history.map(h => h.score), 500);

    // Draw background grid
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw DIS line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    history.forEach((point, index) => {
        const x = (width / (history.length - 1)) * index;
        const y = height - (height * (point.score / maxDIS));
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw status color indicators
    history.forEach((point, index) => {
        const x = (width / (history.length - 1)) * index;
        const y = height - (height * (point.score / maxDIS));
        
        const statusConfig = getStatusConfig(point.status);
        ctx.fillStyle = statusConfig.color === 'green' ? '#10b981' : 
                       statusConfig.color === 'yellow' ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}

/**
 * Update all DDoS impact graphs
 */
function updateDDoSImpactGraphs() {
    activeDDoSAttacks.forEach(attack => {
        updateMiniImpactGraph(attack.id);
    });
}

/**
 * Enhanced attack completion with DIS tracking cleanup
 */
function completeDDoSAttackEnhanced(attackId) {
    const attackIndex = activeDDoSAttacks.findIndex(a => a.id === attackId);
    if (attackIndex === -1) return;

    const attack = activeDDoSAttacks[attackIndex];
    const trackingData = ddosImpactTracking.get(attackId);
    
    // Calculate final impact based on DIS history
    let avgDIS = 0;
    let maxStatus = TARGET_STATUS.STABLE;
    
    if (trackingData && trackingData.disHistory.length > 0) {
        avgDIS = trackingData.disHistory.reduce((sum, point) => sum + point.score, 0) / trackingData.disHistory.length;
        
        // Find highest status achieved
        trackingData.statusHistory.forEach(statusEntry => {
            if (statusEntry.status === TARGET_STATUS.DOWN) {
                maxStatus = TARGET_STATUS.DOWN;
            } else if (statusEntry.status === TARGET_STATUS.PARTIAL && maxStatus === TARGET_STATUS.STABLE) {
                maxStatus = TARGET_STATUS.PARTIAL;
            }
        });
        
        if (trackingData.currentStatus === TARGET_STATUS.DOWN) {
            maxStatus = TARGET_STATUS.DOWN;
        } else if (trackingData.currentStatus === TARGET_STATUS.PARTIAL && maxStatus === TARGET_STATUS.STABLE) {
            maxStatus = TARGET_STATUS.PARTIAL;
        }
    }
    
    // Reset CurrentActivity to Idle for all participating groups
    attack.botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.currentActivity = 'Idle';
        }
    });
    
    // Remove attack from active list and clean up tracking
    activeDDoSAttacks.splice(attackIndex, 1);
    ddosImpactTracking.delete(attackId);

    // Calculate enhanced success and rewards based on DIS performance
    const attackPower = attack.effectivePower || calculateTotalAttackPower(attack.botGroups);
    let baseSuccessRate = 0.8;
    const conflictPenalty = attack.hasConflicts ? 0.1 : 0;
    
    // Adjust success rate based on max status achieved
    if (maxStatus === TARGET_STATUS.DOWN) {
        baseSuccessRate = 0.95; // Very high success for complete saturation
    } else if (maxStatus === TARGET_STATUS.PARTIAL) {
        baseSuccessRate = 0.85; // Good success for partial impact
    }
    
    const finalSuccessRate = baseSuccessRate - conflictPenalty;
    const isSuccess = Math.random() < finalSuccessRate;

    // Prepare attack result for traceability system
    const attackResult = {
        status: isSuccess ? 'success' : 'failure',
        impact: avgDIS,
        duration: attack.duration,
        maxStatus: maxStatus
    };

    // Apply IP traceability to all participating hosts using the new system
    if (typeof handleDDoSTraceability === 'function') {
        const participatingHostIds = [];
        attack.botGroups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group && group.hostIds) {
                participatingHostIds.push(...group.hostIds);
            }
        });
        
        handleDDoSTraceability(participatingHostIds, attack.target, attackResult);
    }

    if (isSuccess) {
        // Enhanced rewards based on impact performance
        const statusMultiplier = maxStatus === TARGET_STATUS.DOWN ? 2.0 : 
                                maxStatus === TARGET_STATUS.PARTIAL ? 1.5 : 1.0;
        
        const xpGain = Math.floor((attackPower / 10) * statusMultiplier + (attack.duration / 10));
        addXp(xpGain);
        
        const btcReward = (attackPower / 1000) * 0.001 * statusMultiplier;
        state.btc += btcReward;
        
        const statusConfig = getStatusConfig(maxStatus);
        showNotification(`DDoS attack successful! Max status: ${statusConfig.label}. Gained ${xpGain} XP and ${btcReward.toFixed(6)} BTC`, 'success');
        
        addLogToAttackingSources(attack.sourceIPs, `DDoS attack completed successfully with max status: ${statusConfig.label}`);
    } else {
        // Enhanced failure handling
        const failureMessage = attack.hasConflicts ? 
            `DDoS attack failed! Resource conflicts reduced effectiveness. Max status reached: ${getStatusConfig(maxStatus).label}` : 
            `DDoS attack failed! Target defenses held strong. Max status reached: ${getStatusConfig(maxStatus).label}`;
        showNotification(failureMessage, 'error');
        
        // Apply consequences as before but consider achieved status
        attack.botGroups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                group.hostIds.forEach(hostId => {
                    const host = state.infectedHostPool.find(h => h.id === hostId);
                    if (host) {
                        let additionalTrace = attack.hasConflicts ? 15 : 10;
                        // Reduce penalty if we achieved some impact
                        if (maxStatus === TARGET_STATUS.PARTIAL) additionalTrace *= 0.7;
                        else if (maxStatus === TARGET_STATUS.DOWN) additionalTrace *= 0.5;
                        
                        host.traceabilityScore = Math.min(100, host.traceabilityScore + additionalTrace);
                        
                        if (host.traceabilityScore > 80 && Math.random() < 0.1) {
                            addLogToHost(hostId, 'Host compromised and lost due to failed DDoS attack');
                            deactivateHost(hostId, true);
                        }
                    }
                });
            }
        });
        
        addLogToAttackingSources(attack.sourceIPs, `DDoS attack failed with max status: ${getStatusConfig(maxStatus).label}`);
    }

    updateMultiAttackStatus();
    saveState();
    updateUI();
    renderInfectedHostsList();
    renderBotGroupSelection();
}

// ====================================================================
// END DDoS IMPACT SYSTEM FUNCTIONS
// ====================================================================

/**
 * Update DIS prediction preview based on current selection
 * @param {number} totalPower - Total effective power
 * @param {number} activeHosts - Number of active hosts
 */
function updateDISPreview(totalPower, activeHosts) {
    const previewContainer = document.getElementById('ddos-impact-preview');
    if (!previewContainer) return;

    const targetIp = document.getElementById('ddos-target-ip')?.value;
    const selectedFlowId = document.getElementById('ddos-flow-select')?.value;
    const duration = parseInt(document.getElementById('ddos-duration')?.value || '60');

    if (!targetIp || !selectedFlowId || activeHosts === 0) {
        previewContainer.classList.add('hidden');
        return;
    }

    const flow = getSavedFlowsAsArray().find(f => f.id === selectedFlowId);
    if (!flow) {
        previewContainer.classList.add('hidden');
        return;
    }

    // Calculate predicted DIS
    const ddosFlowParams = {
        attackPower: flow.stats?.attack || 1000,
        completeness: flow.fc || 100
    };

    const targetDefenses = {
        ddosResistance: 50 // Default resistance
    };

    const disResult = calculateDDoSImpactScore({
        effectiveResourcesDDoS: totalPower,
        ddosFlowParams: ddosFlowParams,
        targetDefenses: targetDefenses,
        playerLevel: state.level,
        routingFactor: 0.8,
        duration: duration
    });

    const predictedStatus = determineTargetStatus(disResult.score, targetDefenses);
    const statusConfig = getStatusConfig(predictedStatus);

    // Update UI
    document.getElementById('predicted-dis').textContent = disResult.score;
    document.getElementById('predicted-status-text').textContent = statusConfig.label;
    document.getElementById('predicted-status-text').className = `font-bold ${statusConfig.textClass}`;
    
    const indicator = document.getElementById('predicted-status-indicator');
    indicator.className = `w-3 h-3 rounded-full ${statusConfig.color === 'green' ? 'bg-green-400' : statusConfig.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'}`;

    previewContainer.classList.remove('hidden');
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



// ============================================================================
// MINING SYSTEM FUNCTIONS
// ============================================================================

function renderMiningGroups() {
    const container = document.getElementById('mining-groups-grid');
    if (!container) return;

    const groups = Object.keys(state.botnetGroups);
    
    if (groups.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center p-6 bg-gray-900/30 rounded-lg border border-gray-600">
                <i class="fas fa-layer-group text-3xl text-gray-500 mb-2"></i>
                <p class="text-gray-400">Nessun gruppo botnet disponibile</p>
                <p class="text-xs text-gray-500 mt-1">Crea gruppi dalla sezione Gestione Botnet</p>
            </div>
        `;
        return;
    }

    let html = '';
    groups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        const activeHosts = group.hostIds.filter(hostId => {
            const host = state.infectedHostPool.find(h => h.id === hostId);
            return host && host.status === 'Active';
        }).length;
        
        const totalPower = calculateGroupPower(group);
        const miningPower = calculateMiningPower(group); // Different from regular power
        const stability = calculateGroupStability(group);
        const isSelected = selectedMiningGroups.has(groupName);
        const isCurrentlyMining = activeMiningOperation && activeMiningOperation.groups.includes(groupName);
        
        // Check if this group is involved in any active DDoS attack
        const isInActiveDDoS = activeDDoSAttacks.some(attack => attack.botGroups.includes(groupName));
        const currentDDoSTarget = isInActiveDDoS ? activeDDoSAttacks.find(attack => attack.botGroups.includes(groupName))?.target : null;
        
        let statusText = '';
        let statusClass = '';
        let isDisabled = false;
        
        if (isCurrentlyMining) {
            statusText = 'Mining Active';
            statusClass = 'text-yellow-400';
        } else if (isInActiveDDoS) {
            statusText = `DDoSing ${currentDDoSTarget}`;
            statusClass = 'text-red-400';
            isDisabled = true;
        } else if (group.currentActivity === 'DDoSing') {
            statusText = 'DDoSing';
            statusClass = 'text-red-400';
            isDisabled = true;
        }
        
        html += `
            <div class="mining-group-card ${isSelected ? 'selected' : ''} ${isCurrentlyMining ? 'mining-active' : ''} ${isDisabled ? 'disabled' : ''}
                      bg-gray-800/70 border border-gray-600 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700/50" 
                 data-group-name="${groupName}">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <input type="checkbox" class="mining-group-checkbox mr-3" ${isSelected ? 'checked' : ''} 
                               ${isCurrentlyMining || isDisabled ? 'disabled' : ''}>
                        <h4 class="font-semibold text-white">${groupName}</h4>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${isCurrentlyMining ? '<i class="fas fa-cog fa-spin text-yellow-400"></i>' : ''}
                        ${isInActiveDDoS ? '<i class="fas fa-crosshairs text-red-400"></i>' : ''}
                        ${statusText ? `<span class="text-xs ${statusClass}">${statusText.length > 12 ? statusText.substring(0, 12) + '...' : statusText}</span>` : ''}
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span class="text-gray-400">Host Attivi:</span>
                        <span class="font-bold text-green-400">${activeHosts}/${group.hostIds.length}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Stabilità:</span>
                        <span class="font-bold ${getStabilityColor(stability)}">${stability.toFixed(0)}%</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Hash Rate:</span>
                        <span class="font-bold text-yellow-400">${miningPower.toFixed(1)} MH/s</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Tracciabilità:</span>
                        <span class="font-bold ${getTraceabilityColor(calculateGroupTraceability(group))}">${calculateGroupTraceability(group).toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('.mining-group-card:not(.disabled)').forEach(card => {
        const groupName = card.dataset.groupName;
        const isCurrentlyMining = activeMiningOperation && activeMiningOperation.groups.includes(groupName);
        
        if (!isCurrentlyMining) {
            card.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') return;
                
                const checkbox = card.querySelector('.mining-group-checkbox');
                
                if (selectedMiningGroups.has(groupName)) {
                    selectedMiningGroups.delete(groupName);
                    checkbox.checked = false;
                    card.classList.remove('selected');
                } else {
                    selectedMiningGroups.add(groupName);
                    checkbox.checked = true;
                    card.classList.add('selected');
                }
                
                updateMiningSelectedResources();
                updateMiningStats();
            });
            
            const checkbox = card.querySelector('.mining-group-checkbox');
            if (checkbox && !checkbox.disabled) {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        selectedMiningGroups.add(groupName);
                        card.classList.add('selected');
                    } else {
                        selectedMiningGroups.delete(groupName);
                        card.classList.remove('selected');
                    }
                    
                    updateMiningSelectedResources();
                    updateMiningStats();
                });
            }
        }
    });
}

function calculateMiningPower(group) {
    // Mining power is different from regular CPU power - based on specialized calculation
    let miningPower = 0;
    group.hostIds.forEach(hostId => {
        const host = state.infectedHostPool.find(h => h.id === hostId);
        if (host && host.status === 'Active' && host.resources) {
            // Mining power is roughly 10% of CPU power converted to MH/s
            miningPower += (host.resources.cpuPower * 0.1);
        }
    });
    return miningPower;
}

function calculateGroupStability(group) {
    if (group.hostIds.length === 0) return 0;
    
    let totalStability = 0;
    let validHosts = 0;
    
    group.hostIds.forEach(hostId => {
        const host = state.infectedHostPool.find(h => h.id === hostId);
        if (host && host.status === 'Active') {
            totalStability += (host.stabilityScore || 80); // Default stability if not set
            validHosts++;
        }
    });
    
    return validHosts > 0 ? totalStability / validHosts : 0;
}

function calculateGroupTraceability(group) {
    if (group.hostIds.length === 0) return 0;
    
    let totalTraceability = 0;
    let validHosts = 0;
    
    group.hostIds.forEach(hostId => {
        const host = state.infectedHostPool.find(h => h.id === hostId);
        if (host) {
            totalTraceability += (host.traceabilityScore || 0);
            validHosts++;
        }
    });
    
    return validHosts > 0 ? totalTraceability / validHosts : 0;
}

function getStabilityColor(stability) {
    if (stability >= 80) return 'text-green-400';
    if (stability >= 60) return 'text-yellow-400';
    if (stability >= 40) return 'text-orange-400';
    return 'text-red-400';
}

function getTraceabilityColor(traceability) {
    if (traceability <= 25) return 'text-green-400';
    if (traceability <= 50) return 'text-yellow-400';
    if (traceability <= 75) return 'text-orange-400';
    return 'text-red-400';
}

function updateMiningSelectedResources() {
    const hostCountEl = document.getElementById('mining-host-count');
    const activeCountEl = document.getElementById('mining-active-count');
    const powerTotalEl = document.getElementById('mining-power-total');
    const stabilityEl = document.getElementById('mining-stability');

    let totalHosts = 0;
    let activeHosts = 0;
    let totalMiningPower = 0;
    let totalStability = 0;
    let groupCount = 0;

    selectedMiningGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            totalHosts += group.hostIds.length;
            totalMiningPower += calculateMiningPower(group);
            totalStability += calculateGroupStability(group);
            groupCount++;
            
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    activeHosts++;
                }
            });
        }
    });

    const avgStability = groupCount > 0 ? totalStability / groupCount : 0;

    if (hostCountEl) hostCountEl.textContent = totalHosts;
    if (activeCountEl) activeCountEl.textContent = activeHosts;
    if (powerTotalEl) powerTotalEl.textContent = `${totalMiningPower.toFixed(1)} MH/s`;
    if (stabilityEl) {
        stabilityEl.textContent = `${avgStability.toFixed(0)}%`;
        stabilityEl.className = `font-bold ${getStabilityColor(avgStability)}`;
    }
}

function setupMiningControls() {
    const currencySelect = document.getElementById('mining-currency');
    const walletSelect = document.getElementById('mining-wallet');
    const toggleBtn = document.getElementById('toggle-mining-btn');
    
    // Enable clan wallet option if player has a clan
    const clanWalletOption = document.getElementById('clan-wallet-option');
    if (clanWalletOption && state.clan) {
        clanWalletOption.disabled = false;
        clanWalletOption.textContent = `Tesoreria del Clan (${state.clan.name || 'Clan'})`;
    }
    
    // Add event listeners
    if (currencySelect) {
        currencySelect.addEventListener('change', updateMiningStats);
    }
    
    if (walletSelect) {
        walletSelect.addEventListener('change', updateMiningStats);
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMining);
    }
}

function updateMiningStats() {
    const hourlyRateEl = document.getElementById('mining-hourly-rate');
    const dailyRateEl = document.getElementById('mining-daily-rate');
    const traceRiskEl = document.getElementById('mining-trace-risk');
    const lossRiskEl = document.getElementById('mining-loss-risk');
    const toggleBtn = document.getElementById('toggle-mining-btn');
    
    const currency = document.getElementById('mining-currency')?.value || 'btc';
    const selectedGroupsArray = Array.from(selectedMiningGroups);
    
    if (selectedGroupsArray.length === 0) {
        if (hourlyRateEl) hourlyRateEl.textContent = currency === 'btc' ? '0.000000 BTC' : '0.000 XMR';
        if (dailyRateEl) dailyRateEl.textContent = currency === 'btc' ? '0.000000 BTC' : '0.000 XMR';
        if (traceRiskEl) traceRiskEl.textContent = 'Nessuno';
        if (lossRiskEl) lossRiskEl.textContent = 'Nessuno';
        if (toggleBtn) toggleBtn.disabled = true;
        return;
    }
    
    // Calculate total mining power and other metrics
    let totalMiningPower = 0;
    let totalActiveHosts = 0;
    let avgStability = 0;
    let avgTraceability = 0;
    
    selectedGroupsArray.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            totalMiningPower += calculateMiningPower(group);
            avgStability += calculateGroupStability(group);
            avgTraceability += calculateGroupTraceability(group);
            
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    totalActiveHosts++;
                }
            });
        }
    });
    
    avgStability /= selectedGroupsArray.length;
    avgTraceability /= selectedGroupsArray.length;
    
    // Calculate earnings based on mining power and market conditions
    const hourlyRate = calculateMiningEarnings(totalMiningPower, avgStability, currency, 'hourly');
    const dailyRate = calculateMiningEarnings(totalMiningPower, avgStability, currency, 'daily');
    
    // Calculate risks
    const traceRisk = calculateMiningTraceRisk(totalActiveHosts, avgTraceability);
    const lossRisk = calculateMiningLossRisk(totalActiveHosts, avgStability);
    
    // Update UI
    if (hourlyRateEl) {
        hourlyRateEl.textContent = currency === 'btc' ? 
            `${hourlyRate.toFixed(6)} BTC` : 
            `${hourlyRate.toFixed(3)} XMR`;
    }
    if (dailyRateEl) {
        dailyRateEl.textContent = currency === 'btc' ? 
            `${dailyRate.toFixed(6)} BTC` : 
            `${dailyRate.toFixed(3)} XMR`;
    }
    if (traceRiskEl) {
        traceRiskEl.textContent = traceRisk;
        traceRiskEl.className = `font-bold ${getRiskColor(traceRisk)}`;
    }
    if (lossRiskEl) {
        lossRiskEl.textContent = lossRisk;
        lossRiskEl.className = `font-bold ${getRiskColor(lossRisk)}`;
    }
    
    // Enable toggle button if we have active hosts and no current mining operation
    if (toggleBtn) {
        toggleBtn.disabled = totalActiveHosts === 0 || (activeMiningOperation && !activeMiningOperation.groups.some(g => selectedGroupsArray.includes(g)));
    }
}

function calculateMiningEarnings(miningPower, stability, currency, timeframe) {
    // Base earnings calculation
    let baseRate = 0;
    
    if (currency === 'btc') {
        // Bitcoin mining is harder, lower rates
        baseRate = miningPower * 0.000001; // Very small rate per MH/s per hour
    } else {
        // Monero mining is easier with botnets
        baseRate = miningPower * 0.001; // Higher rate for XMR
    }
    
    // Apply stability modifier (50% to 150% based on stability)
    const stabilityModifier = 0.5 + (stability / 100);
    baseRate *= stabilityModifier;
    
    // Apply difficulty and market modifiers
    const difficultyModifier = 0.8 + (Math.random() * 0.4); // Simulated difficulty variance
    baseRate *= difficultyModifier;
    
    if (timeframe === 'daily') {
        return baseRate * 24;
    }
    
    return baseRate;
}

function calculateMiningTraceRisk(hostCount, avgTraceability) {
    const riskScore = (hostCount * 0.5) + (avgTraceability * 0.3);
    if (riskScore < 15) return 'Basso';
    if (riskScore < 35) return 'Medio';
    if (riskScore < 60) return 'Alto';
    return 'Critico';
}

function calculateMiningLossRisk(hostCount, avgStability) {
    const lossScore = (hostCount * 0.3) + ((100 - avgStability) * 0.4);
    if (lossScore < 20) return 'Basso';
    if (lossScore < 40) return 'Medio';
    if (lossScore < 70) return 'Alto';
    return 'Critico';
}

function toggleMining() {
    if (activeMiningOperation) {
        stopMining();
    } else {
        startMining();
    }
}

function startMining() {
    const currency = document.getElementById('mining-currency')?.value || 'btc';
    const wallet = document.getElementById('mining-wallet')?.value || 'personal';
    const selectedGroupsArray = Array.from(selectedMiningGroups);
    
    if (selectedGroupsArray.length === 0) {
        showNotification('Seleziona almeno un gruppo per iniziare il mining.', 'error');
        return;
    }
    
    // Check for conflicts with DDoS and Ransomware operations
    let hasConflicts = false;
    let conflictGroups = [];
    
    selectedGroupsArray.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group && (group.currentActivity === 'DDoSing' || group.currentActivity === 'Ransomware')) {
            hasConflicts = true;
            conflictGroups.push(groupName);
        }
        
        // Also check if any group is involved in an active DDoS attack
        const isInActiveDDoS = activeDDoSAttacks.some(attack => attack.botGroups.includes(groupName));
        if (isInActiveDDoS) {
            hasConflicts = true;
            const attack = activeDDoSAttacks.find(attack => attack.botGroups.includes(groupName));
            conflictGroups.push(`${groupName} (attacking ${attack.target})`);
        }
        
        // Also check if any group is involved in an active Ransomware operation
        const isInActiveRansomware = activeRansomwareOperations.some(op => op.botGroups.includes(groupName));
        if (isInActiveRansomware) {
            hasConflicts = true;
            conflictGroups.push(`${groupName} (Ransomware)`);
        }
    });
    
    if (hasConflicts) {
        showNotification(`Cannot start mining: Groups ${conflictGroups.join(', ')} are currently performing other operations.`, 'error');
        return;
    }
    
    // Calculate total active hosts
    let totalActiveHosts = 0;
    selectedGroupsArray.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            // Set currentActivity to Mining
            group.currentActivity = 'Mining';
            
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    totalActiveHosts++;
                }
            });
        }
    });
    
    if (totalActiveHosts === 0) {
        // Reset activity if no active hosts
        selectedGroupsArray.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                group.currentActivity = 'Idle';
            }
        });
        showNotification('Nessun host attivo nei gruppi selezionati.', 'error');
        return;
    }
    
    // Start mining operation
    activeMiningOperation = {
        currency: currency,
        wallet: wallet,
        groups: selectedGroupsArray,
        startTime: Date.now(),
        totalEarned: 0,
        lastRewardTime: Date.now()
    };
    
    // Initialize mining state if not exists
    if (!state.miningOperations) {
        state.miningOperations = [];
    }
    if (!state.miningLogs) {
        state.miningLogs = [];
    }
    
    // Add to state
    state.miningOperations.push(activeMiningOperation);
    
    // Add log entry
    addMiningLog(`[START] Mining ${currency.toUpperCase()} avviato con ${selectedGroupsArray.length} gruppi (${totalActiveHosts} host attivi)`);
    
    showNotification(`Mining ${currency.toUpperCase()} avviato con successo!`, 'success');
    
    updateMiningUI();
    renderBotGroupSelection(); // Refresh to show updated CurrentActivity status
    saveState();
}

function stopMining() {
    if (!activeMiningOperation) return;
    
    const operation = activeMiningOperation;
    const duration = Date.now() - operation.startTime;
    const durationHours = duration / (1000 * 60 * 60);
    
    // Apply mining traceability using the new system
    if (typeof handleMiningTraceability === 'function') {
        const participatingHostIds = [];
        operation.groups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group && group.hostIds) {
                participatingHostIds.push(...group.hostIds);
            }
        });
        
        // Duration in seconds for traceability calculation
        const durationSeconds = duration / 1000;
        handleMiningTraceability(participatingHostIds, durationSeconds);
    }
    
    // Reset CurrentActivity to Idle for all participating groups
    operation.groups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.currentActivity = 'Idle';
        }
    });
    
    // Final reward calculation
    processMiningRewards(true); // Force final reward
    
    // Add to completed operations log
    addMiningLog(`[STOP] Mining ${operation.currency.toUpperCase()} terminato dopo ${Math.floor(durationHours)}h. Totale guadagnato: ${operation.totalEarned.toFixed(6)}`);
    
    // Remove from state
    state.miningOperations = state.miningOperations.filter(op => op !== operation);
    activeMiningOperation = null;
    
    showNotification(`Mining terminato. Guadagno totale: ${operation.totalEarned.toFixed(6)} ${operation.currency.toUpperCase()}`, 'info');
    
    // Clear selections
    selectedMiningGroups.clear();
    
    updateMiningUI();
    renderMiningGroups();
    renderBotGroupSelection(); // Refresh to show updated CurrentActivity status
    updateMiningSelectedResources();
    saveState();
    updateUI();
}

function updateMiningUI() {
    const statusEl = document.getElementById('mining-status');
    const toggleBtn = document.getElementById('toggle-mining-btn');
    const currencyEl = document.getElementById('active-mining-currency');
    const uptimeEl = document.getElementById('mining-uptime');
    const totalEarnedEl = document.getElementById('mining-total-earned');
    const progressBarEl = document.getElementById('mining-progress-bar');
    
    if (activeMiningOperation) {
        // Show mining status
        if (statusEl) statusEl.classList.remove('hidden');
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-stop mr-2"></i>Ferma Mining';
            toggleBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
            toggleBtn.classList.add('bg-red-600', 'hover:bg-red-700');
        }
        
        // Update status info
        if (currencyEl) currencyEl.textContent = activeMiningOperation.currency.toUpperCase();
        
        const uptime = Date.now() - activeMiningOperation.startTime;
        if (uptimeEl) {
            const hours = Math.floor(uptime / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
            uptimeEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (totalEarnedEl) {
            const suffix = activeMiningOperation.currency === 'btc' ? 'BTC' : 'XMR';
            totalEarnedEl.textContent = `${activeMiningOperation.totalEarned.toFixed(6)} ${suffix}`;
        }
        
        // Animate progress bar
        if (progressBarEl) {
            const progress = (uptime % 10000) / 10000 * 100; // 10 second cycle
            progressBarEl.style.width = `${progress}%`;
        }
        
        // Disable group selection
        const groupCards = document.querySelectorAll('.mining-group-card');
        groupCards.forEach(card => {
            const groupName = card.dataset.groupName;
            if (activeMiningOperation.groups.includes(groupName)) {
                card.classList.add('mining-active');
                const checkbox = card.querySelector('.mining-group-checkbox');
                if (checkbox) checkbox.disabled = true;
            }
        });
        
    } else {
        // Hide mining status
        if (statusEl) statusEl.classList.add('hidden');
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Avvia Mining';
            toggleBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
            toggleBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');
        }
    }
}

function addMiningLog(message) {
    if (!state.miningLogs) state.miningLogs = [];
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        timestamp: timestamp,
        message: message,
        time: Date.now()
    };
    
    state.miningLogs.unshift(logEntry); // Add to beginning
    
    // Keep only last 50 log entries
    if (state.miningLogs.length > 50) {
        state.miningLogs = state.miningLogs.slice(0, 50);
    }
    
    updateMiningLogsDisplay();
}

function updateMiningLogsDisplay() {
    const logsContainer = document.getElementById('mining-logs');
    if (!logsContainer) return;
    
    if (!state.miningLogs || state.miningLogs.length === 0) {
        logsContainer.innerHTML = '<div class="text-gray-500">[SYSTEM] Nessuna operazione di mining in corso.</div>';
        return;
    }
    
    const html = state.miningLogs.slice(0, 10).map(log => 
        `<div class="text-gray-300">[${log.timestamp}] ${log.message}</div>`
    ).join('');
    
    logsContainer.innerHTML = html;
}

// Process mining rewards periodically - should be called from main.js
function processMiningRewards(forceFinal = false) {
    if (!activeMiningOperation) return;
    
    const now = Date.now();
    const timeSinceLastReward = now - activeMiningOperation.lastRewardTime;
    
    // Process rewards every 30 seconds (or force for final calculation)
    if (timeSinceLastReward >= 30000 || forceFinal) {
        const hoursElapsed = timeSinceLastReward / (1000 * 60 * 60);
        
        // Calculate mining power for current operation
        let totalMiningPower = 0;
        let avgStability = 0;
        let totalActiveHosts = 0;
        
        activeMiningOperation.groups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                totalMiningPower += calculateMiningPower(group);
                avgStability += calculateGroupStability(group);
                
                group.hostIds.forEach(hostId => {
                    const host = state.infectedHostPool.find(h => h.id === hostId);
                    if (host && host.status === 'Active') {
                        totalActiveHosts++;
                    }
                });
            }
        });
        
        if (activeMiningOperation.groups.length > 0) {
            avgStability /= activeMiningOperation.groups.length;
        }
        
        if (totalActiveHosts > 0) {
            // Calculate reward for this period
            const reward = calculateMiningEarnings(totalMiningPower, avgStability, activeMiningOperation.currency, 'hourly') * hoursElapsed;
            
            if (reward > 0) {
                // Add to appropriate wallet
                if (activeMiningOperation.wallet === 'clan' && state.clan) {
                    if (activeMiningOperation.currency === 'btc') {
                        state.clan.btc = (state.clan.btc || 0) + reward;
                    } else {
                        state.clan.xmr = (state.clan.xmr || 0) + reward;
                    }
                } else {
                    if (activeMiningOperation.currency === 'btc') {
                        state.btc += reward;
                    } else {
                        state.xmr += reward;
                    }
                }
                
                activeMiningOperation.totalEarned += reward;
                activeMiningOperation.lastRewardTime = now;
                
                // Add reward log
                if (!forceFinal) {
                    addMiningLog(`[REWARD] +${reward.toFixed(6)} ${activeMiningOperation.currency.toUpperCase()} (${totalActiveHosts} host attivi)`);
                }
                
                // Apply mining risks
                applyMiningRisks();
                
                updateUI();
                saveState();
            }
        } else {
            // No active hosts - add warning log
            if (!forceFinal) {
                addMiningLog(`[WARNING] Nessun host attivo nei gruppi selezionati`);
            }
        }
    }
}

// Auto-process mining rewards every 30 seconds
setInterval(processMiningRewards, 30000);

function applyMiningRisks() {
    if (!activeMiningOperation) return;
    
    // Apply risks to participating hosts
    activeMiningOperation.groups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    // Gradual traceability increase (very small per reward cycle)
                    const traceIncrease = 0.5 + (Math.random() * 0.5);
                    host.traceabilityScore = Math.min(100, host.traceabilityScore + traceIncrease);
                    
                    // Small stability decrease
                    const stabilityDecrease = Math.random() * 0.3;
                    host.stabilityScore = Math.max(0, host.stabilityScore - stabilityDecrease);
                    
                    // Very small chance of host disconnection if traceability is high
                    if (host.traceabilityScore > 90 && Math.random() < 0.001) {
                        addMiningLog(`[RISK] Host ${host.ipAddress} disconnesso per alta tracciabilità`);
                        host.status = 'Offline';
                        addLogToHost(hostId, 'Host disconnesso durante mining per alta tracciabilità');
                    }
                }
            });
        }
    });
}

// ============================================================================
// RANSOMWARE SYSTEM FUNCTIONS
// ============================================================================

function renderRansomwareBotGroupSelection() {
    const container = document.getElementById('ransomware-botgroup-selection');
    if (!container) return;

    const groups = Object.keys(state.botnetGroups);
    
    if (groups.length === 0) {
        container.innerHTML = `
            <div class="text-center p-4 bg-gray-900/30 rounded-lg border border-gray-600">
                <i class="fas fa-exclamation-triangle text-yellow-400 text-2xl mb-2"></i>
                <p class="text-gray-400">Nessun gruppo botnet disponibile</p>
                <p class="text-xs text-gray-500 mt-1">Crea gruppi dalla sezione Gestione Botnet</p>
            </div>
        `;
        return;
    }

    let html = '';
    groups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        const activeHosts = group.hostIds.filter(hostId => {
            const host = state.infectedHostPool.find(h => h.id === hostId);
            return host && host.status === 'Active';
        }).length;
        
        const totalHosts = group.hostIds.length;
        const isSelected = selectedRansomwareGroups.has(groupName);
        const currentActivity = group.currentActivity || 'Idle';
        
        // Check if this group is involved in any active operations
        const isInActiveDDoS = activeDDoSAttacks.some(attack => attack.botGroups.includes(groupName));
        const isInActiveMining = activeMiningOperation && activeMiningOperation.groups.includes(groupName);
        const isInActiveRansomware = activeRansomwareOperations.some(op => op.botGroups.includes(groupName));
        
        let statusText = '';
        let statusClass = '';
        let isDisabled = false;
        
        if (isInActiveRansomware) {
            statusText = 'Ransomware Active';
            statusClass = 'text-red-400';
        } else if (isInActiveMining) {
            statusText = 'Mining Active';
            statusClass = 'text-yellow-400';
            isDisabled = true;
        } else if (isInActiveDDoS) {
            const attack = activeDDoSAttacks.find(attack => attack.botGroups.includes(groupName));
            statusText = `DDoSing ${attack?.target || ''}`;
            statusClass = 'text-red-400';
            isDisabled = true;
        }
        
        html += `
            <div class="ransomware-group-card ${isSelected ? 'selected' : ''} ${isInActiveRansomware ? 'ransomware-active' : ''} ${isDisabled ? 'disabled' : ''}
                      bg-gray-800/70 border border-gray-600 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700/50" 
                 data-group-name="${groupName}">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <input type="checkbox" class="ransomware-group-checkbox mr-3" ${isSelected ? 'checked' : ''} 
                               ${isInActiveRansomware || isDisabled ? 'disabled' : ''}>
                        <h4 class="font-semibold text-white">${groupName}</h4>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${isInActiveRansomware ? '<i class="fas fa-lock text-red-400"></i>' : ''}
                        ${isInActiveMining ? '<i class="fas fa-cog fa-spin text-yellow-400"></i>' : ''}
                        ${isInActiveDDoS ? '<i class="fas fa-crosshairs text-red-400"></i>' : ''}
                        ${statusText ? `<span class="text-xs ${statusClass}">${statusText.length > 15 ? statusText.substring(0, 15) + '...' : statusText}</span>` : ''}
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span class="text-gray-400">Host Attivi:</span>
                        <span class="font-bold text-green-400">${activeHosts}/${totalHosts}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Potenza:</span>
                        <span class="font-bold text-red-400">${calculateGroupCryptoPower(group).toFixed(1)} GFLOPS</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Stabilità:</span>
                        <span class="font-bold ${getStabilityColor(calculateGroupStability(group))}">${calculateGroupStability(group).toFixed(0)}%</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Tracciabilità:</span>
                        <span class="font-bold ${getTraceabilityColor(calculateGroupTraceability(group))}">${calculateGroupTraceability(group).toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('.ransomware-group-card:not(.disabled)').forEach(card => {
        const groupName = card.dataset.groupName;
        const isInActiveRansomware = activeRansomwareOperations.some(op => op.botGroups.includes(groupName));
        
        if (!isInActiveRansomware) {
            card.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') return;
                
                const checkbox = card.querySelector('.ransomware-group-checkbox');
                
                if (selectedRansomwareGroups.has(groupName)) {
                    selectedRansomwareGroups.delete(groupName);
                    checkbox.checked = false;
                    card.classList.remove('selected');
                } else {
                    selectedRansomwareGroups.add(groupName);
                    checkbox.checked = true;
                    card.classList.add('selected');
                }
                
                updateRansomwareSelectedResources();
                updateRansomwarePARPreview();
            });
            
            const checkbox = card.querySelector('.ransomware-group-checkbox');
            if (checkbox && !checkbox.disabled) {
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        selectedRansomwareGroups.add(groupName);
                        card.classList.add('selected');
                    } else {
                        selectedRansomwareGroups.delete(groupName);
                        card.classList.remove('selected');
                    }
                    
                    updateRansomwareSelectedResources();
                    updateRansomwarePARPreview();
                });
            }
        }
    });
}

function calculateGroupCryptoPower(group) {
    // Crypto power is the same as regular CPU power for ransomware operations
    return calculateGroupPower(group);
}

function updateRansomwareSelectedResources() {
    const hostCountEl = document.getElementById('ransomware-host-count');
    const activeCountEl = document.getElementById('ransomware-active-count');
    const cryptoPowerEl = document.getElementById('ransomware-crypto-power');
    const stabilityEl = document.getElementById('ransomware-stability');

    let totalHosts = 0;
    let activeHosts = 0;
    let totalCryptoPower = 0;
    let totalStability = 0;
    let groupCount = 0;

    selectedRansomwareGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            totalHosts += group.hostIds.length;
            totalCryptoPower += calculateGroupCryptoPower(group);
            totalStability += calculateGroupStability(group);
            groupCount++;
            
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    activeHosts++;
                }
            });
        }
    });

    const avgStability = groupCount > 0 ? totalStability / groupCount : 0;

    if (hostCountEl) hostCountEl.textContent = totalHosts;
    if (activeCountEl) activeCountEl.textContent = activeHosts;
    if (cryptoPowerEl) cryptoPowerEl.textContent = `${totalCryptoPower.toFixed(1)} GFLOPS`;
    if (stabilityEl) {
        stabilityEl.textContent = `${avgStability.toFixed(0)}%`;
        stabilityEl.className = `font-bold ${getStabilityColor(avgStability)}`;
    }
    
    // Enable/disable launch button
    const launchBtn = document.getElementById('launch-ransomware-btn');
    if (launchBtn) {
        const selectedFlow = document.getElementById('ransomware-flow-select')?.value;
        launchBtn.disabled = !(activeHosts > 0 && selectedFlow);
    }
}

function renderRansomwareFlowOptions() {
    const select = document.getElementById('ransomware-flow-select');
    if (!select) return;

    const flows = getSavedFlowsAsArray();
    const ransomwareFlows = flows.filter(flow => isRansomwareFlow(flow));

    let optionsHtml = '<option value="">-- Seleziona Flusso Ransomware --</option>';
    
    if (ransomwareFlows.length === 0) {
        if (flows.length === 0) {
            optionsHtml += '<option value="" disabled>Nessun flusso disponibile. Crea flussi nell\'Editor prima.</option>';
        } else {
            optionsHtml += '<option value="" disabled>Nessun flusso ransomware disponibile. Crea flussi con obiettivo ransomware.</option>';
        }
    } else {
        ransomwareFlows.forEach(flow => {
            const objective = flow.objective || 'ransomware';
            const powerLevel = flow.stats?.attack ? Math.floor(flow.stats.attack / 50000) : 1;
            const powerIndicator = '★'.repeat(Math.min(powerLevel, 5)) + '☆'.repeat(Math.max(0, 5 - powerLevel));
            optionsHtml += `<option value="${flow.id}">${flow.name} (${objective}) ${powerIndicator}</option>`;
        });
    }

    select.innerHTML = optionsHtml;

    // Add event listeners
    select.addEventListener('change', updateRansomwarePARPreview);
    
    const targetTypeSelect = document.getElementById('ransomware-target-type');
    if (targetTypeSelect) {
        targetTypeSelect.addEventListener('change', updateRansomwarePARPreview);
    }
    
    const dataSensitivitySelect = document.getElementById('ransomware-data-sensitivity');
    if (dataSensitivitySelect) {
        dataSensitivitySelect.addEventListener('change', updateRansomwarePARPreview);
    }
    
    const amountInput = document.getElementById('ransomware-amount');
    if (amountInput) {
        amountInput.addEventListener('input', updateRansomwarePARPreview);
    }
    
    const strategySelect = document.getElementById('ransomware-strategy');
    if (strategySelect) {
        strategySelect.addEventListener('change', updateRansomwarePARPreview);
    }
    
    const launchBtn = document.getElementById('launch-ransomware-btn');
    if (launchBtn) {
        launchBtn.addEventListener('click', launchRansomwareOperation);
    }
}

function isRansomwareFlow(flow) {
    if (!flow) return false;
    
    // Check if flow objective is explicitly set to ransomware
    if (flow.objective === 'ransomware') {
        return true;
    }
    
    // Check if flow contains ransomware-specific blocks
    if (!flow.blocks) return false;
    
    const ransomwareBlocks = [
        'Sviluppa ransomware semplice',
        'Crittografa payload',
        'Crea tool eseguibile'
    ];
    
    return flow.blocks.some(block => {
        const blockType = typeof block === 'string' ? block : block.type;
        return ransomwareBlocks.includes(blockType);
    });
}

function updateRansomwarePARPreview() {
    const probabilityEl = document.getElementById('par-probability');
    const responseTimeEl = document.getElementById('par-response-time');
    const traceRiskEl = document.getElementById('par-trace-risk');
    const expectedGainEl = document.getElementById('par-expected-gain');
    
    const targetType = document.getElementById('ransomware-target-type')?.value || 'individual';
    const dataSensitivity = document.getElementById('ransomware-data-sensitivity')?.value || 'low';
    const ransomAmount = parseFloat(document.getElementById('ransomware-amount')?.value || '0.1');
    const strategy = document.getElementById('ransomware-strategy')?.value || 'fast';
    const selectedFlow = document.getElementById('ransomware-flow-select')?.value;
    
    if (!selectedFlow || selectedRansomwareGroups.size === 0) {
        if (probabilityEl) probabilityEl.textContent = '0%';
        if (responseTimeEl) responseTimeEl.textContent = '0h';
        if (traceRiskEl) traceRiskEl.textContent = 'N/A';
        if (expectedGainEl) expectedGainEl.textContent = '0.000 BTC';
        return;
    }
    
    // Calculate PAR (Probability of Acceptance Rate)
    const par = calculateRansomAcceptanceProbability(targetType, dataSensitivity, ransomAmount, strategy);
    
    // Calculate expected response time
    const responseTime = calculateRansomResponseTime(targetType, dataSensitivity);
    
    // Calculate traceability risk
    const traceRisk = calculateRansomwareTraceRisk(targetType, strategy, selectedRansomwareGroups.size);
    
    // Calculate expected gain
    const expectedGain = ransomAmount * (par.probability / 100);
    
    // Update UI
    if (probabilityEl) {
        probabilityEl.textContent = `${par.probability.toFixed(1)}%`;
        probabilityEl.className = `font-bold ${par.probability > 70 ? 'text-green-400' : par.probability > 40 ? 'text-yellow-400' : 'text-red-400'}`;
    }
    if (responseTimeEl) responseTimeEl.textContent = `${responseTime}h`;
    if (traceRiskEl) {
        traceRiskEl.textContent = traceRisk;
        traceRiskEl.className = `font-bold ${getRiskColor(traceRisk)}`;
    }
    if (expectedGainEl) expectedGainEl.textContent = `${expectedGain.toFixed(3)} BTC`;
    
    // Update launch button state
    const launchBtn = document.getElementById('launch-ransomware-btn');
    if (launchBtn) {
        const hasActiveHosts = selectedRansomwareGroups.size > 0;
        launchBtn.disabled = !(hasActiveHosts && selectedFlow);
    }
}

function calculateRansomAcceptanceProbability(targetType, dataSensitivity, amount, strategy) {
    // Base probability by target type
    const targetProbabilities = {
        'individual': 65,
        'small_business': 45,
        'corporation': 25,
        'government': 10,
        'hospital': 80,
        'education': 55
    };
    
    let baseProbability = targetProbabilities[targetType] || 50;
    
    // Data sensitivity modifier
    const sensitivityModifiers = {
        'low': 0.8,
        'medium': 1.0,
        'high': 1.2,
        'critical': 1.4
    };
    
    baseProbability *= sensitivityModifiers[dataSensitivity] || 1.0;
    
    // Amount modifier (higher amounts reduce probability)
    if (amount > 1.0) {
        baseProbability *= 0.7;
    } else if (amount > 0.5) {
        baseProbability *= 0.85;
    } else if (amount < 0.05) {
        baseProbability *= 1.1;
    }
    
    // Strategy modifier
    const strategyModifiers = {
        'fast': 0.9, // Less convincing but faster
        'thorough': 1.1, // More convincing due to complete encryption
        'selective': 1.0 // Balanced approach
    };
    
    baseProbability *= strategyModifiers[strategy] || 1.0;
    
    // Random factor
    const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
    baseProbability *= randomFactor;
    
    return {
        probability: Math.min(95, Math.max(5, baseProbability)),
        factors: {
            targetType,
            dataSensitivity,
            amount,
            strategy
        }
    };
}

function calculateRansomResponseTime(targetType, dataSensitivity) {
    const baseResponseTimes = {
        'individual': 2, // 2 hours
        'small_business': 8,
        'corporation': 24,
        'government': 72,
        'hospital': 1, // Very fast due to urgency
        'education': 12
    };
    
    let responseTime = baseResponseTimes[targetType] || 12;
    
    // Data sensitivity affects urgency
    const sensitivityMultipliers = {
        'low': 1.5,
        'medium': 1.0,
        'high': 0.7,
        'critical': 0.5
    };
    
    responseTime *= sensitivityMultipliers[dataSensitivity] || 1.0;
    
    return Math.max(1, Math.round(responseTime));
}

function calculateRansomwareTraceRisk(targetType, strategy, groupCount) {
    let riskScore = 0;
    
    // Target type risk
    const targetRisks = {
        'individual': 10,
        'small_business': 20,
        'corporation': 40,
        'government': 80,
        'hospital': 60,
        'education': 30
    };
    
    riskScore += targetRisks[targetType] || 30;
    
    // Strategy risk
    const strategyRisks = {
        'fast': 15,
        'thorough': 35,
        'selective': 25
    };
    
    riskScore += strategyRisks[strategy] || 25;
    
    // Group count risk
    riskScore += groupCount * 5;
    
    if (riskScore < 25) return 'Basso';
    if (riskScore < 50) return 'Medio';
    if (riskScore < 75) return 'Alto';
    return 'Critico';
}

function launchRansomwareOperation() {
    const selectedFlow = document.getElementById('ransomware-flow-select')?.value;
    const targetType = document.getElementById('ransomware-target-type')?.value || 'individual';
    const dataSensitivity = document.getElementById('ransomware-data-sensitivity')?.value || 'low';
    const ransomAmount = parseFloat(document.getElementById('ransomware-amount')?.value || '0.1');
    const strategy = document.getElementById('ransomware-strategy')?.value || 'fast';
    
    const selectedGroupsArray = Array.from(selectedRansomwareGroups);
    
    if (selectedGroupsArray.length === 0) {
        showNotification('Seleziona almeno un gruppo bot per lanciare l\'operazione ransomware.', 'error');
        return;
    }
    
    if (!selectedFlow) {
        showNotification('Seleziona un flusso ransomware valido.', 'error');
        return;
    }
    
    const flow = getSavedFlowsAsArray().find(f => f.id === selectedFlow);
    if (!flow) {
        showNotification('Flusso ransomware non trovato.', 'error');
        return;
    }
    
    // Check for conflicts with other operations
    let hasConflicts = false;
    let conflictGroups = [];
    
    selectedGroupsArray.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group && (group.currentActivity === 'DDoSing' || group.currentActivity === 'Mining')) {
            hasConflicts = true;
            conflictGroups.push(`${groupName} (${group.currentActivity})`);
        }
        
        const isInActiveDDoS = activeDDoSAttacks.some(attack => attack.botGroups.includes(groupName));
        const isInActiveMining = activeMiningOperation && activeMiningOperation.groups.includes(groupName);
        
        if (isInActiveDDoS || isInActiveMining) {
            hasConflicts = true;
            const activity = isInActiveDDoS ? 'DDoS' : 'Mining';
            conflictGroups.push(`${groupName} (${activity})`);
        }
    });
    
    if (hasConflicts) {
        showNotification(`Impossibile avviare ransomware: Gruppi ${conflictGroups.join(', ')} sono impegnati in altre operazioni.`, 'error');
        return;
    }
    
    // Calculate operation parameters
    let totalActiveHosts = 0;
    let totalCryptoPower = 0;
    
    selectedGroupsArray.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            // Set currentActivity to Ransomware
            group.currentActivity = 'Ransomware';
            totalCryptoPower += calculateGroupCryptoPower(group);
            
            group.hostIds.forEach(hostId => {
                const host = state.infectedHostPool.find(h => h.id === hostId);
                if (host && host.status === 'Active') {
                    totalActiveHosts++;
                }
            });
        }
    });
    
    if (totalActiveHosts === 0) {
        // Reset activity if no active hosts
        selectedGroupsArray.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                group.currentActivity = 'Idle';
            }
        });
        showNotification('Nessun host attivo nei gruppi selezionati.', 'error');
        return;
    }
    
    // Calculate operation duration based on strategy
    const strategyDurations = {
        'fast': 30, // 30 seconds
        'thorough': 180, // 3 minutes  
        'selective': 90 // 1.5 minutes
    };
    
    const duration = strategyDurations[strategy] || 90;
    
    // Create ransomware operation
    const operationId = `ransomware_${Date.now()}`;
    const operation = {
        id: operationId,
        botGroups: selectedGroupsArray,
        targetType: targetType,
        dataSensitivity: dataSensitivity,
        ransomAmount: ransomAmount,
        strategy: strategy,
        flow: flow,
        startTime: Date.now(),
        duration: duration,
        cryptoPower: totalCryptoPower,
        activeHosts: totalActiveHosts,
        progress: 0,
        phase: 'encryption' // encryption -> ransom_sent -> awaiting_response -> completed
    };
    
    activeRansomwareOperations.push(operation);
    
    // Initialize ransomware state if not exists
    if (!state.ransomwareOperations) {
        state.ransomwareOperations = [];
    }
    if (!state.ransomRequests) {
        state.ransomRequests = [];
    }
    
    // Add to state
    state.ransomwareOperations.push(operation);
    
    showNotification(`Operazione ransomware avviata con ${selectedGroupsArray.length} gruppi (${totalActiveHosts} host attivi).`, 'success');
    
    // Clear selections
    selectedRansomwareGroups.clear();
    
    // Start operation timer
    setTimeout(() => {
        completeRansomwareEncryption(operationId);
    }, duration * 1000);
    
    renderRansomwareBotGroupSelection();
    updateRansomwareSelectedResources();
    renderActiveRansomwareOperations();
    saveState();
    updateUI();
}

function completeRansomwareEncryption(operationId) {
    const operationIndex = activeRansomwareOperations.findIndex(op => op.id === operationId);
    if (operationIndex === -1) return;
    
    const operation = activeRansomwareOperations[operationIndex];
    
    // Calculate encryption success rate
    const baseSuccessRate = 0.85;
    const powerBonus = Math.min(0.1, operation.cryptoPower / 10000); // Up to 10% bonus
    const finalSuccessRate = baseSuccessRate + powerBonus;
    
    const isSuccess = Math.random() < finalSuccessRate;
    
    if (isSuccess) {
        // Encryption successful, create ransom request
        const requestId = `ransom_${Date.now()}`;
        const par = calculateRansomAcceptanceProbability(
            operation.targetType, 
            operation.dataSensitivity, 
            operation.ransomAmount, 
            operation.strategy
        );
        
        const responseTime = calculateRansomResponseTime(operation.targetType, operation.dataSensitivity);
        
        const ransomRequest = {
            id: requestId,
            operationId: operationId,
            targetType: operation.targetType,
            dataSensitivity: operation.dataSensitivity,
            amount: operation.ransomAmount,
            probability: par.probability,
            sentTime: Date.now(),
            responseTime: responseTime * 3600000, // Convert hours to milliseconds
            status: 'awaiting_response',
            botGroups: operation.botGroups
        };
        
        activeRansomRequests.push(ransomRequest);
        state.ransomRequests.push(ransomRequest);
        
        // Update operation phase
        operation.phase = 'ransom_sent';
        operation.progress = 100;
        
        showNotification(`Crittografia completata! Richiesta di riscatto inviata per ${operation.ransomAmount} BTC.`, 'success');
        
        // Set timer for ransom response and store timeout ID
        ransomRequest.timeoutId = setTimeout(() => {
            processRansomResponse(requestId);
        }, responseTime * 3600000);
        
        // Apply traceability increase to participating hosts
        applyRansomwareTraceability(operation);
        
    } else {
        // Encryption failed
        showNotification(`Operazione ransomware fallita! Rilevate contromisure di sicurezza.`, 'error');
        
        // Apply failure consequences
        operation.botGroups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                group.hostIds.forEach(hostId => {
                    const host = state.infectedHostPool.find(h => h.id === hostId);
                    if (host) {
                        // Increase traceability for failed operation
                        host.traceabilityScore = Math.min(100, host.traceabilityScore + 15 + Math.random() * 10);
                        // Decrease stability
                        host.stabilityScore = Math.max(0, host.stabilityScore - (5 + Math.random() * 10));
                        
                        addLogToHost(hostId, 'Operazione ransomware fallita - rilevate contromisure');
                        
                        // Small chance of host being compromised
                        if (host.traceabilityScore > 85 && Math.random() < 0.15) {
                            addLogToHost(hostId, 'Host compromesso e perso a causa del fallimento ransomware');
                            deactivateHost(hostId, true);
                        }
                    }
                });
            }
        });
        
        // Remove failed operation
        activeRansomwareOperations.splice(operationIndex, 1);
        operation.phase = 'failed';
    }
    
    // Reset CurrentActivity to Idle for all participating groups
    operation.botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.currentActivity = 'Idle';
        }
    });
    
    renderActiveRansomwareOperations();
    renderRansomRequestsStatus();
    renderRansomwareBotGroupSelection();
    saveState();
    updateUI();
}

function processRansomResponse(requestId) {
    const requestIndex = activeRansomRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    const request = activeRansomRequests[requestIndex];
    
    // Determine if ransom is accepted based on calculated probability
    const isAccepted = Math.random() * 100 < request.probability;
    
    if (isAccepted) {
        // Ransom accepted - add Bitcoin to player wallet
        state.btc += request.amount;
        
        showNotification(`🎉 Riscatto accettato! Ricevuti ${request.amount} BTC nel portafoglio.`, 'success');
        
        request.status = 'accepted';
        
        // Add XP based on target difficulty
        const xpRewards = {
            'individual': 20,
            'small_business': 35,
            'corporation': 60,
            'government': 100,
            'hospital': 50,
            'education': 30
        };
        
        const xpGain = xpRewards[request.targetType] || 25;
        addXp(xpGain);
        
    } else {
        // Ransom rejected
        showNotification(`❌ Riscatto rifiutato. Il target ha scelto di non pagare.`, 'error');
        
        request.status = 'rejected';
        
        // Apply additional consequences for rejection
        request.botGroups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                group.hostIds.forEach(hostId => {
                    const host = state.infectedHostPool.find(h => h.id === hostId);
                    if (host) {
                        // Additional traceability increase for rejection
                        host.traceabilityScore = Math.min(100, host.traceabilityScore + 5);
                        addLogToHost(hostId, 'Riscatto rifiutato - aumentata attenzione delle autorità');
                    }
                });
            }
        });
    }
    
    // Remove from active requests
    activeRansomRequests.splice(requestIndex, 1);
    
    // Find and complete the corresponding operation
    const operationIndex = activeRansomwareOperations.findIndex(op => op.id === request.operationId);
    if (operationIndex !== -1) {
        const operation = activeRansomwareOperations[operationIndex];
        operation.phase = 'completed';
        operation.result = isAccepted ? 'accepted' : 'rejected';
        
        // Remove from active operations after a delay
        setTimeout(() => {
            const finalIndex = activeRansomwareOperations.findIndex(op => op.id === request.operationId);
            if (finalIndex !== -1) {
                activeRansomwareOperations.splice(finalIndex, 1);
                renderActiveRansomwareOperations();
            }
        }, 10000); // Keep visible for 10 seconds
    }
    
    renderActiveRansomwareOperations();
    renderRansomRequestsStatus();
    saveState();
    updateUI();
}

function instantCompleteRansom(requestId) {
    const requestIndex = activeRansomRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    const request = activeRansomRequests[requestIndex];
    
    // Check if player has enough Monero
    if (state.xmr < 10) {
        showNotification('Servono 10 XMR per completare istantaneamente il riscatto!', 'error');
        return;
    }
    
    // Deduct 10 XMR from player balance
    state.xmr -= 10;
    
    // Clear the existing timeout
    clearTimeout(request.timeoutId);
    
    // Remove the request from active requests
    activeRansomRequests.splice(requestIndex, 1);
    
    // Determine if ransom is accepted based on calculated probability (same logic as processRansomResponse)
    const isAccepted = Math.random() * 100 < request.probability;
    
    if (isAccepted) {
        // Ransom accepted - add Bitcoin to player wallet
        state.btc += request.amount;
        
        showNotification(`🎉 Completamento istantaneo riuscito! Ricevuti ${request.amount} BTC nel portafoglio. (-10 XMR)`, 'success');
        
        request.status = 'accepted';
        
        // Add XP based on target difficulty
        const xpRewards = {
            'individual': 20,
            'small_business': 35,
            'corporation': 60,
            'government': 100,
            'hospital': 50,
            'education': 30
        };
        
        if (state.xp !== undefined && xpRewards[request.targetType]) {
            state.xp += xpRewards[request.targetType];
        }
        
    } else {
        // Ransom rejected
        showNotification(`❌ Completamento istantaneo fallito: il riscatto è stato rifiutato. (-10 XMR)`, 'error');
        request.status = 'rejected';
    }
    
    // Apply traceability effects based on target type
    const traceabilityIncrease = {
        'individual': 2,
        'small_business': 3,
        'corporation': 5,
        'government': 8,
        'hospital': 4,
        'education': 3
    };
    
    const increase = traceabilityIncrease[request.targetType] || 3;
    if (state.traceabilityScore !== undefined) {
        state.traceabilityScore = Math.min(100, state.traceabilityScore + increase);
    }
    
    // Update UI
    renderRansomRequestsStatus();
    saveState();
    updateUI();
}

function accelerateRansomResponse(requestId) {
    const requestIndex = activeRansomRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    const request = activeRansomRequests[requestIndex];
    
    // Check if player has enough XMR
    if (state.xmr < 25) {
        showNotification('Servono 25 XMR per accelerare la risposta a 30 secondi!', 'error');
        return;
    }
    
    // Check if already accelerated (response time is 30 seconds or less)
    const remaining = Math.max(0, request.responseTime - (Date.now() - request.sentTime));
    if (remaining <= 30000) {
        showNotification('La richiesta è già stata accelerata o è in scadenza!', 'error');
        return;
    }
    
    // Deduct 25 XMR from player balance
    state.xmr -= 25;
    
    // Clear the existing timeout
    clearTimeout(request.timeoutId);
    
    // Update the request to have a 30-second response time from now
    request.responseTime = 30000; // 30 seconds in milliseconds
    request.sentTime = Date.now(); // Reset sent time to now
    request.accelerated = true; // Mark as accelerated
    
    // Set new timeout for 30 seconds
    request.timeoutId = setTimeout(() => {
        processRansomResponse(requestId);
    }, 30000);
    
    showNotification(`⚡ Risposta accelerata a 30 secondi! (-25 XMR)`, 'success');
    
    // Update UI elements
    renderRansomRequestsStatus();
    saveState();
    updateUI();
}

function applyRansomwareTraceability(operation) {
    // Apply ransomware traceability using the existing system if available
    if (typeof handleRansomwareTraceability === 'function') {
        const participatingHostIds = [];
        operation.botGroups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group && group.hostIds) {
                participatingHostIds.push(...group.hostIds);
            }
        });
        
        handleRansomwareTraceability(participatingHostIds, operation);
    } else {
        // Fallback manual traceability application
        const traceabilityIncrease = calculateRansomwareTraceabilityIncrease(operation);
        
        operation.botGroups.forEach(groupName => {
            const group = state.botnetGroups[groupName];
            if (group) {
                group.hostIds.forEach(hostId => {
                    const host = state.infectedHostPool.find(h => h.id === hostId);
                    if (host && host.status === 'Active') {
                        host.traceabilityScore = Math.min(100, host.traceabilityScore + traceabilityIncrease);
                        addLogToHost(hostId, `Partecipazione a operazione ransomware - tracciabilità aumentata di ${traceabilityIncrease}`);
                    }
                });
            }
        });
    }
}

function calculateRansomwareTraceabilityIncrease(operation) {
    let baseIncrease = 10;
    
    // Target type modifier
    const targetModifiers = {
        'individual': 0.5,
        'small_business': 0.7,
        'corporation': 1.0,
        'government': 2.0,
        'hospital': 1.5,
        'education': 0.8
    };
    
    baseIncrease *= targetModifiers[operation.targetType] || 1.0;
    
    // Strategy modifier
    const strategyModifiers = {
        'fast': 0.8,
        'thorough': 1.2,
        'selective': 1.0
    };
    
    baseIncrease *= strategyModifiers[operation.strategy] || 1.0;
    
    // Amount modifier (higher amounts attract more attention)
    if (operation.ransomAmount > 1.0) {
        baseIncrease *= 1.5;
    } else if (operation.ransomAmount > 0.5) {
        baseIncrease *= 1.2;
    }
    
    return Math.round(baseIncrease);
}

function renderActiveRansomwareOperations() {
    const container = document.getElementById('active-ransomware-operations');
    if (!container) return;
    
    if (activeRansomwareOperations.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    activeRansomwareOperations.forEach(operation => {
        const elapsed = Date.now() - operation.startTime;
        const progress = operation.phase === 'encryption' ? 
            Math.min(100, (elapsed / (operation.duration * 1000)) * 100) : 100;
        
        let statusText = '';
        let statusClass = '';
        let statusIcon = '';
        let showCancelButton = false;
        
        switch (operation.phase) {
            case 'encryption':
                statusText = 'Crittografia in corso...';
                statusClass = 'text-yellow-400';
                statusIcon = 'fa-spinner fa-spin';
                showCancelButton = true;
                break;
            case 'ransom_sent':
                statusText = 'Richiesta inviata';
                statusClass = 'text-blue-400';
                statusIcon = 'fa-envelope';
                showCancelButton = true;
                break;
            case 'completed':
                statusText = operation.result === 'accepted' ? 'Riscatto pagato!' : 'Riscatto rifiutato';
                statusClass = operation.result === 'accepted' ? 'text-green-400' : 'text-red-400';
                statusIcon = operation.result === 'accepted' ? 'fa-check-circle' : 'fa-times-circle';
                break;
            case 'failed':
                statusText = 'Operazione fallita';
                statusClass = 'text-red-400';
                statusIcon = 'fa-exclamation-triangle';
                break;
        }
        
        const groupNames = operation.botGroups.join(', ');
        
        html += `
            <div class="bg-red-900/50 rounded-lg p-4 border border-red-500">
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <div class="font-semibold text-white">Target: ${operation.targetType}</div>
                        <div class="text-xs text-gray-400">Gruppi: ${groupNames}</div>
                        <div class="text-xs text-gray-400">${operation.activeHosts} host attivi</div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-red-300">${operation.ransomAmount} BTC</div>
                        <div class="text-xs ${statusClass}">
                            <i class="fas ${statusIcon} mr-1"></i>
                            ${statusText}
                        </div>
                        ${showCancelButton ? `
                            <button class="text-xs text-red-400 hover:text-red-300 mt-1" onclick="stopRansomwareOperation('${operation.id}')">
                                <i class="fas fa-stop mr-1"></i>Stop
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                ${operation.phase === 'encryption' ? `
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-red-500 h-2 rounded-full transition-all" style="width: ${progress}%"></div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderRansomRequestsStatus() {
    const container = document.getElementById('ransom-requests-status');
    const listContainer = document.getElementById('ransom-requests-list');
    
    if (!container || !listContainer) return;
    
    if (activeRansomRequests.length === 0) {
        container.classList.add('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    
    let html = '';
    activeRansomRequests.forEach(request => {
        const elapsed = Date.now() - request.sentTime;
        const remaining = Math.max(0, request.responseTime - elapsed);
        const remainingHours = Math.floor(remaining / 3600000);
        const remainingMinutes = Math.floor((remaining % 3600000) / 60000);
        
        const canInstantComplete = state.xmr >= 10;
        const canAccelerate = state.xmr >= 25 && remaining > 30000 && !request.accelerated;
        
        html += `
            <div class="bg-indigo-800/50 rounded-lg p-3 border border-indigo-400">
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <div class="font-semibold text-white">${request.targetType} - ${request.amount} BTC</div>
                        <div class="text-xs text-gray-400">Probabilità: ${request.probability.toFixed(1)}%</div>
                        ${request.accelerated ? '<div class="text-xs text-yellow-400">⚡ Accelerata</div>' : ''}
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-indigo-300">
                            ${remainingHours}h ${remainingMinutes}m
                        </div>
                        <div class="text-xs text-gray-400">rimanenti</div>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-xs text-gray-400">
                        Saldo XMR: ${state.xmr.toFixed(1)}
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            class="text-xs px-2 py-1 rounded ${canAccelerate ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}" 
                            onclick="accelerateRansomResponse('${request.id}')"
                            ${!canAccelerate ? 'disabled' : ''}
                            title="${canAccelerate ? 'Accelera risposta a 30 secondi per 25 XMR' : request.accelerated ? 'Già accelerata' : remaining <= 30000 ? 'Già in scadenza' : 'Servono 25 XMR per accelerare'}"
                        >
                            <i class="fas fa-clock mr-1"></i>Accelera (25 XMR)
                        </button>
                        <button 
                            class="text-xs px-2 py-1 rounded ${canInstantComplete ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}" 
                            onclick="instantCompleteRansom('${request.id}')"
                            ${!canInstantComplete ? 'disabled' : ''}
                            title="${canInstantComplete ? 'Completa istantaneamente per 10 XMR' : 'Servono 10 XMR per completare istantaneamente'}"
                        >
                            <i class="fas fa-bolt mr-1"></i>Completa Subito (10 XMR)
                        </button>
                    </div>
                </div>
            </div>`;
    });
    
    listContainer.innerHTML = html;
}

function stopRansomwareOperation(operationId) {
    const operationIndex = activeRansomwareOperations.findIndex(op => op.id === operationId);
    if (operationIndex === -1) return;
    
    const operation = activeRansomwareOperations[operationIndex];
    
    // Reset CurrentActivity to Idle for all participating groups
    operation.botGroups.forEach(groupName => {
        const group = state.botnetGroups[groupName];
        if (group) {
            group.currentActivity = 'Idle';
        }
    });
    
    // Remove the operation from active operations
    activeRansomwareOperations.splice(operationIndex, 1);
    
    // Also remove any pending ransom requests for this operation
    const requestIndex = activeRansomRequests.findIndex(req => req.operationId === operationId);
    if (requestIndex !== -1) {
        clearTimeout(activeRansomRequests[requestIndex].timeoutId);
        activeRansomRequests.splice(requestIndex, 1);
    }
    
    // Refresh the UI
    renderActiveRansomwareOperations();
    renderRansomRequestsStatus();
    renderRansomwareBotGroupSelection();
    renderBotGroupSelection(); // Update the main bot group selection too
    
    showNotification('Operazione ransomware annullata.', 'info');
    saveState();
}
