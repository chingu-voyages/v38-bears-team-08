// import express from 'express';
// import { userRouter } from './user/userRoutes.js';
const express = require('express');
const userRouter  = require('./user/userRouter.js');
const authRouter = require('./authentication/firebaseAuthenticationRouter.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'API connected'});
});

router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router; 