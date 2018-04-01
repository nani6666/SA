import { Component } from '@angular/core';
// Imports
// Deprecated import
// import { provideRouter, RouterConfig } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CreteAccountComponent } from './components/crete-account/crete-account.component';
import { MyAccountComponent } from './components/my-account/my-account.component';


// Route Configuration
export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'main', component: LoginComponent },
    { path: 'forgotPassword', component: ForgotPasswordComponent },
    { path: 'createAccount', component: CreteAccountComponent },
    { path: 'my-account', component: MyAccountComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
