import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, NgZone } from '@angular/core';
import { AnimationController, Animation, Platform, Gesture, GestureController, GestureDetail } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('blocks', {read: ElementRef, static: true}) blocks: ElementRef;
  @ViewChild('background', {read: ElementRef, static: true}) background: ElementRef;
  @ViewChild('swipeDown') swipeDown: any;

  public menuopts: Array<any> = [
    {icon: 'person-add-outline', text: 'Indicar amigos'},
    {icon: 'phone-portrait-outline', text: 'Recarga de celular'},
    {icon: 'wallet-outline', text: 'Depositar'},
    {icon: 'options-outline', text: 'Ajustar limite'},
    {icon: 'help-circle-outline', text: 'Me ajuda'},
    {icon: 'barcode-outline', text: 'Pagar'},
    {icon: 'lock-open-outline', text: 'Bloquear cartão'},
    {icon: 'card-outline', text: 'Cartão virtual'}
  ];

  public slidesOpts: any = {slidesPerView: 3, freeMode: true};

  public items: Array<any> = [
    {icon: 'help-circle-outline', text: 'Me ajuda'},
    {icon: 'person-outline', text: 'Perfil'},
    {icon: 'cash-outline', text: 'Configurar conta'},
    {icon: 'card-outline', text: 'Configurar cartão'},
    {icon: 'phone-portrait-outline', text: 'Configurações do app'}
  ];

  public isHide = false;
  public initialStep = 0;
  public swiping = false;

  private maxTranslate: number;
  private animation: Animation;
  private gesture: Gesture;

  constructor(
    private animationCtrl: AnimationController,
    private platform: Platform,
    private renderer: Renderer2,
    private gestureCtrl: GestureController
  ) {
    this.maxTranslate = this.platform.height() - 200;
  }

  ngAfterViewInit() {
    this.animation = this.createAnimation();
    this.detectSwipe();
  }

  createAnimation(): Animation {
    const animation = this.animationCtrl.create()
    .addElement(this.blocks.nativeElement)
    .duration(300)
    .fromTo('transform', 'translateY(0)', `translateY(${this.maxTranslate}px)`)
    .onFinish(() => this.gesture.enable(true));

    return animation;
  }

  detectSwipe() {
    this.gesture = this.gestureCtrl.create({
      el: this.swipeDown.el,
      gestureName: 'swipe-down',
      threshold: 0,
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev)
    }, true);

    this.gesture.enable(true);
  }

  onMove(ev: GestureDetail) {
    if (!this.swiping) {
      this.animation.direction('normal').progressStart(true);
      this.swiping = true;
    }
    const step = (this.initialStep + ev.deltaY) / this.maxTranslate;
    this.animation.progressStep(step);
    this.setBackgroundOpacity(step);
  }

  onEnd(ev: GestureDetail) {
    if (!this.swiping) {
      return;
    } else {
      this.gesture.enable(false);

      const step = (this.initialStep + ev.deltaY) / this.maxTranslate;
      const shouldComplete = step > 0.5;

      this.animation.progressEnd(shouldComplete ? 1 : 0, step);
      this.initialStep = shouldComplete ? this.maxTranslate : 0;
      this.setBackgroundOpacity();
      this.swiping = false;
    }
  }

  setBackgroundOpacity(value: number = null) {
    this.renderer.setStyle(this.background.nativeElement, 'opacity', value ? value : this.initialStep === 0 ? '0' : '1');
  }

  toggleBlocks() {
    const isInitialStep = this.initialStep === 0;
    this.initialStep = isInitialStep ? this.maxTranslate : 0;

    this.gesture.enable(false);

    this.animation.direction(isInitialStep ? 'normal' : 'reverse');
    this.animation.play();

    this.setBackgroundOpacity();
  }

  fixedBlocks(): boolean {
    return this.swiping || this.initialStep === this.maxTranslate;
  }

  public hideValues(): void {
    this.isHide = !this.isHide;
  }

}
