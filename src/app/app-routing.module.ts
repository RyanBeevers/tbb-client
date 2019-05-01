import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { RegisterComponent } from './register/register.component'
import { TextMeComponent } from './text-me/text-me.component'
import { NewTaskComponent } from './new-task/new-task.component'
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component'
import { CreateTaskComponent } from './create-task/create-task.component'
import { ViewInvoicesComponent } from './view-invoices/view-invoices.component'
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component'
import { MyAccountComponent } from './my-account/my-account.component'
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'contact-me', component: ContactMeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'services', component: ServicesComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'text-me', component: TextMeComponent},
  { path: 'new-task', component: NewTaskComponent},
  { path: 'create-invoices', component: CreateInvoiceComponent},
  { path: 'create-task', component: CreateTaskComponent},
  { path: 'view-invoices', component: ViewInvoicesComponent},
  { path: 'not-authorized', component: NotAuthorizedComponent},
  { path: 'my-account', component: MyAccountComponent},
  { path: 'view-invoice', component: ViewInvoiceComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
