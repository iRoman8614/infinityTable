/**
 * Глобальное состояние виртуализированной таблицы
 * Для использования в Java Vaadin и других интеграциях
 */

// Создаем глобальный объект состояния
if (typeof window !== 'undefined') {
    window.VirtualizedTableState = {
        // Провайдеры данных
        dataProvider: null,
        headerProvider: null,
        // Режимы отображения
        editMode: false,
        showFilters: false,
        // Обработчики событий
        onCellDoubleClick: null,
        onCellMove: null,
        onDataLoad: null,
        onError: null,
        // Внутренние состояния (только для чтения)
        _initialized: false,
        _loading: false,
        _error: null
    };

    /**
     * API для управления состоянием таблицы
     */
    window.VirtualizedTableAPI = {

        /**
         * Установить провайдер данных
         * @param {function} provider - функция провайдера данных (startDate, direction, batchSize) => Promise<string>
         */
        setDataProvider(provider) {
            if (typeof provider !== 'function') {
                console.warn('[VirtualizedTableAPI] setDataProvider expects function');
                return;
            }

            window.VirtualizedTableState.dataProvider = provider;
            console.log('[VirtualizedTableAPI] Data provider set');

            this._dispatchStateEvent('dataProvider', provider);
        },

        /**
         * Установить провайдер заголовков
         * @param {function|object} provider - функция или объект провайдера заголовков
         */
        setHeaderProvider(provider) {
            if (typeof provider !== 'function' && typeof provider !== 'object') {
                console.warn('[VirtualizedTableAPI] setHeaderProvider expects function or object');
                return;
            }

            window.VirtualizedTableState.headerProvider = provider;
            console.log('[VirtualizedTableAPI] Header provider set');

            this._dispatchStateEvent('headerProvider', provider);
        },

        /**
         * Установить обработчик двойного клика по ячейке
         * @param {function} handler - функция обработчик (jsonString) => void
         */
        setOnCellDoubleClick(handler) {
            if (typeof handler !== 'function') {
                console.warn('[VirtualizedTableAPI] setOnCellDoubleClick expects function');
                return;
            }

            window.VirtualizedTableState.onCellDoubleClick = handler;
            console.log('[VirtualizedTableAPI] Cell double click handler set');
        },

        /**
         * Установить обработчик перемещения ячейки (drag & drop)
         * @param {function} handler - функция обработчик (jsonString) => void
         */
        setOnCellMove(handler) {
            if (typeof handler !== 'function') {
                console.warn('[VirtualizedTableAPI] setOnCellMove expects function');
                return;
            }

            window.VirtualizedTableState.onCellMove = handler;
            console.log('[VirtualizedTableAPI] Cell move handler set');
        },

        /**
         * Установить обработчик после загрузки данных
         * @param {function} handler - функция обработчик (dataArray, startDate, batchSize) => void
         */
        setOnDataLoad(handler) {
            if (typeof handler !== 'function') {
                console.warn('[VirtualizedTableAPI] setOnDataLoad expects function');
                return;
            }

            window.VirtualizedTableState.onDataLoad = handler;
            console.log('[VirtualizedTableAPI] Data load handler set');
        },

        /**
         * Установить обработчик ошибок
         * @param {function} handler - функция обработчик (error, context) => void
         */
        setOnError(handler) {
            if (typeof handler !== 'function') {
                console.warn('[VirtualizedTableAPI] setOnError expects function');
                return;
            }

            window.VirtualizedTableState.onError = handler;
            console.log('[VirtualizedTableAPI] Error handler set');
        },

        refreshViewport() {
            if (typeof window.refreshTableViewport === 'function') {
                console.log('[VirtualizedTableAPI] Вызов refreshViewport...');
                return window.refreshTableViewport();
            } else {
                console.warn('[VirtualizedTableAPI] refreshTableViewport не доступна (таблица не инициализирована)');
                return Promise.resolve();
            }
        },

        /**
         * Установить режим редактирования
         * @param {boolean} enabled - включить/выключить режим редактирования
         */
        // setEditMode(enabled) {
        //     if (typeof enabled !== 'boolean') {
        //         console.warn('[VirtualizedTableAPI] setEditMode expects boolean');
        //         return;
        //     }
        //
        //     window.VirtualizedTableState.editMode = enabled;
        //     console.log('[VirtualizedTableAPI] Edit mode set to:', enabled);
        //
        //     this._dispatchStateEvent('editMode', enabled);
        // },

        setEditMode(enabled) {
            if (typeof enabled !== 'boolean') {
                console.warn('[VirtualizedTableAPI] setEditMode expects boolean');
                return;
            }

            window.VirtualizedTableState.editMode = enabled;
            console.log('[VirtualizedTableAPI] Edit mode set to:', enabled);

            this._dispatchStateEvent('editMode', enabled);

            // Диспатчим специальное событие для принудительного обновления
            this._dispatchUpdateEvent();
        },

        _dispatchUpdateEvent() {
            // Специальное событие для принудительного обновления таблицы
            const event = new CustomEvent('virtualized-table-force-update', {
                detail: {
                    state: this.getState(),
                    timestamp: Date.now()
                },
                bubbles: true
            });
            window.dispatchEvent(event);
            console.log('[VirtualizedTableAPI] Force update event dispatched');
        },

        /**
         * Установить видимость панели фильтров
         * @param {boolean} show - показать/скрыть панель фильтров
         */
        setShowFilters(show) {
            if (typeof show !== 'boolean') {
                console.warn('[VirtualizedTableAPI] setShowFilters expects boolean');
                return;
            }

            window.VirtualizedTableState.showFilters = show;
            console.log('[VirtualizedTableAPI] Show filters set to:', show);

            this._dispatchStateEvent('showFilters', show);
        },

        /**
         * Получить текущее состояние таблицы
         * @returns {object} копия текущего состояния
         */
        getState() {
            return {
                initialized: window.VirtualizedTableState._initialized,
                loading: window.VirtualizedTableState._loading,
                error: window.VirtualizedTableState._error,
                editMode: window.VirtualizedTableState.editMode,
                showFilters: window.VirtualizedTableState.showFilters,
                hasDataProvider: !!window.VirtualizedTableState.dataProvider,
                hasHeaderProvider: !!window.VirtualizedTableState.headerProvider,
                hasOnCellDoubleClick: !!window.VirtualizedTableState.onCellDoubleClick,
                hasOnCellMove: !!window.VirtualizedTableState.onCellMove,
                hasOnDataLoad: !!window.VirtualizedTableState.onDataLoad,
                hasOnError: !!window.VirtualizedTableState.onError
            };
        },

        /**
         * Внутренняя функция для диспатча событий
         */
        _dispatchStateEvent(property, value) {
            const event = new CustomEvent('virtualized-table-state-change', {
                detail: {
                    property,
                    value,
                    state: this.getState()
                },
                bubbles: true
            });
            window.dispatchEvent(event);
        }
    };

    console.log('[VirtualizedTableState] Global state and API initialized');
}

export default window.VirtualizedTableAPI;