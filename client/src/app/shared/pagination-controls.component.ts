
import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-controls',
  standalone: false,
  templateUrl: './pagination-controls.component.html',
  styleUrl: './pagination-controls.component.scss'
})
export class PaginationControlsComponent {
@Input() pageNumber!: number;
@Input() pageSize!: number;
@Input() totalCount!: number; 

@Output() pageChanged = new EventEmitter<number>();


get totalPages(): number {
  return Math.ceil(this.totalCount / this.pageSize);
}

onPageChange(newPage: number): void {
  if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.pageNumber) {
    this.pageChanged.emit(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });  // <- this line scrolls to top smoothly
  }
}

getPages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}



}

