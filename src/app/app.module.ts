import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemComponent } from './system/system.component';
import { HttpClientModule } from '@angular/common/http';
import { DealviewComponent } from './dealview/dealview.component';
import { FormsModule } from '@angular/forms';
import { SystemdownloadComponent } from './systemdownload/systemdownload.component';

@NgModule({
  declarations: [
    AppComponent,
    SystemComponent,
    DealviewComponent,
    SystemdownloadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
