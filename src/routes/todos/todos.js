const express = require('express');
const router = express.Router();
const todo_query = require('./todos.query');
const auth = require('../../middleware/auth');

router.use(express.json());

router.get('/', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	try {
		var query_result = await todo_query.view_all_todos();
	} catch {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	res.status(200).send(JSON.stringify(query_result, null, 4));
});

router.get('/:id', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	const id = req.params.id;
	if (id == null) {
		res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	try {
		var query_result = await todo_query.view_todo(id);
	} catch (err) {
		if (err === 'Not found') {
			return res.status(404).send(JSON.stringify({ msg: err }), null, 4);
		} else {
			return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
		}
	}
	res.status(200).send(JSON.stringify(query_result[0], null, 4));
});

router.post('/', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	const regEx = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
	if (req.body.title == null || req.body.description == null || req.body.due_time == null || !req.body.due_time.match(regEx) || req.body.user_id == null) {
		res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}

	try {
		var query_result = await todo_query.create_todo(req.body);
	} catch {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	res.status(201).send(JSON.stringify(query_result[0], null, 4));
});

router.put('/:id', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	const id = req.params.id;
	const regEx = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
	if (id == null || req.body.title == null || req.body.description == null || req.body.due_time == null || !req.body.due_time.match(regEx) || req.body.user_id == null) {
		res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}

	try {
		var query_result = await todo_query.update_toto(id, req.body);
	} catch {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	res.status(200).send(JSON.stringify(query_result[0], null, 4));
});

router.delete('/:id', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	if (isNaN(req.params.id)) {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	try {
		await todo_query.delete_todo(req.params.id);
	} catch {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	res.status(200).send(JSON.stringify({ msg: `succesfully deleted record number: ${req.params.id}` }), null, 4);
});

module.exports = router;
