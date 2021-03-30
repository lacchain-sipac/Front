import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {
  public _baseUri: string;
  private headersOctet = new HttpHeaders({
    'Content-Type': 'application/octet-stream',
  });

  constructor(private http: HttpClient) {}

  set(baseUri: string): void {
    this._baseUri = baseUri;
  }

  execPostJson(data?: any, headers?: HttpHeaders): Observable<any> {
    return this.http
      .post(this._baseUri, data, {
        headers,
        observe: 'response',
      })
      .pipe(map((response) => response.body));
  }

  execPostFormData(data?: any): Observable<any> {
    return this.http.post(this._baseUri, data);
  }

  execGetJson(headers?: HttpHeaders, data?: any): Observable<any> {
    return this.http
      .get(this._baseUri, {
        params: data,
        headers,
        observe: 'response',
      })
      .pipe(map((response) => response.body));
  }

  execGetOctet(data?: any): Observable<any> {
    return this.http.get(this._baseUri, {
      params: data,
      headers: this.headersOctet,
      responseType: 'blob',
    });
  }

  execPutJson(data?: any, headers?: HttpHeaders): Observable<any> {
    return this.http
      .put(this._baseUri, data, { headers, observe: 'response' })
      .pipe(map((response) => response.body));
  }

  execDeleteJson(body?: any, headers?: HttpHeaders): Observable<any> {
    const options = { headers, body };
    return this.http.delete(this._baseUri, options);
  }
}
