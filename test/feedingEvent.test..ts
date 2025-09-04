// Simple test for isFeedingEvent function

import { isFeedingEvent } from "../app/feedingEvent.ts";
import { LogEntry } from "../app/setup/db.ts";

const makeTestData = (
  ...props: [number, number, number]
): [number, [LogEntry, LogEntry]] => {
  const [current, prev, prevToLast] = props;
  return [
    current,
    [
      { weight: prev, timestamp: Date.now() },
      { weight: prevToLast, timestamp: Date.now() - 1000 },
    ],
  ];
};

const ASSERTIONS = [
  {
    input: [4, 5, 10],
    expected: [true, 6],
  },
  {
    input: [11, 8, 15],
    expected: [true, 4],
  },
  {
    input: [9, 10, 14],
    expected: [true, 5],
  },
  // negative units
  {
    input: [-1, 0, 5],
    expected: [true, 6],
  },
  {
    input: [-4, 1, 0],
    expected: [true, 5],
  },
  {
    input: [-4, 0, 1],
    expected: [true, 5],
  },
  // double dipping works
  {
    input: [8, 10, 30],
    expected: [true, 22],
  },
  //ascending values
  {
    input: [10, 5, 0],
    expected: [false, 0],
  },
];

describe("isFeedingEvent", () => {
  ASSERTIONS.forEach(({ input, expected }, index) => {
    test(`Test case #${index + 1} - [${input.join(", ")}]`, () => {
      const result = isFeedingEvent(
        ...makeTestData(...(input as [number, number, number]))
      );
      expect(result).toEqual(expected);
    });
  });
});
