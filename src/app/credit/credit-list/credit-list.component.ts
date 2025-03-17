import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule
import { CreditService } from '../../services/credit.service';
import { Credit } from '../../models/credit.model';
import { CustomApiResponse } from '../../models/custom-api-response.model';



@Component({
  selector: 'app-credit-list',
  standalone: true,
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.css'],
  imports: [CommonModule, MatCardModule], // Agrega MatCardModule aquí
})
export class CreditListComponent implements OnInit {
  credits: Credit[] = [];

  constructor(private creditService: CreditService) {}

  ngOnInit(): void {
    this.loadCredits();
  }

  loadCredits(): void {
    const clientId = 17; // Cambia esto según el cliente que desees cargar
    console.log('Cargando créditos para el cliente:', clientId); // Verifica que se esté llamando este método
  
    this.creditService.getCreditsByClient(clientId).subscribe({
      next: (response: CustomApiResponse<Credit[]>) => {
        console.log('Créditos cargados:', response.data); // Verifica los datos recibidos
        this.credits = response.data; // Accede a response.data
      },
      error: (err) => {
        console.error('Error al cargar créditos:', err); // Verifica si hay errores
      },
    });
  }
}