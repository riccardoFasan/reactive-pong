import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { Action } from '../../enums';
import { Artifact, Coordinates } from '../../models';
import { ArtifactsService } from '../../services';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.scss'],
})
export class ArtifactComponent implements AfterViewInit, OnDestroy, Artifact {
  id!: number;
  action!: Action;
  coordinates!: Coordinates;

  constructor(private ref: ElementRef, private artifacts: ArtifactsService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.setHostPosition();
    this.artifacts.registerArtifact(this.artifact, this.ref);
  }

  ngOnDestroy(): void {
    this.artifacts.unregisterArtifact(this.id);
  }

  private get artifact(): Artifact {
    return { id: this.id, action: this.action, coordinates: this.coordinates };
  }

  private setHostPosition(): void {
    const element: HTMLElement = this.ref.nativeElement;
    element.style.top = `${this.coordinates.y}px`;
    element.style.left = `${this.coordinates.x}px`;
  }
}
