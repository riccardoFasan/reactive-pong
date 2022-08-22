import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision, HalfField, Player } from '../../enums';
import { AnimationsService, CollisionService } from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ground') private ground!: ElementRef<HTMLElement>;

  // * Player 1 is always on left and Player 2 on right

  player: Player = Player.Player2;
  opponent: Player = Player.Player1;

  playerHalfField: HalfField =
    this.player === Player.Player1 ? HalfField.Left : HalfField.Right;
  opponentHalfField: HalfField =
    this.player !== Player.Player1 ? HalfField.Left : HalfField.Right;

  private subSink: SubSink = new SubSink();

  constructor(
    private animations: AnimationsService,
    private collision: CollisionService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.collision.registerGround(this.ground.nativeElement);
    this.onScoreChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onScoreChanged(): void {
    this.subSink.sink = this.collision.onGatesCollision$.subscribe(
      (collision: Collision) => {
        const halfField: HalfField =
          collision === Collision.Player1Gate
            ? HalfField.Left
            : HalfField.Right;
        this.animations.animateBorder(this.ground.nativeElement, halfField);
      }
    );
  }
}
