import { useState, useCallback, useRef, useEffect } from 'react';

export const useDragAndDrop = (scrollContainerRef, editMode) => {
    const [draggedData, setDraggedData] = useState(null);
    const [dragOverCell, setDragOverCell] = useState(null);
    const autoScrollIntervalRef = useRef(null);

    const handleAutoScroll = useCallback((clientY) => {
        if (!scrollContainerRef?.current) return;

        const container = scrollContainerRef.current;
        const rect = container.getBoundingClientRect();
        const scrollZone = 100;
        const scrollSpeed = 5;

        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }

        if (clientY < rect.top + scrollZone) {
            autoScrollIntervalRef.current = setInterval(() => {
                container.scrollTop -= scrollSpeed;
            }, 16);
        } else if (clientY > rect.bottom - scrollZone) {
            autoScrollIntervalRef.current = setInterval(() => {
                container.scrollTop += scrollSpeed;
            }, 16);
        }
    }, [scrollContainerRef]);

    const stopAutoScroll = useCallback(() => {
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }
    }, []);

    const handleDragStart = useCallback((e, date, headerId, cellData) => {
        // Проверяем режим редактирования
        if (!editMode) {
            e.preventDefault();
            console.log('[DragDrop] Отменено: режим редактирования выключен');
            return;
        }

        if (!cellData?.draggable) {
            e.preventDefault();
            return;
        }

        const isoStr = date.toISOString().split('T')[0];
        const [year, month, day] = isoStr.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        const dragData = {
            date: formattedDate,
            headerId: headerId,
            value: cellData.value,
            color: cellData.color,
        };

        setDraggedData(dragData);
        e.dataTransfer.effectAllowed = 'move';
    }, [editMode]);

    const handleDragEnd = useCallback(() => {
        setDraggedData(null);
        setDragOverCell(null);
        stopAutoScroll();
    }, [stopAutoScroll]);

    const handleDragOver = useCallback((e, targetDate, targetHeaderId) => {
        if (!editMode || !draggedData) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const isoStr = targetDate.toISOString().split('T')[0];
        const [year, month, day] = isoStr.split('-');
        const formattedTargetDate = `${day}.${month}.${year}`;

        if (draggedData.headerId !== targetHeaderId) return;
        if (draggedData.date === formattedTargetDate) return;

        setDragOverCell({ date: formattedTargetDate, headerId: targetHeaderId });
        handleAutoScroll(e.clientY);
    }, [editMode, draggedData, handleAutoScroll]);

    const handleDragLeave = useCallback((e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverCell(null);
        }
    }, []);

    const handleDrop = useCallback((e, targetDate, targetHeaderId, onCellMove) => {
        e.preventDefault();
        stopAutoScroll();

        if (!editMode || !draggedData) return;

        const isoStr = targetDate.toISOString().split('T')[0];
        const [year, month, day] = isoStr.split('-');
        const formattedTargetDate = `${day}.${month}.${year}`;

        if (draggedData.headerId !== targetHeaderId) {
            setDraggedData(null);
            setDragOverCell(null);
            return;
        }

        if (draggedData.date === formattedTargetDate) {
            setDraggedData(null);
            setDragOverCell(null);
            return;
        }

        const moveData = {
            source: {
                date: draggedData.date,
                headerId: draggedData.headerId,
            },
            target: {
                date: formattedTargetDate,
                headerId: targetHeaderId,
            },
        };

        if (onCellMove) {
            onCellMove(moveData);
        }

        setDraggedData(null);
        setDragOverCell(null);
    }, [editMode, draggedData, stopAutoScroll]);

    const isDragOver = useCallback((date, headerId) => {
        const isoStr = date.toISOString().split('T')[0];
        const [year, month, day] = isoStr.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        return dragOverCell &&
            dragOverCell.date === formattedDate &&
            dragOverCell.headerId === headerId;
    }, [dragOverCell]);

    const isDragSource = useCallback((date, headerId) => {
        const isoStr = date.toISOString().split('T')[0];
        const [year, month, day] = isoStr.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        return draggedData &&
            draggedData.date === formattedDate &&
            draggedData.headerId === headerId;
    }, [draggedData]);

    const canDropHere = useCallback((date, headerId) => {
        if (!editMode || !draggedData) return false;

        const isoStr = date.toISOString().split('T')[0];
        const [year, month, day] = isoStr.split('-');
        const formattedDate = `${day}.${month}.${year}`;

        return draggedData.headerId === headerId &&
            draggedData.date !== formattedDate;
    }, [editMode, draggedData]);

    useEffect(() => {
        return () => {
            stopAutoScroll();
        };
    }, [stopAutoScroll]);

    return {
        draggedData,
        dragOverCell,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        isDragOver,
        isDragSource,
        canDropHere,
        stopAutoScroll,
    };
};

export default useDragAndDrop;