import React, { useState } from 'react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (formData) => {
    // En una aplicación real, aquí enviaríamos los datos a un servidor
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Resetear el estado después de 5 segundos
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contáctanos
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte con tus necesidades contables
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ContactForm onSubmit={handleFormSubmit} formSubmitted={formSubmitted} />
          <ContactInfo />
        </div>
      </div>
    </div>
  );
};

export default Contact;