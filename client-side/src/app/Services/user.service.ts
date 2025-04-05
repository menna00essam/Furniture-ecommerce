import { Injectable } from '@angular/core';
import { user } from '../Models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private userSubject = new BehaviorSubject<user | null>(null);

  apiUrl = 'http://localhost:5000/users/profile';
  user$ = this.userSubject.asObservable();

  getUser(): Observable<user> {
    return this.http
      .get<{ status: string; data: { user: any } }>(this.apiUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map(({ data: { user } }) => {
          const { email, username, _id, thumbnail } = user;
          console.log(thumbnail);
          return {
            email,
            name: username,
            id: _id,
            thumbnail,
          } as user;
        }),
        tap((u) => this.userSubject.next(u))
      );
  }
  changePassword(password: string) {
    return this.http
      .put<{ status: string; message: string }>(
        `${this.apiUrl}/change-password`,
        { password },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => {
          if (response.status === 'success') {
            console.log('Password changed successfully');
          }
        })
      );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  updateUserImageLocally(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    const folderPath = 'profileIMGs';
    formData.append('folder', folderPath);
    return this.http
      .post('https://api.cloudinary.com/v1_1/dddhappm3/image/upload', formData)
      .pipe(
        tap((res: any) => {
          const imageUrl = res.secure_url;
          this.updateUserImage(imageUrl).subscribe(() => {
            console.log('User image updated!');
            this.getUser().subscribe((updatedUser) => {
              this.userSubject.next(updatedUser);
            });
          });
        })
      );
  }

  updateUserImage(imageUrl: string) {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/change-img`,
      { thumbnail: imageUrl },
      { headers: this.getAuthHeaders() }
    );
  }
}
