package logica;

import java.io.Serializable;
import logica.Asignatura;

public class Asignaturas implements Serializable
{
	final int TAM = 10;
	
	private Asignatura arreAsignaturas [] = new Asignatura [TAM];
	private int tope = 0;
	
	public Asignaturas ()
	{
		tope = 0;		
	}
	
	public void insert (Asignatura a)
	{
		arreAsignaturas[tope] = a;
		tope++;
	}
	
	public boolean member (String clave)
	{
		boolean existe = false; 
		int i = 0;
		
		while (i < tope && !existe)
		{
			if(arreAsignaturas[i].getCodigo() == clave)
				existe = true;
			else
				i++;
		} 
		
		return existe;
	}
	
	/*Precondicion: Debe existir la asignatura*/
	public Asignatura find (String clave)
	{
		boolean encontre = false; 
		int i = 0;
		
		while (i < tope && !encontre)
		{
			if(arreAsignaturas[i].getCodigo() == clave)
				encontre = true;
			else
				i++;
		}
				
		return arreAsignaturas[i];
	}
}
