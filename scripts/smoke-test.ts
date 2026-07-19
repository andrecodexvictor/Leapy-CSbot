import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';

const port = 3100 + (process.pid % 500);
const baseUrl = `http://127.0.0.1:${port}`;
const secret = 'smoke-secret-never-log-4f8c2b7a';
const tsxCli = path.resolve('node_modules/tsx/dist/cli.mjs');

const scenarios = [
  { query: 'O que a Leapy entrega para as empresas?', intent: 'empresa_visao_geral', fallback: false },
  { query: 'Como funciona o acompanhamento oferecido pela Leapy?', intent: 'empresa_visao_geral', fallback: false },
  { query: 'Como é calculada a cota obrigatória com base no CBO?', intent: 'cota_aprendizagem', fallback: false },
  { query: 'Qual é a faixa etária permitida para o jovem?', intent: 'elegibilidade_jovem', fallback: false },
  { query: 'Qual é a jornada permitida para o jovem?', intent: 'elegibilidade_jovem', fallback: false },
  { query: 'Como tratar uma dúvida regional sobre CCT na Bahia?', intent: 'operacao_regional', fallback: false },
  { query: 'Como a plataforma apoia o RH sem substituí-lo?', intent: 'plataforma_dados', fallback: false },
  { query: 'Como devo apresentar o indicador de 48% de efetivação?', intent: 'resultado_efetivacao', fallback: false },
  { query: 'Como responder à objeção: não quero mais um sistema?', intent: 'objeção_comercial', fallback: false },
  { query: 'Qual é o preço e o SLA contratual?', intent: 'fora_de_escopo', fallback: true }
] as const;

interface SmokeCase {
  id: number;
  query: string;
  intent: string;
  fallback: boolean;
}

const cases: SmokeCase[] = scenarios.flatMap((scenario, scenarioIndex) =>
  Array.from({ length: 61 }, (_, variationIndex) => ({
    ...scenario,
    id: scenarioIndex * 61 + variationIndex + 1,
    query: `${scenario.query} [variação ${variationIndex + 1}]`
  }))
);

let serverOutput = '';
const server = spawn(process.execPath, [tsxCli, 'server.ts'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PORT: String(port),
    NODE_ENV: 'production',
    GEMINI_API_KEY: secret
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

server.stdout.on('data', chunk => { serverOutput += chunk.toString(); });
server.stderr.on('data', chunk => { serverOutput += chunk.toString(); });

async function waitForServer() {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Servidor encerrou antes do smoke test.\n${serverOutput}`);
    }
    try {
      const response = await fetch(`${baseUrl}/api/graph`);
      if (response.ok) return;
    } catch {
      // Startup still in progress.
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Timeout ao iniciar servidor em ${baseUrl}.\n${serverOutput}`);
}

async function runCase(testCase: SmokeCase) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: testCase.query, provider: 'simulation' })
  });

  assert.equal(response.status, 200, `caso ${testCase.id}: status HTTP`);
  const body = await response.json() as {
    blocks?: {
      classificacaoIntencao?: string;
      fontes?: unknown;
    };
    isFallback?: boolean;
  };

  assert.equal(
    body.blocks?.classificacaoIntencao,
    testCase.intent,
    `caso ${testCase.id}: intenção`
  );
  assert.equal(body.isFallback, testCase.fallback, `caso ${testCase.id}: fallback`);
  assert.ok(Array.isArray(body.blocks?.fontes), `caso ${testCase.id}: fontes deve ser array`);
  assert.ok(
    body.blocks!.fontes!.length >= 1 && body.blocks!.fontes!.length <= 3,
    `caso ${testCase.id}: deve retornar de 1 a 3 fontes`
  );
  for (const source of body.blocks!.fontes as unknown[]) {
    assert.equal(typeof source, 'string', `caso ${testCase.id}: fonte deve ser string`);
    assert.match(
      source as string,
      /^DOC-(?:SYN-)?\d{3}(?: §\d+(?:\.\d+)*)?$/,
      `caso ${testCase.id}: formato exato da fonte`
    );
  }
}

try {
  assert.equal(cases.length, 610, 'a suíte deve conter exatamente 610 perguntas');
  await waitForServer();

  const batchSize = 20;
  for (let index = 0; index < cases.length; index += batchSize) {
    await Promise.all(cases.slice(index, index + batchSize).map(runCase));
  }

  assert.ok(!serverOutput.includes(secret), 'a chave completa não pode aparecer nos logs');
  assert.ok(!serverOutput.includes(secret.slice(0, 12)), 'nem o prefixo da chave pode aparecer nos logs');
  console.log(`Smoke test aprovado: ${cases.length} perguntas, com intenção, fallback e fontes validados.`);
} finally {
  server.kill('SIGTERM');
}
