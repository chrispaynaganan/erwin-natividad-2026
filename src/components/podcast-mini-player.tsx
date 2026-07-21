'use client'
import { useRouter, usePathname } from 'next/navigation'
import { IconPlayerPlay, IconPlayerPause, IconPlayerTrackPrev, IconPlayerTrackNext, IconLock, IconChevronUp, IconX } from '@tabler/icons-react'
import { usePodcastPlayer } from './podcast-player-provider'

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export function PodcastMiniPlayer() {
  const { nowPlaying, playing, current, duration, loading, locked, hasNext, hasPrev, toggle, seek, next, prev, close } = usePodcastPlayer()
  const router = useRouter()
  const pathname = usePathname()
  if (!nowPlaying) return null

  const { episode, showTitle, showSlug } = nowPlaying
  const showPath = `/podcasts/${showSlug}`
  const onShowPage = pathname === showPath
  const progress = duration ? (current / duration) * 100 : 0
  const enlarge = () => router.push(showPath)

  if (!onShowPage) {
    // Floating, minimized pill — shown everywhere except the episode's own show page.
    return (
      <div className="podcastMiniPlayer minimized">
        <div className="pmpArt">{episode.coverUrl ? <img src={episode.coverUrl} alt="" /> : <div className="pmpArtFallback" />}</div>

        <div className="pmpTitleOnly">{episode.title}</div>

        {locked ? (
          <div className="pmpLocked"><IconLock size={15} stroke={1.75} /></div>
        ) : (
          <div className="pmpMinControls">
            <button type="button" aria-label="Previous episode" onClick={prev} disabled={!hasPrev} className="pmpIconBtn">
              <IconPlayerTrackPrev size={16} stroke={1.75} />
            </button>
            <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle} className="pmpPlayBtn" disabled={loading}>
              {loading ? <span className="pmpSpinner" /> : playing ? <IconPlayerPause size={18} stroke={1.75} /> : <IconPlayerPlay size={18} stroke={1.75} />}
            </button>
            <button type="button" aria-label="Next episode" onClick={next} disabled={!hasNext} className="pmpIconBtn">
              <IconPlayerTrackNext size={16} stroke={1.75} />
            </button>
          </div>
        )}

        <button type="button" aria-label="Back to show" onClick={enlarge} className="pmpIconBtn">
          <IconChevronUp size={18} stroke={1.75} />
        </button>
        <button type="button" aria-label="Close player" onClick={close} className="pmpIconBtn">
          <IconX size={18} stroke={1.75} />
        </button>

        <div className="pmpMiniProgress" style={{ width: `${progress}%` }} />

        <style>{sharedStyles}</style>
      </div>
    )
  }

  // Full-size player — shown while on the episode's own show page.
  return (
    <div className="podcastMiniPlayer expanded">
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
              <button type="button" aria-label="Previous episode" onClick={prev} disabled={!hasPrev} className="pmpIconBtn">
                <IconPlayerTrackPrev size={18} stroke={1.75} />
              </button>
              <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle} className="pmpPlayBtn" disabled={loading}>
                {loading ? <span className="pmpSpinner" /> : playing ? <IconPlayerPause size={20} stroke={1.75} /> : <IconPlayerPlay size={20} stroke={1.75} />}
              </button>
              <button type="button" aria-label="Next episode" onClick={next} disabled={!hasNext} className="pmpIconBtn">
                <IconPlayerTrackNext size={18} stroke={1.75} />
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

        <button type="button" aria-label="Close player" onClick={close} className="pmpIconBtn pmpClose">
          <IconX size={18} stroke={1.75} />
        </button>
      </div>

      <style>{sharedStyles}</style>
    </div>
  )
}

const sharedStyles = `
  .podcastMiniPlayer { position: fixed; z-index: 60; }

  /* Expanded — full-width bar, shown on the show page */
  .podcastMiniPlayer.expanded {
    left: 0; right: 0; bottom: 0;
    background: rgba(252, 252, 251, 0.85);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-top: 1px solid var(--border);
    box-shadow: 0 -6px 24px rgba(0,0,0,0.06);
  }
  [data-theme="dark"] .podcastMiniPlayer.expanded {
    background: rgba(14, 14, 13, 0.85);
    box-shadow: 0 -6px 24px rgba(0,0,0,0.4);
  }
  .pmpInner { display: flex; align-items: center; gap: 14px; padding: 10px 24px; flex-wrap: wrap; }
  .pmpMeta { min-width: 0; max-width: 220px; flex: 1 1 160px; }
  .pmpTitle { font-weight: 600; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pmpShow { font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pmpControls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .pmpScrub { display: flex; align-items: center; gap: 8px; flex: 2 1 220px; min-width: 160px; }
  .pmpScrub input[type="range"] { flex: 1; accent-color: var(--accent); }
  .pmpTime { font-size: 0.72rem; color: var(--text-muted); width: 34px; flex-shrink: 0; }
  .pmpTime:last-child { text-align: right; }
  .pmpClose { margin-left: auto; }

  /* Minimized — floating pill, shown everywhere else */
  .podcastMiniPlayer.minimized {
    left: 16px; right: 16px; bottom: 16px;
    background: rgba(252, 252, 251, 0.92);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.14);
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px;
    overflow: hidden;
  }
  [data-theme="dark"] .podcastMiniPlayer.minimized {
    background: rgba(20, 20, 19, 0.92);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  @media (min-width: 640px) {
    .podcastMiniPlayer.minimized { left: auto; right: 24px; bottom: 24px; width: 380px; }
  }
  .podcastMiniPlayer.minimized .pmpArt { width: 36px; height: 36px; }
  .pmpTitleOnly { flex: 1; min-width: 0; font-weight: 600; font-size: 0.86rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pmpMinControls { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
  .pmpMiniProgress { position: absolute; left: 0; bottom: 0; height: 2px; background: var(--accent); border-radius: 0 0 0 18px; transition: width .15s linear; }

  /* Shared */
  .pmpArt { width: 44px; height: 44px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: var(--surface-2); }
  .pmpArt img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pmpArtFallback { width: 100%; height: 100%; background: var(--surface-2); }
  .pmpIconBtn { width: 32px; height: 32px; border-radius: 50%; border: none; background: transparent; color: var(--text); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
  .pmpIconBtn:hover:not(:disabled) { background: var(--surface-2); }
  .pmpIconBtn:disabled { opacity: 0.35; cursor: default; }
  .pmpPlayBtn { width: 38px; height: 38px; border-radius: 50%; border: none; background: var(--btn-bg); color: var(--btn-fg); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pmpLocked { display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--text-muted); padding: 8px 12px; background: var(--surface-2); border-radius: 8px; }
  .pmpSpinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--btn-fg); border-top-color: transparent; animation: pmpSpin 0.7s linear infinite; }
  @keyframes pmpSpin { to { transform: rotate(360deg); } }
  @media (max-width: 640px) { .pmpMeta { max-width: 120px; } .pmpScrub { flex-basis: 100%; order: 3; } }
`