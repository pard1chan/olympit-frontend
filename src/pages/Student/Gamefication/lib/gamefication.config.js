import UserProfileCard from "../ui/UserProfileCard/UserProfileCard.vue";
import Achivements from "../ui/Achivements/Achivements.vue";
import SubjectSelector from "../ui/SubjectSelector/SubjectSelector.vue";
import LeaderBoard from "../ui/LeaderBoard/LeaderBoard.vue";

export const GAMEFICATION_CONFIGS = {
  // Desktop
  GRID_DESKTOP_COLUMNS: 2,
  GRID_DESKTOP_ROWS: 3,
  GRID_TEMPLATE_COLUMNS: "1fr 1fr",
  GRID_TEMPLATE_ROWS: "auto auto 1fr", // auto для верхней строки, auto для selector, 1fr для list
  GRID_DESKTOP_AREAS: [
    "user achivements",
    "selector selector", // selector занимает обе колонки
    "list list", // list занимает обе колонки
  ],

  // Tablet
  GRID_TABLET_COLUMNS: 2,
  GRID_TABLET_BREAKPOINT: 1025,
  GRID_TABLET_ROWS: 4, // Изменили на 4 строки для планшета
  GRID_TABLET_AREAS: [
    "user user",
    "achivements achivements",
    "selector selector",
    "list list"
  ],
  GRID_TABLET_TEMPLATE_ROWS: "auto auto auto 1fr",

  // Mobile
  GRID_MOBILE_COLUMNS: 1,
  GRID_MOBILE_BREAKPOINT: 768,
  GRID_MOBILE_ROWS: 4, // Изменили на 4 строки для мобильных
  GRID_MOBILE_AREAS: [
    "user",
    "achivements",
    "selector",
    "list"
  ],
  GRID_MOBILE_TEMPLATE_ROWS: "auto auto auto 1fr",

  widgets: [
    { 
      component: UserProfileCard, 
      area: "user",
      // Если нужно указать размеры для GridItem
      props: {
        area: "user"
      }
    },
    { 
      component: Achivements, 
      area: "achivements",
      props: {
        area: "achivements"
      }
    },
    { 
      component: SubjectSelector, 
      area: "selector",
      props: {
        area: "selector"
      }
    },
    { 
      component: LeaderBoard, 
      area: "list",
      props: {
        area: "list",
        fullHeight: true // Занимает всю доступную высоту
      }
    },
  ],
};