#!/bin/bash
rm -r src/models
sequelize-auto -h "db-propple-main.cqjdkpwcrocd.us-east-1.rds.amazonaws.com" -d "ProppleTest" -u "master" -x "master123" -p 3306  --dialect "mysql" -c "./src/config.js" -o "./src/models"