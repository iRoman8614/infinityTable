import { formatDate } from '@utils/dates';
import {
    getCellData,
    shouldSkipCellDueToRowspan,
    shouldSkipCellDueToColspan
} from '@/mocks/cellData.js';
import { getContrastTextColor } from '@utils/colors';
import './Table.css';

const TableRow = ({ date, height, leafHeaders, leafCount, allDates, onCellDoubleClick }) => {
    if (!date) {
        return (
            <div className="table-row" style={{ height: `${height}px`, display: 'flex', position: 'relative' }}>
                <div className="table-cell table-cell--date" style={{ minWidth: '250px', maxWidth: '250px' }}>
                    —
                </div>
                <div className="table-row-cells" style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${leafCount}, 1fr)`, position: 'relative' }}>
                    {leafHeaders.map((header) => (
                        <div key={header.id} className="grid-cell">
                            <div className="table-cell table-cell--empty">—</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const dateStr = date.toISOString().split('T')[0];

    const handleCellDoubleClick = (headerId) => {
        const cellIdentifier = {
            date: dateStr,
            headerId: headerId,
        };

        console.log('Cell double clicked:', JSON.stringify(cellIdentifier, null, 2));

        if (onCellDoubleClick) {
            onCellDoubleClick(cellIdentifier);
        }
    };

    return (
        <div
            className="table-row"
            style={{
                height: `${height}px`,
                display: 'flex',
                position: 'relative',
            }}
        >
            {/* Колонка с датой */}
            <div
                className="table-cell table-cell--date"
                style={{ minWidth: '250px', maxWidth: '250px' }}
            >
                {formatDate(date)}
            </div>

            {/* Контейнер для ячеек данных */}
            <div
                className="table-row-cells"
                style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${leafCount}, 1fr)`,
                    position: 'relative',
                }}
            >
                {/* Создаем grid ячейки для каждого заголовка */}
                {leafHeaders.map((header, colIndex) => {
                    const cellData = getCellData(date, header.id);
                    
                    // Пропускаем ячейку если она покрыта rowspan
                    if (shouldSkipCellDueToRowspan(date, header.id, allDates)) {
                        return (
                            <div key={header.id} className="grid-cell">
                                <div className="table-cell table-cell--placeholder"></div>
                            </div>
                        );
                    }

                    // Пропускаем ячейку если она покрыта colspan
                    if (shouldSkipCellDueToColspan(date, header.id, allDates)) {
                        return (
                            <div key={header.id} className="grid-cell">
                                <div className="table-cell table-cell--placeholder"></div>
                            </div>
                        );
                    }

                    // Рендерим обычную ячейку
                    if (cellData) {
                        return (
                            <div key={header.id} className="grid-cell">
                                <div
                                    className="table-cell"
                                    style={{
                                        backgroundColor: cellData.color || '#ffffff',
                                        color: getContrastTextColor(cellData.color || '#ffffff'),
                                    }}
                                    onDoubleClick={() => handleCellDoubleClick(header.id)}
                                >
                                    {cellData.value || '—'}
                                </div>
                            </div>
                        );
                    }

                    // Пустая ячейка
                    return (
                        <div key={header.id} className="grid-cell">
                            <div className="table-cell table-cell--empty">—</div>
                        </div>
                    );
                })}

                {/* Ячейки с rowspan > 1 - позиционируем абсолютно поверх grid */}
                {leafHeaders.map((header, colIndex) => {
                    const cellData = getCellData(date, header.id);
                    
                    if (cellData && cellData.rowspan > 1) {
                        const cellWidth = 100 / leafCount;
                        const leftPosition = colIndex * cellWidth;
                        const widthValue = cellData.colspan > 1 ? cellWidth * cellData.colspan : cellWidth;

                        return (
                            <div
                                key={`${header.id}-rowspan`}
                                className="table-cell table-cell--rowspan"
                                style={{
                                    backgroundColor: cellData.color,
                                    color: getContrastTextColor(cellData.color),
                                    position: 'absolute',
                                    left: `${leftPosition}%`,
                                    top: 0,
                                    width: `${widthValue}%`,
                                    height: `${height * cellData.rowspan}px`,
                                    zIndex: 5,
                                }}
                                onDoubleClick={() => handleCellDoubleClick(header.id)}
                            >
                                {cellData.value || '—'}
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
};

export default TableRow;