
import { Component, inject, signal, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MockDataService, Product, Store, Order, AdminTab, CashFlowEntry, Gateway, LogisticsProvider } from '../services/mock-data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:p-10 max-w-[1750px] mx-auto min-h-screen space-y-10 animate-fade-in pb-20 dark:bg-slate-950 dark:text-slate-100">
      
      <!-- HEADER ESTRATÉGICO -->
      <header class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div class="space-y-1">
          <div class="flex items-center gap-4">
            <h2 class="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{{ getActiveTabLabel() }}</h2>
            <span class="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-blue-100">Master Core</span>
            
            <!-- TEMA TOGGLE ADMIN -->
            <button (click)="dataService.toggleTheme()" class="ml-4 p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:scale-110">
               @if (dataService.theme() === 'light') {
                 <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
               } @else {
                 <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 18v1m9-9h1M3 9h1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
               }
            </button>
          </div>
          <p class="text-gray-400 dark:text-slate-500 font-medium flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Operando em: livesaas-master.hostgator.com.br
          </p>
        </div>
        
        <div class="flex flex-wrap items-center gap-4">
           <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
              <div class="text-right">
                 <p class="text-[9px] font-black text-gray-400 uppercase leading-none">Saldo Global</p>
                 <p class="text-lg font-black text-gray-900 dark:text-white">R$ {{ totalBalance() | number:'1.2-2' }}</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
           </div>
        </div>
      </header>

      <!-- CONTEÚDO ADMIN (REMANESCENTE) -->
      @if (dataService.adminView() === 'finance') {
        <div class="space-y-10 animate-fade-in">
           <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <section class="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-8 transition-colors">
                 <div class="flex justify-between items-center">
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white">Extrato Consolidado</h3>
                    <button (click)="openCashModal()" class="text-xs font-black text-blue-600 uppercase hover:underline">+ Lançamento</button>
                 </div>
                 <div class="space-y-4">
                    @for (entry of dataService.cashFlow(); track entry.id) {
                       <div class="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all">
                          <div class="flex items-center gap-4">
                             <div [class]="entry.type === 'in' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'" class="w-12 h-12 rounded-2xl flex items-center justify-center">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   @if (entry.type === 'in') { <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/> }
                                   @else { <path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/> }
                                </svg>
                             </div>
                             <div>
                                <p class="text-sm font-black text-gray-900 dark:text-white">{{ entry.description }}</p>
                                <p class="text-[10px] text-gray-400 dark:text-slate-500 font-bold">{{ entry.date }}</p>
                             </div>
                          </div>
                          <p class="text-lg font-black" [class]="entry.type === 'in' ? 'text-green-600' : 'text-red-600'">
                             {{ entry.type === 'in' ? '+' : '-' }} R$ {{ entry.amount | number:'1.2-2' }}
                          </p>
                       </div>
                    }
                 </div>
              </section>

              <section class="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-10 transition-colors">
                 <div class="flex justify-between items-center">
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white">Meios de Pagamento</h3>
                    <button (click)="openGatewayModal()" class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest">+ Novo Gateway</button>
                 </div>
                 
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    @for (gw of dataService.gateways(); track gw.id) {
                       <div class="p-8 rounded-[2.5rem] border-2 flex flex-col justify-between h-64 transition-all relative group" [class]="gw.status === 'active' ? 'border-blue-600 bg-blue-50/10 dark:bg-blue-900/10' : 'border-gray-100 dark:border-slate-800 bg-gray-50/20'">
                          <div class="flex justify-between items-start">
                             <div class="w-12 h-12 bg-gray-900 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl">GW</div>
                             <div (click)="dataService.toggleGateway(gw.id)" [class]="gw.status === 'active' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700'" class="w-12 h-6 rounded-full relative cursor-pointer transition-all">
                                <div [class.translate-x-6]="gw.status === 'active'" class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"></div>
                             </div>
                          </div>
                          <div>
                             <p class="text-xl font-black text-gray-900 dark:text-white">{{ gw.name }}</p>
                             <p class="text-[10px] text-gray-400 dark:text-slate-500 font-mono truncate tracking-widest uppercase mt-1">Status: {{ gw.status === 'active' ? 'EM OPERAÇÃO' : 'PAUSADO' }}</p>
                          </div>
                          <p class="text-[9px] font-black text-gray-500 font-mono truncate border-t border-gray-100 dark:border-slate-800 pt-4 mt-2">API KEY: {{ gw.apiKey }}</p>
                       </div>
                    }
                 </div>
              </section>
           </div>
        </div>
      }

      <!-- DASHBOARD KPI -->
      @if (dataService.adminView() === 'dashboard') {
         <div class="space-y-10 animate-fade-in">
           <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div class="bg-gray-900 dark:bg-slate-800 text-white p-10 rounded-[3.5rem] border-none shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px]">
                 <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest">Receita Total (GMV)</p>
                 <h4 class="text-4xl font-black tracking-tighter">R$ {{ totalSalesVolume() | number:'1.2-2' }}</h4>
              </div>
              <div class="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px]">
                <p class="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Comissões Pagas</p>
                <h4 class="text-4xl font-black text-blue-600 tracking-tighter">R$ {{ totalCommissions() | number:'1.2-2' }}</h4>
              </div>
              <div class="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px]">
                <p class="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Lojas Operando</p>
                <h4 class="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{{ dataService.stores().length }}</h4>
              </div>
              <div class="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px]">
                <p class="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Conversão Média</p>
                <h4 class="text-4xl font-black text-purple-600 tracking-tighter">4.8%</h4>
              </div>
           </div>
           <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
                 <h5 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-10">Performance por Representante</h5>
                 <div #chartContainer class="w-full h-[350px]"></div>
              </div>
           </div>
        </div>
      }

      <!-- MODALS -->
      @if (showGatewayModal()) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-[3rem] p-10 w-full max-w-lg shadow-2xl scale-in">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Configurar Gateway</h3>
            <form [formGroup]="gatewayForm" (ngSubmit)="saveGateway()" class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nome do Provedor</label>
                <input type="text" formControlName="name" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none p-4 rounded-2xl text-sm font-medium transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">API Key de Produção</label>
                <input type="text" formControlName="apiKey" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none p-4 rounded-2xl text-sm font-mono transition-all">
              </div>
              <div class="flex gap-4 pt-4">
                <button type="button" (click)="showGatewayModal.set(false)" class="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancelar</button>
                <button type="submit" [disabled]="gatewayForm.invalid" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50">Salvar Gateway</button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (showCashModal()) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div class="bg-white dark:bg-slate-900 rounded-[3rem] p-10 w-full max-w-lg shadow-2xl scale-in">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Novo Lançamento</h3>
            <form [formGroup]="cashForm" (ngSubmit)="saveCashEntry()" class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <button type="button" (click)="cashForm.patchValue({type: 'in'})" [class.bg-green-600]="cashForm.get('type')?.value === 'in'" [class.text-white]="cashForm.get('type')?.value === 'in'" class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-transparent bg-slate-50 dark:bg-slate-800 transition-all">Entrada</button>
                <button type="button" (click)="cashForm.patchValue({type: 'out'})" [class.bg-red-600]="cashForm.get('type')?.value === 'out'" [class.text-white]="cashForm.get('type')?.value === 'out'" class="py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-transparent bg-slate-50 dark:bg-slate-800 transition-all">Saída</button>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Valor (R$)</label>
                <input type="number" formControlName="amount" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none p-4 rounded-2xl text-sm font-black transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Descrição</label>
                <input type="text" formControlName="description" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none p-4 rounded-2xl text-sm font-medium transition-all">
              </div>
              <div class="flex gap-4 pt-4">
                <button type="button" (click)="showCashModal.set(false)" class="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancelar</button>
                <button type="submit" [disabled]="cashForm.invalid" class="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  dataService = inject(MockDataService);
  totalCommissions = computed(() => this.dataService.orders().reduce((acc, curr) => acc + curr.commission, 0));
  totalSalesVolume = computed(() => this.dataService.orders().reduce((acc, curr) => acc + curr.total, 0));
  totalBalance = computed(() => this.dataService.cashFlow().reduce((acc, curr) => curr.type === 'in' ? acc + curr.amount : acc - curr.amount, 0));
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  showGatewayModal = signal(false);
  showCashModal = signal(false);

  gatewayForm = this.fb.group({
    name: ['', [Validators.required]],
    apiKey: ['', [Validators.required]],
    status: ['active' as 'active' | 'inactive']
  });

  cashForm = this.fb.group({
    type: ['in' as 'in' | 'out', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      if (this.dataService.adminView() === 'dashboard') {
        setTimeout(() => this.renderChart(), 300);
      }
    });
  }

  ngAfterViewInit() { this.renderChart(); }

  getActiveTabLabel(): string {
    const labels: Record<AdminTab, string> = {
      dashboard: 'Dashboard Global', stores: 'Representantes', inventory: 'Estoque Central',
      sales: 'Vendas Atribuídas', finance: 'Fluxo Financeiro', settings: 'Configurações SaaS',
      reports: 'Relatórios Master', logistics: 'Matriz Logística'
    };
    return labels[this.dataService.adminView()] || 'Admin Center';
  }

  openGatewayModal() {
    this.gatewayForm.reset({ status: 'active' });
    this.showGatewayModal.set(true);
  }

  saveGateway() {
    if (this.gatewayForm.invalid) return;
    const val = this.gatewayForm.value as any;
    this.dataService.addGateway(val);
    this.showGatewayModal.set(false);
  }

  openCashModal() {
    this.cashForm.reset({ type: 'in', amount: 0 });
    this.showCashModal.set(true);
  }

  saveCashEntry() {
    if (this.cashForm.invalid) return;
    const val = this.cashForm.value as any;
    this.dataService.addCashEntry(val);
    this.showCashModal.set(false);
  }

  renderChart() {
    if (!this.chartContainer || this.dataService.adminView() !== 'dashboard') return;
    const data = this.dataService.stores().map(s => ({ name: s.name, value: s.total_earned }));
    const margin = { top: 40, right: 30, bottom: 60, left: 70 };
    const width = this.chartContainer.nativeElement.offsetWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    const svg = d3.select(this.chartContainer.nativeElement).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3.scaleBand().range([0, width]).domain(data.map(d => d.name)).padding(0.4);
    const y = d3.scaleLinear().domain([0, (d3.max(data, d => d.value) || 1000) * 1.3]).range([height, 0]);
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x)).selectAll('text').style('font-size', '10px').style('font-weight', '700').style('fill', '#94a3b8');
    svg.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d => `R$${d}`)).style('font-size', '10px').style('font-weight', '700').style('fill', '#94a3b8');
    svg.selectAll('bar').data(data).enter().append('rect').attr('x', d => x(d.name) || 0).attr('width', x.bandwidth()).attr('y', height).attr('height', 0).attr('rx', 16).attr('fill', '#2563eb').transition().duration(1200).ease(d3.easeElasticOut).attr('y', d => y(d.value)).attr('height', d => Math.max(0, height - y(d.value)));
  }
}
