import { chromium } from "playwright";

const coto_URL = "https://www.cotodigital.com.ar/sitios/cdigi/categoria%3FNf%3Dproduct.endDate%257CGTEQ%2B1.7584128E12%257C%257Cproduct.endDate%257CGTEQ%2B1.663632E12%257C%257Cproduct.startDate%257CLTEQ%2B1.663632E12%257C%257Cproduct.startDate%257CLTEQ%2B1.7584128E12&No%3D0&Nr%3DAND%2528product.language%253Aespa%25C3%25B1ol%252Cproduct.sDisp_200%253A1004%252COR%2528product.siteId%253ACotoDigital%2529%2529&Nrpp%3D24&Ns%3Dproduct.TOTALDEVENTAS%257C1%257C%257Csku.activePrice%257C0&format%3Djson"

// Configuracion del browser
const browser = await chromium.launch();
const context = await browser.newContext({
	viewport: { width: 1280, height: 720 },
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
});
const page = await context.newPage();


async function getCotoProductsAmmount() {
	await page.goto(coto_URL);
	
	let ammount = ""
	let response = ""
	try {
		let selector = "h4.d-block.py-2"
		await page.waitForSelector(selector)
		if (await page.locator(selector).allInnerTexts()) {
			response = await page.locator(selector).allInnerTexts()
		} else {
			throw new Error("No se encontro ningun producto")
		}
	}
	catch (e) {
		throw new Error(e)
	}

	for (let i = 0; i < response[0].length; i++) {
		if (!isNaN(response[0][i])) {
			ammount += response[0][i]
		}
		else break;
	}

	return +ammount;
}

async function getCotoProducts(productsAmmout) {
	const allProductsURL = `https://www.cotodigital.com.ar/sitios/cdigi/categoria%3FNf%3Dproduct.endDate%257CGTEQ%2B1.7584128E12%257C%257Cproduct.endDate%257CGTEQ%2B1.663632E12%257C%257Cproduct.startDate%257CLTEQ%2B1.663632E12%257C%257Cproduct.startDate%257CLTEQ%2B1.7584128E12&No%3D0&Nr%3DAND%2528product.language%253Aespa%25C3%25B1ol%252Cproduct.sDisp_200%253A1004%252COR%2528product.siteId%253ACotoDigital%2529%2529&Nrpp%3D${productsAmmout}&Ns%3Dproduct.TOTALDEVENTAS%257C1%257C%257Csku.activePrice%257C0&format%3Djson`
	await page.goto(allProductsURL)

	const selector = "div.productos.row > *"
	let result = await page.locator(selector).allInnerTexts()

	const parsed = result.map(parseProduct);
	console.log(JSON.stringify(parsed, null, 2));

	return result;
}
function parseProduct(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

  let product = {
    title: null,
    price: null,
    regularPrice: null,
    taxFreePrice: null,
    pricePerUnit: null,
    promo: []
  };

  for (let line of lines) {
    if (line.startsWith("$")) {
      // Precio principal (la primera vez que aparece un $)
      if (!product.price) {
        product.price = line.replace("$", "").trim();
      }
    } else if (/Precio regular/i.test(line)) {
      product.regularPrice = line.replace(/[^0-9.,]/g, "");
    } else if (/Precio sin impuestos/i.test(line)) {
      product.taxFreePrice = line.replace(/[^0-9.,]/g, "");
    } else if (/Precio por/i.test(line)) {
      product.pricePerUnit = line.replace(/[^0-9.,]/g, "");
    } else if (/DTO|LLEVANDO|PRECIO CON|NO ACUMULABLE/i.test(line)) {
      product.promo.push(line);
    } else if (!product.title) {
      // El primer texto que no sea precio ni promo lo tomamos como título
      product.title = line;
    }
  }

  return product;
}


console.log(await getCotoProducts(20))	// Do with 5 elements, then add await getCotoProductsAmmount()
await browser.close();