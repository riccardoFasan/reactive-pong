import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision, HalfField } from '../../enums';
import { CollisionService } from '../../services';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
})
export class PaddleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paddle') private paddle!: ElementRef<HTMLElement>;
  @Input() halfField!: HalfField;

  private subSink: SubSink = new SubSink();

  constructor(
    private collision: CollisionService,
    private animations: AnimationController
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.onCollisionChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private get paddleCollision(): Collision {
    return this.halfField === HalfField.Left
      ? Collision.LeftPaddle
      : Collision.RightPaddle;
  }

  private onCollisionChanged(): void {
    this.subSink.sink = this.collision.collisionChanged$
      .pipe(
        filter((collision: Collision) => collision === this.paddleCollision)
      )
      .subscribe(() => this.fade());
  }

  private fade(): void {
    this.animations
      .create()
      .addElement(this.paddle.nativeElement)
      .duration(250)
      .keyframes([
        {
          offset: 0,
          backgroundColor: 'var(--ion-color-dark)',
        },
        {
          offset: 1,
          backgroundColor: 'var(--ion-color-primary)',
        },
      ])
      .fill('none')
      .play();
  }
}
