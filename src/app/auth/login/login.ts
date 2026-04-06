import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth'; // تأكدي من مسار السيرفس

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})



export class Login {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: () => {
        // 1. مسحنا الـ alert من هنا
        console.log('Login Successful'); // رسالة ليكي انتي في الـ Console
        this.router.navigate(['/Profile']); // يحولك علطول
      },
      error: (err) => {
        // 2. مسحنا الـ alert من هنا وخلينا الرسالة تظهر في المتغير عشان تظهر في الـ HTML
        this.errorMessage = 'Incorrect email or password.';
        console.error(err); 
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }

  }
}