#!/usr/bin/env node
/**
 * Script de Deploy para Supabase
 * 
 * Este script auxilia no processo de deploy do Festeja Kids para o Supabase,
 * validando a conexão e aplicando as migrações necessárias.
 */

import { config } from 'dotenv';
import { execSync } from 'child_process';

// Carregar variáveis de ambiente
config();

console.log('🚀 Iniciando processo de deploy para Supabase...\n');

// Verificar variáveis de ambiente obrigatórias
const requiredEnvVars = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_PROJECT_ID',
];

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
];

console.log('📋 Validando variáveis de ambiente...');
let hasErrors = false;

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Variável obrigatória ausente: ${varName}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName} configurada`);
  }
});

optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`⚠️  Variável opcional ausente: ${varName}`);
  } else {
    console.log(`✅ ${varName} configurada`);
  }
});

if (hasErrors) {
  console.error('\n❌ Erro: Variáveis de ambiente obrigatórias ausentes.');
  console.error('Por favor, configure as variáveis no arquivo .env antes de continuar.\n');
  process.exit(1);
}

// Validar formato da DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
  console.error('\n❌ Erro: DATABASE_URL deve ser uma connection string PostgreSQL.');
  console.error('Exemplo: postgresql://postgres:[password]@[host]:5432/postgres\n');
  process.exit(1);
}

console.log('\n✅ Variáveis de ambiente validadas com sucesso!\n');

// Testar conexão com o banco
console.log('🔌 Testando conexão com o Supabase...');
try {
  // Importar dinamicamente para testar conexão
  const { default: postgres } = await import('postgres');
  const sql = postgres(dbUrl, {
    max: 1,
    connection: {
      application_name: 'festeja-kids-deploy'
    }
  });

  const result = await sql`SELECT version()`;
  console.log('✅ Conexão estabelecida com sucesso!');
  console.log(`   PostgreSQL version: ${result[0].version.split(' ')[1]}\n`);
  
  await sql.end();
} catch (error) {
  console.error('❌ Erro ao conectar ao Supabase:', error.message);
  console.error('\nVerifique:');
  console.error('  - Se a connection string está correta');
  console.error('  - Se o projeto Supabase está ativo');
  console.error('  - Se as credenciais estão corretas');
  console.error('  - Se o IP está na allowlist (se aplicável)\n');
  process.exit(1);
}

// Executar migrações
console.log('📦 Aplicando migrações do banco de dados...');
try {
  console.log('   Gerando migrações...');
  execSync('pnpm drizzle-kit generate', { stdio: 'inherit' });
  
  console.log('\n   Aplicando migrações...');
  execSync('pnpm drizzle-kit migrate', { stdio: 'inherit' });
  
  console.log('\n✅ Migrações aplicadas com sucesso!\n');
} catch (error) {
  console.error('❌ Erro ao aplicar migrações:', error.message);
  console.error('\nTente executar manualmente:');
  console.error('  pnpm db:push\n');
  process.exit(1);
}

// Validações finais
console.log('🔍 Executando validações finais...');
try {
  const { default: postgres } = await import('postgres');
  const sql = postgres(dbUrl, { max: 1 });

  // Verificar se as tabelas foram criadas
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;

  console.log('\n📊 Tabelas criadas no banco:');
  tables.forEach(table => {
    console.log(`   - ${table.table_name}`);
  });

  await sql.end();

  console.log('\n✅ Deploy concluído com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Execute o servidor: pnpm dev');
  console.log('   2. Teste a aplicação localmente');
  console.log('   3. Importe dados se necessário: node scripts/import-complete.mjs');
  console.log('   4. Valide os dados importados');
  console.log('   5. Configure o ambiente de produção\n');

} catch (error) {
  console.error('❌ Erro nas validações finais:', error.message);
  process.exit(1);
}
