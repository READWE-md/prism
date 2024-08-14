from pymongo import MongoClient
from dotenv import load_dotenv
import os, sys
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')



def store_contract_document(contract_document):
    try:
        client = MongoClient(MONGODB_URI)
        database = client.get_database("gimisangung")
        contracts = database.get_collection("contracts")
        contracts.insert_one(contract_document)
    finally:
        client.close()