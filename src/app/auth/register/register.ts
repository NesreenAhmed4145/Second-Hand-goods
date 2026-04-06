import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // مهم للـ Pipes والـ Directives

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class Register {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  // 1. تحديث الفورم لإضافة Phone
  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    
    // هنا ضفنا شرط رقم التليفون (لازم يكون 11 رقم)
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]] 
  });

 onSubmit() {
  if (this.registerForm.valid) {
    const { email, password, username, phone } = this.registerForm.value;
    
    this.authService.register(email, password, username, phone).subscribe({
      next: () => {
        // مسحنا الـ alert
        console.log('Registration Successful');
        this.router.navigate(['/Login']); // يحولك على البروفايل فوراً
      },
      error: (err) => {
        // مسحنا الـ alert
        console.error(err); // يظهر الخطأ في الـ Console بس
      }
    });
  } else {
    this.registerForm.markAllAsTouched();
  }
}
}