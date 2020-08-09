import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemComponent } from './system/system.component';
import { DealviewComponent } from './dealview/dealview.component';
import { SystemdownloadComponent } from './systemdownload/systemdownload.component';
import { BiddingComponent } from './bidding/bidding.component';
import { NavigationComponent } from './navigation/navigation.component';

const  routes: Routes = [
  {path: 'bsystem', component: SystemComponent},
  {path: 'bidding', component: BiddingComponent},
  {path: 'dealview', component: DealviewComponent},
  {path: 'systemdownload', component: SystemdownloadComponent},
  {path: 'nav', component: NavigationComponent},
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
 

 }
