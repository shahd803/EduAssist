import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import SettingsFormPanel from '@/components/settings/SettingsFormPanel'
import SettingsHelpPanel from '@/components/settings/SettingsHelpPanel'

export default function SettingsPage() {
  return (
    <div className="app">
      <Topbar />

      <main className="content">
        <SettingsFormPanel />
        <SettingsHelpPanel />
      </main>

      <Footer />
    </div>
  )
}
