type RectLike = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

type BubbleStyle = {
  styleId: string;
  styleText: string;
};

export class FloatingBubble {
  private hideTimer: number | undefined;
  private element: HTMLDivElement;

  constructor(private readonly bubbleId: string, private readonly style?: BubbleStyle) {
    this.ensureStyle();
    this.element = this.createBubble();
  }

  showAtRect(rect: RectLike, text: string): void {
    const anchorLeft = rect.left + rect.width / 2;
    const anchorTop = rect.top - 10;
    this.showAt(anchorLeft, anchorTop, text);
  }

  showForSelection(text: string): void {
    const selection = window.getSelection();
    let rect: DOMRect | null = null;

    if (selection && selection.rangeCount > 0) {
      rect = selection.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) {
        rect = null;
      }
    }

    if (rect) {
      this.showAtRect(rect, text);
      return;
    }

    this.showAt(window.innerWidth / 2, 24, text);
  }

  private showAt(anchorLeft: number, anchorTop: number, text: string): void {
    this.element.textContent = text;
    this.element.classList.add('show');

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

  private ensureStyle(): void {
    if (!this.style) {
      return;
    }

    if (document.getElementById(this.style.styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = this.style.styleId;
    style.textContent = this.style.styleText;

    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          document.head?.appendChild(style);
        },
        { once: true }
      );
    }
  }

  private createBubble(): HTMLDivElement {
    const existing = document.getElementById(this.bubbleId);
    if (existing) {
      return existing as HTMLDivElement;
    }

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
