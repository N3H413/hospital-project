import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Mail, Calendar, Clock, ClipboardList, ShieldAlert, XCircle, Stethoscope } from 'lucide-react';
import ContactWidget from '../components/ContactWidget';

// Dynamic production URL with local fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function Dashboard() {
  const location = useLocation();
  
  const initialEmail = location.state?.registeredEmail || '';
  const hasAutomatedEmail = !!initialEmail;

  const [email, setEmail] = useState(initialEmail);
  const [appointments, setAppointments] = useState([]);
  const [doctorsLedger, setDoctorsLedger] = useState([]); // Holds names for lookup matching
  const [loading, setLoading] = useState(hasAutomatedEmail);
  const [searched, setSearched] = useState(hasAutomatedEmail);
  const [error, setError] = useState(null);

  // 1. Fetch active doctors cache once on mounting to cross-reference numeric IDs
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/doctors/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setDoctorsLedger(data))
      .catch(err => console.error("Could not build identity cache ledger:", err));
  }, []);

  const fetchBookings = useCallback((targetEmail) => {
    if (!targetEmail.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    fetch(`${API_BASE_URL}/api/appointments/?email=${encodeURIComponent(targetEmail)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Could not pull records matching that registration key.');
        return res.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCancel = (id) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled appointment?")) return;

    fetch(`${API_BASE_URL}/api/appointments/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Could not process cancellation request on the server.');
        return res.json();
      })
      .then((updatedApp) => {
        setAppointments(prev => prev.map(app => app.id === id ? updatedApp : app));
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    const forwardedEmail = location.state?.registeredEmail;
    if (forwardedEmail) {
      const deferTimer = setTimeout(() => {
        fetchBookings(forwardedEmail);
      }, 0);
      
      return () => clearTimeout(deferTimer);
    }
  }, [location.state?.registeredEmail, fetchBookings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBookings(email);
  };

  // Helper matching engine to find human identities for structural row elements
  const getDoctorMetaString = (doctorId) => {
    if (!doctorsLedger || doctorsLedger.length === 0) return `Physician Ref #${doctorId}`;
    const matched = doctorsLedger.find(d => d.id === doctorId);
    return matched ? `${matched.name} (${matched.specialization})` : `Physician Ref #${doctorId}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 w-full px-4 pb-12">
      <ContactWidget />

      {/* Search Header Interface */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Patient Care Ledger</h1>
          <p className="text-xs text-gray-500 mt-0.5">Enter your registered email below to sync and display your active medical itineraries</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@example.com"
              className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <button type="submit" disabled={loading} className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Pull Ledger'}
          </button>
        </form>
      </div>

      {/* Main Results Display Logic Area */}
      <div className="space-y-4">
        {loading && (
          <div className="flex justify-center items-center py-12 gap-2 text-sm text-gray-500">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Scanning patient file records...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm text-center">
            ⚠️ {error}
          </div>
        )}

        {!loading && !searched && (
          <div className="border border-dashed border-gray-200 rounded-2xl py-16 text-center text-sm text-gray-400 flex flex-col items-center gap-2 bg-white/50">
            <ClipboardList className="w-8 h-8 text-gray-300" />
            <p>No query submitted yet. Provide a valid email handle to pull verification data.</p>
          </div>
        )}

        {!loading && searched && appointments.length === 0 && !error && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-sm max-w-md mx-auto space-y-2">
            <ShieldAlert className="w-7 h-7 text-amber-500 mx-auto" />
            <h3 className="font-bold text-gray-800 text-base">No Appointments Found</h3>
            <p className="text-gray-500 text-xs px-4">
              We couldn't locate any records for <strong>{email}</strong>. Check your spelling or book a fresh session via the entry form.
            </p>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed Bookings ({appointments.length})</span>
            </div>
            
            {appointments.map((app) => (
              <div key={app.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs hover:border-emerald-100 transition-all grid md:grid-cols-3 gap-4 items-center relative">
                
                {/* Column 1: Patient Anchor & Status Badge */}
                <div className="space-y-1 border-b md:border-b-0 pb-3 md:pb-0 border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-gray-500">Patient Case</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                      app.status === 'cancelled'
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {app.status || 'confirmed'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base mt-1">{app.patient_name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">{app.patient_phone}</p>
                </div>

                {/* Column 2: Date, Time & Dynamic Practitioner Resolution */}
                <div className="space-y-2 md:border-x md:border-gray-50 md:px-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Date:</strong> {app.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Slot:</strong> {app.time_slot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 mt-1 font-medium">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{getDoctorMetaString(app.doctor)}</span>
                  </div>
                </div>

                {/* Column 3: Clinical Context Notes & Cancellation Button */}
                <div className="space-y-3 text-xs flex flex-col justify-between h-full">
                  <div>
                    <span className="font-bold text-gray-700 block">Symptoms / Notes:</span>
                    <p className="text-gray-600 leading-relaxed italic bg-slate-50/50 p-2 rounded border border-slate-100">
                      "{app.symptoms || 'No specific clinical symptoms cataloged.'}"
                    </p>
                  </div>

                  {app.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(app.id)}
                      className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold transition-colors self-end cursor-pointer mt-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Session
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}