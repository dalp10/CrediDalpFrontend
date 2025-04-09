import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CreditService } from '../../services/credit.service';
import { Credit } from '../../models/credit.model';
import { CustomApiResponse } from '../../models/custom-api-response.model';

@Component({
  selector: 'app-credit-list',
  standalone: true,
  templateUrl: './credit-list.component.html',
  styleUrls: ['./credit-list.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class CreditListComponent implements OnInit {
  credits: Credit[] = [];

  constructor(
    private creditService: CreditService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const clientId = Number(params.get('clientId'));
      if (clientId) {
        this.loadCredits(clientId);
      }
    });
  }

  loadCredits(clientId: number): void {
    this.creditService.getCreditsByClient(clientId).subscribe({
      next: (response: CustomApiResponse<Credit[]>) => {
        this.credits = response.data;
      },
      error: (err) => {
        console.error('Error al cargar créditos:', err);
      },
    });
  }

  // 🚧 Opcionales: conecta estos con tus rutas reales si quieres
  verDetalles(creditId: number): void {
    this.router.navigate(['/credits', creditId, 'details']);
  }

  verCuotas(creditId: number): void {
    this.router.navigate(['/credits', creditId, 'installments']);
  }
}
