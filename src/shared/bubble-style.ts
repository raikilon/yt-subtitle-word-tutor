export const getBubbleStyleText = (bubbleId: string): string => `
  #${bubbleId} {
    position: fixed;
    z-index: 999999;
    max-width: 280px;
    padding: 6px 10px;
    border-radius: 8px;
    background: #111827;
    color: #f9fafb;
    font-size: 13px;
    font-family: "Rubik", "Trebuchet MS", sans-serif;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transform: translate(-50%, -100%);
    pointer-events: none;
    transition: opacity 0.12s ease;
  }
  #${bubbleId}.show {
    opacity: 1;
  }
`;
