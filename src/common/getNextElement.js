function removeElementByIndex(arr, indexObj) {
  return arr.filter((_, index) => index !== indexObj);
}

export function getNextElement(array, indexObj) {
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
