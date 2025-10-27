import { getContrastTextColor } from '@utils/colors.js';
import DateSearch from './DateSearch';
import './Table.css';

const HeaderCell = ({ header, rowSpan = 1 }) => {
    const backgroundColor = header.metadata?.color || '#ddd';
    const textColor = getContrastTextColor(backgroundColor);

    return (
        <div
            className={`header-cell header-cell--level-${header.level}`}
            style={{
                backgroundColor,
                color: textColor,
                gridColumn: `span ${header.leafCount}`,
                gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined,
            }}
            title={header.metadata?.tooltip || header.name}
        >
            <span className="header-name">{header.name}</span>
        </div>
    );
};

const TableHeader = ({ headerLevels, treeDepth, leafCount, onDateSearch }) => {
    return (
        <div
            className="table-header-multi"
            style={{
                gridTemplateColumns: `250px repeat(${leafCount}, minmax(120px, 1fr))`,
                gridTemplateRows: `repeat(${treeDepth}, minmax(40px, auto))`,
            }}
        >
            {/* Ячейка даты на всю высоту */}
            <div
                className="header-cell header-cell--date"
                style={{
                    gridRow: `1 / ${treeDepth + 1}`,
                }}
            >
                <span>Дата</span>
                {/*<DateSearch onSearch={onDateSearch} />*/}
            </div>

            {/* Строки заголовков */}
            {headerLevels.map((levelHeaders, levelIndex) => (
                levelHeaders.map(header => {
                    const rowSpan = header.hasChildren ? 1 : treeDepth - levelIndex;

                    return (
                        <HeaderCell
                            key={header.id}
                            header={header}
                            rowSpan={rowSpan}
                        />
                    );
                })
            ))}
        </div>
    );
};

export default TableHeader;