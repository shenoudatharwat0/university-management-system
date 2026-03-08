import {Component, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-academics',
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Academic & Course Management</h1>
          <p class="mt-1 text-sm text-slate-500">Manage departments, programs, courses, and timetables.</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="openModal()" class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Add Course
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-slate-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button class="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Course Catalog
          </button>
          <button class="border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Departments
          </button>
          <button class="border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Timetable Generator
          </button>
        </nav>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div class="flex flex-wrap flex-1 gap-4 w-full">
          <div class="relative flex-1 min-w-[200px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <mat-icon class="text-slate-400 text-sm">search</mat-icon>
            </div>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search courses..." 
                   class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
          </div>
          <select [(ngModel)]="filterDepartment" class="block w-40 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
            <option value="">All Departments</option>
            @for (dept of uniqueDepartments; track dept) {
              <option [value]="dept">{{dept}}</option>
            }
          </select>
          <select [(ngModel)]="filterCredits" class="block w-32 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
            <option value="">All Credits</option>
            @for (credit of uniqueCredits; track credit) {
              <option [value]="credit">{{credit}} Credits</option>
            }
          </select>
          <select [(ngModel)]="filterInstructor" class="block w-48 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 border">
            <option value="">All Instructors</option>
            @for (instructor of uniqueInstructors; track instructor) {
              <option [value]="instructor">{{instructor}}</option>
            }
          </select>
        </div>
      </div>

      <!-- Course Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (course of filteredCourses; track course.code) {
          <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
            <div class="p-5 flex-1">
              <div class="flex justify-between items-start">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 font-mono border border-indigo-100">
                  {{course.code}}
                </span>
                <span class="text-sm text-slate-500">{{course.credits}} Credits</span>
              </div>
              <h3 class="mt-3 text-lg font-semibold text-slate-900 leading-tight">{{course.title}}</h3>
              <p class="mt-2 text-sm text-slate-500 line-clamp-2">{{course.description}}</p>
              
              <div class="mt-4 pt-4 border-t border-slate-100">
                <div class="flex items-center text-sm text-slate-500">
                  <mat-icon class="text-sm mr-1.5 text-slate-400">domain</mat-icon>
                  {{course.department}}
                </div>
                @if (course.prerequisites.length > 0) {
                  <div class="mt-2 flex items-start text-sm text-slate-500">
                    <mat-icon class="text-sm mr-1.5 text-slate-400 mt-0.5">account_tree</mat-icon>
                    <span>Prereqs: <span class="font-mono text-xs">{{course.prerequisites.join(', ')}}</span></span>
                  </div>
                }
              </div>
            </div>
            <div class="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Instructor: {{course.instructor}}</span>
              <button (click)="openModal(course)" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
            </div>
          </div>
        }
      </div>

      <!-- Add Course Modal -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form (ngSubmit)="submitCourse()">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <mat-icon class="text-indigo-600">library_add</mat-icon>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                        {{ isEditMode() ? 'Edit Course' : 'Add New Course' }}
                      </h3>
                      <div class="mt-4 space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-medium text-slate-700">Course Code</label>
                            <input type="text" name="code" [(ngModel)]="newCourse.code" required placeholder="e.g. CS301" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-slate-700">Credits</label>
                            <input type="number" name="credits" [(ngModel)]="newCourse.credits" required min="1" max="6" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          </div>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Course Title</label>
                          <input type="text" name="title" [(ngModel)]="newCourse.title" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Department</label>
                          <select name="department" [(ngModel)]="newCourse.department" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Business">Business</option>
                            <option value="English">English</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Instructor</label>
                          <input type="text" name="instructor" [(ngModel)]="newCourse.instructor" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Prerequisites (comma-separated codes)</label>
                          <input type="text" name="prerequisites" [(ngModel)]="newCourse.prerequisites" placeholder="e.g. CS101, MATH101" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          @if (prerequisiteError()) {
                            <p class="mt-1 text-sm text-red-600">{{prerequisiteError()}}</p>
                          }
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-slate-700">Description</label>
                          <textarea name="description" [(ngModel)]="newCourse.description" rows="3" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Save Course
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
export class AcademicsComponent {
  isModalOpen = signal(false);
  isEditMode = signal(false);
  editingCourseCode = signal('');
  newCourse = { code: '', title: '', credits: 3, department: 'Computer Science', instructor: '', description: '', prerequisites: '' };
  prerequisiteError = signal('');

  searchQuery = '';
  filterDepartment = '';
  filterCredits = '';
  filterInstructor = '';

  courses = [
    { code: 'CS101', title: 'Introduction to Computer Science', credits: 4, department: 'Computer Science', prerequisites: [], instructor: 'Dr. Alan Turing', description: 'An introduction to computational thinking, programming, and problem solving.' },
    { code: 'CS201', title: 'Data Structures and Algorithms', credits: 4, department: 'Computer Science', prerequisites: ['CS101'], instructor: 'Dr. Grace Hopper', description: 'Study of fundamental data structures and algorithms, including lists, trees, and graphs.' },
    { code: 'MATH101', title: 'Calculus I', credits: 3, department: 'Mathematics', prerequisites: [], instructor: 'Prof. Isaac Newton', description: 'Limits, continuity, derivatives, and integrals of single-variable functions.' },
    { code: 'ENG101', title: 'Academic Writing', credits: 3, department: 'English', prerequisites: [], instructor: 'Dr. Jane Austen', description: 'Development of critical reading and writing skills for academic contexts.' },
    { code: 'PHYS201', title: 'Classical Mechanics', credits: 4, department: 'Physics', prerequisites: ['MATH101'], instructor: 'Dr. Albert Einstein', description: 'Newtonian mechanics, conservation laws, and oscillatory motion.' },
    { code: 'BUS301', title: 'Corporate Finance', credits: 3, department: 'Business', prerequisites: ['ECON101'], instructor: 'Prof. Adam Smith', description: 'Principles of corporate finance, capital budgeting, and risk management.' },
  ];

  get uniqueDepartments() {
    return [...new Set(this.courses.map(c => c.department))].sort();
  }

  get uniqueCredits() {
    return [...new Set(this.courses.map(c => c.credits))].sort((a, b) => a - b);
  }

  get uniqueInstructors() {
    return [...new Set(this.courses.map(c => c.instructor))].sort();
  }

  get filteredCourses() {
    return this.courses.filter(course => {
      const matchesSearch = !this.searchQuery || 
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        course.code.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesDept = !this.filterDepartment || course.department === this.filterDepartment;
      const matchesCredits = !this.filterCredits || course.credits.toString() === this.filterCredits.toString();
      const matchesInstructor = !this.filterInstructor || course.instructor === this.filterInstructor;

      return matchesSearch && matchesDept && matchesCredits && matchesInstructor;
    });
  }

  openModal(course?: any) {
    if (course) {
      this.isEditMode.set(true);
      this.editingCourseCode.set(course.code);
      this.newCourse = {
        code: course.code,
        title: course.title,
        credits: course.credits,
        department: course.department,
        instructor: course.instructor,
        description: course.description,
        prerequisites: course.prerequisites ? course.prerequisites.join(', ') : ''
      };
    } else {
      this.isEditMode.set(false);
      this.editingCourseCode.set('');
      this.newCourse = { code: '', title: '', credits: 3, department: 'Computer Science', instructor: '', description: '', prerequisites: '' };
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.isEditMode.set(false);
    this.editingCourseCode.set('');
    this.newCourse = { code: '', title: '', credits: 3, department: 'Computer Science', instructor: '', description: '', prerequisites: '' };
    this.prerequisiteError.set('');
  }

  submitCourse() {
    this.prerequisiteError.set('');
    let prereqs: string[] = [];
    if (this.newCourse.prerequisites.trim()) {
      prereqs = this.newCourse.prerequisites.split(',').map(p => p.trim().toUpperCase()).filter(p => p);
      const existingCodes = this.courses.map(c => c.code);
      const invalidPrereqs = prereqs.filter(p => !existingCodes.includes(p));
      
      if (invalidPrereqs.length > 0) {
        this.prerequisiteError.set(`Invalid prerequisite codes: ${invalidPrereqs.join(', ')}`);
        return;
      }
    }

    if (this.newCourse.code && this.newCourse.title && this.newCourse.instructor) {
      if (this.isEditMode()) {
        const index = this.courses.findIndex(c => c.code === this.editingCourseCode());
        if (index !== -1) {
          this.courses[index] = {
            code: this.newCourse.code.toUpperCase(),
            title: this.newCourse.title,
            credits: this.newCourse.credits,
            department: this.newCourse.department,
            prerequisites: prereqs,
            instructor: this.newCourse.instructor,
            description: this.newCourse.description
          };
        }
      } else {
        this.courses.unshift({
          code: this.newCourse.code.toUpperCase(),
          title: this.newCourse.title,
          credits: this.newCourse.credits,
          department: this.newCourse.department,
          prerequisites: prereqs,
          instructor: this.newCourse.instructor,
          description: this.newCourse.description
        });
      }
      this.closeModal();
    }
  }
}
