import { render } from "@testing-library/react";

import CreateEntry from "../../pages/create_entry";

describe("<CreateEntry /> DOM inspection", () => {
  test("renders without crashing", () => {
    render(<CreateEntry />);
  });

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
});

export {};
