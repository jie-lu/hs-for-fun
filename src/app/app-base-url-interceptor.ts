import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppBaseUrlInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
		const baseUrl = document.getElementsByTagName('base')[0].href;
		const apiReq = req.clone({ url: `${baseUrl}${req.url}`});
		return next.handle(apiReq);
	}
}
