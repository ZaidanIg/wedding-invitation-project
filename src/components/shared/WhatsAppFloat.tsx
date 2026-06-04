'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const WHATSAPP_NUMBER = '6282116179745';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Halo Sahinaja! Saya ingin bertanya lebih lanjut tentang undangan digital pernikahan. 😊'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/invitation')) {
    return null;
  }

  return (
    <div className="wa-float-wrapper">
      {/* Tooltip / Label */}
      <div
        className="wa-float-tooltip"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0) scale(1)' : 'translateX(10px) scale(0.95)',
        }}
        aria-hidden="true"
      >
        <span>Hubungi Kami</span>
        <div className="wa-float-tooltip-arrow" />
      </div>

      {/* Button */}
      <a
        id="whatsapp-float-btn"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        className="wa-float-btn"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Pulse rings */}
        <span className="wa-pulse wa-pulse-1" aria-hidden="true" />
        <span className="wa-pulse wa-pulse-2" aria-hidden="true" />

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          width="28"
          height="28"
          aria-hidden="true"
        >
          <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16.003c0 2.352.632 4.63 1.832 6.626L2.667 29.333l6.895-1.808a13.29 13.29 0 0 0 6.441 1.648c7.366 0 13.33-5.97 13.33-13.337 0-7.367-5.964-13.169-13.33-13.169zm0 24.006a11.04 11.04 0 0 1-5.627-1.541l-.403-.24-4.09 1.073 1.094-3.984-.263-.41A11.018 11.018 0 0 1 5 16.003C5 9.926 9.926 5 16.003 5S27 9.926 27 16.003 22.074 26.673 16.003 26.673zm6.072-8.24c-.334-.167-1.972-.973-2.278-1.083-.306-.111-.529-.167-.751.167-.223.334-.862 1.083-1.057 1.306-.195.223-.39.25-.723.083-.334-.167-1.409-.52-2.684-1.657-.992-.886-1.66-1.98-1.854-2.314-.195-.334-.021-.514.147-.681.152-.15.334-.39.501-.584.167-.194.223-.334.334-.556.111-.222.056-.417-.028-.584-.083-.167-.751-1.812-1.03-2.481-.272-.651-.549-.563-.751-.573l-.64-.011c-.222 0-.584.083-.89.417-.306.334-1.168 1.14-1.168 2.78s1.196 3.224 1.363 3.447c.167.222 2.354 3.594 5.705 5.04.797.344 1.42.549 1.904.703.8.254 1.53.218 2.106.132.642-.096 1.972-.806 2.25-1.585.279-.778.279-1.445.195-1.585-.083-.139-.306-.222-.64-.39z" />
        </svg>
      </a>

      <style>{`
        .wa-float-wrapper {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wa-float-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          box-shadow: 0 8px 30px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.25s ease;
          text-decoration: none;
          cursor: pointer;
          flex-shrink: 0;
        }

        .wa-float-btn:hover {
          transform: scale(1.12);
          box-shadow: 0 14px 40px rgba(37, 211, 102, 0.55), 0 4px 12px rgba(0,0,0,0.2);
        }

        .wa-float-btn:active {
          transform: scale(0.96);
        }

        /* Pulsing rings */
        .wa-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.35);
          animation: waPulse 2.4s ease-out infinite;
          pointer-events: none;
        }

        .wa-pulse-2 {
          animation-delay: 1.2s;
        }

        @keyframes waPulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Tooltip */
        .wa-float-tooltip {
          position: relative;
          background: #1c1c1c;
          color: #fff;
          font-family: var(--font-inter, sans-serif);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 8px 14px;
          border-radius: 10px;
          white-space: nowrap;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        }

        .wa-float-tooltip-arrow {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 7px solid #1c1c1c;
        }

        @media (max-width: 640px) {
          .wa-float-wrapper {
            bottom: 20px;
            right: 18px;
          }

          .wa-float-btn {
            width: 52px;
            height: 52px;
          }

          .wa-float-tooltip {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
