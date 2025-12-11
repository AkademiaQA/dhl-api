// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // baza (lowdb)
const middlewares = jsonServer.defaults();
const rewriter = jsonServer.rewriter(require('./routes.json'));

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 👉 Rewriter – najpierw, żeby /api/... mapowało się na /shipments, /track itd.
server.use(rewriter);

// 👉 Lista dozwolonych statusów
const ALLOWED_STATUSES = [
  'Nadana',
  'Przyjęta w sortowni',
  'Wydana do doręczenia',
  'Doręczona'
];

// 👉 Middleware 1: automatyczne dodanie statusu przy nadaniu paczki (POST /shipments)
server.post('/shipments', (req, res, next) => {
  const now = new Date().toISOString();

  if (!req.body.statusHistory || !Array.isArray(req.body.statusHistory)) {
    req.body.statusHistory = [];
  }

  const initialStatus = req.body.currentStatus || 'Nadana';
  req.body.currentStatus = initialStatus;

  req.body.statusHistory.push({
    timestamp: now,
    status: initialStatus
  });

  // router zajmie się faktycznym utworzeniem rekordu
  next();
});

// 👉 Middleware 2: walidacja statusu + automatyczne dopisanie do statusHistory
server.use((req, res, next) => {
  const isUpdate =
    (req.method === 'PATCH' || req.method === 'PUT') &&
    /^\/shipments\/\d+$/.test(req.path);

  if (!isUpdate) {
    return next();
  }

  // 1️⃣ WALIDACJA STATUSU
  if (req.body.currentStatus && !ALLOWED_STATUSES.includes(req.body.currentStatus)) {
    return res.status(400).json({
      error: 'Invalid status',
      allowed: ALLOWED_STATUSES,
      received: req.body.currentStatus
    });
  }

  // 2️⃣ AUTODOPISANIE STATUS HISTORY, JEŚLI STATUS SIĘ ZMIENIŁ
  const id = Number(req.path.split('/')[2]);
  const db = router.db; // lowdb
  const existing = db.get('shipments').find({ id }).value();

  if (
    existing &&
    req.body.currentStatus &&
    req.body.currentStatus !== existing.currentStatus
  ) {
    const now = new Date().toISOString();
    const history = existing.statusHistory || [];

    req.body.statusHistory = history.concat({
      timestamp: now,
      status: req.body.currentStatus
    });
  }

  next();
});

// 👉 Mini DHL API: śledzenie paczki
// /track/:id i dzięki rewriterowi także /api/track/:id
server.get('/track/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = router.db;
  const shipment = db.get('shipments').find({ id }).value();

  if (!shipment) {
    return res.status(404).json({
      error: 'Shipment not found',
      code: 'SHIPMENT_NOT_FOUND',
      trackingId: id
    });
  }

  return res.json({
    trackingId: id,
    currentStatus: shipment.currentStatus,
    statusHistory: shipment.statusHistory || [],
    sender: shipment.sender,
    receiver: shipment.receiver
  });
});

// 👉 DELETE /shipments/:id – ZAWSZE 204 No Content (nawet jeśli paczki nie ma)
server.delete('/shipments/:id', (req, res) => {
  const id = Number(req.params.id);
  const db = router.db;

  // próbujemy usunąć – jeśli nie ma, remove po prostu nic nie zrobi
  db.get('shipments').remove({ id }).write();

  // zawsze 204, bez body
  return res.status(204).end();
});

// Na końcu standardowy router json-server
server.use(router);

// Start serwera
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server with custom API is running on http://localhost:${PORT}`);
});
