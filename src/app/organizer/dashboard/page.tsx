"use client"
import React from 'react';
import {
    Users,
    Ticket,
    ArrowUpRight,
    TrendingUp,
    IndianRupee,
    CalendarCheck,
    MoreVertical,
    Play,
    // Fix: Added missing Hexagon icon import
    Hexagon
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { fetchOrganizerDetails } from '@/store/slices/organizerSlice';

const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
];

const barData = [
    { name: 'Concert', value: 80 },
    { name: 'Tech Talk', value: 45 },
    { name: 'Fest', value: 65 },
    { name: 'Workshop', value: 90 },
];

const COLORS = ['#F59E0B', '#FCD34D', '#78350F', '#B45309'];

const StatCard = ({ title, value, change, icon: Icon, colorClass }: any) => (
    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${colorClass}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {change}
            </div>
        </div>
        <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-text-main">{value}</p>
    </div>
);

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { selectedOrganization, orgDetailsLoading } = useAppSelector((state: RootState) => state.organizer);

    React.useEffect(() => {
        if (selectedOrganization?.id) {
            dispatch(fetchOrganizerDetails(selectedOrganization.id));
        }
    }, [dispatch, selectedOrganization?.id]);

    // Derived Stats
    const events = selectedOrganization?.events || [];

    // 1. Total Revenue (Approximate based on basic calculation if prices available, else mock logic or 0)
    // Note: Backend doesn't return revenue yet, so we might need to rely on totalTicketsSold for now or sum up if we had sales data.
    // For now, let's just show Total Tickets as a primary metric we have.

    const totalTicketsSold = selectedOrganization?.totalTicketsSold || 0;
    const totalEvents = selectedOrganization?.totalEvents || events.length || 0;

    // Upcoming Events Count
    const now = new Date();
    const upcomingEventsCount = events.filter((e: any) => new Date(e.startDate) > now).length;

    // Live Events
    const liveEventsCount = events.filter((e: any) => e.isLive).length;

    // Category Data for Chart
    const categoryCounts: Record<string, number> = {};
    events.forEach((e: any) => {
        const cat = e.category || 'Other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const dynamicBarData = Object.keys(categoryCounts).map(cat => ({
        name: cat,
        value: categoryCounts[cat]
    })).slice(0, 4); // Limit to 4


    return (
        <div className="space-y-8 pb-10">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${(selectedOrganization?.totalRevenue || 0).toLocaleString('en-IN')}`}
                    change="N/A"
                    icon={IndianRupee}
                    colorClass="bg-primary shadow-primary/40 shadow-lg"
                />
                <StatCard
                    title="Live Events"
                    value={liveEventsCount}
                    change={liveEventsCount > 0 ? "Active Now" : "Inactive"}
                    icon={Users}
                    colorClass="bg-primary-hover shadow-primary/40 shadow-lg"
                />
                <StatCard
                    title="Upcoming Events"
                    value={upcomingEventsCount}
                    change={`Total: ${totalEvents}`}
                    icon={CalendarCheck}
                    colorClass="bg-secondary shadow-secondary/40 shadow-lg"
                />
                <StatCard
                    title="Tickets Sold"
                    value={totalTicketsSold}
                    change="Lifetime"
                    icon={Ticket}
                    colorClass="bg-primary shadow-primary/40 shadow-lg"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart - Keep Static for Demo until we have timeseries data */}
                <div className="lg:col-span-2 bg-card p-6 rounded-3xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-text-main">Sales Analytics</h3>
                            <p className="text-sm text-text-muted">Real-time revenue tracking (Demo)</p>
                        </div>
                        <select className="bg-background border-none rounded-lg text-sm font-medium px-3 py-1 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Performance - Dynamic Categories */}
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-text-main mb-2">Category Performance</h3>
                    <p className="text-sm text-text-muted mb-8">Events by category</p>

                    <div className="h-48 w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dynamicBarData.length > 0 ? dynamicBarData : barData}>
                                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                                    {(dynamicBarData.length > 0 ? dynamicBarData : barData).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-primary/10 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary p-2 rounded-xl">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary-hover uppercase tracking-tight">Active Promo</p>
                                    <p className="text-sm font-medium text-text-secondary">Early Bird Sales</p>
                                </div>
                            </div>
                            <button className="bg-card px-4 py-1 rounded-full text-xs font-bold shadow-sm text-text-main">Edit</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-text-main">Recent Collaborations</h3>
                        <button className="text-primary hover:text-primary-hover text-sm font-semibold hover:underline">+ Add Staff</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Sarah Chen', role: 'Support Lead', status: 'Online', color: 'bg-green-500' },
                            { name: 'Mike Ross', role: 'Sales Manager', status: 'Away', color: 'bg-yellow-500' },
                            { name: 'Elena Gilbert', role: 'Marketing', status: 'Offline', color: 'bg-gray-300' }
                        ].map((user, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-background transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary-hover">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-text-main">{user.name}</p>
                                        <p className="text-xs text-text-muted">{user.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user.color}`}></div>
                                    <span className="text-xs text-text-muted">{user.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative bg-text-main rounded-3xl p-8 text-white overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Scale your Events</h3>
                        <p className="text-slate-400 mb-8 max-w-xs">Upgrade to Pro to unlock unlimited push notifications and advanced custom registration fields.</p>
                        <button className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-xl shadow-primary/40">
                            Go Premium
                        </button>
                    </div>
                    <div className="absolute right-8 bottom-8">
                        <Hexagon className="w-32 h-32 text-white/5" strokeWidth={0.5} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
