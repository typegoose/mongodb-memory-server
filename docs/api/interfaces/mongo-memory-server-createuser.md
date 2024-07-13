---
id: mongo-memory-server-createuser
title: 'CreateUser'
---

API Documentation of `CreateUser`-Interface

## Values

This Interface inherits most values from the `CreateUserMongoDB` interface, which is a interface for the `createUser` command manually types, see [#663](https://github.com/typegoose/mongodb-memory-server/issues/663) for tracking on switching to native interface.

Because most values are inherited, only the new ones and important ones are described here.

### database

Typings: `database?: string`  
Default: `admin`

Set the Database where the user will be added to, by default the user will be added to the `admin` database.

### createUser

Typings: `createUser: string`

Set the username of the User to create.

### pwd

Typings: `pwd: string`

Set the password of the User to create.

### roles

Typings: `roles: ({ role: UserRoles; db: string } | UserRoles)[]`

Set the Roles the new User will have.  
For a list of available Roles, see the [MongoDB Documentation](https://www.mongodb.com/docs/manual/reference/built-in-roles/).
