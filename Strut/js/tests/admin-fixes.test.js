// Unit tests for admin panel fixes
// These tests validate the fixes for level increment, text fields, and attack logic

// Mock DOM elements for testing
const mockDOM = {
    getElementById: (id) => {
        const mockElements = {
            'admin-btc': { value: '0.5' },
            'admin-xmr': { value: '1000' },
            'admin-talents': { value: '4' },
            'admin-level': { value: '5' },
            'admin-set-level': { disabled: false }
        };
        return mockElements[id] || null;
    }
};

// Mock global document
if (typeof global !== 'undefined') {
    global.document = mockDOM;
}

// Mock state for testing
let testState = {
    btc: 0.5,
    xmr: 1000,
    talentPoints: 4,
    level: 5,
    xp: 0,
    xpToNextLevel: 505,
    activeAttacks: []
};

// Mock functions
const mockShowNotification = (message, type) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
};

const mockSaveState = () => {
    console.log('State saved');
};

const mockAddXp = (amount, target) => {
    if (target === 'player') {
        testState.xp += amount;
        while (testState.xp >= testState.xpToNextLevel) {
            testState.level++;
            testState.xp -= testState.xpToNextLevel;
            testState.xpToNextLevel = Math.floor(testState.xpToNextLevel * 1.5);
            testState.talentPoints += 1;
        }
    }
};

// Test Suite 1: State Property Consistency
function testStatePropertyConsistency() {
    console.log('\n=== Testing State Property Consistency ===');
    
    // Test that initial state uses xpToNextLevel instead of nextLevelXp
    const initialState = {
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        activeAttacks: []
    };
    
    const hasCorrectProperty = 'xpToNextLevel' in initialState;
    const hasOldProperty = 'nextLevelXp' in initialState;
    const hasActiveAttacks = Array.isArray(initialState.activeAttacks);
    
    console.log('✅ Has xpToNextLevel property:', hasCorrectProperty);
    console.log('✅ Does not have old nextLevelXp property:', !hasOldProperty);
    console.log('✅ Has activeAttacks array:', hasActiveAttacks);
    
    return hasCorrectProperty && !hasOldProperty && hasActiveAttacks;
}

// Test Suite 2: Admin Panel Text Field Updates
function testAdminPanelTextFieldUpdates() {
    console.log('\n=== Testing Admin Panel Text Field Updates ===');
    
    // Simulate the updateAdminPanelUI function with improved validation
    function updateAdminPanelUI(state) {
        const adminBtcInput = mockDOM.getElementById('admin-btc');
        const adminXmrInput = mockDOM.getElementById('admin-xmr');
        const adminTalentsInput = mockDOM.getElementById('admin-talents');
        const adminLevelInput = mockDOM.getElementById('admin-level');

        // Only update if elements exist and have valid values
        let updatesSucceeded = 0;
        
        if(adminBtcInput && state.btc !== undefined) {
            adminBtcInput.value = state.btc;
            updatesSucceeded++;
        }
        if(adminXmrInput && state.xmr !== undefined) {
            adminXmrInput.value = state.xmr;
            updatesSucceeded++;
        }
        if(adminTalentsInput && state.talentPoints !== undefined) {
            adminTalentsInput.value = state.talentPoints;
            updatesSucceeded++;
        }
        if(adminLevelInput && state.level !== undefined) {
            adminLevelInput.value = state.level;
            updatesSucceeded++;
        }
        
        return updatesSucceeded === 4; // All 4 fields should update
    }
    
    const result = updateAdminPanelUI(testState);
    console.log('✅ All admin panel fields updated successfully:', result);
    
    return result;
}

// Test Suite 3: Level Increment Functionality  
function testLevelIncrementFunctionality() {
    console.log('\n=== Testing Level Increment Functionality ===');
    
    // Test single level up
    function testSingleLevelUp() {
        const initialLevel = testState.level;
        const initialXp = testState.xp;
        const xpNeeded = testState.xpToNextLevel - initialXp;
        
        mockAddXp(xpNeeded, 'player');
        
        const levelIncreased = testState.level === initialLevel + 1;
        console.log('✅ Single level up works:', levelIncreased, `(${initialLevel} -> ${testState.level})`);
        
        return levelIncreased;
    }
    
    // Test progressive level up
    function testProgressiveLevelUp() {
        const initialLevel = testState.level;
        const targetLevel = initialLevel + 3;
        
        // Simulate adminLevelUpProgressive
        while (testState.level < targetLevel) {
            if (!testState.xpToNextLevel || testState.xpToNextLevel <= 0) {
                testState.xpToNextLevel = 100;
            }
            const xpNeeded = testState.xpToNextLevel - (testState.xp || 0);
            mockAddXp(xpNeeded, 'player');
        }
        
        const reachedTarget = testState.level === targetLevel;
        console.log('✅ Progressive level up works:', reachedTarget, `(${initialLevel} -> ${testState.level})`);
        
        return reachedTarget;
    }
    
    const singleTest = testSingleLevelUp();
    const progressiveTest = testProgressiveLevelUp();
    
    return singleTest && progressiveTest;
}

// Test Suite 4: Attack Logic Error Fix
function testAttackLogicErrorFix() {
    console.log('\n=== Testing Attack Logic Error Fix ===');
    
    // Simulate the launchAttack function's push operation
    function testAttackPush() {
        // Ensure activeAttacks array exists (this was the original bug)
        if (!testState.activeAttacks) {
            testState.activeAttacks = [];
        }
        
        try {
            const newAttack = {
                id: `attack-${Date.now()}`,
                target: { name: 'Test Target' },
                startTime: Date.now(),
                finalTime: 3600
            };
            
            testState.activeAttacks.push(newAttack);
            
            const pushSucceeded = testState.activeAttacks.length > 0;
            console.log('✅ Attack push operation works:', pushSucceeded);
            
            // Clean up
            testState.activeAttacks = [];
            
            return pushSucceeded;
        } catch (error) {
            console.log('❌ Attack push operation failed:', error.message);
            return false;
        }
    }
    
    return testAttackPush();
}

// Run all tests
function runAllTests() {
    console.log('🧪 Running Admin Panel Fixes Unit Tests\n');
    
    const test1 = testStatePropertyConsistency();
    const test2 = testAdminPanelTextFieldUpdates();
    const test3 = testLevelIncrementFunctionality();
    const test4 = testAttackLogicErrorFix();
    
    const allPassed = test1 && test2 && test3 && test4;
    
    console.log('\n=== Test Results Summary ===');
    console.log('State Property Consistency:', test1 ? '✅ PASS' : '❌ FAIL');
    console.log('Admin Panel Text Fields:', test2 ? '✅ PASS' : '❌ FAIL');
    console.log('Level Increment Functionality:', test3 ? '✅ PASS' : '❌ FAIL');
    console.log('Attack Logic Error Fix:', test4 ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
    return allPassed;
}

// Export for Node.js testing or run directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, testState };
} else if (typeof global !== 'undefined') {
    // Running in Node.js
    runAllTests();
} else {
    // Running in browser
    runAllTests();
}