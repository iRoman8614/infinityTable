export const BATCH_SIZE = 50;

export const DISPLAY_MODES = {
    COMPACT: 'compact',
    NORMAL: 'normal',
    EXPANDED: 'expanded',
};

export const ROW_HEIGHTS = {
    [DISPLAY_MODES.COMPACT]: 40,
    [DISPLAY_MODES.NORMAL]: 40,
    [DISPLAY_MODES.EXPANDED]: 100,
};

export const OVERSCAN = 5;

// Типы заголовков
export const HEADER_TYPES = {
    NODE: 'NODE',
    ASSEMBLE: 'ASSEMBLE',
    //COMPONENT: 'COMPONENT',
};

// Какие типы показываем в заголовках
export const VISIBLE_HEADER_TYPES = [
    HEADER_TYPES.NODE,
    HEADER_TYPES.ASSEMBLE,
    HEADER_TYPES.COMPONENT, // Закомментировано для теста
];

// Цвета по умолчанию для типов
export const TYPE_COLORS = {
    [HEADER_TYPES.NODE]: '#ff9800',
    [HEADER_TYPES.ASSEMBLE]: '#f44336',
    [HEADER_TYPES.COMPONENT]: '#9c27b0',
};