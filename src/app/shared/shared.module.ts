import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BackComponent } from './components';

@NgModule({
  declarations: [BackComponent],
  imports: [TranslateModule.forChild({ extend: true })],
  exports: [BackComponent, TranslateModule],
})
export class SharedModule {}
