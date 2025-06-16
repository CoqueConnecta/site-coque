import { useTranslation } from 'react-i18next';
import './Banner.css'

const Banner = () => {
  const { t } = useTranslation();
    return (
        <section
            className="mt-6 h-120 initial-banner mr-4 ml-4 md:mr-12 md:ml-12 flex items-center"
            aria-label="Banner institucional"
        >
            <div className="text-left banner-content w-full">
                <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-2" tabIndex={0}>
                    {t('banner.conectando')}
                </h1>
                <h2 className="text-2xl md:text-6xl font-bold leading-tight mb-2" tabIndex={0}>
                    {t('banner.pessoas')}
                </h2>
                <h2 className="text-2xl md:text-6xl font-bold leading-tight mb-4" tabIndex={0}>
                    {t('banner.horizontes')}
                </h2>
                <a
                    href="#projects"
                    className="btn-primary h-12 px-6 text-base md:text-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    role="button"
                    tabIndex={0}
                    aria-label="Conheça nossos projetos"
                >
                    {t('banner.conheca_projetos')}
                </a>
            </div>
        </section>
    )
}

export default Banner