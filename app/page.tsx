import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"

export default function Page() {
  return (
    <main className="min-h-screen bg-bg-base p-3 sm:p-5">
      {/* framed canvas */}
      <div className="overflow-hidden rounded-[2rem] border border-line bg-bg-base">
        <Navbar />
        <Hero />
      </div>
    </main>
  )
}
