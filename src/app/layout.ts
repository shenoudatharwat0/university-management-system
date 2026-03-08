import {Component, signal} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out"
             [class.w-20]="isSidebarCollapsed()">
        
        <!-- Logo -->
        <div class="h-16 flex items-center px-4 border-b border-slate-800 shrink-0">
          <div class="w-8 h-8 rounded bg-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
            U
          </div>
          @if (!isSidebarCollapsed()) {
            <span class="ml-3 font-semibold text-white truncate text-lg tracking-tight">UMS Portal</span>
          }
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path"
               routerLinkActive="bg-indigo-600 text-white"
               class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
               [title]="isSidebarCollapsed() ? item.label : ''">
              <mat-icon class="shrink-0" [class.text-indigo-400]="false">{{item.icon}}</mat-icon>
              @if (!isSidebarCollapsed()) {
                <span class="ml-3 font-medium">{{item.label}}</span>
              }
            </a>
          }
        </nav>

        <!-- User Profile -->
        <div class="p-4 border-t border-slate-800 flex items-center shrink-0 justify-between">
          <div class="flex items-center overflow-hidden">
            <img src="https://picsum.photos/seed/admin/40/40" alt="Admin" class="w-8 h-8 rounded-full shrink-0" referrerpolicy="no-referrer">
            @if (!isSidebarCollapsed()) {
              <div class="ml-3 overflow-hidden">
                <p class="text-sm font-medium text-white truncate">System Admin</p>
                <p class="text-xs text-slate-500 truncate">admin&#64;university.edu</p>
              </div>
            }
          </div>
          @if (!isSidebarCollapsed()) {
            <button (click)="logout()" class="text-slate-400 hover:text-white transition-colors" title="Logout">
              <mat-icon class="text-sm">logout</mat-icon>
            </button>
          }
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <div class="flex items-center">
            <button (click)="toggleSidebar()" class="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <mat-icon>menu</mat-icon>
            </button>
            
            <!-- Global Search -->
            <div class="ml-4 relative hidden sm:block">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <mat-icon class="text-slate-400 text-sm">search</mat-icon>
              </div>
              <input type="text" placeholder="Search students, courses..." 
                     class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button class="p-2 text-slate-400 hover:text-slate-600 relative">
              <mat-icon>notifications</mat-icon>
              <span class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <button class="p-2 text-slate-400 hover:text-slate-600">
              <mat-icon>settings</mat-icon>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  isSidebarCollapsed = signal(false);

  navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admissions', icon: 'how_to_reg', label: 'Admissions' },
    { path: '/academics', icon: 'school', label: 'Academics' },
    { path: '/students', icon: 'people', label: 'Students' },
    { path: '/faculty', icon: 'co_present', label: 'Faculty' },
    { path: '/finance', icon: 'account_balance_wallet', label: 'Finance' },
  ];

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
