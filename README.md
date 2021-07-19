# Epytodo

Epytodo is an Epitech first year project which consists of building a web application for Todo List. To do so, we set up a database and a web server using MySQL and Node.js (Express).

---

### Routes

Here is a listing of all the routes:

|route | method | description |
|------|--------|-------------|
|/register | POST | register a new user 
|/login | POST | connect a user 
|/user | GET | view all user informations 
|/user/todos | GET | view all user tasks 
|/user/:id or :email | GET | view user information 
|/user/:id | PUT | update user information 
|/user/:id | DELETE | delete user 
|/todo | GET | view all the todos 
|/todo/:id | GET | view the todo 
|/todo | POST | create a todo 
|/todo/:id | PUT | update a todo 
|/todo/:id | DELETE | delete a todo

### Protection

Most of these routes are protected using JWT (JSON Web Token) to allow access only to logged in users. Otherwise, an error message is sent:
```
"No token, authorization denied"
```
or 
```
"Token is not valid"
```
The token is available after registration and for each connection.

### Result

In case of success, the result is sent in JSON format and contains all informations corresponding to the route.
Here is an example of the result from "/todo" route with GET method:
```json
[
	{
		"id" : "1",
		"title" : "title",
		"description" : "desc",
		"created_at" : "2021-03-03 19:24:00",
		"due_time" : "2021-03-04 19:24:00",
		"user_id" : "1",
		"status" : "done"
	},
	{
		"id" : "2",
		"title" : "title",
		"description" : "desc",
		"created_at" : "2021-03-05 19:24:00",
		"due_time" : "2021-03-06 19:24:00",
		"user_id" : "2",
		"status" : "doing"
	}
]
```

## Authors

- [Baptiste Mounier](https://github.com/Baptiste-MV)
- [Denis Roux](https://github.com/DenisRx)
- [Nathan Lemale](https://github.com/Naleeee)
