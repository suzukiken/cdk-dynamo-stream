import boto3
from botocore.config import Config
from faker import Faker

faker_jp = Faker(['ja_JP'])

TABLE_NAME = 'cdkdynamostream-table'

config = Config(retries={'max_attempts': 10, 'mode': 'standard'})

resource = boto3.resource('dynamodb', config=config)
table = resource.Table(TABLE_NAME)

for i in range(10):
    item = {
        'id': i,
        'name': faker_jp.name(),
        'mail': faker_jp.ascii_safe_email(),
        'date_of_birth': faker_jp.date_of_birth().isoformat(),
    }
    response = table.put_item(
        Item=item,
        ReturnValues='NONE',
        ReturnConsumedCapacity='TOTAL')
