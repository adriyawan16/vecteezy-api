const https = require('https');
const cheerio = require('cheerio');

function scrapeAndCheckImageUrls(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const $ = cheerio.load(data);
        const filterKeyword = 'https://static.vecteezy.com/system/resources/previews';
        const imageUrls = [];

        // Assuming the image URLs are contained in img elements with specific filter keywords in their src attribute
        $('img').each((index, element) => {
          const imageUrl = $(element).attr('src');
          if (imageUrl && imageUrl.includes(filterKeyword)) {
            // Replace '/non_2x/' with '/original/'
            const modifiedImageUrl = imageUrl.replace('/non_2x/', '/original/');
            imageUrls.push(modifiedImageUrl);
          }
        });

        // Resolve the promise with the modified image URLs
        resolve(imageUrls.map(url => ({ url, status: true })));
  });
    }).on('error', (error) => {
      // Reject the promise if there's an error
      reject(error);
    });
  });
}

module.exports = { scrapeAndCheckImageUrls };
