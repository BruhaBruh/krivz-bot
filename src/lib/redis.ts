import { createClient } from 'redis';
import { BoostType, Order } from '../types';

export class Redis {
  private client = createClient({
    url: process.env.REDIS_URL ?? undefined,
  });

  private currentQueuePlace: number = 0;

  static instance = new Redis();

  async connect() {
    return this.client.connect().then(async () => {
      const orders = await this.client.hGetAll('orders');
      const lastId = Object.keys(orders).map((v) => +v).sort().findLast(() => true);
      this.currentQueuePlace = lastId ?? 0;
    });
  }

  async createOrder(clientId: number, nickname: string, boostType: BoostType, amount: number) {
    const order: Order = {
      id: this.currentQueuePlace + 1,
      clientId,
      boostType,
      nickname,
      amount,
      createdAt: new Date().toISOString(),
      isClosed: false,
    };

    const result = await this.client
      .multi()
      .hSet('orders', order.id, JSON.stringify(order))
      .hGetAll('orders')
      .exec();
    if (result[0] !== 1) throw Error(result[0]?.toString());
    const queuePlace = (Object.values(result[1] as object).map((v) => JSON.parse(v)) as Order[])
      .filter((v) => !v.isClosed)
      .sort((a, b) => b.id - a.id)
      .filter((v) => v.id <= order.id)
      .length;

    this.currentQueuePlace += 1;

    return {
      orderId: order.id,
      queuePlace,
    };
  }
}
