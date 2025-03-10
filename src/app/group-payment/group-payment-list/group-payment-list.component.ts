import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupPaymentDTO } from '../../DTO/group-payment-dto';
import { GroupPaymentService } from '../../services/group-payment.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router'; // Para navegar a otra ruta
// ...

@Component({
  selector: 'app-group-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './group-payment-list.component.html',
  styleUrls: ['./group-payment-list.component.css']
})
export class GroupPaymentListComponent implements OnInit {
  displayedColumns: string[] = [
    'paymentIdentifier',
    'serviceType',
    'totalAmount',
    'paymentDate',
    'paymentMethod',
    'status',
    'actions'
  ];
  groupPayments: GroupPaymentDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private groupPaymentService: GroupPaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroupPayments();
  }

  loadGroupPayments(): void {
    this.groupPaymentService.getAllGroupPayments().subscribe({
      next: (data: GroupPaymentDTO[]) => {
        this.groupPayments = data;
      },
      error: (err) => {
        console.error('Error al cargar los pagos grupales', err);
      }
    });
  }

  // Método para ver detalles: podrías navegar a un componente de detalle
  viewDetails(payment: GroupPaymentDTO): void {
    // Navega a la ruta de detalle, pasando el ID
    this.router.navigate([`/group-payments/detail`, payment.id]);
  }

  // Método para editar: navega a la ruta de edición
  editPayment(payment: GroupPaymentDTO): void {
    // Asumiendo que la ruta "/edit-group-payment/:id" ya está configurada
    this.router.navigate([`/edit-group-payment`, payment.id]);
  }
}
