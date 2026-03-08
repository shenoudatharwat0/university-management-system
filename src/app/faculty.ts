import {Component, inject, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {DataService} from './data.service';

@Component({
  selector: 'app-faculty',
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Faculty & Examination</h1>
          <p class="mt-1 text-sm text-slate-500">Manage attendance, submit grades, and view teaching schedules.</p>
        </div>
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Record Attendance
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center hover:border-indigo-300 cursor-pointer transition-colors group" (click)="openProfileModal()">
          <div class="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            <mat-icon>person</mat-icon>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-slate-900">My Profile</h3>
            <p class="text-xs text-slate-500">View detailed profile</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center hover:border-emerald-300 cursor-pointer transition-colors group">
          <div class="p-3 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
            <mat-icon>how_to_reg</mat-icon>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-slate-900">Daily Attendance</h3>
            <p class="text-xs text-slate-500">Mark today's classes</p>
          </div>
        </div>
        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center hover:border-blue-300 cursor-pointer transition-colors group">
          <div class="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
            <mat-icon>assignment</mat-icon>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-slate-900">Assignments</h3>
            <p class="text-xs text-slate-500">Review submissions</p>
          </div>
        </div>
      </div>

      <!-- Teaching Load -->
      <div class="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
        <h3 class="text-lg leading-6 font-medium text-slate-900 mb-4">Current Teaching Load</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-light text-indigo-600">{{classes.length}}</span>
            <span class="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Active Courses</span>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-light text-emerald-600">{{totalCredits}}</span>
            <span class="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Total Credits</span>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-light text-blue-600">{{totalStudents}}</span>
            <span class="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Enrolled Students</span>
          </div>
        </div>
      </div>

      <!-- My Classes -->
      <div class="bg-white shadow-sm rounded-xl border border-slate-200">
        <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-lg leading-6 font-medium text-slate-900">My Current Classes</h3>
        </div>
        <div class="divide-y divide-slate-200">
          @for (cls of classes; track cls.code) {
            <div class="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors">
              <div class="flex items-start">
                <div class="p-3 rounded-lg bg-slate-100 text-slate-600 hidden sm:block">
                  <mat-icon>class</mat-icon>
                </div>
                <div class="sm:ml-4">
                  <div class="flex items-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 font-mono border border-slate-200 mr-2">
                      {{cls.code}}
                    </span>
                    <h4 class="text-base font-semibold text-slate-900">{{cls.title}}</h4>
                  </div>
                  <div class="mt-1 flex items-center text-sm text-slate-500 space-x-4">
                    <span class="flex items-center"><mat-icon class="text-sm mr-1">schedule</mat-icon> {{cls.time}}</span>
                    <span class="flex items-center"><mat-icon class="text-sm mr-1">room</mat-icon> {{cls.room}}</span>
                    <span class="flex items-center"><mat-icon class="text-sm mr-1">groups</mat-icon> {{cls.students}} Students</span>
                  </div>
                </div>
              </div>
              <div class="mt-4 sm:mt-0 flex space-x-3">
                <button class="px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors">
                  Attendance
                </button>
                <button (click)="openGradeModal(cls)" class="px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors">
                  Grades
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Grade Submission Modal -->
      @if (isGradeModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeGradeModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <mat-icon class="text-indigo-600">grading</mat-icon>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                      Submit Grades: {{selectedCourse?.code}}
                    </h3>
                    <p class="text-sm text-slate-500 mb-4">{{selectedCourse?.title}}</p>
                    
                    <div class="mt-4 overflow-x-auto border border-slate-200 rounded-lg">
                      <table class="min-w-full divide-y divide-slate-200">
                        <thead class="bg-slate-50">
                          <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-slate-200">
                          @for (student of courseStudents; track student.id) {
                            <tr>
                              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{{student.id}}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{student.name}}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <select [(ngModel)]="studentGrades[student.id]" class="block w-24 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
                                  <option value="">--</option>
                                  <option value="A">A</option>
                                  <option value="A-">A-</option>
                                  <option value="B+">B+</option>
                                  <option value="B">B</option>
                                  <option value="B-">B-</option>
                                  <option value="C+">C+</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="F">F</option>
                                </select>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" (click)="confirmSubmitGrades()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Submit Grades
                </button>
                <button type="button" (click)="saveDraft()" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Save Draft
                </button>
                <button type="button" (click)="closeGradeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-transparent text-base font-medium text-slate-500 hover:text-slate-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Submit Grades Confirmation Modal -->
      @if (isSubmitConfirmOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="cancelSubmitGrades()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                    <mat-icon class="text-amber-600">warning</mat-icon>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">Confirm Grade Submission</h3>
                    <div class="mt-2">
                      <p class="text-sm text-slate-500">Are you sure you want to submit these grades? Once submitted, grades cannot be changed without administrative approval.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" (click)="executeSubmitGrades()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Confirm Submission
                </button>
                <button type="button" (click)="cancelSubmitGrades()" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Instructor Profile Modal -->
      @if (isProfileModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeProfileModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-center">
                    <img [src]="instructorProfile.avatar" alt="Avatar" class="w-16 h-16 rounded-full mr-4" referrerpolicy="no-referrer">
                    <div>
                      <h3 class="text-xl font-bold text-slate-900">{{instructorProfile.name}}</h3>
                      <p class="text-sm text-slate-500">{{instructorProfile.title}} • {{instructorProfile.department}}</p>
                    </div>
                  </div>
                  <button (click)="closeProfileModal()" class="text-slate-400 hover:text-slate-500">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
                
                <div class="mt-6 space-y-6">
                  <div>
                    <h4 class="text-sm font-medium text-slate-900 uppercase tracking-wider mb-2">Biography</h4>
                    <p class="text-sm text-slate-600 leading-relaxed">{{instructorProfile.bio}}</p>
                  </div>
                  
                  <div>
                    <h4 class="text-sm font-medium text-slate-900 uppercase tracking-wider mb-2">Research Interests</h4>
                    <div class="flex flex-wrap gap-2">
                      @for (interest of instructorProfile.researchInterests; track interest) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {{interest}}
                        </span>
                      }
                    </div>
                  </div>
                  
                  <div>
                    <h4 class="text-sm font-medium text-slate-900 uppercase tracking-wider mb-2">Courses Taught</h4>
                    <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                      <ul class="divide-y divide-slate-200">
                        @for (course of classes; track course.code) {
                          <li class="px-4 py-3 flex justify-between items-center">
                            <div>
                              <p class="text-sm font-medium text-slate-900">{{course.title}}</p>
                              <p class="text-xs text-slate-500">{{course.code}} • {{course.credits}} Credits</p>
                            </div>
                            <span class="text-xs text-slate-500">{{course.time}}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" (click)="closeProfileModal()" class="w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class FacultyComponent {
  dataService = inject(DataService);

  classes = [
    { code: 'CS101', title: 'Introduction to Computer Science', time: 'Mon, Wed 10:00 AM', room: 'Room 301', students: 45, credits: 4 },
    { code: 'CS201', title: 'Data Structures and Algorithms', time: 'Tue, Thu 1:00 PM', room: 'Lab 4', students: 30, credits: 4 },
    { code: 'CS450', title: 'Machine Learning', time: 'Fri 9:00 AM', room: 'Room 205', students: 25, credits: 3 },
  ];

  get totalCredits() {
    return this.classes.reduce((sum, cls) => sum + cls.credits, 0);
  }

  get totalStudents() {
    return this.classes.reduce((sum, cls) => sum + cls.students, 0);
  }

  isGradeModalOpen = signal(false);
  isSubmitConfirmOpen = signal(false);
  isProfileModalOpen = signal(false);
  selectedCourse: any = null;
  courseStudents: any[] = [];
  studentGrades: {[key: string]: string} = {};

  instructorProfile = {
    name: 'Dr. Alan Turing',
    title: 'Professor',
    department: 'Computer Science',
    bio: 'Dr. Turing is a pioneer in theoretical computer science and artificial intelligence. He has been teaching at the university for over 15 years, focusing on algorithms, computation theory, and machine learning.',
    researchInterests: ['Artificial Intelligence', 'Cryptography', 'Computational Biology', 'Machine Learning'],
    avatar: 'https://picsum.photos/seed/turing/150/150'
  };

  openProfileModal() {
    this.isProfileModalOpen.set(true);
  }

  closeProfileModal() {
    this.isProfileModalOpen.set(false);
  }

  openGradeModal(cls: any) {
    this.selectedCourse = cls;
    // Mock getting students for this course
    this.courseStudents = this.dataService.students().filter(s => s.enrolledCourses.includes(cls.code));
    if (this.courseStudents.length === 0) {
      // Add some dummy students if none are enrolled
      this.courseStudents = this.dataService.students().slice(0, 3);
    }
    
    // Initialize grades
    this.studentGrades = {};
    this.courseStudents.forEach(s => {
      this.studentGrades[s.id] = '';
    });
    
    this.isGradeModalOpen.set(true);
  }

  closeGradeModal() {
    this.isGradeModalOpen.set(false);
    this.selectedCourse = null;
    this.courseStudents = [];
    this.studentGrades = {};
  }

  saveDraft() {
    // In a real app, save to backend
    alert('Grades saved as draft.');
    this.closeGradeModal();
  }

  confirmSubmitGrades() {
    this.isSubmitConfirmOpen.set(true);
  }

  cancelSubmitGrades() {
    this.isSubmitConfirmOpen.set(false);
  }

  executeSubmitGrades() {
    // In a real app, submit to backend
    alert('Grades submitted successfully.');
    this.isSubmitConfirmOpen.set(false);
    this.closeGradeModal();
  }
}
