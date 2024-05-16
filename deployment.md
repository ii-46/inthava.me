## Deployment Instruction
### Setup PostgreSQL
##### Install postgresql
```shell
sudo apt update
sudo apt install postgresql
```
#### Start postgresql
```shell
sudo service postgresql start
```
#### Connect to postgresql using ```psql```
```shell
sudo -u postgres psql
```
#### Create database for project
postgres=# ```CREATE DATABASE "blog";```

postgres=# ```\c blog``` // select database


blog=# ```CREATE ROLE blog_manager WITH LOGIN PASSWORD 'pa55word';``` // create role to use in project

blog=# ```exit```

### Clone project to the machine
#### 
```shell
git clone https://github.com/ii-46/inthava.me.git
cd inthava.me
npm i
```

### Setup environment file ```.env```
create **.env** file in root directory of the project and in **.env** should have environment variable like this.
```text
DATABASE_URL="your-data-source-name"  
SESSION_SECRET="your-session-secret"
```
## Build Project
run this script before start project:
```shell
npm prisma-migrate
```
build project:
```shell
npm run build
```
## Start Project
```
npm start
```
you should be able to visit website on browser in your http://localhost:3000