
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notificationService';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {

  notifications: any[] = [];
  currentFilter: string = 'All'; 

  constructor(private notifService: NotificationService) { }

  ngOnInit(): void {
    
    this.notifService.getNotifications().subscribe((data) => {
      this.notifications = data;
    });
  }


  get filteredNotifications() {
    if (this.currentFilter === 'Unread') {
      return this.notifications.filter(n => n.isUnread === true);
    }
    return this.notifications; 
  }

  setFilter(filterType: string) {
    this.currentFilter = filterType;
  }
}