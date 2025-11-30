import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// Components
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ListingList } from './listings/listing-list/listing-list';
import { ListingDetails } from './listings/listing-details/listing-details';
import { CreateListing } from './listings/create-listing/create-listing';
import { Profile } from './profile/profile';
import { Wishlist } from './wishlist/wishlist';
import { Chat } from './chat/chat';
import { Home } from './home/home';
import { Navbar } from './navbar/navbar';




@NgModule({
  declarations: [
    App,
    Login,
    Register,
    ListingList,
    ListingDetails,
    CreateListing,
    Profile,
    Wishlist,
    Chat,
    Home,
    Navbar
  ],
     
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
