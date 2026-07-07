import { Clock } from 'lucide-react';

export default function TimeSlotSelector({ selectedSlot, onSelectSlot }) {
  // Configured using standard Indian Standard Time (IST) brackets
  const standardSlots = [
    '09:00 AM IST', '10:00 AM IST', '11:00 AM IST', 
    '12:00 PM IST', '02:00 PM IST', '03:00 PM IST', '04:00 PM IST'
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-slate-400" /> 
        Select an Available Time Slot (IST)
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {standardSlots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm scale-[0.98]'
                  : 'bg-slate-50 border-gray-200 text-gray-700 hover:border-emerald-400 hover:bg-white'
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}