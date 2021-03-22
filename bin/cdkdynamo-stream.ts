#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkdynamoStreamStack } from '../lib/cdkdynamo-stream-stack';

const app = new cdk.App();
new CdkdynamoStreamStack(app, 'CdkdynamoStreamStack');
