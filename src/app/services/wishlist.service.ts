import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, switchMap, tap } from 'rxjs';
import { Auth, user } from '@angular/fire/auth'; // Import for Auth state
import { Firestore, collection, doc, setDoc, deleteDoc, query, where, getDocs, getDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class WishlistService {
  
  // Injections
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  // State
  private _wishlistItems = new BehaviorSubject<string[]>([]);
  public readonly wishlistItems$: Observable<string[]> = this._wishlistItems.asObservable();
  
  // Current User ID
  private currentUserId: string | null = null;

  constructor() {
    this.initWishlistListener();
  }

  // Helper to get the current list synchronously
  get currentItems(): string[] {
    return this._wishlistItems.value;
  }
  
  // ==========================================================
  // 1. Initialization: Listen for user changes and load the list
  // ==========================================================

  private initWishlistListener(): void {
    user(this.auth).subscribe(user => {
      this.currentUserId = user ? user.uid : null;
      if (this.currentUserId) {
        this.loadWishlist(this.currentUserId);
      } else {
        // Clear list if user logs out
        this._wishlistItems.next([]);
      }
    });
  }

  private loadWishlist(userId: string): void {
    const wishlistCollection = collection(this.firestore, 'wishlist');
    const q = query(wishlistCollection, where('userId', '==', userId));
    
    // Fetch documents where userId matches
    from(getDocs(q)).subscribe(snapshot => {
      const listingIds = snapshot.docs.map(doc => doc.data()['listingId'] as string);
      // Update local state with the list from the database
      this._wishlistItems.next(listingIds); 
    });
  }

  // ==========================================================
  // 2. Core Logic: Toggle item and persist to Firebase
  // ==========================================================

  toggleWishlist(listingId: string): void {
    if (!this.currentUserId) {
      console.warn("User not logged in. Cannot update wishlist.");
      // In a real app, you might want to redirect to login here.
      return;
    }
    
    const userId = this.currentUserId;
    const currentList = this.currentItems;
    const docId = `${userId}_${listingId}`;
    const docRef = doc(this.firestore, 'wishlist', docId);

    let dbOperation: Observable<any>;
    let updatedList: string[];
    let action: 'add' | 'remove';

    if (currentList.includes(listingId)) {
      // Action: REMOVE
      action = 'remove';
      updatedList = currentList.filter(id => id !== listingId);
      dbOperation = from(deleteDoc(docRef));
    } else {
      // Action: ADD
      action = 'add';
      updatedList = [...currentList, listingId];
      dbOperation = from(setDoc(docRef, {
        userId: userId,
        listingId: listingId,
        addedDate: new Date()
      }));
    }
    
    // 3. Execute the database operation and then update the local state
    dbOperation.subscribe({
      next: () => {
        // Update the BehaviorSubject ONLY after the database confirms success
        this._wishlistItems.next(updatedList);
        console.log(`Wishlist item ${action}ed successfully.`);
      },
      error: (err) => {
        console.error(`Failed to ${action} item to wishlist:`, err);
        // You might consider rolling back the UI state here if you updated it before DB operation
      }
    });
  }
  
  // Helper function for checking status (used in ListingDetails component)
  isItemInWishlist(listingId: string): Observable<boolean> {
    return this.wishlistItems$.pipe(
      map(items => items.includes(listingId))
    );
  }
}
