/**
 * Loads data from localStorage and appends it to the habits array.
 *
 * @function loadData
 * @param {Array} data - The array of habits to which data from localStorage will be added.
 * @param {string} key - The key used to retrieve data from localStorage.
 *
 * @description Retrieves a string from localStorage using the specified key,
 * parses it into an array, and appends the elements to the provided habits array.
 * If the data in localStorage is not an array, the function does not modify the habits array.
 */
export function loadData(data, key) {
  const stringData = localStorage.getItem(key);
  const arrayData = JSON.parse(stringData);
  if (Array.isArray(arrayData)) {
    data.push(...arrayData);
  }
}

/**
 * Saves the habits array data to localStorage.
 *
 * @function saveData
 * @param {Array} data - The array of habits to be saved to localStorage.
 * @param {string} key - The key under which the data will be stored in localStorage.
 *
 * @description Converts the habits array to a JSON string and saves it to localStorage
 * using the specified key.
 */
export function saveData(data, key) {
  localStorage.setItem(key, JSON.stringify(data));
}
