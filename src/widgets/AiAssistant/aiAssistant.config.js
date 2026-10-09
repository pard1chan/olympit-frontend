import ChatHeader from "@/features/chatHeader";
import MessageInput from "../MessageInput";
import MessagesList from "../MessagesList";
import ChatSidebar from "../ChartSidebar";
// aiAssistant.config.js
// aiAssistant.config.js
export const AIASSISTAN_CONFIG = {
  GRID_DESKTOP_COLUMNS: 4,
  GRID_DESKTOP_ROWS: 3,
  GRID_TEMPLATE_COLUMNS: "auto auto",
  GRID_TEMPLATE_ROWS: "auto auto 1fr",
  GRID_DESKTOP_AREAS: [
    "sidebar header header header",
    "sidebar chat chat chat",
    "sidebar chat chat chat",
    "sidebar input input input",
  ],

  // Tablet
  GRID_TABLET_COLUMNS: 1,
  GRID_TABLET_BREAKPOINT: 1025,
  GRID_TABLET_ROWS: 3,
  GRID_TABLET_AREAS: [
    "header", 
    "chat", 
    "input"
  ],
  GRID_TABLET_TEMPLATE_ROWS: "auto auto auto", // Добавь

  // Mobile
  GRID_MOBILE_COLUMNS: 1,
  GRID_MOBILE_BREAKPOINT: 768,
  GRID_MOBILE_ROWS: 2,
  GRID_MOBILE_AREAS: ["chat", "input"],
  GRID_MOBILE_TEMPLATE_ROWS: "auto 1fr auto", // Добавь

  widgets: [
    {
      component: ChatHeader,
      area: "header",
      mobileArea: "header",
    },
    {
      component: ChatSidebar,
      props: (items, title = "Ваши чаты") => ({
        items,
        title,
      }),
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
