import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  private readonly POKEMONS_LIMIT: number = 10;

  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${this.POKEMONS_LIMIT}`);

    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      console.log({name, no: +segments[segments.length-2]});      
    })
    return data.results;
  }
}
