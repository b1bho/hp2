/**
 * js/tests/ip-traceability-system.test.js
 * Tests for the IP Traceability System
 */

// Test IP traceability system functionality
function testIpTraceabilitySystem() {
    console.log('🧪 Testing IP Traceability System...');
    
    // Mock state for testing
    const originalState = window.state;
    window.state = {
        ipTraceability: {},
        playerTraces: {
            totalTraces: 0,
            investigationLevel: 0,
            traceHistory: [],
            investigatedBy: 'Nessuna'
        },
        identity: { realIp: '192.168.1.100' },
        infectedHostPool: [
            {
                id: 'test_host_1',
                ipAddress: '10.0.0.1',
                status: 'Active'
            }
        ],
        xmr: 1000
    };
    
    let testsPassed = 0;
    let testsTotal = 0;
    
    // Test 1: Initialize IP traceability system
    testsTotal++;
    try {
        if (typeof initializeIpTraceability === 'function') {
            initializeIpTraceability();
            
            if (state.ipTraceability['192.168.1.100'] && 
                state.ipTraceability['192.168.1.100'].type === 'personal') {
                console.log('✅ Test 1 PASSED: IP traceability initialization');
                testsPassed++;
            } else {
                console.log('❌ Test 1 FAILED: Personal IP not initialized properly');
            }
        } else {
            console.log('❌ Test 1 FAILED: initializeIpTraceability function not available');
        }
    } catch (error) {
        console.log('❌ Test 1 FAILED:', error.message);
    }
    
    // Test 2: Calculate traceability increase
    testsTotal++;
    try {
        if (typeof calculateTraceabilityIncrease === 'function') {
            const attackResult = { status: 'failure' };
            const flow = { stats: { rl: 80, an: 20, fc: 50 } };
            const target = { difficulty: 2 };
            
            const increase = calculateTraceabilityIncrease('192.168.1.100', attackResult, flow, target);
            
            if (increase > 0) {
                console.log('✅ Test 2 PASSED: Traceability increase calculation');
                testsPassed++;
            } else {
                console.log('❌ Test 2 FAILED: Traceability increase should be > 0');
            }
        } else {
            console.log('❌ Test 2 FAILED: calculateTraceabilityIncrease function not available');
        }
    } catch (error) {
        console.log('❌ Test 2 FAILED:', error.message);
    }
    
    // Test 3: Apply traceability increase
    testsTotal++;
    try {
        if (typeof applyTraceabilityIncrease === 'function') {
            const initialScore = state.ipTraceability['192.168.1.100']?.score || 0;
            
            applyTraceabilityIncrease('192.168.1.100', 50, {
                event: 'test_attack',
                target: 'test_target',
                flow: 'test_flow'
            });
            
            const newScore = state.ipTraceability['192.168.1.100']?.score || 0;
            
            if (newScore > initialScore) {
                console.log('✅ Test 3 PASSED: Traceability increase application');
                testsPassed++;
            } else {
                console.log('❌ Test 3 FAILED: Score not increased properly');
            }
        } else {
            console.log('❌ Test 3 FAILED: applyTraceabilityIncrease function not available');
        }
    } catch (error) {
        console.log('❌ Test 3 FAILED:', error.message);
    }
    
    // Test 4: Get IP traceability status
    testsTotal++;
    try {
        if (typeof getIpTraceabilityStatus === 'function') {
            const status = getIpTraceabilityStatus('192.168.1.100');
            
            if (status && typeof status.level === 'string' && typeof status.canUse === 'boolean') {
                console.log('✅ Test 4 PASSED: IP status retrieval');
                testsPassed++;
            } else {
                console.log('❌ Test 4 FAILED: Invalid status object returned');
            }
        } else {
            console.log('❌ Test 4 FAILED: getIpTraceabilityStatus function not available');
        }
    } catch (error) {
        console.log('❌ Test 4 FAILED:', error.message);
    }
    
    // Test 5: DDoS traceability handling
    testsTotal++;
    try {
        if (typeof handleDDoSTraceability === 'function') {
            const hostIds = ['test_host_1'];
            const attackResult = { status: 'failure', impact: 5, duration: 60 };
            
            handleDDoSTraceability(hostIds, '192.168.1.200', attackResult);
            
            const hostIpData = state.ipTraceability['10.0.0.1'];
            if (hostIpData && hostIpData.score > 0) {
                console.log('✅ Test 5 PASSED: DDoS traceability handling');
                testsPassed++;
            } else {
                console.log('❌ Test 5 FAILED: Host IP traceability not updated');
            }
        } else {
            console.log('❌ Test 5 FAILED: handleDDoSTraceability function not available');
        }
    } catch (error) {
        console.log('❌ Test 5 FAILED:', error.message);
    }
    
    // Test 6: Mining traceability handling
    testsTotal++;
    try {
        if (typeof handleMiningTraceability === 'function') {
            const hostIds = ['test_host_1'];
            const duration = 3600; // 1 hour
            
            const initialScore = state.ipTraceability['10.0.0.1']?.score || 0;
            handleMiningTraceability(hostIds, duration);
            const newScore = state.ipTraceability['10.0.0.1']?.score || 0;
            
            if (newScore >= initialScore) {
                console.log('✅ Test 6 PASSED: Mining traceability handling');
                testsPassed++;
            } else {
                console.log('❌ Test 6 FAILED: Mining traceability not applied');
            }
        } else {
            console.log('❌ Test 6 FAILED: handleMiningTraceability function not available');
        }
    } catch (error) {
        console.log('❌ Test 6 FAILED:', error.message);
    }
    
    // Test 7: Get all IP traceability data
    testsTotal++;
    try {
        if (typeof getAllIpTraceabilityData === 'function') {
            const allData = getAllIpTraceabilityData();
            
            if (Array.isArray(allData) && allData.length > 0) {
                console.log('✅ Test 7 PASSED: Get all IP traceability data');
                testsPassed++;
            } else {
                console.log('❌ Test 7 FAILED: Invalid or empty IP data array');
            }
        } else {
            console.log('❌ Test 7 FAILED: getAllIpTraceabilityData function not available');
        }
    } catch (error) {
        console.log('❌ Test 7 FAILED:', error.message);
    }
    
    // Restore original state
    window.state = originalState;
    
    console.log(`\n📊 IP Traceability System Test Results: ${testsPassed}/${testsTotal} tests passed`);
    
    if (testsPassed === testsTotal) {
        console.log('🎉 All tests passed! IP Traceability System is working correctly.');
        return true;
    } else {
        console.log('⚠️  Some tests failed. Check the implementation.');
        return false;
    }
}

// Test integration with existing systems
function testIpTraceabilityIntegration() {
    console.log('\n🔗 Testing IP Traceability Integration...');
    
    let integrationTests = 0;
    let integrationPassed = 0;
    
    // Test 1: Check if IP traceability is initialized in main.js
    integrationTests++;
    if (typeof initializeIpTraceability === 'function') {
        console.log('✅ Integration Test 1 PASSED: Function exported globally');
        integrationPassed++;
    } else {
        console.log('❌ Integration Test 1 FAILED: Function not available globally');
    }
    
    // Test 2: Check if constants are available
    integrationTests++;
    if (typeof IP_TYPES !== 'undefined' && typeof TRACEABILITY_THRESHOLDS !== 'undefined') {
        console.log('✅ Integration Test 2 PASSED: Constants exported');
        integrationPassed++;
    } else {
        console.log('❌ Integration Test 2 FAILED: Constants not available');
    }
    
    // Test 3: Check if countermeasures integration exists
    integrationTests++;
    if (typeof triggerCountermeasuresFromTraceability === 'function') {
        console.log('✅ Integration Test 3 PASSED: Countermeasures integration available');
        integrationPassed++;
    } else {
        console.log('❌ Integration Test 3 FAILED: Countermeasures integration missing');
    }
    
    console.log(`\n📊 Integration Test Results: ${integrationPassed}/${integrationTests} tests passed`);
    return integrationPassed === integrationTests;
}

// Run all tests
function runAllIpTraceabilityTests() {
    console.log('🚀 Starting IP Traceability System Tests\n');
    
    const systemTestsPass = testIpTraceabilitySystem();
    const integrationTestsPass = testIpTraceabilityIntegration();
    
    console.log('\n🏁 Final Results:');
    console.log(`System Tests: ${systemTestsPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Integration Tests: ${integrationTestsPass ? '✅ PASS' : '❌ FAIL'}`);
    
    if (systemTestsPass && integrationTestsPass) {
        console.log('\n🎊 All IP Traceability tests passed! System is ready for use.');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the implementation.');
    }
    
    return systemTestsPass && integrationTestsPass;
}

// Export for HTML test runner
if (typeof window !== 'undefined') {
    window.runAllIpTraceabilityTests = runAllIpTraceabilityTests;
    window.testIpTraceabilitySystem = testIpTraceabilitySystem;
    window.testIpTraceabilityIntegration = testIpTraceabilityIntegration;
}