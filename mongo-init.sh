#!/bin/bash

mongo -- "$MONGO_INITDB_DATABASE" << EOF
   var db = db.getSiblingDB('$MONGO_INITDB_DATABASE');
   
   db.createUser({
      user: '$MONGO_USER_USERNAME',
      pwd: '$MONGO_USER_PASSWORD',
      roles: [{
         role: 'readWrite',
         db: '$MONGO_INITDB_DATABASE'
      }]
   });
EOF