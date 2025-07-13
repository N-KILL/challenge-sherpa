# CHALLENGE POR IGNACIO CARDOZO #

## Playwright Tests - Manuscript Reading Application

Este proyecto contiene tests automatizados de Playwright para una aplicación de lectura de manuscritos. Los tests verifican la funcionalidad de desbloqueo de manuscritos por siglos (XIV, XV, XVI, XVII, XVIII) y la extracción de códigos de acceso desde archivos PDF.

## 📋 Descripción

Los tests automatizan el siguiente flujo:
1. **Login** en la aplicación con credenciales predefinidas
2. **Filtrado** de manuscritos por siglo
3. **Verificación** del estado de los manuscritos (bloqueado/desbloqueado)
4. **Desbloqueo** de manuscritos usando códigos de acceso
5. **Descarga** de archivos PDF
6. **Extracción** de códigos de acceso desde los PDFs descargados

## 🚀 Instalación

### Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

### Pasos de instalación

1. **Clona o descarga** el proyecto:
```bash
git clone <repository-url>
cd playwright
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Instala los navegadores de Playwright**:
```bash
npx playwright install
```

## ⚙️ Configuración

### Credenciales de login

Los tests utilizan las siguientes credenciales por defecto:
- **Email**: `monje@sherpa.local`
- **Password**: `cript@123`

Si necesitas cambiar estas credenciales, modifica el archivo `tests/file-reading.spec.ts` en las líneas correspondientes.

## 🧪 Ejecución de Tests

### Ejecutar todos los tests

```bash
npx playwright test
```

### Ejecutar tests en modo UI (recomendado para desarrollo)

```bash
npx playwright test --ui
```

### Ejecutar tests en modo headed (ver el navegador)

```bash
npx playwright test --headed
```

### Ejecutar tests en modo debug

```bash
npx playwright test --debug
```

## 📁 Estructura del Proyecto

```
playwright/
├── tests/
│   ├── file-reading.spec.ts          # Tests principales
│   └── utils/
│       ├── logger.ts                 # Utilidad de logging
│       └── manuscript-tools/
│           ├── decode-password.ts    # Decodificación de contraseñas
│           ├── download-pdf.ts       # Descarga de PDFs
│           ├── filter-by-century.ts  # Filtrado por siglo
│           ├── get-title.ts          # Obtención de títulos
│           ├── read-pdf-and-extract-code.ts  # Extracción de códigos
│           ├── unlock-manuscript.ts  # Desbloqueo de manuscritos
│           ├── verify-locked-manuscript.ts   # Verificación de manuscritos bloqueados
│           └── verify-unlocked-manuscript.ts # Verificación de manuscritos desbloqueados
├── playwright.config.ts              # Configuración de Playwright
├── package.json                      # Dependencias del proyecto
└── readme.md                         # Este archivo
```

## 🔧 Funcionalidades de los Tests

### Test: "Check century XIV"
- Verifica que el manuscrito del siglo XIV esté desbloqueado
- Descarga el PDF y extrae el código de acceso
- Este código se usará para desbloquear manuscritos de siglos posteriores

### Test: "Check century XV"
- Verifica que el manuscrito del siglo XV esté bloqueado
- Usa el código de acceso del siglo XIV para desbloquearlo
- Descarga el PDF y extrae un nuevo código de acceso

### Test: "Check century XVI"
- Similar al siglo XV, pero para el siglo XVI
- Usa el código de acceso del siglo anterior

### Test: "Check century XVII"
- Usa la API para desbloquear el manuscrito del siglo XVII
- Descarga el PDF y extrae el código de acceso

### Test: "Check century XVIII"
- Usa la API para desbloquear el manuscrito del siglo XVIII
- Finaliza la secuencia de tests

## 📊 Reportes

Después de ejecutar los tests, puedes ver los reportes:

### Reporte HTML (recomendado)
```bash
npx playwright show-report
```

### Reporte JSON
Los resultados se guardan en `test-results/results.json`

## 🐛 Solución de Problemas

### Error: "Login failed"
- Verifica que las credenciales sean correctas
- Asegúrate de que la aplicación esté accesible en la URL configurada

### Error: "Could not obtain access code"
- Los tests se saltarán automáticamente si no pueden obtener el código de acceso
- Verifica que los PDFs se estén descargando correctamente

### Error: "Page not found"
- Verifica que la URL base en `playwright.config.ts` sea correcta
- Asegúrate de que la aplicación esté funcionando

### Tests que fallan en CI/CD
- Los tests están configurados para ejecutarse en WebKit por defecto
- En CI/CD, se ejecutan con 1 worker y 2 reintentos

## 🔄 Modo de Ejecución Serial

Los tests están configurados para ejecutarse en **modo serial** (`test.describe.serial`) porque:
- Cada test depende del código de acceso obtenido en el test anterior
- Si un test falla, los siguientes se saltarán automáticamente
- Esto evita ejecutar tests innecesarios cuando falla la obtención de códigos de acceso

### NOTA: ESTO OBLIGA A TODOS LOS TEST SE CORRAN EN CONJUNTO Y NO POR SEPARADO
