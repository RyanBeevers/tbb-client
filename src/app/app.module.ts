import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {TooltipModule} from 'primeng/tooltip';
import {AccordionModule} from 'primeng/accordion';
import {FieldsetModule} from 'primeng/fieldset';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { TextMeComponent } from './text-me/text-me.component';
import { NewServiceComponent } from './new-service/new-service.component';
import { FormsModule } from '@angular/forms';
import { ViewInvoicesComponent } from './view-invoices/view-invoices.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { OktaAuthGuard } from './core/guards/okta-auth.guard';
import { OktaService } from './core/services/okta.service';
import { ProtectedComponent } from './protected/protected.component';
import { OktaReturnComponent } from './okta-return/okta-return.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OurVasComponent } from './our-vas/our-vas.component';
import { BecomeAnAdminComponent } from './become-an-admin/become-an-admin.component';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { MyLinksComponent } from './my-links/my-links.component';


const appRoutes: Routes = [
  {
    path: 'callback',
    component: OktaReturnComponent
  },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [ OktaAuthGuard ]
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LogoutComponent,
    HomeComponent,
    ServicesComponent,
    ContactMeComponent,
    TextMeComponent,
    NewServiceComponent,
    ViewInvoicesComponent,
    CreateInvoiceComponent,
    ViewTasksComponent,
    NotAuthorizedComponent,
    MyAccountComponent,
    ViewInvoiceComponent,
    NotFoundComponent,
    NewTaskComponent,
    OktaReturnComponent,
    ProtectedComponent,
    AboutUsComponent,
    OurVasComponent,
    BecomeAnAdminComponent,
    SessionExpiredComponent,
    MyLinksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    TooltipModule,
    AccordionModule,
    FieldsetModule
  ],
  providers: [
    OktaAuthGuard,
    OktaService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
