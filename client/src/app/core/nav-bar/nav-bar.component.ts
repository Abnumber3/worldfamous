import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket } from '../../shared/models/basket';
import { BasketService } from '../../basket/basket.service';
import { IUser } from '../../shared/models/user';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: false
})
export class NavBarComponent implements OnInit {
  basket$!: Observable<IBasket | null>;
  currentUser$!: Observable<IUser | null>;
  isMobileMenuOpen = false;

  constructor(
    private basketService: BasketService,
    private accountService: AccountService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUser$;
  }

  toggleMobileMenu(event?: MouseEvent) {
    event?.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.closeMobileMenu();
    this.accountService.logout();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      this.closeMobileMenu();
    }
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.closeMobileMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isMobileMenuOpen) return;

    const clickTarget = event.target as Node | null;
    if (clickTarget && !this.elementRef.nativeElement.contains(clickTarget)) {
      this.closeMobileMenu();
    }
  }
}
