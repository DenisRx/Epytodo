const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('../../middleware/auth');
const db = require('../../config/db');

router.use(express.json());

router.post('/register', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	const firstname = req.body.firstname;

	if (email == null || password == null || name == null || firstname == null) {
		return res.status(500).send(JSON.stringify({ msg: 'internal server error' }), null, 4);
	}

	bcrypt.genSalt(10, (err, salt) => {
		if (err) throw err;
		bcrypt.hash(password, salt, (err, crypted_password) => {
			if (err) throw err;
			const check = `SELECT * FROM user WHERE email='${email}'`;
			db.query(check, function (err, result) {
				if (err) throw err;
				if (result.length === 0) {
					const statement = `INSERT INTO user (email, name, firstname, password) VALUES ('${email}','${name}','${firstname}','${crypted_password}')`;
					db.query(statement, function (err) {
						if (err) throw err;
					});
					db.query(`SELECT id FROM user WHERE email='${email}'`, function (err, id_result) {
						if (err) throw err;
						res.status(201).send(JSON.stringify({ token: jwt.generateToken(id_result[0].id) }), null, 4);
					});
				} else {
					return res.status(409).send(JSON.stringify({ msg: 'account already exists' }), null, 4);
				}
			});
		});
	});
});

router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	if (email == null || password == null) {
		return res.status(401).send(JSON.stringify({ msg: 'Invalid Credentials' }), null, 4);
	}

	const check = `SELECT * FROM user WHERE email='${email}'`;
	db.query(check, function (err, result) {
		if (err) throw err;
		if (result.length === 0) {
			return res.status(401).send(JSON.stringify({ msg: 'Invalid Credentials' }), null, 4);
		} else {
			const statement = `SELECT id, password FROM user WHERE email='${email}'`;
			db.query(statement, function (err, user_result) {
				if (err) throw err;
				bcrypt.compare(password, user_result[0].password, function (err, res_bcrypt) {
					if (err) throw err;
					if (res_bcrypt) {
						return res.status(200).send(JSON.stringify({ token: jwt.generateToken(user_result[0].id) }), null, 4);
					} else {
						res.status(401).send(JSON.stringify({ msg: 'Invalid Credentials' }), null, 4);
					}
				});
			});
		}
	});
});

module.exports = router;