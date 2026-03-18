import { useState, useEffect } from 'react';

const STORAGE_KEY = 'travel-planner-trips';

const defaultTrips = [
  {
    id: '1',
    name: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    coverEmoji: '🗾',
    coverColor: 'from-pink-400 to-rose-600',
    description: 'Explore the vibrant streets, temples, and cuisine of Tokyo.',
    status: 'upcoming',
    budget: {
      total: 30000,
      spent: 8500,
      currency: 'NOK',
      categories: [
        { id: 'c1', name: 'Fly', icon: '✈️', allocated: 8000, spent: 8500 },
        { id: 'c2', name: 'Hotell', icon: '🏨', allocated: 10000, spent: 0 },
        { id: 'c3', name: 'Mat', icon: '🍜', allocated: 5000, spent: 0 },
        { id: 'c4', name: 'Aktiviteter', icon: '🎭', allocated: 4000, spent: 0 },
        { id: 'c5', name: 'Transport', icon: '🚇', allocated: 3000, spent: 0 },
      ]
    },
    itinerary: [
      {
        id: 'day1',
        date: '2026-04-10',
        activities: [
          { id: 'a1', time: '14:00', title: 'Ankomst Tokyo Narita', type: 'transport', notes: 'Tog til sentrum' },
          { id: 'a2', time: '18:00', title: 'Innsjekk hotell Shinjuku', type: 'accommodation', notes: '' },
          { id: 'a3', time: '20:00', title: 'Middag i Kabukicho', type: 'food', notes: 'Prøv ramen!' },
        ]
      },
      {
        id: 'day2',
        date: '2026-04-11',
        activities: [
          { id: 'a4', time: '09:00', title: 'Meiji Shrine', type: 'sightseeing', notes: 'Kommer tidlig' },
          { id: 'a5', time: '12:00', title: 'Harajuku & Takeshita Street', type: 'shopping', notes: '' },
          { id: 'a6', time: '15:00', title: 'Shibuya Crossing', type: 'sightseeing', notes: 'Foto!' },
        ]
      }
    ],
    packingList: [
      { id: 'p1', category: 'Klær', items: [
        { id: 'pi1', name: 'T-skjorter x5', packed: true },
        { id: 'pi2', name: 'Bukser x2', packed: true },
        { id: 'pi3', name: 'Jakke', packed: false },
        { id: 'pi4', name: 'Komfortable sko', packed: false },
      ]},
      { id: 'p2', category: 'Elektronikk', items: [
        { id: 'pi5', name: 'Kamera', packed: false },
        { id: 'pi6', name: 'Lader', packed: true },
        { id: 'pi7', name: 'Power bank', packed: false },
      ]},
      { id: 'p3', category: 'Dokumenter', items: [
        { id: 'pi8', name: 'Pass', packed: true },
        { id: 'pi9', name: 'Reiseforsikring', packed: true },
        { id: 'pi10', name: 'Valuta (JPY)', packed: false },
      ]},
    ]
  },
  {
    id: '2',
    name: 'Paris Romantikk',
    destination: 'Paris, Frankrike',
    startDate: '2026-06-14',
    endDate: '2026-06-21',
    coverEmoji: '🗼',
    coverColor: 'from-blue-400 to-indigo-600',
    description: 'En romantisk uke i lysets by.',
    status: 'upcoming',
    budget: {
      total: 20000,
      spent: 0,
      currency: 'NOK',
      categories: [
        { id: 'c1', name: 'Fly', icon: '✈️', allocated: 6000, spent: 0 },
        { id: 'c2', name: 'Hotell', icon: '🏨', allocated: 8000, spent: 0 },
        { id: 'c3', name: 'Mat', icon: '🥐', allocated: 3000, spent: 0 },
        { id: 'c4', name: 'Aktiviteter', icon: '🎨', allocated: 3000, spent: 0 },
      ]
    },
    itinerary: [],
    packingList: []
  }
];

export function useTrips() {
  const [trips, setTrips] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultTrips;
    } catch {
      return defaultTrips;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
      status: 'upcoming',
      itinerary: [],
      packingList: [],
      budget: {
        total: Number(trip.budget) || 0,
        spent: 0,
        currency: 'NOK',
        categories: []
      }
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip.id;
  };

  const updateTrip = (id, updates) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTrip = (id) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const addActivity = (tripId, dayId, activity) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const dayExists = t.itinerary.find(d => d.id === dayId);
      if (dayExists) {
        return {
          ...t,
          itinerary: t.itinerary.map(d =>
            d.id === dayId
              ? { ...d, activities: [...d.activities, { ...activity, id: Date.now().toString() }] }
              : d
          )
        };
      } else {
        return {
          ...t,
          itinerary: [...t.itinerary, {
            id: dayId,
            date: dayId,
            activities: [{ ...activity, id: Date.now().toString() }]
          }]
        };
      }
    }));
  };

  const removeActivity = (tripId, dayId, activityId) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        itinerary: t.itinerary.map(d =>
          d.id === dayId
            ? { ...d, activities: d.activities.filter(a => a.id !== activityId) }
            : d
        ).filter(d => d.activities.length > 0)
      };
    }));
  };

  const togglePackingItem = (tripId, categoryId, itemId) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingList: t.packingList.map(cat =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, packed: !item.packed } : item) }
            : cat
        )
      };
    }));
  };

  const addPackingItem = (tripId, categoryId, itemName) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const catExists = t.packingList.find(c => c.id === categoryId);
      if (catExists) {
        return {
          ...t,
          packingList: t.packingList.map(cat =>
            cat.id === categoryId
              ? { ...cat, items: [...cat.items, { id: Date.now().toString(), name: itemName, packed: false }] }
              : cat
          )
        };
      } else {
        return {
          ...t,
          packingList: [...t.packingList, {
            id: categoryId,
            category: categoryId,
            items: [{ id: Date.now().toString(), name: itemName, packed: false }]
          }]
        };
      }
    }));
  };

  const addPackingCategory = (tripId, categoryName) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingList: [...t.packingList, {
          id: Date.now().toString(),
          category: categoryName,
          items: []
        }]
      };
    }));
  };

  const removePackingItem = (tripId, categoryId, itemId) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingList: t.packingList.map(cat =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
            : cat
        )
      };
    }));
  };

  const addBudgetCategory = (tripId, category) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        budget: {
          ...t.budget,
          categories: [...t.budget.categories, { ...category, id: Date.now().toString(), spent: 0 }]
        }
      };
    }));
  };

  const addExpense = (tripId, categoryId, amount) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const newSpent = t.budget.categories.reduce((sum, c) => {
        if (c.id === categoryId) return sum + Number(amount);
        return sum + c.spent;
      }, 0);
      return {
        ...t,
        budget: {
          ...t.budget,
          spent: newSpent,
          categories: t.budget.categories.map(c =>
            c.id === categoryId ? { ...c, spent: c.spent + Number(amount) } : c
          )
        }
      };
    }));
  };

  return {
    trips,
    addTrip,
    updateTrip,
    deleteTrip,
    addActivity,
    removeActivity,
    togglePackingItem,
    addPackingItem,
    addPackingCategory,
    removePackingItem,
    addBudgetCategory,
    addExpense,
  };
}
