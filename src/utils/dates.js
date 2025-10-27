// import { format, parseISO } from 'date-fns';
// import { ru } from 'date-fns/locale';
//
// export const formatDate = (date) => {
//     if (!date) return '';
//
//     const isoStr = date.toISOString().split('T')[0];
//     const normalizedDate = parseISO(isoStr);
//
//     return format(normalizedDate, 'dd.MM.yyyy', { locale: ru });
// };
//
// export const isTodayDate = (date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//
//     const checkDate = new Date(date);
//     checkDate.setHours(0, 0, 0, 0);
//
//     return checkDate.getTime() === today.getTime();
// };

import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date) => {
    if (!date) return '';

    const isoStr = date.toISOString().split('T')[0];
    const normalizedDate = parseISO(isoStr);

    return format(normalizedDate, 'dd.MM.yyyy', { locale: ru });
};

export const isTodayDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate.getTime() === today.getTime();
};

/**
 * Проверяет, является ли дата прошлой (раньше вчера)
 * @param {Date} date - дата для проверки
 * @returns {boolean}
 */
export const isPastDate = (date) => {
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1); // Вчера

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate.getTime() < yesterday.getTime();
};

/**
 * Проверяет, является ли дата сегодня или в будущем
 * @param {Date} date - дата для проверки
 * @returns {boolean}
 */
export const isTodayOrFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate.getTime() >= today.getTime();
};

/**
 * Получает дефолтный цвет ячейки в зависимости от даты
 * @param {Date} date - дата ячейки
 * @returns {string} - цвет в формате hex
 */
export const getDefaultCellColor = (date) => {
    return isPastDate(date) ? '#acb5e3' : '#ffffff';
};

export const formatDateForApi = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

export const formatDateWithWeekday = (date) => {
    return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};