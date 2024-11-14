import { renderInfo } from './Info/renderInfo';

export function renderBody({ activeHabit, page }) {
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
