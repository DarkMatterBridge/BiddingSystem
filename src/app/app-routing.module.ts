import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemComponent } from './system/system.component';
import { DealviewComponent } from './dealview/dealview.component';
import { SystemdownloadComponent } from './systemdownload/systemdownload.component';

const  routes: Routes = [
  {path: 'bsystem', component: SystemComponent},
  {path: 'dealview', component: DealviewComponent},
  {path: 'systemdownload', component: SystemdownloadComponent},
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
 

 }
