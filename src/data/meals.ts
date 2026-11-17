import type { MealOption } from "../types/meals";

export const MEAL_OPTIONS: MealOption[] = [
  {
    id: "classic-veg",
    name: "Classic Veg Thali",
    description:
      "Seasonal vegetable curry, steamed basmati rice, dal, and chapati",
    price: 0,
    dietaryTag: "Complimentary · Veg",
  },
  {
    id: "asian-bowl",
    name: "Asian Stir-Fry Bowl",
    description: "Tofu and broccoli in ginger-soy glaze over jasmine rice",
    price: 250,
    dietaryTag: "Vegan",
  },
  {
    id: "paneer-wrap",
    name: "Smoked Paneer Tikka Wrap",
    description:
      "Chargrilled cottage cheese, mint chutney, and multigrain tortilla",
    price: 350,
    dietaryTag: "Chef Special · Veg",
  },
  {
    id: "fruit-platter",
    name: "Fresh Fruit & Nut Platter",
    description: "Cut seasonal fruits, roasted almonds, and chilled yogurt",
    price: 200,
    dietaryTag: "Light · Gluten-Free",
  },
];

export const MEALS_BY_ID: Record<string, MealOption> = Object.fromEntries(
  MEAL_OPTIONS.map((meal) => [meal.id, meal]),
);
