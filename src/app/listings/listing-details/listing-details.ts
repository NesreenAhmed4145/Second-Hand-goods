import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router'; // 1. Import ParamMap
import { ListingService } from '../../services/listing';
import { Listing } from '../../Models/listing.model';
import { AuthService } from '../../services/auth';
// 2. Import necessary RxJS operators/creation functions
import { switchMap, map } from 'rxjs/operators'; // ✅ FIX: Import 'map' from 'rxjs/operators'
import { of } from 'rxjs'; 
// Note: We will use the proper WishlistService structure for best practice.
import { WishlistService } from '../../services/wishlist.service'; 


@Component({
 selector: 'app-listing-details',
 standalone: false,
 templateUrl: './listing-details.html',
 styleUrl: './listing-details.css',
})
export class ListingDetails implements OnInit {
 
 listing: any | null = null; // Changed to 'any' for flexibility with Firestore data
 currentUserId: string | null = null;
 currentListingId: string | null = null;
 
 // We will use a flag based on an Observable for template
 isWished: boolean = false; 

 private authService = inject(AuthService);
 private route = inject(ActivatedRoute); // Inject via property
 private listingService = inject(ListingService); // Inject via property
 private cdr = inject(ChangeDetectorRef); // Inject via property
 private wishlistService = inject(WishlistService); // ✅ New Injection for Wishlist

 constructor() {}

    ngOnInit() {
        // 1. Get the current user ID and subscribe to the wishlist status
        this.authService.user$.subscribe(user => {
            this.currentUserId = user ? user.uid : null;
            this.cdr.detectChanges(); // Force update if the login status changes after initial load
        });
        
        // 2. Get the listing ID and fetch details
        this.route.paramMap.pipe(
            // ✅ FIX TS7006/TS2552: Explicitly type 'params' and ensure 'map' is imported
            map((params: ParamMap) => params.get('id') as string), 
            // ✅ FIX TS2322/TS2345: Handle null/undefined listingId before passing to service
            switchMap(listingId => {
                this.currentListingId = listingId;
                if (!listingId) {
                    return of(null); // Return null observable if ID is missing
                }
                
                // Fetch listing details
                return this.listingService.getListingById(listingId); 
            })
        ).subscribe(listingData => {
            this.listing = listingData;
            
            // Re-run the check when listing data is loaded
            this.checkWishlistStatus(); 
        });
    }
    
    // Helper function to check if the current listing is in the user's wishlist
    checkWishlistStatus() {
        if (this.currentListingId) {
            // ✅ FIX TS2339: Use the dedicated WishlistService and its correct method
            this.wishlistService.isItemInWishlist(this.currentListingId) 
                // ✅ FIX TS7006: Explicitly type 'status'
                .subscribe((status: boolean) => { 
                    this.isWished = status;
                    this.cdr.detectChanges();
                });
        }
    }


    // Function executed when the heart icon is clicked
    toggleWishlist() {
        if (!this.currentListingId) {
            console.error('Listing ID missing. Cannot toggle wishlist.');
            return;
        }

        if (!this.currentUserId) {
            // Suggestion: Redirect to login page if not logged in
            console.warn('User not logged in. Cannot add to wishlist.');
            // Add router injection and navigate here if needed
            return;
        }

        // ✅ FIX: Use the dedicated WishlistService's toggle method
        // This service handles updating the DB and the local state (isWished status)
        this.wishlistService.toggleWishlist(this.currentListingId);
    }
}