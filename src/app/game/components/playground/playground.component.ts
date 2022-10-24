import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HalfField } from 'src/app/shared/enums';
import { PlayersService } from 'src/app/shared/services';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision } from '../../enums';
import {
  AnimatorService,
  CollisionService,
  GoalService,
  ElementsService,
} from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ground') private groundRef!: ElementRef<HTMLElement>;

  userField$: Observable<HalfField> = this.players.userField$;
  opponentField$: Observable<HalfField> = this.players.opponentField$;

  private subSink: SubSink = new SubSink();

  constructor(
    private players: PlayersService,
    private animator: AnimatorService,
    private collision: CollisionService,
    private goal: GoalService,
    private elements: ElementsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.elements.registerGround(this.groundRef.nativeElement);
    await isIonicReady();
    this.onScoreChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onScoreChanged(): void {
    this.subSink.sink = this.collision.onGatesCollision$
      .pipe(
        tap((collision: Collision) =>
          this.goal.updateScoreAndDelayGame(collision)
        ),
        map((collision: Collision) =>
          collision === Collision.PlayerLeftGate
            ? HalfField.Left
            : HalfField.Right
        )
      )
      .subscribe(() => this.animator.writeGoal());
  }
}
