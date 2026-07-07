import { useEffect, useState } from 'react';
import { Calendar, Star, Award, Heart, Baby, Bone } from 'lucide-react';

// Dynamic production URL with local fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/doctors/`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to retrieve medical staff ledger.');
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Contextual helper to match icons & styling based on doctor credentials text
  const getDepartmentSpecs = (specialization) => {
    const spec = (specialization || '').toLowerCase();
    if (spec.includes('cardio') || spec.includes('heart')) {
      return { icon: <Heart className="w-6 h-6 fill-red-50" />, style: 'bg-red-50 text-red-500 border-red-100' };
    }
    if (spec.includes('pediat') || spec.includes('neonatal') || spec.includes('child')) {
      return { icon: <Baby className="w-6 h-6 fill-blue-50" />, style: 'bg-blue-50 text-blue-500 border-blue-100' };
    }
    if (spec.includes('ortho') || spec.includes('joint') || spec.includes('bone')) {
      return { icon: <Bone className="w-6 h-6 fill-amber-50" />, style: 'bg-amber-50 text-amber-600 border-amber-100' };
    }
    // Universal medical fallback default configuration
    return { icon: <Heart className="w-6 h-6 fill-emerald-50" />, style: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium text-sm">Loading practitioner directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-xl max-w-xl mx-auto text-center my-12">
        <p className="font-semibold">Directory Error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Our Senior Medical Roster</h1>
        <p className="text-xs text-gray-400 mt-0.5">Vetted specialist practitioners available for clinical bookings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {doctors.map((doc) => {
          // Dynamic evaluation for active card
          const { icon, style } = getDepartmentSpecs(doc.specialization);

          return (
            <div key={doc.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-4 hover:border-emerald-300 transition-all justify-between">
              
              {/* Dynamic matching avatar graphic block */}
              <div className={`w-16 h-16 border rounded-2xl flex items-center justify-center shrink-0 mx-auto sm:mx-0 ${style}`}>
                {icon}
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {doc.specialization}
                    </span>
                    <h3 className="text-base font-bold text-gray-800 mt-1">{doc.name}</h3>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs bg-amber-50/60 px-2 py-1 rounded-lg shrink-0 w-max mx-auto sm:mx-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {doc.rating || "4.9"}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {doc.degree || "MBBS, MD / Specialist"}
                </p>

                <div className="bg-slate-50/80 border border-slate-100/50 p-2.5 rounded-xl flex gap-2 text-[11px] text-gray-600 mt-2 text-left">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-700 block mb-0.5">Weekly Availability:</span>
                    {doc.schedule_info}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}