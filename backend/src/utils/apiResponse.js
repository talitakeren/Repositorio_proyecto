export const ok = (res, data = null, status = 200) =>
  res.status(status).json({ success: true, data });

export const fail = (res, message, status = 400, errors = null) =>
  res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
