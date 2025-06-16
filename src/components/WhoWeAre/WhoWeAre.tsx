import lighthouse from '../../assets/lighthouse.png'
import user from '../../assets/user.png'
import vision from '../../assets/vision.png'

const WhoWeAre = () => {
    return (
        <div className="mt-12 mr-12 ml-12" id='who-we-are'>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <div className='flex justify-center'>
                        <img
                            src={user}
                            className='w-20 h-auto'
                        />
                    </div>
                    <p className='text-3xl font-bold mt-4 mb-2'>Quem somos</p>
                    <p className=''>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
                <div>
                    <div className='flex justify-center'>
                        <img
                            src={lighthouse}
                            className='w-20 h-auto'
                        />
                    </div>
                    <p className='text-3xl font-bold mt-4 mb-2'>Missão</p>
                    <p className=''>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
                <div>
                    <div className='flex justify-center'>
                        <img
                            src={vision}
                            className='w-20 h-auto'
                        />
                    </div>
                    <p className='text-3xl font-bold mt-4 mb-2'>Visão</p>
                    <p className=''>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
            </div>
        </div>
    )
}

export default WhoWeAre