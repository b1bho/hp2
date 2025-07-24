// Enhanced Intelligence Console with Advanced Data Analysis
let currentAnalysisData = null;
let analysisInProgress = false;
let currentFilters = {
    category: '',
    source: '',
    purity: 0,
    sensitivity: ''
};

function initIntelligencePage() {
    setupIntelligenceUI();
    loadAnalysisFlows();
    renderDataPacketsList();
    renderFolderView();
}

function setupIntelligenceUI() {
    // Filter event listeners
    const categoryFilter = document.getElementById('category-filter');
    const sourceFilter = document.getElementById('source-filter');
    const purityFilter = document.getElementById('purity-filter');
    const sensitivityFilter = document.getElementById('sensitivity-filter');
    const purityValue = document.getElementById('purity-value');
    
    if (purityFilter && purityValue) {
        purityFilter.addEventListener('input', (e) => {
            purityValue.textContent = e.target.value + '%';
        });
    }
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // View toggle buttons
    const viewListBtn = document.getElementById('view-list');
    const viewFoldersBtn = document.getElementById('view-folders');
    
    if (viewListBtn) {
        viewListBtn.addEventListener('click', () => toggleView('list'));
    }
    if (viewFoldersBtn) {
        viewFoldersBtn.addEventListener('click', () => toggleView('folders'));
    }
    
    // Analysis flow selection
    const analysisFlowSelect = document.getElementById('analysis-flow');
    if (analysisFlowSelect) {
        analysisFlowSelect.addEventListener('change', updateAnalysisAvailability);
    }
    
    // Analysis buttons
    const startAnalysisBtn = document.getElementById('start-analysis');
    const stopAnalysisBtn = document.getElementById('stop-analysis');
    
    if (startAnalysisBtn) {
        startAnalysisBtn.addEventListener('click', startDataAnalysis);
    }
    if (stopAnalysisBtn) {
        stopAnalysisBtn.addEventListener('click', stopDataAnalysis);
    }
}

function loadAnalysisFlows() {
    const analysisFlowSelect = document.getElementById('analysis-flow');
    if (!analysisFlowSelect) return;
    
    // Get saved flows that have reconnaissance objective
    // permanentFlows is an object with flow names as keys and flow data as values
    const analysisFlows = [];
    if (state.permanentFlows && typeof state.permanentFlows === 'object') {
        Object.keys(state.permanentFlows).forEach(flowName => {
            const flowData = state.permanentFlows[flowName];
            if (isAnalysisFlow(flowData)) {
                // Add flow name to the flow data for display
                analysisFlows.push({
                    ...flowData,
                    name: flowName,
                    id: flowName
                });
            }
        });
    }
    
    // Clear existing options
    analysisFlowSelect.innerHTML = '<option value="">Seleziona un flusso di analisi...</option>';
    
    // Add reconnaissance flows
    analysisFlows.forEach(flow => {
        const option = document.createElement('option');
        option.value = flow.id;
        option.textContent = `${flow.name} (Robustezza: ${calculateFlowRobustness(flow)}%)`;
        analysisFlowSelect.appendChild(option);
    });
    
    // Show message if no reconnaissance flows are available
    if (analysisFlows.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nessun flusso di ricognizione disponibile - Crea un flusso con obiettivo "Ricognizione / Intelligence"';
        option.disabled = true;
        analysisFlowSelect.appendChild(option);
    }
}

function isAnalysisFlow(flow) {
    // Check if flow has reconnaissance/intelligence objective
    return flow && flow.objective === 'reconnaissance';
}

function calculateFlowRobustness(flow) {
    if (!flow || !flow.blocks) return 0;
    
    let baseRobustness = 20;
    const blockBonuses = {
        'Python': 15,
        'Database': 20,
        'Analisi Comportamentale (AI)': 25,
        'Analisi Vulnerabilità (AI)': 30,
        'Estrai Pattern (Regex)': 15,
        'Filtra Dati per Attributo': 10
    };
    
    flow.blocks.forEach(block => {
        Object.keys(blockBonuses).forEach(bonusBlock => {
            if (block.type && block.type.includes(bonusBlock)) {
                baseRobustness += blockBonuses[bonusBlock];
            }
        });
    });
    
    return Math.min(baseRobustness, 95); // Cap at 95%
}

function updateAnalysisAvailability() {
    const analysisFlowSelect = document.getElementById('analysis-flow');
    const startAnalysisBtn = document.getElementById('start-analysis');
    
    if (analysisFlowSelect && startAnalysisBtn) {
        const hasFlow = analysisFlowSelect.value !== '';
        const hasData = currentAnalysisData !== null;
        startAnalysisBtn.disabled = !(hasFlow && hasData);
    }
}

function addDataPacketCategory(packet) {
    // Assign category based on packet name and description
    if (!packet.category) {
        const name = (packet.name || '').toLowerCase();
        const desc = (packet.description || '').toLowerCase();
        
        if (name.includes('credenziali') || name.includes('password') || name.includes('login') || 
            desc.includes('password') || desc.includes('username')) {
            packet.category = 'credentials';
        } else if (name.includes('documento') || name.includes('file') || name.includes('report') ||
                   desc.includes('documento') || desc.includes('report')) {
            packet.category = 'documents';
        } else if (name.includes('log') || name.includes('metadata') || name.includes('sistema') ||
                   desc.includes('log') || desc.includes('evento')) {
            packet.category = 'logs';
        } else if (name.includes('rete') || name.includes('ip') || name.includes('network') ||
                   desc.includes('rete') || desc.includes('traffico')) {
            packet.category = 'network';
        } else if (name.includes('finanziari') || name.includes('banca') || name.includes('conto') ||
                   desc.includes('finanziari') || desc.includes('transazione')) {
            packet.category = 'financial';
        } else if (name.includes('personali') || name.includes('anagrafica') || name.includes('cliente') ||
                   desc.includes('personali') || desc.includes('anagrafica')) {
            packet.category = 'personal';
        } else {
            packet.category = 'documents'; // Default category
        }
    }
    return packet;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'credentials': 'Credenziali',
        'documents': 'Documenti',
        'logs': 'Log & Metadati',
        'network': 'Dati di Rete',
        'financial': 'Dati Finanziari',
        'personal': 'Dati Personali'
    };
    return categoryNames[category] || 'Altri';
}

function getCategoryIcon(category) {
    const categoryIcons = {
        'credentials': 'fas fa-key',
        'documents': 'fas fa-file-alt',
        'logs': 'fas fa-list-ul',
        'network': 'fas fa-network-wired',
        'financial': 'fas fa-dollar-sign',
        'personal': 'fas fa-user'
    };
    return categoryIcons[category] || 'fas fa-file';
}

function renderFolderView() {
    const container = document.getElementById('folder-view');
    if (!container) return;

    const allData = getAllDataPackets();
    
    if (allData.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun archivio dati disponibile.</p>`;
        return;
    }

    // Group data by category
    const categorizedData = {};
    allData.forEach(packet => {
        addDataPacketCategory(packet);
        if (!categorizedData[packet.category]) {
            categorizedData[packet.category] = [];
        }
        categorizedData[packet.category].push(packet);
    });

    // Render folder structure
    let folderHTML = '';
    Object.keys(categorizedData).forEach(category => {
        const categoryData = categorizedData[category];
        const categoryName = getCategoryDisplayName(category);
        const categoryIcon = getCategoryIcon(category);
        
        folderHTML += `
            <div class="folder-category mb-3">
                <div class="folder-header flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer" 
                     onclick="toggleFolder('${category}')">
                    <div class="flex items-center">
                        <i class="${categoryIcon} text-indigo-400 mr-3"></i>
                        <span class="font-medium text-white">${categoryName}</span>
                        <span class="ml-2 px-2 py-1 bg-gray-600 text-xs rounded-full">${categoryData.length}</span>
                    </div>
                    <i class="fas fa-chevron-down folder-chevron text-gray-400 transition-transform" id="chevron-${category}"></i>
                </div>
                <div class="folder-content ml-6 mt-2 space-y-2 hidden" id="folder-${category}">
                    ${categoryData.map(packet => `
                        <div class="data-item flex items-center justify-between p-2 bg-black/20 hover:bg-black/40 rounded cursor-pointer" 
                             onclick="selectDataPacket('${packet.id}')">
                            <div class="flex-1">
                                <p class="font-medium text-white text-sm">${packet.name}</p>
                                <p class="text-xs text-gray-400">
                                    ${packet.source} • Purezza: ${packet.purity.toFixed(1)}% • ${packet.sensitivity}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-yellow-400">${(packet.value || 0).toFixed(3)} BTC</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = folderHTML;
}

function toggleFolder(category) {
    const folderContent = document.getElementById(`folder-${category}`);
    const chevron = document.getElementById(`chevron-${category}`);
    
    if (folderContent && chevron) {
        folderContent.classList.toggle('hidden');
        chevron.classList.toggle('rotate-180');
    }
}

function selectDataPacket(packetId) {
    const allData = getAllDataPackets();
    const packet = allData.find(p => p.id === packetId);
    
    if (packet) {
        currentAnalysisData = packet;
        renderAnalysisInterface(packet);
        updateAnalysisAvailability();
        
        // Highlight selected packet
        document.querySelectorAll('.data-item').forEach(item => {
            item.classList.remove('ring-2', 'ring-indigo-500');
        });
        
        const selectedItem = document.querySelector(`[onclick="selectDataPacket('${packetId}')"]`);
        if (selectedItem) {
            selectedItem.classList.add('ring-2', 'ring-indigo-500');
        }
    }
}

function getAllDataPackets() {
    const personalData = (state.dataLocker?.personal || []).map(p => ({ ...p, source: 'PC Personale' }));
    const clanData = (state.dataLocker?.clan || []).map(c => ({ ...c.data, source: `Server Clan #${c.serverId}` }));
    
    return [...personalData, ...clanData];
}

function renderDataPacketsList() {
    const container = document.getElementById('data-packets-list');
    if (!container) return;

    const allData = getAllDataPackets();
    
    if (allData.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">Nessun archivio dati disponibile.</p>`;
        return;
    }

    // Apply filters
    const filteredData = applyDataFilters(allData);

    container.innerHTML = filteredData.map(packet => {
        addDataPacketCategory(packet);
        const categoryIcon = getCategoryIcon(packet.category);
        
        return `
            <div class="data-card p-3 rounded-lg cursor-pointer hover:border-indigo-500 border border-gray-600" 
                 data-packet-id="${packet.id}" onclick="selectDataPacket('${packet.id}')">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <i class="${categoryIcon} text-indigo-400 mr-2"></i>
                            <p class="font-semibold text-white">${packet.name}</p>
                        </div>
                        <p class="text-xs text-gray-400 mb-1">Fonte: ${packet.source}</p>
                        <div class="flex items-center space-x-3 text-xs">
                            <span class="text-gray-500">Purezza: <span class="text-indigo-300">${packet.purity.toFixed(1)}%</span></span>
                            <span class="text-gray-500">Sensibilità: <span class="text-indigo-300">${packet.sensitivity}</span></span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-yellow-400 font-mono text-sm">${(packet.value || 0).toFixed(3)} BTC</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function applyDataFilters(data) {
    return data.filter(packet => {
        addDataPacketCategory(packet);
        
        // Category filter
        if (currentFilters.category && packet.category !== currentFilters.category) {
            return false;
        }
        
        // Source filter
        if (currentFilters.source) {
            const sourceCheck = currentFilters.source === 'personal' ? 
                packet.source.includes('PC Personale') : 
                packet.source.includes('Server Clan');
            if (!sourceCheck) return false;
        }
        
        // Purity filter
        if (packet.purity < currentFilters.purity) {
            return false;
        }
        
        // Sensitivity filter
        if (currentFilters.sensitivity && packet.sensitivity !== currentFilters.sensitivity) {
            return false;
        }
        
        return true;
    });
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sourceFilter = document.getElementById('source-filter');
    const purityFilter = document.getElementById('purity-filter');
    const sensitivityFilter = document.getElementById('sensitivity-filter');
    
    currentFilters = {
        category: categoryFilter?.value || '',
        source: sourceFilter?.value || '',
        purity: parseInt(purityFilter?.value || 0),
        sensitivity: sensitivityFilter?.value || ''
    };
    
    renderDataPacketsList();
    renderFolderView();
}

function clearFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sourceFilter = document.getElementById('source-filter');
    const purityFilter = document.getElementById('purity-filter');
    const sensitivityFilter = document.getElementById('sensitivity-filter');
    const purityValue = document.getElementById('purity-value');
    
    if (categoryFilter) categoryFilter.value = '';
    if (sourceFilter) sourceFilter.value = '';
    if (purityFilter) {
        purityFilter.value = 0;
        if (purityValue) purityValue.textContent = '0%';
    }
    if (sensitivityFilter) sensitivityFilter.value = '';
    
    currentFilters = {
        category: '',
        source: '',
        purity: 0,
        sensitivity: ''
    };
    
    renderDataPacketsList();
    renderFolderView();
}

function toggleView(viewType) {
    const listView = document.getElementById('data-packets-list');
    const folderView = document.getElementById('folder-view');
    const listBtn = document.getElementById('view-list');
    const foldersBtn = document.getElementById('view-folders');
    
    if (!listView || !folderView || !listBtn || !foldersBtn) return;
    
    if (viewType === 'list') {
        listView.classList.remove('hidden');
        folderView.classList.add('hidden');
        listBtn.classList.add('bg-indigo-600', 'text-white');
        listBtn.classList.remove('bg-gray-700');
        foldersBtn.classList.remove('bg-indigo-600', 'text-white');
        foldersBtn.classList.add('bg-gray-700');
        renderDataPacketsList();
    } else {
        listView.classList.add('hidden');
        folderView.classList.remove('hidden');
        foldersBtn.classList.add('bg-indigo-600', 'text-white');
        foldersBtn.classList.remove('bg-gray-700');
        listBtn.classList.remove('bg-indigo-600', 'text-white');
        listBtn.classList.add('bg-gray-700');
        renderFolderView();
    }
}

function renderAnalysisInterface(packet) {
    const container = document.getElementById('analysis-interface');
    if (!container) return;
    
    addDataPacketCategory(packet);
    const valueInBtc = packet.value || 0;
    const categoryIcon = getCategoryIcon(packet.category);
    const categoryName = getCategoryDisplayName(packet.category);

    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <i class="${categoryIcon} text-indigo-400 mr-3 text-xl"></i>
                <div>
                    <h3 class="text-xl font-semibold text-white">${packet.name}</h3>
                    <p class="text-sm text-gray-400">${categoryName} • ${packet.source}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-lg font-mono text-yellow-400">${valueInBtc.toFixed(3)} BTC</p>
                <p class="text-xs text-gray-500">Valore stimato</p>
            </div>
        </div>
        
        <p class="text-sm text-gray-300 mb-6">${packet.description}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-black/20 p-4 rounded-lg">
                <div class="flex items-center justify-between">
                    <span class="text-gray-500 text-sm">Purezza</span>
                    <span class="text-indigo-300 font-mono">${packet.purity.toFixed(2)}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div class="bg-indigo-600 h-2 rounded-full" style="width: ${packet.purity}%"></div>
                </div>
            </div>
            <div class="bg-black/20 p-4 rounded-lg">
                <div class="flex items-center justify-between">
                    <span class="text-gray-500 text-sm">Sensibilità</span>
                    <span class="text-indigo-300">${packet.sensitivity}</span>
                </div>
                ${getSensitivityIndicator(packet.sensitivity)}
            </div>
            <div class="bg-black/20 p-4 rounded-lg">
                <div class="flex items-center justify-between">
                    <span class="text-gray-500 text-sm">Potenziale IP</span>
                    <span class="text-green-400">${estimateIpPotential(packet)}%</span>
                </div>
                <p class="text-xs text-gray-400 mt-1">Prob. scoperta IP rari</p>
            </div>
        </div>

        <!-- Legacy keyword search -->
        <div class="bg-gray-700/50 p-4 rounded-lg">
            <h4 class="font-semibold mb-3 text-indigo-300">Ricerca Rapida (Legacy)</h4>
            <div class="flex gap-2">
                <input type="text" id="keyword-search-input" class="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white flex-1" placeholder="Es: Mario Rossi, 8.8.8.8...">
                <button id="keyword-search-btn" class="px-4 py-2 font-semibold rounded-md bg-green-600 hover:bg-green-700">Cerca</button>
            </div>
            <div id="search-result" class="mt-4 p-4 bg-black/20 rounded-md min-h-[50px]"></div>
        </div>
    `;

    // Re-attach event listener for legacy search
    const keywordSearchBtn = document.getElementById('keyword-search-btn');
    if (keywordSearchBtn) {
        keywordSearchBtn.addEventListener('click', () => {
            const keyword = document.getElementById('keyword-search-input')?.value;
            if (keyword) {
                handleBasicSearch(packet, keyword);
            }
        });
    }
}

function getSensitivityIndicator(sensitivity) {
    const colors = {
        'Low': 'bg-green-600',
        'Medium': 'bg-yellow-600', 
        'High': 'bg-orange-600',
        'Critical': 'bg-red-600'
    };
    
    const levels = ['Low', 'Medium', 'High', 'Critical'];
    const currentLevel = levels.indexOf(sensitivity);
    
    return `
        <div class="flex gap-1 mt-2">
            ${levels.map((level, index) => 
                `<div class="flex-1 h-2 rounded ${index <= currentLevel ? colors[sensitivity] : 'bg-gray-700'}"></div>`
            ).join('')}
        </div>
    `;
}

function estimateIpPotential(packet) {
    let basePotential = 10;
    
    // Higher purity increases potential
    basePotential += (packet.purity / 100) * 30;
    
    // Higher sensitivity increases potential
    const sensitivityMultiplier = {
        'Low': 0.5,
        'Medium': 1.0,
        'High': 1.5,
        'Critical': 2.0
    };
    basePotential *= (sensitivityMultiplier[packet.sensitivity] || 1.0);
    
    // Network category has higher IP potential
    if (packet.category === 'network') {
        basePotential *= 1.8;
    } else if (packet.category === 'logs') {
        basePotential *= 1.3;
    }
    
    return Math.min(Math.round(basePotential), 85);
}


// Advanced Data Analysis Functions
function startDataAnalysis() {
    if (!currentAnalysisData || analysisInProgress) return;
    
    const analysisFlowSelect = document.getElementById('analysis-flow');
    const targetPrioritySelect = document.getElementById('target-priority');
    
    if (!analysisFlowSelect?.value) {
        showNotification('Seleziona un flusso di analisi prima di iniziare.', 'error');
        return;
    }
    
    analysisInProgress = true;
    
    // Update UI
    const startBtn = document.getElementById('start-analysis');
    const stopBtn = document.getElementById('stop-analysis');
    const progressContainer = document.getElementById('analysis-progress-container');
    
    if (startBtn) startBtn.classList.add('hidden');
    if (stopBtn) stopBtn.classList.remove('hidden');
    if (progressContainer) progressContainer.classList.remove('hidden');
    
    // Get flow robustness
    const flowId = analysisFlowSelect.value;
    const flowRobustness = getFlowRobustness(flowId);
    const targetPriority = targetPrioritySelect?.value || 'ips';
    
    // Start analysis simulation
    simulateDataAnalysis(currentAnalysisData, flowRobustness, targetPriority);
}

function stopDataAnalysis() {
    analysisInProgress = false;
    
    // Update UI
    const startBtn = document.getElementById('start-analysis');
    const stopBtn = document.getElementById('stop-analysis');
    const progressContainer = document.getElementById('analysis-progress-container');
    
    if (startBtn) startBtn.classList.remove('hidden');
    if (stopBtn) stopBtn.classList.add('hidden');
    if (progressContainer) progressContainer.classList.add('hidden');
    
    // Reset progress
    updateAnalysisProgress(0, 'Analisi interrotta');
}

function getFlowRobustness(flowId) {
    // Check saved flows - permanentFlows is an object with flow names as keys
    if (state.permanentFlows && typeof state.permanentFlows === 'object') {
        const savedFlow = state.permanentFlows[flowId];
        if (savedFlow) {
            return calculateFlowRobustness(savedFlow);
        }
    }
    
    return 30; // Default fallback
}

function simulateDataAnalysis(packet, flowRobustness, targetPriority) {
    const analysisSteps = [
        'Inizializzazione flusso di analisi...',
        'Scansione struttura dati...',
        'Applicazione algoritmi di pattern matching...',
        'Analisi correlazioni e metadati...',
        'Estrazione di informazioni sensibili...',
        'Ricerca indirizzi IP nascosti...',
        'Validazione risultati...',
        'Finalizzazione scoperte...'
    ];
    
    let currentStep = 0;
    const totalDuration = 8000; // 8 seconds
    const stepDuration = totalDuration / analysisSteps.length;
    
    const analysisInterval = setInterval(() => {
        if (!analysisInProgress) {
            clearInterval(analysisInterval);
            return;
        }
        
        const progress = ((currentStep + 1) / analysisSteps.length) * 100;
        updateAnalysisProgress(progress, analysisSteps[currentStep]);
        
        currentStep++;
        
        if (currentStep >= analysisSteps.length) {
            clearInterval(analysisInterval);
            completeDataAnalysis(packet, flowRobustness, targetPriority);
        }
    }, stepDuration);
}

function updateAnalysisProgress(percentage, statusText) {
    const progressBar = document.getElementById('analysis-progress-bar');
    const progressText = document.getElementById('analysis-progress-text');
    const statusElement = document.getElementById('analysis-status');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${Math.round(percentage)}%`;
    if (statusElement) statusElement.textContent = statusText;
}

function completeDataAnalysis(packet, flowRobustness, targetPriority) {
    analysisInProgress = false;
    
    // Calculate success probability
    const baseProbability = calculateDiscoveryProbability(packet, flowRobustness);
    const discoveries = generateDiscoveries(packet, flowRobustness, targetPriority, baseProbability);
    
    // Update UI
    const startBtn = document.getElementById('start-analysis');
    const stopBtn = document.getElementById('stop-analysis');
    const progressContainer = document.getElementById('analysis-progress-container');
    
    if (startBtn) startBtn.classList.remove('hidden');
    if (stopBtn) stopBtn.classList.add('hidden');
    if (progressContainer) progressContainer.classList.add('hidden');
    
    // Show results
    displayAnalysisResults(discoveries);
    
    // Process discoveries
    processDiscoveries(discoveries);
}

function calculateDiscoveryProbability(packet, flowRobustness) {
    let probability = 15; // Base 15%
    
    // Data quality impact
    probability += (packet.purity / 100) * 40;
    
    // Flow robustness impact
    probability += (flowRobustness / 100) * 30;
    
    // Sensitivity impact
    const sensitivityBonus = {
        'Low': 0,
        'Medium': 5,
        'High': 15,
        'Critical': 25
    };
    probability += sensitivityBonus[packet.sensitivity] || 0;
    
    // Category impact for IP discovery
    if (packet.category === 'network') probability += 20;
    if (packet.category === 'logs') probability += 10;
    
    // Player talent bonuses
    probability += getTalentBonus();
    
    return Math.min(probability, 85); // Cap at 85%
}

function getTalentBonus() {
    let bonus = 0;
    
    // Python talent bonus
    const pythonLevel = state.unlocked?.['Python'] || 0;
    bonus += pythonLevel * 3;
    
    // Database talent bonus  
    const dbLevel = state.unlocked?.['Database'] || 0;
    bonus += dbLevel * 5;
    
    // AI talent bonus
    const aiLevel = state.unlocked?.['Artificial Intelligence'] || 0;
    bonus += aiLevel * 7;
    
    return bonus;
}

function generateDiscoveries(packet, flowRobustness, targetPriority, baseProbability) {
    const discoveries = [];
    
    // IP Discovery (main feature)
    if (Math.random() * 100 < baseProbability) {
        const ipDiscovery = generateIpDiscovery(packet, flowRobustness);
        if (ipDiscovery) discoveries.push(ipDiscovery);
    }
    
    // Additional discoveries based on priority
    if (targetPriority === 'credentials' && Math.random() * 100 < baseProbability * 0.6) {
        discoveries.push(generateCredentialDiscovery(packet));
    }
    
    if (targetPriority === 'vulnerabilities' && Math.random() * 100 < baseProbability * 0.4) {
        discoveries.push(generateVulnerabilityDiscovery(packet));
    }
    
    // Random additional intel (lower probability)
    if (Math.random() * 100 < baseProbability * 0.3) {
        discoveries.push(generateIntelDiscovery(packet));
    }
    
    return discoveries;
}

function generateIpDiscovery(packet, flowRobustness) {
    // Generate a rare IP discovery
    const rareTiers = ['Tier 2', 'Tier 3', 'Tier 4'];
    const selectedTier = rareTiers[Math.floor(Math.random() * rareTiers.length)];
    
    // Generate a realistic IP
    const ip = generateRandomIp();
    
    const targetTypes = {
        'network': ['Server Infrastructure', 'Network Equipment', 'IoT Device'],
        'financial': ['Banking System', 'Payment Gateway', 'Financial Database'],
        'credentials': ['Corporate Server', 'Government System', 'University Network'],
        'logs': ['Log Server', 'Monitoring System', 'Security Infrastructure'],
        'documents': ['Document Server', 'Archive System', 'Content Management'],
        'personal': ['Personal Computer', 'Home Network', 'Social Platform']
    };
    
    const types = targetTypes[packet.category] || targetTypes['network'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    return {
        type: 'ip_discovery',
        ip: ip,
        targetType: selectedType,
        tier: selectedTier,
        source: packet.name,
        confidence: Math.min(95, 60 + flowRobustness * 0.4),
        country: getRandomCountry()
    };
}

function generateCredentialDiscovery(packet) {
    const credentialTypes = ['admin', 'user', 'service', 'database'];
    const randomType = credentialTypes[Math.floor(Math.random() * credentialTypes.length)];
    
    return {
        type: 'credential_discovery',
        credentialType: randomType,
        username: generateRandomUsername(randomType),
        source: packet.name,
        confidence: 70 + Math.random() * 20
    };
}

function generateVulnerabilityDiscovery(packet) {
    const vulnTypes = ['SQL Injection', 'XSS', 'Buffer Overflow', 'Privilege Escalation', 'RCE'];
    const randomVuln = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
    
    return {
        type: 'vulnerability_discovery',
        vulnerability: randomVuln,
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        source: packet.name,
        confidence: 60 + Math.random() * 30
    };
}

function generateIntelDiscovery(packet) {
    return {
        type: 'intel_discovery',
        intelType: 'Pattern Analysis',
        description: 'Correlazioni interessanti individuate nei dati',
        source: packet.name,
        confidence: 50 + Math.random() * 40
    };
}

function generateRandomUsername(type) {
    const prefixes = {
        'admin': ['admin', 'administrator', 'root', 'sysadmin'],
        'user': ['user', 'guest', 'client', 'customer'],
        'service': ['service', 'daemon', 'worker', 'process'],
        'database': ['dbadmin', 'mysql', 'postgres', 'oracle']
    };
    
    const prefix = prefixes[type] || prefixes['user'];
    const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
    const randomNumber = Math.floor(Math.random() * 999);
    
    return `${randomPrefix}${randomNumber}`;
}

function getRandomCountry() {
    const countries = ['Italia', 'Francia', 'Germania', 'Spagna', 'USA', 'Canada', 'Giappone', 'Cina', 'Russia', 'Regno Unito'];
    return countries[Math.floor(Math.random() * countries.length)];
}

function displayAnalysisResults(discoveries) {
    const resultsHTML = generateResultsHTML(discoveries);
    
    // Show results in the analysis interface
    const container = document.getElementById('analysis-interface');
    if (container) {
        const existingContent = container.innerHTML;
        container.innerHTML = existingContent + `
            <div class="mt-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
                <h4 class="text-lg font-semibold text-green-300 mb-4">
                    <i class="fas fa-search mr-2"></i>Risultati Analisi
                </h4>
                ${resultsHTML}
            </div>
        `;
    }
}

function generateResultsHTML(discoveries) {
    if (discoveries.length === 0) {
        return `<p class="text-gray-400">Nessuna scoperta significativa durante l'analisi.</p>`;
    }
    
    return discoveries.map(discovery => {
        switch (discovery.type) {
            case 'ip_discovery':
                return `
                    <div class="bg-blue-900/30 p-3 rounded-lg mb-3">
                        <div class="flex justify-between items-start">
                            <div>
                                <h5 class="font-semibold text-blue-300">🎯 Nuovo IP di Interesse Scoperto!</h5>
                                <p class="text-sm text-gray-300 mt-1">
                                    <strong>IP:</strong> ${discovery.ip}<br>
                                    <strong>Tipo:</strong> ${discovery.targetType}<br>
                                    <strong>Paese:</strong> ${discovery.country}<br>
                                    <strong>Tier:</strong> ${discovery.tier}
                                </p>
                            </div>
                            <span class="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                ${Math.round(discovery.confidence)}% affidabilità
                            </span>
                        </div>
                    </div>
                `;
            case 'credential_discovery':
                return `
                    <div class="bg-yellow-900/30 p-3 rounded-lg mb-3">
                        <h5 class="font-semibold text-yellow-300">🔑 Credenziali Scoperte</h5>
                        <p class="text-sm text-gray-300 mt-1">
                            <strong>Username:</strong> ${discovery.username}<br>
                            <strong>Tipo:</strong> ${discovery.credentialType}
                        </p>
                    </div>
                `;
            case 'vulnerability_discovery':
                return `
                    <div class="bg-red-900/30 p-3 rounded-lg mb-3">
                        <h5 class="font-semibold text-red-300">🛡️ Vulnerabilità Identificata</h5>
                        <p class="text-sm text-gray-300 mt-1">
                            <strong>Tipo:</strong> ${discovery.vulnerability}<br>
                            <strong>Severità:</strong> ${discovery.severity}
                        </p>
                    </div>
                `;
            default:
                return `
                    <div class="bg-purple-900/30 p-3 rounded-lg mb-3">
                        <h5 class="font-semibold text-purple-300">📊 Intelligence Aggiuntiva</h5>
                        <p class="text-sm text-gray-300 mt-1">${discovery.description}</p>
                    </div>
                `;
        }
    }).join('');
}

function processDiscoveries(discoveries) {
    discoveries.forEach(discovery => {
        if (discovery.type === 'ip_discovery') {
            // Add discovered IP to unlocked targets
            const newTarget = {
                ip: discovery.ip,
                name: discovery.targetType,
                country: discovery.country,
                tier: discovery.tier,
                discoveredVia: 'intelligence_analysis',
                discoveredAt: Date.now()
            };
            
            // Add to discovered targets if not already present
            if (!state.discoveredTargets.find(t => t.ip === discovery.ip)) {
                state.discoveredTargets.push(newTarget);
                
                // Show notification
                showNotification(
                    `Nuovo IP di interesse scoperto: ${discovery.ip} (${discovery.tier})`, 
                    'success'
                );
            }
        }
    });
    
    saveState();
}

function handleBasicSearch(packet, keyword) {
    const resultContainer = document.getElementById('search-result');
    resultContainer.innerHTML = `<p class="text-yellow-400"><i class="fas fa-spinner fa-spin mr-2"></i>Analisi dei dati in corso...</p>`;

    const successChance = packet.purity / 100;
    const searchTerm = keyword.trim().toLowerCase();

    setTimeout(() => {
        if (Math.random() < successChance) {
            // AGGIORNATO: Cerca sia per keyword che per IP
            const activeQuest = state.activeQuests.find(q => 
                q.status === 'accepted' && 
                ( (q.targetKeyword && q.targetKeyword.toLowerCase() === searchTerm) || (q.targetIpAddress && q.targetIpAddress === searchTerm) )
            );
            
            if (activeQuest) {
                const rewardInBtc = activeQuest.rewards.usd / state.btcValueInUSD;
                const intelValueInBtc = rewardInBtc / 2;

                const newIntelItem = {
                    id: `intel-${Date.now()}`,
                    questId: activeQuest.id,
                    name: `Intel: ${activeQuest.title}`,
                    description: `Informazione chiave trovata: "${keyword}". Può essere usata per completare la relativa missione.`,
                    value: parseFloat(intelValueInBtc.toFixed(6))
                };
                state.intelItems.push(newIntelItem);

                activeQuest.status = 'objective_found';

                resultContainer.innerHTML = `<p class="text-green-400"><i class="fas fa-star mr-2"></i>Informazione Cruciale Trovata!</p>
                                             <p class="text-sm text-gray-300 mt-2">Un nuovo "Dato Intel" è stato aggiunto al tuo archivio. Vai alla bacheca missioni nell'HQ per completare l'incarico.</p>`;
                saveState();

                if (state.activePage === 'hq') {
                    renderQuestBoard();
                }
                if (state.activePage === 'profile' && state.activeProfileSection === 'data-locker') {
                    renderDataLockerSection();
                }

            } else {
                resultContainer.innerHTML = `<p class="text-green-400"><i class="fas fa-check-circle mr-2"></i>Corrispondenza trovata per: "${keyword}"!</p>
                                             <p class="text-xs text-gray-400 mt-2">Questa informazione non sembra legata a nessuna missione attiva.</p>`;
            }
        } else {
            resultContainer.innerHTML = `<p class="text-red-400"><i class="fas fa-times-circle mr-2"></i>Nessuna corrispondenza trovata per: "${keyword}".</p>
                                         <p class="text-xs text-gray-400 mt-2">I dati potrebbero essere troppo corrotti (bassa purezza). Prova a ottenere un archivio di qualità superiore.</p>`;
        }
    }, 2000);
}
