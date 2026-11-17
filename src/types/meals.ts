import type { Passenger } from "./booking";

export interface MealOption {
  id: string;
  name: string;
  description: string;
  price: number;
  dietaryTag: string;
}

export interface PassengerMealCostItem {
  passenger: Passenger;
  meal: MealOption | null;
  price: number;
}
