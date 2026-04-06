// src/app/wishlist/wishlist.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { WishlistService } from '../services/wishlist.service';
import { ListingService } from '../services/listing';
import { Listing } from '../Models/listing.model';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist',
  standalone: true, // Assuming standalone based on previous context
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class Wishlist implements OnInit {
  
  // Services
  private wishlistService = inject(WishlistService);
  private listingService = inject(ListingService);

  // Observables
  // This will hold the ARRAY of full Listing objects, not just IDs
  wishedListings$!: Observable<Listing[]>; 
  isLoading: boolean = true;

  constructor() {}
ngOnInit() {
    this.wishedListings$ = this.wishlistService.wishlistItems$.pipe(
      switchMap(ids => {
        this.isLoading = true;
        
        if (ids.length === 0) {
          this.isLoading = false;
          return of([]); 
        }

        // ✅ FIX: Added .pipe(take(1)) to ensure forkJoin completes
      const requests = ids.map(id => 
            this.listingService.getListingById(id).pipe(
                take(1), // ✅ 1. Force completion so forkJoin works
                map(listing => {
                    // ✅ 2. Attach the ID to the data manually
                    if (listing) {
                        return { ...listing, id: id }; 
                    }
                    return null;
                })
            )
        );

        return forkJoin(requests).pipe(
            catchError(error => {
                console.error('Error fetching wishlist details:', error);
                return of([]); 
            })
        );
      }),
      map(listings => {
        this.isLoading = false;
        return listings.filter(item => item !== null && item !== undefined); 
      })
    );
  }

onRemoveItem(id: string): void {
    this.wishlistService.toggleWishlist(id); 
    console.log(`Item with ID ${id} removed from wishlist.`);
  }
}