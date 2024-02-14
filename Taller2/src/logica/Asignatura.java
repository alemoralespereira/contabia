package logica;

import java.io.Serializable;

public class Asignatura implements Serializable
{
	private static final long serialVersionUID = 1L;
	private String codigo;
	private String nombre;
	private String descripcion;

	public Asignatura (String cod, String nom, String desc)
	{
		codigo = cod;
		nombre = nom;
		descripcion = desc;
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
		
	public void printAsignatura()
	{
		System.out.println("Datos de la asignatura: " + this.codigo + this.nombre);
	}
	
}
