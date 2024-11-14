export function renderMenu({ habits, activeHabit, rerender, page }) {
  if (!activeHabit) return;

  for (const habit of habits) {
    const menuItem = document.querySelector(`[menu-habit-id="${habit.id}"`);

    if (!menuItem) {
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

    if (activeHabit.id === habit.id) {
      menuItem.classList.add('menu__item_active');
    } else {
      menuItem.classList.remove('menu__item_active');
    }
  }
}
