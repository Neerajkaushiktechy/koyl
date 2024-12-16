# koyl Api

## Environment

- `node: >= 8.9.0 < 10.15.0`

### Setup

**Pre-requesites**

- Install mongo db

### Development


Run `yarn && yarn dev` from the root of the directory. Your changes will be watched.

## Structure

All the core app code is within the `src/app` directory. The following is the setup for the app:

```
+ -- src
|   + -- routes: includes the endpoints for specific entities/integrations
|   + -- index.js: server entry file
```

## Database

We use mongo db at the database level.

## Routes

All the necessary api routes should be added here and included in the `src/index.js` entry file.

## Configuration

Utilise environment variables that get imported at runtime.
