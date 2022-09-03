import { Component, OnDestroy, OnInit } from '@angular/core';
import { Action } from '../../enums';
import { Artifact, Coordinates } from '../../models';

@Component({
  selector: 'app-artifact',
  templateUrl: './artifact.component.html',
  styleUrls: ['./artifact.component.scss'],
})
export class ArtifactComponent implements OnInit, OnDestroy, Artifact {
  id!: number;
  action!: Action;
  coordinates!: Coordinates;

  constructor() {}

  ngOnInit() {
    // TODO: register in collision service
  }

  ngOnDestroy(): void {
    // TODO: unregister
  }
}
