/* utils */
export function loadData(habits, key) {
  const habitsString = localStorage.getItem(key);
  const habitsArray = JSON.parse(habitsString);
  if (Array.isArray(habitsArray)) {
    habits.push(...habitsArray);
  }
} 

export function saveData(habits, key) {
  localStorage.setItem(key, JSON.stringify(habits));
} 