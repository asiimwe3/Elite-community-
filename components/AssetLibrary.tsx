import React from 'react';
import { Icons } from './Icons';
import { Asset } from '../types';

const mockAssets: Asset[] = [
  { id: '1', name: 'Summer_Promo_Banner.jpg', type: 'Image', url: 'https://images.unsplash.com/photo-1555529733-149fa8a452be?w=500&auto=format&fit=crop&q=60', uploadDate: '2024-06-01' },
  { id: '2', name: 'Product_Launch_Video.mp4', type: 'Video', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&auto=format&fit=crop&q=60', uploadDate: '2024-06-10' },
  { id: '3', name: 'Brand_Logo_Transparent.png', type: 'Logo', url: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=500&auto=format&fit=crop&q=60', uploadDate: '2024-05-15' },
  { id: '4', name: 'Lifestyle_Shot_Hiking.jpg', type: 'Image', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60', uploadDate: '2024-06-12' },
  { id: '5', name: 'Office_Interior.jpg', type: 'Image', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60', uploadDate: '2024-06-14' },
];

export const AssetLibrary: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
           <h2 className="text-lg font-bold text-gray-900">Creative Assets</h2>
           <p className="text-sm text-gray-500">Store and manage images, videos, and brand assets.</p>
        </div>
        <div className="flex gap-2">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Icons.Search className="w-4 h-4" />
                Filter
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all">
                <Icons.Upload className="w-4 h-4" />
                Upload Asset
            </button>
        </div>
      </div>

      <div className="overflow-auto flex-1 p-6 bg-gray-50/50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mockAssets.map((asset) => (
                <div key={asset.id} className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img src={asset.url} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm uppercase font-bold tracking-wider">
                            {asset.type}
                        </div>
                    </div>
                    <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-900 truncate mb-1" title={asset.name}>{asset.name}</h4>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{asset.uploadDate}</span>
                            <button className="text-gray-400 hover:text-blue-600">
                                <Icons.Edit className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
