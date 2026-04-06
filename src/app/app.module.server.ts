import { AppModule } from './app-module';
import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { App } from './app';
import { serverRoutes } from './app.routes.server';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@NgModule({
  imports: [AppModule],

  providers: [
    provideServerRendering(withRoutes(serverRoutes)),

    // 🔥 Firebase must be here, not in imports
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [App],
})
export class AppServerModule {}
