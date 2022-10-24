import {
  Attribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Option } from '../../models';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnChanges {
  @Input() options: Option[] = [];
  @Input() value!: any;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  private currentIndex: number = 0;

  constructor(@Attribute('label') public label: string = '') {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.currentIndex = this.options.findIndex((o) => o.value === this.value);
    }
  }

  get selected(): Option {
    return this.options[this.currentIndex];
  }

  selectNext(): void {
    this.currentIndex = this.nextIndex;
    this.value = this.selected.value;
    this.valueChange.emit(this.value);
  }

  private get nextIndex(): number {
    const nextIndex: number = this.currentIndex + 1;
    if (nextIndex + 1 <= this.options.length) return nextIndex;
    return 0;
  }
}
