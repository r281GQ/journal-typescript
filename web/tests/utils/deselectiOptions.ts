import { fireEvent } from "@testing-library/react";

function selectOption(select: HTMLElement, option: HTMLOptionElement) {
  fireEvent.mouseOver(option);
  fireEvent.mouseMove(option);
  fireEvent.mouseDown(option);
  fireEvent.focus(option);
  fireEvent.mouseUp(option);
  fireEvent.click(option);

  option.selected = false;

  fireEvent.change(select);
}

export function deSelectOptions(
  element: HTMLSelectElement,
  values: string | string[]
) {
  const focusedElement = document.activeElement!;

  const wasAnotherElementFocused =
    focusedElement !== document.body && focusedElement !== element;

  if (wasAnotherElementFocused) {
    fireEvent.mouseMove(focusedElement);
    fireEvent.mouseLeave(focusedElement);
  }

  // clickElement(element, wasAnotherElementFocused && focusedElement);
  fireEvent.click(element);

  const valArray = Array.isArray(values) ? values : [values];

  const selectedOptions = Array.from(
    element.querySelectorAll("option")
  ).filter(opt => valArray.includes(opt.value));

  if (selectedOptions.length > 0) {
    if (element.multiple) {
      selectedOptions.forEach(option => selectOption(element, option));
    } else {
      selectOption(element, selectedOptions[0]);
    }
  }
}
