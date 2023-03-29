import Markup from 'node-vk-bot-api/lib/markup';
import Scene from 'node-vk-bot-api/lib/scene';
import { boostTypeNames, config } from './config';
import { BoostType } from '../types';
import { mainKeyboard } from './keyboard';
import { Redis } from './redis';

export const boostScene = new Scene(
  'boost',
  (ctx) => {
    ctx.scene?.next();
    ctx.reply(
      [
        ...config.messages.selectBoost,
        ...boostTypeNames,
      ].join('\r\n'),
      undefined,
      Markup.keyboard(
        boostTypeNames.map((name) => Markup.button(name, 'primary')),
      ).oneTime(),
    );
  },
  (ctx) => {
    const boostType = Object.entries(config.boost)
      .find(([, value]) => value.name === ctx.message.text)?.[0];
    if (!boostType) {
      ctx.scene?.enter('boost');
      return;
    }
    ctx.session.boostType = boostType;
    ctx.scene?.next();

    ctx.reply(
      config.messages.inputNickname.join('\r\n'),
      undefined,
      mainKeyboard,
    );
  },
  (ctx) => {
    if (!ctx.message.text) {
      ctx.reply(
        config.messages.invalidNickname.join('\r\n'),
        undefined,
        mainKeyboard,
      );
      return;
    }
    ctx.session.nickname = ctx.message.text;
    ctx.scene?.next();

    switch (ctx.session.boostType) {
      case 'battlepass': {
        ctx.reply(
          config.boost.battlepass.input,
          undefined,
          mainKeyboard,
        );
        break;
      }
      case 'level': {
        ctx.reply(
          config.boost.level.input,
          undefined,
          mainKeyboard,
        );
        break;
      }
      case 'rating': {
        ctx.reply(
          config.boost.rating.input,
          undefined,
          mainKeyboard,
        );
        break;
      }
      default: {
        ctx.reply(
          config.messages.unknownBoostType.join('\r\n'),
          undefined,
          mainKeyboard,
        );
        ctx.scene?.enter('boost');
      }
    }
  },
  (ctx) => {
    if (!ctx.message.text || Number.isNaN(+ctx.message.text)) {
      ctx.reply(
        config.messages.invalidAmount.join('\r\n'),
        undefined,
        mainKeyboard,
      );
      return;
    }
    ctx.session.amount = +ctx.message.text;
    ctx.scene?.next();

    ctx.reply(
      config.messages.showInfo
        .map((v) => v.replaceAll(
          '%boost_type%',
          config.boost[ctx.session.boostType as BoostType].name,
        ).replaceAll(
          '%nickname%',
          ctx.session.nickname,
        ).replaceAll(
          '%boost_type_amount%',
          config.boost[ctx.session.boostType as BoostType].amount,
        ).replaceAll(
          '%amount%',
          ctx.session.amount,
        ))
        .join('\r\n'),
      undefined,
      Markup.keyboard(
        [
          Markup.button(config.buttons.isCorrect, 'positive'),
          Markup.button(config.buttons.isInvalid, 'negative'),
        ],
      ).oneTime(),
    );
  },
  async (ctx) => {
    switch (ctx.message.text) {
      case config.buttons.isCorrect: {
        try {
          const order = await Redis.instance.createOrder(
            ctx.message.from_id,
            ctx.session.nickname,
            ctx.session.boostType,
            +ctx.session.amount,
          );
          ctx.reply(
            config.messages.order
              .map((v) => v.replaceAll(
                '%order_id%',
                order.orderId.toString(),
              ).replaceAll(
                '%queue_place%',
                order.queuePlace.toString(),
              ))
              .join('\r\n'),
            undefined,
            mainKeyboard,
          );
          ctx.scene?.leave();
        } catch (e) {
          console.warn(e);
          ctx.reply(
            'Что-то пошло не так :c',
            undefined,
            mainKeyboard,
          );
        }
        break;
      }
      case config.buttons.isInvalid: {
        ctx.scene?.enter('boost');
        break;
      }
      default: {
        ctx.reply(
          config.messages.showInfo
            .map((v) => v.replaceAll(
              '%boost_type%',
              config.boost[ctx.session.boostType as BoostType].name,
            ).replaceAll(
              '%nickname%',
              ctx.session.nickname,
            ).replaceAll(
              '%boost_type_amount%',
              config.boost[ctx.session.boostType as BoostType].amount,
            ).replaceAll(
              '%amount%',
              ctx.session.amount,
            ))
            .join('\r\n'),
          undefined,
          Markup.keyboard(
            [
              Markup.button(config.buttons.isCorrect, 'positive'),
              Markup.button(config.buttons.isInvalid, 'negative'),
            ],
          ).oneTime(),
        );
      }
    }
  },
);
