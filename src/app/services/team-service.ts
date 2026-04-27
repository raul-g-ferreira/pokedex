import { Team } from './../models/team';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly TEAMS_KEY = 'pokemon_teams'

  public availableTeams = [
    { id: 'team1', name: 'Equipe Alpha' },
    { id: 'team2', name: 'Equipe Beta' },
    { id: 'team3', name: 'Equipe Delta' }
  ]

  constructor(
    private storage: StorageService,
  ) {}

  async getTeams(): Promise<Team[]> {
    const teams = await firstValueFrom(this.storage.getItem<Team[]>(this.TEAMS_KEY))
    return teams || []
  }

  async createTeam(name: string): Promise<Team> {
    const teams = await this.getTeams()

    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: name,
      pokemonIds: []
    }

    teams.push(newTeam)
    await this.storage.setItem(this.TEAMS_KEY, teams)

    return newTeam
  }

  async renameTeam(id:string, newName:string) {
    const teams = await this.getTeams()
    const teamIndex = teams.findIndex(t => t.id === id)

    if (teamIndex !== -1) {
      teams[teamIndex].name = newName
      await this.storage.setItem(this.TEAMS_KEY, teams)
    }
  }

  async updatePokemonInTeams(pokemonId: string, selectedTeamIds: string[]) {
    const allTeams = await this.getTeams()

    for (const team of allTeams) {
      const isInSelection = selectedTeamIds.includes(team.id)
      const currentIndex = team.pokemonIds.indexOf(pokemonId)

      if (isInSelection && currentIndex === -1) {
        if (team.pokemonIds.length < 6) {
          team.pokemonIds.push(pokemonId)
        } else {
          console.warn(`Team ${team.id} is already full`)
        }
      } else if (!isInSelection && currentIndex !== -1) {
        team.pokemonIds.splice(currentIndex, 1)
      }
    }

    await this.storage.setItem(this.TEAMS_KEY, allTeams)
  }

  async getTeamsByPokemon(pokemonId: string): Promise<string[]> {
    const allTeams = await this.getTeams()
    return allTeams
      .filter(team => team.pokemonIds.includes(pokemonId))
      .map(team => team.id)
  }
}
