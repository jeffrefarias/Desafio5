import express from "express";
import {getAllJoyas,getJoyasByPriceRange} from './database/consultas.js'

// Parsear el cuerpo de la solicitud como JSON

const app = express();


const PORT = 3000
app.listen(PORT, () => {
    console.log(`SERVER ON PORT: http://localhost:${PORT}`);
})


// middleware para informar una consulta

const reportarConsulta = async (req, res, next) => {
    const parametros = req.params
    const querys = req.query
    const url = req.url
    next();
}

// get joyas
app.get("/joyas", reportarConsulta, async (req, res) => {
    try {
        const {limits, order_by,page} = req.query;
        const joyas = await getAllJoyas({limits, order_by,page});
        //respuesta del servidor
        return res.status(200).json({ ok: true, message: "Joyas en la tabla", joyas }); 
    } catch (error) {
        console.error("Error en getAllJoyas:", error.message);
        return res.status(500).json({ ok: false, result: "Error al traer las joyas"  }); //respuesta del servidor
    }
});

//Ruta GET filtrar joyas
app.get("/joyas/filtros", reportarConsulta, async (req, res) => {
    try {
        const { precio_min, precio_max, categoria, metal } = req.query;          
        const joyasFiltradas = await getJoyasByPriceRange({ precio_min, precio_max, categoria, metal });
                // Respuesta del servidor
        return res.status(200).json({ ok: true, message: "Joyas filtradas", joyas: joyasFiltradas });
    } catch (error) {
        console.error("Error al filtrar joyas:", error.message);
        return res.status(500).json({ ok: false, result: "Error al filtrar las joyas" });
    }
});
