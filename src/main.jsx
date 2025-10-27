// Полифил для import.meta (для production билда)
if (typeof import.meta === 'undefined') {
    // @ts-ignore
    self.importMeta = { env: { DEV: false, PROD: true } };
}

// Импортируем глобальное состояние ПЕРВЫМ
import './state/virtualized-table-state.js';

// Импортируем Web Component wrapper
import './WebTableWrapper.js';

console.log('[Main] VirtualizedTable bundle loaded');
console.log('[Main] VirtualizedTableAPI available:', typeof VirtualizedTableAPI !== 'undefined');