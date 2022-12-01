import { Component, OnInit } from "@angular/core";

import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject
} from "rxjs";

import { ProductService } from "../../../services/product.service";
import { ProductType } from "../../../types/product.type";

@Component({
  selector: "app-products",
  templateUrl: "./catalogue.component.html",
  styleUrls: ["./catalogue.component.css"]
})
export class CatalogueComponent implements OnInit {
  public products$!: Observable<ProductType[]>;
  public models$!: Observable<string[]>;

  public nameFilterChanged$ = new Subject<string>();
  public modelsFilterChanged$ = new Subject<string[]>();

  public modelsFilter: string[] = [];
  public nameFilter: string = "";

  public constructor(private readonly productService: ProductService) {}

  public ngOnInit(): void {
    const debounceTimeMs = 300;
    this.nameFilterChanged$
      .pipe(debounceTime(debounceTimeMs), distinctUntilChanged())
      .subscribe(() => {
        this.fetchProducts();
      });

    this.modelsFilterChanged$
      .pipe(debounceTime(debounceTimeMs), distinctUntilChanged())
      .subscribe(() => {
        this.fetchProducts();
      });

    this.products$ = this.productService.get();
    this.models$ = this.productService.getModels();
  }

  public filterProduct = (product: ProductType) => {
    return (
      product.name.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
      this.modelsFilter.every(model => product.model.includes(model))
    );
  };

  public fetchProducts = () => {
    this.products$ = this.productService.get().pipe(
      map(products => {
        return products.filter(this.filterProduct);
      })
    );
  };
}
