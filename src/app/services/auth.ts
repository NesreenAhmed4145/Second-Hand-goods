

import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { signal } from '@angular/core'; // ضيفيها فوق في الـ imports

// جوه الكلاس AuthService:
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSig = signal<any | null>(null);

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // متغير لمراقبة حالة المستخدم (هل هو مسجل دخول أم لا)
  user$ = user(this.auth);

  // 1. دالة التسجيل (تنشئ حساب + تحفظ بيانات البروفايل في Firestore)
  register(email: string, pass: string, name: string, phone: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, pass).then(response => {
      const userId = response.user.uid;
      // حفظ البيانات الإضافية في Firestore
      const userDocRef = doc(this.firestore, 'users', userId);
      return setDoc(userDocRef, {
        email: email,
        username: name,
        phoneNumber: phone,
        joinedDate: new Date(),
        role: 'user' // default role
      });
    });
    return from(promise); 
  }

  login(email: string, pass: string): Observable<any> {
    const promise = signInWithEmailAndPassword(this.auth, email, pass);
    return from(promise);
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  getUserProfile(userId: string): Observable<any> {
    const docRef = doc(this.firestore, 'users', userId);
    return from(getDoc(docRef));
  }
  updateUserProfile(uid: string, data: any): Observable<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    // updateDoc بتعدل بس الحقول اللي بنبعتها، مش بتمسح الباقي
    return from(updateDoc(userDocRef, data));
}
}