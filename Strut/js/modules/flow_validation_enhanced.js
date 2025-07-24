/**
 * Enhanced Flow Validation Module
 * Implements improved validation logic with minimum block requirements,
 * logical combination rules, and strategic flow optimization scoring.
 */

// Enhanced validation rules with minimum block requirements
const VALIDATION_RULES = {
    // Minimum blocks required for any flow to be considered valid
    MIN_BLOCKS_REQUIRED: 3,
    
    // Maximum blocks before efficiency penalty starts
    MAX_EFFICIENT_BLOCKS: 15,
    
    // Penalty per redundant connection
    REDUNDANCY_PENALTY: 5,
    
    // Bonus for strategic combinations
    STRATEGIC_BONUS: 10
};

// Strategic block combinations that provide synergy bonuses
const STRATEGIC_COMBINATIONS = {
    'stealth_combo': {
        description: 'Combinazione furtiva ottimale',
        blocks: ['Integra con rete Tor', 'Crittografa payload', 'Cancella log di sistema'],
        bonus: 15,
        hint: 'Eccellente! Hai creato una combinazione stealth con Tor, crittografia e pulizia tracce.'
    },
    'social_engineering_combo': {
        description: 'Attacco di ingegneria sociale completo',
        blocks: ['Genera Testo Persuasivo (AI)', 'Crea fake login page', 'Crea campagna spear phishing'],
        bonus: 12,
        hint: 'Ottima strategia! Hai combinato AI persuasivo, pagina fake e spear phishing.'
    },
    'advanced_recon_combo': {
        description: 'Ricognizione avanzata con AI',
        blocks: ['Analisi Vulnerabilità (AI)', 'Scansione rete locale', 'Mappa topologia di rete'],
        bonus: 10,
        hint: 'Ricognizione eccellente! AI per vulnerabilità + mappatura di rete completa.'
    },
    'data_exfiltration_combo': {
        description: 'Esfiltrazione dati professionale',
        blocks: ['Esegui SQL Injection (base)', 'Esfiltra intero database', 'Crittografa payload'],
        bonus: 12,
        hint: 'Esfiltrazione perfetta! SQL injection, dump completo e crittografia.'
    },
    'ddos_professional_combo': {
        description: 'DDoS coordinato e potente',
        blocks: ['Coordina botnet per DDoS', 'Lancia attacco SYN Flood', 'Genera traffico UDP Flood'],
        bonus: 15,
        hint: 'DDoS devastante! Coordinamento botnet con attacchi multipli.'
    }
};

// Mandatory logical combinations - certain objectives require specific block types
const MANDATORY_COMBINATIONS = {
    'denialOfService': {
        'dos_traffic': {
            required: true,
            hint: 'Un attacco DoS/DDoS DEVE includere almeno un blocco per generare traffico malevolo.'
        },
        'access': {
            required: true,
            hint: 'Devi prima identificare il target prima di attaccarlo.'
        }
    },
    'ransomware': {
        'encryption': {
            required: true,
            hint: 'Il ransomware DEVE includere cifratura dei dati.'
        },
        'deploy': {
            required: true,
            hint: 'Devi distribuire il ransomware sul target.'
        }
    },
    'worm': {
        'replication': {
            required: true,
            hint: 'Un worm DEVE avere capacità di replicazione automatica.'
        },
        'access': {
            required: true,
            hint: 'Il worm ha bisogno di un metodo per accedere a nuovi sistemi.'
        }
    },
    'remoteControl': {
        'c2': {
            required: true,
            hint: 'Il controllo remoto richiede un canale di comando e controllo.'
        },
        'persistence': {
            required: true,
            hint: 'Per mantenere accesso, serve un meccanismo di persistenza.'
        }
    }
};

// Enhanced block redundancy detection
const REDUNDANT_PATTERNS = [
    {
        blocks: ['Genera Testo (AI)', 'Genera Testo Persuasivo (AI)'],
        message: 'Due generatori di testo AI sono ridondanti. Usa quello più specifico per il tuo obiettivo.'
    },
    {
        blocks: ['Esegui SQL Injection (base)', 'Bypassa autenticazione SQL', 'Enumera tabelle database'],
        message: 'Troppi blocchi SQL. Scegli quelli necessari per il tuo obiettivo specifico.'
    },
    {
        blocks: ['Usa proxy singolo', 'Configura catena di proxy', 'Integra con rete Tor'],
        message: 'Multipli sistemi di anonimato possono essere controproducenti. Scegli uno principale.'
    },
    {
        blocks: ['Crea keylogger base', 'Cattura Screenshot', 'Intercetta traffico di rete'],
        message: 'Troppi strumenti di sorveglianza possono aumentare la visibilità. Focalizzati su 1-2.'
    }
];

/**
 * Enhanced validation function with improved logic
 */
function validateFlowEnhanced() {
    const objective = flowObjectives[currentObjective];
    const canvas = document.getElementById('canvas');
    const nodes = Array.from(canvas.querySelectorAll('.canvas-node'));
    const nodeNames = nodes.map(node => node.dataset.blockName);
    
    let hints = [];
    let score = 0;
    let totalWeight = 0;
    let penalties = 0;
    let bonuses = 0;

    // 1. Check minimum block requirement
    if (nodes.length < VALIDATION_RULES.MIN_BLOCKS_REQUIRED) {
        currentFc = { 
            score: 0, 
            hints: [{ 
                text: `Flusso troppo semplice! Servono almeno ${VALIDATION_RULES.MIN_BLOCKS_REQUIRED} blocchi per un flusso valido.`, 
                type: 'error' 
            }] 
        };
        updateFcUI();
        return;
    }

    // 2. Check required input connections
    let allRequiredInputsMet = true;
    nodes.forEach(nodeEl => {
        const blockName = nodeEl.dataset.blockName;
        const blockInterface = blockInterfaces[blockName];
        if (!blockInterface) return;
        
        let hasError = false;
        blockInterface.inputs.forEach(inputDef => {
            if (inputDef.optional) return;
            const inputId = `${nodeEl.id}-input-${inputDef.name.replace(/\s/g, '')}`;
            const isConnected = lines.some(line => line.end.id === inputId);
            if (!isConnected) {
                allRequiredInputsMet = false;
                hasError = true;
                hints.push({ 
                    text: `Input '${inputDef.name}' richiesto per '${blockName}' non collegato.`, 
                    type: 'error' 
                });
            }
        });
        
        if(hasError) {
            nodeEl.classList.add('invalid');
        } else {
            nodeEl.classList.remove('invalid');
        }
    });

    if (!allRequiredInputsMet) {
        currentFc = { score: 0, hints: hints };
        updateFcUI();
        return;
    }

    // 3. Check objective-specific requirements
    if (objective && currentObjective !== 'none') {
        // Original PFE validation
        for (const pfeKey in objective.pfe) {
            const rule = objective.pfe[pfeKey];
            if (rule.required) totalWeight += rule.weight;
            
            let requirementMet = false;
            if (rule.paths) {
                for (const path of rule.paths) {
                    const allCategoriesInPathFound = path.every(category =>
                        nodeNames.some(name => blockCategories[name] === category)
                    );
                    if (allCategoriesInPathFound) {
                        requirementMet = true;
                        break;
                    }
                }
            } else {
                requirementMet = nodeNames.some(name => blockCategories[name] === pfeKey);
            }
            
            if (requirementMet) {
                score += rule.weight;
            } else if (rule.required) {
                hints.push({ text: rule.hint, type: 'error' });
            } else {
                hints.push({ text: rule.hint, type: 'warning' });
            }
        }

        // 4. Check mandatory combinations for this objective
        const mandatoryRules = MANDATORY_COMBINATIONS[currentObjective];
        if (mandatoryRules) {
            for (const [category, rule] of Object.entries(mandatoryRules)) {
                const hasRequiredCategory = nodeNames.some(name => blockCategories[name] === category);
                if (rule.required && !hasRequiredCategory) {
                    hints.push({ text: rule.hint, type: 'error' });
                    penalties += 20; // Heavy penalty for missing mandatory combinations
                }
            }
        }
    }

    // 5. Check for strategic combinations
    for (const [comboId, combo] of Object.entries(STRATEGIC_COMBINATIONS)) {
        const hasAllBlocks = combo.blocks.every(block => nodeNames.includes(block));
        if (hasAllBlocks) {
            bonuses += combo.bonus;
            hints.push({ text: combo.hint, type: 'success' });
        }
    }

    // 6. Check for redundancies
    for (const pattern of REDUNDANT_PATTERNS) {
        const redundantCount = pattern.blocks.filter(block => nodeNames.includes(block)).length;
        if (redundantCount > 1) {
            penalties += (redundantCount - 1) * VALIDATION_RULES.REDUNDANCY_PENALTY;
            hints.push({ text: pattern.message, type: 'warning' });
        }
    }

    // 7. Efficiency penalty for overly complex flows
    if (nodes.length > VALIDATION_RULES.MAX_EFFICIENT_BLOCKS) {
        const excessBlocks = nodes.length - VALIDATION_RULES.MAX_EFFICIENT_BLOCKS;
        penalties += excessBlocks * 2;
        hints.push({ 
            text: `Flusso troppo complesso! Oltre ${VALIDATION_RULES.MAX_EFFICIENT_BLOCKS} blocchi riducono l'efficienza.`, 
            type: 'warning' 
        });
    }

    // 8. Calculate final score
    let finalScore = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 100;
    finalScore = Math.max(0, Math.min(100, finalScore + bonuses - penalties));

    // 9. Add success message if no errors
    if (hints.filter(h => h.type === 'error').length === 0 && finalScore > 0) {
        if (finalScore >= 90) {
            hints.push({ text: "🏆 Flusso eccellente! Design strategico ottimale.", type: "success" });
        } else if (finalScore >= 70) {
            hints.push({ text: "✅ Flusso funzionalmente completo e ben progettato.", type: "success" });
        } else {
            hints.push({ text: "⚠️ Flusso funzionale ma migliorabile.", type: "info" });
        }
    }

    currentFc = { score: finalScore, hints: hints };
    updateFcUI();
}

/**
 * Get interactive suggestions for improving the current flow
 */
function getFlowSuggestions() {
    const objective = flowObjectives[currentObjective];
    const canvas = document.getElementById('canvas');
    const nodes = Array.from(canvas.querySelectorAll('.canvas-node'));
    const nodeNames = nodes.map(node => node.dataset.blockName);
    
    const suggestions = [];

    if (currentObjective === 'none') {
        suggestions.push({
            text: "💡 Seleziona un obiettivo specifico per ricevere suggerimenti mirati!",
            type: "info",
            action: "selectObjective"
        });
        return suggestions;
    }

    // Suggest strategic combinations
    for (const [comboId, combo] of Object.entries(STRATEGIC_COMBINATIONS)) {
        const hasBlocks = combo.blocks.filter(block => nodeNames.includes(block));
        const missingBlocks = combo.blocks.filter(block => !nodeNames.includes(block));
        
        if (hasBlocks.length > 0 && missingBlocks.length > 0) {
            suggestions.push({
                text: `💡 Aggiungi ${missingBlocks.join(', ')} per completare "${combo.description}"`,
                type: "suggestion",
                action: "addBlocks",
                blocks: missingBlocks
            });
        }
    }

    // Suggest removing redundancies
    for (const pattern of REDUNDANT_PATTERNS) {
        const redundantBlocks = pattern.blocks.filter(block => nodeNames.includes(block));
        if (redundantBlocks.length > 1) {
            suggestions.push({
                text: `🔧 ${pattern.message}`,
                type: "optimization",
                action: "removeRedundancy",
                blocks: redundantBlocks
            });
        }
    }

    return suggestions.slice(0, 3); // Limit to top 3 suggestions
}

// Export functions for use in main editor
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateFlowEnhanced,
        getFlowSuggestions,
        STRATEGIC_COMBINATIONS,
        MANDATORY_COMBINATIONS,
        VALIDATION_RULES
    };
}