import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";

import { CartStateModel } from "./cart.state.model";
import { ProductType } from "../types/product.type";
import { AddProduct, DeleteProduct } from "../actions/cart.action";

@State<CartStateModel>({
  name: "cart",
  defaults: {
    products: []
  }
})
@Injectable()
export class CartState {
  @Selector()
  public static products(state: CartStateModel): ProductType[] {
    return state.products;
  }

  @Selector()
  public static count(state: CartStateModel): number {
    return state.products.length;
  }

  @Action(AddProduct)
  public addProduct(
    { getState, patchState }: StateContext<CartStateModel>,
    { payload }: AddProduct
  ): void {
    const state = getState();
    patchState({
      products: [...state.products, payload]
    });
  }

  @Action(DeleteProduct)
  public deleteProduct(
    { getState, patchState }: StateContext<CartStateModel>,
    { payload }: DeleteProduct
  ): void {
    const state = getState();

    const productIndex = state.products.findIndex(
      product => product.id === payload.id
    );

    patchState({
      products: state.products.filter((_, index) => index !== productIndex)
    });
  }
}
