import { Component, ElementRef, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Field } from '../../../interfaces/field';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interfaces/user';

mapboxgl.accessToken = environment.mapbox_api_key;

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements AfterViewInit {

  @Input() field!: Field;
  @Input() manage!: boolean;

  public company?: User;

  @ViewChild('minimap') divMiniMap?: ElementRef;

  public formattedDateOpening?: Date;
  public formattedDateClosing?: Date;

  public formattedLength?: number;
  public formattedWidth?: number;

  constructor(private cdr: ChangeDetectorRef, private userService: UserService) {}

  ngAfterViewInit(): void {
    this.configureMap();
    this.changeDatesFormat();
    this.changeDimensionsFormat();

    if (!this.manage && !this.field.public) {
      this.userService.getUserById(this.field.company_id).subscribe({
        next: (res) => {
          this.company = res;
        },
        error: () => this.company = undefined
      })
    }

    this.cdr.detectChanges();
  }


  changeDatesFormat() {
    this.formattedDateOpening = new Date('2022-01-01 ' + this.field?.opening_time);
    this.formattedDateClosing = new Date('2022-01-01 ' + this.field?.closing_time);
  }

  changeDimensionsFormat() {
    this.formattedLength = this.field?.length! % 1 == 0 ? Math.trunc(this.field?.length!) : this.field?.length;

    this.formattedWidth = this.field?.width! % 1 == 0 ? Math.trunc(this.field?.width!) : this.field?.width;
  }

  configureMap() {
      if (!this.divMiniMap?.nativeElement) throw 'MapDiv not found';
      if (!this.field?.location_lng) throw "Coordenates can't be null";

      const map = new Map({
        container: this.divMiniMap.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [this.field?.location_lng!, this.field?.location_lat!],
        zoom: 15,
        interactive: false
      });

      new Marker({
        color: '#265529'
      })
        .setLngLat([this.field?.location_lng!, this.field?.location_lat!])
        .addTo(map)
  }

}