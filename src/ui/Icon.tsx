import { px, withDynamicStyles, withStyles } from "lib/css/css.ts";

const Icon = ({ icon, tint }: { icon: string; tint?: string }) => {
  const iconUrl = `/static/${icon}.gif`;
  if (tint) {
    return <div {...tintedClassName({ icon: `url(${iconUrl})`, tint })} />;
  }
  return <img src={iconUrl} alt="" class={className} />;
};

const className = withStyles(() => ({
  display: "inline-block",
  verticalAlign: "middle",
}));

const tintedClassName = withDynamicStyles<{ icon: string; tint: string }>(
  ({ icon, tint }) =>
    () => ({
      width: px(16),
      height: px(16),
      maskImage: icon,
      display: "block",
      background: tint,
    })
);

export { Icon };
