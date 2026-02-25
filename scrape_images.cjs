const https = require('https');
const fs = require('fs');

const categories = [
    'motor-antrieb',
    'Kuehler',
    'Klima',
    'Kraftstoff',
    'Bremsen',
    'wartung-pflege',
    'Karosserie'
];

async function fetchPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function scrape() {
    const products = {};
    for (const cat of categories) {
        console.log(`Scraping ${cat}...`);
        const page = await fetchPage(`https://www.wepp.de/wepp/web/wepp-shop/produkte/${cat}.aspx`);

        // Find all product blocks
        // Each block has an image and an article number later
        // The structure looks like:
        // <a id="artikelbild_klein" ...><img ... src="IMAGE_URL" ...></a>
        // ...
        // <a id="input_artikelnummer" ... >Artikel Nr.: ID</a>

        const imgRegex = /<img.*?id="artikelbild_klein_img".*?src="([^"]+)"/g;
        const idRegex = /<a.*?id="input_artikelnummer".*?>Artikel Nr.: ([^<]+)<\/a>/g;

        let match;
        const images = [];
        while ((match = imgRegex.exec(page)) !== null) {
            images.push(match[1]);
        }

        let idMatch;
        const ids = [];
        while ((idMatch = idRegex.exec(page)) !== null) {
            ids.push(idMatch[1].trim());
        }

        for (let i = 0; i < ids.length; i++) {
            if (images[i]) {
                // Handle relative URLs
                const fullUrl = images[i].startsWith('http') ? images[i] : `https://www.wepp.de${images[i]}`;
                products[ids[i]] = fullUrl;
            }
        }
    }

    fs.writeFileSync('product_images.json', JSON.stringify(products, null, 2));
    console.log('Done! Saved to product_images.json');
}

scrape().catch(console.error);
