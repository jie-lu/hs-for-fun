import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { delay } from 'rxjs/operators';

@Injectable()
export class CardResolver implements Resolve<any> {
	
	constructor(private http: HttpClient) {}

	resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
		return this.http.get('assets/card-backs/ventus_back.jpg', {
			headers: {
				Accept: '*/*'
			},
			responseType: 'arraybuffer'
		});
	}
}
