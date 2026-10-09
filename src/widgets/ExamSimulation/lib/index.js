export const EXAM_SIMULATIONS_DROPDOWNS = [
  {
    id: "subject",
    placeholder: "Выберите предмет",
    dropdownElements: [
      {
        value: "biology",
        label: "Биология",
      },
      {
        value: "literature",
        label: "Литература",
      },
      {
        value: "chemistry",
        label: "Химия",
      },
      {
        value: "maths",
        label: "Математика",
      },
      {
        value: "russian",
        label: "Русский язык",
      },
      {
        value: "english",
        label: "Английсский язык",
      },
      {
        value: "physics",
        label: "Физика",
      },
    ],
  },

  {
    id: "duration",
    placeholder: "Выберите время",
    dropdownElements: [
         {
        value: 15,
        label: "15 sec",
      },
      {
        value: 900,
        label: "15 минут",
      },
      {
        value: 1800,
        label: "30 минут",
      },
      {
        value: 2700,
        label: "45 минут",
      },
      {
        value: 3600,
        label: "1 час",
      },
    ],
  },
  {
    id: "difficulty",
    placeholder: "Выберите сложность",
    dropdownElements: [
      {
        value: "easy",
        label: "Легкая",
      },
      {
        value: "medium",
        label: "Средняя",
      },
      {
        value: "hard",
        label: "Сложная",
      },
    ],
  },
];
