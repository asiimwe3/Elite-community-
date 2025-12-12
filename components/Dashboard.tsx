import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Icons } from './Icons';

const data = [
  { name: 'Mon', clicks: 400, impressions: 2400 },
  { name: 'Tue', clicks: 300, impressions: 1398 },
  { name: 'Wed', clicks: 200, impressions: 9800 },
  { name: 'Thu', clicks: 278, impressions: 3908 },
  { name: 'Fri', clicks: 189, impressions: 4800 },
  { name: 'Sat', clicks: 239, impressions: 3800 },
  { name: 'Sun', clicks: 349, impressions: 4300 },
];

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  isPositive: boolean; 
  icon: React.ElementType 
}> = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <Icons.TrendUp className="w-4 h-4 mr-1" /> : <Icons.TrendDown className="w-4 h-4 mr-1" />}
        {change}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <div className="flex gap-2">
           <select className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
             <option>Last 7 Days</option>
             <option>Last 30 Days</option>
             <option>This Quarter</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Impressions" value="124.5K" change="12.5%" isPositive={true} icon={Icons.Impression} />
        <StatCard title="Total Clicks" value="8,245" change="8.2%" isPositive={true} icon={Icons.Click} />
        <StatCard title="Avg. CTR" value="6.62%" change="2.1%" isPositive={false} icon={Icons.Reports} />
        <StatCard title="Total Cost" value="$1,420" change="4.3%" isPositive={true} icon={Icons.Cost} />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Trends</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="impressions" stackId="1" stroke="#93c5fd" fill="url(#colorImp)" />
              <Area type="monotone" dataKey="clicks" stackId="2" stroke="#2563eb" fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-4">
                <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Icons.AI className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">Optimize "Summer Sale" Keywords</h4>
                        <p className="text-sm text-gray-600 mt-1">Your CTR is lower than average for these keywords. Try using more specific long-tail variations.</p>
                        <button className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-800">Apply Recommendation</button>
                    </div>
                </div>
                 <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Icons.TrendUp className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">Budget Increase Opportunity</h4>
                        <p className="text-sm text-gray-600 mt-1">Your "Retargeting" campaign is limited by budget. Increasing by $20/day could yield +15 conversions.</p>
                        <button className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-800">Review Budget</button>
                    </div>
                </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Campaigns</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Campaign</th>
                            <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Conv.</th>
                            <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Cost/Conv.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="py-3 text-sm text-gray-900 font-medium">Summer Promotion 2024</td>
                            <td className="py-3 text-sm text-gray-600 text-right">142</td>
                            <td className="py-3 text-sm text-gray-600 text-right">$12.50</td>
                        </tr>
                        <tr>
                            <td className="py-3 text-sm text-gray-900 font-medium">Brand Search Global</td>
                            <td className="py-3 text-sm text-gray-600 text-right">89</td>
                            <td className="py-3 text-sm text-gray-600 text-right">$4.20</td>
                        </tr>
                        <tr>
                            <td className="py-3 text-sm text-gray-900 font-medium">Affiliate Partner A</td>
                            <td className="py-3 text-sm text-gray-600 text-right">56</td>
                            <td className="py-3 text-sm text-gray-600 text-right">$18.10</td>
                        </tr>
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
};