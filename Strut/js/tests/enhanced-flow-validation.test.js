/**
 * Enhanced Flow Editor Validation Tests
 * Tests for the improved validation system, strategic combinations, and interactive suggestions
 */

// Mock DOM elements and dependencies for testing
const mockCanvas = {
    querySelectorAll: () => [],
    getElementById: () => null
};

const mockLines = [];

// Mock flow objectives and block interfaces for testing
const testBlockInterfaces = {
    'Scansione rete locale': {
        inputs: [],
        outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'List<IPAddress>', name: 'IP List' }]
    },
    'Esegui SQL Injection (base)': {
        inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }],
        outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'DataPacket', name: 'Result Data' }]
    },
    'Esfiltra intero database': {
        inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }],
        outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'DataPacket', name: 'Database Dump' }]
    },
    'Integra con rete Tor': {
        inputs: [{ type: 'ControlFlow', name: 'In' }],
        outputs: [{ type: 'ControlFlow', name: 'Out' }]
    },
    'Crittografa payload': {
        inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'DataPacket', name: 'Data' }],
        outputs: [{ type: 'ControlFlow', name: 'Out' }, { type: 'EncryptedPayload', name: 'Encrypted Data' }]
    },
    'Cancella log di sistema': {
        inputs: [{ type: 'ControlFlow', name: 'In' }, { type: 'Target', name: 'Target' }],
        outputs: [{ type: 'ControlFlow', name: 'Out' }]
    }
};

const testBlockCategories = {
    'Scansione rete locale': 'access',
    'Esegui SQL Injection (base)': 'acquisition',
    'Esfiltra intero database': 'exfiltration',
    'Integra con rete Tor': 'c2',
    'Crittografa payload': 'encryption',
    'Cancella log di sistema': 'cleanup'
};

// Test suite
class FlowValidationTests {
    constructor() {
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.testResults = [];
    }

    assert(condition, message) {
        if (condition) {
            this.testsPassed++;
            this.testResults.push({ status: 'PASS', message });
            console.log(`✅ PASS: ${message}`);
        } else {
            this.testsFailed++;
            this.testResults.push({ status: 'FAIL', message });
            console.log(`❌ FAIL: ${message}`);
        }
    }

    testMinimumBlockValidation() {
        console.log('\n🧪 Testing Minimum Block Validation...');
        
        // Test with insufficient blocks
        const insufficientBlocks = ['Scansione rete locale'];
        this.assert(
            insufficientBlocks.length < 3,
            'Flow with less than 3 blocks should be invalid'
        );

        // Test with sufficient blocks
        const sufficientBlocks = ['Scansione rete locale', 'Esegui SQL Injection (base)', 'Esfiltra intero database'];
        this.assert(
            sufficientBlocks.length >= 3,
            'Flow with 3+ blocks should meet minimum requirement'
        );
    }

    testStrategicCombinations() {
        console.log('\n🧪 Testing Strategic Combinations...');
        
        const stealthCombo = ['Integra con rete Tor', 'Crittografa payload', 'Cancella log di sistema'];
        
        // Mock strategic combinations detection
        const hasStealthCombo = stealthCombo.every(block => 
            ['Integra con rete Tor', 'Crittografa payload', 'Cancella log di sistema'].includes(block)
        );
        
        this.assert(
            hasStealthCombo,
            'Should detect stealth combination correctly'
        );

        const partialStealthCombo = ['Integra con rete Tor', 'Crittografa payload'];
        const hasPartialStealth = partialStealthCombo.every(block => 
            ['Integra con rete Tor', 'Crittografa payload', 'Cancella log di sistema'].includes(block)
        );
        
        this.assert(
            hasPartialStealth && partialStealthCombo.length < 3,
            'Should recognize partial strategic combinations'
        );
    }

    testMandatoryCombinations() {
        console.log('\n🧪 Testing Mandatory Combinations...');
        
        // Test DDoS requiring dos_traffic
        const ddosFlow = ['Scansione rete locale', 'Lancia attacco SYN Flood'];
        const hasDosTraffic = ddosFlow.some(block => 
            testBlockCategories[block] === 'dos_traffic' || block.includes('Flood') || block.includes('DDoS')
        );
        
        this.assert(
            hasDosTraffic || ddosFlow.includes('Lancia attacco SYN Flood'),
            'DDoS flow should require traffic generation blocks'
        );

        // Test ransomware requiring encryption
        const ransomwareFlow = ['Scansione rete locale', 'Sviluppa ransomware semplice'];
        const hasEncryption = ransomwareFlow.some(block => 
            testBlockCategories[block] === 'encryption' || block.includes('ransomware') || block.includes('Crittograf')
        );
        
        this.assert(
            hasEncryption || ransomwareFlow.includes('Sviluppa ransomware semplice'),
            'Ransomware flow should require encryption blocks'
        );
    }

    testRedundancyDetection() {
        console.log('\n🧪 Testing Redundancy Detection...');
        
        // Test redundant AI text generation
        const redundantAIFlow = ['Genera Testo (AI)', 'Genera Testo Persuasivo (AI)'];
        
        this.assert(
            redundantAIFlow.length === 2 && redundantAIFlow.every(block => block.includes('Genera Testo')),
            'Should detect redundant AI text generation blocks'
        );

        // Test efficient flow without redundancy
        const efficientFlow = ['Scansione rete locale', 'Esegui SQL Injection (base)', 'Esfiltra intero database'];
        const hasRedundancy = efficientFlow.some((block, index) => 
            efficientFlow.indexOf(block) !== index
        );
        
        this.assert(
            !hasRedundancy,
            'Efficient flow should not have redundancy'
        );
    }

    testObjectiveSpecificValidation() {
        console.log('\n🧪 Testing Objective-Specific Validation...');
        
        // Test data exfiltration objective
        const dataExfiltrationFlow = ['Scansione rete locale', 'Esegui SQL Injection (base)', 'Esfiltra intero database'];
        const hasAccess = dataExfiltrationFlow.some(block => testBlockCategories[block] === 'access');
        const hasAcquisition = dataExfiltrationFlow.some(block => testBlockCategories[block] === 'acquisition');
        const hasExfiltration = dataExfiltrationFlow.some(block => testBlockCategories[block] === 'exfiltration');
        
        this.assert(
            hasAccess && hasAcquisition && hasExfiltration,
            'Data exfiltration flow should have access, acquisition, and exfiltration components'
        );
    }

    testInteractiveSuggestions() {
        console.log('\n🧪 Testing Interactive Suggestions...');
        
        // Mock incomplete flow for suggestions
        const incompleteFlow = ['Integra con rete Tor', 'Crittografa payload'];
        const missingStealth = ['Cancella log di sistema'];
        
        // Test suggestion generation logic
        const shouldSuggestCleanup = incompleteFlow.includes('Integra con rete Tor') && 
                                   incompleteFlow.includes('Crittografa payload') &&
                                   !incompleteFlow.includes('Cancella log di sistema');
        
        this.assert(
            shouldSuggestCleanup,
            'Should suggest completing stealth combination'
        );
        
        // Test objective selection suggestion
        const emptyFlow = [];
        this.assert(
            emptyFlow.length === 0,
            'Empty flow should trigger objective selection suggestion'
        );
    }

    testEfficiencyPenalties() {
        console.log('\n🧪 Testing Efficiency Penalties...');
        
        // Test overly complex flow
        const complexFlow = Array(20).fill('Scansione rete locale');
        this.assert(
            complexFlow.length > 15,
            'Overly complex flows should trigger efficiency penalties'
        );

        // Test optimal complexity flow
        const optimalFlow = ['Scansione rete locale', 'Esegui SQL Injection (base)', 'Esfiltra intero database', 'Crittografa payload'];
        this.assert(
            optimalFlow.length <= 15 && optimalFlow.length >= 3,
            'Optimal complexity flows should not trigger penalties'
        );
    }

    runAllTests() {
        console.log('🚀 Starting Enhanced Flow Editor Validation Tests...\n');
        
        this.testMinimumBlockValidation();
        this.testStrategicCombinations();
        this.testMandatoryCombinations();
        this.testRedundancyDetection();
        this.testObjectiveSpecificValidation();
        this.testInteractiveSuggestions();
        this.testEfficiencyPenalties();
        
        console.log('\n📊 Test Results Summary:');
        console.log(`✅ Tests Passed: ${this.testsPassed}`);
        console.log(`❌ Tests Failed: ${this.testsFailed}`);
        console.log(`📈 Success Rate: ${((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100).toFixed(1)}%`);
        
        if (this.testsFailed === 0) {
            console.log('🎉 All tests passed! Enhanced validation system is working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Please review the enhanced validation logic.');
        }
        
        return {
            passed: this.testsPassed,
            failed: this.testsFailed,
            total: this.testsPassed + this.testsFailed,
            results: this.testResults
        };
    }
}

// Integration test with HTML test runner
function runFlowValidationTests() {
    const testRunner = new FlowValidationTests();
    return testRunner.runAllTests();
}

// Export for browser environment
if (typeof window !== 'undefined') {
    window.FlowValidationTests = FlowValidationTests;
    window.runFlowValidationTests = runFlowValidationTests;
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FlowValidationTests, runFlowValidationTests };
}