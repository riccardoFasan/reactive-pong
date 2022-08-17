import { Component, OnInit } from '@angular/core';
import { ComputerPaddleService } from '../../services';
import { PADDLE_CONTROLLER } from '../../tokens';

@Component({
  selector: 'app-computer-paddle',
  templateUrl: './computer-paddle.component.html',
  styleUrls: ['./computer-paddle.component.scss'],
  providers: [
    {
      provide: PADDLE_CONTROLLER,
      useClass: ComputerPaddleService,
    },
  ],
})
export class ComputerPaddleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
