
// Fix: Import signal from @angular/core to resolve undefined reference
import { Component, inject, output, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MockDataService, Product } from '../services/mock-data.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 font-sans pb-20">
      
      <!-- HEADER SIMPLIFICADO -->
      <nav class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
        <div class="flex items-center gap-4 cursor-pointer" (click)="backToPortal.emit()">
           <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
           <span class="font-black text-xl tracking-tighter text-gray-900">Checkout <span class="text-blue-600">SaaS</span></span>
        </div>
        <div class="text-xs font-black text-gray-400 uppercase tracking-widest">Pagamento Seguro</div>
      </nav>

      <main class="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- COLUNA ESQUERDA: ITENS E PAGAMENTO -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- LISTA DE ITENS -->
          <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
             <h3 class="text-xl font-black text-gray-900 mb-6">Seu Carrinho</h3>
             
             @if (dataService.cartItems().length === 0) {
               <div class="py-12 text-center">
                 <p class="text-gray-400 font-medium">Seu carrinho está vazio.</p>
                 <button (click)="backToPortal.emit()" class="mt-4 text-blue-600 font-bold hover:underline">Voltar para a vitrine</button>
               </div>
             } @else {
               <div class="divide-y divide-gray-100">
                 @for (item of cartWithProducts(); track item.product.id) {
                   <div class="py-6 flex gap-6 items-center">
                      <img [src]="item.product.image" class="w-20 h-20 rounded-2xl object-cover shadow-sm">
                      <div class="flex-1">
                        <h4 class="font-bold text-gray-900">{{ item.product.name }}</h4>
                        <p class="text-xs text-gray-400 font-medium">{{ item.product.category }}</p>
                        <div class="flex items-center gap-4 mt-2">
                           <span class="text-sm font-black text-blue-600">R$ {{ item.product.price | number:'1.2-2' }}</span>
                           <span class="text-[10px] text-gray-400 uppercase font-black">Qtd: {{ item.quantity }}</span>
                        </div>
                      </div>
                      <button (click)="dataService.removeFromCart(item.product.id)" class="text-red-400 hover:text-red-600 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                   </div>
                 }
               </div>
             }
          </section>

          <!-- MÉTODO DE PAGAMENTO -->
          <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
             <h3 class="text-xl font-black text-gray-900 mb-6">Forma de Pagamento</h3>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-6 border-2 border-blue-600 bg-blue-50/50 rounded-3xl cursor-pointer flex items-center justify-between group">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">PIX</div>
                      <div>
                        <p class="text-sm font-bold text-gray-900">Pix Instantâneo</p>
                        <p class="text-[10px] text-gray-400 font-medium">Aprovação imediata</p>
                      </div>
                   </div>
                   <div class="w-5 h-5 rounded-full border-4 border-blue-600 bg-white"></div>
                </div>
                
                <div class="p-6 border-2 border-gray-100 rounded-3xl cursor-pointer flex items-center justify-between hover:border-blue-200 transition-all opacity-50 grayscale">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                         <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-gray-900">Cartão de Crédito</p>
                        <p class="text-[10px] text-gray-400 font-medium">Até 12x com juros</p>
                      </div>
                   </div>
                   <div class="w-5 h-5 rounded-full border-2 border-gray-100 bg-white"></div>
                </div>
             </div>
          </section>
        </div>

        <!-- COLUNA DIREITA: RESUMO -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-28">
             <h3 class="text-xl font-black text-gray-900 mb-8">Resumo do Pedido</h3>
             
             <div class="space-y-4 mb-8">
                <div class="flex justify-between text-sm font-medium text-gray-500">
                   <span>Subtotal</span>
                   <span>R$ {{ dataService.cartTotal() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-sm font-medium text-gray-500">
                   <span>Frete (Estimado)</span>
                   <span class="text-green-600 font-black uppercase text-[10px]">Grátis</span>
                </div>
                <div class="pt-4 border-t border-gray-100 flex justify-between items-end">
                   <span class="text-sm font-black text-gray-900">Total</span>
                   <span class="text-2xl font-black text-blue-600 tracking-tight">R$ {{ dataService.cartTotal() | number:'1.2-2' }}</span>
                </div>
             </div>

             <button 
               (click)="finishPurchase()"
               [disabled]="dataService.cartCount() === 0"
               class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
             >
                Finalizar Compra
             </button>

             <p class="mt-6 text-[10px] text-gray-400 text-center font-medium leading-relaxed uppercase tracking-tighter">
                Sua transação é protegida pela criptografia LiveSaaS Gateway e Evolution Security.
             </p>
          </div>
        </div>

      </main>

      <!-- FEEDBACK DE SUCESSO -->
      @if (purchaseSuccess()) {
        <div class="fixed inset-0 bg-blue-600/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 text-center animate-fade-in">
           <div class="bg-white rounded-[3.5rem] p-16 shadow-2xl max-w-lg w-full scale-in">
              <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 class="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Pedido Realizado!</h2>
              <p class="text-gray-400 font-medium mb-10">Obrigado por comprar no ecossistema LiveSaaS. Enviamos os detalhes para seu e-mail.</p>
              <button (click)="resetAndBack()" class="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                 Voltar para a Vitrine
              </button>
           </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    .animate-fade-in { animation: fade-in 0.4s ease-out; }
    .scale-in { animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  `]
})
export class CheckoutComponent {
  dataService = inject(MockDataService);
  backToPortal = output<void>();
  // Fix: Usage of signal which is now imported
  purchaseSuccess = signal(false);

  cartWithProducts = computed(() => {
    return this.dataService.cartItems().map(item => {
      const product = this.dataService.globalProducts().find(p => p.id === item.productId);
      return { product: product!, quantity: item.quantity };
    }).filter(item => !!item.product);
  });

  finishPurchase() {
    this.purchaseSuccess.set(true);
  }

  resetAndBack() {
    this.dataService.clearCart();
    this.purchaseSuccess.set(false);
    this.backToPortal.emit();
  }
}
