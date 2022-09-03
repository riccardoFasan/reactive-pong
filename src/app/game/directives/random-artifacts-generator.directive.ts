import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { interval } from 'rxjs';
import {
  generator,
  randomEnum,
  isIonicReady,
  randomIntegerBetween,
} from 'src/utilities';
import { SubSink } from 'subsink';
import { Action, GameStatus } from '../enums';
import { Artifact, Coordinates } from '../models';
import { GameControlsService } from '../services';

@Directive({
  selector: '[appRandomArtifactsGenerator]',
})
export class RandomArtifactsGeneratorDirective
  implements AfterViewInit, OnDestroy
{
  private subSink: SubSink = new SubSink();

  private groundHeight: number = 0;
  private groundWidth: number = 0;
  private pixelsFromEdges: number = 0;

  constructor(private ref: ElementRef, private controls: GameControlsService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.setSizes();
    this.onTimer();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  @HostListener('window:resize')
  private setSizes(): void {
    const ground: HTMLElement = this.ref.nativeElement;
    this.groundHeight = ground.clientHeight;
    this.groundWidth = ground.clientWidth;
    const groundContainer: HTMLElement = ground.parentElement!;
    const style: CSSStyleDeclaration = window.getComputedStyle(groundContainer);
    this.pixelsFromEdges = parseInt(style.paddingLeft);
  }

  private onTimer(): void {
    this.subSink.sink = interval(10000).subscribe(() => {
      this.generateRandomArtifact();
    });
  }

  private generateRandomArtifact(): void {
    if (this.controls.currentStatus === GameStatus.Running) {
      const artifact: Artifact = this.getRandomArtifact();
      this.placeArtifact(artifact);
      // TODO: register in collision service
    }
  }

  private getRandomArtifact(): Artifact {
    const id: number = generator.next().value;
    const action: Action = this.getRandomAction();
    const coordinates: Coordinates = this.getRandomCoordinates();
    return { id, action, coordinates };
  }

  private getRandomAction(): Action {
    return randomEnum(Action);
  }

  private getRandomCoordinates(): Coordinates {
    return {
      x: randomIntegerBetween(
        this.pixelsFromEdges,
        this.groundWidth - this.pixelsFromEdges
      ),
      y: randomIntegerBetween(
        this.pixelsFromEdges,
        this.groundHeight - this.pixelsFromEdges
      ),
    };
  }

  private placeArtifact(artifact: Artifact): void {
    // ? Is it to create a component instead of a div?
    const div: HTMLDivElement = document.createElement('div');
    div.setAttribute('data-artifact-id', artifact.id.toString());
    div.setAttribute('class', `artifact ${artifact.action.toLowerCase()}`);
    div.style.top = `${artifact.coordinates.y}px`;
    div.style.left = `${artifact.coordinates.x}px`;
    this.ref.nativeElement.appendChild(div);
  }
}
