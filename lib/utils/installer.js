#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Detecta el tipo de proyecto por múltiples métodos
 */
function detectProjectType() {
  const cwd = process.cwd();

  // 1. Buscar .cw-rdd.json
  const cwConfigPath = path.join(cwd, '.cw-rdd.json');
  if (fs.existsSync(cwConfigPath)) {
    try {
      const config = require(cwConfigPath);
      if (config.projectType) {
        console.log(chalk.cyan('📄 Tipo detectado desde .cw-rdd.json'));
        return config.projectType;
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Error leyendo .cw-rdd.json'));
    }
  }

  // 2. Buscar en package.json
  const packageJsonPath = path.join(cwd, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = require(packageJsonPath);

      // Campo personalizado "cw-rdd"
      if (packageJson['cw-rdd']?.projectType) {
        console.log(chalk.cyan('📦 Tipo detectado desde package.json'));
        return packageJson['cw-rdd'].projectType;
      }

      // 3. Detectar por dependencias
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      // Flutter (raro en package.json, pero por si acaso)
      if (deps['flutter'] || fs.existsSync(path.join(cwd, 'pubspec.yaml'))) {
        console.log(chalk.cyan('🔍 Tipo detectado: flutter (pubspec.yaml)'));
        return 'flutter';
      }

      // Backend - frameworks
      const backendFrameworks = [
        'express', 'fastify', '@nestjs/core', 'koa',
        '@hapi/hapi', 'restify', 'micro'
      ];
      if (backendFrameworks.some(framework => deps[framework])) {
        console.log(chalk.cyan('🔍 Tipo detectado: backend'));
        return 'backend';
      }

      // Backend - ORMs
      const backendDatabases = [
        'typeorm', 'sequelize', 'prisma', 'mongoose',
        'knex', 'pg', 'mysql2'
      ];
      if (backendDatabases.some(db => deps[db])) {
        console.log(chalk.cyan('🔍 Tipo detectado: backend (database)'));
        return 'backend';
      }

      // Frontend - frameworks
      const frontendFrameworks = [
        'react', 'react-dom', 'vue', '@vue/cli',
        '@angular/core', 'next', 'nuxt', 'gatsby',
        'svelte', '@sveltejs/kit'
      ];
      if (frontendFrameworks.some(framework => deps[framework])) {
        console.log(chalk.cyan('🔍 Tipo detectado: frontend'));
        return 'frontend';
      }

      // Frontend - build tools
      const frontendTools = ['vite', 'webpack', 'parcel'];
      if (frontendTools.some(tool => deps[tool])) {
        if (!backendFrameworks.some(framework => deps[framework])) {
          console.log(chalk.cyan('🔍 Tipo detectado: frontend (build tool)'));
          return 'frontend';
        }
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Error leyendo package.json'));
    }
  }

  // 4. Detectar por estructura de carpetas
  const frontendFolders = ['src/components', 'src/pages', 'public'];
  if (frontendFolders.some(folder => fs.existsSync(path.join(cwd, folder)))) {
    console.log(chalk.cyan('🔍 Tipo detectado: frontend (estructura)'));
    return 'frontend';
  }

  const backendFolders = ['src/controllers', 'src/routes', 'src/models'];
  if (backendFolders.some(folder => fs.existsSync(path.join(cwd, folder)))) {
    console.log(chalk.cyan('🔍 Tipo detectado: backend (estructura)'));
    return 'backend';
  }

  const flutterFolders = ['lib', 'android', 'ios'];
  const hasFlutterStructure = flutterFolders.every(
    folder => fs.existsSync(path.join(cwd, folder))
  );
  if (hasFlutterStructure) {
    console.log(chalk.cyan('🔍 Tipo detectado: flutter (estructura)'));
    return 'flutter';
  }

  return null;
}

/**
 * Guarda configuración de CW-RDD
 */
async function saveCwRddConfig(projectRoot, projectType) {
  const configPath = path.join(projectRoot, '.cw-rdd.json');
  const config = {
    projectType,
    version: '1.0.0',
    installedAt: new Date().toISOString(),
    rules: {
      [projectType]: true,
      shared: true
    }
  };

  await fs.writeJson(configPath, config, { spaces: 2 });
  // El mensaje se maneja en installRules para mantener el orden correcto
}

/**
 * Instala las reglas en el proyecto
 */
async function installRules(options = {}) {
  try {
    console.log(chalk.blue('\n🚀 CW Method RDD \n'));
    console.log(chalk.blue('- Instalando reglas...\n'));
    console.log(chalk.blue('- Instalando agentes...\n'));

    const projectRoot = process.cwd();
    let projectType = options.type || detectProjectType();

    if (!projectType) {
      console.log(chalk.yellow('⚠️  No se pudo detectar el tipo de proyecto.\n'));
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'projectType',
          message: '¿Qué tipo de proyecto es?',
          choices: [
            { name: '🎨 Frontend (React, Vue, Angular)', value: 'frontend' },
            { name: '⚙️  Backend (Node.js, Express, NestJS)', value: 'backend' },
            { name: '📱 Flutter (Dart)', value: 'flutter' }
          ]
        }
      ]);
      projectType = answers.projectType;
    }

    console.log(chalk.cyan(`\n📦 Tipo de proyecto: ${chalk.bold(projectType)}\n`));

    // Crear directorio .cursor/rules
    const cursorRulesDir = path.join(projectRoot, '.cursor', 'rules');
    await fs.ensureDir(cursorRulesDir);

    // Ruta de las reglas en node_modules o directorio actual
    let rulesSource = path.join(__dirname, '../../rules');

    // Si no existe (desarrollo local), buscar en el directorio actual
    if (!fs.existsSync(rulesSource)) {
      rulesSource = path.join(projectRoot, 'rules');
    }

    if (!fs.existsSync(rulesSource)) {
      throw new Error('No se encontraron las reglas. Verifica la instalación del paquete.');
    }

    let installedCount = 0;

    // Instalar todas las reglas automáticamente (sin preguntar)
    const rulesToInstall = [projectType, 'shared'];

    // Acumular mensajes para mostrar después
    const installationMessages = [];
    let frontRulesCount = 0;

    // Copiar reglas del frente específico
    if (rulesToInstall.includes(projectType)) {
      const frontRulesPath = path.join(rulesSource, projectType);
      if (fs.existsSync(frontRulesPath)) {
        const files = await fs.readdir(frontRulesPath);
        for (const file of files) {
          if (file.endsWith('.mdc')) {
            await fs.copy(
              path.join(frontRulesPath, file),
              path.join(cursorRulesDir, file)
            );
            installedCount++;
            frontRulesCount++;
          }
        }
        installationMessages.push(chalk.green(`✅ ${frontRulesCount} reglas de ${projectType} instaladas`));
      } else {
        installationMessages.push(chalk.yellow(`⚠️  No se encontraron reglas para ${projectType}`));
      }
    }

    // Copiar reglas generales
    if (rulesToInstall.includes('shared')) {
      const sharedRulesPath = path.join(rulesSource, 'shared');
      if (fs.existsSync(sharedRulesPath)) {
        const sharedFiles = await fs.readdir(sharedRulesPath);
        let sharedCount = 0;
        for (const file of sharedFiles) {
          if (file.endsWith('.mdc')) {
            await fs.copy(
              path.join(sharedRulesPath, file),
              path.join(cursorRulesDir, file)
            );
            installedCount++;
            sharedCount++;
          }
        }
        installationMessages.push(chalk.green(`✅ ${sharedCount} reglas generales instaladas`));
      }
    }

    // Instalar comandos/agentes en .cursor/commands/
    const cursorCommandsDir = path.join(projectRoot, '.cursor', 'commands');
    await fs.ensureDir(cursorCommandsDir);

    // Ruta de los comandos en node_modules o directorio actual
    let commandsSource = path.join(__dirname, '../../commands');

    // Si no existe (desarrollo local), buscar en el directorio actual
    if (!fs.existsSync(commandsSource)) {
      commandsSource = path.join(projectRoot, 'commands');
    }

    let commandsCount = 0;
    if (fs.existsSync(commandsSource)) {
      const commandFiles = await fs.readdir(commandsSource);
      for (const file of commandFiles) {
        if (file.endsWith('.md')) {
          await fs.copy(
            path.join(commandsSource, file),
            path.join(cursorCommandsDir, file)
          );
          commandsCount++;
        }
      }
      if (commandsCount > 0) {
        installationMessages.push(chalk.green(`✅ ${commandsCount} agentes instalados`));
      }
    }

    // Crear hooks.json si no existe
    const hooksPath = path.join(projectRoot, '.cursor', 'hooks.json');
    if (!fs.existsSync(hooksPath)) {
      try {
        let hooksSourceBase = path.join(__dirname, '../../hooks');
        // Si no existe (desarrollo local), buscar en el directorio actual
        if (!fs.existsSync(hooksSourceBase)) {
          hooksSourceBase = path.join(projectRoot, 'hooks');
        }

        const projectHooksPath = path.join(hooksSourceBase, projectType, 'hooks.json');

        let hooksContent;
        if (fs.existsSync(projectHooksPath)) {
          hooksContent = await fs.readJson(projectHooksPath);
          installationMessages.push(chalk.green(`✅ Hooks específicos para ${projectType} detectados`));
        } else {
          // Fallback por si no existe la carpeta/archivo
          hooksContent = {
            "pre-commit": [
              "Verifica que el código cumple con las reglas en .cursor/rules/",
              "Ejecuta linters y formatters configurados",
              "Valida que no hay console.log en código de producción"
            ]
          };
          installationMessages.push(chalk.yellow(`⚠️  No se encontraron hooks para ${projectType}, usando default`));
        }

        await fs.writeJson(hooksPath, hooksContent, { spaces: 2 });
        installationMessages.push(chalk.green('✅ hooks.json creado'));

      } catch (error) {
        console.log(chalk.yellow('⚠️  Error al copiar hooks:', error.message));
      }
    }

    // Guardar configuración (siempre guarda sin preguntar)
    if (!options.skipConfig) {
      await saveCwRddConfig(projectRoot, projectType);
      installationMessages.push(chalk.green('✅ Configuración guardada en .cw-rdd.json'));
    }

    // Mostrar mensaje de éxito primero
    console.log(chalk.green('\n✅ Instalación completada exitosamente\n'));

    // Mostrar todos los detalles de instalación con formato mejorado
    installationMessages.forEach(msg => console.log(msg));

    // Mostrar ubicaciones de instalación
    console.log(chalk.cyan('\n📋 Reglas instaladas en: .cursor/rules/'));
    if (commandsCount > 0) {
      console.log(chalk.cyan('🤖 Agentes instalados en: .cursor/commands/'));
    }

    // Mostrar mensaje final
    console.log(chalk.gray('\nLos agentes de IA (Cursor) las leerán automáticamente.\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Error durante la instalación:'), error.message);
    if (error.stack) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

module.exports = { installRules, detectProjectType, saveCwRddConfig };
