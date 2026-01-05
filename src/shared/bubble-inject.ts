import { getBubbleStyleText } from './bubble-style.js';
import { FloatingBubble } from './floating-bubble.js';
import { BUBBLE_ID } from './ui-constants.js';

const CONTEXT_STYLE_ID = 'ytst-context-style';

const bubble = new FloatingBubble(BUBBLE_ID, {
  styleId: CONTEXT_STYLE_ID,
  styleText: getBubbleStyleText(BUBBLE_ID)
});

const root = window as Window & {
  YTSTBubble?: {
    showForSelection: (text: string) => void;
    showAtRect: (rect: { left: number; top: number; width: number; height: number }, text: string) => void;
  };
};

root.YTSTBubble = {
  showForSelection: (text: string) => bubble.showForSelection(text),
  showAtRect: (rect, text) => bubble.showAtRect(rect, text)
};
