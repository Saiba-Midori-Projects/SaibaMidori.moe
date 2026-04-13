const componentCSS = `
  :host {
    display: block;
  }

  .opening-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--opening-overlay, var(--bg-color, #fff));
    clip-path: polygon(0 0,100% 0,100% 100%,0 100%);
    animation: overlayClose 0.6s var(--opening-ease-main, cubic-bezier(0.73, 0.02, 0.24, 0.99)) 1.2s forwards;
    pointer-events: none;
  }

  .opening-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: max-content;
    max-width: 92vw;
  }

  .title-box {
    position: relative;
    display: inline-block;
    width: fit-content;
    line-height: 1;
  }

  .title-base,
  .title-mask,
  .title-final {
    font-size: clamp(42px, 8vw, 96px);
    font-weight: 800;
    letter-spacing: -0.05em;
    white-space: nowrap;
    padding: 0.1em 0.12em;
  }

  .title-base {
    position: relative;
    color: var(--opening-fg, var(--text-main, #111));
    opacity: 0;
    animation: baseFade 0.12s linear 0.08s forwards;
  }

  .title-mask {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--opening-mask-fg, var(--bg-color, #fff));
    background: var(--opening-mask-bg, var(--primary-color, #44c96a));
    clip-path: polygon(0 0,0 0,0 100%,0 100%);
    animation:
      maskSweep 0.32s var(--opening-ease-fast, cubic-bezier(0.65, 0, 0.35, 1)) 0.35s forwards,
      maskExit 0.28s var(--opening-ease-fast, cubic-bezier(0.65, 0, 0.35, 1)) 0.67s forwards;
    box-shadow: 2px 0 0 rgba(0,0,0,0.05);
  }

  .title-final {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--opening-fg, var(--text-main, #111));
    clip-path: polygon(0 0,0 0,0 100%,0 100%);
    animation: finalReveal 0.52s var(--opening-ease-text, cubic-bezier(0.76, -0.02, 0.2, 0.98)) 0.55s forwards;
  }

  @keyframes overlayClose {
    to {
      clip-path: polygon(100% 0,100% 0,100% 100%,100% 100%);
    }
  }

  @keyframes maskSweep {
    from {
      clip-path: polygon(0 0,0 0,0 100%,0 100%);
    }
    to {
      clip-path: polygon(0 0,100% 0,100% 100%,0 100%);
    }
  }

  @keyframes maskExit {
    from {
      clip-path: polygon(0 0,100% 0,100% 100%,0 100%);
    }
    to {
      clip-path: polygon(100% 0,100% 0,100% 100%,100% 100%);
    }
  }

  @keyframes finalReveal {
    from {
      clip-path: polygon(0 0,0 0,0 100%,0 100%);
    }
    to {
      clip-path: polygon(0 0,100% 0,100% 100%,0 100%);
    }
  }

  @keyframes baseFade {
    to {
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    .title-base,
    .title-mask,
    .title-final {
      font-size: clamp(36px, 7vw, 72px);
    }
  }

  @media (max-width: 768px) {
    .opening-center {
      width: min(84vw, 320px);
    }

    .title-box {
      display: block;
      width: 100%;
    }

    .title-base,
    .title-mask,
    .title-final {
      font-size: clamp(30px, 9vw, 42px);
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: break-word;
      text-align: center;
    }
  }
`;

class OpeningReveal extends HTMLElement {
  static escapeHTML(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  connectedCallback() {
    if (this.shadowRoot) {
      return;
    }

    const root = this.attachShadow({ mode: "open" });
    const text = this.getAttribute("title-text") || "Opening Reveal";
    const safeText = OpeningReveal.escapeHTML(text);

    root.innerHTML = `
      <style>${componentCSS}</style>
      <div class="opening-overlay" aria-hidden="true">
        <div class="opening-center">
          <div class="title-box">
            <div class="title-base">${safeText}</div>
            <div class="title-mask">${safeText}</div>
            <div class="title-final">${safeText}</div>
          </div>
        </div>
      </div>
    `;
  }

  play() {
    const overlay = this.shadowRoot?.querySelector(".opening-overlay");

    if (!overlay) {
      return;
    }

    document.body.classList.add("loaded");

    overlay.addEventListener("animationend", (event) => {
      if (event.animationName === "overlayClose") {
        this.remove();
      }
    }, { once: true });
  }
}

if (!customElements.get("opening-reveal")) {
  customElements.define("opening-reveal", OpeningReveal);
}
