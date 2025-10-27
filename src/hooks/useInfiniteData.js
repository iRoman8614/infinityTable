// import { useState, useCallback, useMemo, useRef } from 'react';
// import { addDays, subDays, startOfDay } from 'date-fns';
// import { BATCH_SIZE, OVERSCAN } from '@utils/constants';
//
// const useInfiniteData = (onLoadMore) => {
//     const today = useMemo(() => {
//         return startOfDay(new Date());
//     }, []);
//
//     const INITIAL_BUFFER = 20;
//     const isLoadingRef = useRef(false);
//
//     const [dates, setDates] = useState(() => {
//         const datesList = [];
//         const startDate = today;
//
//         for (let i = 0; i < INITIAL_BUFFER + BATCH_SIZE; i++) {
//             datesList.push(addDays(startDate, i));
//         }
//
//         return datesList;
//     });
//
//     const [loadedBeforeCount, setLoadedBeforeCount] = useState(0);
//
//     const loadMoreBefore = useCallback(() => {
//         if (isLoadingRef.current) return;
//
//         isLoadingRef.current = true;
//
//         setDates((prevDates) => {
//             const firstDate = prevDates[0];
//
//             // Форматируем дату в DD.MM.YYYY
//             const day = String(firstDate.getDate()).padStart(2, '0');
//             const month = String(firstDate.getMonth() + 1).padStart(2, '0');
//             const year = firstDate.getFullYear();
//             const formattedDate = `${day}.${month}.${year}`;
//
//             // Вызываем callback для загрузки данных
//             if (onLoadMore) {
//                 onLoadMore(formattedDate, 'up', BATCH_SIZE);
//             }
//
//             const newDates = [];
//             for (let i = BATCH_SIZE; i > 0; i--) {
//                 newDates.push(subDays(firstDate, i));
//             }
//
//             setTimeout(() => {
//                 isLoadingRef.current = false;
//             }, 100);
//
//             return [...newDates, ...prevDates];
//         });
//
//         setLoadedBeforeCount(prev => prev + BATCH_SIZE);
//     }, [onLoadMore]);
//
//     const loadMoreAfter = useCallback(() => {
//         if (isLoadingRef.current) return;
//
//         isLoadingRef.current = true;
//
//         setDates((prevDates) => {
//             const lastDate = prevDates[prevDates.length - 1];
//
//             // Форматируем дату в DD.MM.YYYY
//             const day = String(lastDate.getDate()).padStart(2, '0');
//             const month = String(lastDate.getMonth() + 1).padStart(2, '0');
//             const year = lastDate.getFullYear();
//             const formattedDate = `${day}.${month}.${year}`;
//
//             // Вызываем callback для загрузки данных
//             if (onLoadMore) {
//                 onLoadMore(formattedDate, 'down', BATCH_SIZE);
//             }
//
//             const newDates = [];
//             for (let i = 1; i <= BATCH_SIZE; i++) {
//                 newDates.push(addDays(lastDate, i));
//             }
//
//             setTimeout(() => {
//                 isLoadingRef.current = false;
//             }, 100);
//
//             return [...prevDates, ...newDates];
//         });
//     }, [onLoadMore]);
//
//     const scrollToDate = useCallback((targetDate) => {
//         const dateStr = targetDate.toISOString().split('T')[0];
//         const index = dates.findIndex(date =>
//             date.toISOString().split('T')[0] === dateStr
//         );
//         return index;
//     }, [dates]);
//
//     const todayIndex = loadedBeforeCount;
//
//     return {
//         dates,
//         todayIndex,
//         loadMoreBefore,
//         loadMoreAfter,
//         scrollToDate,
//         loadedBeforeCount,
//     };
// };
//
// export default useInfiniteData;

import { useState, useCallback, useRef, useMemo } from 'react';
import { BATCH_SIZE } from '@utils/constants';

const useInfiniteData = (onLoadMore) => {
    const [dates, setDates] = useState(() => {
        const initialDates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = -50; i <= 50; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            initialDates.push(date);
        }

        return initialDates;
    });

    const todayIndex = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dates.findIndex(date => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });
    }, [dates]);

    const [loadedBeforeCount, setLoadedBeforeCount] = useState(0);
    const isLoadingRef = useRef(false);
    const lastLoadDirectionRef = useRef(null);

    const loadMoreBefore = useCallback(() => {
        if (isLoadingRef.current) {
            console.log('[InfiniteData] Загрузка уже идет, пропускаем loadMoreBefore');
            return;
        }

        isLoadingRef.current = true;
        lastLoadDirectionRef.current = 'up';

        const firstDate = dates[0];
        const dateStr = firstDate.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');

        console.log(`[InfiniteData] Загрузка ДО: ${dateStr}`);

        if (onLoadMore) {
            onLoadMore(
                dateStr.split('-').reverse().join('.'),
                'up',
                BATCH_SIZE
            );
        }

        const newDates = [];
        for (let i = BATCH_SIZE; i > 0; i--) {
            const newDate = new Date(firstDate);
            newDate.setDate(firstDate.getDate() - i);
            newDates.push(newDate);
        }

        setDates(prevDates => [...newDates, ...prevDates]);
        setLoadedBeforeCount(prev => prev + BATCH_SIZE);

        setTimeout(() => {
            isLoadingRef.current = false;
        }, 300);
    }, [dates, onLoadMore]);

    const loadMoreAfter = useCallback(() => {
        if (isLoadingRef.current) {
            console.log('[InfiniteData] Загрузка уже идет, пропускаем loadMoreAfter');
            return;
        }

        isLoadingRef.current = true;
        lastLoadDirectionRef.current = 'down';

        const lastDate = dates[dates.length - 1];
        const dateStr = lastDate.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('.').reverse().join('-');

        console.log(`[InfiniteData] Загрузка ПОСЛЕ: ${dateStr}`);

        if (onLoadMore) {
            onLoadMore(
                dateStr.split('-').reverse().join('.'),
                'down',
                BATCH_SIZE
            );
        }

        const newDates = [];
        for (let i = 1; i <= BATCH_SIZE; i++) {
            const newDate = new Date(lastDate);
            newDate.setDate(lastDate.getDate() + i);
            newDates.push(newDate);
        }

        setDates(prevDates => [...prevDates, ...newDates]);

        setTimeout(() => {
            isLoadingRef.current = false;
        }, 300);
    }, [dates, onLoadMore]);

    const scrollToDate = useCallback((targetDate) => {
        const index = dates.findIndex(date => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            const t = new Date(targetDate);
            t.setHours(0, 0, 0, 0);
            return d.getTime() === t.getTime();
        });
        return index;
    }, [dates]);

    const isLoading = useCallback(() => {
        return isLoadingRef.current;
    }, []);

    // НОВАЯ ФУНКЦИЯ: refreshViewport
    const refreshViewport = useCallback((visibleRange, loadBatch) => {
        if (!visibleRange || !loadBatch) {
            console.warn('[InfiniteData] refreshViewport: missing parameters');
            return Promise.resolve();
        }

        const { start, end } = visibleRange;
        const currentVisibleDates = dates.slice(start, end);

        console.log(`[RefreshViewport] Обновление видимого диапазона: ${currentVisibleDates.length} дат (индексы ${start}-${end})`);

        if (currentVisibleDates.length === 0) {
            console.log('[RefreshViewport] Нет видимых дат');
            return Promise.resolve();
        }

        // Вычисляем количество батчей для видимого диапазона
        const batchCount = Math.ceil(currentVisibleDates.length / BATCH_SIZE);
        console.log(`[RefreshViewport] Будет загружено ${batchCount} батчей`);

        const refreshPromises = [];
        for (let i = 0; i < batchCount; i++) {
            const batchStartIndex = start + (i * BATCH_SIZE);
            const batchStartDate = dates[batchStartIndex];

            if (batchStartDate) {
                const dateStr = batchStartDate.toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).split('.').reverse().join('.');

                console.log(`[RefreshViewport] Загрузка батча ${i + 1}/${batchCount}: ${dateStr}`);
                refreshPromises.push(loadBatch(dateStr, 'down', BATCH_SIZE));
            }
        }

        return Promise.allSettled(refreshPromises).then((results) => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            console.log(`[RefreshViewport] Завершено: ${successful} успешно, ${failed} ошибок`);
        });
    }, [dates]);

    return {
        dates,
        todayIndex,
        loadMoreBefore,
        loadMoreAfter,
        scrollToDate,
        loadedBeforeCount,
        isLoading,
        refreshViewport,
    };
};

export default useInfiniteData;