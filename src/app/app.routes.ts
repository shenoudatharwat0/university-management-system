import {Routes} from '@angular/router';
import {LayoutComponent} from './layout';
import {DashboardComponent} from './dashboard';
import {AdmissionsComponent} from './admissions';
import {AcademicsComponent} from './academics';
import {StudentsComponent} from './students';
import {FacultyComponent} from './faculty';
import {FinanceComponent} from './finance';
import {LoginComponent} from './login';
import {StudentProfileComponent} from './student-profile';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admissions', component: AdmissionsComponent },
      { path: 'academics', component: AcademicsComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'students/:id', component: StudentProfileComponent },
      { path: 'faculty', component: FacultyComponent },
      { path: 'finance', component: FinanceComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
