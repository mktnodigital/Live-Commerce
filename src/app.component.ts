
import { Component, signal, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CurrentView } from './components/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { StoreDashboardComponent } from './components/store-dashboard.component';
import { ProductPortalComponent } from './components/product-portal.component';
import { ArchitectureViewerComponent } from './components/architecture-viewer.component';
import { CheckoutComponent } from './components/checkout.component';
import { MockDataService } from './services/mock-data.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    LoginComponent, 
    AdminDashboardComponent, 
    StoreDashboardComponent, 
    ProductPortalComponent,
    ArchitectureViewerComponent,
    CheckoutComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
@if (currentView() === 'login') {
  <app-login (roleSelected)="handleRoleSelection($event)"></app-login>
} @else if (currentView() === 'portal') {
  <div class="relative">
    <app-product-portal 
      (goToCheckout)="currentView.set('checkout')"
      (requestLogin)="currentView.set('login')"
    ></app-product-portal>
    @if (dataService.isLoggedIn()) {
      <button (click)="logout()" class="fixed top-4 right-4 lg:right-48 z-[110] bg-red-600/10 backdrop-blur-md text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-600/20">Sair</button>
    }
  </div>
} @else if (currentView() === 'checkout') {
  <app-checkout (backToPortal)="currentView.set('portal')"></app-checkout>
} @else if (currentView() === 'docs') {
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors">
    <nav class="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-8 py-4 flex justify-between items-center transition-colors">
      <span class="font-black text-xl tracking-tighter dark:text-zinc-100">Blueprint <span class="text-blue-600">Técnico</span></span>
      <button (click)="logout()" class="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase hover:text-gray-900 dark:hover:text-zinc-100 transition-colors tracking-widest">Sair</button>
    </nav>
    <app-architecture-viewer></app-architecture-viewer>
  </div>
} @else {
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors">
    <!-- Sidebar -->
    <aside class="w-72 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 hidden md:flex flex-col z-10 shadow-sm transition-colors">
      <div class="h-24 flex items-center px-8">
        <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <span class="font-black text-2xl tracking-tighter text-gray-900 dark:text-zinc-100">Live<span class="text-blue-600">SaaS</span></span>
      </div>
      
      <nav class="flex-1 px-6 space-y-1 overflow-y-auto custom-scroll">
        @if (currentView() === 'admin') {
          <div class="py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest px-2">Master Control</div>
          
          <button (click)="dataService.adminView.set('dashboard')" 
            [class]="dataService.adminView() === 'dashboard' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800'"
            class="w-full text-left px-4 py-3 rounded-2xl text-sm font-black transition-all">
             Dashboard Global
          </button>

          <button (click)="dataService.adminView.set('stores')" 
            [class]="dataService.adminView() === 'stores' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800'"
            class="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all">
             Representantes
          </button>

          <button (click)="dataService.adminView.set('finance')" 
            [class]="dataService.adminView() === 'finance' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800'"
            class="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all">
             Fluxo Financeiro
          </button>
        } @else if (currentView() === 'store') {
          <div class="py-4 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest px-2">Operação Loja</div>
          
          <button (click)="dataService.storeView.set('overview')" 
            [class]="dataService.storeView() === 'overview' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800'"
            class="w-full text-left px-4 py-3 rounded-2xl text-sm font-black transition-all">
             Minha Central
          </button>

          <button (click)="dataService.storeView.set('live')" 
            [class]="dataService.storeView() === 'live' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-gray-500 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800'"
            class="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Estúdio Live
          </button>
        }
      </nav>

      <div class="p-8">
        <button (click)="logout()" class="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-zinc-800 text-white dark:text-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-zinc-700 transition-all shadow-xl">
          Encerrar Sessão
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto relative bg-[#fcfcfd] dark:bg-zinc-950 transition-colors">
      @if (currentView() === 'admin') {
        <app-admin-dashboard></app-admin-dashboard>
      }
      @if (currentView() === 'store') {
        <app-store-dashboard></app-store-dashboard>
      }
    </main>
  </div>
}
`
})
export class AppComponent {
  dataService = inject(MockDataService);
  
  // Alterado para 'portal' como entrada principal obrigatória
  currentView = signal<CurrentView>('portal');
  
  handleRoleSelection(view: CurrentView) {
    this.currentView.set(view);
    if (view === 'store') {
      this.dataService.storeView.set('overview');
    }
  }

  logout() {
    this.dataService.logout();
    this.currentView.set('portal');
  }

  goToLogin() {
    this.currentView.set('login');
  }
}
