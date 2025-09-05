import { type Selector } from "./selector.ts";

type Nullable<T> = { [K in keyof T]?: T[K] | null };
type Merge<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
} & B;

export type StyleObject = Merge<
  Nullable<CSSStyleDeclaration>,
  {
    [key: string]: StyleObject | string | number | undefined | null;
  }
>;
export type StyleFnWithProps<Props = { [key: string]: string }> = (
  root: Selector,
  props: Props
) => StyleObject;
export type EitherStyleFn<Props> = StyleFn | StyleFnWithProps<Props>;

export type StyleFn = (root: Selector) => StyleObject;
