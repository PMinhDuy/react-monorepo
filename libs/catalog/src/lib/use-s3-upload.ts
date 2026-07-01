import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { RequestUploadUrlDocument } from '@react-monorepo/shared-graphql'

// NestJS Lambda — use scalar vars, inline input object (no named input type)

export function useS3Upload() {
  const [uploading, setUploading] = useState(false)
  const [requestUploadUrl] = useMutation(RequestUploadUrlDocument)

  /** Uploads file to S3 and returns the S3 object key (not a URL). */
  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const { data } = await requestUploadUrl({
        variables: { filename: file.name, contentType: file.type },
      })
      if (!data?.requestProductUploadUrl) throw new Error('Failed to get upload URL')

      const { uploadUrl, key } = data.requestProductUploadUrl
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      return key
    } finally {
      setUploading(false)
    }
  }

  return { uploadFile, uploading }
}
