// import { formatDate } from '@utils/dates.js';
// import {
//     getCellData,
//     shouldSkipCellDueToRowspan,
//     shouldSkipCellDueToColspan
// } from '@/mocks/cellData.js';
// import { getContrastTextColor } from '@utils/colors.js';
// import './Table.css';
//
// const TableRow = ({
//                       date,
//                       height,
//                       leafHeaders,
//                       leafCount,
//                       editMode,
//                       allDates,
//                       onCellDoubleClick,
//                       onDragStart,
//                       onDragEnd,
//                       onDragOver,
//                       onDragLeave,
//                       onDrop,
//                       onCellMove,
//                       isDragOver,
//                       isDragSource,
//                       canDropHere,
//                   }) => {
//     if (!date) {
//         return (
//             <div className="table-row" style={{ height: `${height}px` }}>
//                 <div className="table-cell table-cell--date">—</div>
//                 <div className="table-row-cells" style={{ gridTemplateColumns: `repeat(${leafCount}, 1fr)` }}>
//                     {leafHeaders.map((header) => (
//                         <div key={header.id} className="grid-cell">
//                             <div className="table-cell table-cell--empty">—</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }
//
//     const dateStr = date.toISOString().split('T')[0];
//
//     const handleCellDoubleClick = (headerId) => {
//         const cellIdentifier = {
//             date: dateStr,
//             headerId: headerId,
//         };
//
//         if (onCellDoubleClick) {
//             onCellDoubleClick(cellIdentifier);
//         }
//     };
//
//     const getCellClassName = (header, cellData) => {
//         const classes = ['table-cell'];
//
//         const isSource = isDragSource(date, header.id);
//         const isOver = isDragOver(date, header.id);
//         const canDrop = canDropHere(date, header.id);
//
//         if (isSource) {
//             classes.push('table-cell--dragging');
//         } else if (isOver && canDrop) {
//             classes.push('table-cell--drag-over');
//         }
//
//         if (editMode && cellData?.draggable) {
//             classes.push('table-cell--draggable');
//         }
//
//         return classes.join(' ');
//     };
//
//     const getDragStyles = (header, cellData, baseColor) => {
//         const isSource = isDragSource(date, header.id);
//         const isOver = isDragOver(date, header.id);
//         const canDrop = canDropHere(date, header.id);
//
//         let styles = {
//             backgroundColor: baseColor,
//         };
//
//         if (isSource) {
//             styles.backgroundColor = '#fff3e0';
//         } else if (isOver && canDrop) {
//             styles.backgroundColor = '#e3f2fd';
//         }
//
//         return styles;
//     };
//
//     return (
//         <div className="table-row" style={{ height: `${height}px` }}>
//             <div className="table-cell table-cell--date">
//                 {formatDate(date)}
//             </div>
//
//             <div className="table-row-cells" style={{ gridTemplateColumns: `repeat(${leafCount}, 1fr)` }}>
//                 {leafHeaders.map((header, colIndex) => {
//                     const cellData = getCellData(date, header.id);
//
//                     if (shouldSkipCellDueToRowspan(date, header.id, allDates)) {
//                         let colspanValue = 1;
//                         const dateStr = date.toISOString().split('T')[0];
//                         const currentIndex = allDates.findIndex(d =>
//                             d.toISOString().split('T')[0] === dateStr
//                         );
//                         for (let i = 1; i < 20; i++) {
//                             if (currentIndex - i < 0) break;
//                             const prevDate = allDates[currentIndex - i];
//                             const prevCellData = getCellData(prevDate, header.id);
//                             if (prevCellData && prevCellData.rowspan > i) {
//                                 colspanValue = prevCellData.colspan || 1;
//                                 break;
//                             }
//                         }
//                         return (
//                             <div
//                                 key={header.id}
//                                 className="grid-cell"
//                                 style={{
//                                     gridColumn: colspanValue > 1 ? `span ${colspanValue}` : undefined,
//                                 }}
//                             >
//                                 <div
//                                     className="table-cell table-cell--placeholder"
//                                     onDragOver={(e) => onDragOver(e, date, header.id)}
//                                     onDragLeave={(e) => onDragLeave(e)}
//                                     onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
//                                 />
//                             </div>
//                         );
//                     }
//
//                     if (shouldSkipCellDueToColspan(date, colIndex, leafHeaders)) {
//                         return null;
//                     }
//
//                     if (cellData && cellData.rowspan > 1) {
//                         return (
//                             <div
//                                 key={header.id}
//                                 className="grid-cell"
//                                 style={{
//                                     gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
//                                 }}
//                             >
//                                 <div
//                                     className="table-cell table-cell--placeholder"
//                                     onDragOver={(e) => onDragOver(e, date, header.id)}
//                                     onDragLeave={(e) => onDragLeave(e)}
//                                     onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
//                                 />
//                             </div>
//                         );
//                     }
//
//                     if (cellData) {
//                         const dragStyles = getDragStyles(header, cellData, cellData.color);
//                         const cellClassName = getCellClassName(header, cellData) + ' table-cell--data table-cell--clickable';
//
//                         return (
//                             <div
//                                 key={header.id}
//                                 className="grid-cell"
//                                 style={{
//                                     gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
//                                 }}
//                             >
//                                 <div
//                                     className={cellClassName}
//                                     style={{
//                                         ...dragStyles,
//                                         color: getContrastTextColor(cellData.color || '#ffffff'),
//                                     }}
//                                     draggable={cellData.draggable || false}
//                                     onDragStart={(e) => cellData.draggable && onDragStart(e, date, header.id, cellData)}
//                                     onDragEnd={(e) => cellData.draggable && onDragEnd(e)}
//                                     onDragOver={(e) => onDragOver(e, date, header.id)}
//                                     onDragLeave={(e) => onDragLeave(e)}
//                                     onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
//                                     onDoubleClick={() => handleCellDoubleClick(header.id)}
//                                 >
//                                     <span className="cell-value">{cellData.value || '—'}</span>
//                                 </div>
//                             </div>
//                         );
//                     }
//
//                     const dragStyles = getDragStyles(header, null, 'transparent');
//                     const cellClassName = getCellClassName(header, null) + ' table-cell--empty';
//
//                     return (
//                         <div key={header.id} className="grid-cell">
//                             <div
//                                 className={cellClassName}
//                                 style={dragStyles}
//                                 onDragOver={(e) => onDragOver(e, date, header.id)}
//                                 onDragLeave={(e) => onDragLeave(e)}
//                                 onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
//                             >
//                                 —
//                             </div>
//                         </div>
//                     );
//                 })}
//
//                 {leafHeaders.map((header, colIndex) => {
//                     const cellData = getCellData(date, header.id);
//
//                     if (cellData && cellData.rowspan > 1) {
//                         const cellWidth = 100 / leafCount;
//                         const leftPosition = colIndex * cellWidth;
//                         const widthValue = cellData.colspan > 1 ? cellWidth * cellData.colspan : cellWidth;
//                         const dragStyles = getDragStyles(header, cellData, cellData.color);
//                         const cellClassName = getCellClassName(header, cellData) + ' table-cell--rowspan';
//
//                         return (
//                             <div
//                                 key={`${header.id}-rowspan`}
//                                 className={cellClassName}
//                                 style={{
//                                     ...dragStyles,
//                                     color: getContrastTextColor(cellData.color),
//                                     left: `${leftPosition}%`,
//                                     width: `${widthValue}%`,
//                                     height: `${height * cellData.rowspan}px`,
//                                 }}
//                                 draggable={cellData.draggable || false}
//                                 onDragStart={(e) => cellData.draggable && onDragStart(e, date, header.id, cellData)}
//                                 onDragEnd={(e) => cellData.draggable && onDragEnd(e)}
//                                 onDragOver={(e) => onDragOver(e, date, header.id)}
//                                 onDragLeave={(e) => onDragLeave(e)}
//                                 onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
//                                 onDoubleClick={() => handleCellDoubleClick(header.id)}
//                             >
//                                 <span className="cell-value">{cellData.value || '—'}</span>
//                             </div>
//                         );
//                     }
//
//                     return null;
//                 })}
//             </div>
//         </div>
//     );
// };
//
// export default TableRow;

import { formatDate, getDefaultCellColor } from '@utils/dates.js';
import {
    getCellData,
    shouldSkipCellDueToRowspan,
    shouldSkipCellDueToColspan
} from '@/mocks/cellData.js';
import { getContrastTextColor } from '@utils/colors.js';
import './Table.css';

const TableRow = ({
                      date,
                      height,
                      leafHeaders,
                      leafCount,
                      editMode,
                      allDates,
                      onCellDoubleClick,
                      onDragStart,
                      onDragEnd,
                      onDragOver,
                      onDragLeave,
                      onDrop,
                      onCellMove,
                      isDragOver,
                      isDragSource,
                      canDropHere,
                  }) => {
    // Получаем дефолтный цвет для всех ячеек этой строки
    const defaultCellColor = date ? getDefaultCellColor(date) : '#ffffff';

    if (!date) {
        return (
            <div className="table-row" style={{ height: `${height}px`, display: 'flex', position: 'relative' }}>
                <div className="table-cell table-cell--date">—</div>
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

        if (onCellDoubleClick) {
            onCellDoubleClick(cellIdentifier);
        }
    };

    const getDragStyles = (header, cellData, baseColor) => {
        const isSource = isDragSource(date, header.id);
        const isOver = isDragOver(date, header.id);
        const canDrop = canDropHere(date, header.id);

        let backgroundColor = baseColor;
        let cursor = 'default';

        if (isSource) {
            backgroundColor = '#fff3e0';
        } else if (isOver && canDrop) {
            backgroundColor = '#e3f2fd';
        }

        if (editMode && cellData?.draggable) {
            cursor = 'grab';
        }

        if (isSource) {
            cursor = 'grabbing';
        }

        return {
            backgroundColor,
            cursor,
            transition: 'background-color 0.2s, border 0.2s',
        };
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
            <div className="table-cell table-cell--date">
                {formatDate(date)}
            </div>

            <div
                className="table-row-cells"
                style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${leafCount}, 1fr)`,
                    position: 'relative',
                }}
            >
                {leafHeaders.map((header, colIndex) => {
                    const cellData = getCellData(date, header.id);

                    if (shouldSkipCellDueToRowspan(date, header.id, allDates)) {
                        let colspanValue = 1;
                        const dateStr = date.toISOString().split('T')[0];
                        const currentIndex = allDates.findIndex(d =>
                            d.toISOString().split('T')[0] === dateStr
                        );
                        for (let i = 1; i < 20; i++) {
                            if (currentIndex - i < 0) break;
                            const prevDate = allDates[currentIndex - i];
                            const prevCellData = getCellData(prevDate, header.id);
                            if (prevCellData && prevCellData.rowspan > i) {
                                colspanValue = prevCellData.colspan || 1;
                                break;
                            }
                        }
                        return (
                            <div
                                key={header.id}
                                className="grid-cell"
                                style={{
                                    gridColumn: colspanValue > 1 ? `span ${colspanValue}` : undefined,
                                }}
                            >
                                <div
                                    className="table-cell table-cell--placeholder"
                                    onDragOver={(e) => onDragOver(e, date, header.id)}
                                    onDragLeave={(e) => onDragLeave(e)}
                                    onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
                                />
                            </div>
                        );
                    }

                    if (shouldSkipCellDueToColspan(date, colIndex, leafHeaders)) {
                        return null;
                    }

                    if (cellData && cellData.rowspan > 1) {
                        return (
                            <div
                                key={header.id}
                                className="grid-cell"
                                style={{
                                    gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
                                }}
                            >
                                <div
                                    className="table-cell table-cell--placeholder"
                                    onDragOver={(e) => onDragOver(e, date, header.id)}
                                    onDragLeave={(e) => onDragLeave(e)}
                                    onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
                                />
                            </div>
                        );
                    }

                    if (cellData) {
                        // ВАЖНО: используем цвет из cellData, или дефолтный если не указан
                        const cellColor = cellData.color || defaultCellColor;
                        const dragStyles = getDragStyles(header, cellData, cellColor);

                        return (
                            <div
                                key={header.id}
                                className="grid-cell"
                                style={{
                                    gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
                                }}
                            >
                                <div
                                    className="table-cell table-cell--data table-cell--clickable"
                                    style={{
                                        ...dragStyles,
                                        color: getContrastTextColor(cellColor),
                                    }}
                                    draggable={cellData.draggable || false}
                                    onDragStart={(e) => cellData.draggable && onDragStart(e, date, header.id, cellData)}
                                    onDragEnd={(e) => cellData.draggable && onDragEnd(e)}
                                    onDragOver={(e) => onDragOver(e, date, header.id)}
                                    onDragLeave={(e) => onDragLeave(e)}
                                    onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
                                    onDoubleClick={() => handleCellDoubleClick(header.id)}
                                >
                                    <span className="cell-value">{cellData.value || '—'}</span>
                                </div>
                            </div>
                        );
                    }

                    // Пустая ячейка - используем дефолтный цвет
                    const dragStyles = getDragStyles(header, null, defaultCellColor);

                    return (
                        <div key={header.id} className="grid-cell">
                            <div
                                className="table-cell table-cell--empty"
                                style={dragStyles}
                                onDragOver={(e) => onDragOver(e, date, header.id)}
                                onDragLeave={(e) => onDragLeave(e)}
                                onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
                            >
                                —
                            </div>
                        </div>
                    );
                })}

                {leafHeaders.map((header, colIndex) => {
                    const cellData = getCellData(date, header.id);

                    if (cellData && cellData.rowspan > 1) {
                        const cellWidth = 100 / leafCount;
                        const leftPosition = colIndex * cellWidth;
                        const widthValue = cellData.colspan > 1 ? cellWidth * cellData.colspan : cellWidth;

                        // ВАЖНО: используем цвет из cellData, или дефолтный если не указан
                        const cellColor = cellData.color || defaultCellColor;
                        const dragStyles = getDragStyles(header, cellData, cellColor);

                        return (
                            <div
                                key={`${header.id}-rowspan`}
                                className="table-cell table-cell--rowspan"
                                style={{
                                    ...dragStyles,
                                    color: getContrastTextColor(cellColor),
                                    position: 'absolute',
                                    left: `${leftPosition}%`,
                                    top: 0,
                                    width: `${widthValue}%`,
                                    height: `${height * cellData.rowspan}px`,
                                    zIndex: 5,
                                }}
                                draggable={cellData.draggable || false}
                                onDragStart={(e) => cellData.draggable && onDragStart(e, date, header.id, cellData)}
                                onDragEnd={(e) => cellData.draggable && onDragEnd(e)}
                                onDragOver={(e) => onDragOver(e, date, header.id)}
                                onDragLeave={(e) => onDragLeave(e)}
                                onDrop={(e) => onDrop(e, date, header.id, onCellMove)}
                                onDoubleClick={() => handleCellDoubleClick(header.id)}
                            >
                                <span className="cell-value">{cellData.value || '—'}</span>
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