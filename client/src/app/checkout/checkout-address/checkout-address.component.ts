import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountService } from '../../account/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-address',
  standalone: false,
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutAddressComponent {

  // Parent passes in the main checkout form
  @Input() checkoutForm!: FormGroup;


constructor(
  private accountService: AccountService,
  private toastr: ToastrService
) {}


  // Optional convenience getter if you ever need addressForm in TS
  get addressForm(): FormGroup {
    return this.checkoutForm.get('addressForm') as FormGroup;
  }


  saveUserAddress(){
    this.accountService.updateUserAddress(this.checkoutForm.get('addressForm')?.value).subscribe({
      next: () => this.toastr.success('Address saved successfully'),
    })
  }
}
