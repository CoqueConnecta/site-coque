import { useState } from 'react';
import coqueLogo from '../../assets/coque-logo-vertical.png';
import { useTranslation } from 'react-i18next';


const Header = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav
        className='relative flex flex-col md:grid md:grid-cols-6 items-center md:mr-12 md:ml-12 py-4'
        aria-label='Navegação principal'
      >
        <div className='mb-4 md:mb-0 md:col-span-2 flex justify-center md:justify-start w-full'>
          <a href='/' tabIndex={0} aria-label='Página inicial'>
            <img src={coqueLogo} className='w-20 h-auto' alt='Logo Coque' />
          </a>
          {/* Botão hamburguer visível só no mobile */}
          <button
            className='md:hidden ml-auto p-2'
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span
              className={`block w-6 h-0.5 bg-gray-800 mb-1 transition-transform duration-300
                                ${open ? 'rotate-45 translate-y-2' : ''}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 mb-1 transition-all duration-300
                                ${open ? 'opacity-0' : ''}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300
                                ${open ? '-rotate-45 -translate-y-2' : ''}`}
            ></span>
          </button>
        </div>
        {/* Links: escondidos no mobile, visíveis se open=true */}
        <div
          className={`
                        flex-col md:flex-row md:col-span-4 w-full justify-between
                        ${open ? 'flex' : 'hidden'} md:flex
                        bg-white md:bg-transparent absolute md:static top-20 left-0 md:top-auto md:left-auto z-10
                        shadow md:shadow-none p-4 md:p-0
                    `}
        >
          <a
            href='#who-we-are'
            className='btn-secundary h-10 flex items-center justify-center mb-2 md:mb-0 md:mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            tabIndex={0}
            role='button'
          >
            {t('header.quem_somos')}
          </a>
          <a
            href='#projects'
            className='btn-secundary h-10 flex items-center justify-center mb-2 md:mb-0 md:mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            tabIndex={0}
            role='button'
          >
            {t('header.nossos_projetos')}
          </a>
          <a
            href='#contacts'
            className='btn-secundary h-10 flex items-center justify-center mb-2 md:mb-0 md:mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            tabIndex={0}
            role='button'
          >
            {t('header.contatos')}
          </a>
          <a
            href='#want-help'
            className='btn-primary h-10 flex items-center justify-center md:ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500'
            tabIndex={0}
            role='button'
          >
            {t('header.quero_ajudar')}
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
