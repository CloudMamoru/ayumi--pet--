'use strict';

/**
 * Retrieves the value of a form field and validates it, removing or adding an error class.
 *
 * @function getFormValue
 * @param {Event} event - The form submission or input event, used to get the target form and field data.
 * @param {string} name - The name of the form field whose value is being retrieved.
 *
 * @returns {string} - The value of the form field if valid, or an empty string if the field is empty (with an error class added).
 *
 * @description This function retrieves the value of a form field specified by the `name` parameter.
 * It checks if the field has a value and adds an error class if it's empty.
 * If the field is empty, the `error` class is applied to the field, and a focus event
 * handler is added to remove the error class when the user interacts with the field.
 * If the field has a value, it is returned.
 */
function getFormValue(event, name) {
  const form = event.target;

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

function removeElementByIndex(arr, indexObj) {
  return arr.filter((_, index) => index !== indexObj);
}

function getNextElement(array, indexObj) {
  let arr = [...array];
  let idNextElement;
  let updatedArray;

  if (arr.length === 1 || arr.length == 0) {
    idNextElement = undefined;
    updatedArray = [];
  } else {
    const elementIndex = arr.findIndex((item) => item.id === indexObj);
    if (elementIndex === arr.length - 1) {
      idNextElement = arr[elementIndex - 1].id;
    } else {
      idNextElement = arr[elementIndex + 1].id;
    }
    updatedArray = removeElementByIndex(arr, elementIndex);
  }

  return { idNextElement, updatedArray };
}

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
function loadData(data, key) {
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
function saveData(data, key) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderInfo() {
  return `
  <main>
    <section>
      <h2>About project</h2>
      <p>
        <b>Ayumi</b> is a modern habit tracking tool created to help people achieve
        their goals and form healthy habits in a comfortable and motivating environment.
      </p>
      <p>  
        The main idea of ​​the project is to provide a simple and intuitive interface that
        makes the process of self-development easy and fun. Ayumi helps you focus on progress,
        analyze successes and notice how every small step leads to big changes.
      </p>
    </section>
    <section>
      <h2>Application functionality</h2>
      <ul>
        <li>Adding a new habit (in the left menu)</li>
        <li>Setting the number of days to achieve the goal</li>
        <li>Daily progress update with comments</li>
        <li>Tracking progress</li>
      </ul>
    </section>
        <section>
      <h2>Technologies used</h2>
      <ul>
        <li>JavaScript</li>
        <li>Rollup</li>
        <li>localStorage</li>
      </ul>
    </section>
  </main>`;
}

function renderBody({ activeHabit, page }) {
  if (!activeHabit) {
    page.main.habit.classList.add('habit-hidden');
    page.main.days.innerHTML = renderInfo();
    return;
  }

  page.main.habit.classList.remove('habit-hidden');
  page.main.days.innerHTML = '';

  for (const [index, day] of activeHabit.days.entries()) {
    const item = document.createElement('div');
    item.classList.add('habit');
    const tag = `<div class="habit__day">Day ${index + 1}</div>
                 <div class="habit__comment">${day.comment}</div>
                 <button class="habit__delete" onclick="deleteDay(event)">
                   <img src="images/garbage.svg" alt="garbage">
                 </button>
                 `;

    item.innerHTML = tag;
    page.main.days.appendChild(item);
  }
  page.main.addDay.innerText = `Day ${activeHabit.days.length + 1}`;
}

function renderHead({ activeHabit, page }) {
  if (!activeHabit) {
    page.header.h1.innerText = 'Welcome to Ayumi';
    page.header.progress.classList.add('progress-hidden');
    page.header.closeBtn.classList.add('header__close-btn-hidden');
    return;
  }

  page.header.closeBtn.classList.remove('header__close-btn-hidden');
  page.header.progress.classList.remove('progress-hidden');

  page.header.h1.innerText = activeHabit.name;
  const currentProgress = activeHabit.days.length / activeHabit.target;
  const progress = currentProgress > 1 ? 100 : 100 * currentProgress;

  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.setAttribute('style', `width:${progress}%;`);
}

function renderMenu({ habits, activeHabit, rerender, page }) {
  if (!activeHabit) {
    page.menu.innerHTML = '';
    return;
  }

  page.menu.innerHTML = '';

  for (const habit of habits) {
    const newItem = document.createElement('button');
    newItem.setAttribute('menu-habit-id', habit.id);
    newItem.classList.add('menu__item');
    newItem.addEventListener('click', () => rerender(habit.id));
    const newItemImg = `<img src="images/${habit.icon}.svg" alt="${habit.name}" class="menu__img">`;
    newItem.innerHTML = newItemImg;

    if (activeHabit.id === habit.id) {
      newItem.classList.add('menu__item_active');
    }

    page.menu.appendChild(newItem);

    continue;
  }
}

('use strict');

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
  console.log('state:');
  console.log(state);
  const hash = document.location.hash;
  const currentId = hash ? Number(hash.slice(1)) : 0;
  console.log(`hash: ${hash}`);
  console.log(`currentId: ${currentId}`);

  rerender(currentId);
})();
//# sourceMappingURL=main.js.map
