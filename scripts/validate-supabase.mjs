#!/usr/bin/env node
/**
 * Script de Validação Pós-Deploy Supabase
 * 
 * Este script valida a integridade dos dados após o deploy no Supabase,
 * verificando tabelas, relacionamentos e dados críticos.
 */

import { config } from 'dotenv';

config();

console.log('🔍 Iniciando validação pós-deploy Supabase...\n');

// Validar variáveis de ambiente
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada');
  process.exit(1);
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
  console.error('❌ DATABASE_URL não é uma connection string PostgreSQL');
  process.exit(1);
}

async function runValidations() {
  const { default: postgres } = await import('postgres');
  const sql = postgres(dbUrl, {
    max: 1,
    connection: {
      application_name: 'festeja-kids-validation'
    }
  });

  try {
    console.log('📊 Validando estrutura do banco de dados...\n');

    // 1. Verificar existência de tabelas críticas
    console.log('1️⃣  Verificando tabelas críticas...');
    const expectedTables = [
      'users',
      'clientes',
      'festas',
      'pagamentos',
      'custosVariaveis',
      'custosFixos',
      'visitas'
    ];

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const tableNames = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(t => !tableNames.includes(t));

    if (missingTables.length > 0) {
      console.error('   ❌ Tabelas ausentes:', missingTables.join(', '));
    } else {
      console.log('   ✅ Todas as tabelas críticas existem');
    }

    // 2. Contar registros em cada tabela
    console.log('\n2️⃣  Contando registros...');
    for (const table of expectedTables) {
      if (tableNames.includes(table)) {
        const count = await sql`
          SELECT COUNT(*) as count 
          FROM ${sql(table)}
        `;
        console.log(`   - ${table}: ${count[0].count} registros`);
      }
    }

    // 3. Verificar índices e constraints
    console.log('\n3️⃣  Verificando índices e constraints...');
    const indexes = await sql`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;
    console.log(`   ✅ Total de índices: ${indexes.length}`);

    const constraints = await sql`
      SELECT
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_type;
    `;
    console.log(`   ✅ Total de constraints: ${constraints.length}`);

    // 4. Validar relacionamentos (foreign keys)
    console.log('\n4️⃣  Validando relacionamentos...');
    const foreignKeys = await sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public';
    `;

    if (foreignKeys.length > 0) {
      console.log('   ✅ Foreign keys detectadas:');
      foreignKeys.forEach(fk => {
        console.log(`      ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('   ⚠️  Nenhuma foreign key detectada');
    }

    // 5. Validar dados de festas (se houver)
    console.log('\n5️⃣  Validando integridade dos dados de festas...');
    const festasCount = await sql`SELECT COUNT(*) as count FROM festas`;
    
    if (festasCount[0].count > 0) {
      // Verificar se todas as festas têm clientes válidos
      const orphanFestas = await sql`
        SELECT COUNT(*) as count 
        FROM festas f
        LEFT JOIN clientes c ON f.clienteId = c.id
        WHERE c.id IS NULL
      `;

      if (orphanFestas[0].count > 0) {
        console.error(`   ❌ ${orphanFestas[0].count} festas sem cliente associado`);
      } else {
        console.log('   ✅ Todas as festas têm clientes válidos');
      }

      // Verificar status das festas
      const statusCount = await sql`
        SELECT status, COUNT(*) as count
        FROM festas
        GROUP BY status
        ORDER BY status
      `;

      console.log('   📊 Festas por status:');
      statusCount.forEach(s => {
        console.log(`      - ${s.status}: ${s.count}`);
      });
    } else {
      console.log('   ℹ️  Nenhuma festa cadastrada ainda');
    }

    // 6. Validar dados financeiros
    console.log('\n6️⃣  Validando dados financeiros...');
    const pagamentosCount = await sql`SELECT COUNT(*) as count FROM pagamentos`;
    
    if (pagamentosCount[0].count > 0) {
      const totalPagamentos = await sql`
        SELECT 
          COUNT(*) as total_pagamentos,
          SUM(valor) as soma_total
        FROM pagamentos
      `;

      console.log(`   ✅ Total de pagamentos: ${totalPagamentos[0].total_pagamentos}`);
      console.log(`   💰 Valor total: R$ ${(totalPagamentos[0].soma_total / 100).toFixed(2)}`);

      // Verificar se todos os pagamentos têm festas válidas
      const orphanPagamentos = await sql`
        SELECT COUNT(*) as count 
        FROM pagamentos p
        LEFT JOIN festas f ON p.festaId = f.id
        WHERE f.id IS NULL
      `;

      if (orphanPagamentos[0].count > 0) {
        console.error(`   ❌ ${orphanPagamentos[0].count} pagamentos sem festa associada`);
      } else {
        console.log('   ✅ Todos os pagamentos têm festas válidas');
      }
    } else {
      console.log('   ℹ️  Nenhum pagamento registrado ainda');
    }

    // 7. Resumo final
    console.log('\n' + '='.repeat(60));
    console.log('📝 RESUMO DA VALIDAÇÃO');
    console.log('='.repeat(60));

    const summary = {
      tabelas: tableNames.length,
      indices: indexes.length,
      constraints: constraints.length,
      usuarios: (await sql`SELECT COUNT(*) as count FROM users`)[0].count,
      clientes: (await sql`SELECT COUNT(*) as count FROM clientes`)[0].count,
      festas: festasCount[0].count,
      pagamentos: pagamentosCount[0].count,
    };

    console.log(`Tabelas:         ${summary.tabelas}`);
    console.log(`Índices:         ${summary.indices}`);
    console.log(`Constraints:     ${summary.constraints}`);
    console.log(`Usuários:        ${summary.usuarios}`);
    console.log(`Clientes:        ${summary.clientes}`);
    console.log(`Festas:          ${summary.festas}`);
    console.log(`Pagamentos:      ${summary.pagamentos}`);
    console.log('='.repeat(60));

    if (missingTables.length === 0) {
      console.log('\n✅ Validação concluída com sucesso!');
      console.log('\n📝 Próximos passos:');
      console.log('   1. Verifique os logs acima para inconsistências');
      console.log('   2. Importe dados se necessário');
      console.log('   3. Execute testes funcionais da aplicação');
      console.log('   4. Valide os fluxos críticos (cadastros, pagamentos)\n');
    } else {
      console.log('\n⚠️  Validação concluída com avisos.');
      console.log('   Revise as tabelas ausentes e execute as migrações necessárias.\n');
    }

  } catch (error) {
    console.error('\n❌ Erro durante validação:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runValidations().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
