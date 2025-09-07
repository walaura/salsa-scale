import { type BasicStyleSelector } from "./selector.ts";
import type * as CSS from "csstype";

type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

export type ResolvedStyleObject = Merge<
  {
    [key: string]: ResolvedStyleObject | string | number | undefined | null;
  },
  CSS.Properties<string | number>
>;
export type StyleFn = (root: BasicStyleSelector) => ResolvedStyleObject;

export type ResolvedDynamicStyleSelector = {
  class: string;
  style: ResolvedStyleObject;
};
export type DynamicStyleSelector<Props extends {}> = {
  (props: Props): ResolvedDynamicStyleSelector;
  selector: BasicStyleSelector;
};
export type DynamicStyleFn<Props> = (props: Props) => StyleFn;

export type StyleSelector = ResolvedDynamicStyleSelector | BasicStyleSelector;
export type StyleSelectors = StyleSelector | StyleSelector[];
