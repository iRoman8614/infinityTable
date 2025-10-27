import React from 'react';
import { EditModeProvider } from '@/context/EditModeContext';
import EditModeToggle from '@/components/EditModeToggle/EditModeToggle';
import InfiniteTable from '@/components/Table/InfiniteTable';
import './App.css';

const VirtualizedTableComponent = () => {
    return (
        <EditModeProvider>
            <div className="app">
                <EditModeToggle />
                <InfiniteTable />
            </div>
        </EditModeProvider>
    );
};

export default VirtualizedTableComponent;