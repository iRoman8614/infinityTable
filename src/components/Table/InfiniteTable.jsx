import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import useInfiniteData from '@hooks/useInfiniteData';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import { mockHeaders } from '../../mocks/headers';
import {
    buildHeaderTree,
    filterTreeByTypes,
    buildHeaderLevels,
    getLeafHeaders,
    getTreeDepth
} from '@utils/headers';
import { ROW_HEIGHTS, DISPLAY_MODES, OVERSCAN, VISIBLE_HEADER_TYPES, BATCH_SIZE } from '@utils/constants';
import './Table.css';

const InfiniteTable = () => {
    const { dates, todayIndex, loadMoreBefore, loadMoreAfter, scrollToDate, loadedBeforeCount } = useInfiniteData();
    const parentRef = useRef(null);
    const prevLoadedBeforeCountRef = useRef(0);

    // Обрабатываем заголовки
    const headerTree = buildHeaderTree(mockHeaders);
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

    // Компенсируем сдвиг при подгрузке данных вверх
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

    // Подгрузка батчей при приближении к краям
    useEffect(() => {
        const virtualItems = rowVirtualizer.getVirtualItems();
        if (!virtualItems.length) return;

        const firstItem = virtualItems[0];
        const lastItem = virtualItems[virtualItems.length - 1];

        if (firstItem.index < 10) {
            loadMoreBefore();
        }

        if (lastItem.index >= dates.length - 10) {
            loadMoreAfter();
        }
    }, [rowVirtualizer.getVirtualItems(), dates.length, loadMoreBefore, loadMoreAfter]);

    // Обработчик поиска по дате
    const handleDateSearch = (dateString) => {
        const targetDate = new Date(dateString);
        targetDate.setHours(0, 0, 0, 0);

        const index = scrollToDate(targetDate);

        if (index !== -1) {
            rowVirtualizer.scrollToIndex(index, { align: 'start' });
        } else {
            alert('Дата не найдена в загруженных данных');
        }
    };

    const virtualItems = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    // ... весь предыдущий код до return

// Обработчик двойного клика по ячейке
    const handleCellDoubleClick = (cellIdentifier) => {
        console.log('Cell clicked in InfiniteTable:', JSON.stringify(cellIdentifier, null, 2));
        // Здесь можно добавить дополнительную логику:
        // - открыть модальное окно
        // - показать детали
        // - отправить запрос на сервер
        alert(`Ячейка:\nДата: ${cellIdentifier.date}\nID: ${cellIdentifier.headerId}`);
    };

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

                        // Временный лог
                        console.log('virtualRow.index:', virtualRow.index, 'date:', date?.toISOString().split('T')[0]);

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
                                    onCellDoubleClick={handleCellDoubleClick}
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