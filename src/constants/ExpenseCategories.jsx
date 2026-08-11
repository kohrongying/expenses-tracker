import { Utensils, ShoppingCart, Car, Clapperboard, ShoppingBag } from "lucide-react";
import Colors from "./Colors";

export const categories = [
  { value: "Food", label: "Food", color: Colors.blue, icon: Utensils },
  { value: "Groceries", label: "Groceries", color: Colors.orange, icon: ShoppingCart },
  { value: "Transport", label: "Transport", color: Colors.aqua, icon: Car },
  { value: "Movie", label: "Movie", color: Colors.yellow, icon: Clapperboard },
  { value: "Other", label: "Other", color: Colors.magenta, icon: ShoppingBag },
];

export function findCategory(value) {
  return categories.find((category) => category.value.toLowerCase() === (value || "").toLowerCase());
}
