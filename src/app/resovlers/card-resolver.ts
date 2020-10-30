import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { delay } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable()
export class CardResolver implements Resolve<any> {
	
	constructor(private http: HttpClient) {}

	resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
		let defaultCardBack$ = this.http.get('assets/card-backs/ventus_back.jpg', {
			headers: {
				Accept: '*/*'
			},
			responseType: 'arraybuffer'
		});

		const today = new Date()
		if(today.getMonth() == 6 && (today.getDate() >= 16 && today.getDate() <= 19)) {
			let birthdayImage$ = this.http.get('assets/card-backs/happy_birthday_718.png', {
				headers: {
					Accept: '*/*'
				},
				responseType: 'arraybuffer'
			});
			return forkJoin([defaultCardBack$, birthdayImage$]);
		} else if (today.getMonth() == 9 && (today.getDate() >= 30 && today.getDate() <= 31)) {
			let birthdayImage$ = this.http.get('assets/card-backs/happy_birthday_1031.png', {
				headers: {
					Accept: '*/*'
				},
				responseType: 'arraybuffer'
			});
			return forkJoin([defaultCardBack$, birthdayImage$]);
		} else {
			return forkJoin([defaultCardBack$]);
		}
	}
}
