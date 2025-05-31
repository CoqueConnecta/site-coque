import coqueLogo from './assets/coque-logo-vertical.png'
function App() {

  return (
    <div className='flex flex-col items-center justify-center p-5 mt-7 gap-5'>
      <div>
        <a href='http://www.coqueconnecta.ong.br' target='_blank'>
          <img 
            className='w-48 h-auto mb-4' 
            src={coqueLogo} 
            alt='Logo da Coque Connecta' 
          />
        </a>
      </div>
      <h2 className='text-2xl'>Site em construção 🚧</h2>
      <p className=' text-lg text-center'>Em breve você poderá acessar o novo site da Coque Connecta</p>
    </div>
  )
}

export default App
