import {Component, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-finance',
  imports: [MatIconModule, CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Financial Management</h1>
          <p class="mt-1 text-sm text-slate-500">Manage fee structures, process payments, and generate reports.</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="openModal()" class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Generate Invoices
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                  <mat-icon>account_balance</mat-icon>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-slate-500 truncate">Total Collected</dt>
                  <dd>
                    <div class="text-2xl font-semibold text-slate-900">$4.2M</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-lg bg-amber-100 text-amber-600">
                  <mat-icon>pending</mat-icon>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-slate-500 truncate">Outstanding Receivables</dt>
                  <dd>
                    <div class="text-2xl font-semibold text-slate-900">$850K</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <mat-icon>receipt_long</mat-icon>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-slate-500 truncate">Invoices Generated</dt>
                  <dd>
                    <div class="text-2xl font-semibold text-slate-900">14,230</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-lg leading-6 font-medium text-slate-900">Recent Transactions</h3>
          <button class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              @for (tx of transactions; track tx.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                    {{tx.id}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-900">{{tx.studentName}}</div>
                    <div class="text-sm text-slate-500">{{tx.studentId}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {{tx.amount | currency}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {{tx.date | date:'mediumDate'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [class]="getStatusClass(tx.status)">
                      {{tx.status}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex items-center">
                    <mat-icon class="text-sm mr-1.5 text-slate-400">{{getMethodIcon(tx.method)}}</mat-icon>
                    {{tx.method}}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Generate Invoice Modal -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form (ngSubmit)="submitInvoice()">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <mat-icon class="text-indigo-600">receipt_long</mat-icon>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                        Generate Invoice
                      </h3>
                      <div class="mt-4 space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Student Name</label>
                          <input type="text" name="studentName" [(ngModel)]="newInvoice.studentName" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Amount ($)</label>
                          <input type="number" name="amount" [(ngModel)]="newInvoice.amount" required min="1" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Payment Method</label>
                          <select name="method" [(ngModel)]="newInvoice.method" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="Credit Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Stripe">Stripe</option>
                            <option value="PayPal">PayPal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Generate
                  </button>
                  <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class FinanceComponent {
  isModalOpen = signal(false);
  newInvoice = { studentName: '', amount: 0, method: 'Credit Card' };

  transactions = [
    { id: 'TXN-001234', studentName: 'Alice Smith', studentId: 'STU-2021-001', amount: 4500, date: new Date('2023-10-24T10:30:00'), status: 'Completed', method: 'Credit Card' },
    { id: 'TXN-001235', studentName: 'Bob Johnson', studentId: 'STU-2022-045', amount: 3200, date: new Date('2023-10-24T11:15:00'), status: 'Pending', method: 'Bank Transfer' },
    { id: 'TXN-001236', studentName: 'Charlie Davis', studentId: 'STU-2020-112', amount: 4500, date: new Date('2023-10-23T14:20:00'), status: 'Completed', method: 'Stripe' },
    { id: 'TXN-001237', studentName: 'Diana Miller', studentId: 'STU-2023-089', amount: 1500, date: new Date('2023-10-23T09:45:00'), status: 'Failed', method: 'Credit Card' },
    { id: 'TXN-001238', studentName: 'Evan Wilson', studentId: 'STU-2021-204', amount: 4500, date: new Date('2023-10-22T16:00:00'), status: 'Completed', method: 'PayPal' },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  getMethodIcon(method: string): string {
    switch (method) {
      case 'Credit Card': return 'credit_card';
      case 'Bank Transfer': return 'account_balance';
      case 'Stripe': return 'payment';
      case 'PayPal': return 'account_balance_wallet';
      default: return 'payment';
    }
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.newInvoice = { studentName: '', amount: 0, method: 'Credit Card' };
  }

  submitInvoice() {
    if (this.newInvoice.studentName && this.newInvoice.amount > 0) {
      const newId = `TXN-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
      this.transactions.unshift({
        id: newId,
        studentName: this.newInvoice.studentName,
        studentId: 'STU-NEW',
        amount: this.newInvoice.amount,
        date: new Date(),
        status: 'Pending',
        method: this.newInvoice.method
      });
      this.closeModal();
    }
  }
}
