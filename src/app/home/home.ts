import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Import ChangeDetectorRef
import { Category } from '../Models/category.model';
import { CategoryService } from '../services/category';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  categories: Category[] = [];

  // 2. Inject ChangeDetectorRef in the constructor (we call it 'cdr')
  constructor(
    private categoriesService: CategoryService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.categoriesService.getCategories().subscribe(data => {
      this.categories = data;
      console.log('Data arrived:', data);

      // 3. Force Angular to update the screen right now
      this.cdr.detectChanges(); 
    });
  }
}