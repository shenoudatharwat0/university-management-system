import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Export Report
          </button>
          <button class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            New Registration
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        @for (stat of stats; track stat.name) {
          <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="p-3 rounded-lg" [class]="stat.bgColor">
                    <mat-icon [class]="stat.iconColor">{{stat.icon}}</mat-icon>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-slate-500 truncate">{{stat.name}}</dt>
                    <dd>
                      <div class="text-2xl font-semibold text-slate-900">{{stat.value}}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <div class="text-sm">
                <span class="font-medium" [class]="stat.trendUp ? 'text-emerald-600' : 'text-red-600'">
                  <mat-icon class="text-sm align-middle">{{stat.trendUp ? 'trending_up' : 'trending_down'}}</mat-icon>
                  {{stat.trend}}
                </span>
                <span class="text-slate-500 ml-2">vs last month</span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activities -->
        <div class="lg:col-span-2 bg-white shadow-sm rounded-xl border border-slate-200">
          <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-slate-900">Recent Applications</h3>
            <button class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Program</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                @for (app of recentApplications; track app.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
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
                      <div class="text-sm text-slate-500">{{app.department}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                            [class]="getStatusClass(app.status)">
                        {{app.status}}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {{app.date}}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Actions / Alerts -->
        <div class="bg-white shadow-sm rounded-xl border border-slate-200">
          <div class="px-6 py-5 border-b border-slate-200">
            <h3 class="text-lg leading-6 font-medium text-slate-900">System Alerts</h3>
          </div>
          <div class="p-6 space-y-4">
            @for (alert of alerts; track alert.id) {
              <div class="flex items-start p-4 rounded-lg border" [class]="alert.borderClass">
                <div class="flex-shrink-0">
                  <mat-icon [class]="alert.iconClass">{{alert.icon}}</mat-icon>
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="text-sm font-medium text-slate-900">{{alert.title}}</p>
                  <p class="mt-1 text-sm text-slate-500">{{alert.message}}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  stats = [
    { name: 'Total Students', value: '14,230', icon: 'groups', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600', trend: '12%', trendUp: true },
    { name: 'Active Courses', value: '842', icon: 'menu_book', bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600', trend: '4%', trendUp: true },
    { name: 'Pending Applications', value: '1,429', icon: 'pending_actions', bgColor: 'bg-amber-100', iconColor: 'text-amber-600', trend: '2.5%', trendUp: false },
    { name: 'Revenue (YTD)', value: '$12.4M', icon: 'payments', bgColor: 'bg-blue-100', iconColor: 'text-blue-600', trend: '8.2%', trendUp: true },
  ];

  recentApplications = [
    { id: 1, name: 'Jane Cooper', email: 'jane.cooper@example.com', program: 'B.S. Computer Science', department: 'Engineering', status: 'Approved', date: 'Oct 24, 2023', avatar: 'https://picsum.photos/seed/jane/40/40' },
    { id: 2, name: 'Cody Fisher', email: 'cody.fisher@example.com', program: 'M.A. History', department: 'Arts', status: 'Pending', date: 'Oct 24, 2023', avatar: 'https://picsum.photos/seed/cody/40/40' },
    { id: 3, name: 'Esther Howard', email: 'esther.howard@example.com', program: 'B.B.A. Finance', department: 'Business', status: 'Waitlisted', date: 'Oct 23, 2023', avatar: 'https://picsum.photos/seed/esther/40/40' },
    { id: 4, name: 'Jenny Wilson', email: 'jenny.wilson@example.com', program: 'Ph.D. Physics', department: 'Science', status: 'Approved', date: 'Oct 22, 2023', avatar: 'https://picsum.photos/seed/jenny/40/40' },
  ];

  alerts = [
    { id: 1, title: 'Course Registration Opens', message: 'Spring 2024 registration begins in 2 days.', icon: 'event', borderClass: 'border-blue-200 bg-blue-50', iconClass: 'text-blue-500' },
    { id: 2, title: 'Server Maintenance', message: 'Scheduled downtime on Sunday 2 AM - 4 AM.', icon: 'build', borderClass: 'border-amber-200 bg-amber-50', iconClass: 'text-amber-500' },
    { id: 3, title: 'Payment Gateway Issue', message: 'Resolved: Stripe integration is fully operational.', icon: 'check_circle', borderClass: 'border-emerald-200 bg-emerald-50', iconClass: 'text-emerald-500' },
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
}
