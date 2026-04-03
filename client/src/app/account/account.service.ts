import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject } from 'rxjs';
import { IUser } from '../shared/models/user';
import { IAddress } from '../shared/models/address';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5187/api/'
  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();



  
  constructor(private http: HttpClient, private router: Router) { }

 loadcurrentUser(token: string | null): Observable<IUser | null> {
  if (!token) {
    this.currentUserSource.next(null);
    return of(null);
  }



    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        this.persistUser(user);
        return user;
      }),
      catchError(() => {
        localStorage.removeItem('token');
        this.currentUserSource.next(null);
        return of(null);
      })
    );
    }


  login(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        this.persistUser(user);
        return user;
      })
    );
  }

  register(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        this.persistUser(user);
        return user;
      })
    );
  }

  loginWithGoogle(idToken: string) {
    return this.http.post<IUser>(this.baseUrl + 'account/google', { idToken }).pipe(
      map((user: IUser) => {
        this.persistUser(user);
        return user;
      })
    );
  }

  getGoogleAuthConfig() {
    return this.http.get<{ clientId: string; enabled: boolean }>(
      this.baseUrl + 'account/google-config'
    );
  }

 logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(this.baseUrl + 'account/emailexists?email=' + email);
  }

  checkUsernameExists(username: string) {
  return this.http.get<boolean>(this.baseUrl + 'account/usernameexists?username=' + username);
}
  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put(this.baseUrl + 'account/address', address);
  }

  private persistUser(user: IUser | null) {
    if (!user) {
      return;
    }

    localStorage.setItem('token', user.token);
    this.currentUserSource.next(user);
  }

}
