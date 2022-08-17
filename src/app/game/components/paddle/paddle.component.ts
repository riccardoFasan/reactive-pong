import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PaddleController } from '../../interfaces';
import { Paddle } from '../../models';
import { PADDLE_CONTROLLER } from '../../tokens';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
})
export class PaddleComponent implements OnInit, OnDestroy, Paddle {
  @Input() readonly defaultY!: number;
  @Input() readonly defaultX!: number;

  x$: Observable<number> = this.controller.x$.asObservable();
  y$: Observable<number> = this.controller.y$.asObservable();

  constructor(
    @Inject(PADDLE_CONTROLLER) private controller: PaddleController
  ) {}

  ngOnInit(): void {
    this.controller.start(this.defaultX, this.defaultY);
  }

  ngOnDestroy(): void {
    this.controller.stop();
  }
}
