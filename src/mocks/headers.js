export const mockHeaders = [
    {
        id: "line1",
        parentId: "null",
        type: "NODE",
        name: "Линия А",
        metadata: {
            color: "#ff9800",
            tooltip: "Автоматизированная линия сборки",
            workCount: 15
        }
    },
    {
        id: "station1",
        parentId: "line1",
        type: "ASSEMBLE",
        name: "Станция 1",
        metadata: {
            color: "#f44336",
            tooltip: "Начальная станция сборки",
            workCount: 3
        }
    },
    {
        id: "station2",
        parentId: "line1",
        type: "ASSEMBLE",
        name: "Станция 2",
        metadata: {
            color: "#f44336",
            tooltip: "Промежуточная станция",
            workCount: 4
        }
    },
    {
        id: "station3",
        parentId: "line1",
        type: "ASSEMBLE",
        name: "Станция 3",
        metadata: {
            color: "#f44336",
            tooltip: "Финальная станция",
            workCount: 5
        }
    },
    {
        id: "station1_detail1",
        parentId: "station1",
        type: "COMPONENT",
        name: "Компонент 1",
        metadata: {
            color: "#9c27b0",
            tooltip: "Контрольная станция",
            workCount: 2
        }
    },
    {
        id: "station1_detail2",
        parentId: "station1",
        type: "COMPONENT",
        name: "Деталь 1",
        metadata: {
            color: "#795548",
            tooltip: "Упаковочная станция",
            workCount: 3
        }
    },
    {
        id: "station1_detail3",
        parentId: "station1",
        type: "COMPONENT",
        name: "компонент 1",
        metadata: {
            color: "#795548",
            tooltip: "Упаковочная станция",
            workCount: 3
        }
    },
    {
        id: "station2_detail1",
        parentId: "station2",
        type: "COMPONENT",
        name: "Компонент 2",
        metadata: {
            color: "#9c27b0",
            tooltip: "Контрольная станция",
            workCount: 2
        }
    },
    {
        id: "station2_detail2",
        parentId: "station2",
        type: "COMPONENT",
        name: "Деталь 2",
        metadata: {
            color: "#795548",
            tooltip: "Упаковочная станция",
            workCount: 3
        }
    },
    {
        id: "station2_detail3",
        parentId: "station2",
        type: "COMPONENT",
        name: "компонент 2",
        metadata: {
            color: "#795548",
            tooltip: "Упаковочная станция",
            workCount: 3
        }
    },
    {
        id: "station3_detail1",
        parentId: "station3",
        type: "COMPONENT",
        name: "Компонент 3",
        metadata: {
            color: "#9c27b0",
            tooltip: "Контрольная станция",
            workCount: 2
        }
    },
    {
        id: "station3_detail2",
        parentId: "station3",
        type: "COMPONENT",
        name: "Деталь 3",
        metadata: {
            color: "#795548",
            tooltip: "Упаковочная станция",
            workCount: 3
        }
    },
    {
        id: "station3_detail3",
        parentId: "station3",
        type: "COMPONENT",
        name: "компонент 3",
        metadata: {
            color: "#795548",
            tooltip: "Упаковочная станция",
            workCount: 3
        }
    },
];