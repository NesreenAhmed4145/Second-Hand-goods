import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../Models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // 1. Create a property to hold the observable
  categories$: Observable<Category[]>;

  constructor(private firestore: AngularFirestore) {
    // 2. Initialize the query INSIDE the constructor
    // This fixes the "inject() must be called from an injection context" error
    this.categories$ = this.firestore
      .collection<Category>('categories')
      .valueChanges({ idField: 'id' });
  }

  getCategories(): Observable<Category[]> {
    // 3. Return the pre-loaded observable
    return this.categories$;
  }
}