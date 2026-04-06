import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ListingList } from './listings/listing-list/listing-list';
import { Chat } from './chat/chat';
import { Wishlist } from './wishlist/wishlist';
import { Profile } from './profile/profile';
import { AnalyticsComponent } from './analytics/analytics';
import { ListingDetails } from './listings/listing-details/listing-details';
import { ListingCreateComponent } from './listings/create-listing/listing-create';
import { Notification } from './notification/notification';

import { authGuard } from './auth.guard';
const routes: Routes = [

      { path: '', component: Home },
{ path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'listings', component: ListingList,canActivate: [authGuard] },
  { path: 'chat', component: Chat, canActivate: [authGuard]},
  { path: 'wishlist', component: Wishlist,canActivate: [authGuard] },
  { path: 'Profile', component: Profile },
{ path: 'category/:id', component: ListingList ,canActivate: [authGuard]},
{ path: 'analytics', component: AnalyticsComponent,canActivate: [authGuard] },
{ path: 'listing-details/:id', component: ListingDetails,canActivate: [authGuard] },
{ path: 'listing-create', component: ListingCreateComponent ,canActivate: [authGuard]},
{ path: 'notification', component: Notification ,canActivate: [authGuard]},

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
