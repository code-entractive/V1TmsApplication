import { ContainerService } from './../container/container.service';
import { Container } from './../../shared/model/container.model';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { ITrip, Trip } from 'app/shared/model/trip.model';
import { TripService } from './trip.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ILocation } from 'app/shared/model/location.model';
import { LocationService } from 'app/entities/location/location.service';
import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from 'app/entities/customer/customer.service';
import { IDriver } from 'app/shared/model/driver.model';
import { DriverService } from 'app/entities/driver/driver.service';
import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from 'app/entities/equipment/equipment.service';
import { ICarrier } from 'app/shared/model/carrier.model';
import { CarrierService } from 'app/entities/carrier/carrier.service';

type SelectableEntity = ILocation | ICustomer | IDriver | IEquipment | ICarrier;

@Component({
  selector: 'jhi-trip-update',
  templateUrl: './trip-updatenew.component.html'
})
export class TripUpdateComponent implements OnInit {
  j = 1;
  newDynamic: any = new Container();
  dynamicArray: Array<Container> = [];
  indexSize = 1;
  grantTotal = 0;
  advanceTotal = 0;

  isSaving = false;
  locations: ILocation[] = [];
  customers: ICustomer[] = [];
  drivers: IDriver[] = [];
  equipment: IEquipment[] = [];
  carriers: ICarrier[] = [];
  pickupDp: any;
  dropDp: any;

  editForm = this.fb.group({
    id: [],
    customTripNumber: [],
    description: [],
    tripType: [],
    shipmentNumber: [],
    orderNumber: [],
    bol: [],
    pickup: [],
    drop: [],
    currentLocation: [],
    status: [],
    detention: [],
    chasisInTime: [],
    orderDocument: [],
    orderDocumentContentType: [],
    pod: [],
    podContentType: [],
    hazmat: [],
    refrigerated: [],
    liftgate: [],
    recievedBy: [],
    coveredBy: [],
    loadType: [],
    containerSize: [],
    numbersOfContainer: [],
    comments: [],
    autoGenerateInvoice: [],
    createdDate: [],
    createdBy: [],
    lastModifiedDate: [],
    lastModifiedBy: [],
    pickupLocation: [],
    dropLocation: [],
    customer: [],
    driver: [],
    equipment: [],
    carrier: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected tripService: TripService,
    protected locationService: LocationService,
    protected customerService: CustomerService,
    protected containerService: ContainerService,
    protected driverService: DriverService,
    protected equipmentService: EquipmentService,
    protected carrierService: CarrierService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trip }) => {
      if (!trip.id) {
        const today = moment().startOf('day');
        trip.chasisInTime = today;
        trip.createdDate = today;
        trip.lastModifiedDate = today;
      }

      if (trip.containers !== undefined) {
        this.dynamicArray = trip.containers;
      } else {
        this.newDynamic = {
          id: null,
          pickup: moment()
            .startOf('day')
            .format(DATE_FORMAT),
          size: 207
        };
        this.dynamicArray.push(this.newDynamic);
      }

      this.updateForm(trip);

      this.locationService.query().subscribe((res: HttpResponse<ILocation[]>) => (this.locations = res.body || []));

      this.customerService.query().subscribe((res: HttpResponse<ICustomer[]>) => (this.customers = res.body || []));

      this.driverService.query().subscribe((res: HttpResponse<IDriver[]>) => (this.drivers = res.body || []));

      this.equipmentService.query().subscribe((res: HttpResponse<IEquipment[]>) => (this.equipment = res.body || []));

      this.carrierService.query().subscribe((res: HttpResponse<ICarrier[]>) => (this.carriers = res.body || []));
    });
  }

  updateForm(trip: ITrip): void {
    this.editForm.patchValue({
      id: trip.id,
      customTripNumber: trip.customTripNumber,
      description: trip.description,
      tripType: trip.tripType,
      shipmentNumber: trip.shipmentNumber,
      orderNumber: trip.orderNumber,
      bol: trip.bol,
      pickup: trip.pickup,
      drop: trip.drop,
      currentLocation: trip.currentLocation,
      status: trip.status,
      detention: trip.detention,
      chasisInTime: trip.chasisInTime ? trip.chasisInTime.format(DATE_TIME_FORMAT) : null,
      orderDocument: trip.orderDocument,
      orderDocumentContentType: trip.orderDocumentContentType,
      pod: trip.pod,
      podContentType: trip.podContentType,
      hazmat: trip.hazmat,
      refrigerated: trip.refrigerated,
      liftgate: trip.liftgate,
      recievedBy: trip.recievedBy,
      coveredBy: trip.coveredBy,
      loadType: trip.loadType,
      containerSize: trip.containerSize,
      numbersOfContainer: trip.numbersOfContainer,
      comments: trip.comments,
      autoGenerateInvoice: trip.autoGenerateInvoice,
      createdDate: trip.createdDate ? trip.createdDate.format(DATE_TIME_FORMAT) : null,
      createdBy: trip.createdBy,
      lastModifiedDate: trip.lastModifiedDate ? trip.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: trip.lastModifiedBy,
      pickupLocation: trip.pickupLocation,
      dropLocation: trip.dropLocation,
      customer: trip.customer,
      driver: trip.driver,
      equipment: trip.equipment,
      carrier: trip.carrier
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('tmsV1ApplicationApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trip = this.createFromForm();
    if (trip.id !== undefined) {
      this.subscribeToSaveResponse(this.tripService.update(trip));
    } else {
      this.subscribeToSaveResponse(this.tripService.create(trip));
    }
  }

  private createFromForm(): ITrip {
    return {
      ...new Trip(),
      id: this.editForm.get(['id'])!.value,
      customTripNumber: this.editForm.get(['customTripNumber'])!.value,
      description: this.editForm.get(['description'])!.value,
      tripType: this.editForm.get(['tripType'])!.value,
      shipmentNumber: this.editForm.get(['shipmentNumber'])!.value,
      orderNumber: this.editForm.get(['orderNumber'])!.value,
      bol: this.editForm.get(['bol'])!.value,
      pickup: this.editForm.get(['pickup'])!.value,
      drop: this.editForm.get(['drop'])!.value,
      currentLocation: this.editForm.get(['currentLocation'])!.value,
      status: this.editForm.get(['status'])!.value,
      detention: this.editForm.get(['detention'])!.value,
      chasisInTime: this.editForm.get(['chasisInTime'])!.value
        ? moment(this.editForm.get(['chasisInTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      orderDocumentContentType: this.editForm.get(['orderDocumentContentType'])!.value,
      orderDocument: this.editForm.get(['orderDocument'])!.value,
      podContentType: this.editForm.get(['podContentType'])!.value,
      pod: this.editForm.get(['pod'])!.value,
      hazmat: this.editForm.get(['hazmat'])!.value,
      refrigerated: this.editForm.get(['refrigerated'])!.value,
      liftgate: this.editForm.get(['liftgate'])!.value,
      recievedBy: this.editForm.get(['recievedBy'])!.value,
      coveredBy: this.editForm.get(['coveredBy'])!.value,
      loadType: this.editForm.get(['loadType'])!.value,
      containerSize: this.editForm.get(['containerSize'])!.value,
      numbersOfContainer: this.editForm.get(['numbersOfContainer'])!.value,
      comments: this.editForm.get(['comments'])!.value,
      autoGenerateInvoice: this.editForm.get(['autoGenerateInvoice'])!.value,
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
      customer: this.editForm.get(['customer'])!.value,
      driver: this.editForm.get(['driver'])!.value,
      equipment: this.editForm.get(['equipment'])!.value,
      carrier: this.editForm.get(['carrier'])!.value,
      containers: this.dynamicArray
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrip>>): void {
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

  addRow(index: number): any {
    this.indexSize = index + 1;
    const today = moment().format(DATE_FORMAT);
    //  this.dynamicArray.push({ number: '', pickup: moment(today) ,drop: moment(today)  , pickupLocation: , dropLocation :null });
    this.calculateTotal();
    return true;
  }

  deleteRow(index: number): any {
    if (this.dynamicArray.length === 1) {
      // this.calculateTotal();
      return false;
    } else {
      const id = this.dynamicArray[index].id;
      if (id !== undefined) {
        this.containerService.delete(id).subscribe(() => {});
      }

      this.dynamicArray.splice(index, 1);
      //  this.calculateTotal();
      return true;
    }
  }

  calculateTotal(): any {
    alert(' some thing happend');
  }

  CoveredByChanged(): any {}
}
