// EDIT ONLY THE ONE in SHARED
// During the build process; this file is copied over
// Imports the Google Cloud Node.js client library

// Wish list - be able to group the files in a folder.
// Unless there is an easy way to do that and I literally don't know.
const {Storage} = require('@google-cloud/storage');

const bucketName = 'location-logger-bucket';

let uploadFileToBucket = async (folderName, fileName, reportContent) => {

  // The contents that you want to upload
  const contents = reportContent;

  // The new ID for your GCS file
  const destFileName = `${folderName}/${fileName}`;

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