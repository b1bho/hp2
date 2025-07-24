// Time-Based Programming Logic System
// File: js/time-programming.js

class TimeProgrammingSystem {
    constructor() {
        this.compilationJobs = [];
        this.activeJobs = [];
        this.completedJobs = [];
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCompilationSettings();
        this.startUpdateLoop();
        this.loadExistingJobs();
    }

    setupEventListeners() {
        document.getElementById('add-compilation-btn')?.addEventListener('click', () => {
            this.showAddCompilationDialog();
        });

        // Settings updates
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('compilation-setting')) {
                this.updateCompilationSettings();
            }
        });
    }

    loadExistingJobs() {
        // Load any existing jobs from state
        const existingJobs = devState.compilationState.queue || [];
        existingJobs.forEach(job => {
            if (job.status === 'active') {
                this.resumeCompilationJob(job);
            } else {
                this.compilationJobs.push(job);
            }
        });
        
        this.renderCompilationQueue();
    }

    showAddCompilationDialog() {
        // Create a simple dialog to add test compilation jobs
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-lg font-semibold mb-4">Aggiungi Job di Compilazione</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Template</label>
                        <select id="template-select" class="w-full bg-gray-700 rounded px-3 py-2">
                            ${Object.entries(editorTemplates).map(([id, template]) => 
                                `<option value="${id}">${template.name} (Complexity: ${template.complexity})</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Tipo di Compilazione</label>
                        <select id="compilation-type" class="w-full bg-gray-700 rounded px-3 py-2">
                            <option value="debug">Debug Build</option>
                            <option value="release">Release Build</option>
                            <option value="obfuscated">Obfuscated Build</option>
                            <option value="encrypted">Encrypted Build</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Opzioni Aggiuntive</label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" id="anti-debug" class="mr-2">
                                Anti-Debug (+30% tempo)
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="vm-detection" class="mr-2">
                                VM Detection (+20% tempo)
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="persistence" class="mr-2">
                                Persistence Module (+40% tempo)
                            </label>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end mt-6 space-x-2">
                    <button id="cancel-compilation" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md">Cancel</button>
                    <button id="start-compilation" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">Start Compilation</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners for modal
        modal.querySelector('#cancel-compilation').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#start-compilation').addEventListener('click', () => {
            this.createCompilationJob(modal);
            modal.remove();
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    createCompilationJob(modal) {
        const templateId = modal.querySelector('#template-select').value;
        const compilationType = modal.querySelector('#compilation-type').value;
        const antiDebug = modal.querySelector('#anti-debug').checked;
        const vmDetection = modal.querySelector('#vm-detection').checked;
        const persistence = modal.querySelector('#persistence').checked;

        const template = editorTemplates[templateId];
        if (!template) return;

        const job = {
            id: Date.now(),
            templateId,
            template,
            compilationType,
            options: {
                antiDebug,
                vmDetection,
                persistence
            },
            startTime: Date.now(),
            estimatedDuration: this.calculateCompilationTime(template, compilationType, { antiDebug, vmDetection, persistence }),
            progress: 0,
            status: 'queued',
            phases: this.generateCompilationPhases(template, compilationType),
            currentPhase: 0,
            logs: []
        };

        this.addCompilationJob(job);
    }

    addCompilationJob(job) {
        this.compilationJobs.push(job);
        devState.compilationState.queue.push(job);
        saveStateDebounced();
        
        this.renderCompilationQueue();
        
        // Start the job if no other job is active
        if (this.activeJobs.length === 0) {
            this.startCompilationJob(job);
        }
    }

    startCompilationJob(job) {
        job.status = 'active';
        job.startTime = Date.now();
        job.progress = 0;
        job.currentPhase = 0;
        job.logs = [];
        
        this.activeJobs.push(job);
        this.removeFromQueue(job);
        
        this.addLog(job, 'Compilation started', 'info');
        this.renderCompilationQueue();
        this.showCompilationProgress(job);
    }

    removeFromQueue(job) {
        const index = this.compilationJobs.findIndex(j => j.id === job.id);
        if (index > -1) {
            this.compilationJobs.splice(index, 1);
        }
        
        const stateIndex = devState.compilationState.queue.findIndex(j => j.id === job.id);
        if (stateIndex > -1) {
            devState.compilationState.queue.splice(stateIndex, 1);
        }
    }

    calculateCompilationTime(template, compilationType, options) {
        let baseTime = devState.compilationState.settings.baseCompilationTime;
        let complexityMultiplier = template.complexity * devState.compilationState.settings.complexityMultiplier;
        
        // Factor in compilation type
        const typeMultipliers = {
            debug: 1.0,
            release: 1.3,
            obfuscated: 1.8,
            encrypted: 2.2
        };
        baseTime *= typeMultipliers[compilationType] || 1.0;
        
        // Factor in options
        if (options.antiDebug) baseTime *= 1.3;
        if (options.vmDetection) baseTime *= 1.2;
        if (options.persistence) baseTime *= 1.4;
        
        // Apply talent reductions
        const talentReduction = this.getTalentTimeReduction();
        const finalTime = (baseTime * complexityMultiplier) * (1 - talentReduction);
        
        return Math.max(10, Math.round(finalTime)); // Minimum 10 seconds
    }

    getTalentTimeReduction() {
        let reduction = 0;
        
        if (window.newTalentSystem) {
            reduction += newTalentSystem.getTalentBonus('Sviluppo', 'compilationTime');
        }
        
        return Math.min(0.7, reduction); // Max 70% reduction
    }

    generateCompilationPhases(template, compilationType) {
        const basePhases = [
            { name: 'Parsing Template', duration: 0.1 },
            { name: 'Generating Code', duration: 0.3 },
            { name: 'Compiling Binary', duration: 0.4 },
            { name: 'Applying Optimizations', duration: 0.2 }
        ];

        if (compilationType === 'obfuscated') {
            basePhases.splice(3, 0, { name: 'Code Obfuscation', duration: 0.15 });
        }

        if (compilationType === 'encrypted') {
            basePhases.splice(3, 0, { name: 'Encryption Setup', duration: 0.1 });
            basePhases.splice(4, 0, { name: 'Runtime Encryption', duration: 0.2 });
        }

        return basePhases;
    }

    updateCompilationProgress() {
        this.activeJobs.forEach(job => {
            const elapsed = Date.now() - job.startTime;
            const totalDuration = job.estimatedDuration * 1000; // Convert to milliseconds
            
            job.progress = Math.min(100, (elapsed / totalDuration) * 100);
            
            // Update current phase
            let phaseProgress = 0;
            let currentPhaseIndex = 0;
            
            for (let i = 0; i < job.phases.length; i++) {
                const phaseDuration = job.phases[i].duration * totalDuration;
                if (elapsed > phaseProgress + phaseDuration) {
                    phaseProgress += phaseDuration;
                    currentPhaseIndex = i + 1;
                } else {
                    break;
                }
            }
            
            if (currentPhaseIndex !== job.currentPhase && currentPhaseIndex < job.phases.length) {
                job.currentPhase = currentPhaseIndex;
                this.addLog(job, `Phase: ${job.phases[currentPhaseIndex].name}`, 'phase');
            }
            
            // Check if compilation is complete
            if (job.progress >= 100) {
                this.completeCompilationJob(job);
            }
        });
        
        this.renderCompilationQueue();
    }

    completeCompilationJob(job) {
        job.status = 'completed';
        job.progress = 100;
        job.completedTime = Date.now();
        
        this.addLog(job, 'Compilation completed successfully', 'success');
        
        // Remove from active jobs
        const index = this.activeJobs.findIndex(j => j.id === job.id);
        if (index > -1) {
            this.activeJobs.splice(index, 1);
        }
        
        // Add to completed jobs
        this.completedJobs.push(job);
        devState.compilationState.completed.push(job);
        
        // Add XP to relevant talent branch
        this.awardCompilationXP(job);
        
        // Start next job in queue if available
        if (this.compilationJobs.length > 0) {
            this.startCompilationJob(this.compilationJobs[0]);
        }
        
        saveStateDebounced();
        this.renderCompilationQueue();
        
        // Show completion notification
        this.showCompilationNotification(job);
    }

    awardCompilationXP(job) {
        const xpAmount = Math.round(job.template.complexity * 15);
        
        // Award XP based on template type
        let branch = 'Sviluppo'; // Default
        
        if (job.template.category === 'malware') {
            branch = 'Sviluppo';
        } else if (job.template.category === 'control') {
            branch = 'Networking';
        } else if (job.template.category === 'surveillance') {
            branch = 'Stealth';
        } else if (job.template.category === 'social') {
            branch = 'Ingegneria Sociale';
        }
        
        if (window.newTalentSystem) {
            newTalentSystem.addXP(branch, xpAmount);
        }
        
        this.addLog(job, `Awarded ${xpAmount} XP to ${branch}`, 'success');
    }

    addLog(job, message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        job.logs.push({
            timestamp,
            message,
            type
        });
        
        // Keep only last 20 logs
        if (job.logs.length > 20) {
            job.logs = job.logs.slice(-20);
        }
    }

    showCompilationProgress(job) {
        const modal = document.getElementById('compilation-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        this.renderCompilationProgress();
    }

    renderCompilationProgress() {
        const container = document.getElementById('compilation-progress');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.activeJobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.className = 'space-y-2';
            
            const currentPhase = job.phases[job.currentPhase] || { name: 'Finalizing' };
            
            jobElement.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="font-medium">${job.template.name}</span>
                    <span class="text-sm text-gray-400">${Math.round(job.progress)}%</span>
                </div>
                <div class="progress-bar-container h-3">
                    <div class="progress-bar" style="width: ${job.progress}%"></div>
                </div>
                <div class="text-sm text-indigo-300">Phase: ${currentPhase.name}</div>
                <div class="text-xs text-gray-400">
                    ETA: ${this.getETAString(job)} | Type: ${job.compilationType}
                </div>
                ${job.logs.length > 0 ? `
                    <div class="max-h-32 overflow-y-auto text-xs space-y-1">
                        ${job.logs.slice(-5).map(log => 
                            `<div class="text-gray-300">
                                <span class="text-gray-500">[${log.timestamp}]</span> 
                                ${log.message}
                            </div>`
                        ).join('')}
                    </div>
                ` : ''}
            `;
            
            container.appendChild(jobElement);
        });
        
        if (this.activeJobs.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400">No active compilations</div>';
        }
    }

    getETAString(job) {
        const elapsed = Date.now() - job.startTime;
        const totalDuration = job.estimatedDuration * 1000;
        const remaining = Math.max(0, totalDuration - elapsed);
        
        const seconds = Math.ceil(remaining / 1000);
        if (seconds < 60) {
            return `${seconds}s`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds}s`;
        }
    }

    renderCompilationQueue() {
        const container = document.getElementById('compilation-queue');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Show active jobs
        this.activeJobs.forEach(job => {
            const element = this.createJobElement(job, 'active');
            container.appendChild(element);
        });
        
        // Show queued jobs
        this.compilationJobs.forEach(job => {
            const element = this.createJobElement(job, 'queued');
            container.appendChild(element);
        });
        
        // Show recent completed jobs (last 5)
        this.completedJobs.slice(-5).forEach(job => {
            const element = this.createJobElement(job, 'completed');
            container.appendChild(element);
        });
        
        if (this.activeJobs.length === 0 && this.compilationJobs.length === 0 && this.completedJobs.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400 py-8">No compilation jobs</div>';
        }
    }

    createJobElement(job, status) {
        const element = document.createElement('div');
        element.className = `compilation-job ${status}`;
        
        const statusColors = {
            active: 'text-yellow-400',
            queued: 'text-blue-400',
            completed: 'text-green-400',
            failed: 'text-red-400'
        };
        
        const statusIcons = {
            active: 'fa-spinner fa-spin',
            queued: 'fa-clock',
            completed: 'fa-check-circle',
            failed: 'fa-times-circle'
        };
        
        element.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h5 class="font-semibold text-white">${job.template.name}</h5>
                    <div class="text-sm text-gray-400">Type: ${job.compilationType}</div>
                    <div class="text-xs text-gray-500 mt-1">
                        Complexity: ${job.template.complexity} | 
                        Duration: ${job.estimatedDuration}s
                    </div>
                    ${status === 'active' ? `
                        <div class="mt-2">
                            <div class="progress-bar-container h-2">
                                <div class="progress-bar" style="width: ${job.progress}%"></div>
                            </div>
                            <div class="text-xs text-indigo-300 mt-1">
                                ${job.phases[job.currentPhase]?.name || 'Finalizing'} (${Math.round(job.progress)}%)
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="ml-4 flex items-center">
                    <span class="status-indicator ${status}">
                        <i class="fas ${statusIcons[status]} mr-1"></i>
                        ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            </div>
        `;
        
        return element;
    }

    renderCompilationSettings() {
        const container = document.getElementById('compilation-settings');
        if (!container) return;
        
        const settings = devState.compilationState.settings;
        
        container.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Base Compilation Time (seconds)</label>
                    <input type="number" 
                           class="compilation-setting w-full bg-gray-700 rounded px-3 py-2" 
                           data-setting="baseCompilationTime"
                           value="${settings.baseCompilationTime}" 
                           min="5" max="300">
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Complexity Multiplier</label>
                    <input type="number" 
                           class="compilation-setting w-full bg-gray-700 rounded px-3 py-2" 
                           data-setting="complexityMultiplier"
                           value="${settings.complexityMultiplier}" 
                           min="1" max="5" step="0.1">
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Talent Reduction per Level</label>
                    <input type="number" 
                           class="compilation-setting w-full bg-gray-700 rounded px-3 py-2" 
                           data-setting="talentReduction"
                           value="${settings.talentReduction}" 
                           min="0" max="0.5" step="0.05">
                </div>
                
                <div class="bg-gray-700 rounded-lg p-4">
                    <h5 class="font-semibold text-indigo-300 mb-2">Talent Bonuses</h5>
                    <div class="space-y-2 text-sm">
                        ${Object.entries(devState.talentState.unlockedTalents).map(([branch, data]) => 
                            `<div class="flex justify-between">
                                <span>${branch} LV${data.level}:</span>
                                <span class="text-green-400">-${Math.round((data.level * 10))}% tempo</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    updateCompilationSettings() {
        const inputs = document.querySelectorAll('.compilation-setting');
        inputs.forEach(input => {
            const setting = input.dataset.setting;
            const value = parseFloat(input.value);
            devState.compilationState.settings[setting] = value;
        });
        
        saveStateDebounced();
    }

    showCompilationNotification(job) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-800 border border-green-600 rounded-lg p-4 z-50 fade-in';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle text-green-400 mr-2"></i>
                <h5 class="font-semibold text-white">Compilation Complete!</h5>
            </div>
            <div class="text-sm text-green-300 mt-1">${job.template.name}</div>
            <div class="text-xs text-gray-300 mt-1">
                Type: ${job.compilationType} | 
                Duration: ${Math.round((job.completedTime - job.startTime) / 1000)}s
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    startUpdateLoop() {
        this.updateInterval = setInterval(() => {
            this.updateCompilationProgress();
            this.renderCompilationProgress();
        }, 1000);
    }

    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    resumeCompilationJob(job) {
        // Resume a job that was interrupted
        job.startTime = Date.now() - (job.progress / 100 * job.estimatedDuration * 1000);
        this.activeJobs.push(job);
    }
}

// Initialize the time programming system
let timeProgramming;
document.addEventListener('DOMContentLoaded', () => {
    timeProgramming = new TimeProgrammingSystem();
    window.timeProgramming = timeProgramming; // Make it globally accessible
    
    // Close modal event listener
    document.getElementById('close-compilation-modal')?.addEventListener('click', () => {
        document.getElementById('compilation-modal')?.classList.add('hidden');
    });
});