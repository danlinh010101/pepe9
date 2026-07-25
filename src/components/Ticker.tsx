import { TrendingUp, TrendingDown } from 'lucide-react';

const ITEMS = [
  { symbol: 'PEPE/ETH', price: '0.00001248', change: '+12.4%', up: true },
  { symbol: 'PEPE/USD', price: '0.00000128', change: '+8.7%',  up: true },
  { symbol: 'PEPE/USDT', price: '0.00000129', change: '+9.1%', up: true },
  { symbol: 'PEPE/BTC', price: '0.0000000214', change: '-2.3%', up: false },
  { symbol: 'PEPE/ETH', price: '0.00001248', change: '+12.4%', up: true },
  { symbol: 'PEPE/USD', price: '0.00000128', change: '+8.7%',  up: true },
  { symbol: 'PEPE/USDT', price: '0.00000129', change: '+9.1%', up: true },
  { symbol: 'PEPE/BTC', price: '0.0000000214', change: '-2.3%', up: false },
];

export function Ticker() {
  return (
    <div className="relative z-30 border-y border-green-500/20 bg-black/80 backdrop-blur-md py-3 overflow-hidden">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-8 text-sm font-mono">
            <span className="text-gray-400 font-semibold">{item.symbol}</span>
            <span className="text-white font-bold">{item.price}</span>
            <span className={`flex items-center gap-1 font-bold ${item.up ? 'text-green-400' : 'text-red-400'}`}>
              {item.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {item.change}
            </span>
            <span className="text-green-500/40 px-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
