export function silenceConsoleError() {
  let originalConsoleError = console.error;

  function mockConsoleError() {
    global.console = { ...global.console, error: jest.fn() };
  }

  function restoreConsoleError() {
    global.console = { ...global.console, error: originalConsoleError };
  }

  beforeAll(mockConsoleError);

  afterAll(mockConsoleError);

  return {
    mockConsoleError,
    restoreConsoleError
  };
}
