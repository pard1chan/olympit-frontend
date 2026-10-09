import Calendar from "@/features/calendar";
import NotificationsBlock from "@/features/notifications";
import Progress from "@/features/progress/ui";
import UserProfileCard from "@/widgets/UserProfileCard";

export const DASHBOARD_CONFIGS = {
  student: {
    columns: 2,
    rows: 2,
    gap: 20,
    templateRows: "auto auto auto",
    templateColumns: "auto auto",
    gridAreas: [
      "user-card-profile calendar",
      "notifications calendar",
      "statistica statistica",
    ],
    tabletColumns: 2,
    tabletRows: 1,
    tabletBreakpoint: 990,
    tabletGridAreas: [
      "user-card-profile notifications",
      "calendar calendar",
      "statistica statistica",
    ],

    mobileBreakpoint: 768,
    mobileColumns: 1,
    mobileRows: 1,
    mobileGridAreas: [
      "user-card-profile",
      "notifications",
      "calendar",
      "statistica",
    ],
    title: "Привет, Антон, давай учиться!",
    widgets: [
      {
        component: UserProfileCard,
        area: "user-card-profile",
      },
      {
        component: NotificationsBlock,
        area: "notifications",
      },
      {
        component: Calendar,
        area: "calendar",
      },
      {
        component: Progress,
        area: "statistica",
      },
    ],
  },
  teacher: {
    columns: 2,
    rows: 2,
    gap: 20,
    templateRows: "auto auto auto",
    templateColumns: "auto auto",
    gridAreas: [
      "user-card-profile calendar",
      "notifications calendar",
    ],
    tabletColumns: 2,
    tabletRows: 1,
    tabletBreakpoint: 990,
    tabletGridAreas: [
      "user-card-profile notifications",
      "calendar calendar",
    ],

    mobileBreakpoint: 768,
    mobileColumns: 1,
    mobileRows: 1,
    mobileGridAreas: [
      "user-card-profile",
      "notifications",
      "calendar",
    ],
    title: "Привет, Антон, давай учиться!",
    widgets: [
      {
        component: UserProfileCard,
        area: "user-card-profile",
      },
      {
        component: NotificationsBlock,
        area: "notifications",
      },
      {
        component: Calendar,
        area: "calendar",
      },
    ],
  },
};
