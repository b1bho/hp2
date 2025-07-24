// Development Environment State Management
// File: js/dev-state.js

class DevEnvironmentState {
    constructor() {
        this.currentSection = 'editor';
        this.editorState = {
            selectedTemplate: null,
            activeFlow: null,
            selectedNode: null,
            enhancements: {}
        };
        this.talentState = {
            unlockedTalents: {
                'Sviluppo': { level: 0, xp: 0 },
                'Networking': { level: 0, xp: 0 },
                'Stealth': { level: 0, xp: 0 },
                'Ingegneria Sociale': { level: 0, xp: 0 }
            },
            talentPoints: 10,
            selectedTalent: null
        };
        this.compilationState = {
            queue: [],
            active: [],
            completed: [],
            settings: {
                baseCompilationTime: 30,
                complexityMultiplier: 1.5,
                talentReduction: 0.1
            }
        };
        this.testResults = [];
        
        this.loadState();
    }

    saveState() {
        const stateData = {
            currentSection: this.currentSection,
            editorState: this.editorState,
            talentState: this.talentState,
            compilationState: this.compilationState,
            testResults: this.testResults
        };
        localStorage.setItem('dev-environment-state', JSON.stringify(stateData));
    }

    loadState() {
        const saved = localStorage.getItem('dev-environment-state');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.assign(this, data);
            } catch (e) {
                console.warn('Could not load saved state:', e);
            }
        }
    }

    resetState() {
        localStorage.removeItem('dev-environment-state');
        this.currentSection = 'editor';
        this.editorState = {
            selectedTemplate: null,
            activeFlow: null,
            selectedNode: null,
            enhancements: {}
        };
        this.talentState = {
            unlockedTalents: {
                'Sviluppo': { level: 0, xp: 0 },
                'Networking': { level: 0, xp: 0 },
                'Stealth': { level: 0, xp: 0 },
                'Ingegneria Sociale': { level: 0, xp: 0 }
            },
            talentPoints: 10,
            selectedTalent: null
        };
        this.compilationState = {
            queue: [],
            active: [],
            completed: [],
            settings: {
                baseCompilationTime: 30,
                complexityMultiplier: 1.5,
                talentReduction: 0.1
            }
        };
        this.testResults = [];
    }

    exportConfiguration() {
        const config = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            editorTemplates: this.getEditorTemplates(),
            talentTree: this.getTalentTree(),
            compilationSettings: this.compilationState.settings,
            testResults: this.testResults
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dev-environment-config-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getEditorTemplates() {
        return editorTemplates;
    }

    getTalentTree() {
        return newTalentTree;
    }
}

// Global state instance
const devState = new DevEnvironmentState();

// Auto-save state on changes
let saveTimeout;
function saveStateDebounced() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        devState.saveState();
    }, 1000);
}