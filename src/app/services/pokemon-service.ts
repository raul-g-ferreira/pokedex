import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { PokemonBasic } from '../models/pokemon-basic';
import { PokemonListResponse } from '../models/pokemon-list-response';

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

      switchMap(response => {
        const requests = response.results.map(pokemon => {
          const urlParts = pokemon.url.split('/');
          const id = urlParts[urlParts.length - 2];
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          return this.http.get<any>(pokemon.url).pipe(
            map(details => {
              return {
                ...pokemon,
                id,
                imageUrl,
                types: details.types
              };
            })
          );
        });

        return forkJoin(requests);
      })
    );
  }

  getPokemonDetails(id: string): Observable<any> {
    const cached = localStorage.getItem(`pokemon_${id}`);
    if (cached) {
      console.log('pegou no cache');
      return of(JSON.parse(cached));
    }

    const pokemonInfo = this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const pokemonSpecies = this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)

    return forkJoin({
      info: pokemonInfo,
      species: pokemonSpecies
    }).pipe(
      map((res: any) => {
        const fullPokemon = {
          ...res.info,
          description: res.species.flavor_text_entries.find((entry: any) => entry.language.name === 'en')?.flavor_text
          .replace(/[\n\f]/g, ' ')
        }
        localStorage.setItem(`pokemon_${id}`, JSON.stringify(fullPokemon))
        console.log("bateu lá")
        return fullPokemon
      })
    )
  }
}
