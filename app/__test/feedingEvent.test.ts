import { isFeedingEvent } from "../feedingEvent.ts";

const makeTestData = (props: number[]): [number, number[]] => {
  const first = props.shift() as number;
  return [first, props];
};

const ASSERTIONS = {
  Basic: [
    {
      input: [4, 5, 10],
      expected: [true, 4.5],
    },
    {
      input: [652, 658, 655],
      expected: [true, 6],
    },
    {
      input: [11, 8, 15],
      expected: [false, 1.9],
    },
  ],
  Trends: [
    {
      input: [6, 10, 14, 17, 22, 24],
      expected: [false, 3.56],
    },
    {
      input: [3, 10, 14, 17, 20, 22],
      expected: [true, 7.04],
    },
  ],
  Negatives: [
    {
      input: [-4, 0, 2, 3, 5],
      expected: [true, 4.5],
    },
    {
      input: [-4, 1, 0],
      expected: [true, 5],
    },
    {
      input: [-4, 0, 1],
      expected: [true, 4.7],
    },
    {
      input: [-4, 5, 4],
      expected: [true, 9],
    },
    {
      input: [-3, -2, -2],
      expected: [false, 1],
    },
  ],
  "Double dipping": [
    {
      input: [8, 10, 30],
      expected: [true, 16],
    },
  ],
  "Ascending values": [
    {
      input: [10, 5, 0],
      expected: [false, 0],
    },
  ],
};

(Object.keys(ASSERTIONS) as (keyof typeof ASSERTIONS)[]).forEach((key) => {
  describe(`${key} (isFeedingEvent)`, () => {
    ASSERTIONS[key].forEach(({ input, expected }: any, index: number) => {
      test(`Test case #${index + 1} - [${input.join(", ")}]`, () => {
        const [isEvent, size] = isFeedingEvent(...makeTestData(input));
        expect(isEvent).toEqual(expected[0]);
        expect(size).toBeCloseTo(expected[1], 2);
      });
    });
  });
});
