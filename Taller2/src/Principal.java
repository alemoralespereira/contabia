import logica.Asignatura;
import logica.Asignaturas;

public class Principal 
{
	public static void main (String [] args)
	{
		Asignatura a = new Asignatura ("A1","Matematica","Curso de matematica");
		Asignatura b = new Asignatura ("A2","Programacion","Curso de programacion");
		Asignatura c = new Asignatura ("A2","Programacion","Curso de programacion");
		Asignatura d = new Asignatura ("A3","BD","Curso de BD");
		
		Asignaturas arre = new Asignaturas();

		
		arre.insert(a);
		d = arre.find("A1");
		d.printAsignatura();
		arre.insert(d);
		
		if (arre.member(d.getCodigo()))
				System.out.println("Existe asignatura");
		
	}
}
