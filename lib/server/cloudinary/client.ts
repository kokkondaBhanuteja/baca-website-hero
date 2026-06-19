import 'server-only'

import { v2 as cloudinary } from 'cloudinary'

import { serverEnvironment } from '@/lib/server/env'

cloudinary.config({
  cloud_name: serverEnvironment.CLOUDINARY_CLOUD_NAME,
  api_key: serverEnvironment.CLOUDINARY_API_KEY,
  api_secret: serverEnvironment.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }
