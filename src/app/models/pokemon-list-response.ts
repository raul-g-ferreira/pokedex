import { PokemonBasic } from "./pokemon-basic";

export interface PokemonListResponse {
  count: number;
  results: PokemonBasic[];
}
