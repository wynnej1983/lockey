# Lockey - Back-end

## Overview

This project is called **Lockey Smart Lock App - Back-end** and is a REST API
server that was designed to be consumed by the **Lockey Smart Lock App -
Mobile**. This service depends on the **Lockey Smart Lock App - Smart Lock Mock**, which needs to be running in order for this server to work.

The server exposes a `**/houses**` endpoint to retrieve a list of available houses (assume authentication is taken care of and you can retrieve all the available objects) and additional endpoints to access their locks. The following endpoint are available:

- **GET `/houses`**: lists all the houses on file. Example responses:

```bash
200 OK
[
  {
    "id": 1,
    "name": "Grafton"
  },
  {
    "id": 2,
    "name": "Baggot"
  },
  {
    "id": 3,
    "name": "O'Connell"
  }
]

400 Bad Request
```

- **GET`/houses/:houseId`**: retrieves info for a specific house. Example responses:

```bash
200 OK
{
  "id": 1,
  "name": "Grafton"
}

400 Bad Request
```

- **GET `/houses/:houseId/locks`**: lists all the locks for a specific house. Example responses:

```bash
200 OK
[
  {
    "id": 1,
    "category": "house", // ENUM: "house" or "room"
    "name": "Front door",
    "status": "locked" // ENUM: "locked", "unlocked", or "offline"
  },
  {
    "id": 2,
    "category": "house",
    "name": "Bicycle door",
    "status": "offline"
  },
  {
    "id": 3,
    "category": "room",
    "name": "Room #1",
    "status": "unlocked"
  },
  {
    "id": 4,
    "category": "room",
    "name": "Room #2",
    "status": "unlocked"
  },
  {
    "id": 5,
    "category": "room",
    "name": "Locker room #2",
    "status": "locked"
  }
]

400 Bad Request
```

- **GET** `/houses/:houseId/locks/:lockId`: retrieves info for a specific lock. Example responses:

```bash
200 OK
{
  "id": 1,
  "category": "house",
  "name": "Front door",
  "status": "locked"
}

400 Bad Request
```

- **PATCH** `/houses/:houseId/locks/:lockId/locking`: locks or unlocks a specific lock. Example request:

```bash
{
  "status": "unlocked" // ENUM: "locked" or "unlocked"
}
```

Example responses:

```bash
200 OK
{
  "id": 1,
  "category": "house",
  "name": "Front door",
  "status": "unlocked"
}

400 Bad Request
503 Service Unavailable // Lock is momentarily offline
```

## The stack

These are the main dependencies of this project:

- Node
- Express
- Babel
- Chai
- Mocha

## Notices

- There is no real DB, just a JSON file stored within the **Back-end** folder on _storage/houses.json_.

## How to install

### Requirements

It is required to have **git** and **npm** to clone the repository and install the code.

Also, please note that this service needs the port `4000` to be free. Alternatively you can change it on the config file:

- config/default.json

### Installation instructions

1. Clone the repository (if you haven't done it yet):

`git clone https://github.com/wynnej1983/lockey.git`

2. Make sure to have the **Smart Lock Mock** running.

3. Go to the project folder:

`cd lockey`

4. Install:

`npm install --prefix ./back-end`

5. Test:

`npm test --prefix ./back-end`

6. Start the service on _dev_ mode:

`npm start --prefix ./back-end`
