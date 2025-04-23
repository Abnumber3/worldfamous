import { inject, Injectable } from "@angular/core"; 


@Injectable({
  providedIn: 'root'     
})
export class SearchNormalizerService {
private searchMap: {[key: string]: string} = {
  hats: 'hat',
  boots: 'boots',
  boards: 'board',
  gloves: 'glove'
}


normalize(term: string): string {
    const lower = term.trim().toLowerCase();
    return this.searchMap[lower] || lower;
  }

};