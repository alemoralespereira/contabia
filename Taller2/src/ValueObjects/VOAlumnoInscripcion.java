package ValueObjects;

public class VOAlumnoInscripcion extends VOAlumnoBase {

	private String domicilio;
	private int telefono;
	
	public VOAlumnoInscripcion(int ced, String nom, String ape, String dom, int tel)
	{
		super(ced, nom, ape);
		domicilio = dom;
		telefono = tel;
	}
	
	public String getDomicilio()
	{
		return domicilio;
	}
	
	public int getTelefono()
	{
		return telefono;
	}
	
	
	
	
}
