import { formatDate } from '@utils/dates';
import {
    getCellData,
    shouldSkipCellDueToRowspan,
    shouldSkipCellDueToColspan
} from '@/mocks/cellData.js';
import { getContrastTextColor } from '@utils/colors';
import './Table.css';

const TableRow = ({ date, height, leafHeaders, leafCount, allDates, onCellDoubleClick }) => {
    const dateStr = date.toISOString().split('T')[0];

    // ВРЕМЕННЫЙ ЛОГ
    console.log('=== Rendering row for date:', dateStr);

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
                    gridTemplateColumns: `repeat(${leafCount}, minmax(120px, 1fr))`,
                    position: 'relative',
                }}
            >
                {/* Первый проход - рендерим все ячейки в grid */}
                {leafHeaders.map((header, colIndex) => {
                    const skipDueToRowspan = shouldSkipCellDueToRowspan(date, header.id, allDates);
                    const skipDueToColspan = shouldSkipCellDueToColspan(date, colIndex, leafHeaders);

                    // ВРЕМЕННЫЙ ЛОГ
                    if (dateStr === '2025-10-27' || dateStr === '2025-10-28') {
                        console.log(`  Header ${header.id}: skipRowspan=${skipDueToRowspan}, skipColspan=${skipDueToColspan}`);
                    }

                    if (skipDueToRowspan || skipDueToColspan) {
                        return (
                            <div
                                key={header.id}
                                className="table-cell table-cell--skip"
                            />
                        );
                    }

                    const cellData = getCellData(date, header.id);

                    // // Для ячейки с rowspan > 1 рендерим пустой placeholder
                    // if (cellData && cellData.rowspan > 1) {
                    //     console.log(`  Rendering PLACEHOLDER for ${header.id} with rowspan=${cellData.rowspan}`);
                    //     return (
                    //         <div
                    //             key={header.id}
                    //             className="table-cell table-cell--empty"
                    //             style={{
                    //                 gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
                    //             }}
                    //         />
                    //     );
                    // }

                    // Для ячейки с rowspan > 1 рендерим SKIP вместо placeholder
                    if (cellData && cellData.rowspan > 1) {
                        return (
                            <div
                                key={header.id}
                                className="table-cell table-cell--skip"
                                style={{
                                    gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
                                }}
                            />
                        );
                    }

                    // Обычная ячейка
                    return (
                        <div
                            key={header.id}
                            className={`table-cell ${cellData ? 'table-cell--data table-cell--clickable' : 'table-cell--empty'}`}
                            style={cellData ? {
                                backgroundColor: cellData.color,
                                color: getContrastTextColor(cellData.color),
                                gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
                            } : {}}
                            onDoubleClick={cellData ? () => handleCellDoubleClick(header.id) : undefined}
                        >
                            {cellData ? (
                                <span className="cell-value">{cellData.value}</span>
                            ) : (
                                '—'
                            )}
                        </div>
                    );
                })}

                {/* Второй проход - рендерим ячейки с rowspan абсолютно */}
                {leafHeaders.map((header, colIndex) => {
                    const skipDueToRowspan = shouldSkipCellDueToRowspan(date, header.id, allDates);
                    const skipDueToColspan = shouldSkipCellDueToColspan(date, colIndex, leafHeaders);

                    if (skipDueToRowspan || skipDueToColspan) {
                        return null;
                    }

                    const cellData = getCellData(date, header.id);

                    // Рендерим только ячейки с rowspan > 1
                    if (cellData && cellData.rowspan > 1) {
                        const cellWidth = 100 / leafCount;
                        const leftPosition = colIndex * cellWidth;
                        const widthValue = cellData.colspan > 1 ? cellWidth * cellData.colspan : cellWidth;

                        console.log(`  Rendering ABSOLUTE cell for ${header.id} with rowspan=${cellData.rowspan}`);

                        return (
                            <div
                                key={`${header.id}-rowspan`}
                                className="table-cell table-cell--data table-cell--rowspan table-cell--clickable"
                                style={{
                                    backgroundColor: cellData.color,
                                    color: getContrastTextColor(cellData.color),
                                    position: 'absolute',
                                    left: `${leftPosition}%`,
                                    width: `${widthValue}%`,
                                    height: `${height * cellData.rowspan}px`,
                                    top: 0,
                                    zIndex: 2,
                                }}
                                onDoubleClick={() => handleCellDoubleClick(header.id)}
                            >
                                <span className="cell-value">{cellData.value}</span>
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