import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DataService, DocumentRequest} from './data.service';

@Component({
  selector: 'app-student-profile',
  imports: [MatIconModule, DatePipe, DecimalPipe, FormsModule, RouterLink],
  template: `
    @if (student()) {
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <a routerLink="/students" class="text-slate-400 hover:text-slate-600 transition-colors">
              <mat-icon>arrow_back</mat-icon>
            </a>
            <div>
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">{{student()?.name}}</h1>
              <p class="mt-1 text-sm text-slate-500">{{student()?.id}} • {{student()?.program}}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Profile & Progress -->
          <div class="space-y-6">
            <!-- Profile Card -->
            <div class="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
              <div class="p-6 flex flex-col items-center text-center">
                <img [src]="student()?.avatar" alt="Avatar" class="w-24 h-24 rounded-full mb-4" referrerpolicy="no-referrer">
                <h2 class="text-xl font-bold text-slate-900">{{student()?.name}}</h2>
                <p class="text-sm text-slate-500 mb-4">{{student()?.email}}</p>
                <span class="px-3 py-1 rounded-full text-xs font-medium" [class]="getGpaClass(student()?.cgpa || 0)">
                  CGPA: {{student()?.cgpa | number:'1.2-2'}}
                </span>
              </div>
              <div class="border-t border-slate-100 p-4 bg-slate-50 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-xs text-slate-500 uppercase tracking-wider font-medium">Year</p>
                  <p class="text-lg font-semibold text-slate-900">{{student()?.year}}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 uppercase tracking-wider font-medium">Credits</p>
                  <p class="text-lg font-semibold text-slate-900">{{student()?.credits}}</p>
                </div>
              </div>
            </div>

            <!-- Academic Progress -->
            <div class="bg-white shadow-sm rounded-xl border border-slate-200 p-6">
              <h3 class="text-lg font-medium text-slate-900 mb-4">Academic Progress</h3>
              <div class="space-y-6">
                <!-- Degree Completion -->
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Degree Completion</span>
                    <span class="font-medium text-slate-900">{{progressPercentage() | number:'1.0-0'}}%</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2.5">
                    <div class="bg-indigo-600 h-2.5 rounded-full" [style.width.%]="progressPercentage()"></div>
                  </div>
                  <p class="text-xs text-slate-500 text-right">{{student()?.credits}} / 120 Credits</p>
                </div>
                
                <!-- Calculated GPA -->
                <div class="pt-4 border-t border-slate-100">
                  <div class="flex justify-between items-end mb-2">
                    <span class="text-sm text-slate-500">Calculated GPA</span>
                    <span class="text-2xl font-bold text-slate-900">{{calculatedGpa() | number:'1.2-2'}}</span>
                  </div>
                  
                  <!-- GPA Trend Chart -->
                  @if (gpaTrend().length > 0) {
                    <div class="mt-4">
                      <p class="text-xs text-slate-500 mb-2">GPA Trend (Cumulative)</p>
                      <div class="relative h-24 w-full border-b border-l border-slate-200">
                        <svg class="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 -10 300 120">
                          <polyline
                            fill="none"
                            stroke="#4f46e5"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            [attr.points]="chartPoints()"
                          />
                          @for (point of gpaTrend(); track point.semester; let i = $index) {
                            <circle
                              [attr.cx]="getChartX(i, gpaTrend().length)"
                              [attr.cy]="getChartY(point.gpa)"
                              r="4"
                              fill="#ffffff"
                              stroke="#4f46e5"
                              stroke-width="2"
                            >
                              <title>{{point.semester}}: {{point.gpa | number:'1.2-2'}}</title>
                            </circle>
                          }
                        </svg>
                      </div>
                      <div class="flex justify-between mt-1">
                        <span class="text-[10px] text-slate-400">{{gpaTrend()[0].semester}}</span>
                        @if (gpaTrend().length > 1) {
                          <span class="text-[10px] text-slate-400">{{gpaTrend()[gpaTrend().length - 1].semester}}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Courses & Documents -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Enrolled Courses -->
            <div class="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
              <div class="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                <h3 class="text-lg font-medium text-slate-900">Enrolled Courses</h3>
                <button (click)="isCourseModalOpen.set(true)" class="text-sm text-indigo-600 hover:text-indigo-900 font-medium flex items-center">
                  <mat-icon class="text-[18px] w-[18px] h-[18px] mr-1">add</mat-icon> Assign Course
                </button>
              </div>
              <div class="divide-y divide-slate-100">
                @for (courseCode of student()?.enrolledCourses; track courseCode) {
                  <div class="p-4 flex justify-between items-center hover:bg-slate-50">
                    <div>
                      <p class="text-sm font-medium text-slate-900">{{getCourseDetails(courseCode)?.title}}</p>
                      <p class="text-xs text-slate-500">{{courseCode}} • {{getCourseDetails(courseCode)?.credits}} Credits</p>
                    </div>
                    <button (click)="confirmRemoveCourse(courseCode)" class="text-slate-400 hover:text-red-600 transition-colors">
                      <mat-icon class="text-[20px] w-[20px] h-[20px]">remove_circle_outline</mat-icon>
                    </button>
                  </div>
                } @empty {
                  <div class="p-6 text-center text-slate-500 text-sm">
                    No courses assigned yet.
                  </div>
                }
              </div>
            </div>

            <!-- Document Requests -->
            <div class="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
              <div class="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                <h3 class="text-lg font-medium text-slate-900">Document Requests</h3>
                <button (click)="isDocModalOpen.set(true)" class="text-sm text-indigo-600 hover:text-indigo-900 font-medium flex items-center">
                  <mat-icon class="text-[18px] w-[18px] h-[18px] mr-1">post_add</mat-icon> New Request
                </button>
              </div>
              
              <!-- Document Filters -->
              <div class="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div class="flex flex-wrap gap-4 w-full">
                  <select [(ngModel)]="docFilterType" class="block w-full sm:w-48 pl-3 pr-10 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border">
                    <option value="">All Types</option>
                    <option value="Official Transcript">Official Transcript</option>
                    <option value="Degree Certificate">Degree Certificate</option>
                    <option value="Enrollment Verification">Enrollment Verification</option>
                    <option value="Letter of Recommendation">Letter of Recommendation</option>
                  </select>
                  <select [(ngModel)]="docFilterStatus" class="block w-full sm:w-40 pl-3 pr-10 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-500">From:</span>
                    <input type="date" [(ngModel)]="docFilterStartDate" class="block w-full sm:w-36 pl-3 pr-3 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border">
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-500">To:</span>
                    <input type="date" [(ngModel)]="docFilterEndDate" class="block w-full sm:w-36 pl-3 pr-3 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md border">
                  </div>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Document</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100" (click)="toggleDocSort()">
                        <div class="flex items-center space-x-1">
                          <span>Date</span>
                          @if (docSortDirection === 'desc') {
                            <mat-icon class="text-[16px] leading-[16px] w-4 h-4">arrow_downward</mat-icon>
                          } @else if (docSortDirection === 'asc') {
                            <mat-icon class="text-[16px] leading-[16px] w-4 h-4">arrow_upward</mat-icon>
                          } @else {
                            <mat-icon class="text-[16px] leading-[16px] w-4 h-4 text-slate-300">swap_vert</mat-icon>
                          }
                        </div>
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-slate-200">
                    @for (req of filteredDocumentRequests(); track req.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{req.type}}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{req.date | date:'mediumDate'}}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" [class]="getDocStatusClass(req.status)">
                            {{req.status}}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <select [ngModel]="req.status" (change)="onDocStatusChange(req, $event)" class="text-xs border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="4" class="px-6 py-4 text-center text-sm text-slate-500">No document requests found.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        <!-- Assign Course Modal -->
        @if (isCourseModalOpen()) {
          <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="isCourseModalOpen.set(false)"></div>
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-slate-900 mb-4">Assign Course</h3>
                  <select [ngModel]="selectedCourseToAdd()" (ngModelChange)="selectedCourseToAdd.set($event)" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select a course...</option>
                    @for (course of availableCourses(); track course.code) {
                      <option [value]="course.code">{{course.code}} - {{course.title}}</option>
                    }
                  </select>
                  @if (prerequisiteWarning()) {
                    <div class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                      <mat-icon class="text-amber-500 mr-2 text-sm mt-0.5">warning</mat-icon>
                      <p class="text-sm text-amber-800">{{prerequisiteWarning()}}</p>
                    </div>
                  }
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" (click)="addCourse()" [disabled]="!selectedCourseToAdd()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    Assign
                  </button>
                  <button type="button" (click)="isCourseModalOpen.set(false)" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Document Request Modal -->
        @if (isDocModalOpen()) {
          <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="isDocModalOpen.set(false)"></div>
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-slate-900 mb-4">New Document Request</h3>
                  <select [(ngModel)]="selectedDocType" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="Official Transcript">Official Transcript</option>
                    <option value="Degree Certificate">Degree Certificate</option>
                    <option value="Enrollment Verification">Enrollment Verification</option>
                    <option value="Letter of Recommendation">Letter of Recommendation</option>
                  </select>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" (click)="submitDocRequest()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Submit Request
                  </button>
                  <button type="button" (click)="isDocModalOpen.set(false)" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Remove Course Confirmation Modal -->
        @if (isRemoveCourseConfirmOpen()) {
          <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="cancelRemoveCourse()"></div>
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <mat-icon class="text-red-600">warning</mat-icon>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">Remove Course Assignment</h3>
                      <div class="mt-2">
                        <p class="text-sm text-slate-500">Are you sure you want to remove {{courseToRemove()}} from this student's enrolled courses? This action cannot be undone.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" (click)="executeRemoveCourse()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Remove Course
                  </button>
                  <button type="button" (click)="cancelRemoveCourse()" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Reject Document Confirmation Modal -->
        @if (isRejectDocConfirmOpen()) {
          <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="cancelRejectDoc()"></div>
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <mat-icon class="text-red-600">error_outline</mat-icon>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">Reject Document Request</h3>
                      <div class="mt-2">
                        <p class="text-sm text-slate-500">Are you sure you want to reject the request for "{{docToReject()?.type}}"? The student will be notified.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" (click)="executeRejectDoc()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Reject Request
                  </button>
                  <button type="button" (click)="cancelRejectDoc()" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class StudentProfileComponent implements OnInit {
  route = inject(ActivatedRoute);
  dataService = inject(DataService);
  
  studentId = signal<string | null>(null);
  
  student = computed(() => {
    const id = this.studentId();
    if (!id) return null;
    return this.dataService.getStudent(id);
  });

  progressPercentage = computed(() => {
    const s = this.student();
    if (!s) return 0;
    return Math.min(100, (s.credits / 120) * 100);
  });

  availableCourses = computed(() => {
    const s = this.student();
    if (!s) return [];
    return this.dataService.courses().filter(c => !s.enrolledCourses.includes(c.code));
  });

  isCourseModalOpen = signal(false);
  selectedCourseToAdd = signal('');
  
  prerequisiteWarning = computed(() => {
    const courseCode = this.selectedCourseToAdd();
    if (!courseCode) return '';
    
    const course = this.getCourseDetails(courseCode);
    if (!course || !course.prerequisites || course.prerequisites.length === 0) return '';
    
    const s = this.student();
    if (!s) return '';
    
    const completedCodes = s.completedCourses.map(c => c.code);
    const missingPrereqs = course.prerequisites.filter(p => !completedCodes.includes(p));
    
    if (missingPrereqs.length > 0) {
      return `Warning: Student has not completed prerequisites: ${missingPrereqs.join(', ')}`;
    }
    return '';
  });

  isDocModalOpen = signal(false);
  selectedDocType = 'Official Transcript';
  
  docFilterType = '';
  docFilterStatus = '';
  docFilterStartDate = '';
  docFilterEndDate = '';
  docSortDirection: 'asc' | 'desc' | null = 'desc';

  calculatedGpa = computed(() => {
    const s = this.student();
    if (!s || !s.completedCourses || s.completedCourses.length === 0) return s?.cgpa || 0;
    let totalPoints = 0;
    let totalCredits = 0;
    const gradePoints: Record<string, number> = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };
    for (const c of s.completedCourses) {
      if (gradePoints[c.grade] !== undefined) {
        totalPoints += gradePoints[c.grade] * c.credits;
        totalCredits += c.credits;
      }
    }
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  });

  gpaTrend = computed(() => {
    const s = this.student();
    if (!s || !s.completedCourses || s.completedCourses.length === 0) return [];
    
    const gradePoints: Record<string, number> = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };
    
    const semesterData: Record<string, { points: number, credits: number }> = {};
    for (const c of s.completedCourses) {
      if (!semesterData[c.semester]) {
        semesterData[c.semester] = { points: 0, credits: 0 };
      }
      if (gradePoints[c.grade] !== undefined) {
        semesterData[c.semester].points += gradePoints[c.grade] * c.credits;
        semesterData[c.semester].credits += c.credits;
      }
    }
    
    const sortedSemesters = Object.keys(semesterData).sort((a, b) => {
       const yearA = parseInt(a.split(' ')[1] || '0');
       const yearB = parseInt(b.split(' ')[1] || '0');
       if (yearA !== yearB) return yearA - yearB;
       const seasonOrder: Record<string, number> = { 'Spring': 1, 'Summer': 2, 'Fall': 3, 'Winter': 4 };
       const seasonA = seasonOrder[a.split(' ')[0]] || 0;
       const seasonB = seasonOrder[b.split(' ')[0]] || 0;
       return seasonA - seasonB;
    });

    let cumulativePoints = 0;
    let cumulativeCredits = 0;
    
    return sortedSemesters.map(sem => {
      cumulativePoints += semesterData[sem].points;
      cumulativeCredits += semesterData[sem].credits;
      return {
        semester: sem,
        gpa: cumulativeCredits > 0 ? cumulativePoints / cumulativeCredits : 0
      };
    });
  });

  chartPoints = computed(() => {
    const trend = this.gpaTrend();
    if (trend.length === 0) return '';
    return trend.map((t, i) => `${this.getChartX(i, trend.length)},${this.getChartY(t.gpa)}`).join(' ');
  });

  getChartX(index: number, total: number): number {
    const width = 300;
    return total > 1 ? (index * width) / (total - 1) : width / 2;
  }

  getChartY(gpa: number): number {
    const height = 100;
    const minGpa = 2.0;
    const maxGpa = 4.0;
    const y = height - ((gpa - minGpa) / (maxGpa - minGpa)) * height;
    return Math.max(0, Math.min(height, y));
  }

  filteredDocumentRequests = computed(() => {
    const s = this.student();
    if (!s) return [];
    
    let reqs = s.documentRequests;
    
    if (this.docFilterType) {
      reqs = reqs.filter(r => r.type === this.docFilterType);
    }
    
    if (this.docFilterStatus) {
      reqs = reqs.filter(r => r.status === this.docFilterStatus);
    }

    if (this.docFilterStartDate) {
      const start = new Date(this.docFilterStartDate).getTime();
      reqs = reqs.filter(r => new Date(r.date).getTime() >= start);
    }

    if (this.docFilterEndDate) {
      const end = new Date(this.docFilterEndDate).getTime();
      // Add one day to include the end date fully
      reqs = reqs.filter(r => new Date(r.date).getTime() <= end + 86400000);
    }
    
    if (this.docSortDirection) {
      reqs = [...reqs].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return this.docSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    
    return reqs;
  });

  toggleDocSort() {
    if (this.docSortDirection === null) this.docSortDirection = 'desc';
    else if (this.docSortDirection === 'desc') this.docSortDirection = 'asc';
    else this.docSortDirection = null;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.studentId.set(params.get('id'));
    });
  }

  getGpaClass(gpa: number): string {
    if (gpa >= 3.5) return 'bg-emerald-100 text-emerald-800';
    if (gpa >= 3.0) return 'bg-blue-100 text-blue-800';
    if (gpa >= 2.0) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  }

  getDocStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  getCourseDetails(code: string) {
    return this.dataService.courses().find(c => c.code === code);
  }

  addCourse() {
    const s = this.student();
    const courseCode = this.selectedCourseToAdd();
    if (s && courseCode) {
      const updated = { ...s, enrolledCourses: [...s.enrolledCourses, courseCode] };
      this.dataService.updateStudent(updated);
      this.selectedCourseToAdd.set('');
      this.isCourseModalOpen.set(false);
    }
  }

  // Remove Course Confirmation
  isRemoveCourseConfirmOpen = signal(false);
  courseToRemove = signal('');

  confirmRemoveCourse(code: string) {
    this.courseToRemove.set(code);
    this.isRemoveCourseConfirmOpen.set(true);
  }

  executeRemoveCourse() {
    const code = this.courseToRemove();
    if (code) {
      this.removeCourse(code);
    }
    this.isRemoveCourseConfirmOpen.set(false);
    this.courseToRemove.set('');
  }

  cancelRemoveCourse() {
    this.isRemoveCourseConfirmOpen.set(false);
    this.courseToRemove.set('');
  }

  removeCourse(code: string) {
    const s = this.student();
    if (s) {
      const updated = { ...s, enrolledCourses: s.enrolledCourses.filter(c => c !== code) };
      this.dataService.updateStudent(updated);
    }
  }

  submitDocRequest() {
    const s = this.student();
    if (s) {
      const newReq: DocumentRequest = {
        id: `REQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        type: this.selectedDocType,
        date: new Date(),
        status: 'Pending'
      };
      const updated = { ...s, documentRequests: [newReq, ...s.documentRequests] };
      this.dataService.updateStudent(updated);
      this.isDocModalOpen.set(false);
    }
  }

  // Reject Document Confirmation
  isRejectDocConfirmOpen = signal(false);
  docToReject = signal<DocumentRequest | null>(null);
  
  onDocStatusChange(req: DocumentRequest, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;
    
    if (newStatus === 'Rejected') {
      // Revert the select visually until confirmed
      select.value = req.status;
      this.docToReject.set(req);
      this.isRejectDocConfirmOpen.set(true);
    } else {
      this.updateDocStatus(req, newStatus);
    }
  }

  executeRejectDoc() {
    const req = this.docToReject();
    if (req) {
      this.updateDocStatus(req, 'Rejected');
    }
    this.isRejectDocConfirmOpen.set(false);
    this.docToReject.set(null);
  }

  cancelRejectDoc() {
    this.isRejectDocConfirmOpen.set(false);
    this.docToReject.set(null);
  }

  updateDocStatus(req: DocumentRequest, newStatus: any) {
    const s = this.student();
    if (s) {
      const updatedReqs = s.documentRequests.map(r => r.id === req.id ? { ...r, status: newStatus } : r);
      const updated = { ...s, documentRequests: updatedReqs };
      this.dataService.updateStudent(updated);
    }
  }
}
