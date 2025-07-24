// File: js/modules/dev_compiler.js
// Time-based Compilation System - Simulates compilation time based on malware complexity and talents

let devCompilerState = {
    activeCompilations: [],
    compilationHistory: [],
    queuedCompilations: [],
    settings: {
        autoQueue: true,
        notifications: true,
        maxConcurrentCompilations: 3
    }
};

function renderTimeBasedCompiler() {
    const container = document.getElementById('dev-compiler-tab');
    container.innerHTML = `
        <div class="time-compiler-system h-full flex flex-col bg-gray-900">
            <!-- Compiler Header -->
            <div class="compiler-header bg-gray-800 border-b border-gray-600 p-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-orange-400">
                            <i class="fas fa-cog mr-2"></i>
                            Time-Based Compiler
                        </h2>
                        <p class="text-gray-400">Advanced compilation with time simulation and talent integration</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="compilation-stats flex space-x-4">
                            <div class="stat bg-orange-600 px-3 py-2 rounded-lg text-center">
                                <div class="text-sm text-orange-100">Active</div>
                                <div id="active-compilations-count" class="text-xl font-bold">0</div>
                            </div>
                            <div class="stat bg-blue-600 px-3 py-2 rounded-lg text-center">
                                <div class="text-sm text-blue-100">Queued</div>
                                <div id="queued-compilations-count" class="text-xl font-bold">0</div>
                            </div>
                            <div class="stat bg-green-600 px-3 py-2 rounded-lg text-center">
                                <div class="text-sm text-green-100">Completed</div>
                                <div id="completed-compilations-count" class="text-xl font-bold">0</div>
                            </div>
                        </div>
                        <button onclick="openCompilerSettings()" class="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">
                            <i class="fas fa-cog mr-1"></i>Settings
                        </button>
                    </div>
                </div>
            </div>

            <!-- Main Compiler Interface -->
            <div class="compiler-main flex-1 flex">
                <!-- Left Panel: New Compilation -->
                <div class="new-compilation-panel w-1/3 bg-gray-800 border-r border-gray-600 flex flex-col">
                    <div class="panel-header bg-gray-700 p-3 border-b border-gray-600">
                        <h3 class="text-lg font-bold text-orange-400">
                            <i class="fas fa-plus mr-2"></i>
                            New Compilation
                        </h3>
                    </div>
                    <div class="panel-content flex-1 p-4 overflow-auto">
                        <form onsubmit="startNewCompilation(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-300 mb-2">Project Name</label>
                                <input type="text" id="compilation-project-name" 
                                       class="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500"
                                       placeholder="Enter project name" required>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-semibold text-gray-300 mb-2">Malware Type</label>
                                <select id="compilation-malware-type" 
                                        class="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500"
                                        onchange="updateCompilationEstimate()">
                                    <option value="botnet">Botnet Agent</option>
                                    <option value="ransomware">Ransomware</option>
                                    <option value="keylogger">Keylogger</option>
                                    <option value="ddos-tool">DDoS Tool</option>
                                    <option value="data-exfiltrator">Data Exfiltrator</option>
                                    <option value="rootkit">Rootkit</option>
                                    <option value="worm">Network Worm</option>
                                    <option value="trojan">Trojan Horse</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-semibold text-gray-300 mb-2">
                                    Complexity Level: <span id="complexity-value">5</span>
                                </label>
                                <input type="range" id="compilation-complexity" min="1" max="10" value="5"
                                       class="w-full bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                       onchange="updateCompilationEstimate()">
                                <div class="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Simple</span>
                                    <span>Complex</span>
                                    <span>Advanced</span>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-semibold text-gray-300 mb-2">
                                    Power Level: <span id="power-value">50</span>
                                </label>
                                <input type="range" id="compilation-power" min="10" max="100" value="50"
                                       class="w-full bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                       onchange="updateCompilationEstimate()">
                                <div class="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Low</span>
                                    <span>Medium</span>
                                    <span>High</span>
                                </div>
                            </div>
                            
                            <div class="compilation-options space-y-2">
                                <h4 class="text-sm font-bold text-orange-400">Compilation Options</h4>
                                <label class="flex items-center">
                                    <input type="checkbox" id="option-obfuscation" class="mr-2" onchange="updateCompilationEstimate()">
                                    <span class="text-sm">Code Obfuscation (+30% time, +40% stealth)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" id="option-encryption" class="mr-2" onchange="updateCompilationEstimate()">
                                    <span class="text-sm">Payload Encryption (+20% time, +25% effectiveness)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" id="option-anti-debug" class="mr-2" onchange="updateCompilationEstimate()">
                                    <span class="text-sm">Anti-Debug Features (+25% time, +35% persistence)</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" id="option-polymorphic" class="mr-2" onchange="updateCompilationEstimate()">
                                    <span class="text-sm">Polymorphic Code (+50% time, +60% evasion)</span>
                                </label>
                            </div>
                            
                            <div class="compilation-estimate bg-gray-700 p-3 rounded-lg border border-orange-500">
                                <h4 class="text-sm font-bold text-orange-400 mb-2">Compilation Estimate</h4>
                                <div class="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span class="text-gray-400">Base Time:</span>
                                        <span id="estimate-base-time" class="float-right text-white">0m</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-400">Talent Bonus:</span>
                                        <span id="estimate-talent-bonus" class="float-right text-green-400">-0%</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-400">Options Penalty:</span>
                                        <span id="estimate-options-penalty" class="float-right text-red-400">+0%</span>
                                    </div>
                                    <div class="col-span-2 border-t border-gray-600 pt-2 mt-2">
                                        <span class="text-gray-400">Final Time:</span>
                                        <span id="estimate-final-time" class="float-right text-orange-400 font-bold">0m</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold transition-colors">
                                <i class="fas fa-play mr-2"></i>
                                Start Compilation
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Center Panel: Active Compilations -->
                <div class="active-compilations-panel w-1/3 bg-gray-900 border-r border-gray-600 flex flex-col">
                    <div class="panel-header bg-gray-700 p-3 border-b border-gray-600">
                        <h3 class="text-lg font-bold text-blue-400">
                            <i class="fas fa-cog fa-spin mr-2"></i>
                            Active Compilations
                        </h3>
                    </div>
                    <div class="panel-content flex-1 p-4 overflow-auto">
                        <div id="active-compilations-list" class="space-y-3">
                            <!-- Active compilations will be displayed here -->
                        </div>
                        <div id="no-active-compilations" class="text-center text-gray-500 mt-8">
                            <i class="fas fa-hourglass-empty text-4xl mb-4"></i>
                            <p>No active compilations</p>
                        </div>
                    </div>
                </div>

                <!-- Right Panel: Compilation History -->
                <div class="compilation-history-panel w-1/3 bg-gray-800 flex flex-col">
                    <div class="panel-header bg-gray-700 p-3 border-b border-gray-600">
                        <h3 class="text-lg font-bold text-green-400">
                            <i class="fas fa-history mr-2"></i>
                            Compilation History
                        </h3>
                        <button onclick="clearCompilationHistory()" class="float-right text-red-400 hover:text-red-300">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    <div class="panel-content flex-1 p-4 overflow-auto">
                        <div id="compilation-history-list" class="space-y-2">
                            <!-- Compilation history will be displayed here -->
                        </div>
                        <div id="no-compilation-history" class="text-center text-gray-500 mt-8">
                            <i class="fas fa-clock text-4xl mb-4"></i>
                            <p>No compilation history</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Compiler Queue (Bottom Panel) -->
            <div class="compilation-queue bg-gray-800 border-t border-gray-600 p-4">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-bold text-purple-400">
                        <i class="fas fa-list mr-2"></i>
                        Compilation Queue
                    </h3>
                    <div class="queue-controls space-x-2">
                        <button onclick="pauseAllCompilations()" class="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded">
                            <i class="fas fa-pause mr-1"></i>Pause All
                        </button>
                        <button onclick="clearQueue()" class="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded">
                            <i class="fas fa-trash mr-1"></i>Clear Queue
                        </button>
                    </div>
                </div>
                <div id="compilation-queue-list" class="grid grid-cols-4 gap-3">
                    <!-- Queued compilations will be displayed here -->
                </div>
                <div id="no-queued-compilations" class="text-center text-gray-500 py-4">
                    <p>No compilations in queue</p>
                </div>
            </div>
        </div>
    `;

    // Initialize the compiler interface
    updateCompilationEstimate();
    updateCompilerStats();
    updateActiveCompilationsList();
    updateCompilationHistory();
    updateCompilationQueue();
}

function updateCompilationEstimate() {
    const complexity = parseInt(document.getElementById('compilation-complexity')?.value || 5);
    const power = parseInt(document.getElementById('compilation-power')?.value || 50);
    const malwareType = document.getElementById('compilation-malware-type')?.value || 'botnet';
    
    // Update slider value displays
    if (document.getElementById('complexity-value')) {
        document.getElementById('complexity-value').textContent = complexity;
    }
    if (document.getElementById('power-value')) {
        document.getElementById('power-value').textContent = power;
    }
    
    // Calculate base time based on complexity, power, and malware type
    const malwareMultipliers = {
        'botnet': 1.0,
        'ransomware': 1.5,
        'keylogger': 0.8,
        'ddos-tool': 1.2,
        'data-exfiltrator': 1.1,
        'rootkit': 2.0,
        'worm': 1.3,
        'trojan': 1.4
    };
    
    const baseMinutes = Math.floor((complexity * 2 + power * 0.5) * (malwareMultipliers[malwareType] || 1.0));
    
    // Calculate talent bonus (reduction)
    const talentBonus = calculateTalentBonus();
    
    // Calculate options penalty
    let optionsPenalty = 0;
    if (document.getElementById('option-obfuscation')?.checked) optionsPenalty += 30;
    if (document.getElementById('option-encryption')?.checked) optionsPenalty += 20;
    if (document.getElementById('option-anti-debug')?.checked) optionsPenalty += 25;
    if (document.getElementById('option-polymorphic')?.checked) optionsPenalty += 50;
    
    // Calculate final time
    const finalMinutes = Math.floor(baseMinutes * (1 - talentBonus / 100) * (1 + optionsPenalty / 100));
    
    // Update display
    if (document.getElementById('estimate-base-time')) {
        document.getElementById('estimate-base-time').textContent = `${baseMinutes}m`;
        document.getElementById('estimate-talent-bonus').textContent = `-${talentBonus}%`;
        document.getElementById('estimate-options-penalty').textContent = `+${optionsPenalty}%`;
        document.getElementById('estimate-final-time').textContent = `${finalMinutes}m`;
    }
    
    return finalMinutes;
}

function calculateTalentBonus() {
    // Calculate talent bonus based on development talents system
    let bonus = 0;
    
    // Basic programming skills
    const programmingLevel = devTalentsState?.unlockedTalents?.['programming_basics'] || 0;
    bonus += programmingLevel * 5; // 5% per level
    
    // Advanced programming skills
    const advancedProgrammingLevel = devTalentsState?.unlockedTalents?.['advanced_programming'] || 0;
    bonus += advancedProgrammingLevel * 8; // 8% per level
    
    // Malware engineering skills
    const malwareEngineeringLevel = devTalentsState?.unlockedTalents?.['malware_engineering'] || 0;
    bonus += malwareEngineeringLevel * 10; // 10% per level
    
    return Math.min(bonus, 80); // Cap at 80% reduction
}

function startNewCompilation(event) {
    event.preventDefault();
    
    const projectName = document.getElementById('compilation-project-name').value;
    const malwareType = document.getElementById('compilation-malware-type').value;
    const complexity = parseInt(document.getElementById('compilation-complexity').value);
    const power = parseInt(document.getElementById('compilation-power').value);
    
    // Get selected options
    const options = {
        obfuscation: document.getElementById('option-obfuscation').checked,
        encryption: document.getElementById('option-encryption').checked,
        antiDebug: document.getElementById('option-anti-debug').checked,
        polymorphic: document.getElementById('option-polymorphic').checked
    };
    
    const estimatedTime = updateCompilationEstimate();
    
    const compilation = {
        id: Date.now(),
        projectName,
        malwareType,
        complexity,
        power,
        options,
        estimatedTime: estimatedTime * 60 * 1000, // Convert to milliseconds
        startTime: Date.now(),
        status: 'active',
        progress: 0
    };
    
    // Check if we can start immediately or need to queue
    if (devCompilerState.activeCompilations.length < devCompilerState.settings.maxConcurrentCompilations) {
        devCompilerState.activeCompilations.push(compilation);
        startCompilationProcess(compilation);
    } else {
        compilation.status = 'queued';
        devCompilerState.queuedCompilations.push(compilation);
        
        if (devCompilerState.settings.notifications) {
            showNotification(`Compilation "${projectName}" added to queue`, 'info');
        }
    }
    
    // Reset form
    event.target.reset();
    updateCompilationEstimate();
    updateCompilerStats();
    updateActiveCompilationsList();
    updateCompilationQueue();
}

function startCompilationProcess(compilation) {
    const updateInterval = 100; // Update every 100ms
    const totalUpdates = compilation.estimatedTime / updateInterval;
    
    const timer = setInterval(() => {
        const elapsed = Date.now() - compilation.startTime;
        compilation.progress = Math.min((elapsed / compilation.estimatedTime) * 100, 100);
        
        if (compilation.progress >= 100) {
            clearInterval(timer);
            completeCompilation(compilation);
        }
        
        updateActiveCompilationsList();
    }, updateInterval);
    
    compilation.timer = timer;
    
    if (devCompilerState.settings.notifications) {
        showNotification(`Compilation "${compilation.projectName}" started`, 'success');
    }
}

function completeCompilation(compilation) {
    // Remove from active compilations
    devCompilerState.activeCompilations = devCompilerState.activeCompilations.filter(c => c.id !== compilation.id);
    
    // Add to history
    compilation.completedTime = Date.now();
    compilation.status = 'completed';
    devCompilerState.compilationHistory.unshift(compilation);
    
    // Keep only last 20 compilations in history
    if (devCompilerState.compilationHistory.length > 20) {
        devCompilerState.compilationHistory = devCompilerState.compilationHistory.slice(0, 20);
    }
    
    // Start next queued compilation if any
    if (devCompilerState.queuedCompilations.length > 0) {
        const nextCompilation = devCompilerState.queuedCompilations.shift();
        nextCompilation.status = 'active';
        nextCompilation.startTime = Date.now();
        devCompilerState.activeCompilations.push(nextCompilation);
        startCompilationProcess(nextCompilation);
    }
    
    if (devCompilerState.settings.notifications) {
        showNotification(`Compilation "${compilation.projectName}" completed!`, 'success');
    }
    
    updateCompilerStats();
    updateActiveCompilationsList();
    updateCompilationHistory();
    updateCompilationQueue();
}

function updateCompilerStats() {
    document.getElementById('active-compilations-count').textContent = devCompilerState.activeCompilations.length;
    document.getElementById('queued-compilations-count').textContent = devCompilerState.queuedCompilations.length;
    document.getElementById('completed-compilations-count').textContent = devCompilerState.compilationHistory.length;
}

function updateActiveCompilationsList() {
    const container = document.getElementById('active-compilations-list');
    const noActiveElement = document.getElementById('no-active-compilations');
    
    if (devCompilerState.activeCompilations.length === 0) {
        container.style.display = 'none';
        noActiveElement.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    noActiveElement.style.display = 'none';
    
    container.innerHTML = devCompilerState.activeCompilations.map(compilation => `
        <div class="active-compilation-card bg-gray-800 border border-blue-500 rounded-lg p-3">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-semibold text-white">${compilation.projectName}</h4>
                <button onclick="cancelCompilation(${compilation.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="text-sm text-gray-400 mb-2">${compilation.malwareType}</div>
            <div class="progress-container">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                    <span>${Math.round(compilation.progress)}%</span>
                    <span>${formatTimeRemaining(compilation)}</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full transition-all duration-200" 
                         style="width: ${compilation.progress}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCompilationHistory() {
    const container = document.getElementById('compilation-history-list');
    const noHistoryElement = document.getElementById('no-compilation-history');
    
    if (devCompilerState.compilationHistory.length === 0) {
        container.style.display = 'none';
        noHistoryElement.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    noHistoryElement.style.display = 'none';
    
    container.innerHTML = devCompilerState.compilationHistory.map(compilation => `
        <div class="history-item bg-gray-700 rounded-lg p-2 border border-gray-600">
            <div class="flex justify-between items-center">
                <div>
                    <h5 class="font-semibold text-white text-sm">${compilation.projectName}</h5>
                    <div class="text-xs text-gray-400">${compilation.malwareType}</div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-green-400">Completed</div>
                    <div class="text-xs text-gray-400">${formatCompletionTime(compilation)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCompilationQueue() {
    const container = document.getElementById('compilation-queue-list');
    const noQueueElement = document.getElementById('no-queued-compilations');
    
    if (devCompilerState.queuedCompilations.length === 0) {
        container.style.display = 'none';
        noQueueElement.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    noQueueElement.style.display = 'none';
    
    container.innerHTML = devCompilerState.queuedCompilations.map((compilation, index) => `
        <div class="queued-compilation-card bg-gray-700 border border-purple-500 rounded-lg p-2">
            <div class="flex justify-between items-start mb-1">
                <h5 class="font-semibold text-white text-sm">${compilation.projectName}</h5>
                <button onclick="removeFromQueue(${compilation.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
            <div class="text-xs text-gray-400">${compilation.malwareType}</div>
            <div class="text-xs text-purple-400 mt-1">Position: ${index + 1}</div>
        </div>
    `).join('');
}

function formatTimeRemaining(compilation) {
    const elapsed = Date.now() - compilation.startTime;
    const remaining = compilation.estimatedTime - elapsed;
    
    if (remaining <= 0) return '0s';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

function formatCompletionTime(compilation) {
    const date = new Date(compilation.completedTime);
    return date.toLocaleTimeString();
}

function cancelCompilation(compilationId) {
    const compilation = devCompilerState.activeCompilations.find(c => c.id === compilationId);
    if (compilation && compilation.timer) {
        clearInterval(compilation.timer);
        devCompilerState.activeCompilations = devCompilerState.activeCompilations.filter(c => c.id !== compilationId);
        
        showNotification(`Compilation "${compilation.projectName}" cancelled`, 'info');
        
        updateCompilerStats();
        updateActiveCompilationsList();
    }
}

function removeFromQueue(compilationId) {
    devCompilerState.queuedCompilations = devCompilerState.queuedCompilations.filter(c => c.id !== compilationId);
    updateCompilerStats();
    updateCompilationQueue();
}

function clearQueue() {
    devCompilerState.queuedCompilations = [];
    updateCompilerStats();
    updateCompilationQueue();
    showNotification('Compilation queue cleared', 'info');
}

function clearCompilationHistory() {
    devCompilerState.compilationHistory = [];
    updateCompilationHistory();
    updateCompilerStats();
    showNotification('Compilation history cleared', 'info');
}

function pauseAllCompilations() {
    // This would pause all active compilations (implementation would depend on specific requirements)
    showNotification('All compilations paused', 'info');
}

function openCompilerSettings() {
    // This would open a settings modal (simplified for now)
    showNotification('Compiler settings opened (feature coming soon)', 'info');
}

// Export functions for global access
window.renderTimeBasedCompiler = renderTimeBasedCompiler;
window.startNewCompilation = startNewCompilation;
window.updateCompilationEstimate = updateCompilationEstimate;
window.cancelCompilation = cancelCompilation;
window.removeFromQueue = removeFromQueue;
window.clearQueue = clearQueue;
window.clearCompilationHistory = clearCompilationHistory;
window.pauseAllCompilations = pauseAllCompilations;
window.openCompilerSettings = openCompilerSettings;