import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { PokemonBasic } from '../model/pokemon-basic';
import { PokemonListResponse } from '../model/pokemon-list-response';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  constructor(
    private http: HttpClient
  ) {}

  getFirstGenerationPokemons(): Observable<PokemonBasic[]> {
    return this.http.get<PokemonListResponse>(this.baseUrl).pipe(
      map(response => {
        return response.results.map(pokemon => {
          const urlParts = pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];

          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          return {...pokemon, id, imageUrl}
        })
      })
    )
  }

  getPokemonDetails(id: string): Observable<any> {
    const pokemonInfo = this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const pokemonSpecies = this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)

    return forkJoin({
      info: pokemonInfo,
      species: pokemonSpecies
    }).pipe(
      map((res: any) => {
        return {
          ...res.info,
          description: res.species.flavor_text_entries.find((entry: any) => entry.language.name === 'en')?.flavor_text
          .replace(/[\n\f]/g, ' ')
        }
      })
    )
  }
}
