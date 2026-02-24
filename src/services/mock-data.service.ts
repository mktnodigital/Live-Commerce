
import { Injectable, signal, computed, effect } from '@angular/core';

export interface Story {
  id: number;
  storeId: number;
  image: string;
  title: string;
  timestamp: string;
}

export interface Comment {
  user: string;
  text: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Product {
  id: number;
  storeId: number;
  name: string;
  sku: string;
  category: string;
  price: number; 
  commission_value: number; 
  live_price: number; 
  stock: number;
  status: 'active' | 'inactive';
  sizes: string[];
  description: string;
  image: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsList?: Comment[];
}

export interface Store {
  id: number;
  name: string;
  subdomain: string;
  status: 'active' | 'blocked';
  isOnline: boolean;
  commission_rate: number; 
  total_earned: number;
  whatsappStatus: string;
  rating: number;
  followers: number;
  avatar: string;
}

export interface Order {
  id: string;
  store_id: number;
  product_id: number;
  customer: string;
  total: number;
  commission: number;
  status: 'paid' | 'pending' | 'canceled';
  channel: string;
  date: string;
}

export interface CashFlowEntry {
  id: number;
  type: 'in' | 'out';
  amount: number;
  description: string;
  date: string;
}

export interface Gateway {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  apiKey: string;
}

export interface LogisticsProvider {
  id: number;
  name: string;
  type: 'correios' | 'transportadora' | 'local';
  active: boolean;
}

export type UserRole = 'admin' | 'store' | 'user' | null;

export interface UserSession {
  name: string;
  avatar: string;
  role: UserRole;
  email: string;
}

export type AdminTab = 'dashboard' | 'stores' | 'inventory' | 'sales' | 'finance' | 'settings' | 'reports' | 'logistics';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  readonly theme = signal<'light' | 'dark'>('light');
  readonly isLoggedIn = signal<boolean>(false);
  readonly currentUser = signal<UserSession | null>(null);

  readonly adminView = signal<AdminTab>('dashboard');
  readonly storeView = signal<'overview' | 'catalog' | 'live' | 'orders' | 'commissions' | 'whatsapp'>('overview');

  private readonly VALID_CREDENTIALS = [
    { email: 'master@livesaas.com', pass: 'master123', role: 'admin' as UserRole, name: 'Arquiteto Master', avatar: 'https://picsum.photos/seed/master/100' },
    { email: 'ana@fashion.com', pass: 'ana123', role: 'store' as UserRole, name: 'Ana Boutique', avatar: 'https://picsum.photos/seed/ana/100' },
    { email: 'joao@gmail.com', pass: 'user123', role: 'user' as UserRole, name: 'João Cliente', avatar: 'https://picsum.photos/seed/user123/100' }
  ];

  constructor() {
    effect(() => {
      const theme = this.theme();
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  authenticate(email: string, pass: string): UserRole | null {
    const user = this.VALID_CREDENTIALS.find(u => u.email === email && u.pass === pass);
    if (user) {
      this.isLoggedIn.set(true);
      this.currentUser.set({
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        email: user.email
      });
      return user.role;
    }
    return null;
  }

  logout() {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.clearCart();
  }

  readonly cartItems = signal<CartItem[]>([]);
  readonly cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  
  readonly cartTotal = computed(() => {
    return this.cartItems().reduce((acc, item) => {
      const product = this.globalProducts().find(p => p.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
  });

  addToCart(productId: number) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.productId === productId);
      if (existing) {
        return items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { productId, quantity: 1 }];
    });
  }

  removeFromCart(productId: number) {
    this.cartItems.update(items => items.filter(i => i.productId !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }

  readonly stores = signal<Store[]>([
    { id: 1, name: 'Boutique da Ana', subdomain: 'ana-moda', status: 'active', isOnline: true, commission_rate: 15, total_earned: 12500.50, whatsappStatus: 'connected', rating: 4.9, followers: 12500, avatar: 'https://picsum.photos/seed/ana/200' },
    { id: 2, name: 'Tech Store Rep', subdomain: 'tech-rep', status: 'active', isOnline: false, commission_rate: 10, total_earned: 34000.00, whatsappStatus: 'disconnected', rating: 4.7, followers: 8900, avatar: 'https://picsum.photos/seed/tech/200' },
    { id: 3, name: 'Minimal House', subdomain: 'minimal', status: 'active', isOnline: true, commission_rate: 12, total_earned: 5200.00, whatsappStatus: 'connected', rating: 5.0, followers: 3200, avatar: 'https://picsum.photos/seed/min/200' },
    { id: 4, name: 'Esporte Total', subdomain: 'sport', status: 'active', isOnline: true, commission_rate: 10, total_earned: 9400.00, whatsappStatus: 'connected', rating: 4.8, followers: 15000, avatar: 'https://picsum.photos/seed/sport/200' },
    { id: 5, name: 'Gamer Pro HQ', subdomain: 'gamer-hq', status: 'active', isOnline: true, commission_rate: 8, total_earned: 45000.00, whatsappStatus: 'connected', rating: 4.9, followers: 22000, avatar: 'https://picsum.photos/seed/gamer/200' },
    { id: 6, name: 'Kids & Fun', subdomain: 'kids-fun', status: 'active', isOnline: false, commission_rate: 15, total_earned: 3200.10, whatsappStatus: 'connected', rating: 4.6, followers: 5400, avatar: 'https://picsum.photos/seed/kids/200' },
    { id: 7, name: 'Beleza Pura', subdomain: 'beleza', status: 'active', isOnline: true, commission_rate: 20, total_earned: 1800.00, whatsappStatus: 'connected', rating: 4.9, followers: 45000, avatar: 'https://picsum.photos/seed/beauty/200' },
    { id: 8, name: 'Ferramentas Já', subdomain: 'tools', status: 'active', isOnline: false, commission_rate: 10, total_earned: 12000.00, whatsappStatus: 'connected', rating: 4.5, followers: 2100, avatar: 'https://picsum.photos/seed/tools/200' },
    { id: 9, name: 'Pet Love Shop', subdomain: 'pet-love', status: 'active', isOnline: true, commission_rate: 12, total_earned: 7600.40, whatsappStatus: 'connected', rating: 5.0, followers: 12900, avatar: 'https://picsum.photos/seed/pet/200' },
    { id: 10, name: 'Vinhos & Cia', subdomain: 'vinhos', status: 'active', isOnline: true, commission_rate: 18, total_earned: 15400.00, whatsappStatus: 'connected', rating: 4.8, followers: 8700, avatar: 'https://picsum.photos/seed/wine/200' },
  ]);

  readonly stories = signal<Story[]>([
    { id: 1, storeId: 1, title: 'Novidades!', image: 'https://picsum.photos/seed/s1/400/700', timestamp: '2h' },
    { id: 2, storeId: 3, title: 'Promoção', image: 'https://picsum.photos/seed/s2/400/700', timestamp: '5m' },
    { id: 3, storeId: 5, title: 'Setup Novo', image: 'https://picsum.photos/seed/s3/400/700', timestamp: '10m' },
    { id: 4, storeId: 7, title: 'Skincare Tips', image: 'https://picsum.photos/seed/s4/400/700', timestamp: '1h' },
    { id: 5, storeId: 9, title: 'Dog Friendly', image: 'https://picsum.photos/seed/s5/400/700', timestamp: '4h' },
  ]);

  readonly globalProducts = signal<Product[]>([
    { id: 1, storeId: 1, name: 'Smartwatch Pro X', sku: 'SW-PRO-X', category: 'Eletrônicos', price: 599.00, commission_value: 89.85, live_price: 549.00, stock: 45, status: 'active', sizes: ['U'], description: 'Display OLED 1.9 pol com monitor cardíaco avançado.', image: 'https://picsum.photos/seed/p1/800/800', likes: 1240, isLiked: false, isSaved: false, commentsList: [{user: 'bruno_tech', text: 'Bateria dura quanto tempo?'}] },
    { id: 2, storeId: 1, name: 'Vestido Verão Flow', sku: 'VES-FLOW-01', category: 'Moda', price: 189.90, commission_value: 28.48, live_price: 159.90, stock: 120, status: 'active', sizes: ['P', 'M', 'G'], description: 'Tecido leve premium para dias quentes.', image: 'https://picsum.photos/seed/p2/800/800', likes: 856, isLiked: true, isSaved: true, commentsList: [] },
    { id: 3, storeId: 2, name: 'Fone Noise Cancel', sku: 'AUDIO-77', category: 'Eletrônicos', price: 299.00, commission_value: 40.00, live_price: 249.00, stock: 30, status: 'active', sizes: ['U'], description: 'Bluetooth 5.3 com isolamento ativo de ruído.', image: 'https://picsum.photos/seed/p3/800/800', likes: 2105, isLiked: false, isSaved: false, commentsList: [{user: 'musica_vibe', text: 'O som é absurdo!'}] },
    { id: 4, storeId: 3, name: 'Tênis Ultra Boost', sku: 'SHOES-99', category: 'Esporte', price: 799.00, commission_value: 100.00, live_price: 699.00, stock: 15, status: 'active', sizes: ['38','40','42'], description: 'Amortecimento responsivo para alta performance.', image: 'https://picsum.photos/seed/p4/800/800', likes: 540, isLiked: false, isSaved: false, commentsList: [] },
  ]);

  toggleLike(productId: number) {
    this.globalProducts.update(prods => prods.map(p => {
      if (p.id === productId) {
        const newState = !p.isLiked;
        return { ...p, isLiked: newState, likes: newState ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  }

  toggleSave(productId: number) {
    this.globalProducts.update(prods => prods.map(p => 
      p.id === productId ? { ...p, isSaved: !p.isSaved } : p
    ));
  }

  addComment(productId: number, user: string, text: string) {
    this.globalProducts.update(prods => prods.map(p => 
      p.id === productId ? { ...p, commentsList: [...(p.commentsList || []), { user, text }] } : p
    ));
  }

  readonly orders = signal<Order[]>([]);
  readonly cashFlow = signal<CashFlowEntry[]>([]);
  readonly gateways = signal<Gateway[]>([]);
  readonly logistics = signal<LogisticsProvider[]>([]);
  readonly isLiveActive = signal(false);
  readonly liveViewers = signal(124);
  readonly liveSalesCount = signal(12);
  readonly pinnedProductId = signal<number | null>(null);
  readonly storeShowcaseIds = signal<number[]>([1, 2, 3]);
  readonly messages = signal([]);
  readonly isInstagramConnected = signal(true);
  readonly isInstagramMirroring = signal(false);
  readonly instagramLiveViewers = signal(85);
  readonly isWhatsappConnected = signal(true);
  readonly qrCodeVisible = signal(false);
  readonly whatsappInstanceName = signal('loja_ana_main');
  readonly instagramHandle = signal('@boutique_da_ana');

  addStory(story: Omit<Story, 'id' | 'timestamp'>) { this.stories.update(s => [{ ...story, id: Date.now(), timestamp: 'Agora' }, ...s]); }
  toggleStoreStatus(storeId: number) { this.stores.update(ss => ss.map(s => s.id === storeId ? { ...s, isOnline: !s.isOnline } : s)); }
  addGateway(gw: Omit<Gateway, 'id'>) { this.gateways.update(gs => [...gs, { ...gw, id: Date.now() }]); }
  updateGateway(updated: Gateway) { this.gateways.update(gs => gs.map(g => g.id === updated.id ? updated : g)); }
  deleteGateway(id: number) { this.gateways.update(gs => gs.filter(g => g.id !== id)); }
  toggleGateway(id: number) { this.gateways.update(gs => gs.map(g => g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g)); }
  addStore(store: Omit<Store, 'id' | 'total_earned' | 'whatsappStatus' | 'rating' | 'followers' | 'avatar' | 'isOnline'>) { this.stores.update(s => [...s, { ...store, id: Date.now(), total_earned: 0, whatsappStatus: 'disconnected', rating: 5.0, followers: 0, avatar: 'https://picsum.photos/200', isOnline: false }]); }
  updateStore(updated: Store) { this.stores.update(s => s.map(i => i.id === updated.id ? updated : i)); }
  deleteStore(id: number) { this.stores.update(s => s.filter(i => i.id !== id)); }
  addProduct(prod: Omit<Product, 'id' | 'likes'>) { this.globalProducts.update(p => [...p, { ...prod, id: Date.now(), likes: 0, isLiked: false, isSaved: false, commentsList: [] }]); }
  updateProduct(updated: Product) { this.globalProducts.update(p => p.map(i => i.id === updated.id ? updated : i)); }
  deleteProduct(id: number) { this.globalProducts.update(p => p.filter(i => i.id !== id)); }
  addOrder(order: Omit<Order, 'id' | 'date'>) { this.orders.update(o => [...o, { ...order, id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`, date: new Date().toISOString() }]); }
  addCashEntry(entry: Omit<CashFlowEntry, 'id' | 'date'>) { this.cashFlow.update(cf => [...cf, { ...entry, id: Date.now(), date: new Date().toISOString().split('T')[0] }]); }
  toggleLive() { this.isLiveActive.update(v => !v); }
  pinProduct(id: number | null) { this.pinnedProductId.set(id); }
  toggleProductInShowcase(productId: number) { this.storeShowcaseIds.update(ids => ids.includes(productId) ? ids.filter(id => id !== productId) : [...ids, productId]); }
  generateQrCode() { this.qrCodeVisible.set(true); setTimeout(() => { this.isWhatsappConnected.set(true); this.qrCodeVisible.set(false); }, 2000); }
  toggleInstagramConnection() { this.isInstagramConnected.update(v => !v); }
  toggleInstagramMirroring() { this.isInstagramMirroring.update(v => !v); }
}
