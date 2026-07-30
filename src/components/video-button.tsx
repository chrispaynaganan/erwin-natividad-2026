'use client';

import { useState } from 'react';
import styles from './video-button.module.css';

type VideoButtonProps = {
  /** Just the YouTube video ID, e.g. "dQw4w9WgXcQ" — not the full URL */
  videoId: string;
  /** Used for the accessible label and iframe title */
  title: string;
  /** Optional override if you'd rather use your own custom thumbnail image */
  poster?: string;
};

export default function VideoButton({ videoId, title, poster }: VideoButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(
    poster ?? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  );

  if (playing) {
    return (
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.facade}
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
    >
      {/* Plain <img>, not next/image — avoids adding img.youtube.com to next.config
          remotePatterns just for a facade thumbnail. loading="lazy" keeps it cheap
          until it scrolls into view. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbSrc}
        alt=""
        className={styles.thumbnail}
        loading="lazy"
        onError={() => {
          // maxresdefault.jpg doesn't exist for every video — fall back once
          if (!thumbSrc.includes('hqdefault')) {
            setThumbSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
          }
        }}
      />
      <span className={styles.playIcon}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
        </svg>
      </span>
    </button>
  );
}