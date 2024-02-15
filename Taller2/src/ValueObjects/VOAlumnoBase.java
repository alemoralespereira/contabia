package ValueObjects;

public class VOAlumnoBase {
	
	private int cedula;
	private String nombre;
	private String apellido;
	
	public VOAlumnoBase(int ced, String nom, String ape)
	{
		cedula = ced;
		nombre = nom;
		apellido = ape;
	}
	
	public int getCedula()
	{
		return cedula;
	}
	
	public String getNombre()
	{
		return nombre;
	}
	
	public String getApellido()
	{
		return apellido;
	}
	
	public String getTipoAlumno() {
		
		return this.getClass().getSimpleName();
	}
	

}
