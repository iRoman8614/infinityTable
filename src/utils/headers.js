import { VISIBLE_HEADER_TYPES } from './constants.js';

/**
 * Строит дерево заголовков из плоского массива
 */
export const buildHeaderTree = (headers) => {
    const headerMap = new Map();
    const rootHeaders = [];

    headers.forEach(header => {
        headerMap.set(header.id, { ...header, children: [] });
    });

    headers.forEach(header => {
        const node = headerMap.get(header.id);

        if (header.parentId === 'null' || !header.parentId) {
            rootHeaders.push(node);
        } else {
            const parent = headerMap.get(header.parentId);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    return rootHeaders;
};

/**
 * Фильтрует дерево по видимым типам, сохраняя иерархию
 */
export const filterTreeByTypes = (tree, visibleTypes = VISIBLE_HEADER_TYPES) => {
    const filterNode = (node) => {
        if (!node) return null;

        // Фильтруем детей рекурсивно
        const filteredChildren = (node.children || [])
            .map(child => filterNode(child))
            .filter(child => child !== null)
            .flat();

        // Если узел невидимого типа, поднимаем его детей
        if (!visibleTypes.includes(node.type)) {
            return filteredChildren;
        }

        // Возвращаем узел с отфильтрованными детьми
        return {
            ...node,
            children: filteredChildren,
        };
    };

    return tree
        .map(node => filterNode(node))
        .flat()
        .filter(node => node !== null);
};

/**
 * Подсчитывает количество листьев под узлом
 */
const countLeaves = (node) => {
    if (!node || !node.children || node.children.length === 0) {
        return 1;
    }

    return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
};

/**
 * Преобразует дерево в структуру уровней для рендеринга
 */
export const buildHeaderLevels = (tree) => {
    const levels = [];

    const traverse = (nodes, level = 0) => {
        if (!nodes || nodes.length === 0) return;

        if (!levels[level]) {
            levels[level] = [];
        }

        nodes.forEach(node => {
            if (!node) return;

            // Считаем количество листьев под этим узлом
            const leafCount = countLeaves(node);

            levels[level].push({
                ...node,
                level,
                leafCount,
                hasChildren: (node.children || []).length > 0,
            });

            if (node.children && node.children.length > 0) {
                traverse(node.children, level + 1);
            }
        });
    };

    traverse(tree);
    return levels;
};

/**
 * Получает все листья (конечные элементы без детей)
 */
export const getLeafHeaders = (tree) => {
    const leaves = [];

    const traverse = (nodes) => {
        if (!nodes || nodes.length === 0) return;

        nodes.forEach(node => {
            if (!node) return;

            if (!node.children || node.children.length === 0) {
                leaves.push(node);
            } else {
                traverse(node.children);
            }
        });
    };

    traverse(tree);
    return leaves;
};

/**
 * Считает максимальную глубину дерева
 */
export const getTreeDepth = (tree) => {
    if (!tree || tree.length === 0) {
        return 0;
    }

    const getDepth = (nodes) => {
        if (!nodes || nodes.length === 0) {
            return 0;
        }

        return 1 + Math.max(...nodes.map(node => getDepth(node.children || [])), 0);
    };

    return getDepth(tree);
};