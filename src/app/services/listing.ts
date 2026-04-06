import { Injectable, Injector, runInInjectionContext, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable , from, map } from 'rxjs';
// Note: increment is imported from new library, but used with old library syntax.
// This is typically fine as long as you use the compat update function.
import { increment as compatIncrement } from '@angular/fire/firestore'; 
import { Listing } from '../Models/listing.model';
import { Review } from '../Models/review.model';
// New Firestore imports
import { Firestore, collection, doc, setDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';


interface WishlistItem {
 userId: string;
 listingId: string;
 addedDate: Date;
}

@Injectable({
  providedIn: 'root'
})

export class ListingService {
    // Injecting services using the modern 'inject' function
    private compatFirestore: AngularFirestore = inject(AngularFirestore);
    private firestore: Firestore = inject(Firestore);
    
    // ✅ FIX 1: Declare injector as a private property
    private injector: Injector = inject(Injector); 

    // ✅ FIX 2: Constructor signature corrected
    constructor() {}

  
  // All existing functions are updated to use 'this.compatFirestore'
  
  // ✅ 1. Get All Listings (For Search/Analytics)
  getAllListings(): Observable<any[]> {
 return runInInjectionContext(this.injector, () => {
   return this.compatFirestore // <-- Use compatFirestore for old syntax
 .collection('listings')
 .valueChanges({ idField: 'id' });
 });
  }

  // ✅ 2. Get by Category
  getListingsByCategoryId(catId: string): Observable<any[]> {
 return runInInjectionContext(this.injector, () => {
   return this.compatFirestore // <-- Use compatFirestore for old syntax
 .collection('listings', ref => ref.where('categoryId', '==', catId))
 .valueChanges({ idField: 'id' });
 });
  }

  // ✅ 3. Get Single Listing (For Details Page)
  getListingById(id: string): Observable<any> {
 return runInInjectionContext(this.injector, () => {
   return this.compatFirestore // <-- Use compatFirestore for old syntax
 .collection('listings')
 .doc(id)
 .valueChanges();
 });
  }

  // ✅ 4. Add Review
  addReview(review: Review) {
 return runInInjectionContext(this.injector, () => {
   return this.compatFirestore // <-- Use compatFirestore for old syntax
 .collection('reviews')
 .add(review);
 });
  }

  // ✅ 5. Get Reviews
  getReviews(listingId: string): Observable<Review[]> {
 return runInInjectionContext(this.injector, () => {
   return this.compatFirestore // <-- Use compatFirestore for old syntax
 .collection<Review>('reviews', ref => 
   ref.where('listingId', '==', listingId).orderBy('date', 'desc')
 )
 .valueChanges({ idField: 'id' });
 });
  }

  // ✅ 6. Increment View Count
  incrementView(listingId: string) {
 return runInInjectionContext(this.injector, () => {
   return this.compatFirestore // <-- Use compatFirestore for old syntax
 .doc('listings/' + listingId)
 .update({ views: compatIncrement(1) }); // Use compatIncrement if imported from compat or standard increment otherwise
 });
  }


// ==========================================================
// WRITE FUNCTIONS 
// ==========================================================

addListing(listing: Listing): Promise<any> {
 return runInInjectionContext(this.injector, () => {
   return this.compatFirestore // <-- Use compatFirestore for old syntax
 .collection('listings')
 .add(listing);
 });
  }


getCategories(): Observable<any[]> {
  return runInInjectionContext(this.injector, () => {
 return this.compatFirestore // <-- Use compatFirestore for old syntax
   .collection('categories')
   .valueChanges({ idField: 'id' });
  });
}



// ==========================================================
// WISHILIST FUNCTIONS (Using the new 'Firestore' instance)
// ==========================================================

// Function to add a listing to the user's wishlist
 addToWishlist(userId: string, listingId: string): Observable<void> {
 // The ID of the wishlist document should be a combination of userId and listingId
 const wishlistDocId = `${userId}_${listingId}`;
 // ✅ Correct: Using the doc function with the new 'Firestore' instance
 const docRef = doc(this.firestore, 'wishlist', wishlistDocId); 
 
 const promise = setDoc(docRef, {
  userId: userId,
  listingId: listingId,
  addedDate: new Date()
 });
 
 return from(promise);
 }

 // Function to remove a listing from the wishlist
 removeFromWishlist(userId: string, listingId: string): Observable<void> {
 const wishlistDocId = `${userId}_${listingId}`;
 // ✅ Correct: Using the doc function with the new 'Firestore' instance
 const docRef = doc(this.firestore, 'wishlist', wishlistDocId);
 return from(deleteDoc(docRef));
 }
 
 // Function to fetch all wishlist items for a specific user ID
 getUserWishlistIds(userId: string): Observable<string[]> {
 // ✅ Correct: Using the collection function with the new 'Firestore' instance
 const wishlistCollection = collection(this.firestore, 'wishlist'); 
 
 // Create a query to filter documents where userId matches
 const q = query(wishlistCollection, where('userId', '==', userId));
 
 const promise = getDocs(q).then(snapshot => {
 // Return an array of listing IDs
  return snapshot.docs.map(doc => doc.data()['listingId'] as string);
 });
 
 return from(promise);
 }


}