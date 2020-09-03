import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Search } from 'app/shared/util/request-util';
import { IContainer } from 'app/shared/model/container.model';

type EntityResponseType = HttpResponse<IContainer>;
type EntityArrayResponseType = HttpResponse<IContainer[]>;

@Injectable({ providedIn: 'root' })
export class ContainerService {
  public resourceUrl = SERVER_API_URL + 'api/containers';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/containers';

  constructor(protected http: HttpClient) {}

  create(container: IContainer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(container);
    return this.http
      .post<IContainer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(container: IContainer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(container);
    return this.http
      .put<IContainer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IContainer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IContainer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IContainer[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(container: IContainer): IContainer {
    const copy: IContainer = Object.assign({}, container, {
      pickup: container.pickup && container.pickup.isValid() ? container.pickup.format(DATE_FORMAT) : undefined,
      drop: container.drop && container.drop.isValid() ? container.drop.format(DATE_FORMAT) : undefined,
      createdDate: container.createdDate && container.createdDate.isValid() ? container.createdDate.toJSON() : undefined,
      lastModifiedDate: container.lastModifiedDate && container.lastModifiedDate.isValid() ? container.lastModifiedDate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.pickup = res.body.pickup ? moment(res.body.pickup) : undefined;
      res.body.drop = res.body.drop ? moment(res.body.drop) : undefined;
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.lastModifiedDate = res.body.lastModifiedDate ? moment(res.body.lastModifiedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((container: IContainer) => {
        container.pickup = container.pickup ? moment(container.pickup) : undefined;
        container.drop = container.drop ? moment(container.drop) : undefined;
        container.createdDate = container.createdDate ? moment(container.createdDate) : undefined;
        container.lastModifiedDate = container.lastModifiedDate ? moment(container.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
