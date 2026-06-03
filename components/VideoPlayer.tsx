'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';

type Props = { src: string; label: string };

function fmt(t: number) {
  if (!isFinite(t) || t <= 0) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function VideoPlayer({ src, label }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);

  // Show native controls only while fullscreen (so there's a visible
  // navigation + exit button); restore our custom bar when leaving.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    function sync() {
      const fsEl =
        document.fullscreenElement ||
        (document as Document & { webkitFullscreenElement?: Element })
          .webkitFullscreenElement;
      v!.controls = fsEl === v;
    }
    const onBegin = () => {
      v.controls = true;
    };
    const onEnd = () => {
      v.controls = false;
    };
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    v.addEventListener('webkitbeginfullscreen', onBegin);
    v.addEventListener('webkitendfullscreen', onEnd);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
      v.removeEventListener('webkitbeginfullscreen', onBegin);
      v.removeEventListener('webkitendfullscreen', onEnd);
    };
  }, []);

  function onTime() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrent(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
  }

  function onSeek(e: ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Number(e.target.value);
    v.currentTime = (pct / 100) * v.duration;
    setProgress(pct);
  }

  function goFullscreen() {
    const v = videoRef.current as
      | (HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
          webkitRequestFullscreen?: () => void;
        })
      | null;
    if (!v) return;
    // Enable native controls up front so the fullscreen view always has a
    // visible navigation bar and an exit control.
    v.controls = true;
    if (v.requestFullscreen) void v.requestFullscreen();
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  }

  return (
    <div className="s-visual s-player">
      <video
        ref={videoRef}
        className="v-media"
        src={src}
        aria-label={label}
        preload="metadata"
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={onTime}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
      />

      {!playing && (
        <button
          type="button"
          className="vp-big"
          onClick={togglePlay}
          aria-label={label}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      <div className="vp-bar">
        <button
          type="button"
          className="vp-btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <span className="vp-time">{fmt(current)}</span>

        <input
          className="vp-range"
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={onSeek}
          aria-label="Seek"
        />

        <span className="vp-time">{fmt(duration)}</span>

        <button
          type="button"
          className="vp-btn"
          onClick={goFullscreen}
          aria-label="Fullscreen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
