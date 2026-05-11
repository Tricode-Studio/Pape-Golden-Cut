import { useEffect, useRef } from 'react';

export default function Toast({ message, isError, show }) {
  const borderColor = isError ? '#cc4444' : 'var(--gold)';

  return (
    <div
      className={`toast${show ? ' show' : ''}`}
      style={{ borderColor }}
      role="alert"
      aria-live="polite"
    >
      <div className="ic">
        {isError ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 L4 6 V12 Q4 18 12 22 Q20 18 20 12 V6 Z"/>
            <path d="M9 12 L11 14 L15 10"/>
          </svg>
        )}
      </div>
      <div className="msg">{message}</div>
    </div>
  );
}
