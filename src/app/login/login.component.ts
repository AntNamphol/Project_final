import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { GetApiService } from '../get-api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = ''; // Initialize with an empty string
  password: string = ''; // Initialize with an empty string
  loginMessage: string = ''; // Initialize the login message

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
    ,private GetApiService:GetApiService
  ) { }

  login(): void {
    const url = 'http://localhost/backend/login.php';

    const data = { username: this.username, password: this.password };

    // Make the HTTP request to the PHP server
    this.http.post(url, data).subscribe(
      (response: any) => {
        // GET SESSION FROM PHP
        sessionStorage.setItem('username', this.username);
        sessionStorage.setItem('user_fname', response.user_fname);
        sessionStorage.setItem('user_lname', response.user_lname);
        sessionStorage.setItem('user_id', response.user_id);
        sessionStorage.setItem('userlv_id', response.userlv_id);
        sessionStorage.setItem('username', JSON.stringify(response.username));

        console.log(response);

        // Redirect to the dashboard if logged in
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
        } else {
          console.log('Please log in first.');
        }

        if(response.userlv_id == 5){
           this.router.navigate(['/edu']);
        }if(response.userlv_id == 1){
          this.router.navigate(['/afbstate']);
        }
        if(response.userlv_id == 2){
          this.router.navigate(['/allitem']);
        }
      },
      (error) => {
        // Handle login error
        console.log(error);
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');

      }
    );
  }
  register(){
    this.router.navigate(['register']);
  }
  forgotPass(){
    this.router.navigate(['fgp']);
  }
}
