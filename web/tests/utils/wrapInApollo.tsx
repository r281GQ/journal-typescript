import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { render, RenderResult } from "@testing-library/react";

interface Option {
  mocks: MockedResponse[];
}

export const wrapInApollo = (
  Component: React.ReactElement,
  option?: Option
): RenderResult => {
  let opt: Option = {
    mocks: []
  };

  if (option) {
    opt = option;
  }

  return render(<MockedProvider mocks={opt.mocks}>{Component}</MockedProvider>);
};
