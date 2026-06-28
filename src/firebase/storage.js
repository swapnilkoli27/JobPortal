// Firebase Storage Helpers
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

/**
 * Upload a company logo file and return its download URL.
 * @param {File} file – image file
 * @param {string} jobId – used to build storage path
 * @param {Function} onProgress – progress callback (0-100)
 */
export const uploadCompanyLogo = (file, jobId, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef  = ref(storage, `logos/${jobId}/${Date.now()}_${file.name}`)
    const uploadTask  = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(Math.round(progress))
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}

/**
 * Upload any file and return download URL (simpler, no progress).
 */
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path)
  const snapshot   = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

/**
 * Delete a file from Storage by its full URL.
 */
export const deleteFileByUrl = async (url) => {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (err) {
    // Ignore not-found errors
    if (err.code !== 'storage/object-not-found') throw err
  }
}
