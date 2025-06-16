import './WantHelp.css'
import handshake from '../../assets/handshake.png'
import donation from '../../assets/donation.png'
import hand from '../../assets/hand.png'

const WantHelp = () => {
    return (
        <section
            className="mt-6 want-help-wrapper"
            id="want-help"
            aria-labelledby="want-help-title"
        >
            <h2
                id="want-help-title"
                className="sr-only"
                tabIndex={-1}
            >
                Quero ajudar: Voluntariado, Doações e Sponsorship
            </h2>
            <p className="text-5xl font-bold pt-10 mb-6 text-center" tabIndex={0}>
                Quero ajudar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-10">
                <article
                    className="flex flex-col items-center bg-opacity-10 rounded-lg p-6"
                    tabIndex={0}
                    aria-labelledby="voluntariado-title"
                >
                    <div className="flex justify-center mb-2">
                        <img
                            src={handshake}
                            className="w-24 h-auto"
                            alt="Ícone representando voluntariado"
                        />
                    </div>
                    <h3
                        id="voluntariado-title"
                        className="text-2xl font-bold mt-2 mb-2 text-center"
                    >
                        Voluntariado
                    </h3>
                </article>
                <article
                    className="flex flex-col items-center bg-opacity-10 rounded-lg p-6"
                    tabIndex={0}
                    aria-labelledby="doacoes-title"
                >
                    <div className="flex justify-center mb-2">
                        <img
                            src={donation}
                            className="w-24 h-auto"
                            alt="Ícone representando doações"
                        />
                    </div>
                    <h3
                        id="doacoes-title"
                        className="text-2xl font-bold mt-2 mb-2 text-center"
                    >
                        Doações
                    </h3>
                </article>
                <article
                    className="flex flex-col items-center bg-opacity-10 rounded-lg p-6"
                    tabIndex={0}
                    aria-labelledby="sponsorship-title"
                >
                    <div className="flex justify-center mb-2">
                        <img
                            src={hand}
                            className="w-24 h-auto"
                            alt="Ícone representando sponsorship"
                        />
                    </div>
                    <h3
                        id="sponsorship-title"
                        className="text-2xl font-bold mt-2 mb-2 text-center"
                    >
                        Sponsorship
                    </h3>
                </article>
            </div>
        </section>
    )
}

export default WantHelp