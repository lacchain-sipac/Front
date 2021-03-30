import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, filter, switchMap, retryWhen, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { RETRY_SECONDS } from '@shared/helpers';

@Injectable({ providedIn: 'root' })

export class WebSocketService {
    connection$: WebSocketSubject<any>;

    connect(): Observable<any> {
        return of(environment.pathWebSockets.auth).pipe(
            filter(apiUrl => !!apiUrl),
            map(apiUrl => apiUrl.replace(/^http/, 'ws')),
            switchMap(wsUrl => {
                if (this.connection$) {
                    return this.connection$;
                } else {
                    this.connection$ = webSocket(wsUrl);
                    return this.connection$;
                }
            }),
            retryWhen((errors) => {
                console.log('errors', errors);
                return errors.pipe(delay(RETRY_SECONDS))
            })
        );
    }

    send(data: any) {
        if (this.connection$) {
            this.connection$.next(data);
        }
    }

    closeConnection() {
        if (this.connection$) {
            this.connection$.complete();
            this.connection$ = null;
        }
    }
}
