const https = require("https");

function generateUrls(inputUrl) {
  const match = inputUrl.match(/\/(\d+)-([^/]+)$/);

  if (match) {
    const imageID = match[1];
    const imageName = match[2];
    let padding = imageID.padStart(9, "0");
    const finalID = `${padding.slice(0, 3)}/${padding.slice(3, 6)}/${padding.slice(6)}`;

    let extensions;
    let urlStructure;

    if (inputUrl.includes("/photo/")) {
      extensions = ["jpg", "jpeg", "JPG", "JPEG"];
      urlStructure = `https://static.vecteezy.com/system/resources/previews/${finalID}/original/${imageName}-photo.`;
    } else if (inputUrl.includes("/png/")) {
      extensions = ["png", "PNG"];
      urlStructure = `https://static.vecteezy.com/system/resources/previews/${finalID}/original/${imageName}-png.`;
    } else {
      console.log("Invalid original URL format");
      return []; // Return an empty array if the URL format is invalid
    }

    // Generate and return the URLs as an array
    return extensions.map(extension => `${urlStructure}${extension}`);
  } else {
    console.log("Invalid original URL format");
    return []; // Return an empty array if the URL format does not match
  }
}

function checkStatusCodes(urls) {
  const promises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      https
        .get(url, { timeout: 30000 }, (res) => {
          // Check the status code
          if (res.statusCode === 200) {
            resolve({ url, status: true });
          } else {
            resolve({ url, status: false });
          }
        })
        .on("error", (err) => {
          // Handle errors
          reject(err);
        });
    });
  });

  return Promise.all(promises);
}

module.exports = { generateUrls, checkStatusCodes };
