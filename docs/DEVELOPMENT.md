# Guida per Sviluppatori 👨‍💻

Questa guida fornisce tutte le informazioni necessarie per contribuire allo sviluppo di Hacker Tycoon, inclusi setup dell'ambiente, convenzioni di codice e workflow di sviluppo.

## 📋 Indice

- [Setup Ambiente di Sviluppo](#setup-ambiente-di-sviluppo)
- [Struttura del Progetto](#struttura-del-progetto)
- [Convenzioni di Codice](#convenzioni-di-codice)
- [Workflow di Sviluppo](#workflow-di-sviluppo)
- [Testing e Debug](#testing-e-debug)
- [Performance Guidelines](#performance-guidelines)
- [Contribuire al Progetto](#contribuire-al-progetto)

## ⚙️ Setup Ambiente di Sviluppo

### Prerequisiti

- **Node.js** (versione 14+ per tooling opzionale)
- **Git** per version control
- **Browser moderno** con Developer Tools
- **Editor di codice** (VS Code raccomandato)

### Setup Iniziale

```bash
# Clone del repository
git clone https://github.com/b1bho/hp2.git
cd hp2

# Setup server di sviluppo (opzionale)
cd Strut
python3 -m http.server 8000
# oppure
npx serve . --cors

# Apri browser
open http://localhost:8000
```

### Estensioni VS Code Raccomandate

```json
{
    "recommendations": [
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-json",
        "bradlc.vscode-tailwindcss",
        "christian-kohler.path-intellisense"
    ]
}
```

### Configurazione Debugging

**VS Code launch.json:**
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome",
            "url": "http://localhost:8000",
            "webRoot": "${workspaceFolder}/Strut"
        }
    ]
}
```

## 🗂️ Struttura del Progetto

### Directory Layout

```
hp2/
├── README.md                 # Documentazione principale
├── docs/                    # Documentazione dettagliata
│   ├── ARCHITECTURE.md
│   ├── MODULES.md
│   ├── GAME_MECHANICS.md
│   ├── DEVELOPMENT.md (questo file)
│   └── API.md
└── Strut/                   # Applicazione principale
    ├── index.html           # Entry point
    ├── css/
    │   └── style.css        # Stili personalizzati
    ├── js/
    │   ├── main.js          # Core application
    │   ├── data.js          # Game data & config
    │   ├── flow_logic.js    # Flow editor logic
    │   ├── flow_validation.js
    │   ├── world_data.js    # World/nations data
    │   ├── world_targets_data.js
    │   ├── quest_data.js    # Missions data
    │   ├── news_data.js     # News system
    │   └── modules/         # Feature modules
    │       ├── hq.js
    │       ├── world.js
    │       ├── botnet.js
    │       ├── editor.js
    │       ├── market.js
    │       ├── dark_market.js
    │       ├── profile.js
    │       ├── quests.js
    │       ├── intelligence.js
    │       ├── active_attacks.js
    │       └── admin.js
    └── assets/              # Risorse statiche (se presenti)
```

### File Naming Conventions

- **JavaScript files**: snake_case (es. `flow_logic.js`)
- **CSS classes**: kebab-case (es. `.talent-tree`)
- **IDs**: kebab-case (es. `#app-container`)
- **Functions**: camelCase (es. `renderHqPage()`)
- **Variables**: camelCase (es. `currentPage`)
- **Constants**: UPPER_SNAKE_CASE (es. `GRID_SIZE`)

## 📝 Convenzioni di Codice

### JavaScript Style Guide

#### Variabili e Funzioni

```javascript
// ✅ Corretto
const GRID_SIZE = 20;
let currentPage = 'hq';
const selectedHostIds = new Set();

function renderHqPage() {
    // Implementation
}

function calculateTotalBonus(hardwareBonuses, clanBonuses) {
    return hardwareBonuses + clanBonuses;
}

// ❌ Evitare
var grid_size = 20; // usa const/let
function render_hq_page() {} // usa camelCase
```

#### Struttura dei Moduli

Ogni modulo deve seguire questo pattern:

```javascript
// File: js/modules/example.js
// VERSIONE: Descrizione delle modifiche più recenti

// --- VARIABILI PRIVATE DEL MODULO ---
let moduleState = {};

// --- FUNZIONI PRINCIPALI ---
function renderExamplePage() {
    const container = document.getElementById('app-container');
    container.innerHTML = generateExampleHTML();
    initExampleListeners();
}

function initExampleListeners() {
    // Event binding specifico del modulo
}

// --- FUNZIONI HELPER ---
function generateExampleHTML() {
    return `<div class="example-layout">
        <!-- Template HTML -->
    </div>`;
}

// --- FUNZIONI ESPORTATE (se necessarie) ---
window.exampleFunctions = {
    // API pubblica del modulo
};
```

#### Error Handling

```javascript
// ✅ Gestione robusta degli errori
function loadState() {
    try {
        const savedState = localStorage.getItem('hackerAppState');
        if (savedState) {
            const loadedState = JSON.parse(savedState);
            state = deepMerge(state, loadedState);
        }
    } catch (error) {
        console.error("Errore nel caricamento stato:", error);
        showNotification('Errore nel caricamento dati salvati', 'error');
        localStorage.removeItem('hackerAppState');
    }
}

// ❌ Evitare catch vuoti
try {
    riskyOperation();
} catch (e) {
    // Silent failure - BAD!
}
```

#### DOM Manipulation

```javascript
// ✅ Check esistenza elementi
function updateUI() {
    const container = document.getElementById('app-container');
    if (!container) {
        console.warn('Container non trovato');
        return;
    }
    container.innerHTML = generateHTML();
}

// ✅ Cache DOM references quando possibile
const btcBalanceEl = document.getElementById('btc-balance');
const xmrBalanceEl = document.getElementById('xmr-balance');

function updateBalances() {
    if (btcBalanceEl) btcBalanceEl.textContent = state.btcBalance;
    if (xmrBalanceEl) xmrBalanceEl.textContent = state.xmrBalance;
}
```

### CSS Guidelines

#### Naming Convention (BEM-inspired)

```css
/* Block */
.talent-tree {}

/* Block__element */
.talent-tree__branch {}
.talent-tree__talent {}

/* Block--modifier */
.talent-tree--collapsed {}

/* Element--modifier */
.talent-tree__talent--acquired {}
```

#### Responsive Design

```css
/* Mobile-first approach */
.container {
    width: 100%;
    padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### HTML Best Practices

```html
<!-- ✅ Semantic HTML -->
<main id="app-container">
    <section class="hq-stats">
        <h2>Statistiche HQ</h2>
        <article class="stat-card">
            <h3>Hardware</h3>
            <p>Dettagli hardware...</p>
        </article>
    </section>
</main>

<!-- ✅ Accessibility -->
<button aria-label="Chiudi modal" onclick="closeModal()">
    <i class="fas fa-times" aria-hidden="true"></i>
</button>

<!-- ✅ Data attributes per JavaScript -->
<div class="talent-btn" 
     data-talent="Social Engineering" 
     data-level="1"
     data-cost="1">
    Acquista Talento
</div>
```

## 🔄 Workflow di Sviluppo

### Git Workflow

#### Branch Strategy

```bash
# Main branch - stable release
main

# Development branch - integration
develop

# Feature branches
feature/new-module
feature/ui-improvements
feature/bug-fixes

# Hotfix branches (da main)
hotfix/critical-bug-fix
```

#### Commit Messages

```bash
# ✅ Formato raccomandato
git commit -m "Add: nuovo modulo intelligence per raccolta dati"
git commit -m "Fix: correzione calcolo tracciabilità IP"
git commit -m "Update: miglioramento performance editor flussi"
git commit -m "Docs: aggiornamento documentazione API"

# Prefissi utilizzati:
# Add: nuove funzionalità
# Fix: correzione bug
# Update: miglioramenti funzionalità esistenti
# Refactor: ristrutturazione codice
# Docs: documentazione
# Style: formattazione, CSS
# Test: aggiunta/modifica test
```

#### Feature Development Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Development**
   - Implementa funzionalità
   - Testa manualmente
   - Aggiorna documentazione

3. **Pre-commit checks**
   ```bash
   # Verifica sintassi JavaScript
   node -c js/main.js
   
   # Verifica HTML
   html5validator Strut/index.html
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add: nuova funzionalità XYZ"
   git push origin feature/new-feature
   ```

5. **Pull Request**
   - Descrizione dettagliata delle modifiche
   - Screenshots per modifiche UI
   - Testing instructions

### Release Process

#### Version Numbering

Segue Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: Nuove funzionalità backward-compatible
- **PATCH**: Bug fixes

#### Release Checklist

- [ ] Tutti i test passano
- [ ] Documentazione aggiornata
- [ ] Performance check
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] Accessibility check

## 🧪 Testing e Debug

### Manual Testing Strategy

#### Core Functionality Tests

```javascript
// Test checklist per ogni release
const testScenarios = [
    // Navigation
    "✓ Navigazione tra tutte le pagine funziona",
    "✓ State viene salvato/caricato correttamente",
    
    // Game Mechanics
    "✓ Acquisizione talenti funziona",
    "✓ Studio talenti procede correttamente",
    "✓ Calcolo XP e level-up",
    
    // Editor
    "✓ Drag-and-drop blocchi nell'editor",
    "✓ Connessioni tra blocchi",
    "✓ Validazione flussi",
    
    // Economy
    "✓ Acquisti nel mercato",
    "✓ Aggiornamento bilanci crypto",
    
    // Botnet
    "✓ Gestione host infetti",
    "✓ Lancio attacchi",
    
    // Persistence
    "✓ Salvataggio stato tra sessioni",
    "✓ Reset stato funziona"
];
```

#### Browser Testing

- **Chrome** (primary)
- **Firefox**
- **Safari** (macOS)
- **Edge**

#### Mobile Testing

- **iOS Safari**
- **Chrome Mobile**
- **Firefox Mobile**

### Debug Techniques

#### Console Logging

```javascript
// ✅ Structured logging
console.group('🎯 Attack Processing');
console.log('Target:', targetData);
console.log('Flow:', flowData);
console.log('Result:', result);
console.groupEnd();

// ✅ Debug helpers
function debugState() {
    console.table(state);
}

function debugConnections() {
    console.log('Active connections:', lines);
}

// Aggiungi al global scope per debug
window.debugHelpers = { debugState, debugConnections };
```

#### Performance Monitoring

```javascript
// ✅ Performance timing
function performanceWrapper(func, name) {
    return function(...args) {
        console.time(name);
        const result = func.apply(this, args);
        console.timeEnd(name);
        return result;
    };
}

// Usa per funzioni critiche
const timedRenderHqPage = performanceWrapper(renderHqPage, 'renderHqPage');
```

## ⚡ Performance Guidelines

### JavaScript Performance

#### DOM Manipulation

```javascript
// ❌ Evitare multiple DOM queries
for (let i = 0; i < items.length; i++) {
    document.getElementById('container').appendChild(items[i]);
}

// ✅ Cache container reference
const container = document.getElementById('container');
const fragment = document.createDocumentFragment();
for (let i = 0; i < items.length; i++) {
    fragment.appendChild(items[i]);
}
container.appendChild(fragment);
```

#### Event Handling

```javascript
// ❌ Multiple event listeners
buttons.forEach(btn => {
    btn.addEventListener('click', handleClick);
});

// ✅ Event delegation
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn')) {
        handleClick(event);
    }
});
```

#### Memory Management

```javascript
// ✅ Cleanup timers
function startGameLoop() {
    const intervalId = setInterval(updateGame, 1000);
    
    // Cleanup quando necessario
    window.addEventListener('beforeunload', () => {
        clearInterval(intervalId);
    });
}

// ✅ Remove event listeners
function cleanupModule() {
    const elements = document.querySelectorAll('.module-element');
    elements.forEach(el => {
        el.removeEventListener('click', handler);
    });
}
```

### CSS Performance

```css
/* ✅ Efficient selectors */
.talent-btn { /* class selector - fast */ }
#app-container { /* ID selector - fastest */ }

/* ❌ Avoid expensive selectors */
div.container > ul li:nth-child(2) { /* slow */ }

/* ✅ Use transform for animations */
.modal-enter {
    transform: translateY(-20px);
    transition: transform 0.3s ease;
}

.modal-enter.active {
    transform: translateY(0);
}
```

## 🤝 Contribuire al Progetto

### Tipo di Contributi

1. **Bug Reports**
   - Usa GitHub Issues
   - Include steps to reproduce
   - Browser/OS information
   - Screenshots se pertinenti

2. **Feature Requests**
   - Descrizione dettagliata
   - Use case scenarios
   - Mockups/wireframes se disponibili

3. **Code Contributions**
   - Fork repository
   - Create feature branch
   - Implement with tests
   - Submit Pull Request

### Pull Request Guidelines

#### Template

```markdown
## Descrizione
Breve descrizione delle modifiche

## Tipo di Modifica
- [ ] Bug fix
- [ ] Nuova funzionalità
- [ ] Breaking change
- [ ] Documentazione

## Testing
- [ ] Testato manualmente
- [ ] Cross-browser testing
- [ ] Mobile testing

## Screenshots
<!-- Se applicable -->

## Checklist
- [ ] Codice segue style guide
- [ ] Documentazione aggiornata
- [ ] No console errors
```

#### Review Process

1. **Automated checks** (se configurati)
2. **Manual review** da maintainers
3. **Testing** delle modifiche
4. **Merge** dopo approvazione

### Community Guidelines

- **Rispetto**: Commenti costruttivi e professionali
- **Collaborazione**: Aperto a feedback e suggerimenti
- **Qualità**: Codice pulito e ben documentato
- **Pazienza**: Review process può richiedere tempo

---

*Benvenuto nel team di sviluppo di Hacker Tycoon! 🚀*