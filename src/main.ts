// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations }   from '@angular/platform-browser/animations';
import { AppComponent }        from './app/app.component';
import { provideHttpClient }   from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule }        from '@angular/forms';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      FormsModule,
    )
  ]
})
.catch(err => console.error(err));
