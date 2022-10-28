import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SoundsService } from 'src/app/game/services';
import { SoundsStatus } from 'src/app/shared/enums';
import { Option } from '../../models';

@Component({
  selector: 'app-sound-switch',
  templateUrl: './sound-switch.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundSwitchComponent {
  soundsStatuses: Option[] = [
    { label: 'YES', value: SoundsStatus.On },
    { label: 'NO', value: SoundsStatus.Off },
  ];

  currentSoundStatus: SoundsStatus = this.sounds.status;

  constructor(private sounds: SoundsService) {}

  setSoundsStatus(status: SoundsStatus): void {
    this.sounds.setSounds(status);
  }
}
