import dotenv from 'dotenv';
dotenv.config({ path: 'env/.env.local' });

const config = {
  botId: process.env.BOT_ID!,
  botPassword: process.env.BOT_PASSWORD!,
};

export const azureAccountKey = process.env.AZURE_ACCOUNT_KEY!;
export const azureAccountName = process.env.AZURE_ACCOUNT_NAME!;
export const azureAccountTableName = process.env.AZURE_STORAGE_TABLE_NAME!;
export const azureOpenAIKey = process.env.AZURE_OPENAI_KEY!;
export const azureOpenAIAPI = process.env.AZURE_OPENAI_URL!;
export const azureBlobStoreContainer = process.env.AZURE_BLOB_STORE_CONTAINER!;

if (!config.botId || !config.botPassword) {
  throw new Error("Missing required bot environment variables");
}

if (!azureAccountKey || !azureAccountName || !azureAccountTableName || !azureOpenAIKey || !azureOpenAIAPI || !azureBlobStoreContainer) {
  throw new Error("Missing required Azure environment variables");
}

export default config;
