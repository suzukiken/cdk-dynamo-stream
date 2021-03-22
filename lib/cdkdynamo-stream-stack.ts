import * as cdk from '@aws-cdk/core';
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import { PythonFunction } from "@aws-cdk/aws-lambda-python";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";

export class CdkdynamoStreamStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX = id.toLowerCase().replace('stack', '')
    
    // tabe
	
    const table = new dynamodb.Table(this, "table", {
      tableName: PREFIX + "-table",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.NUMBER,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    })
    
    // role for Lambda to process Dynamo stream
    
    const role = new iam.Role(this, "role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: PREFIX + "-role",
    });
    
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AWSLambdaInvocation-DynamoDB"
      )
    );
    
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );
    
    // Lambda
    
    const lambda_function = new PythonFunction(this, "lambda_function", {
      entry: "lambda",
      index: "log.py",
      handler: "lambda_handler",
      functionName: PREFIX + "-log",
      runtime: lambda.Runtime.PYTHON_3_8,
      role: role,
      timeout: cdk.Duration.seconds(10),
    });
    
    // set Lambda as trigger of stream
    
    lambda_function.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );
  }
}

