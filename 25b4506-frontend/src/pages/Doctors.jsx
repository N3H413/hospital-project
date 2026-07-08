import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Calendar, User, Layers } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function Doctors() {
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initialize state directly from location to avoid synchronous useEffect updates
  const [selectedDeptId, setSelectedDeptId] = useState(
    location.state?.selectedDepartmentId ? location.state.selectedDepartmentId.toString() : ''
  );

  // 2. Track previous location state inline to capture routing updates without an effect
  const [prevLocationState, setPrevLocationState] = useState(location.state);

  if (location.state !== prevLocationState) {
    setPrevLocationState(location.state);
    setSelectedDeptId(location.state?.selectedDepartmentId ? location.state.selectedDepartmentId.toString() : '');
  }

  // Pure data subscription effects are safe and optimal
  useEffect(() => {
    // Fetch flat doctors list
    fetch(`${API_BASE_URL}/api/doctors/`)
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error("Error loading doctors:", err));

    // Fetch departments framework for lookup maps
    fetch(`${API_BASE_URL}/api/departments/`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error("Error loading departments lookup context:", err));
  }, []);

  // Helper function to resolve structural department relational text names
  const getDepartmentName = (deptId) => {
    const matchedDept = departments.find(d => d.id === Number(deptId));
    return matchedDept ? matchedDept.name : 'General Medical Units';
  };

  // Comprehensive pipeline handling combined search strings + active department selections
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDept = 
      selectedDeptId === '' || 
      doctor.department.toString() === selectedDeptId;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header Context */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-800">Our Medical Practitioners</h1>
        <p className="text-xs text-gray-400 mt-0.5">Search staff rosters or filter clinical capabilities instantly</p>
      </div>

      {/* Control Panel: Search & Filter Stack */}
      <div className="grid md:grid-cols-3 gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-2xs">
        {/* Search Bar input element */}
        <div className="md:col-span-2 relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search by doctor name or professional specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all text-gray-700"
          />
        </div>

        {/* Filter Dropdown menu element */}
        <div className="relative flex items-center">
          <Layers className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all text-gray-600 appearance-none cursor-pointer"
          >
            <option value="">All Hospital Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Dynamic Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-4 hover:shadow-xs transition-all relative overflow-hidden flex flex-col justify-between text-left">
              <div className="space-y-2">
                <div className="inline-flex text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-extrabold tracking-wide uppercase">
                  {getDepartmentName(doc.department)}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400 shrink-0" /> {doc.name}
                  </h3>
                  <p className="text-xs text-emerald-600 font-bold ml-5 mt-0.5">{doc.specialization}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-start gap-2 text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Available Roster Info</p>
                  <p className="text-xs font-medium text-gray-600 mt-0.5 leading-tight">{doc.schedule_info}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-slate-50/50 border border-dashed rounded-2xl p-12 space-y-2">
          <p className="text-sm font-bold text-gray-500">No practitioners matched your specific search filters.</p>
          <p className="text-xs text-gray-400">Try modifying your query tags or switching department groups above.</p>
        </div>
      )}
    </div>
  );
}