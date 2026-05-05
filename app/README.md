# Estructura MVC

Esta carpeta separa la aplicación en capas:

- `Controllers/`: reciben la petición, validan flujo y llaman modelos/servicios.
- `Models/`: encapsulan acceso a archivos o datos persistentes.
- `Services/`: lógica de negocio o procesos técnicos reutilizables.
- `Views/`: HTML/PHP de presentación.
- `Core/`: utilidades comunes como render de vistas y respuestas JSON.

Los archivos públicos de la raíz (`index.php`, `save_config.php`, `import_excel.php`) quedan como entradas delgadas para conservar las rutas que ya usa el frontend.
