import Logger from '@dazn/lambda-powertools-logger';

export const handler = async (event) => {
  Logger.debug('Hello JWT World!', { event });

  return {
    status: 200,
  };
};
