
import { Component, output, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MockDataService, UserRole } from '../services/mock-data.service';

export type CurrentView = 'login' | 'admin' | 'store' | 'docs' | 'portal' | 'checkout';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-6 font-sans transition-colors relative overflow-hidden">
      
      <!-- BACKGROUND DECORATION -->
      <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[200px]"></div>
         <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[200px]"></div>
      </div>

      <div class="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] shadow-2xl w-full max-w-xl border border-white/50 dark:border-zinc-800 animate-fade-in relative z-10">
        
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mb-8 shadow-2xl shadow-blue-200 dark:shadow-blue-900/20">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h1 class="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tighter">Acesso Restrito</h1>
          <p class="text-gray-400 dark:text-zinc-500 text-xs mt-3 font-medium uppercase tracking-[0.2em]">Autenticação de Segurança LiveSaaS</p>
        </div>

        <!-- LOGIN FORM -->
        <form [formGroup]="loginForm" (ngSubmit)="handleLogin()" class="space-y-6">
           <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">E-mail Cadastrado</label>
              <div class="relative group">
                <input 
                  type="email" 
                  formControlName="email" 
                  placeholder="ex: master@livesaas.com"
                  class="w-full bg-gray-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-blue-500 outline-none p-5 rounded-2xl text-sm font-medium transition-all dark:text-zinc-100"
                >
                <div class="absolute inset-y-0 right-5 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                   <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
              </div>
           </div>
           
           <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Senha Segura</label>
              <input 
                type="password" 
                formControlName="password" 
                placeholder="••••••••"
                class="w-full bg-gray-50 dark:bg-zinc-800/50 border-2 border-transparent focus:border-blue-500 outline-none p-5 rounded-2xl text-sm font-medium transition-all dark:text-zinc-100"
              >
           </div>

           @if (errorMessage()) {
             <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold text-center animate-shake">
                <div class="flex items-center justify-center gap-2">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                   {{ errorMessage() }}
                </div>
             </div>
           }

           <div class="flex flex-col gap-3 pt-6">
              <button 
                type="submit"
                [disabled]="isLoading() || loginForm.invalid"
                class="w-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                 @if (isLoading()) {
                   <div class="w-4 h-4 border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 rounded-full animate-spin"></div>
                   Validando...
                 } @else {
                   Entrar no Painel
                 }
              </button>
              
              <button type="button" (click)="cancelLogin()" class="text-[10px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100 uppercase tracking-widest py-3 transition-colors">
                 Voltar para Vitrine
              </button>
           </div>

           <!-- HINTS FOR ACCESS -->
           <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-center border border-gray-100 dark:border-zinc-700">
                 <p class="text-[8px] font-black text-gray-400 uppercase">Master</p>
                 <p class="text-[9px] font-bold text-gray-500">master@livesaas.com</p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-center border border-gray-100 dark:border-zinc-700">
                 <p class="text-[8px] font-black text-gray-400 uppercase">Store</p>
                 <p class="text-[9px] font-bold text-gray-500">ana@fashion.com</p>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-center border border-gray-100 dark:border-zinc-700">
                 <p class="text-[8px] font-black text-gray-400 uppercase">User</p>
                 <p class="text-[9px] font-bold text-gray-500">joao@gmail.com</p>
              </div>
           </div>
        </form>

        <div class="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 text-center">
           <span class="text-[10px] text-gray-300 dark:text-zinc-700 font-black uppercase tracking-widest">Master Architect Build v2.7.0</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  dataService = inject(MockDataService);
  roleSelected = output<CurrentView>();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  async handleLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Credenciais obrigatórias e válidas.');
      return;
    }

    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Latência simulada de segurança
    await new Promise(r => setTimeout(r, 1000));

    const role = this.dataService.authenticate(email, password);
    
    if (role) {
      const targetView: CurrentView = role === 'admin' ? 'admin' : (role === 'store' ? 'store' : 'portal');
      this.roleSelected.emit(targetView);
    } else {
      this.errorMessage.set('Acesso negado: Credenciais inválidas.');
    }
    
    this.isLoading.set(false);
  }

  cancelLogin() {
    this.roleSelected.emit('portal');
  }
}

