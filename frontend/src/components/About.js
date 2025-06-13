import React from 'react';
import TeamMember from './TeamMember';

const About = () => {
  const teamMembers = [
    {
      name: "María Rodríguez",
      role: "Contadora Principal",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Con más de 15 años de experiencia en contabilidad y finanzas, María lidera nuestro equipo de profesionales."
    },
    {
      name: "Carlos Fernández",
      role: "Asesor Fiscal",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Especialista en derecho tributario con amplia experiencia en asesoramiento fiscal para empresas de todos los tamaños."
    },
    {
      name: "Laura Méndez",
      role: "Consultora Empresarial",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Experta en análisis financiero y planificación estratégica para el crecimiento y desarrollo de negocios."
    }
  ];

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Sobre Nosotros
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Somos un equipo de profesionales comprometidos con el éxito de tu empresa
          </p>
        </div>

        <div className="mt-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-500">
              En Contabia, nos dedicamos a proporcionar servicios contables y financieros de alta calidad para empresas y emprendedores en Uruguay. Fundada en 2010, nuestra firma ha crecido gracias a la confianza de nuestros clientes y a nuestro compromiso con la excelencia profesional.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              Nuestro enfoque se basa en entender las necesidades específicas de cada cliente para ofrecer soluciones personalizadas que contribuyan al crecimiento y éxito de su negocio.
            </p>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Nuestro Equipo
            </h3>
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <TeamMember
                  key={index}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  bio={member.bio}
                />
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Nuestra Misión
            </h3>
            <p className="text-lg text-gray-500 text-center">
              Nuestra misión es proporcionar servicios contables y financieros de excelencia que permitan a nuestros clientes tomar decisiones informadas y estratégicas para el crecimiento sostenible de sus negocios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;