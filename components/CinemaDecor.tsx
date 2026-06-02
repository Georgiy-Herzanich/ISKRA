export default function CinemaDecor() {
  return (
    <>
      <div className="cinema-bg" aria-hidden="true">
        <div className="beam"></div>
        <div className="screen-wash"></div>
        <div className="rings rings-1">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="rings rings-2">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="mote mote-1"></div>
        <div className="mote mote-2"></div>
        <div className="mote mote-3"></div>
        <div className="mote mote-4"></div>
        <div className="mote mote-5"></div>
      </div>
      <div className="grain"></div>
      <div className="film">
        <div className="film-flicker"></div>
        <div className="film-glow"></div>
        <div className="film-dust"></div>
        <div className="film-scratch s1"></div>
        <div className="film-scratch s2"></div>
        <div className="film-scratch s3"></div>
      </div>
    </>
  );
}
