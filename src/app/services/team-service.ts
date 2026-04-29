import { Team } from './../models/team';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { firstValueFrom } from 'rxjs';
import { PokemonService } from './pokemon-service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly TEAMS_KEY = 'pokemon_teams'

  constructor(
    private storage: StorageService,
    private pokemonService: PokemonService
  ) { }

  async getTeams(): Promise<Team[]> {
    const teams = await firstValueFrom(this.storage.getItem<Team[]>(this.TEAMS_KEY))
    return teams || []
  }

  async createTeam(name: string): Promise<Team> {
    const teams = await this.getTeams()

    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: name,
      pokemonIds: [],
      stats: [
      { name: 'HP', value: 0 },
      { name: 'Attack', value: 0 },
      { name: 'Defense', value: 0 },
      { name: 'SP Attack', value: 0 },
      { name: 'SP Defense', value: 0 },
      { name: 'Speed', value: 0 },
    ]
    }

    teams.push(newTeam)
    await this.storage.setItem(this.TEAMS_KEY, teams)

    return newTeam
  }

  async removeTeam(id: string) {
    const teams = await this.getTeams()
    const teamIndex = teams.findIndex(t => t.id === id)

    teams.splice(teamIndex, 1)
    await this.storage.setItem(this.TEAMS_KEY, teams)
  }

  async updatePokemonInTeams(pokemonId: string, selectedTeamIds: string[]) {
    const allTeams = await this.getTeams()

    for (const team of allTeams) {
      const isInSelection = selectedTeamIds.includes(team.id)
      const currentIndex = team.pokemonIds.indexOf(pokemonId)

      if (isInSelection && currentIndex === -1) {
        if (team.pokemonIds.length < 6) {
          team.pokemonIds.push(pokemonId)
        }
      } else if (!isInSelection && currentIndex !== -1) {
        team.pokemonIds.splice(currentIndex, 1)
      }
      await this.calculateTeamStats(team)
    }

    await this.storage.setItem(this.TEAMS_KEY, allTeams)
  }

  async getTeamsByPokemon(pokemonId: string): Promise<string[]> {
    const allTeams = await this.getTeams()
    return allTeams
      .filter(team => team.pokemonIds.includes(pokemonId))
      .map(team => team.id)
  }

  async removePokemonFromTeam(pokemonId: string, teamId: string) {
    const allTeams = await this.getTeams()
    const team = allTeams.find(t => t.id === teamId)

    if (team) {
      team.pokemonIds = team.pokemonIds.filter(id => id != pokemonId)

      await this.calculateTeamStats(team)

      await this.storage.setItem(this.TEAMS_KEY, allTeams)
    }
  }

  async calculateTeamStats(team: Team) {
    let totalStats = [
      { name: 'HP', value: 0 },
      { name: 'Attack', value: 0 },
      { name: 'Defense', value: 0 },
      { name: 'SP Attack', value: 0 },
      { name: 'SP Defense', value: 0 },
      { name: 'Speed', value: 0 },
    ]

    const requests = team.pokemonIds.map(id =>
      firstValueFrom(this.pokemonService.getPokemonDetails(id))
    )

    const pokemons = await Promise.all(requests)

    for (const pkm of pokemons ) {

      for(let i = 0; i < pkm.stats.length; i++) {
        totalStats[i].value += pkm.stats[i].value
      }
    }
    team.stats = totalStats
  }
}

