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
export function getFormValue(event, name) {
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
