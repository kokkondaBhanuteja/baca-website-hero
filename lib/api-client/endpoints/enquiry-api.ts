import type {
  EnquiryDto,
  EnquiryStatusValue,
} from '@/lib/shared/types/enquiry-dto'
import type { EnquiryInput } from '@/lib/server/validation/enquiry-schema'

import { apiClient } from '../axios-instance'

export const enquiryApi = {
  /** Public submission from the contact page. */
  submit: (input: EnquiryInput) =>
    apiClient
      .post<{ id: string }>('/enquiry', input)
      .then((response) => response.data),
  /** Admin inbox. */
  list: () =>
    apiClient.get<EnquiryDto[]>('/enquiry').then((response) => response.data),
  updateStatus: (id: string, status: EnquiryStatusValue) =>
    apiClient
      .patch<EnquiryDto>(`/enquiry/${id}`, { status })
      .then((response) => response.data),
}
