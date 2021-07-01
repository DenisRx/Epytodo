const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const user_query = require('./user.query');

router.use(express.json());

router.get('/', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	try {
		var query_result = await user_query.view_all_users();
	} catch {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	res.status(200).send(JSON.stringify(query_result, null, 4));
});

router.get('/todos', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	const user_id = auth.getId(token);
	try {
		var query_result = await user_query.view_user_tasks(user_id);
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

	let query_result = '';
	if (!isNaN(req.params.id)) {
		try {
			query_result = await user_query.view_user_infos(req.params.id, null);
		} catch {
			return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
		}
	} else {
		try {
			query_result = await user_query.view_user_infos(null, req.params.id);
		} catch {
			return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
		}
	}
	res.status(200).send(JSON.stringify(query_result[0], null, 4));
});

router.put('/:id', async (req, res) => {
	token = auth.verifyToken(req.headers.authorization);
	if (token === 1) {
		return res.status(401).send(JSON.stringify({ msg: 'No token, authorization denied' }), null, 4);
	} else if (token === 2) {
		return res.status(401).send(JSON.stringify({ msg: 'Token is not valid' }), null, 4);
	}

	if (isNaN(req.params.id) || req.body.email == null || req.body.password == null || req.body.name == null || req.body.firstname == null) {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}

	user_query.update_user_infos(req.params.id, req.body);
	try {
		var query_result = await user_query.view_user_infos(req.params.id, null);
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
		await user_query.delete_user(req.params.id);
	} catch {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}
	res.status(200).send(JSON.stringify({ msg: `succesfully deleted record number: ${req.params.id}` }), null, 4);
});

module.exports = router;
