import React from "react";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react-native";

import App from "../__testfiles__/App";

describe("<App />", () => {
  // it("has 1 child", () => {
  //   const tree = renderer.create(<App />).toJSON();
  //   expect(tree.children.length).toBe(1);
  // });

  it("renders correctly", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("App", () => {
  it("renders App component", () => {
    render(<App />);

    screen.debug();
  });

  it("renders App component", () => {
    render(<App />);

    screen.getByRole("button");

    expect(screen.getByText("App, hehe")).toBeTruthy();
  });
});
