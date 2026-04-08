import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app';
import { HomeComponent } from './features/home/home';
import { FormComponent } from './features/form/form';
import { RoutingModule } from './common/router';
import { HeaderComponent } from './features/form/header/header';
import { DataFormComponent } from './features/form/data-form/data-form';
import { ListComponent } from './features/form/list/list';
import { ToastComponent } from './common/toast/toast';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormComponent,
    HeaderComponent,
    DataFormComponent,
    ListComponent,
    ToastComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
