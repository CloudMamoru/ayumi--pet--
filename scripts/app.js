'use strict'

let habits = [];
const HABIT_KEY = 'HABIT_KEY';

/* page */
const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.h1'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar')
  }
}


/* utils */
function loadData() {
  const habitsString = localStorage.getItem(HABIT_KEY);
  const habitsArray = JSON.parse(habitsString);
  if (Array.isArray(habitsArray)) habits = habitsArray;
} 

function saveData() {
  localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
} 

/* render */
function rerenderMenu(activeHabit) {
  if (!activeHabit) return 

  for (const habit of habits) {
    const menuItem = document.querySelector(`[menu-habit-id="${habit.id}"`)
    
    if (!menuItem) {
      // Create
      const newItem = document.createElement('button');
      newItem.setAttribute('menu-habit-id', habit.id);
      newItem.classList.add('menu__item');
      newItem.addEventListener('click', () => rerender(habit.id))
      const newItemImg = `<img src="images/${habit.icon}.svg" alt="${habit.name}" class="menu__img">`;
      newItem.innerHTML = newItemImg;

      if (activeHabit.id === habit.id) {
        newItem.classList.add('menu__item_active');
      }
      
      page.menu.appendChild(newItem);

      continue;
    }

    if (activeHabit.id === habit.id) {
      menuItem.classList.add('menu__item_active');
    } else {
      menuItem.classList.remove('menu__item_active');
    } 
  }

}

function rerenderHead(activeHabit) {
  if (!activeHabit) return

  page.header.h1.innerText = activeHabit.name;
  const currentProgress = activeHabit.days.length / activeHabit.target;
  const progress = currentProgress > 1 ? 100 : 100 * currentProgress;
  
  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.setAttribute('style', `width:${progress}%;`)
  
}


function rerender(activeHabitId) {
  const activeHabit = habits.find(habit => habit.id === activeHabitId);
  rerenderMenu(activeHabit);
  rerenderHead(activeHabit);
}


/* init */
(() => {
  loadData();

  rerender(1)
})()