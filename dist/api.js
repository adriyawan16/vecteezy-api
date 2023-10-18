const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
  scrapeAndCheckImageUrls
} = require('./image');
// Middleware to parse JSON requests
app.use(bodyParser.json());
app.get('/vecteezy', async (req, res) => {
  const inputUrl = req.query.inputUrl || req.body.inputUrl || '';
  let successfulResults = [];
  if (inputUrl.includes('https://www.vecteezy.com/png/') || inputUrl.includes('https://www.vecteezy.com/photo/')) {
    try {
      const imageUrls = await scrapeAndCheckImageUrls(inputUrl);
      console.log('Modified Image URLs:', imageUrls);
      successfulResults = imageUrls.filter(result => result.status);
      if (successfulResults.length > 0) {
        console.log('Result from image.js:', successfulResults);
        return res.json(successfulResults);
      }
    } catch (error) {
      console.log('Error processing URLs from image.js:', error);
    }
  } else {
    try {
      const basicUrls = require('./basic').generateUrls(inputUrl);
      const basicResult = await require('./basic').checkStatusCodes(basicUrls);
      successfulResults = basicResult.filter(result => result.status);
      if (successfulResults.length > 0) {
        console.log('Result from basic.js:', successfulResults);
        return res.json(successfulResults);
      }
    } catch (error) {
      console.log('Error processing URLs from basic.js:', error);
    }
    try {
      const generateUrls = require('./generate').generateUrls(inputUrl);
      const generateResult = await Promise.all(generateUrls.map(require('./generate').checkStatusCodes));
      successfulResults = generateResult.filter(result => result.status);
      if (successfulResults.length > 0) {
        console.log('Result from generate.js:', successfulResults);
        return res.json(successfulResults);
      }
    } catch (error) {
      console.log('Error processing URLs from generate.js:', error);
    }
    try {
      const generate2Urls = require('./generate2').generateUrls(inputUrl);
      const generate2Result = await Promise.all(generate2Urls.map(require('./generate2').checkStatusCodes));
      successfulResults = generate2Result.filter(result => result.status);
      if (successfulResults.length > 0) {
        console.log('Result from generate2.js:', successfulResults);
        return res.json(successfulResults);
      }
    } catch (error) {
      console.log('Error processing URLs from generate2.js:', error);
    }
    try {
      const generate3Urls = require('./generate3').generateUrls(inputUrl);
      const generate3Result = await Promise.all(generate3Urls.map(require('./generate3').checkStatusCodes));
      successfulResults = generate3Result.filter(result => result.status);
      if (successfulResults.length > 0) {
        console.log('Result from generate3.js:', successfulResults);
        return res.json(successfulResults);
      }
    } catch (error) {
      console.log('Error processing URLs from generate3.js:', error);
    }
  }
  console.log('No successful results found');
  return res.status(404).json({
    message: 'No successful results found'
  });
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});