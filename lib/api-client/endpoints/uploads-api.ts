import type {
  UploadFolder,
  UploadSignature,
} from '@/lib/shared/types/upload-dto'

import { apiClient } from '../axios-instance'

export const uploadsApi = {
  sign: (folder: UploadFolder) =>
    apiClient
      .post<UploadSignature>('/uploads/sign', { folder })
      .then((response) => response.data),
}
