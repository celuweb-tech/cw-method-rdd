# CW Method RDD (Rules Driven Development)

Sistema de especificaciones y reglas de desarrollo con soporte para agentes IA (Cursor)

## 🚀 Instalación

### Instalación desde npm

Una vez publicado en npm, puedes instalarlo de dos formas:

**Opción 1: Instalación local en el proyecto (recomendado)**
```bash
npm install cw-method-rdd --save-dev
```

**Opción 2: Instalación global**
```bash
npm install -g cw-method-rdd
```

## 📖 Uso

### Instalación de Reglas

Después de instalar el paquete desde npm, puedes instalar las reglas en tu proyecto:

```bash
# Instalación interactiva (detecta automáticamente el tipo de proyecto)
npx cw-method-rdd install

# Instalación con tipo específico (sin prompts)
npx cw-method-rdd install --type=frontend
npx cw-method-rdd install --type=backend
npx cw-method-rdd install --type=flutter

# Modo silencioso (usa configuración por defecto)
npx cw-method-rdd install --silent

# Sin guardar archivo de configuración
npx cw-method-rdd install --skip-config
```

**Salida esperada:**
```
✅ 22 reglas de flutter instaladas
✅ 3 reglas generales instaladas
✅ 3 agentes instalados
✅ hooks.json creado
✅ Configuración guardada en .cw-rdd.json
```


## 📂 Estructura Resultante

Después de la instalación:

```
tu-proyecto/
├── .cursor/
│   ├── rules/
│   │   ├── architecture.mdc
│   │   ├── cleancode.mdc
│   │   ├── colors.mdc
│   │   ├── documentation.mdc
│   │   ├── icons.mdc
│   │   ├── internationalization.mdc
│   │   ├── solid.mdc
│   │   ├── states-management.mdc
│   │   └── test.mdc
│   ├── commands/
│   │   ├── developer.md
│   │   ├── prompt-engineer.md
│   │   └── scrum.md
│   └── hooks.json
└── .cw-rdd.json
```

## 🎯 Tipos de Proyecto Soportados

- **frontend**: React, Vue, Angular, Next.js, Nuxt
- **backend**: Node.js, Express, NestJS, Fastify
- **móvil**: Aplicaciones móviles con Flutter/Dart


## 🛠️ Comandos Disponibles

```bash
# Instalar reglas
npx cw-method-rdd install

# Instalar tipo específico
npx cw-method-rdd install --type=frontend

# Listar reglas disponibles
npx cw-method-rdd list

# Validar reglas instaladas
npx cw-method-rdd validate

# Ver versión
npx cw-method-rdd --version

# Ayuda
npx cw-method-rdd --help
```

### 🔄 Actualizar el Paquete

Para actualizar a la última versión después de publicar:

```bash
# Si se instaló localmente
npm update cw-method-rdd

# Si se instaló globalmente
npm update -g cw-method-rdd

# O reinstalar la última versión
npm install cw-method-rdd@latest --save-dev
```

## 📚 Documentación

Ver carpeta `/docs` para documentación completa.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor revisa las guías de contribución.

## 📝 Licencia

MIT
