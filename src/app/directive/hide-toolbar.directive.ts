import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[hide-toolbar]'
})

export class HideToolbarDirective {
  @Input("footer") footer: any;
  private lastY = 0;
  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController
  ) { }

  ngOnInit() {
    this.footer = this.footer.el;
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.footer, 'transition', 'bottom 0.5s cubic-bezier(0.06, 1.14, 0.44, 1.42) 0s');
      this.renderer.setStyle(this.footer, '-webkit-transition', 'bottom 0.5s cubic-bezier(0.06, 1.14, 0.44, 1.42) 0s');
    });
  }

  @HostListener('ionScroll', ['$event'])
  async onContentScroll($event: any) {
    const scrollElement = await $event.target.getScrollElement();
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    // console.log({ scrollHeight });
    const currentScrollDepth = $event.detail.scrollTop;
    // console.log({ currentScrollDepth });

    if (scrollHeight <= currentScrollDepth) return;
    if (currentScrollDepth > this.lastY) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(this.footer, 'bottom', `-87px`);
      });
    } else {
      this.domCtrl.write(() => {
        this.renderer.setStyle(this.footer, 'bottom', `-4px`);
      });
    }
    this.lastY = $event.detail.scrollTop;
  }
}