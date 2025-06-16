import './WantHelp.css'
import handshake from '../../assets/handshake.png'
import donation from '../../assets/donation.png'
import hand from '../../assets/hand.png'

const WantHelp = () => {
    return (
        <div className="mt-6 want-help-wrapper" id='want-help'>
            <p className='text-5xl font-bold pt-10 mb-6'>Quero ajudar</p>
            <div className="grid grid-cols-3 gap-4 pb-10">
                <div>
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
                </div>
            </div>
        </div>
    )
}

export default WantHelp