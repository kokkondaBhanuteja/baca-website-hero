export type EnquiryStatusValue = 'NEW' | 'READ' | 'ARCHIVED'

export interface EnquiryDto {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  message: string
  localeSent: string
  status: EnquiryStatusValue
  createdAt: string
}
