import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  {
  // slides = [
  //   '/WF-Images/man-1.png',
  //   '/WF-Images/man-2.png',
  //   '/WF-Images/girl-1.png',
  //   '/WF-Images/girl-2.png',
  //   '/WF-Images/girl-3.png',
  // ];
  // current = 0;
  // interval: any;

  // ngOnInit() {
  //   this.interval = setInterval(() => this.next(), 6000); // 5 second autoplay
  // }

  // ngOnDestroy() {
  //   clearInterval(this.interval);
  // }

  // prev() {
  //   this.current = (this.current - 1 + this.slides.length) % this.slides.length;
  // }

  // next() {
  //   this.current = (this.current + 1) % this.slides.length;
  // }

  // goTo(index: number) {
  //   this.current = index;
  // }
}
