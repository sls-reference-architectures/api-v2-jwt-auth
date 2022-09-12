import Logger from "@dazn/lambda-powertools-logger";

const handler = async (event: any) => {
  Logger.debug("Hello JWT World!", { event });

  return {
    status: 200,
  };
};

export default handler;
