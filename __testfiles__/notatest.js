describe("true is truthy and false is falsy", () => {
  it("true is truthy", () => {
    expect(true).toBe(true);
  });

  it("false is falsy", () => {
    expect(false).toBe(false);
  });
});

function sum(x, y) {
  return x + y;
}

describe("sum", () => {
  it("sums up two values", () => {
    expect(sum(2, 4)).toBe(6);
  });
});
