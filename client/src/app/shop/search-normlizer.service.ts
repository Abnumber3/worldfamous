import { Injectable } from '@angular/core';
import { IType } from '../shared/models/productType';

export interface SearchIntent {
  typeId: number | null;
  matchedTypeName: string | null;
  search: string;
}

interface TypeAliasCandidate {
  alias: string;
  type: IType;
}

@Injectable({
  providedIn: 'root'
})
export class SearchNormalizerService {
  private readonly searchMap: Record<string, string> = {
    hats: 'hat',
    boots: 'boots',
    boards: 'board',
    gloves: 'glove'
  };

  private readonly typeAliasMap: Record<string, string[]> = {
    hoodies: ['hoodie', 'hoodies', 'hooded', 'sweatshirt', 'sweatshirts', 'pullover', 'pullovers'],
    't shirts': ['t-shirt', 't-shirts', 'tshirt', 'tshirts', 't shirt', 't shirts', 'tee', 'tees', 'shirt', 'shirts', 'top', 'tops'],
    'long sleeves': ['long sleeve', 'long sleeves', 'longsleeve', 'longsleeves', 'sleeve', 'sleeves']
  };

  resolve(term: string, types: IType[]): SearchIntent {
    const cleanedInput = term.trim();
    if (!cleanedInput) {
      return {
        typeId: null,
        matchedTypeName: null,
        search: ''
      };
    }

    const matchableInput = this.normalizeForMatching(cleanedInput);
    const candidates = this.buildTypeAliasCandidates(types);
    const matchedCandidate = this.findBestTypeMatch(matchableInput, candidates);

    if (!matchedCandidate) {
      return {
        typeId: null,
        matchedTypeName: null,
        search: this.normalizeSearchText(matchableInput)
      };
    }

    const cleanedSearch = this.stripTypeAliases(matchableInput, candidates);

    return {
      typeId: matchedCandidate.type.id,
      matchedTypeName: matchedCandidate.type.name,
      search: this.normalizeSearchText(cleanedSearch)
    };
  }

  private buildTypeAliasCandidates(types: IType[]): TypeAliasCandidate[] {
    return types
      .filter(type => type.id !== 0)
      .flatMap(type => {
        const normalizedTypeName = this.normalizeForMatching(type.name);
        const configuredAliases = this.typeAliasMap[normalizedTypeName] || [];
        const aliases = new Set([normalizedTypeName, ...configuredAliases.map(alias => this.normalizeForMatching(alias))]);

        return Array.from(aliases)
          .filter(Boolean)
          .map(alias => ({
            alias,
            type
          }));
      });
  }

  private findBestTypeMatch(input: string, candidates: TypeAliasCandidate[]): TypeAliasCandidate | null {
    const matches = candidates
      .filter(candidate => this.containsAlias(input, candidate.alias))
      .sort((left, right) => right.alias.length - left.alias.length);

    return matches[0] ?? null;
  }

  private stripTypeAliases(input: string, candidates: TypeAliasCandidate[]): string {
    let cleaned = input;

    for (const alias of [...new Set(candidates.map(candidate => candidate.alias))].sort((left, right) => right.length - left.length)) {
      const escapedAlias = this.escapeRegex(alias);
      cleaned = cleaned.replace(new RegExp(`\\b${escapedAlias}\\b`, 'gi'), ' ');
    }

    return cleaned.replace(/\s+/g, ' ').trim();
  }

  private normalizeSearchText(term: string): string {
    return term
      .split(' ')
      .filter(Boolean)
      .map(word => this.searchMap[word] || word)
      .join(' ')
      .trim();
  }

  private containsAlias(input: string, alias: string): boolean {
    if (!alias) {
      return false;
    }

    return new RegExp(`\\b${this.escapeRegex(alias)}\\b`, 'i').test(input);
  }

  private normalizeForMatching(term: string): string {
    return term
      .toLowerCase()
      .replace(/[-_/]+/g, ' ')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
