// src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth'; // Adjust path

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // You need to get the user's status synchronously (or wait for the first value).
  // The simplest way to handle an Observable in a guard is usually by using 
  // a tool like lastValueFrom or by ensuring your auth service provides a synchronous flag.
  
  // Assuming AuthService provides a way to check synchronously (e.g., using a BehaviorSubject or Signal):
  // Since you are using user$ observable:
  
  return new Promise(resolve => {
    authService.user$.subscribe(user => {
      if (user) {
        resolve(true); // User is logged in, allow access
      } else {
        router.navigate(['/login']); // Not logged in, redirect to login
        resolve(false); // Block access
      }
    });
  });
};