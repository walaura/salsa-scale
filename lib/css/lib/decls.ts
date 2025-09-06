import { type Selector } from "./selector.ts";
import type * as CSS from "csstype";

type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

export type StyleObject = Merge<
  {
    [key: string]: StyleObject | string | number | undefined | null;
  },
  CSS.Properties<string | number>
>;

export type DynamicStyleFn<Props> = (props: Props) => StyleFn;

export type StyleFn = (root: Selector) => StyleObject;
