//import coqueLogo from './assets/coque-logo-vertical.png'
import Banner from './components/Banner/Banner'
import Contacts from './components/Contacts/Contacts'
import Header from './components/Header/Header'
import LanguageToggle from './components/LanguageToggle/LanguageToggle'
import MissionVisionValues from './components/MissionVisionValues/MissionVisionValues'
import Projects from './components/Projects/Projects'
import WantHelp from './components/WantHelp/WantHelp'
import WhoWeAre from './components/WhoWeAre/WhoWeAre'
function App() {

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
    // <div className='flex flex-col items-center justify-center p-5 mt-7 gap-5'>
    //   <div>
    //     <a href='http://www.coqueconnecta.ong.br' target='_blank'>
    //       <img 
    //         className='w-48 h-auto mb-4' 
    //         src={coqueLogo} 
    //         alt='Logo da Coque Connecta' 
    //       />
    //     </a>
    //   </div>
    //   <h2 className='text-2xl'>Site em construção 🚧</h2>
    //   <p className=' text-lg text-center'>Em breve você poderá acessar o novo site da Coque Connecta</p>
    // </div>
  )
}

export default App
