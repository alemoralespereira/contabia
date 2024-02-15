package ValueObjects;

public class VOAlumnoDetalle extends VOAlumnoInscripcion{
	
	private int asignaturasAprobadas;
	
	public VOAlumnoDetalle(int ced, String nom, String ape, String dom, int tel, int asig)
	{
		super(ced, nom, ape, dom, tel);
		asignaturasAprobadas = asig; 
	}
	
	public int getAsignaturasAprobadas()
	{
		return asignaturasAprobadas;
		
	}

}
