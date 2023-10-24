# Smoothie API

Smoothie API provides all sorts of information related to smoothies and ingredients.

## Documentation

[DOCS](https://documenter.getpostman.com/view/15518089/2s8Z6sab7i#intro)

## Configuration

In the config folder there are 3 templates for .env files.
Each template contains the information needed by the API to run in the specified NODE_ENV. 

Example:

development.env.template
```
NODE_ENV=#Your Node Environment Here
HOST=#Your Host Here
PORT=#Your Port Here
SMOOTHIE_API_KEY=#Your API Key Here
MONGODB_URI=#Your URI Here
```

development.env
```
NODE_ENV=development
HOST=localhost
PORT=4000
SMOOTHIE_API_KEY="Secret_Key"
MONGODB_URI="mongodb://localhost/<dbname>"
```
