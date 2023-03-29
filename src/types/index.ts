export type Boost = {
  name: string,
  amount: string,
  input: string
};

export type BoostType = 'rating' | 'level' | 'battlepass';
export type MessageType = 'selectBoost'
| 'inputNickname'
| 'invalidNickname'
| 'unknownBoostType'
| 'invalidAmount'
| 'showInfo'
| 'order';
export type ButtonType = 'boost' | 'isCorrect' | 'isInvalid';

export type Config = {
  boost: Record<BoostType, Boost>
  messages: Record<MessageType, string[]>,
  buttons: Record<ButtonType, string>
};

export type Order = {
  id: number
  clientId: number
  boostType: BoostType
  nickname: string
  amount: number
  createdAt: string
  isClosed: boolean
};
