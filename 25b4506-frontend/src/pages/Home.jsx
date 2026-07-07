import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import ContactWidget from '../components/ContactWidget';
// Kept only the icons that are actively used in the JSX below
import { ArrowRight, Coffee, Pill, Car, CheckCircle, AlertTriangle } from 'lucide-react'; 

// Dynamic production URL with local fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function Home() {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('cafeteria');
  const [cafeteriaMenu, setCafeteriaMenu] = useState([]);
  const [pharmacyStock, setPharmacyStock] = useState([]);
  const [departments, setDepartments] = useState([]); // Dynamic departments state
  
  const parkingBlocks = [
    { zone: "Basement 1 (OPD Visitors)", total: "150 Bays", open: 12, status: "Nearly Full" },
    { zone: "Basement 2 (General Public)", total: "250 Bays", open: 142, status: "Spaces Available" },
    { zone: "Ground Floor (Emergency Only)", total: "20 Bays", open: 2, status: "Critical Priority Only" },
  ];

  useEffect(() => {
    // Fetch Cafeteria Menu
    fetch(`${API_BASE_URL}/api/cafeteria/`)
      .then(res => res.json())
      .then(data => setCafeteriaMenu(data))
      .catch(err => console.error("Error loading cafeteria data:", err));

    // Fetch Pharmacy Inventory
    fetch(`${API_BASE_URL}/api/pharmacy/`)
      .then(res => res.json())
      .then(data => setPharmacyStock(data))
      .catch(err => console.error("Error loading pharmacy metrics:", err));

    // Fetch All Departments Dynamically
    fetch(`${API_BASE_URL}/api/departments/`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error("Error loading departments:", err));
  }, []);

  return (
    <div className="space-y-8 w-full pb-12">
      <ContactWidget />

      {/* Hero Billboard */}
      <div className="bg-emerald-700 text-white rounded-3xl p-6 md:p-10 text-center space-y-4 shadow-xs">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-xl mx-auto leading-tight">
          Your Health, Guided by Excellence
        </h1>
        <p className="text-emerald-100 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          Welcome to the HopeCare Client Portal. Explore specialized medical units, look up our staff rosters, and book local clinical consults seamlessly.
        </p>
        
        <button 
          onClick={() => navigate('/booking')} 
          className="bg-white text-emerald-800 hover:bg-emerald-50 text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs mx-auto cursor-pointer"
        >
          Schedule a Visit <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Core Services Menu Area (Now fully dynamic) */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Our Medical Services</h2>
          <p className="text-xs text-gray-400 mt-0.5">Select an active branch to explore available practitioners</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-gray-800 text-sm">{dept.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{dept.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Facility & Campus Amenities Tracker */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 md:p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">🏢 Campus Visitor & Patient Guide</h2>
          <p className="text-xs text-gray-400 mt-0.5">Live utility tracking powered dynamically by our facility endpoints</p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-100 overflow-x-auto pb-1 gap-2">
          <button onClick={() => setActiveTab('cafeteria')} className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 shrink-0 border-b-2 ${activeTab === 'cafeteria' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/40' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <Coffee className="w-4 h-4" /> Cafeteria Menu
          </button>
          <button onClick={() => setActiveTab('pharmacy')} className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 shrink-0 border-b-2 ${activeTab === 'pharmacy' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/40' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <Pill className="w-4 h-4" /> Pharmacy Inventory
          </button>
          <button onClick={() => setActiveTab('parking')} className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 shrink-0 border-b-2 ${activeTab === 'parking' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/40' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            <Car className="w-4 h-4" /> Live Parking
          </button>
        </div>

        {/* Dynamic Display Grid */}
        <div className="pt-2">
          {activeTab === 'cafeteria' && (
            <div className="space-y-3">
              <div className="bg-amber-50 text-amber-800 text-[11px] p-2.5 rounded-xl border border-amber-100/70 flex justify-between items-center">
                <span>☕ <strong>24/7 Counter Access:</strong> Snack selections and warm tea counters remain dynamic.</span>
                <span className="font-bold hidden sm:inline-block bg-white px-2 py-0.5 rounded shadow-2xs">UPI Accepted 📱</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {cafeteriaMenu.map((item) => (
                  <div key={item.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/30 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.time_slot}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-slate-800 bg-white border px-2 py-1 rounded-lg shadow-2xs">{item.price}</span>
                      <p className="text-[9px] text-emerald-600 font-bold mt-1">🌱 {item.health_tag}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pharmacy' && (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 font-bold text-gray-500">
                    <th className="p-3">Medicine Designation</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Inventory Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                  {pharmacyStock.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40">
                      <td className="p-3 font-bold text-slate-800">{item.drug_name}</td>
                      <td className="p-3 text-gray-400">{item.category}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {item.status === 'In Stock' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {item.quantity_display}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'parking' && (
            <div className="grid sm:grid-cols-3 gap-4">
              {parkingBlocks.map((block, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-3 shadow-2xs">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{block.zone}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Total Allocation: {block.total}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className={block.open < 15 ? 'text-red-600' : 'text-emerald-600'}>{block.open} Bays Open</span>
                      <span className="text-gray-400">{block.status}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${block.open < 15 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(block.open / parseInt(block.total)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}