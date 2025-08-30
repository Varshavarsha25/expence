import express from 'express';
import { listFlags, getFlag } from '../config/featureFlags';

const router = express.Router();

// GET /api/feature-flags - list all flags
router.get('/', (_req, res) => {
  res.json({ success: true, data: listFlags() });
});

// GET /api/feature-flags/:key - get a single flag by key
router.get('/:key', (req, res) => {
  const flag = getFlag(req.params.key);
  if (!flag) {
    return res.status(404).json({ success: false, error: 'Flag not found' });
  }
  res.json({ success: true, data: flag });
});

export default router;