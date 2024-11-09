'use strict'

let habits = [];
const HABIT_KEY = 'HABIT_KEY';


/* utils */
function loadData() {
  const habitsString = localStorage.getItem(HABIT_KEY);
  const habitsArray = JSON.parse(habitsString);
  if (Array.isArray(habitsArray)) habits = habitsArray;
} 

function saveData() {
  localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
} 

/* Init data */
(() => {
  loadData();
})()