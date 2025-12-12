import React, { useState } from 'react';
import { Icons } from './Icons';
import { CampaignType, GeneratedAdContent, Campaign, AdSchedule, DailySchedule } from '../types';
import { generateAdCreative, scanWebsiteContent } from '../services/geminiService';

interface CreateCampaignProps {
  onCancel: () => void;
  onSave: (data: Partial<Campaign>) => void;
  initialData?: Campaign | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CreateCampaign: React.FC<CreateCampaignProps> = ({ onCancel, onSave, initialData }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSources, setScanSources] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || CampaignType.SEARCH,
    budget: initialData?.budget || 50,
    productName: initialData?.productName || '',
    productDescription: initialData?.productDescription || '',
    targetAudience: initialData?.targetAudience || '',
    url: initialData?.landingPageUrl || '',
    negativeKeywords: initialData?.negativeKeywords || ''
  });

  // Schedule State
  const defaultScheduleDays: Record<string, DailySchedule> = DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { start: '09:00', end: '17:00', active: true }
  }), {});

  const [adSchedule, setAdSchedule] = useState<AdSchedule>(initialData?.adSchedule || {
    type: '24/7',
    days: defaultScheduleDays
  });

  const [aiContent, setAiContent] = useState<GeneratedAdContent | null>(null);
  const [selectedHeadline, setSelectedHeadline] = useState<string>('');
  const [selectedDesc, setSelectedDesc] = useState<string>('');

  const handleScanUrl = async () => {
    if (!formData.url) return;
    setIsScanning(true);
    setScanSources([]);
    
    try {
      const data = await scanWebsiteContent(formData.url);
      setFormData(prev => ({
        ...prev,
        productName: data.productName,
        productDescription: data.productDescription,
        targetAudience: data.targetAudience
      }));
      if (data.sources) {
        setScanSources(data.sources);
      }
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.productName || !formData.productDescription) return;
    
    setLoading(true);
    try {
      const content = await generateAdCreative(
        formData.productName,
        formData.productDescription,
        formData.targetAudience,
        formData.type,
        formData.negativeKeywords
      );
      setAiContent(content);
      if (content.headlines.length > 0) setSelectedHeadline(content.headlines[0]);
      if (content.descriptions.length > 0) setSelectedDesc(content.descriptions[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = () => {
    const campaignData: Partial<Campaign> = {
      name: formData.name,
      type: formData.type,
      budget: formData.budget,
      productName: formData.productName,
      productDescription: formData.productDescription,
      targetAudience: formData.targetAudience,
      landingPageUrl: formData.url,
      negativeKeywords: formData.negativeKeywords,
      adSchedule: adSchedule
    };
    onSave(campaignData);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base"
          placeholder="e.g. Summer Sale 2024"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.values(CampaignType).map((type) => (
            <div 
              key={type}
              onClick={() => setFormData({...formData, type})}
              className={`cursor-pointer p-3 sm:p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 touch-manipulation ${
                formData.type === type 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-full ${formData.type === type ? 'bg-blue-100' : 'bg-gray-100'}`}>
                 {type === CampaignType.SEARCH && <Icons.Search className="w-5 h-5" />}
                 {type === CampaignType.DISPLAY && <Icons.Dashboard className="w-5 h-5" />}
                 {type === CampaignType.SOCIAL && <Icons.User className="w-5 h-5" />}
                 {type === CampaignType.VIDEO && <Icons.Campaigns className="w-5 h-5" />}
                 {type === CampaignType.AFFILIATE && <Icons.TrendUp className="w-5 h-5" />}
              </div>
              <span className="font-medium text-xs sm:text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Budget ($)</label>
        <div className="relative">
          <Icons.Cost className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="number" 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
            value={formData.budget}
            onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
          />
        </div>
      </div>

      <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ad Schedule</label>
          <div className="flex gap-4 mb-4">
              <button 
                  onClick={() => setAdSchedule({...adSchedule, type: '24/7'})}
                  className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-all touch-manipulation ${adSchedule.type === '24/7' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                  <Icons.Clock className="w-4 h-4" />
                  <span className="text-sm">Run 24/7</span>
              </button>
              <button 
                   onClick={() => setAdSchedule({...adSchedule, type: 'custom'})}
                   className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-all touch-manipulation ${adSchedule.type === 'custom' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                  <Icons.Calendar className="w-4 h-4" />
                  <span className="text-sm">Custom</span>
              </button>
          </div>

          {adSchedule.type === 'custom' && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                  {DAYS.map(day => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-1 border-b sm:border-none border-gray-100 last:border-0">
                          <div className="w-full sm:w-28 flex-shrink-0 flex justify-between sm:block">
                              <span className="text-sm font-medium text-gray-900">{day}</span>
                              <label className="inline-flex items-center cursor-pointer">
                                  <input 
                                      type="checkbox" 
                                      className="sr-only peer"
                                      checked={adSchedule.days[day]?.active ?? true}
                                      onChange={(e) => {
                                          const newDays = {...adSchedule.days};
                                          newDays[day] = {...(newDays[day] || {start: '09:00', end: '17:00'}), active: e.target.checked};
                                          setAdSchedule({...adSchedule, days: newDays});
                                      }}
                                  />
                                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                          </div>
                          {(adSchedule.days[day]?.active ?? true) && (
                              <div className="flex items-center gap-2 w-full">
                                  <input 
                                      type="time" 
                                      className="flex-1 px-2 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-white"
                                      value={adSchedule.days[day]?.start || '09:00'}
                                      onChange={(e) => {
                                          const newDays = {...adSchedule.days};
                                          newDays[day] = {...(newDays[day] || {end: '17:00', active: true}), start: e.target.value};
                                          setAdSchedule({...adSchedule, days: newDays});
                                      }}
                                  />
                                  <span className="text-gray-400 text-sm font-medium">to</span>
                                  <input 
                                      type="time" 
                                      className="flex-1 px-2 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-white"
                                      value={adSchedule.days[day]?.end || '17:00'}
                                      onChange={(e) => {
                                          const newDays = {...adSchedule.days};
                                          newDays[day] = {...(newDays[day] || {start: '09:00', active: true}), end: e.target.value};
                                          setAdSchedule({...adSchedule, days: newDays});
                                      }}
                                  />
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Landing Page URL</label>
        <div className="flex gap-2">
            <input 
              type="url" 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="https://example.com/product"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
            <button
                onClick={handleScanUrl}
                disabled={isScanning || !formData.url}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap touch-manipulation"
            >
                {isScanning ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Icons.AI className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Auto-fill</span>
            </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
        <Icons.AI className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Gemini AI Creative Assistant</h4>
          <p className="text-xs sm:text-sm text-blue-700 mt-1">
            Describe your product, and our AI will generate optimized headlines, descriptions, and keywords.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product/Service Name</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="e.g. EcoFresh Water Bottle"
              value={formData.productName}
              onChange={e => setFormData({...formData, productName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description & USP</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-base"
              placeholder="Describe what you are selling..."
              value={formData.productDescription}
              onChange={e => setFormData({...formData, productDescription: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="e.g. Hikers"
              value={formData.targetAudience}
              onChange={e => setFormData({...formData, targetAudience: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Negative Keywords</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
              placeholder="e.g. cheap, free"
              value={formData.negativeKeywords}
              onChange={e => setFormData({...formData, negativeKeywords: e.target.value})}
            />
          </div>
          
          <button 
            onClick={handleGenerateAI}
            disabled={loading || !formData.productName}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors touch-manipulation ${
              loading || !formData.productName
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Icons.AI className="w-5 h-5" />
                Generate Creative
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-col h-full min-h-[300px]">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.Search className="w-4 h-4" />
            Ad Preview
          </h3>
          
          {aiContent ? (
            <div className="space-y-6 flex-1 overflow-y-auto">
               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 font-sans">
                  <div className="flex items-center gap-2 text-xs text-gray-900 mb-1">
                    <span className="font-bold">Ad</span>
                    <span className="text-gray-500">· {formData.url || 'example.com'}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl text-blue-800 hover:underline cursor-pointer font-medium leading-tight break-words">
                    {selectedHeadline || 'Your Headline Here'}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1 leading-snug break-words">
                    {selectedDesc || 'Your ad description will appear here.'}
                  </p>
               </div>

               <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Headlines</h5>
                  <div className="flex flex-wrap gap-2">
                    {aiContent.headlines.map((h, i) => (
                      <button 
                        key={i}
                        onClick={() => setSelectedHeadline(h)}
                        className={`text-sm px-3 py-2 rounded-full border transition-colors text-left touch-manipulation ${
                          selectedHeadline === h 
                          ? 'bg-blue-100 border-blue-300 text-blue-800' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descriptions</h5>
                  <div className="space-y-2">
                    {aiContent.descriptions.map((d, i) => (
                      <button 
                        key={i}
                        onClick={() => setSelectedDesc(d)}
                        className={`text-sm p-3 rounded-lg border w-full text-left transition-colors touch-manipulation ${
                          selectedDesc === d
                          ? 'bg-blue-100 border-blue-300 text-blue-800' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
               </div>
               
               {aiContent.strategyAdvice && (
                   <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                       <h5 className="text-xs font-bold text-amber-800 uppercase mb-1">Gemini Strategy Tip</h5>
                       <p className="text-xs text-amber-900 leading-relaxed italic">"{aiContent.strategyAdvice}"</p>
                   </div>
               )}

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Icons.AI className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-sm">Enter details to see AI magic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
       {/* Backdrop */}
       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={onCancel} />
       
       {/* Modal Window */}
       <div className="bg-white w-full h-[100dvh] sm:h-[90vh] sm:max-w-4xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto transition-transform duration-300 transform translate-y-0 relative">
        
        {/* Header */}
        <div className="px-4 sm:px-8 py-4 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
             <button onClick={step === 1 ? onCancel : () => setStep(step - 1)} className="sm:hidden p-1 -ml-1 text-gray-500">
               {step === 1 ? <Icons.X className="w-6 h-6"/> : <Icons.Back className="w-6 h-6"/>}
             </button>
             <h2 className="text-lg sm:text-xl font-bold text-gray-900">{initialData ? 'Edit Campaign' : 'New Campaign'}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50/50 pb-20 sm:pb-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-300 text-center px-4">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                 <Icons.Active className="w-8 h-8 text-green-600" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900">Ready to Publish!</h3>
               <p className="text-gray-500 mt-2 max-w-md">
                 Your campaign <strong>{formData.name}</strong> is ready.
               </p>
               <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 w-full max-w-md shadow-sm text-left">
                 <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium">${formData.budget}/day</span>
                 </div>
                 <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium">{formData.type}</span>
                 </div>
                 <div className="flex justify-between py-2 pt-4">
                    <span className="text-gray-500">Headline</span>
                    <span className="font-medium text-right text-sm max-w-[150px] truncate">{selectedHeadline || 'N/A'}</span>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-8 py-4 border-t border-gray-100 bg-white flex justify-between sm:justify-end gap-3 flex-shrink-0 absolute bottom-0 left-0 right-0 sm:static">
          <button 
            onClick={onCancel}
            className="hidden sm:block px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="hidden sm:block px-5 py-2.5 text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button 
              onClick={() => {
                if(step === 1 && !formData.name) return; // Simple validation
                setStep(step + 1)
              }}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 touch-manipulation"
            >
              Next Step
              <Icons.TrendUp className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleFinalSave}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-all touch-manipulation"
            >
              {initialData ? 'Update Campaign' : 'Publish Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};