import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision, GameStatus, HalfField } from '../../enums';
import {
  AnimationsService,
  CollisionService,
  GameControlsService,
  PlayersService,
} from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ground') private ground!: ElementRef<HTMLElement>;

  private subSink: SubSink = new SubSink();

  constructor(
    public players: PlayersService,
    private animations: AnimationsService,
    private collision: CollisionService,
    private controls: GameControlsService
  ) {}

  get isGameStopped(): boolean {
    return this.controls.currentStatus === GameStatus.Stopped;
  }

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.collision.registerGround(this.ground.nativeElement);
    this.onScoreChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onScoreChanged(): void {
    this.subSink.sink = this.collision.onGatesCollision$
      .pipe(
        map((collision: Collision) =>
          collision === Collision.Player1Gate ? HalfField.Left : HalfField.Right
        )
      )
      .subscribe((halfField: HalfField) => {
        this.animations.animateBorder(this.ground.nativeElement, halfField);
      });
  }
}
