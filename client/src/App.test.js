import { render, fireEvent, screen, within } from "@testing-library/react";
import App from "./App";

// lab12 test
test("test AutoComplete selection", () => {
  render(<App />);
  const autocomplete = screen.getByTestId("autocomplete");
  const input = within(autocomplete).getByLabelText("click to pick word");
  fireEvent.click(input); // sets focus
  fireEvent.change(input, { target: { value: "Here" } });
  fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(autocomplete, { key: "Enter" });
  expect(screen.getByText("Here")).toBeInTheDocument();
  // this just shows what the test sees, comment it out if there are no problems
  // screen.debug();
});