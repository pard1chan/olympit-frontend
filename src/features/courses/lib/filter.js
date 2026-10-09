export const getFilterOptions = (type) => {
  if (type === "all")
    return [
      {
        value: "all",
        label: "Все курсы",
        icon: "grid",
      },
      {
        value: "published",
        label: "Популярыне",
        icon: "play-circle",
      },
    ];
  else {
    return [
      {
        value: "all",
        label: "Все курсы",
        icon: "grid",
      },
      {
        value: "active",
        label: "В процессе",
        icon: "play-circle",
      },
      {
        value: "completed",
        label: "Завершенные",
        icon: "check-circle",
      },
      {
        value: "draft",
        label: "Не начатые",
        icon: "clock",
      },
    ];
  }
};
