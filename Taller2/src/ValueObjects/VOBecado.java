package ValueObjects;

public class VOBecado extends VOAlumnoDetalle{
	
	private int descuento;
	private String descripcion;
	
	public VOBecado (int ced, String nom, String ape, String dom, int tel, int asig, int descu, String descr)
	{
		super(ced, nom, ape, dom, tel, asig);
		descuento = descu;
		descripcion = descr;
		
	}
	
	public int getDescuento() {
		
		return descuento;
	}
	
	public String descripcion() {
		
		return descripcion;
	}

}
