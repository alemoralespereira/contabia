import React from 'react';
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Juan Pérez",
      company: "Tecnología Innovadora S.A.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      quote: "Contabia ha sido un socio invaluable para nuestra empresa. Su asesoramiento nos ha permitido optimizar nuestra estructura fiscal y mejorar nuestros procesos contables."
    },
    {
      name: "Ana Gómez",
      company: "Café del Sur",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      quote: "Como emprendedora, contar con el apoyo de Contabia ha sido fundamental para el crecimiento de mi negocio. Su equipo siempre está disponible para resolver mis dudas."
    },
    {
      name: "Roberto Silva",
      company: "Constructora Horizonte",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      quote: "Trabajamos con Contabia desde hace más de 5 años y su profesionalismo y conocimiento del sector de la construcción nos ha ayudado a navegar los complejos aspectos fiscales de nuestra industria."
    }
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Empresas y emprendedores que confían en nuestros servicios
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              company={testimonial.company}
              image={testimonial.image}
              quote={testimonial.quote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;