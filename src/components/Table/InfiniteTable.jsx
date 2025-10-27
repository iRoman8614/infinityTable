import {useRef, useEffect, useCallback, useMemo, useState, useReducer} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import useInfiniteData from '@hooks/useInfiniteData';
import useDragAndDrop from '@hooks/useDragAndDrop';
import useDataLoader from '@hooks/useDataLoader';
import { useEditMode } from '@/context/EditModeContext';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import {
    buildHeaderTree,
    filterTreeByTypes,
    buildHeaderLevels,
    getLeafHeaders,
    getTreeDepth
} from '@utils/headers';
import { ROW_HEIGHTS, DISPLAY_MODES, OVERSCAN, VISIBLE_HEADER_TYPES } from '@utils/constants';
import './Table.css';

const InfiniteTable = () => {
    const parentRef = useRef(null);
    const prevLoadedBeforeCountRef = useRef(0);

    const { editMode } = useEditMode();

    const [, forceUpdate] = useReducer(x => x + 1, 0);


    // Отслеживаем наличие провайдеров
    const [hasDataProvider, setHasDataProvider] = useState(false);
    const [hasHeaderProvider, setHasHeaderProvider] = useState(false);

    // Проверяем наличие провайдеров при монтировании и изменениях
    useEffect(() => {
        const checkProviders = () => {
            setHasDataProvider(!!window.VirtualizedTableState?.dataProvider);
            setHasHeaderProvider(!!window.VirtualizedTableState?.headerProvider);
        };

        checkProviders();

        // Слушаем изменения состояния
        const handleStateChange = () => {
            checkProviders();
        };

        window.addEventListener('virtualized-table-state-change', handleStateChange);

        // Проверяем периодически (на случай если провайдеры устанавливаются без события)
        const interval = setInterval(checkProviders, 1000);

        return () => {
            window.removeEventListener('virtualized-table-state-change', handleStateChange);
            clearInterval(interval);
        };
    }, []);

    // DataProvider - используем глобальный или fallback пустой
    const dataProvider = useCallback((startDate, direction, batchSize) => {
        const globalProvider = window.VirtualizedTableState?.dataProvider;

        if (globalProvider) {
            console.log(`[DataProvider] Using global provider: date=${startDate}, direction=${direction}, size=${batchSize}`);
            return globalProvider(startDate, direction, batchSize);
        }

        // Fallback - пустой массив
        console.log('[DataProvider] No provider set, returning empty data');
        return JSON.stringify({ data: [] });
    }, []);

    const handleDataLoaded = useCallback((dataArray, startDate, direction, batchSize) => {
        console.log(`[DataLoaded] Загружено ${dataArray.length} записей для ${startDate} (${direction})`);

        const globalHandler = window.VirtualizedTableState?.onDataLoad;
        if (globalHandler) {
            globalHandler(dataArray, startDate, batchSize);
        }
    }, []);

    const handleDataError = useCallback((error, context) => {
        console.error('[DataError]', error, context);

        const globalHandler = window.VirtualizedTableState?.onError;
        if (globalHandler) {
            globalHandler(error, context);
        }
    }, []);

    const { loadBatch, isLoading } = useDataLoader(dataProvider, handleDataLoaded, handleDataError);

    const handleLoadMore = useCallback((lastDate, direction, batchSize) => {
        // Загружаем данные только если есть dataProvider
        if (hasDataProvider) {
            console.log(`[LoadMore] Triggered: date=${lastDate}, direction=${direction}, size=${batchSize}`);
            loadBatch(lastDate, direction, batchSize);
        }
    }, [loadBatch, hasDataProvider]);

    const {
        dates,
        todayIndex,
        loadMoreBefore,
        loadMoreAfter,
        scrollToDate,
        loadedBeforeCount,
        refreshViewport: refreshViewportHook // Получаем функцию из хука
    } = useInfiniteData(handleLoadMore);
    const {
        draggedData,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        isDragOver,
        isDragSource,
        canDropHere,
    } = useDragAndDrop(parentRef, editMode);

    // Используем глобальный headerProvider или пустой массив
    const headers = useMemo(() => {
        const globalHeaderProvider = window.VirtualizedTableState?.headerProvider;

        if (globalHeaderProvider) {
            console.log('[Headers] Using global header provider');
            if (typeof globalHeaderProvider === 'function') {
                return globalHeaderProvider();
            }
            return globalHeaderProvider;
        }

        console.log('[Headers] No header provider set');
        return [];
    }, [hasHeaderProvider]); // Пересчитываем когда меняется hasHeaderProvider

    const headerTree = buildHeaderTree(headers);
    const filteredTree = filterTreeByTypes(headerTree, VISIBLE_HEADER_TYPES);
    const headerLevels = buildHeaderLevels(filteredTree);
    const leafHeaders = getLeafHeaders(filteredTree);
    const treeDepth = getTreeDepth(filteredTree);

    const rowVirtualizer = useVirtualizer({
        count: dates.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHTS[DISPLAY_MODES.NORMAL],
        overscan: OVERSCAN,
    });

    useEffect(() => {
        if (loadedBeforeCount > prevLoadedBeforeCountRef.current) {
            const addedCount = loadedBeforeCount - prevLoadedBeforeCountRef.current;
            const scrollElement = parentRef.current;
            if (scrollElement) {
                const currentScrollTop = scrollElement.scrollTop;
                const addedHeight = addedCount * ROW_HEIGHTS[DISPLAY_MODES.NORMAL];
                scrollElement.scrollTop = currentScrollTop + addedHeight;
            }
            prevLoadedBeforeCountRef.current = loadedBeforeCount;
        }
    }, [loadedBeforeCount]);

    useEffect(() => {
        // Подгружаем данные только если есть dataProvider
        if (!hasDataProvider) return;

        const virtualItems = rowVirtualizer.getVirtualItems();
        if (!virtualItems.length) return;

        const firstItem = virtualItems[0];
        const lastItem = virtualItems[virtualItems.length - 1];

        if (firstItem.index < 10 && !isLoading()) {
            loadMoreBefore();
        }

        if (lastItem.index >= dates.length - 10 && !isLoading()) {
            loadMoreAfter();
        }
    }, [rowVirtualizer.getVirtualItems(), dates.length, loadMoreBefore, loadMoreAfter, isLoading, hasDataProvider]);

    const virtualItems = rowVirtualizer.getVirtualItems();

    const handleDateSearch = (dateString) => {
        const targetDate = new Date(dateString);
        targetDate.setHours(0, 0, 0, 0);
        const index = scrollToDate(targetDate);
        if (index !== -1) {
            rowVirtualizer.scrollToIndex(index, { align: 'start' });
        }
    };

    const handleCellDoubleClick = (cellIdentifier) => {
        if (!editMode) {
            console.log('[DoubleClick] Отменено: режим редактирования выключен');
            return;
        }

        const jsonString = JSON.stringify(cellIdentifier);
        console.log('[DoubleClick]', jsonString);

        const globalHandler = window.VirtualizedTableState?.onCellDoubleClick;
        if (globalHandler) {
            globalHandler(jsonString);
        }

        return jsonString;
    };

    const handleCellMove = (moveData) => {
        // Преобразуем в JSON строку
        const jsonString = JSON.stringify(moveData);
        console.log('[CellMove]', jsonString);

        const globalHandler = window.VirtualizedTableState?.onCellMove;
        if (globalHandler) {
            // Передаем JSON СТРОКУ
            globalHandler(jsonString);
        }

        // ВАЖНО: Возвращаем JSON строку
        return jsonString;
    };

    // ВАЖНО: Создаем функцию refreshViewport и регистрируем в window
    const refreshViewport = useCallback(async () => {
        console.log('[InfiniteTable] refreshViewport вызвана');

        if (!hasDataProvider) {
            console.warn('[InfiniteTable] refreshViewport: dataProvider не установлен');
            return;
        }

        const virtualItems = rowVirtualizer.getVirtualItems();
        if (virtualItems.length === 0) {
            console.warn('[InfiniteTable] refreshViewport: нет видимых элементов');
            return;
        }

        const start = virtualItems[0].index;
        const end = virtualItems[virtualItems.length - 1].index + 1;

        console.log(`[InfiniteTable] Обновление viewport: индексы ${start}-${end}`);

        await refreshViewportHook({ start, end }, loadBatch);

        console.log('[InfiniteTable] refreshViewport завершена');
    }, [hasDataProvider, rowVirtualizer, refreshViewportHook, loadBatch]);

    useEffect(() => {
        console.log('[InfiniteTable] Регистрируем window.refreshTableViewport');
        window.refreshTableViewport = refreshViewport;

        return () => {
            console.log('[InfiniteTable] Удаляем window.refreshTableViewport');
            delete window.refreshTableViewport;
        };
    }, [refreshViewport]);

    const totalSize = rowVirtualizer.getTotalSize();

    // РЕЖИМ 1: Нет HeaderProvider - показываем только колонку с датами
    if (!hasHeaderProvider) {
        return (
            <div className="table-container">
                <div className="table-info">
                    <p>Всего дат: <strong>{dates.length}</strong></p>
                    <p>Строк в DOM: <strong>{virtualItems.length}</strong></p>
                    <p style={{ color: '#ff9800', fontWeight: 'bold' }}>
                        ⚠️ Header Provider не установлен - показана только колонка дат
                    </p>
                </div>

                <div ref={parentRef} className="table-wrapper">
                    <div className="table-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f5f5f5' }}>
                        <div className="table-row" style={{ height: `${ROW_HEIGHTS[DISPLAY_MODES.NORMAL]}px`, display: 'flex' }}>
                            <div className="table-cell table-cell--date" style={{
                                minWidth: '250px',
                                maxWidth: '250px',
                                fontWeight: 'bold',
                                background: '#e0e0e0'
                            }}>
                                Дата
                            </div>
                        </div>
                    </div>

                    <div style={{ height: `${totalSize}px`, width: '100%', position: 'relative' }}>
                        {virtualItems.map((virtualRow) => {
                            const date = dates[virtualRow.index];
                            const dateStr = date.toLocaleDateString('ru-RU', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });

                            return (
                                <div
                                    key={virtualRow.index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    <div className="table-row" style={{ height: `${virtualRow.size}px`, display: 'flex' }}>
                                        <div className="table-cell table-cell--date" style={{
                                            minWidth: '250px',
                                            maxWidth: '250px'
                                        }}>
                                            {dateStr}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // РЕЖИМ 2 и 3: Есть HeaderProvider
    return (
        <div className="table-container">
            <div className="table-info">
                <p>Всего дат: <strong>{dates.length}</strong></p>
                <p>Строк в DOM: <strong>{virtualItems.length}</strong></p>
                <p>Колонок: <strong>{leafHeaders.length}</strong></p>
                <p>Уровней заголовков: <strong>{treeDepth}</strong></p>
                <p>Индекс сегодня: <strong>{todayIndex}</strong></p>
                {dates[todayIndex] && (
                    <p>Дата сегодня: <strong>{dates[todayIndex].toLocaleDateString('ru-RU')}</strong></p>
                )}
                <p>Режим редактирования: <strong style={{ color: editMode ? '#4caf50' : '#f44336' }}>
                    {editMode ? 'Включен' : 'Выключен'}
                </strong></p>
                <p>Data Provider: <strong style={{ color: hasDataProvider ? '#4caf50' : '#f44336' }}>
                    {hasDataProvider ? 'Установлен' : 'Не установлен'}
                </strong></p>
                {!hasDataProvider && (
                    <p style={{ color: '#ff9800', fontWeight: 'bold' }}>
                        Показаны пустые ячейки (установите Data Provider)
                    </p>
                )}
                {draggedData && (
                    <p style={{ color: '#2196f3', fontWeight: 'bold' }}>
                        Перетаскивается: <strong>{draggedData.value}</strong> ({draggedData.date})
                    </p>
                )}
                {isLoading() && hasDataProvider && (
                    <p style={{ color: '#ff9800', fontWeight: 'bold' }}>
                        Загрузка данных...
                    </p>
                )}
            </div>

            <div ref={parentRef} className="table-wrapper">
                <TableHeader
                    headerLevels={headerLevels}
                    treeDepth={treeDepth}
                    leafCount={leafHeaders.length}
                    onDateSearch={handleDateSearch}
                />

                <div
                    style={{
                        height: `${totalSize}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualItems.map((virtualRow) => {
                        const date = dates[virtualRow.index];

                        return (
                            <div
                                key={virtualRow.index}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <TableRow
                                    date={date}
                                    height={virtualRow.size}
                                    leafHeaders={leafHeaders}
                                    leafCount={leafHeaders.length}
                                    allDates={dates}
                                    editMode={editMode}
                                    onCellDoubleClick={handleCellDoubleClick}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onCellMove={handleCellMove}
                                    isDragOver={isDragOver}
                                    isDragSource={isDragSource}
                                    canDropHere={canDropHere}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InfiniteTable;