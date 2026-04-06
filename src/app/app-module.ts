import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { ReactiveFormsModule,FormsModule } from '@angular/forms';
// Components
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ListingList } from './listings/listing-list/listing-list';
import { ListingDetails } from './listings/listing-details/listing-details';
import { ListingCreateComponent } from './listings/create-listing/listing-create'; // ✅ Imported Here
import { Profile } from './profile/profile';
import { Wishlist } from './wishlist/wishlist';
import { Chat } from './chat/chat';
import { Home } from './home/home';
import { Navbar } from './navbar/navbar';
import { CategoriesComponent } from './categories/categories';
import { Footer } from './footer/footer';
import { AnalyticsComponent } from './analytics/analytics';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ReviewsComponent } from './reviews/reviews';


import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { Notification } from './notification/notification';
@NgModule({
  declarations: [
    App,
    Login,
    Register,
    ListingDetails,
    ListingCreateComponent, // ✅ MOVED HERE (Correct for non-standalone)
    Profile,
    Chat,
    Home,
   Navbar, 
    Footer, 
    Notification
  ],
     
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    CategoriesComponent,
    ListingList,
    AnalyticsComponent,
    ReviewsComponent,
     FormsModule,
        Wishlist

  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideClientHydration(withEventReplay()),
    provideCharts(withDefaultRegisterables()),

        provideAuth(() => getAuth()),
    provideFirestore(() =>getFirestore())

  ],
  bootstrap: [App]
})
export class AppModule { }