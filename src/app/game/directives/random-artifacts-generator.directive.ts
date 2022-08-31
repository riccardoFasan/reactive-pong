import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { generator, isIonicReady } from 'src/utilities';
import { Action } from '../enums';
import { Artifact, Coordinates } from '../models';

@Directive({
  selector: '[appRandomArtifactsGenerator]',
})
export class RandomArtifactsGeneratorDirective
  implements AfterViewInit, OnDestroy
{
  // subSink

  constructor() {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.generateRandomArtifacts();
  }

  // on destroy

  private generateRandomArtifacts(): void {
    // on status === runnig
    // on timer (every tot.)
  }

  private getRandomArtifact(): Artifact {
    const action: Action = this.getRandomAction();
    const id: number = generator.next().value;
    return { id, action };
  }

  private getRandomAction(): Action {}

  private getRandomCoordinates(): Coordinates {}
}
