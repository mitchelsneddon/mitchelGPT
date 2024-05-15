import { ActivityTypes, TeamsActivityHandler, TurnContext, TeamsChannelAccount, TeamsInfo } from 'botbuilder';
import axios from 'axios';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { azureAccountKey, azureAccountName, azureAccountTableName, azureOpenAIKey, azureOpenAIAPI, azureBlobStoreContainer } from './config';
import { saveConversationHistory, getConversationHistory, clearConversationHistory } from './utils';

export class TeamsBot extends TeamsActivityHandler {
  private tableClient: TableClient; // Azure Table Client to handle table storage
  private blobServiceClient: BlobServiceClient; // Azure Blob Service Client to handle blob storage

  constructor() {
    super();

    // Azure credential setup
    const credential = new AzureNamedKeyCredential(azureAccountName, azureAccountKey);
    const blobCredential = new StorageSharedKeyCredential(azureAccountName, azureAccountKey);
    const tableServiceURL = `https://${azureAccountName}.table.core.windows.net`;
    const blobServiceURL = `https://${azureAccountName}.blob.core.windows.net`;
    let temperature = 0.6; // Default temperature for the bot's responses (creativity level)

    // Initialize table and blob service clients
    this.tableClient = new TableClient(tableServiceURL, azureAccountTableName, credential);
    this.blobServiceClient = new BlobServiceClient(blobServiceURL, blobCredential);

    // Handle incoming messages
    this.onMessage(async (context: TurnContext, next: () => Promise<void>) => {
      try {
        // Get user information
        const member = context.activity.from as TeamsChannelAccount;
        const user = await TeamsInfo.getMember(context, member.id);
        const userName = user?.givenName || 'User';

        await context.sendActivity({ type: ActivityTypes.Typing }); // Show typing indicator
        let userPrompt = context.activity.text; // User's message

        // Check if the user wants to set the temperature
        const setTemperatureRegex = /set temp (\d+(\.\d+)?)/i;
        if (setTemperatureRegex.test(userPrompt)) {
          const matches = userPrompt.match(setTemperatureRegex);
          const setTemperature = parseFloat(matches![1]);

          if (setTemperature >= 0 && setTemperature <= 2) {
            userPrompt = userPrompt.replace(setTemperatureRegex, '').trim();
            temperature = setTemperature;
            await context.sendActivity(`Sure, ${userName}! I've set the temperature to ${temperature}.`);
          } else {
            await context.sendActivity(`Sorry, ${userName}, the number ${setTemperature} is not within the valid range (0 to 2). Please provide a number between 0 and 2 to set the temperature.`);
            return;
          }
        }
        // Check if the user wants to reset the conversation
        else if (userPrompt.trim().toLowerCase() === 'reset') {
          await clearConversationHistory(this.tableClient, context.activity.conversation.id);
          await context.sendActivity(`${userName}, our previous conversation history has been cleared.`);
          await context.sendActivity(`To start a new conversation, just send me a question.`);
        }
        // Handle regular conversation
        else {
          // Save the conversation history
          await saveConversationHistory(this.tableClient, context.activity.conversation.id, userPrompt);

          // Retrieve conversation history
          const conversationHistory = await getConversationHistory(this.tableClient, context.activity.conversation.id);

          // Make a request to OpenAI API
          const response = await axios.post(
            azureOpenAIAPI,
            {
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: `Your name is ${userName}, My name is MitchelGPT. I am your helpful assistant. You work at a digital development agency as a full stack developer. My answers to you will include in-depth explanations but my examples won't give me the full answer.` },
                { role: "user", content: userPrompt },
                ...conversationHistory,
              ],
              temperature: temperature,
            },
            {
              headers: {
                "API-KEY": azureOpenAIKey,
                "Content-Type": "application/json",
              },
            }
          );

          // Send response back to user
          await context.sendActivity(response.data.choices[0].message.content.trim());
        }
      } catch (error) {
        console.error("Error handling message:", error);
        await context.sendActivity("Sorry, something went wrong while processing your request.");
      }

      await next();
    });

    // Handle new members added to the conversation
    this.onMembersAdded(async (context, next) => {
      try {
        const member = context.activity.from as TeamsChannelAccount;
        const user = await TeamsInfo.getMember(context, member.id);
        const userName = user?.givenName || 'User';

        // Welcome message to new members
        for (const idx in context.activity.membersAdded) {
          if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
            await context.sendActivity(`Hello ${userName}! I am MitchelGPT powered by OpenAI.`);
            await context.sendActivity(`I am designed to be your ultimate digital assistant, always ready to lend a helping hand. Whether you need creative ideas, technical support, or strategic guidance, I am here to serve you around the clock.`);
            await context.sendActivity(`If at any time you need a refresher on some of the useful prompts, please check out "about" at the top of the chat. If you want to reset our conversation, just send the message "reset".`);
          }
        }
      } catch (error) {
        console.error("Error handling members added:", error);
      }

      await next();
    });
  }
}
