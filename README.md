# inthava.me
___
## Guild for Deployment on Ubuntu
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

### Clone project to your machine
#### 
```shell

```

### Setup environment file ```.env``` 
If your follow along you data source name should be like this:
```text
postgres://blog_manager:pa55word@localhost/blog
```
create **.env** file in root directory of the project and in **.env** should have environment variable like this.
```text

```