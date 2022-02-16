import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AnimationController, Animation, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  @ViewChild('blocks', {read: ElementRef, static: true}) blocks: ElementRef;
  @ViewChild('background', {read: ElementRef, static: true}) background: ElementRef;

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

  private maxTranslate: number;
  private animation: Animation;

  constructor(
    private animationCtrl: AnimationController,
    private platform: Platform,
    private renderer: Renderer2
  ) {
    this.maxTranslate = this.platform.height() - 200;
  }

  ngAfterViewInit() {
    this.animation = this.createAnimation();
  }

  createAnimation(): Animation {
    const animation = this.animationCtrl.create()
    .addElement(this.blocks.nativeElement)
    .duration(300)
    .fromTo('transform', 'translateY(0)', `translateY(${this.maxTranslate}px)`);

    return animation;
  }

  setBackgroundOpacity() {
    this.renderer.setStyle(this.background.nativeElement, 'opacity', this.initialStep === 0 ? '0' : '1');
  }

  toggleBlocks() {
    const isInitialStep = this.initialStep === 0;
    this.initialStep = isInitialStep ? this.maxTranslate : 0;

    this.animation.direction(isInitialStep ? 'normal' : 'reverse');
    this.animation.play();

    this.setBackgroundOpacity();
  }

  public hideValues(): void {
    this.isHide = !this.isHide;
  }

}
