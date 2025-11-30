import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ListingList } from './listings/listing-list/listing-list';
import { Chat } from './chat/chat';
import { Wishlist } from './wishlist/wishlist';
import { Profile } from './profile/profile';

const routes: Routes = [

      { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'listings', component: ListingList },
  { path: 'chat', component: Chat },
  { path: 'wishlist', component: Wishlist },
  { path: 'Profile', component: Profile }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
