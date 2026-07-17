'use client'
import { IconPlayerPlay, IconPlayerPause, IconRewindBackward15, IconRewindForward15, IconLock } from '@tabler/icons-react'
import { usePodcastPlayer } from './podcast-player-provider'

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

// Persistent bottom-of-screen bar, only rendered once something has been
// played this session (nowPlaying !== null). Stays mounted across route
// changes since it lives above the page content in SiteChrome.
export function PodcastMiniPlayer() {
  const { nowPlaying, playing, current, duration, loading, locked, toggle, seek, skip } = usePodcastPlayer()
  if (!nowPlaying) return null

  const { episode, showTitle } = nowPlaying
  const progress = duration ? (current / duration) * 100 : 0

  return (
    <div className="podcastMiniPlayer">
      <div className="pmpInner container">
        <div className="pmpArt">{episode.coverUrl ? <img src={episode.coverUrl} alt="" /> : <div className="pmpArtFallback" />}</div>
        <div className="pmpMeta">
          <div className="pmpTitle">{episode.title}</div>
          <div className="pmpShow">{showTitle}</div>
        </div>

        {locked ? (
          <div className="pmpLocked"><IconLock size={16} stroke={1.75} /> Members only</div>
        ) : (
          <>
            <div className="pmpControls">
              <button type="button" aria-label="Back 15 seconds" onClick={() => skip(-15)} className="pmpIconBtn">
                <IconRewindBackward15 size={18} stroke={1.75} />
              </button>
              <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle} className="pmpPlayBtn" disabled={loading}>
                {loading ? <span className="pmpSpinner" /> : playing ? <IconPlayerPause size={20} stroke={1.75} /> : <IconPlayerPlay size={20} stroke={1.75} />}
              </button>
              <button type="button" aria-label="Forward 15 seconds" onClick={() => skip(15)} className="pmpIconBtn">
                <IconRewindForward15 size={18} stroke={1.75} />
              </button>
            </div>

            <div className="pmpScrub">
              <span className="pmpTime">{fmt(current)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={current}
                onChange={(e) => seek(Number(e.target.value))}
                aria-label="Seek"
              />
              <span className="pmpTime">{fmt(duration)}</span>
            </div>
          </>
        )}
      </div>

      <style>{`
        .podcastMiniPlayer {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
          background: rgba(252, 252, 251, 0.85);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-top: 1px solid var(--border);
          box-shadow: 0 -6px 24px rgba(0,0,0,0.06);
        }
        [data-theme="dark"] .podcastMiniPlayer {
          background: rgba(14, 14, 13, 0.85);
          box-shadow: 0 -6px 24px rgba(0,0,0,0.4);
        }
        .pmpInner { display: flex; align-items: center; gap: 14px; padding: 10px 24px; flex-wrap: wrap; }
        .pmpArt { width: 44px; height: 44px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: var(--surface-2); }
        .pmpArt img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pmpArtFallback { width: 100%; height: 100%; background: var(--surface-2); }
        .pmpMeta { min-width: 0; max-width: 220px; flex: 1 1 160px; }
        .pmpTitle { font-weight: 600; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pmpShow { font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pmpControls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .pmpIconBtn { width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent; color: var(--text); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .pmpIconBtn:hover { background: var(--surface-2); }
        .pmpPlayBtn { width: 38px; height: 38px; border-radius: 50%; border: none; background: var(--btn-bg); color: var(--btn-fg); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .pmpScrub { display: flex; align-items: center; gap: 8px; flex: 2 1 220px; min-width: 160px; }
        .pmpScrub input[type="range"] { flex: 1; accent-color: var(--accent); }
        .pmpTime { font-size: 0.72rem; color: var(--text-muted); width: 34px; flex-shrink: 0; }
        .pmpTime:last-child { text-align: right; }
        .pmpLocked { display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-muted); padding: 8px 12px; background: var(--surface-2); border-radius: 8px; }
        .pmpSpinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--btn-fg); border-top-color: transparent; animation: pmpSpin 0.7s linear infinite; }
        @keyframes pmpSpin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .pmpMeta { max-width: 120px; } .pmpScrub { flex-basis: 100%; order: 3; } }
      `}</style>
    </div>
  )
}