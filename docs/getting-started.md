# Getting Started - CW Method RDD

## Instalación

```bash
npm install cw-method-rdd --save-dev
```

## Primer Uso

1. Instala las reglas:
```bash
npx cw-method-rdd install
```

2. El CLI detectará automáticamente tu tipo de proyecto

3. Las reglas se instalarán en `.cursor/rules/`

4. Los agentes de IA (Cursor, Windsurf) las leerán automáticamente

## Configuración Manual

Crea `.cw-rdd.json`:

```json
{
  "projectType": "frontend",
  "rules": {
    "frontend": true,
    "shared": true
  }
}
```

## Validar Instalación

```bash
npx cw-method-rdd validate
```
