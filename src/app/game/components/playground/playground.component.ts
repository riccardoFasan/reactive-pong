import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { HalfField, Player } from '../../enums';
import { Score } from '../../models';
import {
  AnimationsService,
  CollisionService,
  ScoreService,
} from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ground') private ground!: ElementRef<HTMLElement>;

  player: Player = Player.Player1;
  opponent: Player = Player.Player2;

  playerHalfField: HalfField =
    this.player === Player.Player1 ? HalfField.Left : HalfField.Right;
  opponentHalfField: HalfField =
    this.player !== Player.Player1 ? HalfField.Left : HalfField.Right;

  private subSink: SubSink = new SubSink();
  private previousPlayer1Score: number = 0;

  constructor(
    private score: ScoreService,
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
    this.subSink.sink = this.score.scoreChanged$.subscribe((score: Score) => {
      if (score.player1 > 0 || score.player2 > 0) {
        const halfField: HalfField =
          score.player1 === this.previousPlayer1Score
            ? HalfField.Left
            : HalfField.Right;
        this.previousPlayer1Score = score.player1;
        this.animations.animateBorder(this.ground.nativeElement, halfField);
      }
    });
  }
}
