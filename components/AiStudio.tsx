import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { generateAdCreative, generateAdImage, generateVideoScript, analyzeCompetitors, generateVideoAd } from '../services/geminiService';
import { CampaignType, GeneratedAdContent } from '../types';

type StudioTab = 'copy' | 'image' | 'video' | 'competitor';
type VideoMode = 'script' | 'generate';

export const AiStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('copy');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Copywriter State
  const [copyForm, setCopyForm] = useState({
    name: '',
    desc: '',
    audience: '',
    negative: ''
  });

  // Image State
  const [imagePrompt, setImagePrompt] = useState('');
  
  // Video State
  const [videoForm, setVideoForm] = useState({ topic: '', duration: '30 seconds' });
  const [videoMode, setVideoMode] = useState<VideoMode>('script');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Competitor State
  const [competitorUrl, setCompetitorUrl] = useState('');

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if ((window as any).aistudio?.hasSelectedApiKey) {
      const has = await (window as any).aistudio.hasSelectedApiKey();
      setHasApiKey(has);
    } else {
        setHasApiKey(true); 
    }
  };

  const handleSelectApiKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      checkApiKey();
    }
  };

  const handleCopyGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await generateAdCreative(
        copyForm.name,
        copyForm.desc,
        copyForm.audience,
        CampaignType.SEARCH, 
        copyForm.negative
      );
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await generateAdImage(imagePrompt);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (videoMode === 'script') {
        const res = await generateVideoScript(videoForm.topic, videoForm.duration);
        setResult({ type: 'text', content: res });
      } else {
        const res = await generateVideoAd(videoForm.topic, videoForm.duration);
        setResult({ type: 'video', content: res });
      }
    } catch (e) {
      console.error(e);
      setResult({ type: 'error', content: "Failed to generate video. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitorAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeCompetitors(competitorUrl);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex gap-2 p-4 border-b border-gray-200 overflow-x-auto no-scrollbar">
      <button 
        onClick={() => { setActiveTab('copy'); setResult(null); }}
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'copy' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <Icons.Edit className="w-4 h-4" />
        Ad Copywriter
      </button>
      <button 
        onClick={() => { setActiveTab('image'); setResult(null); }}
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <Icons.Assets className="w-4 h-4" />
        Image Generator
      </button>
      <button 
        onClick={() => { setActiveTab('video'); setResult(null); }}
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <Icons.Video className="w-4 h-4" />
        Video Studio
      </button>
      <button 
        onClick={() => { setActiveTab('competitor'); setResult(null); }}
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'competitor' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <Icons.Globe className="w-4 h-4" />
        Competitor Spy
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100dvh-140px)]">
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-white flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Icons.Studio className="w-6 h-6 text-blue-600" />
            AI Creative Studio
        </h2>
        <p className="text-sm text-gray-500 mt-1 hidden sm:block">
            Generate assets, scripts, and insights for your campaigns.
        </p>
      </div>

      {renderTabs()}

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Input Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icons.Settings className="w-4 h-4 text-gray-400" />
                    Configuration
                </h3>

                {activeTab === 'copy' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-base" value={copyForm.name} onChange={e => setCopyForm({...copyForm, name: e.target.value})} placeholder="e.g. SuperShoes" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea className="w-full px-3 py-2 border rounded-lg text-base" rows={3} value={copyForm.desc} onChange={e => setCopyForm({...copyForm, desc: e.target.value})} placeholder="What are you selling?" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-base" value={copyForm.audience} onChange={e => setCopyForm({...copyForm, audience: e.target.value})} placeholder="e.g. Runners" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Negative Keywords</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-base" value={copyForm.negative} onChange={e => setCopyForm({...copyForm, negative: e.target.value})} placeholder="e.g. cheap, free" />
                        </div>
                        <button onClick={handleCopyGenerate} disabled={loading || !copyForm.name} className="w-full bg-blue-600 text-white py-3 sm:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 touch-manipulation">
                            {loading ? 'Generating...' : 'Generate Copy'}
                        </button>
                    </div>
                )}

                {activeTab === 'image' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image Prompt</label>
                            <textarea className="w-full px-3 py-2 border rounded-lg text-base" rows={4} value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="Describe the image you want to generate..." />
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                            <Icons.AI className="w-3 h-3 inline mr-1" />
                            Powered by Gemini 2.5 Flash Image
                        </div>
                        <button onClick={handleImageGenerate} disabled={loading || !imagePrompt} className="w-full bg-blue-600 text-white py-3 sm:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 touch-manipulation">
                            {loading ? 'Generating...' : 'Generate Image'}
                        </button>
                    </div>
                )}

                {activeTab === 'video' && (
                    <div className="space-y-4">
                         <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                           <button 
                             onClick={() => { setVideoMode('script'); setResult(null); }}
                             className={`flex-1 py-2 sm:py-1.5 text-sm font-medium rounded-md transition-all touch-manipulation ${videoMode === 'script' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                           >
                             Script Writer
                           </button>
                           <button 
                             onClick={() => { setVideoMode('generate'); setResult(null); }}
                             className={`flex-1 py-2 sm:py-1.5 text-sm font-medium rounded-md transition-all touch-manipulation ${videoMode === 'generate' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                           >
                             Video Generator
                           </button>
                         </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-base" value={videoForm.topic} onChange={e => setVideoForm({...videoForm, topic: e.target.value})} placeholder="e.g. Product Launch for X" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <select className="w-full px-3 py-2 border rounded-lg text-base bg-white" value={videoForm.duration} onChange={e => setVideoForm({...videoForm, duration: e.target.value})}>
                                <option>15 seconds</option>
                                <option>30 seconds</option>
                                <option>60 seconds</option>
                            </select>
                        </div>
                        
                        {videoMode === 'generate' && !hasApiKey && (window as any).aistudio?.hasSelectedApiKey ? (
                             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800 mb-2">Video generation requires a paid API key.</p>
                                <button onClick={handleSelectApiKey} className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 text-sm font-medium">
                                    Select API Key
                                </button>
                                <div className="mt-2 text-xs text-yellow-700">
                                   <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline">Billing Documentation</a>
                                </div>
                             </div>
                        ) : (
                            <>
                                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                                    <Icons.AI className="w-3 h-3 inline mr-1" />
                                    Powered by {videoMode === 'generate' ? 'Veo 3.1' : 'Gemini 2.5'}
                                </div>
                                <button onClick={handleVideoGenerate} disabled={loading || !videoForm.topic} className="w-full bg-blue-600 text-white py-3 sm:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 touch-manipulation">
                                    {loading ? (videoMode === 'generate' ? 'Creating Video...' : 'Writing Script...') : (videoMode === 'generate' ? 'Generate Video' : 'Generate Script')}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'competitor' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Competitor URL</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-base" value={competitorUrl} onChange={e => setCompetitorUrl(e.target.value)} placeholder="https://competitor.com" />
                        </div>
                        <button onClick={handleCompetitorAnalyze} disabled={loading || !competitorUrl} className="w-full bg-blue-600 text-white py-3 sm:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 touch-manipulation">
                            {loading ? 'Analyzing...' : 'Analyze Strategy'}
                        </button>
                    </div>
                )}
            </div>

            {/* Output Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
                 <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icons.AI className="w-4 h-4 text-purple-500" />
                    AI Output
                </h3>
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p>{videoMode === 'generate' && activeTab === 'video' ? 'Generating video...' : 'Working on it...'}</p>
                    </div>
                ) : !result ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                        <Icons.Studio className="w-12 h-12 mb-2 opacity-20" />
                        <p>Results will appear here</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in space-y-4">
                        {/* Copy Result */}
                        {activeTab === 'copy' && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase">Headlines</h4>
                                    <ul className="list-disc pl-5 text-sm space-y-1 mt-1 break-words">
                                        {(result as GeneratedAdContent).headlines.map((h, i) => <li key={i}>{h}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase">Descriptions</h4>
                                    <ul className="list-disc pl-5 text-sm space-y-1 mt-1 break-words">
                                        {(result as GeneratedAdContent).descriptions.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                                    <strong>Tip:</strong> {(result as GeneratedAdContent).strategyAdvice}
                                </div>
                            </div>
                        )}

                        {/* Image Result */}
                        {activeTab === 'image' && (
                             <div className="flex flex-col items-center">
                                 <img src={result as string} alt="Generated Ad" className="w-full rounded-lg shadow-md mb-4" />
                                 <button className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
                                     <Icons.Upload className="w-4 h-4" />
                                     Save to Asset Library
                                 </button>
                             </div>
                        )}

                        {/* Video Result */}
                        {activeTab === 'video' && result.type === 'video' && (
                            <div className="flex flex-col items-center">
                                <video controls className="w-full rounded-lg shadow-md mb-4" src={result.content}></video>
                                <button className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
                                     <Icons.Upload className="w-4 h-4" />
                                     Save to Asset Library
                                 </button>
                            </div>
                        )}

                        {activeTab === 'video' && result.type === 'text' && (
                             <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-[500px] whitespace-pre-wrap break-words">
                                {result.content}
                            </div>
                        )}

                        {activeTab === 'video' && result.type === 'error' && (
                            <div className="text-red-500 text-center p-4">
                                {result.content}
                            </div>
                        )}

                        {/* Competitor Result (Text) */}
                        {activeTab === 'competitor' && (
                            <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto max-h-[500px] whitespace-pre-wrap break-words">
                                {result as string}
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};