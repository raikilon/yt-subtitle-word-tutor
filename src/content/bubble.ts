export class TranslationBubble {
  private hideTimer: number | undefined;
  private element: HTMLDivElement;

  constructor(private readonly bubbleId: string) {
    this.element = this.createBubble();
  }

  show(rect: DOMRect, text: string): void {
    this.element.textContent = text;
    this.element.classList.add('show');

    const anchorLeft = rect.left + rect.width / 2;
    const anchorTop = rect.top - 10;

    this.element.style.left = `${anchorLeft}px`;
    this.element.style.top = `${Math.max(8, anchorTop)}px`;

    const bubbleRect = this.element.getBoundingClientRect();
    const minLeft = 8 + bubbleRect.width / 2;
    const maxLeft = window.innerWidth - 8 - bubbleRect.width / 2;
    const clampedLeft = Math.min(Math.max(anchorLeft, minLeft), maxLeft);

    this.element.style.left = `${clampedLeft}px`;
    this.element.style.top = `${Math.max(8, anchorTop)}px`;

    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer);
    }

    this.hideTimer = window.setTimeout(() => {
      this.element.classList.remove('show');
    }, 2600);
  }

  private createBubble(): HTMLDivElement {
    const element = document.createElement('div');
    element.id = this.bubbleId;
    element.setAttribute('role', 'status');
    element.setAttribute('aria-live', 'polite');

    if (document.body) {
      document.body.appendChild(element);
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          document.body?.appendChild(element);
        },
        { once: true }
      );
    }

    return element;
  }
}
