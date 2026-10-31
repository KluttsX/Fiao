# Fiao

Aplicación de gestión de credito. Incluye una API ASP.NET Core 10 con Entity Framework Core y un frontend React con Vite y Tailwind CSS.

## Estructura

```text
Fiao/
├── Fiao.API/
│   └── Fiao.API/       API, migraciones y proyecto .NET
└── Fiao.frontend/      Aplicación React
```

## Requisitos

- .NET SDK 10.0.100 o posterior dentro de la línea 10.0
- Node.js 24.22.1
- SQL Server

Visual Studio es opcional: sirve como editor, pero no es necesario para ejecutar la aplicación. Si se usa Visual Studio, debe tener soporte para .NET 10 y el componente de desarrollo ASP.NET.

### Instalar las herramientas en Windows

Si faltan, abre PowerShell y ejecuta:

```powershell
winget install --id Microsoft.DotNet.SDK.10 --exact
winget install --id OpenJS.NodeJS.LTS --exact --version 24.22.1
```

Abre una terminal nueva y confirma que quedaron disponibles:

```powershell
dotnet --version
node --version
npm --version
```

El archivo `global.json` selecciona .NET SDK 10.0.100 o una versión posterior compatible de la misma línea 10.0. El archivo `.nvmrc` indica Node.js 24.22.1. La instalación del SDK y Node se hace una vez en cada computadora; el repositorio no copia esos programas.

## Configurar la base de datos

Abre `Fiao.API/Fiao.API/appsettings.json` y coloca tu cadena en `ConnectionStrings` → `DefaultConnection`. Para SQL Server Express local, puede tener esta forma:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=FiaoDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

Adapta el nombre de la instancia y la base de datos a tu instalación.

## Crear o actualizar las tablas

El proyecto incluye migraciones de Entity Framework Core. Instala la herramienta una vez:

```powershell
dotnet tool install --global dotnet-ef --version 10.0.14
```

Desde `Fiao.API/Fiao.API`, ejecuta:

```powershell
dotnet ef database update
```

`dotnet run` restaura automáticamente los paquetes NuGet declarados con sus versiones en `Fiao.API.csproj`. Para restaurarlos manualmente, ejecuta `dotnet restore` desde `Fiao.API/Fiao.API`.

## Ejecutar la API y el frontend

1. En una terminal, inicia la API:

   ```powershell
   cd Fiao.API/Fiao.API
   dotnet run --launch-profile https
   ```

   La API queda disponible en `https://localhost:7030`.

2. En otra terminal, inicia el frontend:

   ```powershell
   cd Fiao.frontend
   npm ci
   npm run dev
   ```

3. Abre la dirección que indique Vite, normalmente `http://localhost:5173`.

`npm ci` instala las versiones exactas guardadas en `Fiao.frontend/package-lock.json`. 

El CORS de la API ya permite el origen local `http://localhost:5173` utilizado por Vite.

## CRUD de clientes

| Operación | Ruta |
| --- | --- |
| Listar clientes | `GET /api/Clients` |
| Obtener un cliente | `GET /api/Clients/{id}` |
| Crear cliente | `POST /api/Clients` |
| Actualizar cliente | `PUT /api/Clients/{id}` |
| Eliminar cliente | `DELETE /api/Clients/{id}` |