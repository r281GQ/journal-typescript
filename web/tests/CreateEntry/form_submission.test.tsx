import { render, waitForDomChange, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CreateEntry from "../../pages/create_entry";

describe("<CreateEntry /> form submission", () => {
  test("has all the required fields for the process", () => {
    const { queryByLabelText, queryByText } = render(<CreateEntry />);

    const title = queryByLabelText("title");
    const body = queryByLabelText("body");
    const tags = queryByLabelText("tags");
    const submitButton = queryByText("submit");
    const cancelButton = queryByText("cancel");

    expect(title).not.toBe(null);
    expect(body).not.toBe(null);
    expect(tags).not.toBe(null);
    expect(submitButton).not.toBe(null);
    expect(cancelButton).not.toBe(null);
  });

  test("successful submission redirects to home", () => {});
  test("submission error shows up", () => {});
  test("cancellation redirects to home", () => {});
});
