
import express from 'express';
import account from './account';
import project from './project';

const router = express.Router();
router.use('/account', account);
router.use('/project', project);


export default router;