import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { RegisterComponent } from './register/register.component';
import { TextMeComponent } from './text-me/text-me.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { FormsModule } from '@angular/forms';
import { ViewInvoicesComponent } from './view-invoices/view-invoices.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    ServicesComponent,
    ContactMeComponent,
    RegisterComponent,
    TextMeComponent,
    NewTaskComponent,
    ViewInvoicesComponent,
    CreateInvoiceComponent,
    CreateTaskComponent,
    NotAuthorizedComponent,
    MyAccountComponent,
    ViewInvoiceComponent,
    NotFoundComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
