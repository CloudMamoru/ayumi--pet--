'use strict'

/* state */
let habits = [];
const HABIT_KEY = 'HABIT_KEY';
let globalActiveHabitId;

/* page */
const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.h1'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar')
  },
  main: {
    days: document.querySelector('.days'),
    addDay: document.querySelector('.habit__day-add')
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

function rerenderBody(activeHabit) {
  if (!activeHabit) return 
  page.main.days.innerHTML = '';

  for (const [index, day] of activeHabit.days.entries()) {
    const item = document.createElement('div');
    item.classList.add('habit');
    const tag = `<div class="habit__day">Day ${index + 1}</div>
                 <div class="habit__comment">${day.comment}</div>
                 <button class="habit__delete" onclick="deleteDay(event)">
                   <img src="images/garbage.svg" alt="garbage">
                 </button>
                 `

    item.innerHTML = tag;
    page.main.days.appendChild(item);
  }
  page.main.addDay.innerText = `Day ${activeHabit.days.length + 1}`;
}


function rerender(activeHabitId) {
  globalActiveHabitId = activeHabitId;

  const activeHabit = habits.find(habit => habit.id === activeHabitId);
  rerenderMenu(activeHabit);
  rerenderHead(activeHabit);
  rerenderBody(activeHabit);
}

/* add days */
function addDay(event) {
  event.preventDefault();
  const form = event.target;

  // FormDataAPI (Without: event.target.comment.value; )
  const data = new FormData(event.target); 
  const comment = data.get('comment');
  form['comment'].classList.remove('error');
  if (!comment) {
    form['comment'].classList.add('error')
    form['comment'].onfocus = function () { this.classList.remove('error') };
  } else {
    habits = habits.map(habit => {
      if (habit.id === globalActiveHabitId) {
        return {
          ...habit,
          days: [...habit.days, { comment }]
        }
      } else {
        return habit
      }
    })
    form['comment'].value = ''; 
    rerender(globalActiveHabitId);
    saveData();
  }
}

function deleteDay(event) {
  const habit = event.target.closest('.habit');
  const dayNumber = habit.querySelector('.habit__day').innerText.slice(4);

  habits = habits.map(habit => {
    if (habit.id === globalActiveHabitId) {
        habit.days.splice(dayNumber - 1, 1)
        return {
          ...habit,
          days: habit.days
        }
      } else {
        return habit
      }
  })

  rerender(globalActiveHabitId);
  saveData(); 
}

/* init */
(() => {
  loadData();

  rerender(1)
})()