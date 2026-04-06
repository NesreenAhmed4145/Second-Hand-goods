import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../services/listing';
import { Review } from '../Models/review.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css']
})
export class ReviewsComponent implements OnInit {

  @Input() listingId: string = '';
  
  reviews: Review[] = [];
  newRating: number = 0;
  newComment: string = '';
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(
    private listingService: ListingService,
    private cdr: ChangeDetectorRef // Inject this
  ) {}

  ngOnInit() {
    if (this.listingId) {
      // Because this is a 'stream' (Observable), it stays open.
      // Whenever a review is added (by you or anyone else), 
      // this code runs again automatically.
      this.listingService.getReviews(this.listingId).subscribe(data => {
        this.reviews = data;
        this.cdr.detectChanges(); // Force screen update
      });
    }
  }

  setRating(star: number) {
    this.newRating = star;
  }

  submitReview() {
    if (this.newRating === 0 || !this.newComment) return;

    const review: Review = {
      listingId: this.listingId,
      rating: this.newRating,
      comment: this.newComment,
      userName: 'Current User', // Replace with real name later
      date: Date.now()
    };

    // 1. Send to Firebase
    this.listingService.addReview(review).then(() => {
      // 2. Clear the form ONLY after success
      this.newRating = 0;
      this.newComment = '';
      
      // Note: We do NOT need to manually add the review to 'this.reviews'.
      // Firebase will detect the new data and trigger ngOnInit's subscription automatically.
    });
  }
}