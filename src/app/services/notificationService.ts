import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  
  // الداتا الثابتة بتاعتنا
  private notifications = [
    {
      id: 1,
      time: '4 hours ago',
      title: 'Your listing is almost ready!',
      body: 'Just a few more steps to go. Publish your listing Autos now and start attracting potential customers.',
      btnText: 'Go now',
      btnColor: 'orange',
      isUnread: true
    },
    {
      id: 2,
      time: '20 hours ago',
      title: 'Your favourite ads are...',
      body: 'Hello Ahmed, Waiting for you to call before they are gone!',
      btnText: 'View',
      btnColor: 'blue',
      isUnread: true
    },
    {
      id: 3,
      time: '1 day ago',
      title: 'Welcome to Second Hand Goods',
      body: 'Thanks for joining our platform. Start exploring now!',
      btnText: 'Explore',
      btnColor: 'blue',
      isUnread: false
    }
  ];

  constructor() { }

  // الدالة الوحيدة اللي فاضلة: بتجيب الداتا
  getNotifications(): Observable<any[]> {
    return of(this.notifications);
  }
}