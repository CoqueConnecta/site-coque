import lighthouse from '../../assets/lighthouse.png'
import user from '../../assets/user.png'
import vision from '../../assets/vision.png'

const WhoWeAre = () => {
    return (
        <section
            className="mt-12 mx-4 md:mx-12"
            id="who-we-are"
            aria-labelledby="who-we-are-title"
        >
            <h2
                id="who-we-are-title"
                className="sr-only"
                tabIndex={-1}
            >
                Quem somos, Missão e Visão
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <article
                    className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
                    tabIndex={0}
                    aria-labelledby="quem-somos-title"
                >
                    <div className="flex justify-center mb-2">
                        <img
                            src={user}
                            className="w-20 h-auto"
                            alt="Ícone representando quem somos"
                        />
                    </div>
                    <h3
                        id="quem-somos-title"
                        className="text-2xl font-bold mt-2 mb-2 text-center"
                    >
                        Quem somos
                    </h3>
                    <p className="text-center text-base">
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </article>
                <article
                    className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
                    tabIndex={0}
                    aria-labelledby="missao-title"
                >
                    <div className="flex justify-center mb-2">
                        <img
                            src={lighthouse}
                            className="w-20 h-auto"
                            alt="Ícone representando missão"
                        />
                    </div>
                    <h3
                        id="missao-title"
                        className="text-2xl font-bold mt-2 mb-2 text-center"
                    >
                        Missão
                    </h3>
                    <p className="text-center text-base">
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </article>
                <article
                    className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
                    tabIndex={0}
                    aria-labelledby="visao-title"
                >
                    <div className="flex justify-center mb-2">
                        <img
                            src={vision}
                            className="w-20 h-auto"
                            alt="Ícone representando visão"
                        />
                    </div>
                    <h3
                        id="visao-title"
                        className="text-2xl font-bold mt-2 mb-2 text-center"
                    >
                        Visão
                    </h3>
                    <p className="text-center text-base">
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </article>
            </div>
        </section>
    )
}

export default WhoWeAre