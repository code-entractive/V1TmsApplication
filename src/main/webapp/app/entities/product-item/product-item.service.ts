import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IProductItem } from 'app/shared/model/product-item.model';

type EntityResponseType = HttpResponse<IProductItem>;
type EntityArrayResponseType = HttpResponse<IProductItem[]>;

@Injectable({ providedIn: 'root' })
export class ProductItemService {
  public resourceUrl = SERVER_API_URL + 'api/product-items';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/product-items';

  constructor(protected http: HttpClient) {}

  create(productItem: IProductItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productItem);
    return this.http
      .post<IProductItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productItem: IProductItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productItem);
    return this.http
      .put<IProductItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductItem[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(productItem: IProductItem): IProductItem {
    const copy: IProductItem = Object.assign({}, productItem, {
      createdDate: productItem.createdDate && productItem.createdDate.isValid() ? productItem.createdDate.toJSON() : undefined,
      lastModifiedDate:
        productItem.lastModifiedDate && productItem.lastModifiedDate.isValid() ? productItem.lastModifiedDate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.lastModifiedDate = res.body.lastModifiedDate ? moment(res.body.lastModifiedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productItem: IProductItem) => {
        productItem.createdDate = productItem.createdDate ? moment(productItem.createdDate) : undefined;
        productItem.lastModifiedDate = productItem.lastModifiedDate ? moment(productItem.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
