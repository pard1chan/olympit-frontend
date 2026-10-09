import { CourseCard, CourseMaterials } from "@/features/course";
import Progress from "@/features/progress/ui";

export const COURSE_PAGE_CONFIG = {
  GRID_DESKTOP_COLUMNS: 2,
  GRID_DESKTOP_ROWS: 3,
  GRID_DESKTOP_TEMPLATE_COLUMNS: "",
  GRID_DESKTOP_TEMPLATE_ROWS: "auto auto auto",
  GRID_TABLET_TEMPLATE_COLUMNS: "",
  GRID_TABLET_TEMPLATE_ROWS: "1fr 2fr auto",
  GRID_TABLET_AREAS: ["card", " materials", "progress"],
  GRID_DESKTOP_AREAS: ["card materials", ". materials", "progress progress"],
  GRID_MOBILE_COLUMNS: 1,
  GRID_MOBILE_AREAS: ["card", " materials", "progress"],
  MOBILE_GAP: 20,
  widgets: [
    {
      component: CourseCard,
      area: "card",
      mobileAreas: "card",
      props: (course, testCount, materialsCount) => ({
        course,
        testCount,
        materialsCount,
      }),
    },
    {
      component: CourseMaterials,
      area: "materials",
      mobileAreas: "materials",
      props: (course, _, materials) => ({ course, _, materials }),
    },
    {
      component: Progress,
      area: "progress",
      mobileAreas: "progress",
      props: (course, _, materials, subject) => ({
        course,
        _,
        materials,
        subject,
      }),
    },
  ],
};
