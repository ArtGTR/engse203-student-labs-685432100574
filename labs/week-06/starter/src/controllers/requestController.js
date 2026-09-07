import * as service from '../services/requestService.js';

/**
 * GET /api/requests
 */
export function listRequests(req, res) {
  const { status } = req.query;
  res.status(200).json(service.findAll({ status }));
}

/**
 * GET /api/requests/:id
 */
export function getRequest(req, res) {
  const found = service.findById(req.params.id);

  if (!found) {
    return res.status(404).json({
      error: `ไม่พบคำร้องรหัส ${req.params.id}`
    });
  }

  res.status(200).json(found);
}

/**
 * POST /api/requests
 */
export function createRequest(req, res) {
  const created = service.create(req.body);

  res.status(201).json(created);
}

/**
 * PUT /api/requests/:id
 */
export function updateRequestStatus(req, res) {
  const { status } = req.body;

  const allowedStatus = ['pending', 'in-progress', 'completed'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      error: 'สถานะไม่ถูกต้อง'
    });
  }

  const updated = service.updateStatus(req.params.id, status);

  if (!updated) {
    return res.status(404).json({
      error: `ไม่พบคำร้องรหัส ${req.params.id}`
    });
  }

  res.status(200).json(updated);
}

/**
 * DELETE /api/requests/:id
 */
export function deleteRequest(req, res) {
  const deleted = service.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      error: `ไม่พบคำร้องรหัส ${req.params.id}`
    });
  }

  res.status(204).end();
}