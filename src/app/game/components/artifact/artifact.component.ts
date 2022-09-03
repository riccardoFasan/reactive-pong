import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { Action } from '../../enums';
import { Artifact, Coordinates } from '../../models';
import { ArtifactsService } from '../../services';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.scss'],
})
export class ArtifactComponent
  implements OnInit, AfterViewInit, OnDestroy, Artifact
{
  id!: number;
  action!: Action;
  coordinates!: Coordinates;

  constructor(private ref: ElementRef, private artifacts: ArtifactsService) {}

  ngOnInit() {
    this.artifacts.registerArtifact(this.artifact, this.ref);
  }

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.setPosition();
  }

  ngOnDestroy(): void {
    this.artifacts.unregisterArtifact(this.id);
  }

  private get artifact(): Artifact {
    return { id: this.id, action: this.action, coordinates: this.coordinates };
  }

  private setPosition(): void {
    const element: HTMLElement = this.ref.nativeElement;
    element.style.top = `${this.coordinates.y}px`;
    element.style.left = `${this.coordinates.x}px`;
  }
}
