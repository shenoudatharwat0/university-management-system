import {Component, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admissions',
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Admissions Management</h1>
          <p class="mt-1 text-sm text-slate-500">Review applications, generate merit lists, and manage enrollments.</p>
        </div>
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Generate Merit List
          </button>
          <button (click)="openModal()" class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            New Application
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex flex-1 gap-4 w-full">
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <mat-icon class="text-slate-400 text-sm">search</mat-icon>
            </div>
            <input type="text" placeholder="Search applicants..." 
                   class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
          </div>
          <select class="block w-48 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
            <option>All Programs</option>
            <option>Computer Science</option>
            <option>Business Admin</option>
            <option>Engineering</option>
          </select>
          <select class="block w-40 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
            <option>Status: All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Waitlisted</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <!-- Applicants List -->
      <div class="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Program Applied</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              @for (app of applicants; track app.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                    {{app.id}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" [src]="app.avatar" alt="" referrerpolicy="no-referrer">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-slate-900">{{app.name}}</div>
                        <div class="text-sm text-slate-500">{{app.email}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-slate-900">{{app.program}}</div>
                    <div class="text-sm text-slate-500">{{app.term}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {{app.score}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [class]="getStatusClass(app.status)">
                      {{app.status}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-indigo-600 hover:text-indigo-900 mr-3">Review</button>
                    <button class="text-slate-400 hover:text-slate-600"><mat-icon class="text-sm">more_vert</mat-icon></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-slate-700">
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  <span class="sr-only">Previous</span>
                  <mat-icon>chevron_left</mat-icon>
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-indigo-50 text-sm font-medium text-indigo-600">1</button>
                <button class="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">2</button>
                <button class="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">3</button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  <span class="sr-only">Next</span>
                  <mat-icon>chevron_right</mat-icon>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- New Application Modal -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form (ngSubmit)="submitApplication()">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <mat-icon class="text-indigo-600">person_add</mat-icon>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                        New Application
                      </h3>
                      <div class="mt-4 space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Full Name</label>
                          <input type="text" name="name" [(ngModel)]="newApp.name" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Email</label>
                          <input type="email" name="email" [(ngModel)]="newApp.email" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Program</label>
                          <select name="program" [(ngModel)]="newApp.program" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="B.S. Computer Science">B.S. Computer Science</option>
                            <option value="M.A. History">M.A. History</option>
                            <option value="B.B.A. Finance">B.B.A. Finance</option>
                            <option value="Ph.D. Physics">Ph.D. Physics</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Score</label>
                          <input type="number" name="score" [(ngModel)]="newApp.score" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Submit
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
export class AdmissionsComponent {
  isModalOpen = signal(false);
  newApp: { name: string; email: string; program: string; score: number | null } = { name: '', email: '', program: 'B.S. Computer Science', score: null };

  applicants = [
    { id: 'APP-2024-001', name: 'Liam Smith', email: 'liam.s@example.com', program: 'B.S. Computer Science', term: 'Fall 2024', score: '92.5', status: 'Pending', avatar: 'https://picsum.photos/seed/liam/40/40' },
    { id: 'APP-2024-002', name: 'Emma Johnson', email: 'emma.j@example.com', program: 'M.A. History', term: 'Fall 2024', score: '88.0', status: 'Approved', avatar: 'https://picsum.photos/seed/emma/40/40' },
    { id: 'APP-2024-003', name: 'Noah Williams', email: 'noah.w@example.com', program: 'B.B.A. Finance', term: 'Fall 2024', score: '76.5', status: 'Waitlisted', avatar: 'https://picsum.photos/seed/noah/40/40' },
    { id: 'APP-2024-004', name: 'Olivia Brown', email: 'olivia.b@example.com', program: 'Ph.D. Physics', term: 'Fall 2024', score: '95.0', status: 'Approved', avatar: 'https://picsum.photos/seed/olivia/40/40' },
    { id: 'APP-2024-005', name: 'William Jones', email: 'william.j@example.com', program: 'B.S. Engineering', term: 'Fall 2024', score: '65.0', status: 'Rejected', avatar: 'https://picsum.photos/seed/william/40/40' },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Waitlisted': return 'bg-slate-100 text-slate-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.newApp = { name: '', email: '', program: 'B.S. Computer Science', score: null };
  }

  submitApplication() {
    if (this.newApp.name && this.newApp.email && this.newApp.score) {
      const newId = `APP-2024-${String(this.applicants.length + 1).padStart(3, '0')}`;
      this.applicants.unshift({
        id: newId,
        name: this.newApp.name,
        email: this.newApp.email,
        program: this.newApp.program,
        term: 'Fall 2024',
        score: this.newApp.score.toString(),
        status: 'Pending',
        avatar: `https://picsum.photos/seed/${this.newApp.name.split(' ')[0]}/40/40`
      });
      this.closeModal();
    }
  }
}
