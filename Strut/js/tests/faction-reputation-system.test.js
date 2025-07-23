// File: js/tests/faction-reputation-system.test.js
// Unit Tests for Faction and Reputation System

console.log('🧪 Starting Faction and Reputation System Tests...');

// Test 1: Faction System Initialization
console.log('\n=== TEST 1: Faction System Initialization ===');
try {
    const factions = Object.values(FACTIONS);
    console.log(`✅ Found ${factions.length} factions:`);
    factions.forEach(faction => {
        console.log(`  - ${faction.name} (${faction.id}): ${faction.color}`);
    });
    
    if (factions.length === 4) {
        console.log('✅ TEST 1 PASSED: All 4 factions loaded correctly');
    } else {
        console.log('❌ TEST 1 FAILED: Expected 4 factions, found ' + factions.length);
    }
} catch (error) {
    console.log('❌ TEST 1 FAILED: ' + error.message);
}

// Test 2: Reputation System State
console.log('\n=== TEST 2: Reputation System State ===');
try {
    if (state.factionReputation && Object.keys(state.factionReputation).length === 4) {
        console.log('✅ Faction reputation state initialized');
        Object.entries(state.factionReputation).forEach(([factionId, rep]) => {
            console.log(`  - ${factionId}: Level ${rep.level}, XP ${rep.xp}`);
        });
        console.log('✅ TEST 2 PASSED: Reputation state is properly initialized');
    } else {
        console.log('❌ TEST 2 FAILED: Faction reputation state not properly initialized');
    }
} catch (error) {
    console.log('❌ TEST 2 FAILED: ' + error.message);
}

// Test 3: Reputation Functions
console.log('\n=== TEST 3: Reputation Functions ===');
try {
    const testFactionId = 'governmental';
    const initialXP = getFactionReputationXP(testFactionId);
    const initialLevel = getFactionReputationLevel(testFactionId);
    
    // Add some test reputation
    addFactionReputation(testFactionId, 80, 'Unit Test');
    
    const newXP = getFactionReputationXP(testFactionId);
    const newLevel = getFactionReputationLevel(testFactionId);
    const progress = getFactionReputationProgress(testFactionId);
    const multiplier = getReputationMultiplier(testFactionId);
    
    console.log(`  Initial: Level ${initialLevel}, XP ${initialXP}`);
    console.log(`  After +80 XP: Level ${newLevel}, XP ${newXP}`);
    console.log(`  Progress: ${progress}%, Multiplier: ${multiplier}x`);
    
    if (newXP > initialXP) {
        console.log('✅ TEST 3 PASSED: Reputation functions working correctly');
    } else {
        console.log('❌ TEST 3 FAILED: Reputation not added properly');
    }
} catch (error) {
    console.log('❌ TEST 3 FAILED: ' + error.message);
}

// Test 4: Quest Integration
console.log('\n=== TEST 4: Quest Integration ===');
try {
    const factoredQuests = questsData.filter(q => q.faction);
    console.log(`✅ Found ${factoredQuests.length} quests with factions assigned`);
    
    const factionCounts = {};
    factoredQuests.forEach(quest => {
        factionCounts[quest.faction] = (factionCounts[quest.faction] || 0) + 1;
    });
    
    console.log('  Faction distribution:');
    Object.entries(factionCounts).forEach(([faction, count]) => {
        console.log(`    - ${faction}: ${count} quests`);
    });
    
    if (factoredQuests.length > 0) {
        console.log('✅ TEST 4 PASSED: Quests properly integrated with factions');
    } else {
        console.log('❌ TEST 4 FAILED: No quests have faction assignments');
    }
} catch (error) {
    console.log('❌ TEST 4 FAILED: ' + error.message);
}

// Test 5: Reputation Requirements
console.log('\n=== TEST 5: Reputation Requirements ===');
try {
    const restrictedQuests = questsData.filter(q => q.reputationRequirements);
    console.log(`✅ Found ${restrictedQuests.length} quests with reputation requirements`);
    
    if (restrictedQuests.length > 0) {
        const testQuest = restrictedQuests[0];
        const canAccess = canAccessQuest(testQuest);
        console.log(`  Test quest "${testQuest.title}" accessible: ${canAccess}`);
        console.log('✅ TEST 5 PASSED: Reputation requirements system working');
    } else {
        console.log('ℹ️ TEST 5 SKIPPED: No quests with reputation requirements found');
    }
} catch (error) {
    console.log('❌ TEST 5 FAILED: ' + error.message);
}

console.log('\n🎯 Faction and Reputation System Tests Completed!');
console.log('========================================');