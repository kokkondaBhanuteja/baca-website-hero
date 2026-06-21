import { BlogTypeForm } from '../../../components/blog-type-form'

export default function NewBlogTypePage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        New blog type
      </h1>
      <BlogTypeForm />
    </div>
  )
}
