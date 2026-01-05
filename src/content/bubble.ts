import { FloatingBubble } from '../shared/floating-bubble.js';

export class TranslationBubble {
  private readonly bubble: FloatingBubble;

  constructor(bubbleId: string) {
    this.bubble = new FloatingBubble(bubbleId);
  }

  show(rect: DOMRect, text: string): void {
    this.bubble.showAtRect(rect, text);
  }
}
