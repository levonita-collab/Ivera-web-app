import type { Region } from "./regions";

export const regionsRu: Record<Region["slug"], Pick<Region, "name" | "subtitle" | "routeHint">> = {
  tbilisi: {
    name: "Тбилиси",
    subtitle: "Старый город и скрытые дворики",
    routeHint: "4 задания · доступен бесплатный стартовый квест",
  },
  kakheti: {
    name: "Кахетия",
    subtitle: "Винная страна и золотые холмы",
    routeHint: "5 заданий · 8000 лет виноделия",
  },
  kazbegi: {
    name: "Казбеги",
    subtitle: "Горный перевал и священные вершины",
    routeHint: "4 задания · 2170 м над облаками",
  },
};
