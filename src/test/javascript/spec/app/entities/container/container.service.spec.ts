import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ContainerService } from 'app/entities/container/container.service';
import { IContainer, Container } from 'app/shared/model/container.model';
import { TripType } from 'app/shared/model/enumerations/trip-type.model';
import { SizeEnum } from 'app/shared/model/enumerations/size-enum.model';

describe('Service Tests', () => {
  describe('Container Service', () => {
    let injector: TestBed;
    let service: ContainerService;
    let httpMock: HttpTestingController;
    let elemDefault: IContainer;
    let expectedResult: IContainer | IContainer[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ContainerService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Container(
        0,
        'AAAAAAA',
        TripType.PICKUP,
        currentDate,
        currentDate,
        SizeEnum.C53,
        currentDate,
        'AAAAAAA',
        currentDate,
        'AAAAAAA'
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            pickup: currentDate.format(DATE_FORMAT),
            drop: currentDate.format(DATE_FORMAT),
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            lastModifiedDate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Container', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            pickup: currentDate.format(DATE_FORMAT),
            drop: currentDate.format(DATE_FORMAT),
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            lastModifiedDate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            pickup: currentDate,
            drop: currentDate,
            createdDate: currentDate,
            lastModifiedDate: currentDate
          },
          returnedFromService
        );

        service.create(new Container()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Container', () => {
        const returnedFromService = Object.assign(
          {
            number: 'BBBBBB',
            tripType: 'BBBBBB',
            pickup: currentDate.format(DATE_FORMAT),
            drop: currentDate.format(DATE_FORMAT),
            containerSize: 'BBBBBB',
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            createdBy: 'BBBBBB',
            lastModifiedDate: currentDate.format(DATE_TIME_FORMAT),
            lastModifiedBy: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            pickup: currentDate,
            drop: currentDate,
            createdDate: currentDate,
            lastModifiedDate: currentDate
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Container', () => {
        const returnedFromService = Object.assign(
          {
            number: 'BBBBBB',
            tripType: 'BBBBBB',
            pickup: currentDate.format(DATE_FORMAT),
            drop: currentDate.format(DATE_FORMAT),
            containerSize: 'BBBBBB',
            createdDate: currentDate.format(DATE_TIME_FORMAT),
            createdBy: 'BBBBBB',
            lastModifiedDate: currentDate.format(DATE_TIME_FORMAT),
            lastModifiedBy: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            pickup: currentDate,
            drop: currentDate,
            createdDate: currentDate,
            lastModifiedDate: currentDate
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Container', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
