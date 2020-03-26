import { render, waitForDomChange, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { deSelectOptions } from "../utils/deselectiOptions";
import CreateEntry, {
  ERROR_MESSAGE_TITLE_REQUIRED,
  ERROR_MESSAGE_TITLE_MIN,
  ERROR_MESSAGE_TITLE_MAX,
  ERROR_MESSAGE_BODY_REQUIRED,
  ERROR_MESSAGE_TAGS_REQUIRED,
  ERROR_MESSAGE_TAGS_MAX
} from "../../pages/create_entry";

describe("<CreateEntry /> field level validation", () => {
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

  test("title error messages", async () => {
    const { getByLabelText, queryByText } = render(<CreateEntry />);

    const title = getByLabelText("title");

    let error_message_title_required = queryByText(
      ERROR_MESSAGE_TITLE_REQUIRED
    );

    let error_message_title_min = queryByText(ERROR_MESSAGE_TITLE_MIN);

    let error_message_title_max = queryByText(ERROR_MESSAGE_TITLE_MAX);

    expect(error_message_title_required).toBe(null);
    expect(error_message_title_min).toBe(null);
    expect(error_message_title_max).toBe(null);

    fireEvent.blur(title);

    await waitForDomChange();

    error_message_title_required = queryByText(ERROR_MESSAGE_TITLE_REQUIRED);

    expect(error_message_title_required).not.toBe(null);

    fireEvent.change(title, { target: { value: "sd" } });

    await waitForDomChange();

    error_message_title_required = queryByText(ERROR_MESSAGE_TITLE_REQUIRED);
    error_message_title_min = queryByText(ERROR_MESSAGE_TITLE_MIN);

    expect(error_message_title_required).toBe(null);
    expect(error_message_title_min).not.toBe(null);

    fireEvent.change(title, {
      target: {
        value: `slkdhhdsdf`
      }
    });

    await waitForDomChange();

    error_message_title_required = queryByText(ERROR_MESSAGE_TITLE_REQUIRED);
    error_message_title_min = queryByText(ERROR_MESSAGE_TITLE_MIN);
    error_message_title_max = queryByText(ERROR_MESSAGE_TITLE_MAX);

    expect(error_message_title_required).toBe(null);
    expect(error_message_title_min).toBe(null);
    expect(error_message_title_max).toBe(null);

    fireEvent.change(title, {
      target: {
        value: `
                slkdhhdsdf
                sdhsfjksdksjfhgjfghdsdfsdfsdfsdfsdfsdfsdgfuysdgfuysdgfuysdgfuysdgfuysdgfusd
                sdjfhsiudfgsidgfysdgfuysgdyfugsdyufgsudyfgsuydgfusd
                shdgfusdgfusgdyfgsdufgsdyfgsudfgusdfgsdfsdfsd
              `
      }
    });

    await waitForDomChange();

    error_message_title_required = queryByText(ERROR_MESSAGE_TITLE_REQUIRED);
    error_message_title_max = queryByText(ERROR_MESSAGE_TITLE_MAX);
    error_message_title_min = queryByText(ERROR_MESSAGE_TITLE_MIN);

    expect(error_message_title_required).toBe(null);
    expect(error_message_title_min).toBe(null);
    expect(error_message_title_max).not.toBe(null);
  });

  test("body error messages", async () => {
    const { getByLabelText, queryByText } = render(<CreateEntry />);

    const body = getByLabelText("body");

    let error_message_body_required = queryByText(ERROR_MESSAGE_BODY_REQUIRED);

    expect(error_message_body_required).toBe(null);

    fireEvent.blur(body);

    await waitForDomChange();

    error_message_body_required = queryByText(ERROR_MESSAGE_BODY_REQUIRED);

    expect(error_message_body_required).not.toBe(null);

    fireEvent.change(body, { target: { value: "sd" } });

    await waitForDomChange();

    error_message_body_required = queryByText(ERROR_MESSAGE_BODY_REQUIRED);

    expect(error_message_body_required).toBe(null);
  });

  test("tags error messages", async () => {
    const { getByLabelText, queryByText } = render(<CreateEntry />);

    const tags = getByLabelText("tags") as HTMLSelectElement;

    let error_message_tags_required = queryByText(ERROR_MESSAGE_TAGS_REQUIRED);
    let error_message_tags_max = queryByText(ERROR_MESSAGE_TAGS_MAX);

    expect(error_message_tags_required).toBe(null);
    expect(error_message_tags_max).toBe(null);

    fireEvent.blur(tags);

    await waitForDomChange();

    error_message_tags_required = queryByText(ERROR_MESSAGE_TAGS_REQUIRED);

    expect(error_message_tags_required).not.toBe(null);

    userEvent.selectOptions(tags, ["react"]);

    await waitForDomChange();

    error_message_tags_required = queryByText(ERROR_MESSAGE_TAGS_REQUIRED);

    expect(error_message_tags_required).toBe(null);

    deSelectOptions(tags, ["react"]);

    await waitForDomChange();

    error_message_tags_required = queryByText(ERROR_MESSAGE_TAGS_REQUIRED);

    expect(error_message_tags_required).not.toBe(null);

    userEvent.selectOptions(tags, ["react", "docker", "typescript", "graphql"]);

    await waitForDomChange();

    error_message_tags_required = queryByText(ERROR_MESSAGE_TAGS_REQUIRED);

    expect(error_message_tags_required).toBe(null);
    error_message_tags_max = queryByText(ERROR_MESSAGE_TAGS_MAX);

    expect(error_message_tags_max).not.toBe(null);

    deSelectOptions(tags, ["react"]);
    await waitForDomChange();

    error_message_tags_required = queryByText(ERROR_MESSAGE_TAGS_REQUIRED);

    expect(error_message_tags_required).toBe(null);
    error_message_tags_max = queryByText(ERROR_MESSAGE_TAGS_MAX);

    expect(error_message_tags_max).toBe(null);
  });
});

export {};
