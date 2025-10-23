import { useState, useCallback, useMemo } from 'react';
import { addDays, subDays, startOfDay } from 'date-fns';
import { BATCH_SIZE, OVERSCAN } from '@utils/constants';

const useInfiniteData = () => {
    const today = useMemo(() => {
        // Используем startOfDay для нормализации даты
        return startOfDay(new Date());
    }, []);

    const INITIAL_BUFFER = 20;

    const [dates, setDates] = useState(() => {
        const datesList = [];

        // Начинаем ровно с сегодня
        const startDate = today;

        // Генерируем начальный буфер
        for (let i = 0; i < INITIAL_BUFFER + BATCH_SIZE; i++) {
            datesList.push(addDays(startDate, i));
        }

        return datesList;
    });

    const [loadedBeforeCount, setLoadedBeforeCount] = useState(0);

    const loadMoreBefore = useCallback(() => {
        setDates((prevDates) => {
            const firstDate = prevDates[0];
            const newDates = [];

            for (let i = BATCH_SIZE; i > 0; i--) {
                newDates.push(subDays(firstDate, i));
            }

            return [...newDates, ...prevDates];
        });
        setLoadedBeforeCount(prev => prev + BATCH_SIZE);
    }, []);

    const loadMoreAfter = useCallback(() => {
        setDates((prevDates) => {
            const lastDate = prevDates[prevDates.length - 1];
            const newDates = [];

            for (let i = 1; i <= BATCH_SIZE; i++) {
                newDates.push(addDays(lastDate, i));
            }

            return [...prevDates, ...newDates];
        });
    }, []);

    const scrollToDate = useCallback((targetDate) => {
        const dateStr = targetDate.toISOString().split('T')[0];
        const index = dates.findIndex(date =>
            date.toISOString().split('T')[0] === dateStr
        );
        return index;
    }, [dates]);

    const todayIndex = loadedBeforeCount;

    return {
        dates,
        todayIndex,
        loadMoreBefore,
        loadMoreAfter,
        scrollToDate,
        loadedBeforeCount,
    };
};

export default useInfiniteData;