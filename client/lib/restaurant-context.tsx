import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem, Restaurant } from "./types";
import { mockMenuItems, mockRestaurant } from "./mock-data";

interface RestaurantContextType {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  updateRestaurant: (restaurant: Partial<Restaurant>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

const STORAGE_KEY = "restaurant_data";

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurant);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { restaurant: storedRestaurant, menuItems: storedItems } = JSON.parse(stored);
        setRestaurant(storedRestaurant);
        setMenuItems(storedItems);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoaded(true);
  };

  const saveToStorage = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ restaurant, menuItems })
      );
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  const updateRestaurant = (updates: Partial<Restaurant>) => {
    const updated = { ...restaurant, ...updates };
    setRestaurant(updated);
    // Salvar imediatamente após atualizar
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ restaurant: updated, menuItems })
    );
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    setMenuItems(updated);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ restaurant, menuItems: updated })
    );
  };

  const addMenuItem = (item: MenuItem) => {
    const updated = [...menuItems, item];
    setMenuItems(updated);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ restaurant, menuItems: updated })
    );
  };

  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter((item) => item.id !== id);
    setMenuItems(updated);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ restaurant, menuItems: updated })
    );
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        menuItems,
        updateRestaurant,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        saveToStorage,
        loadFromStorage,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant deve ser usado dentro de RestaurantProvider");
  }
  return context;
}
