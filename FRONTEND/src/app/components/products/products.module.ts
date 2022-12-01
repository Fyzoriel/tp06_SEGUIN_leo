import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { DetailComponent } from "./detail/detail.component";
import { CartComponent } from "../cart/cart.component";
import { CatalogueComponent } from "./catalogue/catalogue.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  {
    path: "",
    component: CatalogueComponent
  },
  {
    path: ":id",
    component: DetailComponent
  },
  {
    path: "cart",
    component: CartComponent
  },
  {
    path: "**",
    redirectTo: "profile"
  }
];
@NgModule({
  declarations: [CatalogueComponent, DetailComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    NgxSliderModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsModule {}
