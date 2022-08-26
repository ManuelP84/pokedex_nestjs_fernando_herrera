<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Execute in development

1. Clone the repository
2. Execute the command
```
npm install
```
3. Install Nest CLI 
```
npm install -g @nestjs/cli
```
4. Set up the database
```
docker-compose up -d
```
5. Clone the file ___.env.template___ and rename it to  ___.env___

6. Fill the environment variables into ___.env___

7. Run the app (on development) with the command: 
```
npm run start:dev
```
6. Rebuild the database with the seed (on development)
```
http://localhost:3000/api/v1/seed
```

# Stack
* MongoDB
* NestJs
* Docker