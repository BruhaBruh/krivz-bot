import Markup from 'node-vk-bot-api/lib/markup';
import { config } from './config';

export const mainKeyboard = Markup.keyboard(
  [
    Markup.button(config.buttons.boost, 'primary'),
  ],
);
