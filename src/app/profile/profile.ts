import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '.././services/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListingService } from '.././services/listing';
import { Listing } from '.././Models/listing.model';
@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  userProfile: any = null;
  userId: string = '';
  isEditing: boolean = false;
  
  activeTab: string = 'listings'; // التبويب الافتراضي

  // 1. داتا وهمية للمنتجات المعروضة للبيع
  myListings = [
    { id: 1, title: 'Iphone 13 Pro', price: 15000, date: '2025-01-10', status: 'Active' },
    { id: 3, title: 'Smart Watch', price: 1500, date: '2025-03-01', status: 'Active' }
  ];

  // 2. (جديد) داتا وهمية للمشتريات (Purchases)
  myPurchases = [
    { id: 101, title: 'Gaming Laptop', price: 25000, date: '2024-12-15', seller: 'Omar Tech' },
    { id: 102, title: 'Wireless Mouse', price: 500, date: '2025-01-05', seller: 'Ali Store' }
  ];

  // 3. داتا وهمية للتقييمات
  myReviews = [
    { user: 'Ahmed Ali', comment: 'Great seller, very polite!', rating: 5 },
    { user: 'Sara Magdy', comment: 'Item as described.', rating: 4 }
  ];

  editForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]]
  });

ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.authService.getUserProfile(user.uid).subscribe(dataSnapshot => {
            if (dataSnapshot.exists()) {
                 this.userProfile = dataSnapshot.data();
                 this.initForm(); // Your existing form logic

                 // Check if the user profile has a 'ListID' field
                 const listId = this.userProfile.ListID;

                 if (listId) {
                     // Fetch the listing details using the ID from the profile
                     this.listingService.getListingById(listId).subscribe(listing => {
                         if (listing) {
                             // We wrap it in an array [] so *ngFor works in the HTML
                             // We also manually attach the ID to ensure the link works
                             this.userListings = [{ ...listing, id: listId }];
                         }
                         this.cdr.detectChanges(); // Update view after listing loads
                     });
                 }

            } else {
                 this.userProfile = {
                   username: user.email?.split('@')[0] || 'User',
                   email: user.email,
                   phoneNumber: '',
                   joinedDate: new Date()
                 };
                 this.initForm();
            }
            this.cdr.detectChanges();
        });
      }
    });
  }

  initForm() {
    this.editForm.patchValue({
      username: this.userProfile.username,
      phone: this.userProfile.phoneNumber
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) { this.initForm(); }
  }

  saveProfile() {
    if (this.editForm.valid && this.userId) {
      const updatedData = {
        username: this.editForm.value.username,
        phoneNumber: this.editForm.value.phone
      };

      this.authService.updateUserProfile(this.userId, updatedData).subscribe({
        next: () => {
          console.log('Profile Updated Successfully!');
          this.isEditing = false;
          this.userProfile.username = updatedData.username;
          this.userProfile.phoneNumber = updatedData.phoneNumber;
        },
        error: (err) => console.error('Error updating profile:', err)
      });
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  deleteItem(id: number) {
    if(confirm('Are you sure you want to delete this listing?')) {
      this.myListings = this.myListings.filter(item => item.id !== id);
}
}

logout() {
    this.authService.logout();
}
}