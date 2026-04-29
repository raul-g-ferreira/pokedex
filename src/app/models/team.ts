export interface Team {
  id: string,
  name: string,
  pokemonIds: string[],
  stats?: {
    name: string,
    value: number
  }[],
  // isFavorite: boolean,
}
