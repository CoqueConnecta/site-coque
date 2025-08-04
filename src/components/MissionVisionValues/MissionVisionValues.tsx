import { useTranslation } from 'react-i18next';
import lighthouse from '../../assets/lighthouse.png'
import user from '../../assets/user.png'
import vision from '../../assets/vision.png'

const MissionVisionValues = () => {
  const { t } = useTranslation();
    return (
        <section
            className="mt-12 mx-4 md:mx-12"
            id="mission-vision-values"
            aria-labelledby="mission-vision-values-title"
        >
            <h2
                id="mission-vision-values-title"
                className="sr-only"
                tabIndex={-1}
            >
                Missão, Visão e Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
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
                        {t('missao.titulo')}
                    </h3>
                    <p className="text-center text-base">
                        {t('missao.descricao')}
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
                        {t('visao.titulo')}
                    </h3>
                    <p className="text-center text-base">
                        {t('visao.descricao')}
                    </p>
                </article>
                <article
                    className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
                    tabIndex={0}
                    aria-labelledby="valores-title"
                >
                    <div className="flex justify-center mb-2">
                        <img
                            src={user}
                            className="w-20 h-auto"
                            alt="Ícone representando quem somos"
                        />
                    </div>
                    <h3
                        id="valores-title"
                        className="text-2xl font-bold mt-2 mb-2 text-center"
                    >
                        {t('valores.titulo')}
                    </h3>
                    <p className="text-base text-left">
                        <p className='mb-4'>{t('valores.descricao_1')}</p>
                        <p className='mb-4'>{t('valores.descricao_2')}</p>
                        <p className='mb-4'>{t('valores.descricao_3')}</p>
                        <p className='mb-4'>{t('valores.descricao_4')}</p>
                        <p className='mb-4'>{t('valores.descricao_5')}</p>
                    </p>
                </article>
            </div>
        </section>
    )
}

export default MissionVisionValues