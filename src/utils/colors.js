/**
 * Конвертирует HEX цвет в RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Вычисляет яркость цвета по формуле WCAG
 */
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Определяет контрастный цвет текста (черный или белый) для заданного фонового цвета
 */
export function getContrastTextColor(backgroundColor) {
    if (!backgroundColor || typeof backgroundColor !== 'string') {
        return 'black';
    }

    const cleanColor = backgroundColor.trim().toLowerCase();

    const namedColors = {
        'white': '#ffffff',
        'black': '#000000',
        'red': '#ff0000',
        'green': '#008000',
        'blue': '#0000ff',
        'yellow': '#ffff00',
        'cyan': '#00ffff',
        'magenta': '#ff00ff',
        'silver': '#c0c0c0',
        'gray': '#808080',
        'grey': '#808080',
        'maroon': '#800000',
        'olive': '#808000',
        'lime': '#00ff00',
        'aqua': '#00ffff',
        'teal': '#008080',
        'navy': '#000080',
        'fuchsia': '#ff00ff',
        'purple': '#800080'
    };

    let hexColor = cleanColor;
    if (namedColors[cleanColor]) {
        hexColor = namedColors[cleanColor];
    }

    if (!hexColor.startsWith('#')) {
        return 'black';
    }

    const rgb = hexToRgb(hexColor);
    if (!rgb) {
        return 'black';
    }

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.179 ? 'black' : 'white';
}