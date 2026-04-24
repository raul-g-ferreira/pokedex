import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { PokemonBasic } from '../models/pokemon-basic';
import { PokemonListResponse } from '../models/pokemon-list-response';
import { get, set } from 'idb-keyval';

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
                types: details.types,
                isFavorite: false
              };
            })
          );
        });

        return forkJoin(requests);
      })
    );
  }

  getPokemonDetails(id: string): Observable<any> {
    const CACHE_KEY = `pokemon_${id}`;

    return from(get<any>(CACHE_KEY)).pipe(

      switchMap(cachedDetail => {

        if (cachedDetail) {
          return of(cachedDetail);
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
              .replace(/[\n\f]/g, ' '),
              isFavorite: false
            }
            set(CACHE_KEY, fullPokemon)

            return fullPokemon
          })
        )
      })
    )

  }

  async toggleFavorite(id: string) {
    const pokemon = await get(`pokemon_${id}`);
    pokemon.isFavorite = !pokemon.isFavorite;
    await set(`pokemon_${id}`, pokemon);
  }
}
