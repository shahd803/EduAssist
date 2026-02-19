import Topbar from '@/components/Topbar'
import Hero from '@/components/Hero'
import UploadPanel from '@/components/UploadPanel'
import PreviewPanel from '@/components/PreviewPanel'
import GenerateTestPanel from '@/components/GenerateTestPanel'
import TestPreviewPanel from '@/components/TestPreviewPanel'
import ExportPanel from '@/components/ExportPanel'
import Footer from '@/components/Footer'
import { materials, previewParagraphs, questions } from '@/data/sampleData'

export default function Home() {
  return (
    <div className="app">
      <Topbar />
      <Hero />

      <main className="content">
        <UploadPanel materials={materials} />
        <PreviewPanel previewParagraphs={previewParagraphs} />
        <GenerateTestPanel />
        <TestPreviewPanel questions={questions} />
        <ExportPanel />
      </main>

      <Footer />
    </div>
  )
}