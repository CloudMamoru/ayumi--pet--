'use strict';
import { loadData, saveData } from './common/localeStorage';
import { renderBody } from './common/renderBody';
import { renderHead } from './common/renderHead';
import { renderMenu } from './common/renderMenu';

/* rerender */
function rerender(activeHabitId) {
  state.globalActiveHabitId = activeHabitId;
  state.activeHabit = state.habits.find((habit) => habit.id === activeHabitId);
  if (!state.activeHabit) return;

  document.location.replace(document.location.pathname + `#${activeHabitId}`);

  renderMenu(state);
  renderHead(state);
  renderBody(state);
}

/* page */
const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.h1'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
  main: {
    days: document.querySelector('.days'),
    addDay: document.querySelector('.habit__day-add'),
  },
};

/* state */
let state = {
  habits: [],
  globalActiveHabitId: undefined,
  activeHabit: undefined,
  HABIT_KEY: 'HABIT_KEY',
  rerender: rerender,
  page: page,
};

function getFormValue(event, name) {
  const form = event.target;

  // FormDataAPI (Without: event.target.comment.value; )
  const data = new FormData(event.target);
  const comment = data.get(name);
  form[name].classList.remove('error');
  if (!comment) {
    form[name].classList.add('error');
    form[name].onfocus = function () {
      this.classList.remove('error');
    };
    return '';
  }

  return comment;
}

/* work with days */
function addDay(event) {
  console.log('addDay');
  event.preventDefault();
  const form = event.target;

  const comment = getFormValue(event, 'comment');

  if (comment) {
    habits = state.habits.map((habit) => {
      if (habit.id === state.globalActiveHabitId) {
        return {
          ...habit,
          days: [...habit.days, { comment }],
        };
      } else {
        return habit;
      }
    });
    form['comment'].value = '';
    rerender(state.globalActiveHabitId);
    saveData(state.habits, state.HABIT_KEY);
  }
}

function deleteDay(event) {
  const habit = event.target.closest('.habit');
  const dayNumber = habit.querySelector('.habit__day').innerText.slice(4);

  state.habits = state.habits.map((habit) => {
    if (habit.id === state.globalActiveHabitId) {
      habit.days.splice(dayNumber - 1, 1);
      return {
        ...habit,
        days: habit.days,
      };
    } else {
      return habit;
    }
  });

  rerender(state.globalActiveHabitId);
  saveData(state.habits, state.HABIT_KEY);
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
  context.classList.add('icon_active');
}

function addHabit(event) {
  event.preventDefault();
  const form = event.target;

  const name = getFormValue(event, 'name');
  const target = Number(getFormValue(event, 'target'));
  const icon = getFormValue(event, 'icon');

  if (name && target && icon) {
    const id = state.habits[state.habits.length - 1].id + 1;

    const newHabit = {
      id,
      icon,
      name,
      target,
      days: [],
    };

    state.habits = [...state.habits, newHabit];

    form['name'].value = '';
    form['target'].value = '';

    togglePopup();
    rerender(id);
    saveData(state.habits, state.HABIT_KEY);
  }
}

/* init */
(() => {
  loadData(state.habits, state.HABIT_KEY);
  const hash = document.location.hash;
  const currentId = hash ? Number(hash.slice(1)) : 1;

  rerender(currentId);
})();
