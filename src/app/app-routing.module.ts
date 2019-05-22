import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LogoutComponent } from './logout/logout.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { TextMeComponent } from './text-me/text-me.component'
import { NewServiceComponent } from './new-service/new-service.component'
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component'
import { ViewTasksComponent } from './view-tasks/view-tasks.component'
import { ViewInvoicesComponent } from './view-invoices/view-invoices.component'
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component'
import { MyAccountComponent } from './my-account/my-account.component'
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { NewTaskComponent } from './new-task/new-task.component';
import { OktaReturnComponent } from './okta-return/okta-return.component'
import { ProtectedComponent } from './protected/protected.component';
import { OktaAuthGuard } from './core/guards/okta-auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'contact-me', component: ContactMeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'services', component: ServicesComponent},
  { path: 'text-me', component: TextMeComponent},
  { path: 'new-service', component: NewServiceComponent},
  { path: 'create-invoices', component: CreateInvoiceComponent},
  { path: 'view-tasks', component: ViewTasksComponent},
  { path: 'view-invoices', component: ViewInvoicesComponent},
  { path: 'not-authorized', component: NotAuthorizedComponent},
  { path: 'view-invoice', component: ViewInvoiceComponent},
  { path: 'new-task', component: NewTaskComponent},
  { path: 'my-account', component: MyAccountComponent},
  { path: 'callback', component: OktaReturnComponent},
  { path: 'protected', component: ProtectedComponent, canActivate: [ OktaAuthGuard ]},

  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
