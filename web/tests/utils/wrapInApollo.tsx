import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { render, RenderResult } from "@testing-library/react";

interface Options {
  mocks: MockedResponse[];
}

export const wrapInApollo = (
  Component: React.ReactElement,
  option?: Options
): RenderResult => {
  let opt: Options = {
    mocks: []
  };

  if (option) {
    opt = option;
  }

  return render(<MockedProvider mocks={opt.mocks}>{Component}</MockedProvider>);
};
