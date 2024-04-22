'use strict';
import AWS from 'aws-sdk';
import { Product, products } from './products';
import { v4 as uuidv4 } from 'uuid';

const bestsellers = JSON.parse(JSON.stringify(products));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.exportBestsellers = async () => {
  const promises = bestsellers.map((product: Product) => {
    const params = {
      TableName: process.env.DYNAMODB_TABLE as string,
      Item: {
        id: uuidv4(),
        ...product,
      },
    };

    console.log(`Attempting to save product: ${product.title}`);
    return dynamoDb
      .put(params)
      .promise()
      .then(() => {
        console.log(`Successfully saved product: ${product.title}`);
      })
      .catch(error => {
        console.error(`Error saving product ${product.title}:`, error);
        throw error;
      });
  });

  try {
    await Promise.all(promises);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data stored successfully' }),
    };
  } catch (error) {
    console.error('Error saving to DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to store data',
        details: error,
      }),
    };
  }
};

module.exports.getBestsellers = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Bestsellers table data retrieved successfully',
        data: data.Items,
      }),
    };
  } catch (error) {
    console.error('Error retrieving data from DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to retrieve data',
        details: error,
      }),
    };
  }
};
