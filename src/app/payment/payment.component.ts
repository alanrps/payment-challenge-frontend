import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgFor, NgIf } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { environment } from '../environment/environment';

@Component({
  selector: 'payment',
  imports: [
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatOptionModule,
    MatSelectModule
  ],
  providers: [FormBuilder],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  paymentForm: FormGroup;
  errorMessage: string = '';

  registeredCustomer: Boolean = false;
  selectedPaymentMethod: string = ''; 
  billingTypes = [
    { value: 'BOLETO', label: 'Boleto' },
    { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
    { value: 'PIX', label: 'Pix' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.paymentForm = this.fb.group({
      cpfCnpj: ['', [Validators.required]],
      billingType: ['', Validators.required],
      value: [null, [Validators.required, Validators.min(0.01)]],
      dueDate: ['', Validators.required],
      daysAfterDueDateToRegistrationCancellation: [null],
      installmentCount: [null, [Validators.max(32)]],
      description: [null],
    });
  }

  async paymentProcess() {
    const apiUrl = `${environment.apiUrl}/payments`;
    
    this.http.post(apiUrl, this.paymentForm.value).subscribe(
      response => {
        const data = response as PaymentResponseDto;
        window.open(data.invoiceUrl, '_blank');
        this.errorMessage = ''; 
        this.paymentForm.reset();
      },
      error => {
        console.error('Erro ao processar pagamento:', error);
        const errorMsg = error.error.errors?.[0]?.description || error.error?.message || error.message || 'Erro no processamento do pagamento';
        this.errorMessage = errorMsg;
      }
    );
  }

  submitPayment() {
    if (this.paymentForm.valid) {
      this.paymentProcess();
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }
}
