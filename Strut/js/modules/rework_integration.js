// File: js/modules/rework_integration.js
// Integration Module for Rework Development Environment

function initReworkEnvironment() {
    console.log('Initializing Rework Development Environment...');
    
    // Initialize all rework modules
    if (typeof initReworkEditor === 'function') {
        initReworkEditor();
    }
    
    if (typeof initReworkTalents === 'function') {
        initReworkTalents();
    }
    
    if (typeof window.programmingTimer !== 'undefined' && window.programmingTimer.init) {
        window.programmingTimer.init();
    }
    
    // Initialize rework state if not exists
    if (!state.reworkEnvironment) {
        state.reworkEnvironment = {
            isActive: false,
            activeSection: 'overview',
            unlocked: true, // For development - in production this would be unlocked through progression
            lastAccessed: Date.now()
        };
    }
    
    // Add navigation integration
    addReworkNavigationItems();
}

function addReworkNavigationItems() {
    // Add rework environment to the main navigation
    const lateralMenu = document.querySelector('.menu-content');
    if (!lateralMenu) return;
    
    // Check if rework menu already exists
    if (document.getElementById('rework-nav-section')) return;
    
    // Create rework navigation section
    const reworkNavSection = document.createElement('div');
    reworkNavSection.id = 'rework-nav-section';
    reworkNavSection.className = 'menu-section rework-section';
    reworkNavSection.innerHTML = `
        <div class="menu-section-header">
            <h3 class="menu-section-title">
                <i class="fas fa-flask text-purple-400 mr-2"></i>
                Ambiente di Sviluppo v2.0
                <span class="beta-badge">BETA</span>
            </h3>
            <p class="menu-section-description">
                Nuovo sistema di editor, talenti e programmazione a tempo
            </p>
        </div>
        <div class="menu-items">
            <button class="menu-item rework-nav-btn" data-section="rework-overview" onclick="showReworkSection('overview')">
                <i class="fas fa-home"></i>
                <span>Panoramica</span>
            </button>
            <button class="menu-item rework-nav-btn" data-section="rework-editor" onclick="showReworkSection('editor')">
                <i class="fas fa-code"></i>
                <span>Editor v2.0</span>
                <div class="nav-indicator"></div>
            </button>
            <button class="menu-item rework-nav-btn" data-section="rework-talents" onclick="showReworkSection('talents')">
                <i class="fas fa-graduation-cap"></i>
                <span>Talenti v2.0</span>
                <div class="nav-indicator"></div>
            </button>
        </div>
    `;
    
    // Insert before existing menu sections or at the end
    const existingSection = lateralMenu.querySelector('.menu-section');
    if (existingSection) {
        lateralMenu.insertBefore(reworkNavSection, existingSection);
    } else {
        lateralMenu.appendChild(reworkNavSection);
    }
    
    // Update indicators periodically
    setInterval(updateReworkIndicators, 5000);
}

function showReworkSection(sectionName) {
    console.log(`Switching to rework section: ${sectionName}`);
    
    // Update state
    state.reworkEnvironment.activeSection = sectionName;
    state.reworkEnvironment.lastAccessed = Date.now();
    state.reworkEnvironment.isActive = true;
    
    // Hide all other sections
    hideAllSections();
    
    // Update navigation state
    updateReworkNavigation(sectionName);
    
    // Show the rework container
    let reworkContainer = document.getElementById('rework-main-container');
    if (!reworkContainer) {
        createReworkMainContainer();
        reworkContainer = document.getElementById('rework-main-container');
    }
    
    reworkContainer.style.display = 'block';
    
    // Render the appropriate section
    renderReworkSection(sectionName);
    
    saveState();
}

function createReworkMainContainer() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) return;
    
    const reworkContainer = document.createElement('div');
    reworkContainer.id = 'rework-main-container';
    reworkContainer.className = 'rework-main-container';
    reworkContainer.innerHTML = `
        <div class="rework-header">
            <div class="rework-breadcrumb">
                <span class="breadcrumb-item">
                    <i class="fas fa-flask text-purple-400"></i>
                    Ambiente di Sviluppo v2.0
                </span>
                <span class="breadcrumb-separator">/</span>
                <span id="rework-current-section" class="breadcrumb-current">Overview</span>
            </div>
            <div class="rework-actions">
                <button class="rework-help-btn" onclick="showReworkHelp()" title="Aiuto">
                    <i class="fas fa-question-circle"></i>
                </button>
                <button class="rework-settings-btn" onclick="showReworkSettings()" title="Impostazioni">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        </div>
        <div id="rework-content" class="rework-content">
            <!-- Section content will be rendered here -->
        </div>
    `;
    
    appContainer.appendChild(reworkContainer);
}

function renderReworkSection(sectionName) {
    const contentContainer = document.getElementById('rework-content');
    if (!contentContainer) return;
    
    // Update breadcrumb
    const currentSectionSpan = document.getElementById('rework-current-section');
    if (currentSectionSpan) {
        currentSectionSpan.textContent = getSectionDisplayName(sectionName);
    }
    
    // Clear previous content
    contentContainer.innerHTML = '';
    
    switch (sectionName) {
        case 'overview':
            renderReworkOverview(contentContainer);
            break;
        case 'editor':
            renderReworkEditorSection(contentContainer);
            break;
        case 'talents':
            renderReworkTalentsSection(contentContainer);
            break;
        default:
            contentContainer.innerHTML = '<p class="text-gray-400">Sezione non trovata</p>';
    }
}

function renderReworkOverview(container) {
    container.innerHTML = `
        <div class="rework-overview">
            <div class="overview-hero">
                <div class="hero-content">
                    <h1 class="hero-title">
                        <i class="fas fa-flask text-purple-400"></i>
                        Ambiente di Sviluppo v2.0
                    </h1>
                    <p class="hero-subtitle">
                        Un ambiente separato e sicuro per testare e sviluppare le nuove logiche del gioco
                    </p>
                    <div class="hero-features">
                        <div class="feature-tag">Template-Based Editor</div>
                        <div class="feature-tag">Core & Specialization Talents</div>
                        <div class="feature-tag">Time-Based Programming</div>
                    </div>
                </div>
                <div class="hero-stats">
                    <div class="stat-card">
                        <div class="stat-value">${getCompletedTemplates()}</div>
                        <div class="stat-label">Template Compilati</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${getTotalUnlockedReworkTalents()}</div>
                        <div class="stat-label">Talenti Sbloccati</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${getTotalCompilationTime()}</div>
                        <div class="stat-label">Tempo Programmazione</div>
                    </div>
                </div>
            </div>
            
            <div class="overview-sections">
                <div class="section-card" onclick="showReworkSection('editor')">
                    <div class="section-icon">
                        <i class="fas fa-code"></i>
                    </div>
                    <div class="section-content">
                        <h3 class="section-title">Editor v2.0</h3>
                        <p class="section-description">
                            Editor basato su template di flusso preimpostati con nodi potenziabili 
                            e interconnessioni fisse per una maggiore stabilità e controllo.
                        </p>
                        <div class="section-features">
                            <span class="feature-item">Template Preimpostati</span>
                            <span class="feature-item">Nodi Potenziabili</span>
                            <span class="feature-item">Compiler Avanzato</span>
                        </div>
                    </div>
                    <div class="section-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
                
                <div class="section-card" onclick="showReworkSection('talents')">
                    <div class="section-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="section-content">
                        <h3 class="section-title">Sistema Talenti v2.0</h3>
                        <p class="section-description">
                            Nuovo sistema con Talenti Core obbligatori per competenze trasversali 
                            e Talenti di Specializzazione per sbloccare template avanzati.
                        </p>
                        <div class="section-features">
                            <span class="feature-item">Talenti Core</span>
                            <span class="feature-item">Specializzazioni</span>
                            <span class="feature-item">Effetti Cumulativi</span>
                        </div>
                    </div>
                    <div class="section-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
                
                <div class="section-card" onclick="showReworkSection('timer')">
                    <div class="section-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="section-content">
                        <h3 class="section-title">Programmazione a Tempo</h3>
                        <p class="section-description">
                            Sistema di compilazione temporizzata che simula il tempo necessario 
                            per creare tool basato su complessità e competenze del giocatore.
                        </p>
                        <div class="section-features">
                            <span class="feature-item">Compilazione Realistica</span>
                            <span class="feature-item">Bonus Talenti</span>
                            <span class="feature-item">Accelerazione Premium</span>
                        </div>
                    </div>
                    <div class="section-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            </div>
            
            <div class="overview-changelog">
                <h3 class="changelog-title">
                    <i class="fas fa-history text-blue-400 mr-2"></i>
                    Novità di questa Versione
                </h3>
                <div class="changelog-items">
                    <div class="changelog-item">
                        <div class="changelog-type new">NUOVO</div>
                        <div class="changelog-content">
                            <h4>Template di Flusso Preimpostati</h4>
                            <p>Editor completamente riprogettato con template fissi per Ransomware, Keylogger e Botnet Agent</p>
                        </div>
                    </div>
                    <div class="changelog-item">
                        <div class="changelog-type improved">MIGLIORATO</div>
                        <div class="changelog-content">
                            <h4>Sistema Talenti Ristrutturato</h4>
                            <p>Divisione in Talenti Core (obbligatori) e Specializzazioni (verticali) per una progressione più chiara</p>
                        </div>
                    </div>
                    <div class="changelog-item">
                        <div class="changelog-type new">NUOVO</div>
                        <div class="changelog-content">
                            <h4>Programmazione a Tempo</h4>
                            <p>Sistema realistico di compilazione con tempi basati su complessità e competenze del giocatore</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderReworkEditorSection(container) {
    container.innerHTML = '<div id="rework-editor-container"></div>';
    if (typeof initReworkEditor === 'function') {
        initReworkEditor();
    }
}

function renderReworkTalentsSection(container) {
    container.innerHTML = '<div id="rework-talents-container"></div>';
    if (typeof initReworkTalents === 'function') {
        initReworkTalents();
    }
}

function updateReworkNavigation(activeSection) {
    // Update navigation button states
    document.querySelectorAll('.rework-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === `rework-${activeSection}`) {
            btn.classList.add('active');
        }
    });
}

function updateReworkIndicators() {
    // Update compilation indicator
    const compilationIndicator = document.querySelector('.compilation-indicator');
    if (compilationIndicator) {
        const activeCompilations = window.activeCompilations ? window.activeCompilations.size : 0;
        if (activeCompilations > 0) {
            compilationIndicator.classList.add('active');
            compilationIndicator.style.setProperty('--count', activeCompilations);
        } else {
            compilationIndicator.classList.remove('active');
        }
    }
    
    // Update other indicators as needed
    // Could add indicators for available talent points, completed templates, etc.
}

function hideAllSections() {
    // Hide all existing sections
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        Array.from(appContainer.children).forEach(child => {
            if (child.id !== 'rework-main-container') {
                child.style.display = 'none';
            }
        });
    }
    
    // Hide notification container if it exists
    const notificationContainer = document.getElementById('notification-container');
    if (notificationContainer) {
        notificationContainer.style.display = 'none';
    }
}

function showReworkHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'modal-overlay';
    helpModal.innerHTML = `
        <div class="modal-content rework-help-modal">
            <div class="modal-header">
                <h3 class="modal-title">
                    <i class="fas fa-question-circle text-blue-400 mr-2"></i>
                    Guida all'Ambiente di Sviluppo v2.0
                </h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="help-sections">
                    <div class="help-section">
                        <h4><i class="fas fa-code text-purple-400 mr-2"></i>Editor v2.0</h4>
                        <ul class="help-list">
                            <li>Seleziona un template preimpostato (Ransomware, Keylogger, Botnet Agent)</li>
                            <li>Potenzia i nodi cliccando sui bottoni di upgrade</li>
                            <li>Le interconnessioni sono fisse per garantire stabilità</li>
                            <li>Usa il compiler per creare il tool finale con opzioni avanzate</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h4><i class="fas fa-graduation-cap text-yellow-400 mr-2"></i>Talenti v2.0</h4>
                        <ul class="help-list">
                            <li><strong>Talenti Core:</strong> Obbligatori, competenze trasversali (Sviluppo, Networking, Stealth, Ingegneria Sociale)</li>
                            <li><strong>Specializzazioni:</strong> Verticali, sbloccano template e funzionalità avanzate</li>
                            <li>I talenti riducono i tempi di compilazione e migliorano l'efficacia</li>
                            <li>Le specializzazioni richiedono talenti core specifici</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h4><i class="fas fa-clock text-blue-400 mr-2"></i>Programmazione a Tempo</h4>
                        <ul class="help-list">
                            <li>Il tempo di compilazione dipende dalla complessità del tool</li>
                            <li>I talenti riducono significativamente i tempi</li>
                            <li>Puoi accelerare le compilazioni spendendo XMR</li>
                            <li>L'efficienza migliora con l'esperienza</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(helpModal);
}

function showReworkSettings() {
    const settingsModal = document.createElement('div');
    settingsModal.className = 'modal-overlay';
    settingsModal.innerHTML = `
        <div class="modal-content rework-settings-modal">
            <div class="modal-header">
                <h3 class="modal-title">
                    <i class="fas fa-cog text-purple-400 mr-2"></i>
                    Impostazioni Ambiente di Sviluppo v2.0
                </h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="settings-section">
                    <h4 class="text-lg font-semibold text-white mb-4">
                        <i class="fas fa-tools text-orange-400 mr-2"></i>
                        Strumenti di Debug
                    </h4>
                    <div class="settings-group">
                        <p class="text-gray-400 mb-4">Resetta completamente tutti i progressi dell'ambiente di sviluppo per il testing.</p>
                        <button class="btn-danger w-full" onclick="resetReworkEnvironment(); this.closest('.modal-overlay').remove();">
                            <i class="fas fa-trash-alt mr-2"></i>
                            Reset Completo
                        </button>
                    </div>
                </div>
                
                <div class="settings-section mt-6">
                    <h4 class="text-lg font-semibold text-white mb-4">
                        <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                        Informazioni
                    </h4>
                    <div class="settings-info">
                        <p class="text-gray-400">
                            Ambiente di Sviluppo v2.0 - Sistema completo di testing per le nuove meccaniche di gioco.
                        </p>
                        <p class="text-sm text-gray-500 mt-2">
                            Version: 2.0.0-beta | Build: ${Date.now()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(settingsModal);
}

// Helper functions
function getSectionDisplayName(sectionName) {
    const names = {
        'overview': 'Panoramica',
        'editor': 'Editor v2.0',
        'talents': 'Talenti v2.0'
    };
    return names[sectionName] || sectionName;
}

function getCompletedTemplates() {
    if (!state.reworkEditor) return 0;
    return state.reworkEditor.compilationHistory ? state.reworkEditor.compilationHistory.length : 0;
}

function getTotalUnlockedReworkTalents() {
    if (!state.reworkTalents) return 0;
    const coreCount = Object.values(state.reworkTalents.unlockedCore || {}).filter(level => level > 0).length;
    const specCount = Object.values(state.reworkTalents.unlockedSpecialization || {}).filter(level => level > 0).length;
    return coreCount + specCount;
}

function getTotalCompilationTime() {
    if (!state.programmingTimer) return "0:00";
    const totalSeconds = state.programmingTimer.totalCompilationTime || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}h`;
    } else {
        return `${minutes}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
    }
}

function resetReworkEnvironment() {
    if (!confirm('Sei sicuro di voler resettare tutti i progressi dell\'Ambiente di Sviluppo v2.0? Questa azione è irreversibile.')) {
        return;
    }
    
    // Reset all rework-related state
    state.reworkEnvironment = {
        isActive: false,
        activeSection: 'overview',
        unlocked: true,
        lastAccessed: Date.now()
    };
    
    state.reworkEditor = {
        availableTemplates: Object.keys(toolTemplates),
        activeTemplate: null,
        nodeUpgrades: {},
        appliedModifiers: {},
        compilationHistory: [],
        compiledMalware: [],
        unlockedOptions: [],
        selectedCompilerOptions: []
    };
    
    state.reworkTalents = {
        unlockedCore: {},
        unlockedSpecialization: {},
        studyingCore: {},
        studyingSpecialization: {}
    };
    
    state.programmingTimer = {
        activeCompilations: {},
        completedCompilations: [],
        totalCompilationTime: 0,
        efficiencyRating: 1.0
    };
    
    // Clear any active compilations
    if (window.activeCompilations) {
        window.activeCompilations.clear();
    }
    
    // Clear any intervals
    document.querySelectorAll('*').forEach(el => {
        if (el.interval) {
            clearInterval(el.interval);
        }
    });
    
    // Reset talent points for testing (give 50 points)
    state.talentPoints = 50;
    
    saveState();
    
    // Refresh the current view
    if (document.getElementById('rework-main-container').style.display === 'block') {
        const currentSection = state.reworkEnvironment.activeSection;
        showReworkSection(currentSection);
    }
    
    showNotification('Ambiente di Sviluppo v2.0 resettato completamente', 'success');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure other systems are initialized
    setTimeout(initReworkEnvironment, 1000);
});

// Export functions for global access
window.showReworkSection = showReworkSection;
window.showReworkHelp = showReworkHelp;
window.showReworkSettings = showReworkSettings;
window.resetReworkEnvironment = resetReworkEnvironment;