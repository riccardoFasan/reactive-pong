import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { HalfField, Player } from '../../enums';
import { Score } from '../../models';
import { ScoreService } from '../../services';

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
    private animations: AnimationController
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
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
        this.animateBorder(halfField);
      }
    });
  }

  private animateBorder(halfField: HalfField): void {
    const property: string =
      halfField === HalfField.Left ? 'borderLeft' : 'borderRight';
    this.animations
      .create()
      .addElement(this.ground.nativeElement)
      .duration(300)
      .iterations(3)
      .keyframes([
        {
          offset: 0,
          [property]:
            'calc(var(--playground-border-width) * 3) dashed rgba(var(--ion-text-color-rgb), 0.25)',
        },
        {
          offset: 1,
          [property]:
            'calc(var(--playground-border-width) * 3) dashed rgba(var(--ion-color-danger-rgb), 0.66)',
        },
      ])
      .fill('none')
      .play();
  }
}
