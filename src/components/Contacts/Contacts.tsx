import gps from '../../assets/gps_15949802.png'

const Contacts = () => {
    return (
        <div className="flex mt-10 mr-12 ml-12" id='contacts'>
            <div className='mr-6'>
                <img
                    src={gps}
                    className='w-12 h-auto'
                />
            </div>
            <div className="text-start">
                <p className='text-5xl font-bold mb-4'>Contatos</p>
                <p className='text-2xl mb-2'>Rua AX: 224, the Joana Bezerra - Recife</p>
                <p className='text-2xl mb-2'>contato@coqueconnecta.com.br</p>
                <p className='text-2xl mb-8'>+55 8798238988</p>
            </div>
        </div>
    )
}

export default Contacts