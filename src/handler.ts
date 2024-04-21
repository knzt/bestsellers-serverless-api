import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { products } from '@/products';

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async () => {
  console.log('Saving products to DynamoDB...');
  const promises = products.map(product => {
    const params = {
      TableName: process.env.DYNAMODB_TABLE as string,
      Item: {
        id: uuidv4(),
        ...product,
      },
    };

    return dynamoDb.put(params).promise();
  });

  try {
    await Promise.all(promises);
    console.log('All products saved successfully.');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data stored successfully' }),
    };
  } catch (error) {
    console.error('Error saving to DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to store data' }),
    };
  }
};
