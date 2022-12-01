import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map, Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { ProductType } from "../types/product.type";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  env = environment;

  public constructor(private readonly httpClient: HttpClient) {}

  public get = (): Observable<ProductType[]> => {
    return this.httpClient.get<ProductType[]>(`${this.env.baseApi}/product`);
  };

  public getModels = (): Observable<string[]> => {
    const products = this.get();

    const models: string[] = [];

    return products.pipe(
      map(products => {
        for (const product of products) {
          for (const model of product.model) {
            if (!models.includes(model)) {
              models.push(model);
            }
          }
        }
        return models;
      })
    );
  };
}
