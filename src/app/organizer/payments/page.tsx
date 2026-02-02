
import React from 'react';
import {
    IndianRupee,
    Download,
    Filter,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    // Fix: Added missing MoreVertical icon import
    MoreVertical
} from 'lucide-react';

const Transactions = [
    { id: '#TR-8921', event: 'Sun & Bass', user: 'Julian Casablancas', date: '2 min ago', amount: '₹150.00', status: 'Completed' },
    { id: '#TR-8920', event: 'AI Builders', user: 'Fabrizio Moretti', date: '15 min ago', amount: '₹45.00', status: 'Completed' },
    { id: '#TR-8919', event: 'Sun & Bass', user: 'Albert Hammond', date: '1 hour ago', amount: '₹150.00', status: 'Pending' },
    { id: '#TR-8918', event: 'Hive Design', user: 'Nick Valensi', date: '3 hours ago', amount: '₹0.00', status: 'Free' },
];

const Payments: React.FC = () => {
    return (
        <div className="space-y-8 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-bold text-text-main">Revenue Breakdown</h3>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-background text-xs font-bold rounded-xl text-text-secondary">7 Days</button>
                                <button className="px-4 py-2 bg-primary text-xs font-bold rounded-xl shadow-sm text-white">30 Days</button>
                            </div>
                        </div>

                        <div className="flex items-end gap-8 mb-8">
                            <div>
                                <p className="text-text-muted text-sm mb-1 font-medium">Total Balance</p>
                                <p className="text-5xl font-extrabold text-text-main">₹48,250.40</p>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 font-bold mb-2">
                                <ArrowUpRight className="w-5 h-5" />
                                <span>+12.4%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-4">
                                <div className="bg-primary p-3 rounded-xl text-white">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-primary-hover font-bold uppercase tracking-wider">Next Payout</p>
                                    <p className="text-lg font-bold text-text-main">₹4,200.00</p>
                                </div>
                            </div>
                            <div className="p-5 bg-background rounded-2xl border border-border flex items-center gap-4">
                                <div className="bg-text-main p-3 rounded-xl text-white">
                                    <Download className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Last Payout</p>
                                    <p className="text-lg font-bold text-text-main">₹12,450.00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-lg font-bold text-text-main">Recent Transactions</h3>
                            <div className="flex gap-3">
                                <button className="p-2 text-text-muted hover:text-primary rounded-lg"><Filter size={18} /></button>
                                <button className="p-2 text-text-muted hover:text-primary rounded-lg"><Download size={18} /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-background text-xs font-bold text-text-muted uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-4">TX ID</th>
                                        <th className="px-6 py-4">Event</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {Transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-background transition-colors">
                                            <td className="px-8 py-4 font-mono text-sm text-text-muted">{tx.id}</td>
                                            <td className="px-6 py-4 font-semibold text-text-secondary">{tx.event}</td>
                                            <td className="px-6 py-4 text-text-muted">{tx.user}</td>
                                            <td className="px-6 py-4 font-bold text-text-main">{tx.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    tx.status === 'Pending' ? 'bg-primary/20 text-primary-hover' :
                                                        'bg-background text-text-muted'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-text-main text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-3 bg-primary rounded-xl">
                                    <IndianRupee className="w-6 h-6 text-white" />
                                </div>
                                <button className="text-white/40 hover:text-white"><MoreVertical size={20} /></button>
                            </div>
                            <p className="text-white/60 font-medium mb-1">Available for Payout</p>
                            <h4 className="text-4xl font-black mb-6">₹8,245.50</h4>
                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/40 hover:bg-primary-hover transition-all">
                                    Transfer Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-3xl border border-border">
                        <h4 className="font-bold text-text-main mb-6">Payment Methods</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 border border-primary/20 bg-primary/5 rounded-2xl">
                                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-[10px]">VISA</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main">**** 4242</p>
                                    <p className="text-[10px] text-text-muted uppercase font-bold">Expires 12/26</p>
                                </div>
                                <span className="px-2 py-0.5 bg-primary/20 text-primary-hover text-[10px] font-bold rounded">Primary</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 border border-border rounded-2xl hover:bg-background cursor-pointer transition-colors">
                                <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center font-bold text-white text-[10px]">MC</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-text-main">**** 1290</p>
                                    <p className="text-[10px] text-text-muted uppercase font-bold">Expires 08/25</p>
                                </div>
                            </div>
                            <button className="w-full py-3 border-2 border-dashed border-border rounded-2xl text-text-muted text-sm font-bold hover:border-primary hover:text-primary transition-all">
                                + Add Bank Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
