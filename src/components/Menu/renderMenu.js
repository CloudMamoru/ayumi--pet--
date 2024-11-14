export function renderMenu({ habits, activeHabit, rerender, page }) {
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
