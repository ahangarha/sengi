import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiRoutes } from './models/api.settings';
import { AppData, TokenData } from "./models/mastodon.interfaces";


@Injectable()
export class AuthService {  
    private apiRoutes = new ApiRoutes();

    constructor(
        private readonly httpClient: HttpClient) {
    }

    getInstanceLoginUrl(instance: string, client_id: string, redirect_uri: string): string{
        return `https://${instance}/oauth/authorize?scope=${encodeURIComponent('read write follow')}&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&client_id=${client_id}&force_login=true`;
    }

    getToken(instance: string, client_id: string, client_secret: string, code: string, redirect_uri: string): Promise<TokenData> {
        const encodedRedirectUri = encodeURIComponent(redirect_uri);
        const url = `https://${instance}/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=authorization_code&code=${code}&redirect_uri=${encodedRedirectUri}`;

        const bodyLoad = {
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri,
            'code': code
        };

        return this.httpClient.post<TokenData>(url, bodyLoad).toPromise();
    }

    refreshToken(instance: string, client_id: string, client_secret: string, refresh_token: string): Promise<TokenData>  {
        const url = `https://${instance}/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refresh_token}&scope=${encodeURIComponent('read write follow')}`;

        const bodyLoad = {
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'scope': 'read write follow'
        };

        return this.httpClient.post<TokenData>(url, bodyLoad).toPromise();
    }

    createNewApplication(instance: string, appName: string, redirectUrl: string, scopes: string, website: string): Promise<AppData> {
        const url = 'https://' + instance + this.apiRoutes.createApp;

        const formData = new FormData();
        formData.append('client_name', appName);
        formData.append('redirect_uris', redirectUrl);
        formData.append('scopes', scopes);
        formData.append('website', website);

        return this.httpClient.post<AppData>(url, formData).toPromise();
    }
}

export class CurrentAuthProcess {
    constructor(public instance: string) { }
}