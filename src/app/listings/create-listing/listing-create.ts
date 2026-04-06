import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListingService } from '../../services/listing';
import { Listing } from '../../Models/listing.model';


interface Category {
  id: string; // This is the ID we need to save
  name: string; // This is what the user sees
}

@Component({
  selector: 'app-listing-create',
  standalone: false,
  templateUrl: './listing-create.html',
  styleUrl: './listing-create.css',
})
export class ListingCreateComponent implements OnInit {
  listingForm!: FormGroup;
  submitted = false;
categories: Category[] = [];
  constructor(private fb: FormBuilder, private listingsService: ListingService) {}

  ngOnInit(): void {
    // ✅ Updated Form with ALL fields
    this.listingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]], 
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      category: ['', Validators.required],
      location: ['', Validators.required],      // New
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // New
      description: ['', Validators.required],   // New
      hasDelivery: [false],                     // New (Checkbox)
      imgUrl: [''],
      sellerName: ['', Validators.required]                              // New (Optional Image Link)
    });

this.listingsService.getCategories().subscribe(data => {
      // Assuming each category document has a 'name' field and the Firestore ID
      this.categories = data.map(doc => ({ id: doc.id, name: doc.name }));
    });
  

  }

  onSubmit() {
    this.submitted = true;
    if (this.listingForm.valid) {
      
      const formValue = this.listingForm.value;
      
console.log('Button Clicked!'); // <--- Look for this in Console
    this.submitted = true;
    
    if (this.listingForm.valid) {
      console.log('Form is Valid, Sending Data...'); // <--- And this
     
      
    }
      // ✅ Map user inputs to the Listing Model
      const newListing: Listing = {
        name: formValue.title,
        price: Number(formValue.price),
        categoryId: formValue.category,
        description: formValue.description,
        location: formValue.location,
        phoneNumber: formValue.phoneNumber,
        hasDelivery: formValue.hasDelivery,
        
        // Use user's image link if provided, otherwise use default
        img: formValue.imgUrl || 'https://cdn-icons-png.flaticon.com/512/2933/2933245.png',
        
        sellerName: formValue.sellerName,

        // Defaults (System generated)
        currency: 'EGP',
        views: 0,
        status: 'active',
       
        memberSince: new Date().toLocaleDateString()
      };

      this.listingsService.addListing(newListing)
        .then(response => {
          console.log('✅ Listing Created successfully!', response);
          this.listingForm.reset(); 
          this.submitted = false;
        })
        .catch(error => {
          console.error('❌ Error creating listing:', error);
        });
    }
  }

  get formControls() {
    return this.listingForm.controls;
  }
}