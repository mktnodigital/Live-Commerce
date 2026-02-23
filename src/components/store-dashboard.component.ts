
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-store-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-[1600px] mx-auto h-full flex flex-col dark:bg-neutral-900 dark:text-neutral-100 transition-colors">
      
      <!-- STORE HEADER -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div class="flex items-center gap-6">
          <div>
            <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Console de Vendas</h2>
            <div class="flex items-center gap-3 mt-1">
               <span class="text-gray-500 dark:text-neutral-400 font-medium text-sm">Boutique da Ana</span>
               <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-neutral-700"></span>
               <span class="text-green-600 font-bold text-sm">Estoque Sincronizado</span>
            </div>
          </div>
          
          <!-- TEMA TOGGLE STORE -->
          <button (click)="dataService.toggleTheme()" class="p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 shadow-sm transition-all hover:scale-110">
             @if (dataService.theme() === 'light') {
               <svg class="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
             } @else {
               <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 18v1m9-9h1M3 9h1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
             }
          </button>
        </div>

        <div class="flex bg-white dark:bg-neutral-800 p-1.5 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm overflow-x-auto max-w-full">
          <button (click)="setView('overview')" [class.bg-purple-600]="view() === 'overview'" [class.text-white]="view() === 'overview'" class="px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap">Resumo</button>
          <button (click)="setView('catalog')" [class.bg-purple-600]="view() === 'catalog'" [class.text-white]="view() === 'catalog'" class="px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap">Mix de Produtos</button>
          <button (click)="setView('whatsapp')" [class.bg-green-600]="view() === 'whatsapp'" [class.text-white]="view() === 'whatsapp'" class="px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap">WhatsApp</button>
          <button (click)="setView('live')" [class.bg-red-600]="view() === 'live'" [class.text-white]="view() === 'live'" class="px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Live Console
          </button>
        </div>
      </header>

      <!-- CONTEÚDO (EXEMPLO OVERVIEW DARK) -->
      @if (view() === 'overview') {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          <div class="bg-white dark:bg-neutral-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-neutral-700 transition-colors">
            <p class="text-[10px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">Comissão Acumulada</p>
            <h3 class="text-4xl font-black text-purple-600">R$ 1.250,50</h3>
          </div>
          <div class="bg-white dark:bg-neutral-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-neutral-700 transition-colors flex flex-col justify-between">
            <div>
              <p class="text-[10px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3">Instagram Status</p>
              <div class="flex items-center gap-2">
                @if (dataService.isInstagramConnected()) {
                  <span class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-[10px] font-black uppercase">@boutique_da_ana</span>
                } @else {
                  <span class="bg-gray-100 dark:bg-neutral-700 text-gray-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Desconectado</span>
                }
              </div>
            </div>
            <button (click)="setView('live')" class="mt-4 text-xs font-black text-blue-600 hover:underline uppercase tracking-widest text-left">Ir para o Estúdio →</button>
          </div>
        </div>
      }

      <!-- LIVE CONSOLE MODO DARK -->
      @if (view() === 'live') {
        <div class="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden min-h-[700px] animate-fade-in">
           <div class="flex-1 flex flex-col gap-6">
              <div class="flex-1 bg-black rounded-[2.5rem] relative overflow-hidden shadow-2xl border-4" [class.border-red-600]="dataService.isLiveActive()" [class.border-gray-800]="!dataService.isLiveActive()">
                 @if (dataService.isLiveActive()) {
                    <img src="https://picsum.photos/1200/800?random=stream" class="absolute inset-0 w-full h-full object-cover opacity-60">
                 } @else {
                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                       <div class="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800">
                          <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                       </div>
                    </div>
                 }
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fade-in 0.4s ease-out; }
  `]
})
export class StoreDashboardComponent {
  dataService = inject(MockDataService);
  view = this.dataService.storeView;
  myShowcase = computed(() => {
    const ids = this.dataService.storeShowcaseIds();
    return this.dataService.globalProducts().filter(p => ids.includes(p.id));
  });
  setView(view: 'overview' | 'catalog' | 'live' | 'orders' | 'commissions' | 'whatsapp') { this.dataService.storeView.set(view); }
}