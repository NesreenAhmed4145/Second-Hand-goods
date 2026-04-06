import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router'; // Added Router
import { Observable } from 'rxjs'; // Added Observable
import { ListingService } from '../../services/listing';
import { Listing } from '../../Models/listing.model';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth'; // Added AuthService

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listing-list.html',
  styleUrls: ['./listing-list.css']
})
export class ListingList implements OnInit {

  allListings: Listing[] = [];
  filteredListings: Listing[] = [];
  pageTitle: string = 'Listings';

  // Auth State
  currentUserId: string | null = null;
  
  // ✅ FIX 1: Define the missing property for the HTML to use
  // This connects your component to the global wishlist state
  wishedListingIds$: Observable<string[]>; 

  // Filter states
  searchTerm: string = '';
  locationFilter: string = '';
  maxPriceFilter: number | null = null;

  // Injections
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService); // Need this to check login
  private router = inject(Router); // Need this to redirect

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private cdr: ChangeDetectorRef
  ) {
    // Assign the observable here
    this.wishedListingIds$ = this.wishlistService.wishlistItems$;
  }

  ngOnInit() {
    // 1. Subscribe to User Auth State (Critical for wishlist logic)
    this.authService.user$.subscribe(user => {
        this.currentUserId = user ? user.uid : null;
    });

    // 2. Existing Routing Logic...
    this.route.queryParams.subscribe(queryParams => {
      const searchQ = queryParams['q'];
      
      this.route.paramMap.subscribe(params => {
        const catId = params.get('id');

        if (catId) {
          this.pageTitle = 'Category Results';
          this.listingService.getListingsByCategoryId(catId).subscribe(data => {
            this.allListings = data;
            this.applyFilters();
          });
        } else {
          this.pageTitle = searchQ ? `Search results for "${searchQ}"` : 'All Listings';
          this.searchTerm = searchQ || '';
          
          this.listingService.getAllListings().subscribe(data => {
            this.allListings = data;
            this.applyFilters();
          });
        }
      });
    });
  }

  // --- FILTER LOGIC ---
  filterLocation(event: any) {
    this.locationFilter = event.target.value;
    this.applyFilters();
  }

  filterPrice(event: any) {
    this.maxPriceFilter = Number(event.target.value);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredListings = this.allListings.filter(item => {
      const matchesSearch = this.searchTerm 
        ? item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) 
        : true;
      const matchesLocation = this.locationFilter 
        ? item.location.includes(this.locationFilter) 
        : true;
      const matchesPrice = this.maxPriceFilter 
        ? item.price <= this.maxPriceFilter 
        : true;

      return matchesSearch && matchesLocation && matchesPrice;
    });
    this.cdr.detectChanges();
  }

  // --- WISH LIST LOGIC ---

  // ✅ FIX 2: Updated signature to accept ID and Event
  toggleWishlist(listingId: string, event: Event) {
    event.stopPropagation(); // Stop clicking the card (navigation)

    if (!this.currentUserId) {
        console.warn('User not logged in. Redirecting...');
        this.router.navigate(['/login']);
        return;
    }

    // Call service
    this.wishlistService.toggleWishlist(listingId);
  }
}