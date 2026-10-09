import MessageInput from "../../widgets/MessageInput";
import MessagesList from "../../widgets/MessagesList";
import ChatSidebar from "../../widgets/ChartSidebar";
// aiAssistant.config.js
// aiAssistant.config.js
export const FORUM_CONFIG = {
  GRID_DESKTOP_COLUMNS: 4,
  GRID_DESKTOP_ROWS: 4,
  GRID_TEMPLATE_COLUMNS: "250px 1fr",
  GRID_TEMPLATE_ROWS: "1fr 1fr 2fr 1fr",
  GRID_DESKTOP_AREAS: [
    "sidebar chat chat chat",
    "sidebar chat chat chat",
    "sidebar chat chat chat",
    "sidebar input input input",
  ],

  // Tablet
  GRID_TABLET_COLUMNS: 1,
  GRID_TABLET_BREAKPOINT: 1025,
  GRID_TABLET_ROWS: 3,
  GRID_TABLET_AREAS: ["chat", "input"],
  GRID_TABLET_TEMPLATE_ROWS: "1fr 1fr auto", // Добавь

  // Mobile
  GRID_MOBILE_COLUMNS: 1,
  GRID_MOBILE_BREAKPOINT: 768,
  GRID_MOBILE_ROWS: 3,
  GRID_MOBILE_AREAS: ["chat", "input"],
  GRID_MOBILE_TEMPLATE_ROWS: "auto 1fr auto", // Добавь

  widgets: [
    {
      component: ChatSidebar,
      props: {
        title: "Темы",
      },
      area: "sidebar",
      tabletArea: "",
      mobileArea: "",
    },
    {
      component: MessagesList,
      area: "chat",
      tabletArea: "chat",
      mobileArea: "chat",
    },
    {
      component: MessageInput,
      area: "input",
      props: {
        placeholder: "Начните писать...",
        showSuggestion: false,
      },
      tabletArea: "input",
      mobileArea: "input",
    },
  ],
};
