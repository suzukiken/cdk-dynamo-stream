from boto3.dynamodb.types import TypeDeserializer

def lambda_handler(event, context):
    
    deserializer = TypeDeserializer()

    for record in event['Records']:

        dynamodb_item = record['dynamodb']['NewImage']

        deserialized = {
            k: deserializer.deserialize(v)
            for k, v in dynamodb_item.items()
        }
        
        print(deserialized)
