import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pockemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    // Create a new Pokemon
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pockemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    // Find a Pokemon by term

    // term: no
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pockemonModel.findOne({
        no: term,
      });
    }
    // term: mongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pockemonModel.findById(term);
    }
    // term: name
    if (!pokemon) {
      pokemon = await this.pockemonModel.findOne({
        name: term,
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no: ${term} not found`,
      );
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    // Update a Pokemon by term

    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      const updatedPokemon = await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async remove(id: string) {
    // Remove a Pokemon by term

    const { deletedCount } = await this.pockemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with ID: ${id} not deleted`);
    }
  }

  handleExeptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(
        `Pokemon exists in db: ${JSON.stringify(error.keyValue).replace(/(\"|[\d])/g,'')}`);
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create the Pokemon. Please check server logs`,
    );
  }
}
