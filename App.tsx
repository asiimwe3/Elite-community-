import React, { useState } from 'react';
import { Icons } from './components/Icons';
import { Dashboard } from './components/Dashboard';
import { CreateCampaign } from './components/CreateCampaign';
import { AiAdvisor } from './components/AiAdvisor';
import { AudienceManager } from './components/AudienceManager';
import { AssetLibrary } from './components/AssetLibrary';
import { AiStudio } from './components/AiStudio';
import { Campaign, CampaignStatus, CampaignType } from './types';

// Mock Initial Data
const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    type: CampaignType.SEARCH,
    status: CampaignStatus.ACTIVE,
    budget: 1500,
    spent: 850,
    impressions: 45000,
    clicks: 1200,
    conversions: 142,
    startDate: '2024-06-01'
  },
  {
    id: '2',
    name: 'Brand Awareness - YouTube',
    type: CampaignType.VIDEO,
    status: CampaignStatus.ACTIVE,
    budget: 3000,
    spent: 1200,
    impressions: 125000,
    clicks: 450,
    conversions: 20,
    startDate: '2024-06-10'
  },
  {
    id: '3',
    name: 'Retargeting - Cart Abandoners',
    type: CampaignType.DISPLAY,
    status: CampaignStatus.PAUSED,
    budget: 500,
    spent: 120,
    impressions: 12000,
    clicks: 300,
    conversions: 15,
    startDate: '2024-05-15'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsCreateModalOpen(true);
  };

  const handleSaveCampaign = (campaignData: Partial<Campaign>) => {
    if (editingCampaign) {
      // Edit existing
      setCampaigns(campaigns.map(c => 
        c.id === editingCampaign.id 
          ? { ...c, ...campaignData } 
          : c
      ));
    } else {
      // Create new
      const newCampaign: Campaign = {
        id: Math.random().toString(36).substr(2, 9),
        status: CampaignStatus.ACTIVE,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        startDate: new Date().toISOString().split('T')[0],
        name: campaignData.name || 'New Campaign',
        type: campaignData.type || CampaignType.SEARCH,
        budget: campaignData.budget || 0,
        ...campaignData
      } as Campaign;
      setCampaigns([newCampaign, ...campaigns]);
    }
    
    setIsCreateModalOpen(false);
    setEditingCampaign(null);
    setActiveTab('campaigns');
  };

  const handleCancelModal = () => {
    setIsCreateModalOpen(false);
    setEditingCampaign(null);
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const CampaignTable = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900">All Campaigns</h2>
            <div className="flex gap-2 w-full sm:w-auto">
                 <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                    <Icons.Search className="w-4 h-4" />
                    Filter
                 </button>
            </div>
        </div>
        <div className="overflow-auto flex-1">
            <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Campaign Name</th>
                        <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Type</th>
                        <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Budget</th>
                        <th className="hidden md:table-cell px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Impr.</th>
                        <th className="hidden md:table-cell px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Clicks</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    campaign.status === CampaignStatus.ACTIVE 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {campaign.status === CampaignStatus.ACTIVE ? <Icons.Active className="w-3 h-3" /> : <Icons.Paused className="w-3 h-3" />}
                                    <span className="hidden sm:inline">{campaign.status}</span>
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-xs text-gray-500">ID: {campaign.id}</div>
                                <div className="sm:hidden text-xs text-gray-500 mt-1">{campaign.type} • ${campaign.budget}</div>
                            </td>
                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {campaign.type}
                            </td>
                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                ${campaign.budget.toLocaleString()}
                            </td>
                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                                {campaign.impressions.toLocaleString()}
                            </td>
                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                                {campaign.clicks.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => handleEditCampaign(campaign)}
                                  className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                                  title="Edit Campaign"
                                >
                                  <Icons.Edit className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0 
        ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center">
             <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-lg">A</span>
             </div>
             <span className={`ml-3 font-bold text-xl text-gray-900 overflow-hidden whitespace-nowrap transition-all ${!sidebarOpen && 'lg:opacity-0 lg:w-0'}`}>
               AdSphere
             </span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-500 p-2 -mr-2">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: Icons.Dashboard, label: 'Dashboard' },
            { id: 'studio', icon: Icons.Studio, label: 'AI Studio' },
            { id: 'ai-advisor', icon: Icons.AI, label: 'AI Advisor', colorClass: 'text-purple-600' },
            { id: 'campaigns', icon: Icons.Campaigns, label: 'Campaigns' },
            { id: 'audiences', icon: Icons.Audiences, label: 'Audiences' },
            { id: 'assets', icon: Icons.Assets, label: 'Asset Library' }
          ].map((item) => (
             <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-3 py-3 lg:py-2.5 rounded-lg transition-colors group ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? (item.colorClass || 'text-blue-600') : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className={`ml-3 font-medium text-sm overflow-hidden whitespace-nowrap transition-all ${!sidebarOpen && 'lg:opacity-0 lg:w-0'}`}>{item.label}</span>
              </button>
          ))}
          
          <div className="my-2 border-b border-gray-100" />

          <button className="w-full flex items-center px-3 py-3 lg:py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors group">
            <Icons.Reports className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
            <span className={`ml-3 font-medium text-sm overflow-hidden whitespace-nowrap transition-all ${!sidebarOpen && 'lg:opacity-0 lg:w-0'}`}>Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
             <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">JS</div>
                 <div className={`ml-3 overflow-hidden transition-all ${!sidebarOpen && 'lg:opacity-0 lg:w-0'}`}>
                     <p className="text-sm font-medium text-gray-900">John Smith</p>
                     <p className="text-xs text-gray-500 truncate">john@adsphere.ai</p>
                 </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
             {/* Mobile Hamburger */}
             <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
               <Icons.Menu className="w-6 h-6" />
             </button>

             {/* Desktop Toggle */}
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block text-gray-500 hover:text-gray-700">
                <Icons.Dashboard className="w-5 h-5" />
             </button>

             <div className="relative w-full max-w-xs hidden md:block">
                <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg text-sm transition-all outline-none"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Icons.Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
             >
                <Icons.Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Campaign</span>
                <span className="sm:hidden">New</span>
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc] scroll-smooth">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'campaigns' && <CampaignTable />}
                {activeTab === 'ai-advisor' && <AiAdvisor campaigns={campaigns} />}
                {activeTab === 'audiences' && <AudienceManager />}
                {activeTab === 'assets' && <AssetLibrary />}
                {activeTab === 'studio' && <AiStudio />}
            </div>
        </div>
      </main>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateCampaign 
          onCancel={handleCancelModal} 
          onSave={handleSaveCampaign}
          initialData={editingCampaign}
        />
      )}
    </div>
  );
};

export default App;