const roles = [
  "دانش آموز",
  "توسعه دهنده",
  "طراحی و ادیت",
  "مدیر محصول",
  "بازاریابی و فروش",
  "کارآفرین",
  "فریلنسر",
  "مدرس , معلم",
  "سایر",
];

const widgetCategories = [
  { id: "tasks", label: "فعالیت ها" , index: 1 , image:" "},
  { id: "notes", label: "نوشته ها" , index: 2 , image: "🖊"},
  { id: "streak", label: "تداوم" , index: 3 , image: "↗"},
  { id: "weather", label: "محیط", index: 4 , image: "☀"},
  { id: "flashcard", label: "کارت مرور", index: 5 , image:"🧠" },
];
const defaultWidgetOrder = ["tasks", "notes", "streak", "weather" , "flashcard"];

const weekDays = [
  { key: 6, short: "ش", label: "شنبه" },
  { key: 0, short: "ی", label: "یکشنبه" },
  { key: 1, short: "د", label: "دوشنبه" },
  { key: 2, short: "س", label: "سه‌شنبه" },
  { key: 3, short: "چ", label: "چهارشنبه" },
  { key: 4, short: "پ", label: "پنجشنبه" },
  { key: 5, short: "ج", label: "جمعه" },
];

const recommendedLocations = [
  {
    id: "tehran",
    name: "تهران",
    latitude: 35.6892,
    longitude: 51.389,
    admin1: "استان تهران",
    country: "ایران",
  },
  {
    id: "mashhad",
    name: "مشهد",
    latitude: 36.2972,
    longitude: 59.6067,
    admin1: "استان خراسان رضوی",
    country: "ایران",
  },
  {
    id: "isfahan",
    name: "اصفهان",
    latitude: 32.6546,
    longitude: 51.668,
    admin1: "استان اصفهان",
    country: "ایران",
  },
  {
    id: "shiraz",
    name: "شیراز",
    latitude: 29.5918,
    longitude: 52.5837,
    admin1: "استان فارس",
    country: "ایران",
  },
  {
    id: "tabriz",
    name: "تبریز",
    latitude: 38.0962,
    longitude: 46.2738,
    admin1: "استان آذربایجان شرقی",
    country: "ایران",
  },
];

const widgetOrderByRole = {
  "دانش آموز": ["tasks", "streak", "notes", "weather", "flashcard"],
  "توسعه دهنده": ["tasks", "notes", "streak", "weather", "flashcard"],
  "طراحی و ادیت": ["notes", "tasks", "streak", "weather", "flashcard"],
  "مدیر محصول": ["tasks", "notes", "streak", "weather", "flashcard"],
  "بازاریابی و فروش": ["tasks", "notes", "weather", "streak", "flashcard"],
  "کارآفرین": ["tasks", "streak", "notes", "weather", "flashcard"],
  "فریلنسر": ["notes", "tasks", "streak", "weather", "flashcard"],
  "مدرس , معلم": ["notes", "tasks", "streak", "weather", "flashcard"],
  "سایر": defaultWidgetOrder,
};


export {
  defaultWidgetOrder,
  widgetCategories,
  roles,
  weekDays,
  recommendedLocations,
  widgetOrderByRole,
};
