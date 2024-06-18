from pymongo import MongoClient

# MongoDB connection string
mongo_uri = "mongodb+srv://admin:admin123@mydatabase.53nmflx.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase"

# Connect to MongoDB
client = MongoClient(mongo_uri)

# Check if connected to MongoDB
try:
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("Connected to MongoDB successfully!")
except Exception as e:
    print("Failed to connect to MongoDB:", e)
finally:
    # Close the MongoDB connection
    client.close()