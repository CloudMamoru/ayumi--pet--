export function renderHead({ activeHabit, page }) {
  if (!activeHabit) return;

  page.header.h1.innerText = activeHabit.name;
  const currentProgress = activeHabit.days.length / activeHabit.target;
  const progress = currentProgress > 1 ? 100 : 100 * currentProgress;

  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.setAttribute('style', `width:${progress}%;`);
}
