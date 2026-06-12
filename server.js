import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';
import os from 'os';
import { randomUUID } from 'crypto';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3050;

// Resolve Paths from ENV or fallback
const PYTHON_SCRIPTS_DIR = process.env.PYTHON_SCRIPTS_DIR || join(os.homedir(), 'AppData', 'Local', 'Programs', 'Python', 'Python312', 'Scripts');
const FFMPEG_DIR = process.env.FFMPEG_DIR || 'C:\\ffmpeg\\bin';
const FFMPEG_EXE = join(FFMPEG_DIR, os.platform() === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');

app.use(cors({ origin: '*', methods: ['GET', 'POST'], credentials: true }));
app.use(express.json({ limit: '50mb' }));

// Serve Static Frontend
app.use(express.static(join(__dirname, 'public')));

// Task Store
const hybridTasks = new Map();

function getAllFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const getExe = (name) => join(PYTHON_SCRIPTS_DIR, os.platform() === 'win32' ? `${name}.exe` : name);

// ----------------------------------------------------
// HYBRID MUSIC DOWNLOADER (Spotify, YT, SC)
// ----------------------------------------------------
app.post('/api/download/hybrid', (req, res) => {
  const { url, format = 'mp3' } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const isSpotify = /spotify\.com/.test(url);
  const isYTOrSC = /youtube\.com|youtu\.be|soundcloud\.com/.test(url);

  if (!isSpotify && !isYTOrSC) {
    return res.status(400).json({ error: 'Unsupported URL format. Must be Spotify, YouTube, or SoundCloud.' });
  }

  const taskId = randomUUID();
  const tempDir = join(os.tmpdir(), `hybrid_${taskId}`);
  
  try {
    fs.mkdirSync(tempDir, { recursive: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create temp buffer' });
  }

  const task = {
    id: taskId, url, format, dir: tempDir, logs: [], status: 'running', clients: new Set(), process: null
  };
  hybridTasks.set(taskId, task);

  let exeName = '';
  let args = [];
  
  if (isSpotify) {
    exeName = getExe('spotdl');
    args = [
      url, 
      '--ffmpeg', FFMPEG_EXE,
      '--output', join(tempDir, '{artist} - {title}.{ext}'),
      '--format', format === 'm4a' ? 'm4a' : 'mp3'
    ];
    if (fs.existsSync(join(__dirname, 'youtube_cookies.txt'))) {
      args.push('--yt-dlp-args', `--cookies "${join(__dirname, 'youtube_cookies.txt')}" -N 8`);
    } else {
      args.push('--yt-dlp-args', '-N 8');
    }
  } else {
    exeName = getExe('yt-dlp');
    args = ['-x'];
    if (format === 'mp3') {
      args.push('--audio-format', 'mp3', '--audio-quality', '320K');
    } else {
      args.push('--audio-format', 'm4a');
    }
    args.push(
      '--embed-metadata', '--embed-thumbnail', '--newline', '-N', '8',
      '-P', tempDir, '-o', '%(title)s.%(ext)s'
    );
    if (fs.existsSync(join(__dirname, 'youtube_cookies.txt'))) {
      args.push('--cookies', join(__dirname, 'youtube_cookies.txt'));
    }
    args.push(url);
  }
  
  const envPath = process.env.PATH + (os.platform() === 'win32' ? `;${FFMPEG_DIR}` : `:${FFMPEG_DIR}`);
  const child = spawn(exeName, args, {
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PATH: envPath }
  });
  task.process = child;

  const cleanLogMessage = (msg) => {
    let cleaned = msg.replace(/[a-zA-Z]:\\[^\s"']+/g, (match) => {
      return `[SYSTEM_FILE]/${match.split('\\').pop()}`;
    });
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return '';
    if (cleaned.match(/^[\(\)\-\s]+$/) || cleaned === '-' || cleaned === 'DE' || cleaned === 'FR') return '';
    if (cleaned.includes('LookupError: No results found')) return `[ERROR] ❌ Song not found. Skipping...`;
    if (cleaned.includes('Downloaded "')) {
      const match = cleaned.match(/Downloaded "([^"]+)"/);
      if (match) return `[SUCCESS] ✅ "${match[1]}" downloaded!`;
    }
    if (cleaned.includes('Found') && cleaned.includes('songs in')) return `[INFO] 🎵 Playlist loaded. Starting download...`;
    if (cleaned.includes('Processing query:')) return `[SYSTEM] 🔍 Processing URL...`;
    if (cleaned.includes('[download] Destination:') || cleaned.includes('Downloading webpage')) return '';
    return cleaned;
  };

  const broadcastLog = (msg) => {
    const cleanMsg = cleanLogMessage(msg);
    if (cleanMsg) {
      task.logs.push(cleanMsg);
      task.clients.forEach(c => c.write(`data: ${JSON.stringify({ status: 'log', message: cleanMsg })}\n\n`));
    }
  };

  let stdoutBuf = '';
  child.stdout.on('data', (data) => {
    stdoutBuf += data.toString('utf-8');
    let lines = stdoutBuf.split(/\r?\n/);
    stdoutBuf = lines.pop();
    lines.forEach(l => l.trim() && broadcastLog(l.trim()));
  });

  child.stderr.on('data', (data) => {
    const text = data.toString('utf-8').trim();
    if (text) broadcastLog(`[stderr] ${text}`);
  });

  child.on('close', () => {
    const downloadedFiles = getAllFiles(task.dir);
    if (task.status !== 'error') {
      task.status = downloadedFiles.length > 0 ? 'done' : 'error';
      if (task.status === 'done') broadcastLog(`[SYSTEM] Finished. ${downloadedFiles.length} files downloaded.`);
    }
    task.clients.forEach(c => {
      c.write(`data: ${JSON.stringify({ status: task.status })}\n\n`);
      c.end();
    });
    task.clients.clear();
  });

  res.json({ taskId });
});

// ----------------------------------------------------
// VIDEO / PHOTO DOWNLOADER
// ----------------------------------------------------
app.post('/api/download/video', (req, res) => {
  const { url, format = 'best_mp4' } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const taskId = randomUUID();
  const tempDir = join(os.tmpdir(), `hybrid_${taskId}`);
  
  try {
    fs.mkdirSync(tempDir, { recursive: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create temp buffer' });
  }

  const task = {
    id: taskId, url, format, dir: tempDir, logs: [], status: 'running', clients: new Set(), process: null
  };
  hybridTasks.set(taskId, task);

  const exeName = getExe('yt-dlp');
  let args = [];

  if (format === '1080p') {
    args.push('-f', 'bv*[ext=mp4][height<=1080]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b / best');
  } else if (format !== 'photo') {
    args.push('-f', 'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b / best');
  }

  if (format !== 'photo') {
    args.push('-S', 'vcodec:h264,res,acodec:m4a', '--merge-output-format', 'mp4');
  }

  args.push('--embed-metadata', '--newline', '-P', tempDir, '-o', '%(title)s.%(ext)s');

  let cookieFile = 'cookies.txt';
  if (url.includes('youtube') || url.includes('youtu.be')) cookieFile = 'youtube_cookies.txt';
  else if (url.includes('instagram')) cookieFile = 'instagram_cookies.txt';

  const cookiesPath = join(__dirname, cookieFile);
  if (fs.existsSync(cookiesPath)) args.push('--cookies', cookiesPath);
  args.push(url);

  const envPath = process.env.PATH + (os.platform() === 'win32' ? `;${FFMPEG_DIR}` : `:${FFMPEG_DIR}`);
  const child = spawn(exeName, args, {
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1', PATH: envPath }
  });
  task.process = child;

  const broadcastLog = (msg) => {
    let cleanMsg = msg.replace(/[a-zA-Z]:\\[^\s"']+/g, (m) => `[SYSTEM_FILE]/${m.split('\\').pop()}`);
    if (cleanMsg.startsWith('http')) return;
    task.logs.push(cleanMsg);
    task.clients.forEach(c => c.write(`data: ${JSON.stringify({ status: 'log', message: cleanMsg })}\n\n`));
  };

  child.stdout.on('data', (d) => d.toString('utf-8').split(/\r?\n/).forEach(l => l.trim() && broadcastLog(l.trim())));
  child.stderr.on('data', (d) => broadcastLog(`[stderr] ${d.toString('utf-8').trim()}`));

  child.on('close', () => {
    const finalizeJob = () => {
      const files = getAllFiles(task.dir);
      if (task.status !== 'error') {
        task.status = files.length > 0 ? 'done' : 'error';
        if (task.status === 'done') broadcastLog(`[SUCCESS] ✅ Process completed!`);
      }
      task.clients.forEach(c => {
        c.write(`data: ${JSON.stringify({ status: task.status })}\n\n`);
        c.end();
      });
      task.clients.clear();
    };

    if (getAllFiles(task.dir).length === 0 && task.status !== 'error') {
      broadcastLog(`[SYSTEM] 🖼️ No video found. Attempting image extraction via gallery-dl...`);
      const gExe = getExe('gallery-dl');
      let gArgs = ['--directory', task.dir];
      if (fs.existsSync(cookiesPath)) gArgs.push('--cookies', cookiesPath);
      gArgs.push(task.url);

      const gChild = spawn(gExe, gArgs, { env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' } });
      gChild.stdout.on('data', d => broadcastLog(`[gallery-dl] 📷 ${d.toString('utf-8').trim().split('\\').pop()}`));
      gChild.on('close', () => finalizeJob());
    } else {
      finalizeJob();
    }
  });

  res.json({ taskId });
});

// ----------------------------------------------------
// COMMON DOWNLAOD ENDPOINTS
// ----------------------------------------------------
app.post('/api/download/cancel', express.json(), (req, res) => {
  const { taskId } = req.body;
  const task = hybridTasks.get(taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (task.process && !task.process.killed) task.process.kill('SIGKILL');
  task.status = 'error';
  task.clients.forEach(c => {
    c.write(`data: ${JSON.stringify({ status: 'log', message: '[ERROR] 🛑 CANCELLED BY USER.' })}\n\n`);
    c.write(`data: ${JSON.stringify({ status: 'error' })}\n\n`);
    c.end();
  });
  task.clients.clear();

  setTimeout(() => {
    try { fs.rmSync(task.dir, { recursive: true, force: true }); } catch (e) {}
    hybridTasks.delete(taskId);
  }, 1000);
  res.json({ success: true });
});

app.get('/api/download/status', (req, res) => {
  const { taskId } = req.query;
  const task = hybridTasks.get(taskId);
  if (!task) return res.status(404).send('Task not found');

  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
  const heartbeat = setInterval(() => res.write(': keepalive\n\n'), 25000);

  task.logs.forEach(msg => res.write(`data: ${JSON.stringify({ status: 'log', message: msg })}\n\n`));
  if (task.status !== 'running') {
    clearInterval(heartbeat);
    res.write(`data: ${JSON.stringify({ status: task.status })}\n\n`);
    return res.end();
  }
  task.clients.add({ write: (d) => res.write(d), end: () => { clearInterval(heartbeat); res.end(); } });
  req.on('close', () => {
    clearInterval(heartbeat);
    task.clients.forEach(c => { if (c.write.toString().includes('res.write(d)')) task.clients.delete(c); });
  });
});

app.get('/api/download/file', (req, res) => {
  const { taskId } = req.query;
  const task = hybridTasks.get(taskId);
  if (!task || task.status !== 'done') return res.status(400).send('Invalid task.');

  try {
    const allFiles = getAllFiles(task.dir);
    if (allFiles.length === 0) {
      fs.rmSync(task.dir, { recursive: true, force: true });
      hybridTasks.delete(taskId);
      return res.status(404).send('No files found.');
    }
    if (allFiles.length === 1) {
      res.download(allFiles[0], allFiles[0].split(/[\\/]/).pop(), () => {
        fs.rmSync(task.dir, { recursive: true, force: true });
        hybridTasks.delete(taskId);
      });
    } else {
      res.attachment(`UniversalDownloader_${taskId}.zip`);
      const archive = new archiver.ZipArchive({ zlib: { level: 0 } });
      res.on('finish', () => {
        fs.rmSync(task.dir, { recursive: true, force: true });
        hybridTasks.delete(taskId);
      });
      archive.pipe(res);
      archive.directory(task.dir, false);
      archive.finalize();
    }
  } catch (err) {
    if (!res.headersSent) res.status(500).send('Archive error');
  }
});

const server = http.createServer(app);
server.listen(PORT, () => console.log(`🚀 UniversalDownloader running at http://localhost:${PORT}`));
