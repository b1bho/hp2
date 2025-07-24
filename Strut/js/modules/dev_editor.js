// File: js/modules/dev_editor.js
// Advanced Editor - Reworked editor with Flow Area, Modifiers Area, and Compiler Area

let devEditorState = {
    currentProject: null,
    flowArea: {
        nodes: [],
        connections: []
    },
    modifiersArea: {
        activeModifiers: [],
        selectedTarget: null
    },
    compilerArea: {
        compiled: false,
        optimizations: [],
        estimatedPower: 0
    }
};

function renderAdvancedEditor() {
    const container = document.getElementById('dev-editor-tab');
    container.innerHTML = `
        <div class="advanced-editor h-full flex flex-col">
            <!-- Editor Toolbar -->
            <div class="editor-toolbar bg-gray-800 border-b border-gray-600 p-3">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <select id="project-selector" class="px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600">
                            <option value="">New Project</option>
                            <option value="botnet-ddos">Botnet DDoS</option>
                            <option value="data-exfiltration">Data Exfiltration</option>
                            <option value="ransomware">Ransomware</option>
                        </select>
                        <button onclick="saveCurrentProject()" class="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                            <i class="fas fa-save mr-1"></i>Save
                        </button>
                        <button onclick="loadProject()" class="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg">
                            <i class="fas fa-folder-open mr-1"></i>Load
                        </button>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-400">Power Estimation:</span>
                        <span id="power-indicator" class="px-2 py-1 bg-purple-600 text-white rounded text-sm font-bold">0</span>
                    </div>
                </div>
            </div>

            <!-- Main Editor Layout -->
            <div class="editor-main flex-1 flex">
                <!-- Flow Area (Left) -->
                <div class="flow-area w-1/2 bg-gray-900 border-r border-gray-600 flex flex-col">
                    <div class="area-header bg-gray-800 p-3 border-b border-gray-600">
                        <h3 class="text-lg font-bold text-blue-400">
                            <i class="fas fa-project-diagram mr-2"></i>
                            Flow Area
                        </h3>
                        <p class="text-sm text-gray-400">Drag and drop blocks to create your malware flow</p>
                    </div>
                    <div class="area-content flex-1 flex">
                        <!-- Block Palette -->
                        <div class="block-palette w-1/3 bg-gray-800 p-3 overflow-y-auto">
                            <div class="block-categories space-y-3">
                                <div class="category-group">
                                    <h4 class="text-sm font-bold text-yellow-400 mb-2">Access</h4>
                                    <div class="space-y-2" id="access-blocks"></div>
                                </div>
                                <div class="category-group">
                                    <h4 class="text-sm font-bold text-red-400 mb-2">Payload</h4>
                                    <div class="space-y-2" id="payload-blocks"></div>
                                </div>
                                <div class="category-group">
                                    <h4 class="text-sm font-bold text-green-400 mb-2">Exfiltration</h4>
                                    <div class="space-y-2" id="exfiltration-blocks"></div>
                                </div>
                            </div>
                        </div>
                        <!-- Flow Canvas -->
                        <div class="flow-canvas flex-1 bg-gray-900 relative" id="flow-canvas">
                            <div class="canvas-grid absolute inset-0 opacity-20"></div>
                            <div class="canvas-content relative z-10 h-full" id="canvas-content">
                                <!-- Flow nodes will be placed here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side -->
                <div class="right-side w-1/2 flex flex-col">
                    <!-- Modifiers Area (Top Right) -->
                    <div class="modifiers-area h-1/2 bg-gray-900 border-b border-gray-600 flex flex-col">
                        <div class="area-header bg-gray-800 p-3 border-b border-gray-600">
                            <h3 class="text-lg font-bold text-purple-400">
                                <i class="fas fa-sliders-h mr-2"></i>
                                Modifiers Area
                            </h3>
                            <p class="text-sm text-gray-400">Apply enhancements and optimizations</p>
                        </div>
                        <div class="area-content flex-1 p-3">
                            <div class="modifiers-grid grid grid-cols-2 gap-3" id="modifiers-grid">
                                <!-- Modifiers will be populated here -->
                            </div>
                        </div>
                    </div>

                    <!-- Compiler Area (Bottom Right) -->
                    <div class="compiler-area h-1/2 bg-gray-900 flex flex-col">
                        <div class="area-header bg-gray-800 p-3 border-b border-gray-600">
                            <h3 class="text-lg font-bold text-orange-400">
                                <i class="fas fa-cog mr-2"></i>
                                Compiler Area
                            </h3>
                            <p class="text-sm text-gray-400">Finalize and compile your malware</p>
                        </div>
                        <div class="area-content flex-1 p-3">
                            <div class="compiler-controls space-y-3">
                                <div class="compilation-status">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm font-semibold">Compilation Status:</span>
                                        <span id="compilation-status" class="text-sm text-gray-400">Ready</span>
                                    </div>
                                    <div class="w-full bg-gray-700 rounded-full h-2">
                                        <div id="compilation-progress" class="bg-orange-500 h-2 rounded-full w-0 transition-all duration-300"></div>
                                    </div>
                                </div>
                                <div class="optimization-options">
                                    <h4 class="text-sm font-bold text-orange-400 mb-2">Optimizations</h4>
                                    <div class="space-y-2">
                                        <label class="flex items-center">
                                            <input type="checkbox" class="mr-2" id="stealth-mode">
                                            <span class="text-sm">Stealth Mode (+25% compile time, +30% effectiveness)</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" class="mr-2" id="fast-propagation">
                                            <span class="text-sm">Fast Propagation (+15% compile time, +20% speed)</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="checkbox" class="mr-2" id="persistence">
                                            <span class="text-sm">Enhanced Persistence (+35% compile time, +40% longevity)</span>
                                        </label>
                                    </div>
                                </div>
                                <button onclick="startCompilation()" id="compile-btn" class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold transition-colors">
                                    <i class="fas fa-play mr-2"></i>
                                    Start Compilation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    initFlowCanvas();
    populateBlockPalette();
    populateModifiers();
    updatePowerEstimation();
}

function initFlowCanvas() {
    const canvas = document.getElementById('canvas-content');
    
    // Add grid background
    canvas.style.backgroundImage = `
        linear-gradient(rgba(100, 100, 100, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100, 100, 100, 0.2) 1px, transparent 1px)
    `;
    canvas.style.backgroundSize = '20px 20px';
    
    // Enable drag and drop for blocks
    setupDragAndDrop();
}

function populateBlockPalette() {
    const accessBlocks = document.getElementById('access-blocks');
    const payloadBlocks = document.getElementById('payload-blocks');
    const exfiltrationBlocks = document.getElementById('exfiltration-blocks');
    
    // Access blocks
    const accessItems = [
        { name: 'Port Scanner', icon: 'fa-search', description: 'Scan target ports' },
        { name: 'Vulnerability Scanner', icon: 'fa-bug', description: 'Find exploitable vulnerabilities' },
        { name: 'Social Engineering', icon: 'fa-user-secret', description: 'Psychological manipulation' }
    ];
    
    accessItems.forEach(item => {
        accessBlocks.innerHTML += createPaletteBlock(item);
    });
    
    // Payload blocks
    const payloadItems = [
        { name: 'Keylogger', icon: 'fa-keyboard', description: 'Capture keystrokes' },
        { name: 'Screen Capture', icon: 'fa-desktop', description: 'Take screenshots' },
        { name: 'File Stealer', icon: 'fa-file-alt', description: 'Steal specific files' }
    ];
    
    payloadItems.forEach(item => {
        payloadBlocks.innerHTML += createPaletteBlock(item);
    });
    
    // Exfiltration blocks
    const exfiltrationItems = [
        { name: 'Encrypted Channel', icon: 'fa-lock', description: 'Secure data transmission' },
        { name: 'Dark Web Upload', icon: 'fa-upload', description: 'Upload to dark market' },
        { name: 'Email Exfiltration', icon: 'fa-envelope', description: 'Send via email' }
    ];
    
    exfiltrationItems.forEach(item => {
        exfiltrationBlocks.innerHTML += createPaletteBlock(item);
    });
}

function createPaletteBlock(item) {
    return `
        <div class="palette-block bg-gray-700 p-2 rounded-lg cursor-move hover:bg-gray-600 transition-colors" 
             draggable="true" 
             data-block-type="${item.name.replace(/\s+/g, '-').toLowerCase()}">
            <div class="flex items-center mb-1">
                <i class="fas ${item.icon} text-blue-400 mr-2"></i>
                <span class="text-sm font-semibold">${item.name}</span>
            </div>
            <p class="text-xs text-gray-400">${item.description}</p>
        </div>
    `;
}

function populateModifiers() {
    const modifiersGrid = document.getElementById('modifiers-grid');
    
    const modifiers = [
        { name: 'Encryption', icon: 'fa-lock', effect: '+30% Stealth', cost: '2 min' },
        { name: 'Compression', icon: 'fa-compress', effect: '+15% Speed', cost: '1 min' },
        { name: 'Obfuscation', icon: 'fa-mask', effect: '+25% Evasion', cost: '3 min' },
        { name: 'Multi-Threading', icon: 'fa-layer-group', effect: '+40% Performance', cost: '5 min' }
    ];
    
    modifiers.forEach(modifier => {
        modifiersGrid.innerHTML += `
            <div class="modifier-card bg-gray-800 p-3 rounded-lg border border-gray-600 hover:border-purple-500 cursor-pointer transition-colors"
                 onclick="toggleModifier('${modifier.name.toLowerCase()}')">
                <div class="flex items-center mb-2">
                    <i class="fas ${modifier.icon} text-purple-400 mr-2"></i>
                    <span class="text-sm font-semibold">${modifier.name}</span>
                </div>
                <div class="text-xs text-green-400 mb-1">${modifier.effect}</div>
                <div class="text-xs text-orange-400">+${modifier.cost}</div>
            </div>
        `;
    });
}

function setupDragAndDrop() {
    // Implementation for drag and drop functionality
    const paletteBlocks = document.querySelectorAll('.palette-block');
    const canvas = document.getElementById('canvas-content');
    
    paletteBlocks.forEach(block => {
        block.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.blockType);
        });
    });
    
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const blockType = e.dataTransfer.getData('text/plain');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        addBlockToCanvas(blockType, x, y);
    });
}

function addBlockToCanvas(blockType, x, y) {
    const canvas = document.getElementById('canvas-content');
    const blockId = `block-${Date.now()}`;
    
    const blockElement = document.createElement('div');
    blockElement.className = 'flow-block absolute bg-gray-700 border border-blue-500 rounded-lg p-3 cursor-move';
    blockElement.id = blockId;
    blockElement.style.left = `${x}px`;
    blockElement.style.top = `${y}px`;
    blockElement.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold">${blockType.replace(/-/g, ' ')}</span>
            <button onclick="removeBlock('${blockId}')" class="text-red-400 hover:text-red-300">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="flex space-x-2">
            <div class="input-connector w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="output-connector w-2 h-2 bg-red-400 rounded-full"></div>
        </div>
    `;
    
    canvas.appendChild(blockElement);
    
    // Add to state
    devEditorState.flowArea.nodes.push({
        id: blockId,
        type: blockType,
        x: x,
        y: y
    });
    
    updatePowerEstimation();
}

function removeBlock(blockId) {
    const blockElement = document.getElementById(blockId);
    if (blockElement) {
        blockElement.remove();
        
        // Remove from state
        devEditorState.flowArea.nodes = devEditorState.flowArea.nodes.filter(node => node.id !== blockId);
        updatePowerEstimation();
    }
}

function toggleModifier(modifierName) {
    const modifierIndex = devEditorState.modifiersArea.activeModifiers.indexOf(modifierName);
    
    if (modifierIndex === -1) {
        devEditorState.modifiersArea.activeModifiers.push(modifierName);
    } else {
        devEditorState.modifiersArea.activeModifiers.splice(modifierIndex, 1);
    }
    
    updatePowerEstimation();
    updateModifierDisplay();
}

function updateModifierDisplay() {
    // Update visual state of modifier cards
    document.querySelectorAll('.modifier-card').forEach(card => {
        const modifierName = card.onclick.toString().match(/'([^']+)'/)[1];
        const isActive = devEditorState.modifiersArea.activeModifiers.includes(modifierName);
        
        if (isActive) {
            card.classList.add('border-purple-500', 'bg-purple-900');
        } else {
            card.classList.remove('border-purple-500', 'bg-purple-900');
        }
    });
}

function updatePowerEstimation() {
    const basepower = devEditorState.flowArea.nodes.length * 10;
    const modifierBonus = devEditorState.modifiersArea.activeModifiers.length * 15;
    const totalPower = basepower + modifierBonus;
    
    devEditorState.compilerArea.estimatedPower = totalPower;
    
    const powerIndicator = document.getElementById('power-indicator');
    if (powerIndicator) {
        powerIndicator.textContent = totalPower;
    }
}

function startCompilation() {
    if (devEditorState.flowArea.nodes.length === 0) {
        showNotification('No blocks in flow. Add some blocks before compiling.', 'error');
        return;
    }
    
    // Calculate compilation time based on complexity and talents
    const baseTime = calculateCompilationTime();
    
    // Start compilation process
    devEnvironmentState.compilation.inProgress = true;
    devEnvironmentState.compilation.startTime = Date.now();
    devEnvironmentState.compilation.estimatedDuration = baseTime;
    
    updateCompilationUI();
    
    // Simulate compilation process
    setTimeout(() => {
        completeCompilation();
    }, baseTime);
}

function calculateCompilationTime() {
    const baseComplexity = devEditorState.flowArea.nodes.length;
    const modifierComplexity = devEditorState.modifiersArea.activeModifiers.length;
    
    // Get optimization multipliers
    const stealthMode = document.getElementById('stealth-mode')?.checked ? 1.25 : 1;
    const fastPropagation = document.getElementById('fast-propagation')?.checked ? 1.15 : 1;
    const persistence = document.getElementById('persistence')?.checked ? 1.35 : 1;
    
    // Base time in milliseconds (simulated)
    let baseTime = (baseComplexity * 2000) + (modifierComplexity * 1000);
    baseTime *= stealthMode * fastPropagation * persistence;
    
    // Factor in player talents (to be integrated with new talent system)
    const talentReduction = 0.9; // 10% reduction for now
    
    return Math.floor(baseTime * talentReduction);
}

function updateCompilationUI() {
    const statusElement = document.getElementById('compilation-status');
    const progressElement = document.getElementById('compilation-progress');
    const compileBtn = document.getElementById('compile-btn');
    
    if (devEnvironmentState.compilation.inProgress) {
        statusElement.textContent = 'Compiling...';
        compileBtn.disabled = true;
        compileBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Compiling...';
        
        // Animate progress bar
        let progress = 0;
        const interval = setInterval(() => {
            const elapsed = Date.now() - devEnvironmentState.compilation.startTime;
            progress = (elapsed / devEnvironmentState.compilation.estimatedDuration) * 100;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            
            progressElement.style.width = `${progress}%`;
        }, 100);
    }
}

function completeCompilation() {
    devEnvironmentState.compilation.inProgress = false;
    
    const statusElement = document.getElementById('compilation-status');
    const compileBtn = document.getElementById('compile-btn');
    const progressElement = document.getElementById('compilation-progress');
    
    statusElement.textContent = 'Completed';
    compileBtn.disabled = false;
    compileBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Start Compilation';
    progressElement.style.width = '100%';
    
    // Mark as compiled
    devEditorState.compilerArea.compiled = true;
    
    showNotification('Malware compilation completed successfully!', 'success');
    
    // Reset progress bar after a moment
    setTimeout(() => {
        progressElement.style.width = '0%';
        statusElement.textContent = 'Ready';
    }, 2000);
}

function saveCurrentProject() {
    const projectName = document.getElementById('project-selector').value || `project-${Date.now()}`;
    
    const projectData = {
        name: projectName,
        timestamp: Date.now(),
        flowArea: devEditorState.flowArea,
        modifiersArea: devEditorState.modifiersArea,
        compilerArea: devEditorState.compilerArea
    };
    
    // Save to localStorage (in a real implementation, this would be saved to a backend)
    localStorage.setItem(`dev-project-${projectName}`, JSON.stringify(projectData));
    
    showNotification(`Project "${projectName}" saved successfully!`, 'success');
}

function loadProject() {
    const projectName = document.getElementById('project-selector').value;
    if (!projectName) {
        showNotification('Please select a project to load.', 'error');
        return;
    }
    
    const projectData = localStorage.getItem(`dev-project-${projectName}`);
    if (!projectData) {
        showNotification('Project not found.', 'error');
        return;
    }
    
    try {
        const project = JSON.parse(projectData);
        devEditorState = { ...devEditorState, ...project };
        
        // Re-render the editor with loaded data
        renderAdvancedEditor();
        
        showNotification(`Project "${projectName}" loaded successfully!`, 'success');
    } catch (error) {
        showNotification('Error loading project.', 'error');
    }
}

// Export functions for global access
window.renderAdvancedEditor = renderAdvancedEditor;
window.startCompilation = startCompilation;
window.toggleModifier = toggleModifier;
window.saveCurrentProject = saveCurrentProject;
window.loadProject = loadProject;
window.removeBlock = removeBlock;