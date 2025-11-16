//Este codigo basicamente es un scraper que va al JSON de la pagina de COTO y obtiene los productos con sus categorias
//Cuando conviertan el JSON en base de datos, mergeen con lo de productosCOTO.json.
//Despues armen otra base de datos que tenga las categorias con id.
import fs from "fs";
import path from "path";
import cliProgress from "cli-progress";

const BASE_URL = "https://www.cotodigital.com.ar/sitios/cdigi/categoria";
const BASE_QUERY =
  "Nf=product.endDate|GTEQ+1.7584128E12||product.endDate|GTEQ+1.663632E12||product.startDate|LTEQ+1.663632E12||product.startDate|LTEQ+1.7584128E12&Nr=AND(product.language:espa%C3%B1ol,product.sDisp_200:1004,OR(product.siteId:CotoDigital))&Ns=product.TOTALDEVENTAS|1||sku.activePrice|0&format=json";

const CHUNK = 100;         // La cantidad de productos que se iran descargando por request para que no reviente todo.
const MAX_PRODS = 9000;      // Conte cuantos productos habia en el productosCoTO.json, si se hace un nuevo scraping de proudctosCOTO, revisen si el numero coincide.
const REINTENTOS = 3;                 // Reintentos.
const LIMITE_VACIOS = 5;         // Condicion de parada.
const DESTINO = "./productos_con_categorias.json";  //Aca se guarda
const DELAY_MS = 350;              // delay entre requests.
const TIMEOUT_MS = 10000;    // 10 segundos de timeout para fetches.
// ==============================================

// util para esperar
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// FETCH
async function fetchJSON(url) {
  for (let intento = 1; intento <= REINTENTOS; intento++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json, text/plain, */*",
          Referer: "https://www.cotodigital.com.ar/",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const text = await res.text();
      if (text.trim().startsWith("<")) {
        throw new Error("Received HTML instead of JSON (blocked or redirect)");
      }

      return JSON.parse(text);
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`  Attempt ${intento}/${REINTENTOS} failed for ${url}: ${err.message}`);
      if (intento < REINTENTOS) await wait(500 * intento);
      else throw err;
    }
  }
}

function extraerProductos(data) {
  const grupos = data?.contents?.[0]?.Main?.[2]?.contents?.[0]?.records;
  if (!Array.isArray(grupos)) return [];

  const productos = [];
  for (const grupo of grupos) {
    if (!grupo?.records || !Array.isArray(grupo.records)) continue;

    for (const rec of grupo.records) {
      const attrs = rec.attributes || {};
      const displayName = attrs["product.displayName"]?.[0] ?? null;
      const category = attrs["product.category"]?.[0] ?? null;
      const LDEPAR = attrs["product.LDEPAR"]?.[0] ?? null;
      const TOTALDEVENTAS = attrs["product.TOTALDEVENTAS"]?.[0] ?? null;
      const stock = attrs["sku.quantity"]?.[0] ?? null;

      if (displayName) {
        productos.push({ title: displayName, subcategoria: category, supercategoria: LDEPAR, totaldeventas : TOTALDEVENTAS, stock: stock } );
      }
    }
  }
  return productos;
}

// Se van escribiendo productos de forma atomica
function guardarProductos(products) {
  const tmp = `${DESTINO}.tmp`;
  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(products, null, 2), "utf8");
  fs.renameSync(tmp, DESTINO);
}

async function scrapEnChunks() {
  const totalChunks = Math.ceil(MAX_PRODS / CHUNK);
  const bar = new cliProgress.SingleBar(
    { format: "Chunks {bar} {percentage}% | {value}/{total} | {msg}" },
    cliProgress.Presets.shades_classic
  );
  bar.start(totalChunks, 0, { msg: "starting" });

  const obtenidos = [];
  let vacios = 0;

  for (let offset = 0; offset < MAX_PRODS; offset += CHUNK) {
    const url = `${BASE_URL}?${BASE_QUERY}&No=${offset}&Nrpp=${CHUNK}`;
    let data;

    try {
      data = await fetchJSON(url);
    } catch (err) {
      console.error(`✖ Error en el fetch del chunk=${offset}: ${err.message}`);
      bar.increment(1, { msg: `offset ${offset} falló` });
      await wait(DELAY_MS);
      continue;
    }

    const products = extraerProductos(data);
    if (!products.length) {
      vacios += 1;
      console.log(`→ offset=${offset} se retornaron 0 productos (empty streak=${vacios})`);
    } else {
      vacios = 0;
      console.log(`→ offset=${offset} → ${products.length} productos`);
      obtenidos.push(...products);
      guardarProductos(obtenidos);
    }

    bar.increment(1, { msg: `offset ${offset}` });

    if (vacios >= LIMITE_VACIOS) {
      console.log(`Se detuvo dado a ${vacios} chunks vacios en el offset ${offset}.`);
      break;
    }

    await wait(DELAY_MS);
  }

  bar.stop();
  guardarProductos(obtenidos);
  console.log(`\n✅ Proceso terminado. Se coleccionaron ${obtenidos.length} productos. Guardados en ${DESTINO}`);
  return obtenidos;
}

// main
(async () => {
  try {
    console.log("Los productos estan siendo scrapeados, espere pacientemente...");
    await scrapEnChunks();
  } catch (err) {
    console.error("Fatal error:", err);
  }
})();
