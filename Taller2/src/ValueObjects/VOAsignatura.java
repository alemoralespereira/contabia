package ValueObjects;

public class VOAsignatura {
	
	private String codigo;
	private String nombre;
	private String descripcion;
	
	public VOAsignatura(String cod, String nom, String des) {
		
		codigo = cod;
		nombre = nom;
		descripcion = des;
		
	}
	
	public String getCodigo() {
		
		return codigo;
	}
	
	public String getNombre() {
		
		return nombre;
	}
	
	public String getDescripcion() {
		
		return descripcion;
	}

}
