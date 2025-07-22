// File: js/modules/botnet.js
// VERSIONE CON LOGICA DI SUCCESSO E RICOMPENSE BASATA SULL'OBIETTIVO DEL FLUSSO

let selectedHostIds = new Set();

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
    renderInfectedHostsList();
    updateBotnetAggregateStats();
    renderHostDetailsPanel();
}

function updateBotnetAggregateStats() {
    const container = document.getElementById('botnet-aggregate-stats');
    if (!container) return;

    const totalHosts = state.infectedHostPool.length;
    const activeHosts = state.infectedHostPool.filter(h => h.status === 'Active').length;

    let aggregatePower = 0;
    state.infectedHostPool.forEach(host => {
        if (host.status === 'Active' && host.resources) {
            aggregatePower += host.resources.cpuPower;
        }
    });

    container.innerHTML = `
        <div class="text-center">
            <div class="text-xs text-gray-400">TOTAL HOSTS</div>
            <div class="text-2xl font-bold text-white">${totalHosts}</div>
        </div>
        <div class="text-center">
            <div class="text-xs text-gray-400">ACTIVE HOSTS</div>
            <div class="text-2xl font-bold text-green-400">${activeHosts}</div>
        </div>
        <div class="text-center">
            <div class="text-xs text-gray-400">AGGREGATE POWER</div>
            <div class="text-2xl font-bold text-purple-400">${aggregatePower.toFixed(2)} GFLOPS</div>
        </div>
    `;
    
    const countEl = document.getElementById('infected-host-count');
    if(countEl) countEl.textContent = totalHosts;
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
    
    const flowName = flowId ? (getSavedFlowsAsArray().find(f => f.id === flowId)?.name || 'Sconosciuto') : 'Nessuno';
    host.hookedFlows[slotIndex] = flowId || null;
    
    addLogToHost(hostId, `Flusso "${flowName}" agganciato allo slot ${slotIndex + 1}.`);
    showNotification(`Flusso "${flowName}" agganciato.`, "info");
    
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
                case 'propagation':
                    logMessage += " Operazione completata ma le condizioni di rete non erano favorevoli alla propagazione.";
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
                        value: parseFloat(btcValue.toFixed(6))
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
                        value: parseFloat(btcValue.toFixed(6))
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

        case 'propagation':
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
        modal.classList.add('hidden');
    });

    modal.classList.remove('hidden');
}

function propagateFromHost(hostId) {
    const host = state.infectedHostPool.find(h => h.id === hostId);
    if (!host) return;

    const flowId = host.hookedFlows?.[0];
    const flow = flowId ? getSavedFlowsAsArray().find(f => f.id === flowId) : null;

    if (!flow || flow.objective !== 'propagation') {
        showNotification("È necessario un flusso con obiettivo 'Propagazione' per questa azione.", "error");
        addLogToHost(hostId, "Tentativo di propagazione fallito: obiettivo del flusso non corretto.");
        return;
    }

    showNotification(`Tentativo di propagazione da ${host.ipAddress}...`, "info");
    addLogToHost(hostId, `Avvio propagazione con il flusso "${flow.name}"...`);

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
