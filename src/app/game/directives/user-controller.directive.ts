import { Directive, ElementRef, HostBinding } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isIonicReady } from 'src/utilities';
import { PaddleController } from '../interfaces';

@Directive({
  selector: '[appUserController]',
})
export class UserControllerDirective implements PaddleController {
  x$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  y$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private ref: ElementRef) {}

  @HostBinding('style.left.px')
  get x(): number {
    return this.x$.getValue();
  }

  @HostBinding('style.top.px')
  get y(): number {
    return this.y$.getValue();
  }

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.centerPaddle();
  }

  private centerPaddle(): void {
    const parent: HTMLElement =
      this.ref.nativeElement.parentElement.parentElement;
    const parentHeight: number = parent.offsetHeight;
    const height: number = this.ref.nativeElement.offsetHeight;
    this.y$.next(parentHeight / 2 - height / 2);
  }
}
