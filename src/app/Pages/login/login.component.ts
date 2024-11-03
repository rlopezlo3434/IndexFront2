import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../model/LoginResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    console.log('Form submitted', this.loginForm.value);
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }

  
}
