import jsonConfig from '../../config.json';
import { Config } from '../types';

export const config: Config = jsonConfig;

export const boostTypeNames = Object.entries(config.boost).map((v) => v[1].name);
