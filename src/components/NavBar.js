import React, { useState } from 'react';
import Logo from './Logo';

const NavBar = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigation('home')}>
              <Logo />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('home')}
              className={`px-3 py-2 text-sm font-medium ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Inicio
            </button>
            <button 
              onClick={() => handleNavigation('services')}
              className={`px-3 py-2 text-sm font-medium ${currentPage === 'services' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Servicios
            </button>
            <button 
              onClick={() => handleNavigation('about')}
              className={`px-3 py-2 text-sm font-medium ${currentPage === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Nosotros
            </button>
            <button 
              onClick={() => handleNavigation('contact')}
              className={`px-3 py-2 text-sm font-medium ${currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
            >
              Contacto
            </button>
            <button 
              onClick={() => handleNavigation('login')}
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button
            onClick={() => handleNavigation('home')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors w-full text-left`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavigation('services')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'services' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors w-full text-left`}
          >
            Servicios
          </button>
          <button
            onClick={() => handleNavigation('about')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors w-full text-left`}
          >
            Nosotros
          </button>
          <button
            onClick={() => handleNavigation('contact')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors w-full text-left`}
          >
            Contacto
          </button>
          <button
            onClick={() => handleNavigation('login')}
            className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors text-center"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;