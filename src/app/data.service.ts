import { Injectable, signal } from '@angular/core';

export interface DocumentRequest {
  id: string;
  type: string;
  date: Date;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
}

export interface CompletedCourse {
  code: string;
  grade: string;
  semester: string;
  credits: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  credits: number;
  cgpa: number;
  avatar: string;
  enrolledCourses: string[];
  documentRequests: DocumentRequest[];
  completedCourses: CompletedCourse[];
}

export interface Course {
  code: string;
  title: string;
  credits: number;
  department: string;
  prerequisites: string[];
  instructor: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  students = signal<Student[]>([
    { id: 'STU-2021-001', name: 'Alice Smith', email: 'alice.s@student.edu', program: 'B.S. Computer Science', year: 3, credits: 85, cgpa: 3.8, avatar: 'https://picsum.photos/seed/alice/40/40', enrolledCourses: ['CS101', 'CS201'], documentRequests: [{ id: 'REQ-001', type: 'Official Transcript', date: new Date('2023-10-20'), status: 'Completed' }], completedCourses: [{ code: 'MATH101', grade: 'A', semester: 'Fall 2021', credits: 4 }] },
    { id: 'STU-2022-045', name: 'Bob Johnson', email: 'bob.j@student.edu', program: 'B.A. English', year: 2, credits: 45, cgpa: 3.2, avatar: 'https://picsum.photos/seed/bob/40/40', enrolledCourses: [], documentRequests: [], completedCourses: [] },
    { id: 'STU-2023-112', name: 'Charlie Davis', email: 'charlie.d@student.edu', program: 'B.S. Engineering', year: 1, credits: 15, cgpa: 2.9, avatar: 'https://picsum.photos/seed/charlie/40/40', enrolledCourses: [], documentRequests: [], completedCourses: [] },
    { id: 'STU-2020-089', name: 'Diana Prince', email: 'diana.p@student.edu', program: 'B.B.A. Finance', year: 4, credits: 110, cgpa: 3.9, avatar: 'https://picsum.photos/seed/diana/40/40', enrolledCourses: [], documentRequests: [], completedCourses: [] },
    { id: 'STU-2021-034', name: 'Evan Wright', email: 'evan.w@student.edu', program: 'B.S. Physics', year: 3, credits: 78, cgpa: 2.5, avatar: 'https://picsum.photos/seed/evan/40/40', enrolledCourses: [], documentRequests: [], completedCourses: [] },
  ]);

  courses = signal<Course[]>([
    { code: 'CS101', title: 'Introduction to Computer Science', credits: 4, department: 'Computer Science', prerequisites: [], instructor: 'Dr. Alan Turing', description: 'An introduction to computational thinking, programming, and problem solving.' },
    { code: 'CS201', title: 'Data Structures and Algorithms', credits: 4, department: 'Computer Science', prerequisites: ['CS101'], instructor: 'Dr. Grace Hopper', description: 'Study of fundamental data structures and algorithms, including lists, trees, and graphs.' },
    { code: 'MATH101', title: 'Calculus I', credits: 4, department: 'Mathematics', prerequisites: [], instructor: 'Dr. Isaac Newton', description: 'Limits, derivatives, and integrals of functions of a single variable.' },
    { code: 'PHYS201', title: 'Classical Mechanics', credits: 4, department: 'Physics', prerequisites: ['MATH101'], instructor: 'Dr. Albert Einstein', description: 'Newtonian mechanics, conservation laws, and oscillatory motion.' },
    { code: 'BUS301', title: 'Corporate Finance', credits: 3, department: 'Business', prerequisites: ['ECON101'], instructor: 'Prof. Adam Smith', description: 'Principles of corporate finance, capital budgeting, and risk management.' },
  ]);

  getStudent(id: string) {
    return this.students().find(s => s.id === id);
  }

  addStudent(student: Student) {
    this.students.update(s => [student, ...s]);
  }

  updateStudent(student: Student) {
    this.students.update(s => s.map(st => st.id === student.id ? student : st));
  }
}
