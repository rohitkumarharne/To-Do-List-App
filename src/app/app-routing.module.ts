import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './CURD/Components/main/main.component';
import { FormComponent } from './CURD/Components/form/form.component';
import { ProductListComponent } from './CURD/Components/product-list/product-list.component';

const routes: Routes = [
  { path: '', component: ProductListComponent }, // This loads ProductListComponent when the path is empty
  { path: 'add', component: FormComponent },
  { path: 'edit/:id', component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
