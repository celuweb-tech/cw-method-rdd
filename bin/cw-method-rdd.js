#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { installRules } = require('../lib/utils/installer');
const packageJson = require('../package.json');

program
  .name('cw-method-rdd')
  .description('CW Method RDD - Rules Driven Development CLI')
  .version(packageJson.version);

// Comando: install
program
  .command('install')
  .description('Instala las reglas en el proyecto actual')
  .option('-t, --type <type>', 'Tipo de proyecto (frontend|backend|flutter)')
  .option('-s, --silent', 'Modo silencioso, usa configuración por defecto')
  .option('--skip-config', 'No guardar archivo de configuración')
  .action(async (options) => {
    try {
      await installRules(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Comando: list
program
  .command('list')
  .description('Lista las reglas disponibles')
  .action(() => {
    console.log(chalk.blue('\n📋 Reglas disponibles:\n'));
    
    console.log(chalk.cyan('Frontend:'));
    console.log('  - architecture.mdc');
    console.log('  - cleancode.mdc');
    console.log('  - states-management.mdc');
    console.log('  - colors.mdc');
    console.log('  - icons.mdc');
    console.log('  - test.mdc');
    
    console.log(chalk.cyan('\nBackend:'));
    console.log('  - architecture.mdc');
    console.log('  - error-handling.mdc');
    console.log('  - api-design.mdc');
    console.log('  - security.mdc');
    console.log('  - database.mdc');
    
    console.log(chalk.cyan('\nFlutter:'));
    console.log('  - architecture.mdc');
    console.log('  - state-management.mdc');
    console.log('  - widget-conventions.mdc');
    console.log('  - navigation.mdc');
    
    console.log(chalk.cyan('\nCompartidas:'));
    console.log('  - git-conventions.mdc');
    console.log('  - naming-conventions.mdc');
    console.log('  - code-review.mdc\n');
  });

// Comando: validate
program
  .command('validate')
  .description('Valida las reglas y comandos instalados')
  .action(() => {
    const fs = require('fs');
    const path = require('path');
    
    const rulesDir = path.join(process.cwd(), '.cursor', 'rules');
    const commandsDir = path.join(process.cwd(), '.cursor', 'commands');
    
    let hasRules = false;
    let hasCommands = false;
    
    // Validar reglas
    if (fs.existsSync(rulesDir)) {
      const files = fs.readdirSync(rulesDir);
      const mdcFiles = files.filter(f => f.endsWith('.mdc'));
      
      if (mdcFiles.length > 0) {
        hasRules = true;
        console.log(chalk.green(`\n✅ ${mdcFiles.length} reglas instaladas:\n`));
        mdcFiles.forEach(file => {
          console.log(chalk.gray(`  - ${file}`));
        });
      }
    }
    
    // Validar comandos/agentes
    if (fs.existsSync(commandsDir)) {
      const files = fs.readdirSync(commandsDir);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      if (mdFiles.length > 0) {
        hasCommands = true;
        console.log(chalk.green(`\n✅ ${mdFiles.length} agentes instalados:\n`));
        mdFiles.forEach(file => {
          console.log(chalk.gray(`  - ${file}`));
        });
      }
    }
    
    if (!hasRules && !hasCommands) {
      console.log(chalk.red('\n❌ No se encontraron reglas ni comandos instalados.'));
      console.log(chalk.gray('Ejecuta: npx cw-method-rdd install\n'));
      return;
    }
    
    console.log('');
  });

program.parse();
