import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { HalfField } from 'src/app/shared/enums';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision } from '../../enums';
import { AnimatorService, CollisionService } from '../../services';

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
    private animator: AnimatorService
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
    this.subSink.sink = this.collision.onPaddleCollision$
      .pipe(
        filter((collision: Collision) => collision === this.paddleCollision)
      )
      .subscribe(() => this.animator.fadePaddle(this.paddle.nativeElement));
  }
}
