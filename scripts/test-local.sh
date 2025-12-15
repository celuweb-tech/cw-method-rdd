#!/bin/bash

# Script para probar cw-method-rdd localmente
# Uso: ./scripts/test-local.sh [proyecto-prueba]

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_PROJECT="${1:-../app-cw-b2b}"

echo "🔧 Configurando cw-method-rdd para pruebas locales..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Paso 1: Verificar que estamos en el directorio correcto
echo -e "${BLUE}1. Verificando directorio...${NC}"
cd "$PROJECT_DIR"
echo "✅ Directorio: $PROJECT_DIR"

# Paso 2: Instalar dependencias si es necesario
echo -e "\n${BLUE}2. Verificando dependencias...${NC}"
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
else
    echo "✅ Dependencias ya instaladas"
fi

# Paso 3: Dar permisos de ejecución al binario
echo -e "\n${BLUE}3. Configurando permisos del binario...${NC}"
chmod +x bin/cw-method-rdd.js
echo "✅ Permisos configurados"

# Paso 4: Verificar que el binario funciona
echo -e "\n${BLUE}4. Verificando binario...${NC}"
if node bin/cw-method-rdd.js --version > /dev/null 2>&1; then
    VERSION=$(node bin/cw-method-rdd.js --version)
    echo "✅ Binario funciona correctamente (versión: $VERSION)"
else
    echo "❌ Error: El binario no funciona"
    exit 1
fi

# Paso 5: Crear link global
echo -e "\n${BLUE}5. Creando link global...${NC}"
npm link
echo "✅ Link global creado"

# Paso 6: Probar en proyecto de prueba
if [ -d "$TEST_PROJECT" ]; then
    echo -e "\n${BLUE}6. Probando en proyecto: $TEST_PROJECT${NC}"
    cd "$TEST_PROJECT"
    
    # Verificar si tiene package.json
    if [ ! -f "package.json" ]; then
        echo -e "${YELLOW}⚠️  El proyecto de prueba no tiene package.json${NC}"
        echo "   Creando package.json básico..."
        echo '{"name": "test-project", "version": "1.0.0"}' > package.json
    fi
    
    # Vincular el paquete
    echo "🔗 Vinculando cw-method-rdd..."
    npm link cw-method-rdd
    
    echo -e "\n${GREEN}✅ Configuración completada!${NC}"
    echo ""
    echo "Ahora puedes probar el comando:"
    echo "  npx cw-method-rdd install"
    echo "  npx cw-method-rdd list"
    echo "  npx cw-method-rdd validate"
    echo ""
    echo "Para desvincular cuando termines:"
    echo "  npm unlink cw-method-rdd"
else
    echo -e "\n${YELLOW}⚠️  Proyecto de prueba no encontrado: $TEST_PROJECT${NC}"
    echo ""
    echo -e "${GREEN}✅ Link global creado!${NC}"
    echo ""
    echo "Para probar en un proyecto específico, ejecuta:"
    echo "  cd /ruta/al/proyecto"
    echo "  npm link cw-method-rdd"
    echo "  npx cw-method-rdd install"
fi

echo ""
echo -e "${BLUE}📝 Nota: Para eliminar el link global cuando termines:${NC}"
echo "  cd $PROJECT_DIR"
echo "  npm unlink -g cw-method-rdd"

