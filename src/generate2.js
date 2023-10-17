const https = require("https");

const regex =
  /https:\/\/www\.vecteezy\.com\/(video|psd|bundle|vector-art)\/(\d+)-/;
const MAX_FILENAME_LENGTH = 58;

function generateUrls(inputUrl) {
  const match = inputUrl.match(regex);

  if (match && match[1]) {
    const mediaType = match[1];
    const videoId = match[2];
    const formattedVideoId = videoId.padStart(9, "0");
    let folderStructure = "";

    if (
      mediaType === "video" ||
      mediaType === "psd" ||
      mediaType === "bundle"
    ) {
      folderStructure = `${formattedVideoId.substr(
        0,
        3
      )}/${formattedVideoId.substr(3, 3)}/${formattedVideoId.substr(6)}`;
    } else if (mediaType === "vector-art") {
      folderStructure = `${formattedVideoId.substr(
        0,
        3
      )}/${formattedVideoId.substr(3, 3)}/${formattedVideoId.substr(6)}`;
    }

    // Extract the fileName from the original URL and remove numbers before the hyphen
    let fileName = inputUrl.split("/").pop();
    let sanitizedFileName = fileName.replace(/^.*?-/, "");

    // If the sanitizedFileName starts with a hyphen, remove the leading hyphen
    if (sanitizedFileName.startsWith("-")) {
      sanitizedFileName = sanitizedFileName.substring(1);
    }

    // Limit the filename length to MAX_FILENAME_LENGTH characters
    if (sanitizedFileName.length > MAX_FILENAME_LENGTH) {
      const words = sanitizedFileName.split("-");
      let truncatedFileName = "";
      for (const word of words) {
        if (truncatedFileName.length + word.length <= MAX_FILENAME_LENGTH) {
          truncatedFileName += (truncatedFileName ? "-" : "") + word;
        } else {
          break;
        }
      }
      fileName = truncatedFileName;
    } else {
      fileName = sanitizedFileName;
    }

    let fileExtensions = [];
    if (mediaType === "video") {
      // Include both "mp4" and "mov" file extensions
      fileExtensions = ["mp4", "mov"];
    } else if (mediaType === "psd") {
      fileExtensions = ["psd"];
    } else if (mediaType === "vector-art" || mediaType === "bundle") {
      fileExtensions = ["zip"];
    }

    // Generate URLs for each file extension with ascending numbers as suffixes
    const generatedUrls = [];
    for (const extension of fileExtensions) {
      for (let suffix = 1; suffix <= 999; suffix++) {
        const newUrl = `https://files.vecteezy.com/system/protected/files/${folderStructure}/vecteezy_${fileName}_${videoId}_${suffix}.${extension}`;
        generatedUrls.push(newUrl);
      }
    }

    return generatedUrls;
  } else {
    console.log("Invalid original URL format");
    return [];
  }
}

function checkStatusCodes(url) {
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
}
module.exports = { generateUrls, checkStatusCodes };