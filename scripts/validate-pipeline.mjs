import { spawnSync } from 'node:child_process';

const npmCommand = 'npm';

const steps = [
  {
    id: 'lint:gate',
    title: 'Qualidade do código',
    command: npmCommand,
    args: ['run', 'lint:gate'],
    failureType: 'qualidade',
  },
  {
    id: 'validate:design',
    title: 'Design system e contraste',
    command: npmCommand,
    args: ['run', 'validate:design'],
    failureType: 'qualidade',
  },
  {
    id: 'test',
    title: 'Testes unitários',
    command: npmCommand,
    args: ['run', 'test'],
    failureType: 'qualidade',
  },
  {
    id: 'test:a11y',
    title: 'Acessibilidade automatizada',
    command: npmCommand,
    args: ['run', 'test:a11y'],
    failureType: 'a11y',
  },
  {
    id: 'build',
    title: 'Build da aplicação',
    command: npmCommand,
    args: ['run', 'build'],
    failureType: 'infra',
  },
];

const infrastructurePatterns = [
  /Cannot find module/i,
  /Cannot find package/i,
  /must be a file URL object/i,
  /Failed to parse source/i,
  /Unexpected token/i,
  /ENOENT/i,
  /EACCES/i,
  /ERR_MODULE_NOT_FOUND/i,
  /plugin-vue/i,
  /parser/i,
  /filename/i,
];

const a11yPatterns = [
  /toHaveNoViolations/i,
  /axe/i,
  /aria-/i,
  /must have labels/i,
  /keyboard/i,
  /focus/i,
  /contrast/i,
  /color contrast/i,
  /accessible name/i,
];

function classifyFailure(output, fallback) {
  if (a11yPatterns.some((pattern) => pattern.test(output))) {
    return 'a11y';
  }

  if (infrastructurePatterns.some((pattern) => pattern.test(output))) {
    return 'infra';
  }

  return fallback;
}

function labelFor(type) {
  if (type === 'infra') return 'Falha de infraestrutura/setup';
  if (type === 'a11y') return 'Falha de acessibilidade';
  return 'Falha de qualidade/implementação';
}

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

function getInvocation(step) {
  if (process.platform === 'win32') {
    return {
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', [step.command, ...step.args].join(' ')],
    };
  }

  return {
    command: step.command,
    args: step.args,
  };
}

for (const step of steps) {
  printSection(step.title);

  const invocation = getInvocation(step);

  const result = spawnSync(invocation.command, invocation.args, {
    cwd: process.cwd(),
    encoding: 'utf-8',
  });

  const stdout = result.stdout?.trim() ?? '';
  const stderr = result.stderr?.trim() ?? '';
  const combinedOutput = [stdout, stderr].filter(Boolean).join('\n');

  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    console.error(stderr);
  }

  if (result.status !== 0) {
    const failureType = classifyFailure(combinedOutput, step.failureType);

    console.error(`\n${labelFor(failureType)} em ${step.id}.`);

    if (failureType === 'infra') {
      console.error('Ajuste configuração, dependências, parser, assets ou ambiente antes de continuar.');
    } else if (failureType === 'a11y') {
      console.error('Corrija o problema real de acessibilidade encontrado na interface antes de seguir.');
    } else {
      console.error('Corrija o problema de código, design system ou regra funcional antes de seguir.');
    }

    process.exit(result.status ?? 1);
  }
}

console.log('\nValidate concluído com sucesso. Gate útil: qualidade, a11y e build aprovados.');