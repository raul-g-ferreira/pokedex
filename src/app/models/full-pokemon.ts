export interface FullPokemon {
  id: string,
  name: string,
  imageUrl: string,
  gifUrl: string,
  types: string[],
  stats: {
    name: string,
    value: number
  }[],
  description: string,
  isFavorite: boolean,
}
