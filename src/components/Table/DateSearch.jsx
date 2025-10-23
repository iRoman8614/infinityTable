import { useState } from 'react';
import './Table.css';

const DateSearch = ({ onSearch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateValue, setDateValue] = useState('');

    const handleSearch = () => {
        if (dateValue) {
            onSearch(dateValue);
            setIsOpen(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="date-search">
            <button
                className="date-search-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Поиск по дате"
            >
                🔍
            </button>

            {isOpen && (
                <div className="date-search-popup">
                    <input
                        type="date"
                        className="date-search-input"
                        value={dateValue}
                        onChange={(e) => setDateValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <button
                        className="date-search-submit"
                        onClick={handleSearch}
                        disabled={!dateValue}
                    >
                        🔍
                    </button>
                    <button
                        className="date-search-close"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};

export default DateSearch;