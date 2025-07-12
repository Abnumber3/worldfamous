import { HttpClient } from '@angular/common/http';
import { Component, Type } from '@angular/core';

@Component({
  selector: 'app-test-error',
  standalone: false,
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.scss'
})
export class TestErrorComponent {

  constructor(private http: HttpClient) { }

  baseUrl = 'https://localhost:5187/api/';
  validationErrors: any;

  ngOnInit(){

  }

  get404Error(){
    this.http.get(this.baseUrl + 'product/42').subscribe({
      next: (response) => {
        console.log('Response:', response);
      }, error: (error) => {
        console.error('Error:', error);
      }
    })
  }


   get500Error(){
    this.http.get(this.baseUrl + 'buggy/servererror').subscribe({
      next: (response) => {
        console.log('Response:', response);
      }, error: (error) => {
        console.error('Error:', error);
      }
    })
  }




   get400Error(){
    this.http.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: (response) => {
        console.log('Response:', response);
      }, error: (error) => {
        console.error('Error:', error);
      }
    })
  }

  
   get400ValidationError(){
    this.http.get(this.baseUrl + 'product/fifty').subscribe({
      next: (response) => {
        console.log('Response:', response);
      }, error: (error) => {
        console.error('Error:', error);
        this.validationErrors = error.errors;
      }
    })
  }



}
