import { addDays, subDays, format, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date) => {
    return format(date, 'dd.MM.yyyy, EEEE', { locale: ru });
};

export const generateDatesBefore = (startDate, count) => {
    const dates = [];
    for (let i = count; i > 0; i--) {
        dates.push(subDays(startDate, i));
    }
    return dates;
};

export const generateDatesAfter = (startDate, count) => {
    const dates = [];
    for (let i = 0; i < count; i++) {
        dates.push(addDays(startDate, i));
    }
    return dates;
};

export const isTodayDate = (date) => {
    return isToday(date);
};