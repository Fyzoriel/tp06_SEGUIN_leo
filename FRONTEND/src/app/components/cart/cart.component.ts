import { Component, HostBinding } from "@angular/core";
import { Observable } from "rxjs";

import { ProductType } from "../../types/product.type";
import { Select, Store } from "@ngxs/store";
import { CartState } from "../../states/cart.state";
import { DeleteProduct } from "../../actions/cart.action";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent {
  @HostBinding("class.app_content_centered")
  @Select(CartState.products)
  products$!: Observable<ProductType[]>;

  constructor(private readonly store: Store) {}

  public removeFromCart = (product: ProductType): void => {
    this.store.dispatch(new DeleteProduct(product));
  };
}
