import { Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  signal,
  WritableSignal,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IonCard, IonContent } from '@ionic/angular';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

@Component({
  selector: 'app-landing-page',
  imports: [IonCard, IonContent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  standalone: true
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('leftPanel') leftPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('rightPanel') rightPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('counter') counterEl!: ElementRef<HTMLDivElement>;
  @ViewChild('heading') heading!: ElementRef<HTMLHeadingElement>;
  @ViewChild('paragraph') paragraph!: ElementRef<HTMLParagraphElement>;

  percentageCounter: WritableSignal<number> = signal(0);

  private tl!: gsap.core.Timeline;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    gsap.registerPlugin(CSSPlugin);

    this.tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    const counterObj = { value: 0 };

    this.tl
      .to(counterObj, {
        value: 100,
        duration: 2.2,
        ease: 'power1.inOut',
        onUpdate: () => {
          // Update via NgZone-safe direct assignment; for OnPush change
          // detection you'd wrap this in ngZone.run() or use a signal.
          this.percentageCounter.set(Math.floor(counterObj.value));
        }
      })
      .to({}, { duration: 0.15 })
      .to(this.counterEl.nativeElement, { opacity: 0, duration: 0.3 }, 'reveal')
      .to(
        this.leftPanel.nativeElement,
        { xPercent: -100, duration: 1, ease: 'power4.inOut' },
        'reveal'
      )
      .to(
        this.rightPanel.nativeElement,
        { xPercent: 100, duration: 1, ease: 'power4.inOut' },
        'reveal'
      )
      .from(
        this.heading.nativeElement,
        { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' },
        'reveal+=0.5'
      )
      .from(
        this.paragraph.nativeElement,
        { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' },
        'reveal+=0.65'
      )
      .set([this.leftPanel.nativeElement, this.rightPanel.nativeElement, this.counterEl.nativeElement], {
        display: 'none'
      });
  }
 
  ngOnDestroy(): void {
    // Kill the timeline so it doesn't keep running/leaking after navigation
    this.tl?.kill();
  }


}
