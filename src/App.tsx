import coqueLogo from './assets/coque-logo-vertical.png'
import './App.css'

function App() {

  return (
    <>
      <div>
        <a href="http://www.coqueconnecta.ong.br" target="_blank">
          <img src={coqueLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Site Coque Connecta</h1>
      <h2>Em construção!</h2>
      <div className="card">
        <p>
          Em breve você poderá acessar o site da Coque Connecta
        </p>
      </div>
    </>
  )
}

export default App
