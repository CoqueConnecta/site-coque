import Banner from '../components/Banner/Banner'
import Contacts from '../components/Contacts/Contacts'
import Header from '../components/Header/Header'
import LanguageToggle from '../components/LanguageToggle/LanguageToggle'
import MissionVisionValues from '../components/MissionVisionValues/MissionVisionValues'
import Projects from '../components/Projects/Projects'
import WantHelp from '../components/WantHelp/WantHelp'

function Site() {

  return (
    <>
      <LanguageToggle/>
      <Header/>
      <Banner/>
      <MissionVisionValues/>
      <Projects/>
      <WantHelp/>
      <Contacts/>
    </>
  )
}

export default Site
