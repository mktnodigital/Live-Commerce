
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-architecture-viewer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div class="mb-8">
        <h2 class="text-3xl font-black text-gray-900">Blueprint Técnico</h2>
        <p class="text-gray-500">Documentação completa para implementação PHP/MySQL (Ambiente HostGator).</p>
      </div>

      <div class="flex-1 bg-[#1e1e1e] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10">
        <div class="flex bg-[#252526] px-6 py-3 border-b border-white/5 items-center justify-between">
           <div class="flex gap-2">
             <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
             <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
             <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
           </div>
           <span class="text-gray-400 text-[10px] font-mono font-bold tracking-widest uppercase">System_Architecture.sql</span>
        </div>
        <div class="flex-1 overflow-auto p-8 font-mono text-sm leading-relaxed text-blue-300">
          <pre class="whitespace-pre-wrap">
-- LIVE COMMERCE SAAS ARCHITECTURE --
-- PHP 8.2 + MySQL 8.0 --

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(50) UNIQUE,
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    api_key VARCHAR(100),
    status ENUM('active', 'blocked') DEFAULT 'active'
);

CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY,
    store_id INT,
    customer_name VARCHAR(255),
    total_amount DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    channel ENUM('site', 'live', 'instagram'),
    status ENUM('pending', 'paid', 'canceled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- REVENUE ENGINE --
CREATE VIEW commission_summary AS
SELECT 
    store_id, 
    SUM(commission_amount) as total_earned,
    SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END) as pending_payout
FROM orders
GROUP BY store_id;</pre>
        </div>
      </div>
    </div>
  `
})
export class ArchitectureViewerComponent {
  dataService = inject(MockDataService);
}
