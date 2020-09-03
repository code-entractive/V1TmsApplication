import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IContainer, Container } from 'app/shared/model/container.model';
import { ContainerService } from './container.service';
import { ILocation } from 'app/shared/model/location.model';
import { LocationService } from 'app/entities/location/location.service';
import { ITrip } from 'app/shared/model/trip.model';
import { TripService } from 'app/entities/trip/trip.service';

type SelectableEntity = ILocation | ITrip;

@Component({
  selector: 'jhi-container-update',
  templateUrl: './container-update.component.html'
})
export class ContainerUpdateComponent implements OnInit {
  isSaving = false;
  locations: ILocation[] = [];
  trips: ITrip[] = [];
  pickupDp: any;
  dropDp: any;

  editForm = this.fb.group({
    id: [],
    number: [],
    tripType: [],
    pickup: [],
    drop: [],
    containerSize: [],
    createdDate: [],
    createdBy: [],
    lastModifiedDate: [],
    lastModifiedBy: [],
    pickupLocation: [],
    dropLocation: [],
    trip: []
  });

  constructor(
    protected containerService: ContainerService,
    protected locationService: LocationService,
    protected tripService: TripService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ container }) => {
      if (!container.id) {
        const today = moment().startOf('day');
        container.createdDate = today;
        container.lastModifiedDate = today;
      }

      this.updateForm(container);

      this.locationService.query().subscribe((res: HttpResponse<ILocation[]>) => (this.locations = res.body || []));

      this.tripService.query().subscribe((res: HttpResponse<ITrip[]>) => (this.trips = res.body || []));
    });
  }

  updateForm(container: IContainer): void {
    this.editForm.patchValue({
      id: container.id,
      number: container.number,
      tripType: container.tripType,
      pickup: container.pickup,
      drop: container.drop,
      containerSize: container.containerSize,
      createdDate: container.createdDate ? container.createdDate.format(DATE_TIME_FORMAT) : null,
      createdBy: container.createdBy,
      lastModifiedDate: container.lastModifiedDate ? container.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: container.lastModifiedBy,
      pickupLocation: container.pickupLocation,
      dropLocation: container.dropLocation,
      trip: container.trip
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const container = this.createFromForm();
    if (container.id !== undefined) {
      this.subscribeToSaveResponse(this.containerService.update(container));
    } else {
      this.subscribeToSaveResponse(this.containerService.create(container));
    }
  }

  private createFromForm(): IContainer {
    return {
      ...new Container(),
      id: this.editForm.get(['id'])!.value,
      number: this.editForm.get(['number'])!.value,
      tripType: this.editForm.get(['tripType'])!.value,
      pickup: this.editForm.get(['pickup'])!.value,
      drop: this.editForm.get(['drop'])!.value,
      containerSize: this.editForm.get(['containerSize'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      createdBy: this.editForm.get(['createdBy'])!.value,
      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
        ? moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
      pickupLocation: this.editForm.get(['pickupLocation'])!.value,
      dropLocation: this.editForm.get(['dropLocation'])!.value,
      trip: this.editForm.get(['trip'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContainer>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
