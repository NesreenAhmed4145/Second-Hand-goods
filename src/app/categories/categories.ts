import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and AsyncPipe
import { CategoryService } from '../services/category'
import { Category } from '../Models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true, // Assuming you are using standalone components (Angular 14+)
  imports: [CommonModule], 
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {
  
  categories$!: Observable<Category[]>;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
  }
}