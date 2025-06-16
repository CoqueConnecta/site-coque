import coqueLogo from '../../assets/coque-logo-vertical.png'
const Header = () => {
    return (
        <div className="grid grid-cols-6 mr-12 ml-12">
            <div className="col-span-2">
                <img
                    src={coqueLogo}
                    className='w-20 h-auto'
                />
            </div>
            <div className="flex justify-center items-center"><button className='btn-secundary h-10'><a href='#who-we-are'>Quem somos</a></button></div>
            <div className="flex justify-center items-center"><button className='btn-secundary h-10'><a href='#projects'>Nossos Projetos</a></button></div>
            <div className="flex justify-center items-center"><button className='btn-secundary h-10'><a href='#contacts'>Contatos</a></button></div>
            <div className="flex justify-end items-center"><button className='btn-primary h-10'><a href='#want-help'>Quero ajudar</a></button></div>
        </div>
    )
}

export default Header