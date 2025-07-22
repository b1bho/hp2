/**
 * Tests for DDoS Attack Flow Integration
 * Validates that the DDoS Attack panel properly integrates with the flow editor
 */

describe('DDoS Attack Flow Integration', () => {
    
    beforeEach(() => {
        // Reset state and ensure sample data is loaded
        localStorage.clear();
        // Force reload of initial state with sample data
        if (typeof loadState === 'function') {
            loadState();
        }
    });

    test('should read saved flows from flow editor', () => {
        const flows = getSavedFlowsAsArray();
        expect(flows).toBeDefined();
        expect(Array.isArray(flows)).toBe(true);
        expect(flows.length).toBeGreaterThan(0);
        
        // Should include sample DDoS flows
        const ddosFlows = flows.filter(flow => flow.objective === 'denialOfService');
        expect(ddosFlows.length).toBeGreaterThan(0);
    });

    test('should validate DDoS flows correctly', () => {
        const basicDDoSFlow = {
            name: 'Test DDoS Flow',
            objective: 'denialOfService',
            blocks: [
                { type: 'Scansione rete locale' },
                { type: 'Lancia attacco SYN Flood' }
            ],
            fc: 85
        };

        expect(isDDoSFlow(basicDDoSFlow)).toBe(true);
        
        const validation = validateDDoSFlow(basicDDoSFlow);
        expect(validation.isValid).toBe(true);
        expect(validation.issues).toHaveLength(0);
    });

    test('should reject non-DDoS flows', () => {
        const nonDDoSFlow = {
            name: 'Data Theft Flow',
            objective: 'dataExfiltration',
            blocks: [
                { type: 'Scansione rete locale' },
                { type: 'Esegui SQL Injection (base)' }
            ]
        };

        expect(isDDoSFlow(nonDDoSFlow)).toBe(false);
        
        const validation = validateDDoSFlow(nonDDoSFlow);
        expect(validation.isValid).toBe(false);
        expect(validation.issues.length).toBeGreaterThan(0);
        expect(validation.suggestions.length).toBeGreaterThan(0);
    });

    test('should validate flows with DDoS blocks but wrong objective', () => {
        const mixedFlow = {
            name: 'Mixed Flow',
            objective: 'financial',
            blocks: [
                { type: 'Lancia attacco SYN Flood' }
            ]
        };

        // Should be considered DDoS due to DDoS blocks
        expect(isDDoSFlow(mixedFlow)).toBe(true);
    });

    test('should handle bot group selection', () => {
        // Ensure sample bot groups exist
        expect(state.botnetGroups).toBeDefined();
        expect(Object.keys(state.botnetGroups)).toContain('Test Group');
        
        const testGroup = state.botnetGroups['Test Group'];
        expect(testGroup.hostIds.length).toBeGreaterThan(0);
    });

    test('should calculate attack metrics correctly', () => {
        const impact = calculateAttackImpact(5.6, 60); // 5.6 GFLOPS for 1 minute
        expect(['Low', 'Medium', 'High', 'Critical']).toContain(impact);
        
        const traceRisk = calculateTraceabilityRisk(2, 60); // 2 hosts for 1 minute
        expect(['Low', 'Medium', 'High', 'Critical']).toContain(traceRisk);
        
        const lossRisk = calculateBotLossRisk(2, 60);
        expect(['Low', 'Medium', 'High', 'Critical']).toContain(lossRisk);
    });

    test('should validate IP addresses correctly', () => {
        expect(isValidIP('192.168.1.1')).toBe(true);
        expect(isValidIP('10.0.0.1')).toBe(true);
        expect(isValidIP('256.1.1.1')).toBe(false);
        expect(isValidIP('not.an.ip')).toBe(false);
        expect(isValidIP('')).toBe(false);
    });

    test('should provide helpful error messages', () => {
        // Test flow without objective
        const incompleteFlow = {
            name: 'Incomplete Flow',
            blocks: [{ type: 'Scansione rete locale' }]
        };
        
        const validation = validateDDoSFlow(incompleteFlow);
        expect(validation.isValid).toBe(false);
        expect(validation.suggestions).toContain('Set the flow objective to "Denial of Service (DoS/DDoS)" in the Editor');
    });

    test('should handle empty or missing flows gracefully', () => {
        // Temporarily clear flows to test error handling
        const originalFlows = state.savedFlows;
        state.savedFlows = {};
        
        const flows = getSavedFlowsAsArray();
        expect(flows).toEqual([]);
        
        // Restore original flows
        state.savedFlows = originalFlows;
    });
});

// Test helper functions
function runDDoSIntegrationTests() {
    console.log('Running DDoS Attack Flow Integration Tests...');
    
    // Simple test runner for browser environment
    const tests = [
        {
            name: 'Flow Reading Test',
            test: () => {
                const flows = getSavedFlowsAsArray();
                if (!Array.isArray(flows) || flows.length === 0) {
                    throw new Error('No flows found or not an array');
                }
                return true;
            }
        },
        {
            name: 'DDoS Validation Test',
            test: () => {
                const testFlow = {
                    objective: 'denialOfService',
                    blocks: [{ type: 'Lancia attacco SYN Flood' }]
                };
                if (!isDDoSFlow(testFlow)) {
                    throw new Error('DDoS flow validation failed');
                }
                return true;
            }
        },
        {
            name: 'Bot Groups Test', 
            test: () => {
                if (!state.botnetGroups || Object.keys(state.botnetGroups).length === 0) {
                    throw new Error('No bot groups found');
                }
                return true;
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(({ name, test }) => {
        try {
            if (test()) {
                console.log(`✓ ${name} - PASSED`);
                passed++;
            }
        } catch (error) {
            console.log(`✗ ${name} - FAILED: ${error.message}`);
            failed++;
        }
    });

    console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
    return { passed, failed };
}

// Make test runner available globally
if (typeof window !== 'undefined') {
    window.runDDoSIntegrationTests = runDDoSIntegrationTests;
}