export class CaptionWordWrapper {
  private observer: MutationObserver | null = null;

  constructor(private readonly selector: string, private readonly wordClass: string) {}

  init(): void {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', () => this.init(), { once: true });
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) {
            continue;
          }

          if (node.matches(this.selector)) {
            this.wrapSegment(node);
          } else {
            const segments = node.querySelectorAll<HTMLElement>(this.selector);
            segments.forEach((segment) => this.wrapSegment(segment));
          }
        }
      }
    });

    this.observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll<HTMLElement>(this.selector).forEach((segment) => this.wrapSegment(segment));
  }

  private wrapSegment(segment: HTMLElement): void {
    if (segment.dataset.ytstProcessed === 'true') {
      return;
    }

    const text = segment.textContent ?? '';
    segment.textContent = '';
    segment.dataset.ytstProcessed = 'true';

    const fragment = document.createDocumentFragment();
    const parts = text.split(/(\s+)/);

    for (const part of parts) {
      if (!part) {
        continue;
      }

      if (part.trim() === '') {
        fragment.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.className = this.wordClass;
        span.textContent = part;
        fragment.appendChild(span);
      }
    }

    segment.appendChild(fragment);
  }
}
