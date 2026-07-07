import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, AlertCircle, User, Activity, Clock } from 'lucide-react';
import TimeSlotSelector from '../components/TimeSlotSelector';

// Dynamic production URL with local fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function Booking() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    date: '',
    time_slot: '',
    symptoms: '',
    department: '',
    doctor: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/departments/`)
      .then((res) => res.ok ? res.json() : [])
      // DEFENSIVE GUARD: Force fallback to empty array if response is not an array
      .then((data) => setDepartments(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Department fetch failure:', err));

    fetch(`${API_BASE_URL}/api/doctors/`)
      .then((res) => res.ok ? res.json() : [])
      // DEFENSIVE GUARD: Force fallback to empty array if response is not an array
      .then((data) => setAllDoctors(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Doctor fetch failure:', err));
  }, []);

  // Safe filtering that guarantees array checks before executing processing arrays
  const selectableDoctors = Array.isArray(allDoctors)
    ? allDoctors.filter((doc) => String(doc.department) === String(formData.department))
    : [];

  const chosenDoctorObj = Array.isArray(allDoctors)
    ? allDoctors.find((d) => d.id === parseInt(formData.doctor))
    : null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      department: e.target.value,
      doctor: '' 
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.time_slot) {
      setFormError("Please click and select an available time slot below before confirming.");
      return;
    }
    setSubmitting(true);
    setFormError(null);

    const submissionPayload = {
      patient_name: formData.patient_name,
      patient_email: formData.patient_email,
      patient_phone: formData.patient_phone,
      date: formData.date,
      time_slot: formData.time_slot,
      symptoms: formData.symptoms,
      doctor: parseInt(formData.doctor)
    };

    fetch(`${API_BASE_URL}/api/appointments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionPayload)
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const systemMessage = Object.values(errorData).flat().join(' ') 
            || 'Submission rejected. Please check all fields.';
          throw new Error(systemMessage);
        }
        return res.json();
      })
      .then(() => {
        setSubmitting(false);
        navigate('/dashboard', { state: { registeredEmail: formData.patient_email } });
      })
      .catch((err) => {
        setFormError(err.message);
        setSubmitting(false);
      });
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 my-6 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Schedule Clinical Consultation</h1>
          <p className="text-xs text-gray-500">Provide details below to book your appointment slot</p>
        </div>
      </div>

      {formError && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-lg text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{formError}</p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
          <input 
            type="text" 
            name="patient_name" 
            required 
            value={formData.patient_name} 
            onChange={handleInputChange} 
            className="w-full bg-slate-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" 
            placeholder="John Doe" 
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="patient_email" 
              required 
              value={formData.patient_email} 
              onChange={handleInputChange} 
              className="w-full bg-slate-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" 
              placeholder="johndoe@example.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              name="patient_phone" 
              required 
              value={formData.patient_phone} 
              onChange={handleInputChange} 
              className="w-full bg-slate-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" 
              placeholder="+91 98765 43210" 
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-gray-400" /> Department
            </label>
            <select 
              name="department" 
              required 
              value={formData.department} 
              onChange={handleDepartmentChange} 
              className="w-full bg-slate-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            >
              <option value="">Select Department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-gray-400" /> Doctor
            </label>
            <select 
              name="doctor" 
              required 
              value={formData.doctor} 
              disabled={!formData.department} 
              onChange={handleInputChange} 
              className="w-full bg-slate-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.department ? "Select department first..." : "Select Practitioner..."}
              </option>
              {selectableDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialization})</option>
              ))}
            </select>

            {formData.doctor && chosenDoctorObj && (
              <p className="mt-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100/50">
                ⚠️ <strong>Hours:</strong> {chosenDoctorObj.schedule_info || 'Standard Operational Hours'}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" /> Target Date
          </label>
          <input 
            type="date" 
            name="date" 
            required 
            value={formData.date} 
            onChange={handleInputChange} 
            className="w-full bg-slate-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all" 
          />
        </div>

        {/* CONNECTED COMPONENT: Now explicitly maps with selectedSlot and onSelectSlot props */}
        <div className="pt-2">
          <TimeSlotSelector 
            selectedSlot={formData.time_slot} 
            onSelectSlot={(slot) => setFormData(prev => ({ ...prev, time_slot: slot }))} 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Symptoms & Clinical Notes (Optional)</label>
          <textarea 
            name="symptoms" 
            rows="3" 
            value={formData.symptoms} 
            onChange={handleInputChange} 
            className="w-full bg-slate-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none" 
            placeholder="Brief description of symptoms..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={submitting} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-wait mt-2 cursor-pointer"
        >
          {submitting ? 'Transmitting Data...' : 'Confirm Registration'}
        </button>
      </form>
    </div>
  );
}