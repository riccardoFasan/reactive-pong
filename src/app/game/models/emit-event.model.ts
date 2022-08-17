import { EventName } from '../enums';

export interface EmitEvent {
  name: EventName;
  value: any;
}
