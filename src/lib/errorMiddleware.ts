export const errorMiddleware: VkBotMiddleware = async (_, next) => {
  try {
    await next?.();
  } catch (err) {
    console.error(err);
  }
};
