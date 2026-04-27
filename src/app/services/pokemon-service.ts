import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { PokemonBasic } from '../models/pokemon-basic';
import { PokemonListResponse } from '../models/pokemon-list-response';
import { StorageService } from './storage-service';
import { FullPokemon } from '../models/full-pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  constructor(
    private http: HttpClient,
    private storage: StorageService
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

  getPokemonDetails(id: string): Observable<FullPokemon> {
    const CACHE_KEY = `pokemon_${id}`;

    return this.storage.getItem<any>(CACHE_KEY).pipe(

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
              id: res.info.id,
              name: res.info.name,

              imageUrl: res.info.sprites.other['official-artwork'].front_default,

              types: res.info.types.map((t: any) => t.type.name),

              stats: res.info.stats.map((s: any) => ({
                name: s.stat.name,
                value: s.base_stat
              })),

              description: res.species.flavor_text_entries
                .find((entry: any) => entry.language.name === 'en')?.flavor_text
                .replace(/[\n\f]/g, ' '),

              isFavorite: false
            }

            this.storage.setItem(CACHE_KEY, fullPokemon)

            return fullPokemon
          })
        )
      })
    )

  }

  getFavoritoStatus(id: string): Observable<boolean> {
     return this.storage.getItem<any>(`pokemon_${id}`).pipe(
       map(pokemon => pokemon ? pokemon.isFavorite : false)
     );
  }

  async toggleFavorite(id: string) {
    const pokemon = await this.storage.getItem<any>(`pokemon_${id}`).toPromise();
    if(pokemon) {
      pokemon.isFavorite = !pokemon.isFavorite;
      await this.storage.setItem(`pokemon_${id}`, pokemon);

    }
  }
}
