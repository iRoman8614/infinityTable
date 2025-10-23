import { getContrastTextColor } from '@utils/colors';
import './Table.css';

const TableCell = ({ cellData, height }) => {
    if (!cellData) {
        return (
            <div className="table-cell table-cell--empty">
                —
            </div>
        );
    }

    const backgroundColor = cellData.color || '#f5f5f5';
    const textColor = getContrastTextColor(backgroundColor);

    return (
        <div
            className="table-cell table-cell--data"
            style={{
                backgroundColor,
                color: textColor,
                gridColumn: cellData.colspan > 1 ? `span ${cellData.colspan}` : undefined,
            }}
        >
            <span className="cell-value">{cellData.value}</span>
        </div>
    );
};

export default TableCell;