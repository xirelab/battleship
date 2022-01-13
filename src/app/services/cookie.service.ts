import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})
export class CookieManagementService {
    constructor(private cookieService: CookieService){}

    getDefaultValues() {
        const user = this.cookieService.get('user_cookie');
        if(!user) {
            const user_cookie = {
                name: '',
                mode: 'tablet',
                ships: 5
            };
            this.setDefaultMode(user_cookie);
            return user_cookie;
        } 
        return JSON.parse(user);
    }

    setDefaultMode = (user: any) => this.cookieService.set('user_cookie', JSON.stringify(user));
}  