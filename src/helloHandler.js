import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'api-v2-jwt-auth' });

export const handler = async (event) => {
  logger.debug('Hello JWT World!', { event });

  return {
    status: 200,
  };
};
