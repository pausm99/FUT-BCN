import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { environment } from '../../../environments/environment';

const API_URL = environment.api_url;

interface UserSimple {
  id: number;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userInfo = signal<UserSimple>({
    id: 0,
    email: '',
    name: '',
    role: ''
  });

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post<User>(`${API_URL}/user/register`, user);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/user/byMail/${email}`);
  }

  login(body: any): Observable<User> {
    return this.http.post<User>(`${API_URL}/user/login`, body);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/user/${id}`);
  }

  logout() {
    return this.http.post<any>(`${API_URL}/user/logout`, null);
  }
}
