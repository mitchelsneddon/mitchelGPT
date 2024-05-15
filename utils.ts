import { TableClient } from '@azure/data-tables';

// Save conversation history to Azure Table Storage
export async function saveConversationHistory(tableClient: TableClient, conversationId: string, message: string) {
    const partitionKey = conversationId;
    const rowKey = Date.now().toString(); // Use current timestamp as row key
    const entity = {
        partitionKey: partitionKey,
        rowKey: rowKey,
        message: message,
    };

    await tableClient.createEntity(entity);
}

// Retrieve conversation history from Azure Table Storage
export async function getConversationHistory(tableClient: TableClient, conversationId: string) {
    const partitionKey = conversationId;
    const entities: any[] = [];

    // List entities with the given partition key
    for await (const entity of tableClient.listEntities({
        queryOptions: {
            filter: `PartitionKey eq '${partitionKey}'`,
        },
    })) {
        entities.push({
            role: "user",
            content: entity.message,
        });
    }

    return entities;
}

// Clear conversation history from Azure Table Storage
export async function clearConversationHistory(tableClient: TableClient, conversationId: string) {
    // List and delete entities with the given partition key
    for await (const entity of tableClient.listEntities({
        queryOptions: {
            filter: `PartitionKey eq '${conversationId}'`,
        },
    })) {
        await tableClient.deleteEntity(entity.partitionKey, entity.rowKey);
    }
}
