// Development Environment Main Controller
// File: js/dev-main.js

class DevEnvironmentController {
    constructor() {
        this.currentSection = 'editor';
        this.initialized = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.initializeIntegrations();
        this.loadSavedState();
        
        // Mark as initialized
        this.initialized = true;
        
        // Run initial validation
        setTimeout(() => {
            this.validateEnvironment();
        }, 1000);
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                if (section) {
                    this.switchSection(section);
                }
            });
        });

        // Header controls
        document.getElementById('reset-btn')?.addEventListener('click', () => {
            this.resetEnvironment();
        });

        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportConfiguration();
        });

        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });

        // Auto-save every 30 seconds
        setInterval(() => {
            this.saveCurrentState();
        }, 30000);
    }

    setupNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.dev-section');

        // Ensure proper initial state
        tabs.forEach(tab => tab.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        // Activate default section
        const defaultTab = document.querySelector(`[data-section="${this.currentSection}"]`);
        const defaultSection = document.getElementById(`${this.currentSection}-section`);

        if (defaultTab) defaultTab.classList.add('active');
        if (defaultSection) defaultSection.classList.add('active');
    }

    switchSection(sectionName) {
        if (this.currentSection === sectionName) return;

        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.dev-section').forEach(section => {
            section.classList.remove('active');
        });

        // Activate new section
        const newTab = document.querySelector(`[data-section="${sectionName}"]`);
        const newSection = document.getElementById(`${sectionName}-section`);

        if (newTab) newTab.classList.add('active');
        if (newSection) newSection.classList.add('active');

        this.currentSection = sectionName;
        devState.currentSection = sectionName;

        // Trigger section-specific updates
        this.onSectionSwitch(sectionName);

        saveStateDebounced();
    }

    onSectionSwitch(sectionName) {
        switch (sectionName) {
            case 'editor':
                if (window.newFlowEditor) {
                    newFlowEditor.renderTemplateList();
                }
                break;
            case 'talents':
                if (window.newTalentSystem) {
                    newTalentSystem.renderTalentTree();
                }
                break;
            case 'compiler':
                if (window.timeProgramming) {
                    timeProgramming.renderCompilationQueue();
                    timeProgramming.renderCompilationSettings();
                }
                break;
            case 'testing':
                // Testing section is always ready
                break;
        }
    }

    initializeIntegrations() {
        // Set up cross-system integrations
        this.setupEditorTalentIntegration();
        this.setupCompilationIntegration();
        this.setupStateSync();
    }

    setupEditorTalentIntegration() {
        // When talents are unlocked, update available templates in editor
        const originalUnlockTalent = window.newTalentSystem?.unlockTalent;
        if (originalUnlockTalent && window.newFlowEditor) {
            // This will be handled in the talent system itself
        }
    }

    setupCompilationIntegration() {
        // Ensure compilation system can access talent bonuses
        if (window.timeProgramming && window.newTalentSystem) {
            // Integration is handled in the time programming system
        }
    }

    setupStateSync() {
        // Ensure all systems save state when needed
        const systems = ['newFlowEditor', 'newTalentSystem', 'timeProgramming'];
        systems.forEach(systemName => {
            const system = window[systemName];
            if (system && typeof system.saveState === 'function') {
                // Systems should call saveStateDebounced() internally
            }
        });
    }

    loadSavedState() {
        // State is automatically loaded in dev-state.js
        // Just ensure we're in the right section
        if (devState.currentSection && devState.currentSection !== this.currentSection) {
            this.switchSection(devState.currentSection);
        }
    }

    saveCurrentState() {
        devState.currentSection = this.currentSection;
        devState.saveState();
    }

    resetEnvironment() {
        if (!confirm('Are you sure you want to reset the development environment? This will clear all progress and settings.')) {
            return;
        }

        // Reset all systems
        devState.resetState();

        // Reinitialize all systems
        if (window.newFlowEditor) {
            newFlowEditor.clearCanvas();
            newFlowEditor.renderTemplateList();
        }

        if (window.newTalentSystem) {
            newTalentSystem.renderTalentTree();
        }

        if (window.timeProgramming) {
            timeProgramming.compilationJobs = [];
            timeProgramming.activeJobs = [];
            timeProgramming.completedJobs = [];
            timeProgramming.renderCompilationQueue();
            timeProgramming.renderCompilationSettings();
        }

        // Reset UI
        this.currentSection = 'editor';
        this.switchSection('editor');

        // Show reset notification
        this.showNotification('Environment Reset', 'Development environment has been reset to initial state.', 'info');
    }

    exportConfiguration() {
        try {
            devState.exportConfiguration();
            this.showNotification('Export Complete', 'Configuration exported successfully.', 'success');
        } catch (error) {
            this.showNotification('Export Failed', `Failed to export configuration: ${error.message}`, 'error');
        }
    }

    validateEnvironment() {
        const validationResults = {
            systems: this.validateSystems(),
            integrations: this.validateIntegrations(),
            data: this.validateData()
        };

        let hasErrors = false;
        const issues = [];

        Object.entries(validationResults).forEach(([category, results]) => {
            results.forEach(result => {
                if (!result.success) {
                    hasErrors = true;
                    issues.push(`${category}: ${result.message}`);
                }
            });
        });

        if (hasErrors) {
            console.warn('Development Environment Validation Issues:', issues);
            this.showNotification(
                'Validation Warning', 
                `${issues.length} issue(s) found. Check console for details.`, 
                'warning'
            );
        } else {
            console.log('Development Environment: All systems validated successfully');
        }

        return !hasErrors;
    }

    validateSystems() {
        const results = [];

        // Check if all required systems are initialized
        const requiredSystems = [
            { name: 'newFlowEditor', global: 'newFlowEditor' },
            { name: 'newTalentSystem', global: 'newTalentSystem' },
            { name: 'timeProgramming', global: 'timeProgramming' },
            { name: 'devTestingSuite', global: 'devTestingSuite' }
        ];

        requiredSystems.forEach(system => {
            const exists = window[system.global] !== undefined;
            results.push({
                success: exists,
                message: exists ? `${system.name} initialized` : `${system.name} not found`
            });
        });

        return results;
    }

    validateIntegrations() {
        const results = [];

        // Check data availability
        const requiredData = ['editorTemplates', 'newTalentTree', 'nodeEnhancements'];
        requiredData.forEach(dataName => {
            const exists = window[dataName] !== undefined;
            results.push({
                success: exists,
                message: exists ? `${dataName} available` : `${dataName} missing`
            });
        });

        // Check system interactions
        if (window.newFlowEditor && window.newTalentSystem) {
            try {
                const canCheckRequirements = typeof newFlowEditor.checkTalentRequirements === 'function';
                results.push({
                    success: canCheckRequirements,
                    message: canCheckRequirements ? 'Editor-Talent integration working' : 'Editor-Talent integration broken'
                });
            } catch (error) {
                results.push({
                    success: false,
                    message: `Editor-Talent integration error: ${error.message}`
                });
            }
        }

        return results;
    }

    validateData() {
        const results = [];

        // Validate template data
        if (window.editorTemplates) {
            const templateCount = Object.keys(editorTemplates).length;
            results.push({
                success: templateCount > 0,
                message: templateCount > 0 ? `${templateCount} templates loaded` : 'No templates available'
            });

            // Check template structure
            const invalidTemplates = [];
            Object.entries(editorTemplates).forEach(([id, template]) => {
                if (!template.name || !template.nodes || !Array.isArray(template.nodes)) {
                    invalidTemplates.push(id);
                }
            });

            results.push({
                success: invalidTemplates.length === 0,
                message: invalidTemplates.length === 0 ? 'All templates valid' : `Invalid templates: ${invalidTemplates.join(', ')}`
            });
        }

        // Validate talent tree data
        if (window.newTalentTree) {
            const branches = Object.keys(newTalentTree);
            const expectedBranches = ['Sviluppo', 'Networking', 'Stealth', 'Ingegneria Sociale'];
            const missingBranches = expectedBranches.filter(branch => !branches.includes(branch));

            results.push({
                success: missingBranches.length === 0,
                message: missingBranches.length === 0 ? 'All talent branches present' : `Missing branches: ${missingBranches.join(', ')}`
            });
        }

        return results;
    }

    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            info: 'bg-blue-800 border-blue-600',
            success: 'bg-green-800 border-green-600',
            warning: 'bg-yellow-800 border-yellow-600',
            error: 'bg-red-800 border-red-600'
        };

        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };

        notification.className = `fixed top-4 right-4 ${colors[type]} border rounded-lg p-4 z-50 fade-in max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="fas ${icons[type]} mt-1 mr-3"></i>
                <div class="flex-1">
                    <h5 class="font-semibold text-white">${title}</h5>
                    <div class="text-sm text-gray-200 mt-1">${message}</div>
                </div>
                <button class="ml-2 text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getSystemStatus() {
        return {
            initialized: this.initialized,
            currentSection: this.currentSection,
            systems: {
                editor: !!window.newFlowEditor,
                talents: !!window.newTalentSystem,
                compilation: !!window.timeProgramming,
                testing: !!window.devTestingSuite
            },
            validation: this.validateEnvironment()
        };
    }

    // Integration helpers for main game
    exportForIntegration() {
        return {
            templates: window.editorTemplates,
            talentTree: window.newTalentTree,
            enhancements: window.nodeEnhancements,
            modifiers: window.globalModifiers,
            state: devState,
            systems: {
                editor: window.newFlowEditor,
                talents: window.newTalentSystem,
                compilation: window.timeProgramming
            }
        };
    }

    importFromMainGame(gameState) {
        // This would allow importing existing game state for testing
        if (gameState.talentPoints) {
            devState.talentState.talentPoints = gameState.talentPoints;
        }
        
        if (gameState.unlockedTalents) {
            Object.assign(devState.talentState.unlockedTalents, gameState.unlockedTalents);
        }

        // Refresh all systems
        this.onSectionSwitch(this.currentSection);
        saveStateDebounced();
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the development environment controller
    window.devEnvironmentController = new DevEnvironmentController();
    
    console.log('Development Environment Initialized');
    console.log('Available systems:', {
        editor: !!window.newFlowEditor,
        talents: !!window.newTalentSystem,
        compilation: !!window.timeProgramming,
        testing: !!window.devTestingSuite,
        controller: !!window.devEnvironmentController
    });
});

// Global utilities for console debugging
window.devUtils = {
    getStatus: () => window.devEnvironmentController?.getSystemStatus(),
    runTests: () => window.devTestingSuite?.runAllTests(),
    resetEnv: () => window.devEnvironmentController?.resetEnvironment(),
    exportConfig: () => window.devEnvironmentController?.exportConfiguration(),
    addTalentPoints: (amount) => {
        devState.talentState.talentPoints += amount;
        if (window.newTalentSystem) {
            newTalentSystem.renderTalentTree();
        }
        saveStateDebounced();
    },
    addXP: (branch, amount) => {
        if (window.newTalentSystem) {
            newTalentSystem.addXP(branch, amount);
        }
    },
    listTemplates: () => Object.keys(window.editorTemplates || {}),
    getCurrentState: () => devState
};