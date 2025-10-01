import { Component, Input, Self } from "@angular/core"
import { ControlValueAccessor, NgControl, FormControl } from "@angular/forms"

export interface IProduct {
  id: number
  name: string
  description: string
  price: number
  pictureUrl: string
  productType: string
}
