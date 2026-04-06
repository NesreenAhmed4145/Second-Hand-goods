import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingService } from '../services/listing';
import { BaseChartDirective } from 'ng2-charts'; // Import Chart Directive
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective], // Add Chart Directive
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {

  totalViews: number = 0;
  totalSold: number = 0;
  
  // CHART CONFIGURATION
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [], // Product Names will go here
    datasets: [
      { data: [], label: 'Product Views', backgroundColor: '#007bff' } // View Counts go here
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    // 1. Get ALL listings (In real app, filter by current seller ID)
    this.listingService.getAllListings().subscribe((data: any[]) => {
      
      let views = 0;
      let sold = 0;
      const names: string[] = [];
      const viewCounts: number[] = [];

      data.forEach(item => {
        // Calculate Totals
        views += (item.views || 0);
        if (item.status === 'sold') {
          sold++;
        }

        // Prepare Chart Data
        names.push(item.name);
        viewCounts.push(item.views || 0);
      });

      this.totalViews = views;
      this.totalSold = sold;

      // Update Chart
      this.barChartData = {
        labels: names,
        datasets: [{ data: viewCounts, label: 'Views', backgroundColor: '#007bff' }]
      };
    });
  }
}