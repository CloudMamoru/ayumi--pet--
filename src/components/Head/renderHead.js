export function renderHead({ activeHabit, page }) {
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
