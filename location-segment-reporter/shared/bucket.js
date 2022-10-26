// EDIT ONLY THE ONE in SHARED
// During the build process; this file is copied over
// Imports the Google Cloud Node.js client library
const {Storage} = require('@google-cloud/storage');

const bucketName = 'location-logger-bucket';

let uploadFileToBucket = async (fileName, reportContent) => {

  // The contents that you want to upload
  const contents = reportContent;

  // The new ID for your GCS file
  const destFileName = fileName;

  // Creates a client
  const storage = new Storage();

  async function uploadFromMemory() {
    await storage.bucket(bucketName).file(destFileName).save(contents);

    console.log(
      `${destFileName} with contents ${contents} uploaded to ${bucketName}.`
    );
  }

  await uploadFromMemory().catch(console.error);

  // Return the file name of the uploaded resource
  let resourceURI = `https://storage.googleapis.com/location-logger-bucket/${destFileName}`;
  console.log(resourceURI)
  return resourceURI;
}

module.exports = {uploadFileToBucket};