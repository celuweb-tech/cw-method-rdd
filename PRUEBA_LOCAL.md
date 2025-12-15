# Guía para Probar cw-method-rdd Localmente

Esta guía te ayudará a probar el paquete `cw-method-rdd` localmente antes de publicarlo en npm.

---

## Opción 1: Usar `npm link` (Recomendado)

Esta es la forma más común y recomendada para desarrollo local.

### Paso 1: Crear el link en el proyecto cw-method-rdd

```bash
# Navegar al directorio del proyecto
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd

# Crear el link global
npm link
```

Esto creará un enlace simbólico global que apunta a tu proyecto local.

### Paso 2: Usar el link en un proyecto de prueba

```bash
# Navegar a un proyecto donde quieras probar el paquete
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/app-cw-b2b

# Vincular el paquete local
npm link cw-method-rdd
```

### Paso 3: Probar el comando

```bash
# Ahora puedes usar el comando como si estuviera instalado desde npm
npx cw-method-rdd install
npx cw-method-rdd list
npx cw-method-rdd validate
```

### Paso 4: Desvincular cuando termines

```bash
# En el proyecto de prueba
npm unlink cw-method-rdd

# En el proyecto cw-method-rdd (opcional, solo si quieres eliminar el link global)
npm unlink -g cw-method-rdd
```

---

## Opción 2: Instalación Directa desde Ruta Local

Puedes instalar el paquete directamente desde la ruta del sistema de archivos.

### Paso 1: Instalar desde ruta local

```bash
# En el proyecto donde quieres probar
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/app-cw-b2b

# Instalar desde ruta local
npm install /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd
```

O usando ruta relativa:

```bash
# Si estás en un proyecto hermano
npm install ../cw-method-rdd
```

### Paso 2: Probar el comando

```bash
npx cw-method-rdd install
npx cw-method-rdd list
```

### Paso 3: Desinstalar cuando termines

```bash
npm uninstall cw-method-rdd
```

---

## Opción 3: Usar `npx` con Ruta Directa

Puedes ejecutar el comando directamente sin instalar.

### Ejecutar directamente

```bash
# Desde cualquier proyecto
npx /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd install

# O usando ruta relativa
npx ../cw-method-rdd install
```

**Nota:** Esta opción requiere que el proyecto tenga el ejecutable configurado correctamente.

---

## Opción 4: Usar `npm pack` y Instalar el Tarball

Esta opción simula mejor cómo funcionará cuando se publique en npm.

### Paso 1: Crear el tarball

```bash
# En el proyecto cw-method-rdd
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd

# Crear el paquete
npm pack
```

Esto creará un archivo `cw-method-rdd-1.0.0.tgz` en el directorio.

### Paso 2: Instalar el tarball

```bash
# En el proyecto donde quieres probar
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/app-cw-b2b

# Instalar desde el tarball
npm install /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd/cw-method-rdd-1.0.0.tgz
```

### Paso 3: Probar

```bash
npx cw-method-rdd install
```

### Paso 4: Limpiar

```bash
# Desinstalar
npm uninstall cw-method-rdd

# Eliminar el tarball (opcional)
rm /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd/cw-method-rdd-1.0.0.tgz
```

---

## Verificar que el Binario Funciona

Antes de probar en otro proyecto, verifica que el ejecutable funciona:

```bash
# En el proyecto cw-method-rdd
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd

# Ejecutar directamente
node bin/cw-method-rdd.js --help

# O con npm
npm run --silent cw-method-rdd --help
```

---

## Solución de Problemas

### Error: "command not found: cw-method-rdd"

**Causa:** El binario no está configurado correctamente o no tiene permisos de ejecución.

**Solución:**
```bash
# Dar permisos de ejecución al binario
chmod +x bin/cw-method-rdd.js

# Verificar que el shebang está correcto en la primera línea del archivo
head -1 bin/cw-method-rdd.js
# Debe mostrar: #!/usr/bin/env node
```

### Error: "Cannot find module"

**Causa:** Las dependencias no están instaladas.

**Solución:**
```bash
# En el proyecto cw-method-rdd
npm install
```

### El link no funciona

**Causa:** Puede haber conflictos con versiones instaladas.

**Solución:**
```bash
# Desvincular completamente
npm unlink -g cw-method-rdd
npm unlink cw-method-rdd

# Volver a crear el link
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd
npm link

# Volver a vincular en el proyecto de prueba
cd /ruta/al/proyecto/prueba
npm link cw-method-rdd
```

---

## Flujo de Trabajo Recomendado

Para desarrollo activo, usa `npm link`:

1. **En cw-method-rdd:**
   ```bash
   npm link
   ```

2. **En proyecto de prueba:**
   ```bash
   npm link cw-method-rdd
   ```

3. **Desarrollar y probar:**
   - Haz cambios en cw-method-rdd
   - Prueba inmediatamente en el proyecto de prueba
   - Los cambios se reflejan automáticamente

4. **Cuando termines:**
   ```bash
   npm unlink cw-method-rdd
   ```

---

## Ejemplo Completo de Prueba

```bash
# 1. Preparar el proyecto cw-method-rdd
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd
npm install
npm link

# 2. Probar en un proyecto Flutter
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/app-cw-b2b
npm link cw-method-rdd

# 3. Ejecutar comandos
npx cw-method-rdd install --type=flutter
npx cw-method-rdd list
npx cw-method-rdd validate

# 4. Verificar que se instalaron las reglas
ls -la .cursor/rules/

# 5. Limpiar cuando termines
npm unlink cw-method-rdd
cd /Users/cw-dev-jsqo/Documents/CELUWEB/projects/cw-method-rdd
npm unlink -g cw-method-rdd
```

---

## Notas Importantes

- **npm link** es la mejor opción para desarrollo activo porque los cambios se reflejan inmediatamente
- **npm pack** es mejor para probar cómo funcionará cuando se publique
- Siempre verifica que el binario tenga permisos de ejecución (`chmod +x`)
- Asegúrate de que el shebang `#!/usr/bin/env node` esté en la primera línea del binario
- Los cambios en el código se reflejan automáticamente con `npm link`, pero puede requerir reiniciar el proceso si hay cambios en dependencias

---

## Próximos Pasos

Una vez que hayas probado localmente y todo funcione correctamente:

1. Incrementar la versión en `package.json`
2. Crear un tag de git
3. Publicar en npm:
   ```bash
   npm publish
   ```

