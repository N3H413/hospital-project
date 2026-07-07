import { Phone, ShieldAlert, Clock, Building } from 'lucide-react';

export default function ContactWidget() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto my-6">
      {/* Emergency Immediate Action Card */}
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/60 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
        <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs animate-pulse">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100/50 px-2 py-0.5 rounded-full">
            24/7 Critical Trauma
          </span>
          <h2 className="text-sm font-bold text-gray-800">Emergency Care Line</h2>
          <p className="text-xs text-gray-600 leading-relaxed">For acute medical emergencies, surgical trauma, or immediate ambulance dispatch:</p>
          <a href="tel:+912255559111" className="inline-flex items-center gap-1.5 text-base font-extrabold text-red-600 hover:underline mt-1">
            <Phone className="w-4 h-4" />
            +91 (22) 5555-9111
          </a>
        </div>
      </div>

      {/* Routine Outpatient / Admin Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
          <Building className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            General Inquiries
          </span>
          <h2 className="text-sm font-bold text-gray-800">OPD & Help Desk</h2>
          <p className="text-xs text-gray-600 leading-relaxed">For booking modifications, corporate checkups, billing logs, or administrative records:</p>
          <div className="flex flex-col gap-1 mt-1">
            <a href="tel:+919876501992" className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:underline">
              <Phone className="w-3.5 h-3.5" />
              +91 98765 01992
            </a>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Mon - Sat: 8:00 AM – 6:00 PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}