import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CardResolver implements Resolve<any> {
	
	constructor(private http: HttpClient) {}

	resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
		return this.http.get('assets/ventus_back.jpg', {
			headers: {
				Accept: '*/*'
			},
			responseType: 'arraybuffer'
		});
	}
}
