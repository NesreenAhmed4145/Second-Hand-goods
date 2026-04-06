import { Component, OnInit, inject } from '@angular/core'; // ✅ Import 'inject'
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ListingService } from '../services/listing';
import { AuthService } from '../services/auth'; // ✅ Import AuthService

@Component({
  selector: 'app-navbar',
  standalone: false, // Keep non-standalone
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  // Injecting Services
  router = inject(Router);
  listingService = inject(ListingService);
  authService = inject(AuthService); // ✅ Inject Auth Service

  // State for Authentication
  isLoggedIn: boolean = false; // ✅ New flag for display

  // State for Search
  allListings: any[] = [];
  filteredSuggestions: any[] = [];
  showDropdown: boolean = false;

  constructor() {} // Constructor is empty as services are injected via `inject()`

  ngOnInit() {
    // 1. Load ALL products for local search
    this.listingService.getAllListings().subscribe(data => {
      this.allListings = data;
    });

    // 2. ✅ Subscribe to Authentication Status
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; // True if user object exists (logged in)
      console.log('User logged in status:', this.isLoggedIn);
    });
  }

  // ... (Search Logic remains the same)

  // 2. Filter logic when typing
  onSearchInput(text: string) {
    if (!text) {
      this.filteredSuggestions = [];
      this.showDropdown = false;
      return;
    }

    this.filteredSuggestions = this.allListings.filter(item => 
      item.name.toLowerCase().includes(text.toLowerCase())
    );

    this.showDropdown = this.filteredSuggestions.length > 0;
  }

  // 3. When pressing Enter or clicking "Search" button
  search(term: string) {
    this.showDropdown = false; // Hide dropdown
    if (term) {
      this.router.navigate(['/listings'], { queryParams: { q: term } });
    }
  }

  // 4. When clicking a specific suggestion
  selectProduct(productName: string) {
    this.search(productName); // Go to results page for this product
  }
  
addListingChecking() {
    if (this.isLoggedIn) {
      // If logged in, navigate to the creation page
      this.router.navigate(['/listing-create']);
    } else {
      // If NOT logged in, redirect to the login page
      this.router.navigate(['/login']);
    }
  }



}