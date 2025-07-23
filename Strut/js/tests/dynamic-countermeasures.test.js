/**
 * Tests for Dynamic Target Countermeasures System
 * Validates the implementation of IP rotation, defense hardening, and last node detection
 */

describe('Dynamic Target Countermeasures System', () => {
    
    beforeEach(() => {
        // Reset state and ensure sample data is loaded
        localStorage.clear();
        if (typeof loadState === 'function') {
            loadState();
        }
        // Initialize countermeasures system
        if (typeof initializeDynamicTargetStates === 'function') {
            initializeDynamicTargetStates();
        }
    });

    test('should initialize dynamic target states for all targets', () => {
        expect(state.dynamicTargetStates).toBeDefined();
        expect(typeof state.dynamicTargetStates).toBe('object');
        
        // Check that at least some targets are initialized
        const targetIds = Object.keys(worldTargets);
        expect(targetIds.length).toBeGreaterThan(0);
        
        targetIds.forEach(targetId => {
            const targetState = state.dynamicTargetStates[targetId];
            expect(targetState).toBeDefined();
            expect(targetState.currentIp).toBeDefined();
            expect(targetState.originalIp).toBeDefined();
            expect(Array.isArray(targetState.ipChangeHistory)).toBe(true);
            expect(targetState.defenseHardening).toBeDefined();
            expect(targetState.defenseHardening.active).toBe(false);
        });
    });

    test('should execute IP rotation countermeasure', () => {
        const targetId = 'generic_population';
        const target = worldTargets[targetId];
        const originalIp = target.ipAddress;
        
        // Mock attack object
        const mockAttack = {
            id: 'test-attack-1',
            target: target,
            startTime: Date.now()
        };
        
        // Execute IP rotation
        if (typeof executeIpRotation === 'function') {
            const result = executeIpRotation(targetId, mockAttack);
            expect(result).toBe(true);
            
            // Check that IP changed
            const targetState = state.dynamicTargetStates[targetId];
            expect(targetState.currentIp).not.toBe(originalIp);
            expect(target.ipAddress).not.toBe(originalIp);
            expect(target.ipAddress).toBe(targetState.currentIp);
            
            // Check that history was recorded
            expect(targetState.ipChangeHistory.length).toBe(1);
            expect(targetState.countermeasureHistory.length).toBe(1);
            expect(targetState.countermeasureHistory[0].type).toBe('ip_rotation');
        }
    });
    
    test('should execute defense hardening countermeasure', () => {
        const targetId = 'generic_regional_bank'; // Tier 2 target
        const target = worldTargets[targetId];
        
        // Mock attack object
        const mockAttack = {
            id: 'test-attack-2',
            target: target,
            startTime: Date.now()
        };
        
        // Execute defense hardening
        if (typeof executeDefenseHardening === 'function') {
            const result = executeDefenseHardening(targetId, mockAttack);
            expect(result).toBe(true);
            
            // Check that defense hardening is active
            const targetState = state.dynamicTargetStates[targetId];
            expect(targetState.defenseHardening.active).toBe(true);
            expect(targetState.defenseHardening.multipliers).toBeDefined();
            expect(targetState.defenseHardening.expiresAt).toBeGreaterThan(Date.now());
            
            // Check that countermeasure was recorded
            expect(targetState.countermeasureHistory.length).toBe(1);
            expect(targetState.countermeasureHistory[0].type).toBe('defense_hardening');
        }
    });
    
    test('should modify target requirements when defense hardening is active', () => {
        const targetId = 'generic_isp'; // Tier 2 target
        const target = worldTargets[targetId];
        const originalReq = { ...target.req };
        
        // Execute defense hardening first
        if (typeof executeDefenseHardening === 'function') {
            executeDefenseHardening(targetId, { target: target });
        }
        
        // Get modified requirements
        if (typeof getModifiedTargetRequirements === 'function') {
            const modifiedReq = getModifiedTargetRequirements(targetId);
            
            // Check that requirements are increased
            Object.keys(originalReq).forEach(stat => {
                if (stat !== 'rl') { // rl should be lower is better, but defense increases it
                    expect(modifiedReq[stat]).toBeGreaterThanOrEqual(originalReq[stat]);
                }
            });
        }
    });
    
    test('should execute last node detection countermeasure', () => {
        const targetId = 'usa_wallstreet'; // Tier 3 target
        const target = worldTargets[targetId];
        
        // Mock attack with routing chain
        const mockAttack = {
            id: 'test-attack-3',
            target: target,
            routingChain: ['vpn_tier1', 'proxy_chain_basic'],
            startTime: Date.now()
        };
        
        // Mock getNodeInfo function if it doesn't exist
        if (typeof getNodeInfo !== 'function') {
            window.getNodeInfo = (nodeId) => ({
                id: nodeId,
                name: `Node ${nodeId}`,
                currentIp: '192.168.1.1',
                ipAddress: '192.168.1.1'
            });
        }
        
        // Execute last node detection
        if (typeof executeLastNodeDetection === 'function') {
            const result = executeLastNodeDetection(targetId, mockAttack);
            expect(result).toBe(true);
            
            // Check that node was detected
            const targetState = state.dynamicTargetStates[targetId];
            expect(targetState.detectedNodes.size).toBe(1);
            expect(targetState.detectedNodes.has('192.168.1.1')).toBe(true);
            
            // Check that traceability was increased
            expect(state.ipTraceability['192.168.1.1']).toBeGreaterThanOrEqual(40);
            
            // Check that countermeasure was recorded
            expect(targetState.countermeasureHistory.length).toBe(1);
            expect(targetState.countermeasureHistory[0].type).toBe('last_node_detection');
        }
    });
    
    test('should block attacks from detected last nodes', () => {
        const targetId = 'usa_pentagon'; // Tier 4 target
        
        // First, simulate node detection
        if (typeof executeLastNodeDetection === 'function') {
            const mockAttack = {
                target: worldTargets[targetId],
                routingChain: ['proxy_chain_basic']
            };
            
            // Mock getNodeInfo function
            window.getNodeInfo = (nodeId) => ({
                id: nodeId,
                currentIp: '10.0.0.1',
                ipAddress: '10.0.0.1'
            });
            
            executeLastNodeDetection(targetId, mockAttack);
        }
        
        // Then check if subsequent attack is blocked
        if (typeof checkLastNodeBlocking === 'function') {
            const routingChain = ['proxy_chain_basic']; // Same last node
            const shouldBlock = checkLastNodeBlocking(targetId, routingChain);
            expect(shouldBlock).toBe(true);
            
            // Different routing chain should not be blocked
            const differentChain = ['vpn_tier2'];
            window.getNodeInfo = (nodeId) => ({
                id: nodeId,
                currentIp: '10.0.0.2', // Different IP
                ipAddress: '10.0.0.2'
            });
            const shouldNotBlock = checkLastNodeBlocking(targetId, differentChain);
            expect(shouldNotBlock).toBe(false);
        }
    });
    
    test('should provide target status for UI display', () => {
        const targetId = 'generic_hospital'; // Tier 3 target
        
        // Initially should be normal
        if (typeof getTargetStatus === 'function') {
            let status = getTargetStatus(targetId);
            expect(status.status).toBe('normal');
            expect(status.indicators.length).toBe(0);
            
            // After IP rotation, should show indicator
            if (typeof executeIpRotation === 'function') {
                executeIpRotation(targetId, { target: worldTargets[targetId] });
                status = getTargetStatus(targetId);
                expect(status.status).toBe('countermeasures_active');
                expect(status.indicators.length).toBeGreaterThan(0);
                expect(status.indicators.some(i => i.type === 'ip_changed')).toBe(true);
            }
            
            // After defense hardening, should show additional indicator
            if (typeof executeDefenseHardening === 'function') {
                executeDefenseHardening(targetId, { target: worldTargets[targetId] });
                status = getTargetStatus(targetId);
                expect(status.indicators.length).toBeGreaterThan(1);
                expect(status.indicators.some(i => i.type === 'hardened')).toBe(true);
            }
        }
    });
    
    test('should evaluate countermeasures based on attack performance', () => {
        const targetId = 'it_gov'; // Tier 2 target
        const target = worldTargets[targetId];
        
        // Mock attack with poor success ratio (should trigger countermeasures)
        const mockAttack = {
            id: 'test-attack-4',
            target: { ...target, id: targetId },
            routingChain: ['vpn_tier1'],
            startTime: Date.now()
        };
        
        // Mock getNodeInfo function
        window.getNodeInfo = (nodeId) => ({
            id: nodeId,
            currentIp: '192.168.2.1',
            ipAddress: '192.168.2.1'
        });
        
        const originalIp = target.ipAddress;
        const originalDefenseState = state.dynamicTargetStates[targetId].defenseHardening.active;
        
        // Evaluate with poor success ratio (high chance of countermeasures)
        if (typeof evaluateCountermeasures === 'function') {
            evaluateCountermeasures(mockAttack, 0.3); // 30% success ratio
            
            const targetState = state.dynamicTargetStates[targetId];
            
            // At least one countermeasure should have been triggered
            // (IP rotation, defense hardening, or last node detection)
            const ipChanged = target.ipAddress !== originalIp;
            const defenseHardened = targetState.defenseHardening.active !== originalDefenseState;
            const nodeDetected = targetState.detectedNodes.size > 0;
            
            expect(ipChanged || defenseHardened || nodeDetected).toBe(true);
            expect(targetState.countermeasureHistory.length).toBeGreaterThan(0);
        }
    });
    
    test('should have different countermeasure probabilities by tier', () => {
        // This test verifies the probability constants are properly defined
        expect(COUNTERMEASURE_PROBABILITIES).toBeDefined();
        expect(COUNTERMEASURE_PROBABILITIES[1]).toBeDefined();
        expect(COUNTERMEASURE_PROBABILITIES[4]).toBeDefined();
        
        // Higher tiers should have higher probabilities
        expect(COUNTERMEASURE_PROBABILITIES[4].ip_rotation)
            .toBeGreaterThan(COUNTERMEASURE_PROBABILITIES[1].ip_rotation);
        expect(COUNTERMEASURE_PROBABILITIES[4].defense_hardening)
            .toBeGreaterThan(COUNTERMEASURE_PROBABILITIES[1].defense_hardening);
        expect(COUNTERMEASURE_PROBABILITIES[4].last_node_detection)
            .toBeGreaterThan(COUNTERMEASURE_PROBABILITIES[1].last_node_detection);
    });
});