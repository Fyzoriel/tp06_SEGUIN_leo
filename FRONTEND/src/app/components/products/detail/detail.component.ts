import { Component, HostBinding, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ProductService } from "../../../services/product.service";
import { ProductType } from "../../../types/product.type";
import { Store } from "@ngxs/store";
import { AddProduct } from "../../../actions/cart.action";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.css"]
})
export class DetailComponent implements OnInit {
  @HostBinding("class.app_content_centered")
  public product: ProductType | undefined;
  public imageSource!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const id: number = Number(this.route.snapshot.paramMap.get("id"));

    this.productService.get().subscribe(products => {
      this.product = products.find(product => product.id === id);

      this.imageSource = this.product?.images[0] || "";
    });
  }

  public addToCart = (): void => {
    if (this.product) {
      this.store.dispatch(new AddProduct(this.product));
    }
  };

  public selectImage = (image: string): void => {
    this.imageSource = image;
  };
}
