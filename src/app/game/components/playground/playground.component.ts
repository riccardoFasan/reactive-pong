import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision, HalfField } from '../../enums';
import { Fields } from '../../models';
import {
  AnimationsService,
  CollisionService,
  GoalService,
  PlayersService,
  ElementsService,
} from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ground') private groundRef!: ElementRef<HTMLElement>;

  userField$: Observable<HalfField> = this.players.fieldsChanged$.pipe(
    map((fields: Fields) => fields.user)
  );

  opponentField$: Observable<HalfField> = this.players.fieldsChanged$.pipe(
    map((fields: Fields) => fields.opponent)
  );

  private subSink: SubSink = new SubSink();

  constructor(
    private players: PlayersService,
    private animations: AnimationsService,
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
          collision === Collision.Player1Gate ? HalfField.Left : HalfField.Right
        )
      )
      .subscribe((halfField: HalfField) => {
        this.animations.animateBorder(this.groundRef.nativeElement, halfField);
      });
  }
}
