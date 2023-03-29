import VkBot from 'node-vk-bot-api';
import Session from 'node-vk-bot-api/lib/session';
import Stage from 'node-vk-bot-api/lib/stage';
import * as dotenv from 'dotenv';
import { config } from './lib/config';
import { errorMiddleware } from './lib/errorMiddleware';
import { boostScene } from './lib/boostScene';
import { Redis } from './lib/redis';

dotenv.config();

const bot = new VkBot(process.env.TOKEN ?? '');
const session = new Session();
const stage = new Stage(boostScene);

bot.use(session.middleware());
bot.use(stage.middleware());
bot.use(errorMiddleware);

bot.command(config.buttons.boost, (ctx) => {
  ctx.scene?.enter('boost');
});

bot.command('Начать', (ctx) => {
  ctx.scene?.enter('boost');
});

Redis.instance.connect().then(() => {
  console.log('Bot starting!');
  bot.startPolling((err) => {
    if (err) {
      console.error(JSON.stringify(err));
    }
    return {};
  });
}).catch(() => {
  console.error('Fail connect to redis');
});
