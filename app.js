const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/clusters', express.static(path.join(__dirname, 'clusters')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let roomIds = new Set(["514409"]);

// Ensure upload folder exists
const uploadDir = path.join(__dirname, 'uploads/all_photos');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.post('/upload', upload.array('photos', 100), (req, res) => {

  const roomId = req.body.roomId;
  if (!roomId) return res.status(400).send('Room ID is required!');
  if (!req.files || req.files.length === 0) return res.status(400).send('No files uploaded!');
  roomIds.add(roomId);
  console.log("Room IDs:", Array.from(roomIds));

exec(`python cluster_logic.py cluster ${roomId}`, (err, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);
    if (err) return res.status(500).send(`Error:\n<pre>${stderr}</pre>`);
    res.send(`
      ✅ Clustering complete!<br>
      Room ID: <b>${roomId}</b><br>
      <pre>${stdout}</pre>
    `);
});
});

// Optional: list all rooms
app.get('/rooms', (req, res) => {
  res.json({ rooms: Array.from(roomIds) });
});


app.get('/download/:roomId/:cluster', (req, res) => {
    const { roomId, cluster } = req.params;
    const clusterDir = path.join(__dirname, 'clusters', roomId, cluster);

    if (!fs.existsSync(clusterDir)) return res.status(404).send('Cluster not found');

    const zipName = `${cluster}.zip`;
    res.setHeader('Content-Disposition', `attachment; filename=${zipName}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);
    archive.directory(clusterDir, false);
    archive.finalize();
});


app.post('/search', upload.single('photo'), (req, res) => {
  const roomId = req.body.roomId;
  if (!roomId) return res.status(400).send('Room ID is required for search!');
  if (!roomIds.has(roomId)) return res.status(404).send('Invalid Room ID!');

  exec(`python cluster_logic.py search ${roomId}`, (err, stdout, stderr) => {
    if (err) return res.status(500).send(`Error:\n<pre>${stderr}</pre>`);

    // Extract cluster name and images from Python JSON output
    let result;
    try {
      result = JSON.parse(stdout);
    } catch (e) {
      return res.send(`⚠️ Error parsing cluster data: <pre>${stdout}</pre>`);
    }

    const { cluster, images } = result;
    if (!cluster || !images || images.length === 0) {
      return res.send(`<p>❌ No images found in this cluster.</p>`);
    }

    // Generate HTML with images and "Download All" button
    let imgTags = images.map(img => 
      `<img src="/clusters/${roomId}/${cluster}/${img}" width="150" style="margin:5px">`
    ).join('');

    // Temporary "Download All" zip link (optional: you can implement zip generation later)
    let downloadBtn = `<a href="/clusters/${roomId}/${cluster}" download style="display:block; margin:20px 0;">⬇️ Download All</a>`;

    
res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ImageGenie - Search Results</title>
    <link rel="stylesheet" href="/style3.css">
</head>
<body>
    <div class="navbar">
        <div class="navbar-logo">ImageGenie</div>
    </div>

    <div class="container2" style="margin-top:30px;">
        <h1>Here are your Images</h1>
        <a href="/download/${roomId}/${cluster}" style="display:block; margin:20px 0;">⬇️ Download All</a>
        <div style="display:flex; flex-wrap:wrap;">
            ${imgTags}
        </div>
    </div>

  <footer class="footer">
    <p>&copy; 2024 ImageGenie</p>
  </footer>

</body>
</html>
`);

  });
});

const archiver = require('archiver');

app.get('/download/:roomId/:cluster', (req, res) => {
    const { roomId, cluster } = req.params;
    const clusterDir = path.join(__dirname, 'clusters', roomId, cluster);

    if (!fs.existsSync(clusterDir)) {
        return res.status(404).send('Cluster folder not found!');
    }

    const zipName = `${cluster}.zip`;
    res.setHeader('Content-Disposition', `attachment; filename=${zipName}`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => res.status(500).send({ error: err.message }));
    archive.pipe(res);

    archive.directory(clusterDir, false); // include files, not folder itself
    archive.finalize();
});




app.post('/check-room', (req, res) => {
  const roomId = req.body.roomId; // ✅ safer than destructuring
  console.log("CHECK ROOM REQ:", req.body);

  if (roomIds.has(roomId)) {
      res.json({ exists: true });
  } else {
      res.json({ exists: false });
  }
});



app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));


