import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private httpClient: HttpClient) { }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getcount}`);
  }
}
