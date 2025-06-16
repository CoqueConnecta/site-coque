const Projects = () => {
    return (
        <section className="mt-6 text-start mx-4 md:mx-12" id="projects" aria-labelledby="projects-title">
            <h2
            id="projects-title"
            className="text-5xl font-bold pt-10 mb-6 text-center"
                tabIndex={-1}
            >
                Nossos Projetos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-10">
                {/* <div>
                    <div className='flex justify-center'>
                        <img
                            src={handshake}
                            className='w-24 h-auto'
                        />
                    </div>
                    <p className='text-3xl font-bold mt-4'>Voluntariado</p>
                </div>
                <div>
                    <div className='flex justify-center'>
                        <img
                            src={donation}
                            className='w-24 h-auto'
                        />
                    </div>
                    <p className='text-3xl font-bold mt-4'>Doações</p> 
                </div>
                <div>
                    <div className='flex justify-center'>
                        <img
                            src={hand}
                            className='w-24 h-auto'
                        />
                    </div>
                    <p className='text-3xl font-bold mt-4'>Sponsorship</p>
                </div> */}
            </div>
        </section>
    )
}

export default Projects