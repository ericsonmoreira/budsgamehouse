import { AxiosResponse } from 'axios';
import mtgApi from '../api/mtgApi';

export type FindCardsMtgProps = {
  name: string;
};

export interface Ruling {
  date: string;
  text: string;
}

export interface ForeignName {
  name: string;
  language: string;
  multiverseid: number;
}

export interface Card {
  name: string;
  names: string[];
  manaCost: string;
  cmc: number;
  colors: string[];
  colorIdentity: string[];
  type: string;
  supertypes: string[];
  types: string[];
  subtypes: string[];
  rarity: string;
  set: string;
  text: string;
  artist: string;
  number: string;
  power: string;
  toughness: string;
  layout: string;
  multiverseid: number;
  imageUrl: string;
  rulings: Ruling[];
  foreignNames: ForeignName[];
  printings: string[];
  originalText: string;
  originalType: string;
  id: string;
}

const findCardsMtg = ({ name }: FindCardsMtgProps): Promise<AxiosResponse<Card[]>> =>
  mtgApi.get('/cards', { params: { name } });

export default findCardsMtg;
