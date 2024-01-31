import pkg from 'pg';
import format from 'pg-format';

const { Pool } = pkg;
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'joyas',
    allowExitOnIdle: true
});

const getAllJoyas = async ({ limits = 10, order_by = "id_ASC", page = 0 }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;

    if (page <= 0 || limits <= 0) {
        throw new Error('El valor de page y limits deben ser mayores a 0');
    }

    const formattedQuery = format('select * from inventario order by %s %s limit %s offset %s', campo, direccion, limits, offset);
    const { rows: inventario } = await pool.query(formattedQuery);
    return inventario;
}


const getJoyasByPriceRange = async ({ precio_min, precio_max, categoria, metal }) => {
    precio_min = parseInt(precio_min)
    precio_max = parseInt(precio_max)
    let filtros = []; 
    const values = [];

    if (precio_min <= 0 || precio_max <= 0) {
        throw new Error('No pueden haber valores negativos en los precios...');
    }
    // Validando que el precio maximo no sea menor al precio mínimo
    if (precio_max <= precio_min) {
        throw new Error('El Maximo es mayor o igual al Mínimo...');
    }

    if (precio_min >= precio_max) {
        throw new Error('El mínimo es mayor o igual al máximo...');
    }

    const agregarFiltro = (campo, operador, valor) => {
        filtros.push(`${campo} ${operador} $${values.length + 1}`);
        values.push(valor);
    };
    
 

    if (precio_min) agregarFiltro('precio', '>=', precio_min);
    if (precio_max) agregarFiltro('precio', '<=', precio_max);
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);

    let consulta = 'SELECT * FROM inventario';

    

    if (filtros.length > 0) {
        consulta += ` WHERE ${filtros.join(' AND ')}`;
    }   

     const formattedQuery = format(consulta, ...values);
    const { rows: joyasFiltradas } = await pool.query(formattedQuery);

    return joyasFiltradas;
}

export { getAllJoyas, getJoyasByPriceRange };

