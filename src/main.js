'use strict';
import { getFormValue } from './common/getFormValue';
import { getNextElement } from './common/getNextElement';
import { loadData, saveData } from './common/localeStorage';
import { renderBody } from './components/Body/renderBody';
import { renderHead } from './components/Head/renderHead';
import { renderMenu } from './components/Menu/renderMenu';

/**
 * * Object containing references to DOM elements for easy access throughout the app.
 *
 * @property {Element} menu - Reference to the habit menu container.
 * @property {Object} header - References for header UI components.
 * @property {Element} header.h1 - Title element for the habit.
 * @property {Element} header.progressPercent - Element showing progress percentage.
 * @property {Element} header.progressCoverBar - Element displaying progress bar fill.
 * @property {Object} main - References for main content UI components.
 * @property {Element} main.days - Container for habit tracking days.
 * @property {Element} main.addDay - Button for adding new days to the habit.
 */

const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    h1: document.querySelector('.h1'),
    progress: document.querySelector('.progress'),
    closeBtn: document.querySelector('.header__close-btn'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
  main: {
    days: document.querySelector('.days'),
    addDay: document.querySelector('.habit__day-add'),
    habit: document.querySelector('.habit'),
  },
};

/**
 * * Global state object to manage application state and control rendering.
 *
 * @property {Array} habits - Array to store habit objects.
 * @property {string|undefined} globalActiveHabitId - ID of the currently active habit.
 * @property {Object|undefined} activeHabit - The currently active habit object.
 * @property {string} HABIT_KEY - Key used to store and retrieve habit data from localStorage.
 * @property {Function} rerender - Function to update and rerender UI based on the active habit.
 * @property {Object} page - References to DOM elements for UI components.
 */
let state = {
  habits: [],
  globalActiveHabitId: undefined,
  activeHabit: undefined,
  HABIT_KEY: 'HABIT_KEY',
  rerender: rerender,
  page: page,
};

/* rerender */
function rerender(activeHabitId) {
  if (state.habits.length === 0) {
    activeHabitId = undefined;
  }
  state.globalActiveHabitId = activeHabitId;
  state.activeHabit = state.habits.find((habit) => habit.id === activeHabitId);
  if (state.activeHabit) {
    document.location.replace(document.location.pathname + `#${activeHabitId}`);
  }

  renderMenu(state);
  renderHead(state);
  renderBody(state);
}

/* work with days */
function addDay(event) {
  event.preventDefault();
  const form = event.target;

  const comment = getFormValue(event, 'comment');

  if (comment) {
    state.habits = state.habits.map((habit) => {
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

/* show and hide popup for add new hide */
function togglePopup() {
  const cover = document.querySelector('.cover');
  cover.classList.toggle('cover_hidden');
}

/* work with habit form */
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
    let id;
    if (state.habits.length === 0) {
      id = 0;
    } else {
      id = state.habits[state.habits.length - 1].id + 1;
    }

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

/* Close habit */
function closeHabit() {
  const userAnswer = confirm('Are you sure you want to break the habit?');
  if (!userAnswer) return;

  const res = getNextElement(state.habits, state.globalActiveHabitId);

  state.habits = res.updatedArray;
  state.globalActiveHabitId = res.idNextElement;

  saveData(state.habits, state.HABIT_KEY);
  rerender(state.globalActiveHabitId);
}

/* init */
(() => {
  loadData(state.habits, state.HABIT_KEY);
  const hash = document.location.hash;
  const currentId = hash ? Number(hash.slice(1)) : 0;

  rerender(currentId);
})();
