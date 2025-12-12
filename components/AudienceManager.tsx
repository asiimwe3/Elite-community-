import React from 'react';
import { Icons } from './Icons';
import { Audience } from '../types';

const mockAudiences: Audience[] = [
  { id: '1', name: 'Cart Abandoners 30d', description: 'Users who added to cart but did not purchase in last 30 days', size: '15K - 20K', type: 'Custom' },
  { id: '2', name: 'High Value Customers', description: 'LTV > $500', size: '2.5K', type: 'Custom' },
  { id: '3', name: 'Lookalike 1% (Purchasers)', description: 'Similar to top purchasers', size: '2.1M', type: 'Lookalike' },
  { id: '4', name: 'Tech Enthusiasts (US)', description: 'Interest in Technology, Gadgets. Location: US', size: '15M', type: 'Saved' },
];

export const AudienceManager: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
           <h2 className="text-lg font-bold text-gray-900">Audience Segments</h2>
           <p className="text-sm text-gray-500">Manage and create target audiences for your campaigns.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all">
           <Icons.Plus className="w-4 h-4" />
           Create Audience
        </button>
      </div>

      <div className="overflow-auto flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAudiences.map((audience) => (
                <div key={audience.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group bg-white">
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-2 rounded-lg ${
                            audience.type === 'Custom' ? 'bg-purple-50 text-purple-700' :
                            audience.type === 'Lookalike' ? 'bg-blue-50 text-blue-700' :
                            'bg-green-50 text-green-700'
                        }`}>
                            <Icons.Audiences className="w-5 h-5" />
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 group-hover:block">
                            <Icons.Edit className="w-4 h-4" />
                        </button>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{audience.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{audience.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                        <span className="bg-gray-100 px-2 py-1 rounded">{audience.type}</span>
                        <span className="flex items-center gap-1 font-medium">
                            <Icons.User className="w-3 h-3" />
                            {audience.size}
                        </span>
                    </div>
                </div>
            ))}
            
            {/* Create New Card Placeholder */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer min-h-[200px]">
                <Icons.Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">Create New Segment</span>
            </div>
        </div>
      </div>
    </div>
  );
};
