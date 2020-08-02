# FindSkill API

FindSkill API is a Node.js Express RESTful application that integrates with an Atlas MongoDB database and Google Map.

# Endpoints
## POST /users
It creates a User.

Request body:

{

    "name": "User_name",
    "skill": "Skill short name",
    "postcode": "OX2 0HA",
    "description":"Skill description",
    "free": false,
    "professional":true,
    "email": "JS @gmail.com"
}

Response:

{

    "free": false,
    "professional": true,
    "_id": "5f268adfa771653ae8619a41",
    "name": "PM_User2",
    "postcode": "OX2 0HA",
    "skill": "PM_Skill2",
    "description": "PM_description2",
    "email": "JS @gmail.com",
    "long": "-1.2873652",
    "lat": "51.7512025",
    "createdAt": "2020-08-02T09:43:59.627Z",
    "__v": 0
}

## GET /users

It lists all Users.

Response:

[

    {
        "free": false,
        "professional": true,
        "_id": "5f256b02aa521c4d5ea0855a",
        "name": "John Smith",
        "postcode": "SK17 7DD",
        "skill": "JSSkill",
        "description": "This is the description",
        "email": "JS@gmail.com",
        "long": "-1.9038155",
        "lat": "53.2640111",
        "createdAt": "2020-08-01T13:15:46.589Z",
        "__v": 0
    },
    {
        "free": true,
        "professional": false,
        "_id": "5f256e7aaa521c4d5ea0855c",
        "name": "FE_Name",
        "postcode": "SK17 0SU",
        "skill": "FE_Skill",
        "description": "FE_Description",
        "email": "FE@gmail.com",
        "long": "-2.0055525",
        "lat": "53.1890914",
        "createdAt": "2020-08-01T13:30:34.196Z",
        "__v": 0
    }
]

## GET /users/:id

It lists User by Id.

Response:

{

    "free": false,
    "professional": true,
    "_id": "5f268adfa771653ae8619a41",
    "name": "PM_User2",
    "postcode": "OX2 0HA",
    "skill": "PM_Skill2",
    "description": "PM_description2",
    "email": "JS @gmail.com",
    "long": "-1.2873652",
    "lat": "51.7512025",
    "createdAt": "2020-08-02T09:43:59.627Z",
    "__v": 0
}

## PATCH /users/:id

It updates User by Id.

Request body: (*note: use the fields to be updated only)*

{

    "name": "UpdatedName",
    "skill": "UpdatedSkill",

}

Response:

{

    "free": false,
    "professional": true,
    "_id": "5f268adfa771653ae8619a41",
    "name": "UpdatedName",
    "postcode": "OX2 0HA",
    "skill": "UpdatedSkill",
    "description": "PM_description2",
    "email": "JS @gmail.com",
    "long": "-1.2873652",
    "lat": "51.7512025",
    "createdAt": "2020-08-02T09:43:59.627Z",
    "__v": 0
}
# Database

The database consists of two collections.

The user collections data is mainly user input. The longitude and the latitude are coming from the GeoCoding collections. The create user functionality checks if the user's postcode is already in the Geocoding collections. If the postcode is not stored yet, the functionality sends a request to Google Map's Geocoding service. As soon as the postcode with the longitude and the latitude is available in the collection, the user's document is created in MongoDB. 

### User collection


* name

    * User input,
    * String,
    * Required

* postcode (User input)
    * User input,
    * String,
    * Required

* skill
    * User input,
    * String,
    * Required

* skill detailed description
    * User input,
    * String,
    * Required

* if the offered service is free
    * User input,
    * Boolean,
    * Required
    * Defult: true

* if the offered service is professional
    * User input,
    * Boolean,
    * Required
    * Defult: false

* contact email address
    * User input,
    * String,
    * Required

* longitude
    * Retrieved from the GeoCoding collection,
    * String,
    * Required

* latitude
    * Retrieved from the GeoCoding collection,
    * String,
    * Required

* createdAt
    * Automatic field
    * Date

### GeoCoding

* postcode
 
* longitude
    * Google MAP API Geocoding result,
    * String,
    * Required

* latitude
    * Google MAP API Geocoding result,
    * String,
    * Required

# Deployment


# Development utilities used:

- The App was built using Express
- Testing: Mocha, Chai, supertest
- Packages: nodemon, dotenv, cors, mongoose


# To run the App

* Clone the repo:

        https://github.com/aveiszhab/find-skill.api

* start the server

        npm start 

* use postman to test the routes

# Author:
Aniko Veiszhab