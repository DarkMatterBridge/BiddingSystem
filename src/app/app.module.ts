import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemComponent } from './system/system.component';
import { HttpClientModule } from '@angular/common/http';
import { DealviewComponent } from './dealview/dealview.component';
import { FormsModule } from '@angular/forms';
import { SystemdownloadComponent } from './systemdownload/systemdownload.component';
import { BiddingComponent } from './bidding/bidding.component';
import * as yaml2json from 'yaml2json';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManageBSComponent } from './manage-bs/manage-bs.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { BidSymbolComponent } from './bid-symbol/bid-symbol.component';

@NgModule({
  declarations: [
    AppComponent,
    SystemComponent,
    DealviewComponent,
    SystemdownloadComponent,
    BiddingComponent,
    ManageBSComponent,
    NavigationComponent,
    BidSymbolComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
