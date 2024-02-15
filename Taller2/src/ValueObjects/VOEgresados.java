package ValueObjects;

public class VOEgresados extends VOAlumnoBase{

	private float promedioTotal;
	private float promedioAprobaciones;
	
	public VOEgresados(int ced, String nom, String ape, float ptot, float papr)
	{
		super(ced, nom, ape);
		promedioTotal = ptot;
		promedioAprobaciones = papr;
		
		
	}
	
	public float getPromedioTotal() {
		
		return promedioTotal;
	}
	
	public float getAprobaciones() {
		
		return promedioAprobaciones;
	}
	
	
}
