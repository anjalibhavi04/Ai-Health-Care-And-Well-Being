import React, { useState } from 'react';
import { 
  Activity, Calendar, Users, FileText, Settings, 
  MessageSquare, Bell, ChevronRight, Check, X,
  AlertTriangle, FlaskConical, Stethoscope
} from 'lucide-react';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#F8F9FA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Dynamic Font Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=DM+Serif+Display&display=swap');
        
        .font-serif { font-family: 'DM Serif Display', serif; }
        .pulse-dot { 
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>

      {/* 1. Left Sidebar (Fixed 220px) */}
      <aside className="w-[220px] bg-[#085041] text-white flex flex-col shrink-0 overflow-y-auto">
        {/* App Name */}
        <div className="p-6">
          <h1 className="text-2xl font-serif tracking-wide text-white">Svastha</h1>
          <p className="text-[11px] uppercase tracking-widest text-[#669b8f] font-bold mt-1">Health Practice</p>
        </div>

        {/* Navigation Groupings */}
        <nav className="flex-1 px-4 space-y-6">
          
          <div>
            <p className="text-[10px] uppercase text-[#4d8679] font-bold mb-3 px-3 tracking-wider">Main</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all border-none cursor-pointer ${activeTab==='home' ? 'bg-white/10 text-white font-medium' : 'bg-transparent text-white/65 hover:text-white hover:bg-white/5'}`}>
                <Activity size={16} /> Dashboard
              </button>
              <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all border-none cursor-pointer ${activeTab==='appointments' ? 'bg-white/10 text-white font-medium' : 'bg-transparent text-white/65 hover:text-white hover:bg-white/5'}`}>
                <Calendar size={16} /> Appointments
              </button>
              <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all border-none cursor-pointer ${activeTab==='patients' ? 'bg-white/10 text-white font-medium' : 'bg-transparent text-white/65 hover:text-white hover:bg-white/5'}`}>
                <Users size={16} /> Patients
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase text-[#4d8679] font-bold mb-3 px-3 tracking-wider">Communication</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all border-none cursor-pointer ${activeTab==='reports' ? 'bg-white/10 text-white font-medium' : 'bg-transparent text-white/65 hover:text-white hover:bg-white/5'}`}>
                <FileText size={16} /> Reports
              </button>
              <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all border-none cursor-pointer ${activeTab==='messages' ? 'bg-white/10 text-white font-medium' : 'bg-transparent text-white/65 hover:text-white hover:bg-white/5'}`}>
                <div className="flex items-center gap-3"><MessageSquare size={16} /> Messages</div>
                <span className="bg-[#E75B4F] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">5</span>
              </button>
              <button onClick={() => setActiveTab('labs')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all border-none cursor-pointer ${activeTab==='labs' ? 'bg-white/10 text-white font-medium' : 'bg-transparent text-white/65 hover:text-white hover:bg-white/5'}`}>
                <FlaskConical size={16} /> Lab Results
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase text-[#4d8679] font-bold mb-3 px-3 tracking-wider">Settings</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('preferences')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all border-none cursor-pointer ${activeTab==='preferences' ? 'bg-white/10 text-white font-medium' : 'bg-transparent text-white/65 hover:text-white hover:bg-white/5'}`}>
                <Settings size={16} /> Preferences
              </button>
            </div>
          </div>

        </nav>

        {/* Doctor Profile Chip */}
        <div className="p-4 mt-auto">
          <div className="bg-[#0b6351] rounded-lg p-3 flex items-center gap-3 border border-white/5 cursor-pointer hover:bg-[#0c735e] transition">
             <div className="w-9 h-9 rounded-full bg-white text-[#085041] flex items-center justify-center font-bold text-sm shrink-0">DR</div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-white truncate">Dr. Rashmi</p>
               <p className="text-[11px] text-[#86b5a9] truncate">Dermatologist</p>
             </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top bar */}
        <header className="px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Good morning, Dr. Rashmi</h2>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening at your practice today.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white border text-gray-600 border-gray-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium shadow-sm">
               <Calendar size={14} className="text-gray-400"/>
               {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
             </div>
             <button className="relative w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition border-none cursor-pointer">
               <Bell size={18} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E75B4F] rounded-full"></span>
               {/* Pulse Effect */}
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E75B4F] rounded-full pulse-dot"></span>
             </button>
          </div>
        </header>

        <div className="px-8 pb-8 flex-1">
          {/* Stats Row (5 cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* Appointments Today */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Appointments today</span>
              <span className="text-3xl font-black text-[#085041] mt-2 mb-2">12</span>
              <span className="text-[10px] font-bold text-[#148358] bg-[#DFF0E8] px-2 py-1 rounded w-fit">+2 vs yesterday</span>
            </div>
            {/* Pending */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Pending</span>
              <span className="text-3xl font-black text-[#E89E39] mt-2 mb-2">3</span>
              <span className="text-[10px] font-bold text-[#E89E39] bg-[#FFF2DE] px-2 py-1 rounded w-fit">Needs action</span>
            </div>
            {/* New messages */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">New messages</span>
              <span className="text-3xl font-black text-[#E75B4F] mt-2 mb-2">5</span>
              <span className="text-[10px] font-bold text-[#E75B4F] bg-[#FDECEA] px-2 py-1 rounded w-fit">Unread</span>
            </div>
            {/* Active patients */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Active patients</span>
              <span className="text-3xl font-black text-gray-800 mt-2 mb-2">142</span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit">Stable</span>
            </div>
            {/* Treatments due */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Treatments due</span>
              <span className="text-3xl font-black text-[#3679D6] mt-2 mb-2">7</span>
              <span className="text-[10px] font-bold text-[#3679D6] bg-[#EAF2FC] px-2 py-1 rounded w-fit">Due today</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Left Column (Appointments) */}
            <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col align-start justify-start">
               
               {/* Tab Strip */}
               <div className="flex border-b border-gray-100 px-2 pt-2">
                 <button className="px-4 py-3 text-sm font-bold text-[#085041] border-b-2 border-[#085041] bg-transparent cursor-pointer">Today</button>
                 <button className="px-4 py-3 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-gray-600 bg-transparent cursor-pointer">This Week</button>
                 <button className="px-4 py-3 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-gray-600 bg-transparent cursor-pointer">This Month</button>
               </div>

               <div className="divide-y divide-gray-100 p-2">
                 
                 {/* Row 1 */}
                 <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:bg-gray-50/50 rounded-lg transition">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#EAF5F2] text-[#085041] flex items-center justify-center font-bold text-sm">RS</div>
                     <div>
                       <p className="font-bold text-gray-900">Rahul Sharma</p>
                       <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Stethoscope size={14}/> Online video consult</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-6">
                     <p className="text-sm text-gray-900 font-bold whitespace-nowrap">10:30 AM</p>
                     <div className="flex gap-2">
                       <button className="text-[13px] bg-[#085041] text-white px-4 py-1.5 rounded-md font-medium cursor-pointer border-none hover:bg-[#064034] transition">Confirm</button>
                       <button className="text-[13px] bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-md font-medium cursor-pointer hover:bg-gray-50 transition drop-shadow-sm">Reschedule</button>
                     </div>
                   </div>
                 </div>

                 {/* Row 2 */}
                 <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:bg-gray-50/50 rounded-lg transition">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#FDECEA] text-[#E75B4F] flex items-center justify-center font-bold text-sm">PV</div>
                     <div>
                       <p className="font-bold text-gray-900 flex items-center gap-2">Priya Verma <span className="bg-[#FDECEA] text-[#E75B4F] text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest shrink-0">High Priority</span></p>
                       <p className="text-sm font-medium text-gray-500 mt-0.5">In-clinic consult</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-6">
                     <p className="text-sm text-gray-900 font-bold whitespace-nowrap">11:15 AM</p>
                     <div className="flex gap-2">
                       <button className="text-[13px] bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-md font-medium cursor-pointer hover:bg-gray-50 transition drop-shadow-sm">Mark Completed</button>
                     </div>
                   </div>
                 </div>

                 {/* Row 3 */}
                 <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:bg-gray-50/50 rounded-lg transition">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#EAF2FC] text-[#3679D6] flex items-center justify-center font-bold text-sm">AS</div>
                     <div>
                       <p className="font-bold text-gray-900">Amit Singh</p>
                       <p className="text-sm font-medium text-gray-500 mt-0.5">Online follow-up</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-6">
                     <p className="text-sm text-gray-900 font-bold whitespace-nowrap">2:00 PM</p>
                     <div className="flex gap-2">
                       <span className="text-[12px] bg-[#FFF2DE] text-[#E89E39] border border-[#f0cda2] px-3 py-1 rounded-md font-bold">Pending</span>
                     </div>
                   </div>
                 </div>

               </div>
            </div>

            {/* Right Column (Cards stacked) */}
            <div className="w-full lg:w-[320px] xl:w-[400px] flex flex-col gap-6 shrink-0">
               
               {/* Card 1: Patient Focus */}
               <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-900 text-lg">Patient focus</h3>
                   <span className="text-xs font-mono text-gray-400">#SAI-9948</span>
                 </div>

                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 rounded-full bg-[#FDECEA] text-[#E75B4F] flex items-center justify-center font-bold text-lg">AK</div>
                   <div>
                     <p className="font-bold text-gray-900">Anjali K.</p>
                     <span className="bg-[#FDECEA] text-[#E75B4F] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest mt-0.5 inline-block border border-[#f6cdca]">Severe eczema</span>
                   </div>
                 </div>

                 <div className="space-y-3 mb-6 font-medium">
                   <div className="grid grid-cols-3 gap-2">
                     <span className="text-sm text-gray-400 text-right pr-2">History</span>
                     <span className="text-sm text-gray-900 col-span-2">Chronic flare-ups since 2023</span>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     <span className="text-sm text-gray-400 text-right pr-2">Allergies</span>
                     <span className="text-sm text-gray-900 col-span-2">Penicillin, Pollen</span>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     <span className="text-sm text-gray-400 text-right pr-2">Treatment</span>
                     <span className="text-sm text-gray-900 col-span-2">Topical steroids 1%</span>
                   </div>
                 </div>

                 <button className="w-full text-center bg-[#F2F8F6] text-[#085041] hover:bg-[#085041] hover:text-white transition-colors py-2.5 rounded-md text-sm font-bold border-none cursor-pointer">
                   View full profile
                 </button>
               </div>

               {/* Card 2: Urgent Alerts */}
               <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                 <div className="flex items-center justify-between mb-5">
                   <h3 className="font-bold text-gray-900 text-lg">Urgent alerts</h3>
                   {/* Urgent Pulse Dot */}
                   <span className="relative flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E75B4F] opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E75B4F]"></span>
                   </span>
                 </div>

                 <div className="space-y-4">
                   
                   {/* Alert 1 */}
                   <div className="flex gap-3 items-start border-l-2 border-[#E75B4F] pl-3 py-1">
                     <div className="text-[#E75B4F] mt-0.5">
                       <AlertTriangle size={18} />
                     </div>
                     <div className="flex-1">
                       <p className="font-bold text-sm text-gray-900">Suspicious lesion</p>
                       <p className="text-xs text-gray-500 mt-1 mb-2 leading-relaxed">AI flagged image for review.</p>
                       <button className="text-xs border border-[#E75B4F] bg-white text-[#E75B4F] hover:bg-[#E75B4F] hover:text-white transition py-1 px-3 rounded font-bold cursor-pointer">Review now</button>
                     </div>
                   </div>

                   {/* Alert 2 */}
                   <div className="flex gap-3 items-start border-l-2 border-[#3679D6] pl-3 py-1">
                     <div className="text-[#3679D6] mt-0.5">
                       <FlaskConical size={18} />
                     </div>
                     <div className="flex-1">
                       <p className="font-bold text-sm text-gray-900">New lab results</p>
                       <p className="text-xs text-gray-500 mt-1 mb-2 leading-relaxed">Biopsy results for Anjali K. available.</p>
                       <button className="text-xs border border-[#3679D6] bg-white text-[#3679D6] hover:bg-[#3679D6] hover:text-white transition py-1 px-3 rounded font-bold cursor-pointer">View results</button>
                     </div>
                   </div>

                 </div>
               </div>

            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
