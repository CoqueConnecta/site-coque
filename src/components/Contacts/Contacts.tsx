import gps from '../../assets/gps_15949802.png'

const Contacts = () => {
    return (
        <section
            className="mt-10 mx-4 md:mx-12"
            id="contacts"
            aria-labelledby="contacts-title"
        >
            <h2
                id="contacts-title"
                className="sr-only"
                tabIndex={-1}
            >
                Contatos
            </h2>
            <div className="flex flex-col sm:flex-row items-center bg-white bg-opacity-10 rounded-lg p-6 gap-6">
                <div className="flex-shrink-0 flex justify-center mb-4 sm:mb-0">
                    <img
                        src={gps}
                        className="w-16 h-auto"
                        alt="Ícone de localização"
                    />
                </div>
                <div className="text-center sm:text-left w-full">
                    <p className="text-4xl font-bold mb-4" tabIndex={0}>Contatos</p>
                    <p className="text-lg md:text-2xl mb-2" tabIndex={0}>Rua AX: 224, the Joana Bezerra - Recife</p>
                    <p className="text-lg md:text-2xl mb-2" tabIndex={0}>contato@coqueconnecta.com.br</p>
                    <p className="text-lg md:text-2xl mb-0" tabIndex={0}>+55 8798238988</p>
                </div>
            </div>
        </section>
    )
}

export default Contacts