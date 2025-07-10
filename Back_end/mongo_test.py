
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi



# xxx: FUTURE MARK XXX THIS OUT BEFORE POSTING TO GITHUB AND XXX OUT EMAIL
uri = "x"
# connecting to cluster0 allows you to access and DATABASE in that entire cluster, in this case those would be admin, local and sample_mflix

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client.list_database_names() #db list (array) = to the name(s) of the databases in said cluster

print("The database names are: ",db) #prints the names of the databases in the cluster







# Send a ping to confirm a successful connection
#try:
#    client.admin.command('ping')
#    print("Pinged your deployment. You successfully connected to MongoDB!")
#    client.sample_mflix.command('ping')
    
#except Exception as e:
#        print(e)


client.close() # close out the connection aka "Client"