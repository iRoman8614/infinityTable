import React, { createContext, useState, useContext, useEffect } from 'react';

const EditModeContext = createContext();

export const EditModeProvider = ({ children }) => {
    const [editMode, setEditMode] = useState(() => {
        // Инициализируем из глобального состояния
        return window.VirtualizedTableState?.editMode || false;
    });

    useEffect(() => {
        // Слушаем изменения editMode из глобального состояния
        const handleStateChange = (event) => {
            if (event.detail.property === 'editMode') {
                console.log('[EditModeContext] Edit mode changed to:', event.detail.value);
                setEditMode(event.detail.value);
            }
        };

        const handleForceUpdate = (event) => {
            // При принудительном обновлении синхронизируем состояние
            const globalEditMode = window.VirtualizedTableState?.editMode || false;
            console.log('[EditModeContext] Force update, syncing editMode:', globalEditMode);
            setEditMode(globalEditMode);
        };

        window.addEventListener('virtualized-table-state-change', handleStateChange);
        window.addEventListener('virtualized-table-force-update', handleForceUpdate);

        // Синхронизируем при монтировании
        const initialEditMode = window.VirtualizedTableState?.editMode || false;
        if (initialEditMode !== editMode) {
            console.log('[EditModeContext] Initial sync, editMode:', initialEditMode);
            setEditMode(initialEditMode);
        }

        return () => {
            window.removeEventListener('virtualized-table-state-change', handleStateChange);
            window.removeEventListener('virtualized-table-force-update', handleForceUpdate);
        };
    }, []);

    const toggleEditMode = () => {
        const newMode = !editMode;
        setEditMode(newMode);

        // Обновляем глобальное состояние
        if (window.VirtualizedTableAPI) {
            window.VirtualizedTableAPI.setEditMode(newMode);
        }
    };

    return (
        <EditModeContext.Provider value={{ editMode, toggleEditMode, setEditMode }}>
            {children}
        </EditModeContext.Provider>
    );
};

export const useEditMode = () => {
    const context = useContext(EditModeContext);
    if (!context) {
        throw new Error('useEditMode must be used within EditModeProvider');
    }
    return context;
};