import { listGalleryForAdmin } from '@/lib/server/services/gallery-service'
import { DeleteEntityButton } from '../../components/delete-entity-button'
import { GalleryUploaderForm } from '../../components/gallery-uploader-form'

export const dynamic = 'force-dynamic'

export default async function GalleryAdminPage() {
  const images = await listGalleryForAdmin()

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-light text-ink">Gallery</h1>

      <GalleryUploaderForm />

      {images.length === 0 ? (
        <p className="text-sm text-ink-60">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-xl border border-line bg-paper"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.imageUrl}
                alt={image.caption?.en ?? ''}
                className="aspect-square w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-xs text-ink-60">
                  {image.caption?.en ?? '—'}
                </span>
                <DeleteEntityButton id={image.id} kind="galleryImage" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
