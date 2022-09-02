import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { generator, randomEnum, isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Action } from '../enums';
import { Artifact, Coordinates } from '../models';

@Directive({
  selector: '[appRandomArtifactsGenerator]',
})
export class RandomArtifactsGeneratorDirective
  implements AfterViewInit, OnDestroy
{
  private subSink: SubSink = new SubSink();

  constructor() {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.generateRandomArtifacts();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private generateRandomArtifacts(): void {
    // on status === runnig
    // on timer (every tot.)
  }

  private getRandomArtifact(): Artifact {
    const action: Action = this.getRandomAction();
    const id: number = generator.next().value;
    return { id, action };
  }

  private getRandomAction(): Action {
    return randomEnum(Action);
  }

  // private getRandomCoordinates(): Coordinates {}
}
