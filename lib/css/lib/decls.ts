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
export type InputStyles = (root: StyleSelector) => StyleObject;
export type DynamicInputStyles<Props> = (props: Props) => InputStyles;

export type DynamicStyleHtmlPropsUnfurler<Props extends {}> = {
  (props: Props): StyleHtmlProps;
  selector: StyleSelector;
};

/*
Selectors
*/
export type StyleSelector = string & {
  (child: string): string;
  toString(): string;
  __isSelector: boolean;
};
export type StyleHtmlProps = {
  class: string;
  style: StyleObject;
};

type BaseStyleProp = StyleHtmlProps | StyleSelector;
export type StyleProp = BaseStyleProp | BaseStyleProp[];
