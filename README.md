# pato-rank

## Development

Ejecutar la aplicación con `npm run dev`.

Requisitos:
* Configurar Airtable

### Base de datos
1. Crear una cuenta y una base en [Airtable](https://airtable.com).
2. En esa base, crear una tabla llamada `Players`, con columnas:
    * `name`: string
    * `rating`: float
    * `rd`: float
    * `vol`: float
3. En la página de la base, ir a `Help -> API Documentation` arriba a la derecha. De ahí sacar el ID de la base (algo como `appXXXXXXXXXX`). Ponerla en `.env` como `AIRTABLE_BASE_ID`.
4. De https://airtable.com/account sacar la API key y ponerla en `.env` como `AIRTABLE_SECRET_KEY`.
