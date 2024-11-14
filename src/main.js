'use strict'
import { loadData, saveData } from "./common/localeStorage";

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


// /* utils */
// function loadData(habits, key) {
//   const habitsString = localStorage.getItem(key);
//   const habitsArray = JSON.parse(habitsString);
//   if (Array.isArray(habitsArray)) {
//     habits.push(...habitsArray);
//   }
// } 

// function saveData(habits, key) {
//   localStorage.setItem(key, JSON.stringify(habits));
// } 

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
  if (!activeHabit) return

  document.location.replace(document.location.pathname + `#${activeHabitId}`)

  rerenderMenu(activeHabit); 
  rerenderHead(activeHabit);
  rerenderBody(activeHabit);
}

function getFormValue(event, name) {
  const form = event.target;

  // FormDataAPI (Without: event.target.comment.value; )
  const data = new FormData(event.target); 
  const comment = data.get(name);
  form[name].classList.remove('error');
  if (!comment) {
    form[name].classList.add('error')
    form[name].onfocus = function () { this.classList.remove('error') };
    return ''
  }

  return comment;
}

/* work with days */
function addDay(event) {
  event.preventDefault();
  const form = event.target;

  const comment = getFormValue(event, 'comment')
  
  if (comment) {
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
    saveData(habits, HABIT_KEY);
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
  saveData(habits, HABIT_KEY); 
}


function togglePopup() {
  const cover = document.querySelector('.cover');
  cover.classList.toggle('cover_hidden');
}

/* work with habits */
function setIcon(context, icon) {
  document.querySelector(`.popup__form input[name="icon"]`).value = icon;
  const activeIcon = document.querySelector('.icon.icon_active');
  activeIcon.classList.remove('icon_active');
  context.classList.add('icon_active')
}

function addHabit(event) {
  event.preventDefault();
  const form = event.target;

  const name = getFormValue(event, 'name');
  const target = Number(getFormValue(event, 'target'));
  const icon = getFormValue(event, 'icon')

  if (name && target && icon) {
    const id = habits[habits.length - 1].id + 1

    const newHabit = {
      id,
      icon,
      name,
      target,
      "days": []
    }

    habits = [...habits, newHabit]

    form['name'].value = '';
    form['target'].value = '';

    togglePopup()
    rerender(id)
    saveData(habits, HABIT_KEY)
  }
}

/* init */
(() => {
  loadData(habits, HABIT_KEY);
  const hash = document.location.hash
  const currentId = hash ? Number(hash.slice(1)) : 1

  rerender(currentId)
})()