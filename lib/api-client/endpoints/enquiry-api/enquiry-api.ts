import type { EnquiryInput } from '@/lib/server/validation/enquiry-schema'

import { apiClient } from '@/lib/api-client/axios-instance'

export const enquiryApi = {
  /** Public submission from the contact page. */
  submit: (input: EnquiryInput) =>
    apiClient
      .post<{ id: string }>('/enquiry', input)
      .then((response) => response.data),
}
