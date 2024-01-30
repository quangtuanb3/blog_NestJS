import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../authentication-service/authentication.service';

export interface UserData {
  items: User[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  },
  links: {
    first: string,
    previous: string,
    next: string
    last: string
  }

}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  findAll({ page = 1, limit = 10 }: { page?: number, limit?: number }): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', String(page)).append('limit', String(limit))
    console.log("params ", params);

    return this.http.get<UserData>('/api/users', { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )

  }
}
