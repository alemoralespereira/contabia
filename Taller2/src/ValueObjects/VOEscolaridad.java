package ValueObjects;

public class VOEscolaridad {
	
	private String numero;
	private String nombre;
	private int anio;
	private int calificacion;
	private int monto;
	
	public VOEscolaridad(String num, String nom, int ani, int cal, int mon)
	{
		numero = num;
		nombre = nom;
		anio = ani;
		calificacion = cal;
		monto = mon;

	}
	
	public String getNumero(){
		
		return numero;
	}
	
	public String getNombre() {
		
		return nombre;
	}
	
	public int getAnio() {
		
		return anio;
	}

	public int getCalificacion() {
		
		return calificacion;
	}
	
	public int getMonto() {
		
		return monto;
	}
	
}
