import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { ApplicationConfig, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authFeature } from './store/auth/auth.state';
import { authEffects } from './store';
import { authInterceptors } from './interceptors/auth-interceptors';

export const appConfig: ApplicationConfig = {
    providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideClientHydration(withEventReplay()),
        provideHttpClient(
            withFetch(),
            withInterceptors([ authInterceptors ])
        ),
        provideAnimationsAsync(),
        providePrimeNG({
            ripple: true,
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.dark-mode'
                }
            }
        }),
        provideStore(),
        provideState( authFeature ),
        provideEffects( authEffects ),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
    ]
};