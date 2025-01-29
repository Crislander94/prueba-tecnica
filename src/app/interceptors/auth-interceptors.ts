import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { WITH_TOKEN } from "./context.interceptors";
import { isPlatformBrowser } from "@angular/common";
import { inject, PLATFORM_ID } from "@angular/core";

export const authInterceptors = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const isBrowser = isPlatformBrowser( inject(PLATFORM_ID ) );

    if( !isBrowser ) return next( req );
    if (req.context.get(WITH_TOKEN)) {
        const token = localStorage.getItem('token') || "";
        const newReq = req.clone({
            headers: req.headers.append('Authorization', `Bearer ${token}`),
        });
        
        return next(newReq);
    }

    return next(req);
}