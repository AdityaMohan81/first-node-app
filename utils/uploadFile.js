import fs from 'fs';

// Set upload bucket minio
const uploadBucket = process.env.AWS_BUCKET_NAME

// Set the project location based on the environment variable
const storageType = process.env.STORAGE_TYPE
const localStoragePath = process.env.LOCAL_STORAGE_PATH || '/storage/uploads/'

/**
 * Function to upload the file based on the environment
 * @param {File} file - The file to be uploaded
 * @param {string} folderName - The folder name to be uploaded
 * @returns {Promise<{path: string, filename: string}>} The uploaded file path and filename.
 */
async function uploadFile(file, folderName) {
    return new Promise((resolve, reject) => {
        try {
            const uploadDir = './' + localStoragePath + folderName // Custom folder path

            // Create the custom folder if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            const timestamp = Date.now()
            const uniqueFileName = `${timestamp}_${file.originalname}`
            // Construct the file path for the uploaded file in the custom folder
            const filePath = `${uploadDir}/${uniqueFileName}`

            // Write the file to the custom folder

            fs.writeFile(filePath, file.buffer, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({
                        path: `${folderName}/${uniqueFileName}`,
                        filename: file.originalname,
                    })
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

export default uploadFile;
