import { Component, OnInit } from '@angular/core';
import { UserPaddleService } from '../../services';
import { PADDLE_CONTROLLER } from '../../tokens';

@Component({
  selector: 'app-user-paddle',
  templateUrl: './user-paddle.component.html',
  styleUrls: ['./user-paddle.component.scss'],
  providers: [
    {
      provide: PADDLE_CONTROLLER,
      useClass: UserPaddleService,
    },
  ],
})
export class UserPaddleComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
