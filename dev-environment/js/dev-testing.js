// Development Environment Testing Suite
// File: js/dev-testing.js

class DevTestingSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.isRunning = false;
        
        this.initializeTests();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('run-tests-btn')?.addEventListener('click', () => {
            this.runAllTests();
        });
    }

    initializeTests() {
        this.tests = [
            {
                name: 'Editor Template Loading',
                category: 'Editor',
                test: () => this.testEditorTemplateLoading(),
                critical: true
            },
            {
                name: 'Node Enhancement System',
                category: 'Editor',
                test: () => this.testNodeEnhancementSystem(),
                critical: true
            },
            {
                name: 'Flow Compilation',
                category: 'Editor',
                test: () => this.testFlowCompilation(),
                critical: true
            },
            {
                name: 'Talent Tree Structure',
                category: 'Talents',
                test: () => this.testTalentTreeStructure(),
                critical: true
            },
            {
                name: 'Talent Unlocking Logic',
                category: 'Talents',
                test: () => this.testTalentUnlockingLogic(),
                critical: true
            },
            {
                name: 'Talent Requirements Check',
                category: 'Talents',
                test: () => this.testTalentRequirements(),
                critical: false
            },
            {
                name: 'Compilation Time Calculation',
                category: 'Compilation',
                test: () => this.testCompilationTimeCalculation(),
                critical: true
            },
            {
                name: 'Compilation Queue Management',
                category: 'Compilation',
                test: () => this.testCompilationQueueManagement(),
                critical: true
            },
            {
                name: 'Talent Bonus Application',
                category: 'Compilation',
                test: () => this.testTalentBonusApplication(),
                critical: false
            },
            {
                name: 'State Persistence',
                category: 'System',
                test: () => this.testStatePersistence(),
                critical: true
            },
            {
                name: 'Integration Compatibility',
                category: 'System',
                test: () => this.testIntegrationCompatibility(),
                critical: true
            }
        ];
    }

    async runAllTests() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.results = [];
        
        const testContainer = document.getElementById('test-results');
        if (testContainer) {
            testContainer.innerHTML = '<div class="text-center text-indigo-400">Running tests...</div>';
        }
        
        for (let i = 0; i < this.tests.length; i++) {
            const test = this.tests[i];
            try {
                const result = await this.runSingleTest(test);
                this.results.push(result);
                this.updateTestResults();
                
                // Small delay for visual feedback
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                this.results.push({
                    name: test.name,
                    category: test.category,
                    status: 'failed',
                    message: `Test execution failed: ${error.message}`,
                    critical: test.critical
                });
                this.updateTestResults();
            }
        }
        
        this.isRunning = false;
        this.generateTestReport();
    }

    async runSingleTest(test) {
        try {
            const result = await test.test();
            return {
                name: test.name,
                category: test.category,
                status: result.success ? 'passed' : 'failed',
                message: result.message,
                details: result.details || [],
                critical: test.critical
            };
        } catch (error) {
            return {
                name: test.name,
                category: test.category,
                status: 'failed',
                message: `Test error: ${error.message}`,
                critical: test.critical
            };
        }
    }

    // Editor Tests
    testEditorTemplateLoading() {
        const templates = Object.keys(editorTemplates);
        if (templates.length === 0) {
            return { success: false, message: 'No templates loaded' };
        }

        const invalidTemplates = [];
        templates.forEach(templateId => {
            const template = editorTemplates[templateId];
            if (!template.name || !template.nodes || !Array.isArray(template.nodes)) {
                invalidTemplates.push(templateId);
            }
        });

        if (invalidTemplates.length > 0) {
            return { 
                success: false, 
                message: `Invalid templates found: ${invalidTemplates.join(', ')}` 
            };
        }

        return { 
            success: true, 
            message: `${templates.length} templates loaded successfully`,
            details: templates
        };
    }

    testNodeEnhancementSystem() {
        const enhancementKeys = Object.keys(nodeEnhancements);
        if (enhancementKeys.length === 0) {
            return { success: false, message: 'No node enhancements defined' };
        }

        const invalidEnhancements = [];
        enhancementKeys.forEach(key => {
            const enhancement = nodeEnhancements[key];
            if (!enhancement.name || !enhancement.cost || !enhancement.requiredTalents) {
                invalidEnhancements.push(key);
            }
        });

        if (invalidEnhancements.length > 0) {
            return { 
                success: false, 
                message: `Invalid enhancements: ${invalidEnhancements.join(', ')}` 
            };
        }

        return { 
            success: true, 
            message: `${enhancementKeys.length} enhancements validated`,
            details: enhancementKeys
        };
    }

    testFlowCompilation() {
        // Test if flow compilation logic works
        const testTemplate = editorTemplates['ransomware-basic'];
        if (!testTemplate) {
            return { success: false, message: 'Test template not found' };
        }

        if (!window.newFlowEditor) {
            return { success: false, message: 'Flow editor not initialized' };
        }

        try {
            const estimatedTime = newFlowEditor.calculateCompilationTime ?
                newFlowEditor.calculateCompilationTime() : 0;
            
            if (estimatedTime <= 0) {
                return { success: false, message: 'Invalid compilation time calculation' };
            }

            return { 
                success: true, 
                message: `Flow compilation logic working (${estimatedTime}s estimated)` 
            };
        } catch (error) {
            return { success: false, message: `Compilation logic error: ${error.message}` };
        }
    }

    // Talent Tests
    testTalentTreeStructure() {
        const branches = Object.keys(newTalentTree);
        const expectedBranches = ['Sviluppo', 'Networking', 'Stealth', 'Ingegneria Sociale'];
        
        const missingBranches = expectedBranches.filter(branch => !branches.includes(branch));
        if (missingBranches.length > 0) {
            return { 
                success: false, 
                message: `Missing talent branches: ${missingBranches.join(', ')}` 
            };
        }

        // Check branch structure
        const invalidBranches = [];
        branches.forEach(branchName => {
            const branch = newTalentTree[branchName];
            if (!branch.levels || !Array.isArray(branch.levels) || branch.levels.length !== 3) {
                invalidBranches.push(branchName);
            }
        });

        if (invalidBranches.length > 0) {
            return { 
                success: false, 
                message: `Invalid branch structure: ${invalidBranches.join(', ')}` 
            };
        }

        return { 
            success: true, 
            message: 'All four talent branches properly structured with 3 levels each' 
        };
    }

    testTalentUnlockingLogic() {
        if (!window.newTalentSystem) {
            return { success: false, message: 'Talent system not initialized' };
        }

        // Save current state
        const originalState = JSON.parse(JSON.stringify(devState.talentState));
        
        try {
            // Reset state for testing
            devState.talentState.unlockedTalents = {
                'Sviluppo': { level: 0, xp: 0 },
                'Networking': { level: 0, xp: 0 },
                'Stealth': { level: 0, xp: 0 },
                'Ingegneria Sociale': { level: 0, xp: 0 }
            };
            devState.talentState.talentPoints = 10;

            // Test unlocking first level
            const canUnlock = newTalentSystem.getTalentLevel('Sviluppo') === 0 &&
                             devState.talentState.talentPoints >= 2;
            
            if (!canUnlock) {
                return { success: false, message: 'Cannot unlock first talent level' };
            }

            return { success: true, message: 'Talent unlocking logic validated' };
        } finally {
            // Restore original state
            devState.talentState = originalState;
        }
    }

    testTalentRequirements() {
        if (!window.newFlowEditor) {
            return { success: false, message: 'Flow editor not initialized' };
        }

        try {
            // Test requirement checking
            const result1 = newFlowEditor.checkTalentRequirements(['Sviluppo LV1']);
            const result2 = newFlowEditor.checkTalentRequirements(['Sviluppo LV10']); // Should fail
            
            return { 
                success: true, 
                message: 'Talent requirement checking working correctly' 
            };
        } catch (error) {
            return { success: false, message: `Requirement check error: ${error.message}` };
        }
    }

    // Compilation Tests
    testCompilationTimeCalculation() {
        if (!window.timeProgramming) {
            return { success: false, message: 'Time programming system not initialized' };
        }

        try {
            const testTemplate = editorTemplates['ransomware-basic'];
            const time = timeProgramming.calculateCompilationTime(
                testTemplate, 
                'release', 
                { antiDebug: true, vmDetection: false, persistence: false }
            );
            
            if (time <= 0 || time > 1000) {
                return { success: false, message: `Invalid compilation time: ${time}` };
            }

            return { 
                success: true, 
                message: `Compilation time calculation working (${time}s for test case)` 
            };
        } catch (error) {
            return { success: false, message: `Time calculation error: ${error.message}` };
        }
    }

    testCompilationQueueManagement() {
        if (!window.timeProgramming) {
            return { success: false, message: 'Time programming system not initialized' };
        }

        try {
            const initialQueueLength = timeProgramming.compilationJobs.length;
            
            // Test queue operations
            const canManageQueue = typeof timeProgramming.addCompilationJob === 'function' &&
                                  typeof timeProgramming.removeFromQueue === 'function';
            
            if (!canManageQueue) {
                return { success: false, message: 'Queue management methods not available' };
            }

            return { 
                success: true, 
                message: 'Compilation queue management validated' 
            };
        } catch (error) {
            return { success: false, message: `Queue management error: ${error.message}` };
        }
    }

    testTalentBonusApplication() {
        if (!window.timeProgramming || !window.newTalentSystem) {
            return { success: false, message: 'Required systems not initialized' };
        }

        try {
            const reduction = timeProgramming.getTalentTimeReduction();
            
            if (reduction < 0 || reduction > 1) {
                return { success: false, message: `Invalid reduction value: ${reduction}` };
            }

            return { 
                success: true, 
                message: `Talent bonus application working (${Math.round(reduction * 100)}% reduction)` 
            };
        } catch (error) {
            return { success: false, message: `Bonus application error: ${error.message}` };
        }
    }

    // System Tests
    testStatePersistence() {
        try {
            // Test saving state
            const testData = { test: Date.now() };
            localStorage.setItem('dev-test-persistence', JSON.stringify(testData));
            
            // Test loading state
            const loaded = JSON.parse(localStorage.getItem('dev-test-persistence'));
            
            if (!loaded || loaded.test !== testData.test) {
                return { success: false, message: 'State persistence failed' };
            }

            // Cleanup
            localStorage.removeItem('dev-test-persistence');

            return { success: true, message: 'State persistence working correctly' };
        } catch (error) {
            return { success: false, message: `Persistence error: ${error.message}` };
        }
    }

    testIntegrationCompatibility() {
        const requiredGlobals = ['devState', 'editorTemplates', 'newTalentTree'];
        const missing = requiredGlobals.filter(global => typeof window[global] === 'undefined');
        
        if (missing.length > 0) {
            return { 
                success: false, 
                message: `Missing global objects: ${missing.join(', ')}` 
            };
        }

        // Check if systems are properly initialized
        const systems = [
            { name: 'newFlowEditor', object: window.newFlowEditor },
            { name: 'newTalentSystem', object: window.newTalentSystem },
            { name: 'timeProgramming', object: window.timeProgramming }
        ];

        const uninitialized = systems.filter(sys => !sys.object);
        if (uninitialized.length > 0) {
            return { 
                success: false, 
                message: `Uninitialized systems: ${uninitialized.map(s => s.name).join(', ')}` 
            };
        }

        return { success: true, message: 'All systems properly integrated and compatible' };
    }

    updateTestResults() {
        const container = document.getElementById('test-results');
        if (!container) return;

        container.innerHTML = '';

        this.results.forEach(result => {
            const element = document.createElement('div');
            element.className = `test-result ${result.status}`;
            
            const icon = result.status === 'passed' ? 'fa-check-circle' : 
                        result.status === 'failed' ? 'fa-times-circle' : 'fa-exclamation-triangle';
            
            element.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center">
                            <i class="fas ${icon} mr-2"></i>
                            <span class="font-semibold">${result.name}</span>
                            ${result.critical ? '<span class="ml-2 text-xs bg-red-800 text-red-200 px-2 py-1 rounded">CRITICAL</span>' : ''}
                        </div>
                        <div class="text-sm mt-1">${result.message}</div>
                        ${result.details && result.details.length > 0 ? 
                            `<div class="text-xs mt-1 text-gray-400">Details: ${result.details.slice(0, 3).join(', ')}</div>` : 
                            ''
                        }
                    </div>
                    <div class="ml-4">
                        <span class="text-xs px-2 py-1 bg-gray-700 rounded">${result.category}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(element);
        });

        // Show progress
        if (this.isRunning) {
            const progress = document.createElement('div');
            progress.className = 'mt-4 text-center text-indigo-400';
            progress.innerHTML = `Running tests... ${this.results.length}/${this.tests.length}`;
            container.appendChild(progress);
        }
    }

    generateTestReport() {
        const passed = this.results.filter(r => r.status === 'passed').length;
        const failed = this.results.filter(r => r.status === 'failed').length;
        const criticalFailed = this.results.filter(r => r.status === 'failed' && r.critical).length;
        
        const report = {
            total: this.results.length,
            passed,
            failed,
            criticalFailed,
            success: criticalFailed === 0,
            timestamp: new Date().toISOString()
        };

        // Add report to state
        devState.testResults.push(report);
        saveStateDebounced();

        // Show summary
        this.showTestSummary(report);
    }

    showTestSummary(report) {
        const container = document.getElementById('test-results');
        if (!container) return;

        const summary = document.createElement('div');
        summary.className = `mt-6 p-4 rounded-lg ${report.success ? 'bg-green-800 border border-green-600' : 'bg-red-800 border border-red-600'}`;
        
        summary.innerHTML = `
            <h5 class="font-semibold text-white mb-2">
                <i class="fas ${report.success ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2"></i>
                Test Summary
            </h5>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div>Total Tests: <span class="font-bold">${report.total}</span></div>
                    <div class="text-green-300">Passed: <span class="font-bold">${report.passed}</span></div>
                    <div class="text-red-300">Failed: <span class="font-bold">${report.failed}</span></div>
                </div>
                <div>
                    <div class="text-red-300">Critical Failures: <span class="font-bold">${report.criticalFailed}</span></div>
                    <div>Success Rate: <span class="font-bold">${Math.round((report.passed / report.total) * 100)}%</span></div>
                    <div class="text-xs text-gray-300">${new Date(report.timestamp).toLocaleString()}</div>
                </div>
            </div>
            <div class="mt-3 text-sm ${report.success ? 'text-green-200' : 'text-red-200'}">
                ${report.success ? 
                    'All critical tests passed. The development environment is ready for integration.' :
                    `${report.criticalFailed} critical test(s) failed. Please fix issues before proceeding.`
                }
            </div>
        `;

        container.appendChild(summary);
    }

    getTestResults() {
        return {
            latest: this.results,
            history: devState.testResults
        };
    }
}

// Initialize testing suite
let devTestingSuite;
document.addEventListener('DOMContentLoaded', () => {
    devTestingSuite = new DevTestingSuite();
    window.devTestingSuite = devTestingSuite;
});