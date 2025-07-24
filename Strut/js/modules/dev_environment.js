// File: js/modules/dev_environment.js
// Development Environment - Entry point for new game logic systems
// This module provides access to the reworked editor, talents, and time-based programming

let devEnvironmentState = {
    isActive: false,
    currentTab: 'editor',
    compilation: {
        inProgress: false,
        startTime: null,
        estimatedDuration: 0,
        currentProject: null
    }
};

function renderDevEnvironmentPage() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
        <div class="dev-environment-container h-full bg-gray-900">
            <!-- Header -->
            <div class="dev-environment-header bg-gray-800 border-b border-purple-500 p-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <h1 class="text-2xl font-bold text-purple-400">
                            <i class="fas fa-flask mr-2"></i>
                            Development Environment
                        </h1>
                        <div class="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                            EXPERIMENTAL
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button onclick="showPage('hq')" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                            <i class="fas fa-home mr-2"></i>
                            Return to HQ
                        </button>
                    </div>
                </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="dev-environment-nav bg-gray-800 border-b border-gray-600 px-4">
                <div class="flex space-x-1">
                    <button onclick="switchDevTab('editor')" 
                            class="dev-tab-btn ${devEnvironmentState.currentTab === 'editor' ? 'active' : ''}" 
                            data-tab="editor">
                        <i class="fas fa-project-diagram mr-2"></i>
                        Advanced Editor
                    </button>
                    <button onclick="switchDevTab('talents')" 
                            class="dev-tab-btn ${devEnvironmentState.currentTab === 'talents' ? 'active' : ''}" 
                            data-tab="talents">
                        <i class="fas fa-tree mr-2"></i>
                        New Talents
                    </button>
                    <button onclick="switchDevTab('compiler')" 
                            class="dev-tab-btn ${devEnvironmentState.currentTab === 'compiler' ? 'active' : ''}" 
                            data-tab="compiler">
                        <i class="fas fa-cog mr-2"></i>
                        Time Compiler
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="dev-environment-content flex-1 overflow-hidden">
                <div id="dev-editor-tab" class="dev-tab-content ${devEnvironmentState.currentTab === 'editor' ? 'active' : ''}">
                    <!-- Advanced Editor will be rendered here -->
                </div>
                <div id="dev-talents-tab" class="dev-tab-content ${devEnvironmentState.currentTab === 'talents' ? 'active' : ''}">
                    <!-- New Talents system will be rendered here -->
                </div>
                <div id="dev-compiler-tab" class="dev-tab-content ${devEnvironmentState.currentTab === 'compiler' ? 'active' : ''}">
                    <!-- Time-based Compiler will be rendered here -->
                </div>
            </div>
        </div>
    `;

    // Initialize the current tab
    switchDevTab(devEnvironmentState.currentTab);
}

function switchDevTab(tabName) {
    devEnvironmentState.currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.dev-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    document.querySelectorAll('.dev-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `dev-${tabName}-tab`);
    });
    
    // Render content for the selected tab
    switch(tabName) {
        case 'editor':
            renderAdvancedEditor();
            break;
        case 'talents':
            renderNewTalentsSystem();
            break;
        case 'compiler':
            renderTimeBasedCompiler();
            break;
    }
}

function initDevEnvironment() {
    devEnvironmentState.isActive = true;
    console.log('Development Environment initialized');
}

// Export functions for global access
window.renderDevEnvironmentPage = renderDevEnvironmentPage;
window.switchDevTab = switchDevTab;
window.initDevEnvironment = initDevEnvironment;