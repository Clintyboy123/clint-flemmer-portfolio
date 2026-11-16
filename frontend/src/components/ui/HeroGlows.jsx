// The animated brand-red light: three pools drifting slowly (keyframes in site.css), weighted to the left.
export default function HeroGlows() {
  return (
    <div className="hero__glows" aria-hidden="true">
      <span className="hero__glow hero__glow--1" />
      <span className="hero__glow hero__glow--2" />
      <span className="hero__glow hero__glow--3" />
    </div>
  );
}
