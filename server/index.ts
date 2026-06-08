import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createApp } from './app';

const PORT = Number(process.env.PORT) || 3000;
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const app = createApp();
app.use(express.static(distDir));
app.get('/{*splat}', (_request, response) => {
  response.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`theme-planner server listening on port ${PORT}`);
});
