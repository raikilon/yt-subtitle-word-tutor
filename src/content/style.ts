export class StyleInjector {
  constructor(private readonly cssText: string, private readonly styleId: string) {}

  ensureInjected(): void {
    if (document.getElementById(this.styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = this.styleId;
    style.textContent = this.cssText;
    document.head?.appendChild(style);
  }
}
