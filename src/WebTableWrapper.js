import React from 'react';
import { createRoot } from 'react-dom/client';
import { EditModeProvider } from '@/context/EditModeContext';
import EditModeToggle from '@/components/EditModeToggle/EditModeToggle';
import InfiniteTable from '@/components/Table/InfiniteTable';
import './App.css';

class VirtualizedTableElement extends HTMLElement {
    constructor() {
        super();
        console.log('[WebTableWrapper] Constructor called');
        this.root = null;
        this._hp = null;
        this._dp = null;
        this._mounted = false;
    }

    static get observedAttributes() {
        return ['hp', 'dp', 'edit-mode', 'show-filters'];
    }

    connectedCallback() {
        console.log('[WebTableWrapper] connectedCallback - DOM connected');

        // Читаем атрибуты СРАЗУ
        this._hp = this.getAttribute('hp');
        this._dp = this.getAttribute('dp');
        const editMode = this.getAttribute('edit-mode');
        const showFilters = this.getAttribute('show-filters');

        console.log('[WebTableWrapper] Raw attributes from DOM:', {
            hp: this._hp,
            dp: this._dp,
            editMode: editMode,
            showFilters: showFilters
        });

        console.log('[WebTableWrapper] Checking window providers:');
        console.log('[WebTableWrapper] window.hp exists?', typeof window.hp, window.hp);
        console.log('[WebTableWrapper] window.dp exists?', typeof window.dp, window.dp);

        // Создаем контейнер для React
        const mountPoint = document.createElement('div');
        mountPoint.style.width = '100%';
        mountPoint.style.height = '100%';
        this.appendChild(mountPoint);

        // Создаем React root
        this.root = createRoot(mountPoint);

        // Рендерим React компонент
        console.log('[WebTableWrapper] Rendering React component...');
        this.render();
        this._mounted = true;

        // Устанавливаем провайдеры СРАЗУ после монтирования
        console.log('[WebTableWrapper] Setting up providers immediately...');
        this.setupProviders();

        // И еще раз через задержку для надежности
        setTimeout(() => {
            console.log('[WebTableWrapper] Setting up providers again (delayed)...');
            this.setupProviders();
        }, 300);
    }

    disconnectedCallback() {
        console.log('[WebTableWrapper] disconnectedCallback - Disconnected from DOM');
        if (this.root) {
            this.root.unmount();
        }
        this._mounted = false;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('[WebTableWrapper] attributeChangedCallback:', { name, oldValue, newValue, mounted: this._mounted });

        if (!this._mounted) return;

        if (name === 'hp') {
            this._hp = newValue;
            this.setupProviders();
        } else if (name === 'dp') {
            this._dp = newValue;
            this.setupProviders();
        } else if (name === 'edit-mode' && window.VirtualizedTableAPI) {
            window.VirtualizedTableAPI.setEditMode(newValue === 'true');
        } else if (name === 'show-filters' && window.VirtualizedTableAPI) {
            window.VirtualizedTableAPI.setShowFilters(newValue === 'true');
        }
    }

    async setupProviders() {
        console.log('[WebTableWrapper] setupProviders START');
        console.log('[WebTableWrapper] Current attributes:', { hp: this._hp, dp: this._dp });

        if (!window.VirtualizedTableAPI) {
            console.error('[WebTableWrapper] VirtualizedTableAPI not available!');
            console.log('[WebTableWrapper] window.VirtualizedTableAPI:', window.VirtualizedTableAPI);
            console.log('[WebTableWrapper] Retrying in 100ms...');
            setTimeout(() => this.setupProviders(), 100);
            return;
        }

        console.log('[WebTableWrapper] VirtualizedTableAPI is available ✓');

        // Устанавливаем Header Provider
        if (this._hp) {
            console.log('[WebTableWrapper] Processing hp attribute:', this._hp);
            console.log('[WebTableWrapper] Checking window["' + this._hp + '"]:', window[this._hp]);

            if (window[this._hp]) {
                const provider = window[this._hp];
                console.log('[WebTableWrapper] Provider type:', typeof provider);

                if (typeof provider === 'function') {
                    console.log('[WebTableWrapper] Calling header provider function...');
                    try {
                        const result = provider(); // Вызываем функцию
                        console.log('[WebTableWrapper] Header provider result:', result);

                        // Проверяем - это Promise?
                        if (result && typeof result.then === 'function') {
                            console.log('[WebTableWrapper] Header provider returned Promise, awaiting...');
                            const resolvedResult = await result;
                            console.log('[WebTableWrapper] Header provider resolved:', resolvedResult);

                            // Если результат это объект с полем headers, берем headers
                            if (resolvedResult && resolvedResult.headers) {
                                console.log('[WebTableWrapper] Using headers from result.headers');
                                window.VirtualizedTableAPI.setHeaderProvider(resolvedResult.headers);
                            } else {
                                window.VirtualizedTableAPI.setHeaderProvider(resolvedResult);
                            }
                        } else {
                            // Не Promise - используем как есть
                            console.log('[WebTableWrapper] Header provider returned sync result');
                            window.VirtualizedTableAPI.setHeaderProvider(result);
                        }

                        console.log('[WebTableWrapper] ✓ Header provider set successfully');
                    } catch (error) {
                        console.error('[WebTableWrapper] Error calling header provider:', error);
                    }
                } else {
                    console.log('[WebTableWrapper] Using provider as-is');
                    window.VirtualizedTableAPI.setHeaderProvider(provider);
                }
            } else {
                console.error('[WebTableWrapper] window["' + this._hp + '"] is undefined!');
            }
        } else {
            console.warn('[WebTableWrapper] hp attribute is empty');
        }

        // Устанавливаем Data Provider
        if (this._dp) {
            console.log('[WebTableWrapper] Processing dp attribute:', this._dp);
            console.log('[WebTableWrapper] Checking window["' + this._dp + '"]:', window[this._dp]);

            if (window[this._dp]) {
                console.log('[WebTableWrapper] Data provider found, setting...');
                window.VirtualizedTableAPI.setDataProvider(window[this._dp]);
                console.log('[WebTableWrapper] ✓ Data provider set successfully');
            } else {
                console.error('[WebTableWrapper] window["' + this._dp + '"] is undefined!');
            }
        } else {
            console.warn('[WebTableWrapper] dp attribute is empty');
        }

        console.log('[WebTableWrapper] setupProviders COMPLETE');
        console.log('[WebTableWrapper] Final state:', window.VirtualizedTableAPI.getState());
    }

    render() {
        if (!this.root) {
            console.warn('[WebTableWrapper] Cannot render - root is null');
            return;
        }

        console.log('[WebTableWrapper] Rendering...');

        const TableComponent = (
            <EditModeProvider>
                <div className="app">
                    <EditModeToggle />
                    <InfiniteTable />
                </div>
            </EditModeProvider>
        );

        this.root.render(TableComponent);
        console.log('[WebTableWrapper] Render complete');
    }
}

// Регистрируем Web Component
if (!customElements.get('virtualized-table')) {
    customElements.define('virtualized-table', VirtualizedTableElement);
    console.log('[WebTableWrapper] <virtualized-table> element registered');
} else {
    console.warn('[WebTableWrapper] <virtualized-table> already registered');
}