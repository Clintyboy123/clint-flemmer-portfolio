import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSite } from './SiteContext';
import { reduceMotion } from '../utils/env';

// MUSIC: one <audio> for the whole visit. Because the site no longer reloads between pages, the track simply keeps
// playing while the visitor browses (the old site had to save and resume its position on every page).
//  · Every visit starts with the music on: it plays at once where the browser allows autoplay, otherwise on the
//    visitor's first click, tap or key press anywhere (a click on the music control itself is left to the control).
//  · It fades in/out over 0.9 s. A pause holds for the rest of the visit (and across a reload in the same tab).
//  · The volume slider position is remembered (localStorage); playback volume = position², which sounds even.
//  · settings.musicEnabled false = no music and no control; settings.musicTrack = the file to play.
const MusicContext = createContext(null);
const MKEY = 'clint-music';
const VKEY = 'clint-music-volume';
const DEFAULT_TRACK = '/audio/site-music.mp3';

const readJSON = (store, key) => {
  try {
    return JSON.parse(store.getItem(key));
  } catch {
    return null;
  }
};

export function MusicProvider({ children }) {
  const { settings, site } = useSite();
  const enabled = !!site && settings.musicEnabled !== false;
  const track = settings.musicTrack || DEFAULT_TRACK;

  const audioRef = useRef(null);
  const fadeRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [level, setLevelState] = useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(VKEY));
      if (v >= 0 && v <= 1) return v;
    } catch {
      /* storage blocked */
    }
    return 0.65;
  });
  const levelRef = useRef(level);
  levelRef.current = level;
  const playingRef = useRef(false);
  playingRef.current = playing;

  const save = useCallback((on) => {
    try {
      sessionStorage.setItem(MKEY, JSON.stringify({ on, t: audioRef.current?.currentTime || 0 }));
    } catch {
      /* storage blocked */
    }
  }, []);

  const fadeTo = useCallback((v, done) => {
    const a = audioRef.current;
    cancelAnimationFrame(fadeRef.current);
    const from = a.volume;
    const t0 = performance.now();
    const dur = reduceMotion ? 1 : 900;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      a.volume = from + (v - from) * k;
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return Promise.resolve();
    return a
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(levelRef.current ** 2);
        save(true);
      })
      .catch(() => setPlaying(false));
  }, [fadeTo, save]);

  const pause = useCallback(() => {
    setPlaying(false);
    save(false);
    fadeTo(0, () => audioRef.current?.pause());
  }, [fadeTo, save]);

  const toggle = useCallback(() => (playingRef.current ? pause() : play()), [pause, play]);

  const setLevel = useCallback((v) => {
    setLevelState(v);
    try {
      localStorage.setItem(VKEY, v);
    } catch {
      /* storage blocked */
    }
    if (playingRef.current && audioRef.current) {
      cancelAnimationFrame(fadeRef.current);
      audioRef.current.volume = v * v;
    }
  }, []);

  // create the one audio element once the settings say music is on
  useEffect(() => {
    if (!enabled) return;
    try {
      localStorage.removeItem('clint-music-off'); // tidy up the old "stay off" flag from earlier builds
    } catch {
      /* storage blocked */
    }
    const a = new Audio();
    a.loop = true;
    a.preload = 'metadata';
    a.volume = 0;
    a.addEventListener('error', () => setFailed(true), { once: true });
    a.src = track;
    audioRef.current = a;
    setFailed(false);

    const saved = readJSON(sessionStorage, MKEY);
    const want = saved ? saved.on : true;
    const onHide = () => playingRef.current && save(true);
    addEventListener('pagehide', onHide);
    const kickEvents = ['pointerdown', 'keydown', 'touchend'];
    const stopKick = () => kickEvents.forEach((ev) => removeEventListener(ev, kick, true));
    function kick(e) {
      if (playingRef.current) return stopKick();
      if (e.target.closest?.('.music')) return stopKick();
      stopKick();
      play();
    }
    if (want) {
      if (saved?.t)
        a.addEventListener('loadedmetadata', () => { if (isFinite(a.duration)) a.currentTime = saved.t % a.duration; }, { once: true });
      play();
      kickEvents.forEach((ev) => addEventListener(ev, kick, true));
    }
    return () => {
      stopKick();
      removeEventListener('pagehide', onHide);
      cancelAnimationFrame(fadeRef.current);
      a.pause();
      a.removeAttribute('src');
      a.load();
      audioRef.current = null;
      setPlaying(false);
    };
  }, [enabled, track, play, save]);

  const value = useMemo(
    () => ({ available: enabled && !failed, playing, level, toggle, setLevel }),
    [enabled, failed, playing, level, toggle, setLevel]
  );
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export const useMusic = () => useContext(MusicContext);
