/**
 * Offline CDN Fallback Loader
 * Provides local fallbacks for blocked CDN resources during development
 */

// Mock interact.js for basic functionality
if (typeof interact === 'undefined') {
    window.interact = function(selector) {
        return {
            draggable: function(options) {
                console.log('Mock interact: draggable enabled for', selector);
                return this;
            },
            on: function(event, handler) {
                console.log('Mock interact: event listener added for', event);
                return this;
            }
        };
    };
}

// Mock leader-line for connections
if (typeof LeaderLine === 'undefined') {
    window.LeaderLine = function(start, end, options) {
        console.log('Mock LeaderLine: connection created');
        return {
            remove: function() {
                console.log('Mock LeaderLine: connection removed');
            },
            position: function() {
                console.log('Mock LeaderLine: position updated');
            }
        };
    };
}

// Basic Tailwind CSS classes for styling
if (!document.querySelector('style[data-mock-tailwind]')) {
    const style = document.createElement('style');
    style.setAttribute('data-mock-tailwind', 'true');
    style.textContent = `
        .bg-gray-900 { background-color: #111827; }
        .text-gray-200 { color: #e5e7eb; }
        .text-red-400 { color: #f87171; }
        .text-yellow-400 { color: #fbbf24; }
        .text-green-400 { color: #4ade80; }
        .text-blue-400 { color: #60a5fa; }
        .text-indigo-300 { color: #a5b4fc; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mr-1 { margin-right: 0.25rem; }
        .p-4 { padding: 1rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:text-blue-300:hover { color: #93c5fd; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .border-t { border-top-width: 1px; }
        .border-gray-600 { border-color: #4b5563; }
        .pt-2 { padding-top: 0.5rem; }
        .mt-3 { margin-top: 0.75rem; }
        .pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
    `;
    document.head.appendChild(style);
}

console.log('🔧 Offline fallbacks loaded for development testing');