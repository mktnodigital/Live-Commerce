
import { Component, inject, signal, computed, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Store, Product } from '../services/mock-data.service';

@Component({
  selector: 'app-product-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col font-sans text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      
      <!-- 1. HEADER / MENU -->
      <nav class="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-[100] h-20 flex items-center justify-center px-6">
        <div class="max-w-7xl w-full flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer group" (click)="goHome()">
            <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span class="text-2xl font-black tracking-tighter">Live<span class="text-blue-600">SaaS</span></span>
          </div>

          <div class="hidden md:flex flex-1 max-w-xl mx-12">
            <div class="relative w-full group">
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                placeholder="Buscar produtos, lojas ou lives..." 
                class="w-full bg-gray-100 dark:bg-zinc-800 border-2 border-transparent py-3 px-12 rounded-2xl outline-none text-sm font-medium focus:bg-white dark:focus:bg-zinc-700 focus:border-blue-500 dark:text-zinc-100 transition-all shadow-inner"
              >
              <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>

          <div class="flex items-center gap-4 sm:gap-6">
             <button (click)="dataService.toggleTheme()" class="p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-all">
                @if (dataService.theme() === 'light') {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                } @else {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 18v1m9-9h1M3 9h1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                }
             </button>

             <button (click)="goToCheckout.emit()" class="relative p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all group">
                <svg class="w-8 h-8 text-gray-800 dark:text-zinc-200 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                @if (dataService.cartCount() > 0) {
                  <span class="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full font-black animate-bounce shadow-lg ring-2 ring-white dark:ring-zinc-900">
                    {{ dataService.cartCount() }}
                  </span>
                }
             </button>

             @if (dataService.isLoggedIn()) {
               <div class="flex items-center gap-3 group relative cursor-pointer" (click)="requestLogin.emit()">
                 <div class="hidden lg:block text-right">
                    <p class="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-tighter leading-none">Minha Conta</p>
                    <p class="text-xs font-bold dark:text-zinc-100">{{ dataService.currentUser()?.name }}</p>
                 </div>
                 <div class="w-11 h-11 rounded-[1.2rem] overflow-hidden border-2 border-blue-500/20 dark:border-blue-900/50 shadow-sm hover:scale-105 transition-transform relative">
                    <img [src]="dataService.currentUser()?.avatar" class="w-full h-full object-cover">
                 </div>
               </div>
             } @else {
               <button (click)="requestLogin.emit()" class="flex items-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-zinc-200 dark:shadow-none">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                  <span>Entrar</span>
               </button>
             }
          </div>
        </div>
      </nav>

      <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-20">
        
        <!-- 2. LIVES ONLINE (STORIES) -->
        <section>
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Canais ao Vivo Agora</h3>
            <button class="text-xs font-bold text-blue-600 hover:underline transition-all">Explorar todas as Lives</button>
          </div>
          <div class="flex gap-8 overflow-x-auto no-scrollbar py-2">
            @for (store of dataService.stores(); track store.id) {
              @let isLive = store.id === 1 && dataService.isLiveActive();
              <div class="flex flex-col items-center gap-4 shrink-0 cursor-pointer group">
                <div class="relative p-1 rounded-[2.2rem] transition-all group-hover:scale-105" 
                  [class.bg-gradient-to-tr]="isLive"
                  [class.from-red-600]="isLive"
                  [class.to-orange-500]="isLive"
                  [class.bg-gray-200]="!isLive"
                  [class.dark:bg-zinc-800]="!isLive">
                  <div class="w-24 h-24 rounded-[2rem] overflow-hidden border-[6px] border-white dark:border-zinc-900 shadow-xl">
                    <img [src]="store.avatar" class="w-full h-full object-cover">
                  </div>
                  @if (isLive) {
                    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-2xl uppercase tracking-tighter animate-pulse">LIVE</div>
                  }
                </div>
                <span class="text-xs font-black text-gray-700 dark:text-zinc-300 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{{ store.name }}</span>
              </div>
            }
          </div>
        </section>

        <!-- 3. DESTAQUES (LOJAS E PRODUTOS) -->
        <section class="animate-fade-in">
          <div class="flex items-center gap-6 mb-10">
            <h2 class="text-4xl font-black tracking-tighter">Destaques <span class="text-blue-600">Premium</span></h2>
            <div class="h-[2px] flex-1 bg-gray-100 dark:bg-zinc-800"></div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Lojas em Destaque (Coluna Lateral) -->
            <div class="lg:col-span-1 space-y-6">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Principais Lojas</p>
              @for (store of featuredStores(); track store.id) {
                <div class="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                  <img [src]="store.avatar" class="w-14 h-14 rounded-2xl object-cover shadow-sm">
                  <div class="flex-1">
                    <h4 class="text-sm font-black group-hover:text-blue-600 transition-colors">{{ store.name }}</h4>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{{ store.followers | number }} Seguidores</p>
                  </div>
                </div>
              }
            </div>
            
            <!-- Produtos em Destaque (Grid Principal) -->
            <div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
              @for (prod of featuredProducts(); track prod.id) {
                <ng-container *ngTemplateOutlet="productCard; context: { $implicit: prod, type: 'featured' }"></ng-container>
              }
            </div>
          </div>
        </section>

        <!-- 4. FAVORITOS (CASO LOGADO) -->
        @if (savedProducts().length > 0) {
          <section class="animate-fade-in">
            <div class="flex items-center gap-6 mb-10">
              <h2 class="text-3xl font-black tracking-tighter">Seus <span class="text-purple-600">Favoritos</span></h2>
              <div class="h-[2px] flex-1 bg-gray-100 dark:bg-zinc-800"></div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              @for (prod of savedProducts(); track prod.id) {
                <ng-container *ngTemplateOutlet="smallProductCard; context: { $implicit: prod }"></ng-container>
              }
            </div>
          </section>
        }

        <!-- 5. MAIS VENDIDOS -->
        <section class="animate-fade-in">
          <div class="flex items-center gap-6 mb-10">
            <h2 class="text-3xl font-black tracking-tighter">Mais <span class="text-green-600">Vendidos</span></h2>
            <div class="h-[2px] flex-1 bg-gray-100 dark:bg-zinc-800"></div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            @for (prod of bestSellers(); track prod.id) {
              <ng-container *ngTemplateOutlet="smallProductCard; context: { $implicit: prod }"></ng-container>
            }
          </div>
        </section>

        <!-- 6. SUGESTÕES PARA VOCÊ -->
        <section class="animate-fade-in pb-10">
          <div class="flex items-center gap-6 mb-10">
            <h2 class="text-3xl font-black tracking-tighter">Sugestões <span class="text-blue-500">Para Você</span></h2>
            <div class="h-[2px] flex-1 bg-gray-100 dark:bg-zinc-800"></div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            @for (prod of suggestedProducts(); track prod.id) {
              <div (click)="buyProduct(prod.id)" class="group cursor-pointer">
                <div class="aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-800 mb-3 relative">
                  <img [src]="prod.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase">Ver Detalhes</span>
                  </div>
                </div>
                <h5 class="text-[10px] font-black uppercase tracking-tighter text-gray-500 truncate">{{ prod.name }}</h5>
                <p class="text-sm font-black text-blue-600">R$ {{ prod.live_price | number:'1.2-2' }}</p>
              </div>
            }
          </div>
        </section>

      </main>

      <!-- 7. RODAPÉ INSTITUCIONAL -->
      <footer class="bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 pt-20 transition-colors">
         <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div class="space-y-6">
               <div class="flex items-center gap-3">
                 <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 </div>
                 <span class="text-2xl font-black tracking-tighter">Live<span class="text-blue-600">SaaS</span></span>
               </div>
               <p class="text-gray-400 dark:text-zinc-500 text-sm leading-relaxed font-medium">A plataforma definitiva para Live Commerce integrada ao seu e-commerce.</p>
            </div>
            
            <div class="space-y-6">
               <h4 class="text-xs font-black uppercase tracking-widest">Loja</h4>
               <ul class="space-y-4 text-sm text-gray-500 font-medium">
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Todos os Produtos</li>
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Novidades</li>
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Mais Procurados</li>
               </ul>
            </div>

            <div class="space-y-6">
               <h4 class="text-xs font-black uppercase tracking-widest">Suporte</h4>
               <ul class="space-y-4 text-sm text-gray-500 font-medium">
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Central de Ajuda</li>
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Trocas e Devoluções</li>
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Rastreio de Pedido</li>
               </ul>
            </div>

            <div class="space-y-6">
               <h4 class="text-xs font-black uppercase tracking-widest">Políticas</h4>
               <ul class="space-y-4 text-sm text-gray-500 font-medium">
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Termos de Uso</li>
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Política de Privacidade</li>
                  <li class="hover:text-blue-600 cursor-pointer transition-colors">Cookies</li>
               </ul>
            </div>
         </div>
         
         <div class="border-t border-gray-100 dark:border-zinc-800 py-10 text-center">
            <p class="text-[10px] text-gray-400 font-black uppercase tracking-[0.5em]">© 2025 LiveSaaS Cloud Ecosystem. Todos os direitos reservados.</p>
         </div>
      </footer>

      <!-- 8. COOKIE POPUP (VIVID COLORS) -->
      @if (!cookiesAccepted()) {
        <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[95%] max-w-2xl animate-slide-up">
           <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-1.5 rounded-[2.5rem] shadow-2xl shadow-blue-500/20">
              <div class="bg-white dark:bg-zinc-900 rounded-[2.2rem] p-8 flex flex-col md:flex-row items-center gap-6">
                 <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shrink-0">
                    <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.598 11.064c-1.11 0-1.99.89-1.99 2 0 1.11.89 2 2 2 .42 0 .8-.13 1.12-.35.31.22.69.35 1.11.35 1.11 0 2-.89 2-2 0-1.11-.89-2-2-2-.42 0-.8.13-1.12.35-.32-.22-.7-.35-1.12-.35zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.28-.24-2.5-.68-3.61l-1.39.46c.45.99.71 2.08.71 3.23 0 4.41-3.59 8-8 8s-8-3.59-8-8 3.59-8 8-8c.63 0 1.24.08 1.83.22l.46-1.39C13.8 2.22 12.92 2 12 2zm-1 6H9v2h2V8zm4 0h-2v2h2V8zm-2 4h-2v2h2v-2zm-4 0H7v2h2v-2zm8 0h-2v2h2v-2z"/></svg>
                 </div>
                 <div class="flex-1 text-center md:text-left">
                    <p class="text-gray-900 dark:text-zinc-100 font-black text-xl tracking-tighter">Sua Privacidade Importa</p>
                    <p class="text-gray-400 dark:text-zinc-500 text-sm font-medium">Utilizamos cookies para personalizar sua experiência de Live Commerce e marketing.</p>
                 </div>
                 <div class="flex gap-3 w-full md:w-auto">
                    <button (click)="acceptCookies()" class="flex-1 md:flex-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Aceitar Tudo</button>
                 </div>
              </div>
           </div>
        </div>
      }

      <!-- TEMPLATES DE CARDS -->
      <ng-template #productCard let-prod let-type="type">
        <article class="bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-zinc-800 group hover:shadow-2xl transition-all duration-700">
          <div class="aspect-square relative overflow-hidden bg-gray-50 dark:bg-zinc-800">
             <img [src]="prod.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
             <button (click)="dataService.toggleSave(prod.id)" class="absolute top-6 right-6 p-3 bg-white/50 backdrop-blur-md rounded-2xl transition-all opacity-0 group-hover:opacity-100" [class.text-red-500]="prod.isSaved" [class.text-gray-900]="!prod.isSaved">
               <svg class="w-6 h-6" [attr.fill]="prod.isSaved ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
             </button>
             @if (type === 'featured') {
               <div class="absolute bottom-6 left-6 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">Destaque</div>
             }
          </div>
          <div class="p-10 space-y-6">
             <div>
                <h4 class="font-black text-2xl tracking-tight text-gray-900 dark:text-zinc-100 truncate">{{ prod.name }}</h4>
                <p class="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{{ getVendorForProduct(prod.storeId)?.name }}</p>
             </div>
             <div class="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800">
                <div>
                   <p class="text-3xl font-black text-blue-600 tracking-tighter">R$ {{ prod.live_price | number:'1.2-2' }}</p>
                </div>
                <button (click)="buyProduct(prod.id)" class="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-xl">Comprar</button>
             </div>
          </div>
        </article>
      </ng-template>

      <ng-template #smallProductCard let-prod>
        <article class="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 group cursor-pointer hover:border-blue-200 transition-all">
          <div class="aspect-square relative overflow-hidden bg-gray-50 dark:bg-zinc-800">
             <img [src]="prod.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-5 space-y-2">
             <h5 class="text-xs font-black text-gray-900 dark:text-zinc-100 truncate uppercase tracking-tighter">{{ prod.name }}</h5>
             <p class="text-lg font-black text-blue-600 tracking-tighter">R$ {{ prod.live_price | number:'1.2-2' }}</p>
          </div>
        </article>
      </ng-template>

    </div>
  `,
  styles: [`
    @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slide-up { from { opacity: 0; transform: translate(-50%, 40px); } to { opacity: 1; transform: translate(-50%, 0); } }
    .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class ProductPortalComponent {
  dataService = inject(MockDataService);
  searchQuery = signal('');
  goToCheckout = output<void>();
  requestLogin = output<void>();
  cookiesAccepted = signal(false);
  
  featuredProducts = computed(() => this.dataService.globalProducts().slice(0, 2));
  featuredStores = computed(() => this.dataService.stores().slice(0, 4));
  savedProducts = computed(() => this.dataService.globalProducts().filter(p => p.isSaved));
  bestSellers = computed(() => [...this.dataService.globalProducts()].sort((a, b) => b.likes - a.likes).slice(0, 5));
  suggestedProducts = computed(() => [...this.dataService.globalProducts()].reverse().slice(0, 6));

  getVendorForProduct(storeId: number): Store | undefined { return this.dataService.stores().find(s => s.id === storeId); }
  buyProduct(id: number) { this.dataService.addToCart(id); }
  acceptCookies() { this.cookiesAccepted.set(true); }
  goHome() { (window as any).location.reload(); }
}
