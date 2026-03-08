import {Component, inject, signal, effect} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {DataService} from './data.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-students',
  imports: [MatIconModule, DecimalPipe, FormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Student Lifecycle Management</h1>
          <p class="mt-1 text-sm text-slate-500">View academic trajectories, manage records, and process document requests.</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="openModal()" class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Add Student
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
            <input type="text" [(ngModel)]="searchQuery" (input)="onSearchInput()" placeholder="Search students by name or ID..." 
                   class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
            
            @if (showSuggestions() && searchSuggestions.length > 0) {
              <div class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                @for (suggestion of searchSuggestions; track suggestion.id) {
                  <div (click)="selectSuggestion(suggestion)" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 hover:text-indigo-900 text-slate-900 flex items-center">
                    <img [src]="suggestion.avatar" alt="" class="flex-shrink-0 h-6 w-6 rounded-full mr-3" referrerpolicy="no-referrer">
                    <span class="font-medium block truncate">{{suggestion.name}}</span>
                    <span class="text-slate-500 ml-2 text-xs font-mono">{{suggestion.id}}</span>
                  </div>
                }
              </div>
            }
          </div>
          <select class="block w-48 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
            <option>All Programs</option>
            <option>Computer Science</option>
            <option>Business Admin</option>
            <option>Engineering</option>
          </select>
        </div>
      </div>

      <!-- Students List -->
      <div class="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Program</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Credits</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" (click)="toggleSort()">
                  <div class="flex items-center space-x-1">
                    <span>CGPA</span>
                    @if (sortDirection === 'asc') {
                      <mat-icon class="text-[16px] leading-[16px] w-4 h-4">arrow_upward</mat-icon>
                    } @else if (sortDirection === 'desc') {
                      <mat-icon class="text-[16px] leading-[16px] w-4 h-4">arrow_downward</mat-icon>
                    } @else {
                      <mat-icon class="text-[16px] leading-[16px] w-4 h-4 text-slate-300">swap_vert</mat-icon>
                    }
                  </div>
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              @for (student of sortedStudents; track student.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                    {{student.id}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" [src]="student.avatar" alt="" referrerpolicy="no-referrer">
                      </div>
                      <div class="ml-4">
                        <a [routerLink]="['/students', student.id]" class="text-sm font-medium text-indigo-600 hover:text-indigo-900">{{student.name}}</a>
                        <div class="text-sm text-slate-500">{{student.email}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-slate-900">{{student.program}}</div>
                    <div class="text-sm text-slate-500">Year {{student.year}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div class="flex items-center">
                      <div class="w-16 bg-slate-200 rounded-full h-2 mr-2">
                        <div class="bg-indigo-600 h-2 rounded-full" [style.width]="(student.credits / 120) * 100 + '%'"></div>
                      </div>
                      <span class="font-mono text-xs">{{student.credits}}/120</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [class]="getGpaClass(student.cgpa)">
                      {{student.cgpa | number:'1.2-2'}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a [routerLink]="['/students', student.id]" class="text-indigo-600 hover:text-indigo-900 mr-3">Profile</a>
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
                Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">14,230</span> results
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

      <!-- Add Student Modal -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form (ngSubmit)="submitStudent()">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <mat-icon class="text-indigo-600">person_add</mat-icon>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                        Add New Student
                      </h3>
                      <div class="mt-4 space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Full Name</label>
                          <input type="text" name="name" [(ngModel)]="newStudent.name" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Email</label>
                          <input type="email" name="email" [(ngModel)]="newStudent.email" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Program</label>
                          <select name="program" [(ngModel)]="newStudent.program" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="B.S. Computer Science">B.S. Computer Science</option>
                            <option value="B.A. English">B.A. English</option>
                            <option value="B.S. Engineering">B.S. Engineering</option>
                            <option value="B.B.A. Finance">B.B.A. Finance</option>
                            <option value="B.S. Physics">B.S. Physics</option>
                          </select>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-slate-700">Year</label>
                            <input type="number" name="year" [(ngModel)]="newStudent.year" required min="1" max="5" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-slate-700">Initial Credits</label>
                            <input type="number" name="credits" [(ngModel)]="newStudent.credits" required min="0" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Save Student
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
export class StudentsComponent {
  dataService = inject(DataService);

  isModalOpen = signal(false);
  newStudent = { name: '', email: '', program: 'B.S. Computer Science', year: 1, credits: 0 };

  sortDirection: 'asc' | 'desc' | null = null;
  searchQuery = '';
  debouncedSearchQuery = signal('');
  private searchSubject = new Subject<string>();
  showSuggestions = signal(false);

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.debouncedSearchQuery.set(query);
      this.showSuggestions.set(query.trim().length > 0);
    });
  }

  get searchSuggestions() {
    const query = this.debouncedSearchQuery();
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return this.dataService.students().filter(s => 
      s.name.toLowerCase().includes(lowerQuery) || 
      s.id.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to 5 suggestions
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
  }

  selectSuggestion(student: any) {
    this.searchQuery = student.name;
    this.debouncedSearchQuery.set(student.name);
    this.showSuggestions.set(false);
  }

  get sortedStudents() {
    let students = this.dataService.students();
    const query = this.debouncedSearchQuery();
    
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      students = students.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.id.toLowerCase().includes(lowerQuery)
      );
    }

    if (!this.sortDirection) return students;
    return [...students].sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.cgpa - b.cgpa;
      } else {
        return b.cgpa - a.cgpa;
      }
    });
  }

  toggleSort() {
    if (this.sortDirection === null) this.sortDirection = 'desc';
    else if (this.sortDirection === 'desc') this.sortDirection = 'asc';
    else this.sortDirection = null;
  }

  getGpaClass(gpa: number): string {
    if (gpa >= 3.5) return 'bg-emerald-100 text-emerald-800';
    if (gpa >= 3.0) return 'bg-blue-100 text-blue-800';
    if (gpa >= 2.0) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.newStudent = { name: '', email: '', program: 'B.S. Computer Science', year: 1, credits: 0 };
  }

  submitStudent() {
    if (this.newStudent.name && this.newStudent.email) {
      const newId = `STU-2024-${String(this.dataService.students().length + 1).padStart(3, '0')}`;
      this.dataService.addStudent({
        id: newId,
        name: this.newStudent.name,
        email: this.newStudent.email,
        program: this.newStudent.program,
        year: this.newStudent.year,
        credits: this.newStudent.credits,
        cgpa: 0.0,
        avatar: `https://picsum.photos/seed/${this.newStudent.name.split(' ')[0]}/40/40`,
        enrolledCourses: [],
        documentRequests: [],
        completedCourses: []
      });
      this.closeModal();
    }
  }
}
