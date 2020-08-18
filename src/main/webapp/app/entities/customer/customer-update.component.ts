import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { ICustomer, Customer } from 'app/shared/model/customer.model';
import { CustomerService } from './customer.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ProductItemService } from 'app/entities/product-item/product-item.service';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss']
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;
  productitems: IProductItem[] = [];
  customerSinceDp: any;

  editForm = this.fb.group({
    id: [],
    company: [],
    firstName: [],
    lastName: [],
    contactDesignation: [],
    email: [],
    phoneNumber: [],
    phoneNumberExtention: [],
    preffredContactType: [],
    website: [],
    alternateContactPerson: [],
    alternateContactNumber: [],
    alternatePhoneNumberExtention: [],
    alternateContactEmail: [],
    preferredContactTime: [],
    fax: [],
    address: [],
    streetAddress: [],
    city: [],
    stateProvince: [],
    country: [],
    postalCode: [],
    dot: [],
    mc: [],
    taxId: [],
    companyLogo: [],
    companyLogoContentType: [],
    customerSince: [],
    notes: [],
    contract: [],
    contractContentType: [],
    status: [],
    preffredCurrency: [],
    payterms: [],
    timeZone: [],
    createdDate: [],
    createdBy: [],
    lastModifiedDate: [],
    lastModifiedBy: [],
    charges: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected customerService: CustomerService,
    protected productItemService: ProductItemService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      if (!customer.id) {
        const today = moment().startOf('day');
        customer.preferredContactTime = today;
        customer.timeZone = today;
        customer.createdDate = today;
        customer.lastModifiedDate = today;
      }

      this.updateForm(customer);

      this.productItemService.query().subscribe((res: HttpResponse<IProductItem[]>) => (this.productitems = res.body || []));
    });
  }

  updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      company: customer.company,
      firstName: customer.firstName,
      lastName: customer.lastName,
      contactDesignation: customer.contactDesignation,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      phoneNumberExtention: customer.phoneNumberExtention,
      preffredContactType: customer.preffredContactType,
      website: customer.website,
      alternateContactPerson: customer.alternateContactPerson,
      alternateContactNumber: customer.alternateContactNumber,
      alternatePhoneNumberExtention: customer.alternatePhoneNumberExtention,
      alternateContactEmail: customer.alternateContactEmail,
      preferredContactTime: customer.preferredContactTime ? customer.preferredContactTime.format(DATE_TIME_FORMAT) : null,
      fax: customer.fax,
      address: customer.address,
      streetAddress: customer.streetAddress,
      city: customer.city,
      stateProvince: customer.stateProvince,
      country: customer.country,
      postalCode: customer.postalCode,
      dot: customer.dot,
      mc: customer.mc,
      taxId: customer.taxId,
      companyLogo: customer.companyLogo,
      companyLogoContentType: customer.companyLogoContentType,
      customerSince: customer.customerSince,
      notes: customer.notes,
      contract: customer.contract,
      contractContentType: customer.contractContentType,
      status: customer.status,
      preffredCurrency: customer.preffredCurrency,
      payterms: customer.payterms,
      timeZone: customer.timeZone ? customer.timeZone.format(DATE_TIME_FORMAT) : null,
      createdDate: customer.createdDate ? customer.createdDate.format(DATE_TIME_FORMAT) : null,
      createdBy: customer.createdBy,
      lastModifiedDate: customer.lastModifiedDate ? customer.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: customer.lastModifiedBy,
      charges: customer.charges
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (customer.id !== undefined) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  private createFromForm(): ICustomer {
    return {
      ...new Customer(),
      id: this.editForm.get(['id'])!.value,
      company: this.editForm.get(['company'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      contactDesignation: this.editForm.get(['contactDesignation'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      phoneNumberExtention: this.editForm.get(['phoneNumberExtention'])!.value,
      preffredContactType: this.editForm.get(['preffredContactType'])!.value,
      website: this.editForm.get(['website'])!.value,
      alternateContactPerson: this.editForm.get(['alternateContactPerson'])!.value,
      alternateContactNumber: this.editForm.get(['alternateContactNumber'])!.value,
      alternatePhoneNumberExtention: this.editForm.get(['alternatePhoneNumberExtention'])!.value,
      alternateContactEmail: this.editForm.get(['alternateContactEmail'])!.value,
      preferredContactTime: this.editForm.get(['preferredContactTime'])!.value
        ? moment(this.editForm.get(['preferredContactTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      fax: this.editForm.get(['fax'])!.value,
      address: this.editForm.get(['address'])!.value,
      streetAddress: this.editForm.get(['streetAddress'])!.value,
      city: this.editForm.get(['city'])!.value,
      stateProvince: this.editForm.get(['stateProvince'])!.value,
      country: this.editForm.get(['country'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      dot: this.editForm.get(['dot'])!.value,
      mc: this.editForm.get(['mc'])!.value,
      taxId: this.editForm.get(['taxId'])!.value,
      companyLogoContentType: this.editForm.get(['companyLogoContentType'])!.value,
      companyLogo: this.editForm.get(['companyLogo'])!.value,
      customerSince: this.editForm.get(['customerSince'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      contractContentType: this.editForm.get(['contractContentType'])!.value,
      contract: this.editForm.get(['contract'])!.value,
      status: this.editForm.get(['status'])!.value,
      preffredCurrency: this.editForm.get(['preffredCurrency'])!.value,
      payterms: this.editForm.get(['payterms'])!.value,
      timeZone: this.editForm.get(['timeZone'])!.value ? moment(this.editForm.get(['timeZone'])!.value, DATE_TIME_FORMAT) : undefined,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      createdBy: this.editForm.get(['createdBy'])!.value,
      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
        ? moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
      charges: this.editForm.get(['charges'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
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

  trackById(index: number, item: IProductItem): any {
    return item.id;
  }

  getSelected(selectedVals: IProductItem[], option: IProductItem): IProductItem {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
