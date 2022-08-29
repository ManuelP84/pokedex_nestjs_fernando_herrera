import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interface';
import { Pokemon } from '../pokemon/entities';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapter';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=650`,
    );

    // To make multiple insertions: SOLUTION 1.
    const pokemonsToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonsToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonsToInsert);

    // To make multiple insertions: SOLUTION 2.
    // const insertPromisesArray = [];

    // data.results.forEach(({ name, url }) => {

    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];

    //   insertPromisesArray.push(
    //     this.pokemonModel.create({name, no})
    //   );

    // });
    // await Promise.all(insertPromisesArray);
    return { result: 'Seed executed' };
  }
}
