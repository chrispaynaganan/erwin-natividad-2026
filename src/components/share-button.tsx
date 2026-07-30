'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './share-button.module.css';

type ShareButtonProps = {
  /** Full absolute URL of the page being shared */
  url: string;
  /** Title / project name used in share text where the platform supports it */
  title: string;
  /**
   * Facebook Messenger's web "send dialog" requires a registered Facebook App ID.
   * If you don't have one yet, the Messenger option falls back to the
   * fb-messenger:// deep link, which only works on mobile with the app installed.
   */
  facebookAppId?: string;
};

export default function ShareButton({ url, title, facebookAppId }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, url });
        return true;
      } catch {
        // user cancelled the native share sheet — fall through to custom menu
        return false;
      }
    }
    return false;
  };

  const handleTriggerClick = async () => {
    const canUseNativeShare =
      typeof navigator !== 'undefined' &&
      'share' in navigator &&
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches;

    if (canUseNativeShare) {
      const shared = await handleNativeShare();
      if (shared) return;
    }
    setOpen((prev) => !prev);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — no-op, user can still use the other options
    }
  };

  const messengerHref = facebookAppId
    ? `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=${facebookAppId}&redirect_uri=${encodedUrl}`
    : `fb-messenger://share/?link=${encodedUrl}`;

  const links = [
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: FacebookIcon },
    { name: 'Messenger', href: messengerHref, Icon: MessengerIcon },
    { name: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, Icon: TelegramIcon },
    { name: 'Viber', href: `viber://forward?text=${encodedTitle}%20${encodedUrl}`, Icon: ViberIcon },
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, Icon: WhatsAppIcon },
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, Icon: XIcon },
  ];

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={handleTriggerClick}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ShareIcon />
        <span>Share</span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <button type="button" className={styles.menuItem} onClick={handleCopy} role="menuitem">
            <span className={styles.iconCircle}>{copied ? <CheckIcon /> : <LinkIcon />}</span>
            <span>{copied ? 'Link copied' : 'Copy link'}</span>
          </button>

          {links.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.menuItem}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className={styles.iconCircle}>
                <Icon />
              </span>
              <span>{name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Minimal monoline icon set (currentColor, 18x18) --- */

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.3 10.7 15.7 6.6M8.3 13.3l7.4 4.1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 14.5 14.5 9.5M11 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1M13 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 10 17l9-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13.8 8.4h1.4V6.2h-1.7c-1.6 0-2.7 1-2.7 2.7v1.4H9.3v2.3h1.5V18h2.3v-5.4h1.7l.3-2.3h-2V9c0-.4.2-.6.7-.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5c-5 0-8.8 3.5-8.8 8.3 0 2.6 1.2 4.9 3.1 6.5v3l2.9-1.6c.9.2 1.8.4 2.8.4 5 0 8.8-3.5 8.8-8.3S17 3.5 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m8 13.3 3-3.2 2.2 2 3.3-3.4-3.4 3.6-2.2-2z" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.8 12.1 10-4.1c.5-.2.9.2.7.7l-1.7 8.3c-.1.5-.6.7-1 .4l-2.7-2-1.4 1.4c-.2.2-.5.2-.6-.1l-.5-2.4-2.6-.8c-.5-.2-.5-.9-.2-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4c-4.6 0-8 3-8 6.9 0 2.4 1.3 4.5 3.3 5.8l-.4 3 2.9-1.6c.7.1 1.4.2 2.2.2 4.6 0 8-3 8-6.9S16.6 4 12 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 9.6c0 3 2 4.9 4.9 4.9.4 0 .5-.2.5-.5l-.1-1c0-.3-.2-.4-.5-.5l-1.2-.3c-.3 0-.5 0-.6.3l-.3.6c-1-.5-1.7-1.2-2.2-2.2l.6-.3c.3-.1.4-.3.3-.6l-.3-1.2c-.1-.3-.2-.5-.5-.5l-1-.1c-.3 0-.5.1-.5.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 9.3c-.2.7 0 1.6.9 2.7 1 1.2 1.9 1.9 3.1 2.2.8.2 1.4-.2 1.7-.6l.3-.4-1.7-1-.3.4c-.1.2-.3.2-.5.1a5 5 0 0 1-2-2c-.1-.2-.1-.4 0-.5l.3-.4-.9-1.7-.4.1c-.2.1-.4.4-.5.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}