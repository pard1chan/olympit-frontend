export const COURSE_ITEM_CONFIG = {
  columns: 2,
  rows: 3,
  gap: "10px",
  gridAreas: ["status status", "title btn", "progress progress"],

  mobileBreakpoint: 577,
  mobileColumns: 1,
  mobileRows: 4,
  mobileGap: "20px",
  mobileTemplateRows: "auto auto auto auto",
  mobileTemplateColumns: "",
  mobileGridAreas: ["status", "title", "btn", "progress"],
  widgets: [
    {
      area: "status",
    },
    {
      area: "title",
    },
    {
      area: "btn",
    },
    {
      area: "progress",
    },
  ],
};
