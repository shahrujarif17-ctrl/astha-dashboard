import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  CreditCard,
  FileText,
  HeartPulse,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const initialPatients = [
  { id: 1, name: "Nadia Rahman", age: 34, condition: "Diabetes", status: "Stable" },
  { id: 2, name: "Arif Hasan", age: 52, condition: "Hypertension", status: "Follow-up" },
  { id: 3, name: "Samira Khan", age: 28, condition: "Asthma", status: "Critical" },
  { id: 4, name: "Tania Islam", age: 45, condition: "Cardiac Care", status: "Stable" },
  { id: 5, name: "Fahim Ahmed", age: 41, condition: "Migraine", status: "Recovered" },
  { id: 6, name: "Mariam Akter", age: 29, condition: "Pregnancy Care", status: "Stable" },
];

const initialAppointments = [
  { id: 1, date: "2026-04-27", time: "09:00", patient: "Nadia Rahman", doctor: "Dr. Farhana", type: "Consultation", priority: "Normal" },
  { id: 2, date: "2026-04-27", time: "10:30", patient: "Samira Khan", doctor: "Dr. Mahmud", type: "Emergency", priority: "High" },
  { id: 3, date: "2026-04-28", time: "12:15", patient: "Arif Hasan", doctor: "Dr. Rubel", type: "Follow-up", priority: "Normal" },
  { id: 4, date: "2026-04-29", time: "15:00", patient: "Tania Islam", doctor: "Dr. Farhana", type: "Cardiology", priority: "Medium" },
];

const doctors = ["Dr. Farhana", "Dr. Mahmud", "Dr. Rubel", "Dr. Tasnim", "Dr. Karim"];

function todayISO() {
  return "2026-04-27";
}

function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>;
}

function StatusPill({ status }) {
  const style =
    status === "Critical"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : status === "Follow-up"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : status === "Recovered"
      ? "bg-slate-50 text-slate-700 ring-slate-200"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${style}`}>{status}</span>;
}

function App() {
  const [active, setActive] = useState("Dashboard");
  const [patients, setPatients] = useState(() => loadStorage("astha_patients", initialPatients));
  const [appointments, setAppointments] = useState(() => loadStorage("astha_appointments", initialAppointments));
  const [prescriptions, setPrescriptions] = useState(() => loadStorage("astha_prescriptions", []));
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [patientForm, setPatientForm] = useState({ name: "", age: "", condition: "", status: "Stable" });
  const [appointmentForm, setAppointmentForm] = useState({
    date: todayISO(),
    time: "09:00",
    patient: initialPatients[0].name,
    doctor: doctors[0],
    type: "Consultation",
    priority: "Normal",
  });
  const [prescriptionForm, setPrescriptionForm] = useState({ patient: "", diagnosis: "", medicine: "", dosage: "", notes: "" });

  useEffect(() => localStorage.setItem("astha_patients", JSON.stringify(patients)), [patients]);
  useEffect(() => localStorage.setItem("astha_appointments", JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem("astha_prescriptions", JSON.stringify(prescriptions)), [prescriptions]);

  const selectedDateAppointments = appointments
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const filteredPatients = patients.filter((p) =>
    `${p.name} ${p.condition} ${p.status}`.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const appointedPatientsForDate = useMemo(() => {
    const map = new Map();
    selectedDateAppointments.forEach((a) => map.set(a.patient, a));
    return map;
  }, [selectedDateAppointments]);

  const chartData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      day,
      appointments: Math.max(8, appointments.length * 6 + index * 3),
      patients: Math.max(80, patients.length * 35 + index * 16),
    }));
  }, [appointments.length, patients.length]);

  const stats = [
    { title: "Total Patients", value: patients.length, icon: Users, color: "bg-sky-50 text-sky-600" },
    { title: "Appointments", value: appointments.length, icon: CalendarDays, color: "bg-emerald-50 text-emerald-600" },
    { title: "Doctors Available", value: doctors.length, icon: Stethoscope, color: "bg-indigo-50 text-indigo-600" },
    { title: "Payments", value: "$84.2k", icon: CreditCard, color: "bg-amber-50 text-amber-600" },
  ];

  const addPatient = (e) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.age || !patientForm.condition) return;
    const newPatient = { id: Date.now(), ...patientForm };
    setPatients([newPatient, ...patients]);
    setAppointmentForm({ ...appointmentForm, patient: newPatient.name });
    setPatientForm({ name: "", age: "", condition: "", status: "Stable" });
  };

  const addAppointment = (e) => {
    e.preventDefault();
    if (!appointmentForm.patient || !appointmentForm.date || !appointmentForm.time) return;
    const alreadyBooked = appointments.some((a) => a.date === appointmentForm.date && a.patient === appointmentForm.patient);
    if (alreadyBooked) {
      alert("This patient already has an appointment on this date.");
      return;
    }
    setAppointments([{ id: Date.now(), ...appointmentForm }, ...appointments]);
    setSelectedDate(appointmentForm.date);
    setAppointmentForm({ ...appointmentForm, time: "09:00", type: "Consultation", priority: "Normal" });
  };

  const quickBookPatient = (patientName) => {
    const alreadyBooked = appointments.some((a) => a.date === selectedDate && a.patient === patientName);
    if (alreadyBooked) return;
    setAppointments([
      {
        id: Date.now(),
        date: selectedDate,
        time: "09:00",
        patient: patientName,
        doctor: doctors[0],
        type: "Consultation",
        priority: "Normal",
      },
      ...appointments,
    ]);
  };

  const addPrescription = (e) => {
    e.preventDefault();
    if (!prescriptionForm.patient || !prescriptionForm.medicine) return;
    setPrescriptions([{ id: Date.now(), date: todayISO(), ...prescriptionForm }, ...prescriptions]);
    setPrescriptionForm({ patient: "", diagnosis: "", medicine: "", dosage: "", notes: "" });
  };

  const deleteAppointment = (id) => setAppointments(appointments.filter((a) => a.id !== id));

  const resetDemoData = () => {
    setPatients(initialPatients);
    setAppointments(initialAppointments);
    setPrescriptions([]);
    setSelectedDate(todayISO());
  };

  return (
    <div className="min-h-screen bg-[#f6fbff] text-slate-900">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-400 text-white shadow-lg shadow-sky-200">
              <HeartPulse />
            </div>
            <div>
              <h1 className="text-xl font-black">Astha</h1>
              <p className="text-xs font-semibold text-slate-500">Medical Automation</p>
            </div>
          </div>

          <nav className="space-y-2">
            {["Dashboard", "Patients", "Appointments", "Prescriptions", "Reports"].map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  active === item ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100" : "text-slate-600 hover:bg-slate-50 hover:text-sky-700"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 p-5 ring-1 ring-sky-100">
            <ShieldCheck className="mb-3 text-emerald-600" />
            <h3 className="font-black">Secure Care Flow</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Cleaner workflow for patients, appointments, prescriptions, and reports.</p>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-500">Welcome back, Admin</p>
              <h2 className="text-2xl font-black md:text-3xl">Astha Medical Dashboard</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {["Dashboard", "Patients", "Appointments", "Prescriptions", "Reports"].map((item) => (
                <button key={item} onClick={() => setActive(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${active === item ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <button onClick={resetDemoData} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-600 ring-1 ring-slate-200 hover:bg-sky-50">Reset demo data</button>
              <button className="relative rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 hover:bg-sky-50">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>
          </header>

          {active === "Dashboard" && (
            <div className="space-y-6">
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title} className="transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-500">{stat.title}</p>
                          <h3 className="mt-2 text-3xl font-black">{stat.value}</h3>
                          <p className="mt-2 text-sm font-bold text-emerald-600">Live updated</p>
                        </div>
                        <div className={`rounded-2xl p-3 ${stat.color}`}><Icon size={23} /></div>
                      </div>
                    </Card>
                  );
                })}
              </section>

              <section className="grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black">Appointments Trend</h3>
                      <p className="text-sm text-slate-500">Weekly operational overview</p>
                    </div>
                    <Activity className="text-sky-600" />
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs><linearGradient id="blue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="appointments" stroke="#0ea5e9" strokeWidth={3} fill="url(#blue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-black">Selected Date Alerts</h3>
                  <p className="mb-5 text-sm text-slate-500">{selectedDate}</p>
                  <div className="space-y-3">
                    {selectedDateAppointments.slice(0, 4).map((a) => (
                      <div key={a.id} className="rounded-2xl border border-slate-200 p-4">
                        <p className="font-black">{a.patient}</p>
                        <p className="text-sm text-slate-500">{a.time} with {a.doctor}</p>
                      </div>
                    ))}
                    {selectedDateAppointments.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">No appointments selected for this date.</p>}
                  </div>
                </Card>
              </section>
            </div>
          )}

          {active === "Patients" && (
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <Card>
                <h3 className="text-lg font-black">Add Patient</h3>
                <form onSubmit={addPatient} className="mt-5 space-y-3">
                  <input className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" placeholder="Patient name" value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} />
                  <input className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" placeholder="Age" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })} />
                  <input className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" placeholder="Condition" value={patientForm.condition} onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })} />
                  <select className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={patientForm.status} onChange={(e) => setPatientForm({ ...patientForm, status: e.target.value })}>
                    <option>Stable</option><option>Follow-up</option><option>Critical</option><option>Recovered</option>
                  </select>
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 font-black text-white hover:bg-sky-700"><Plus size={18} /> Add Patient</button>
                </form>
              </Card>

              <Card>
                <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div><h3 className="text-lg font-black">Patient Management</h3><p className="text-sm text-slate-500">Search and manage records</p></div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"><Search size={18} className="text-slate-400" /><input className="bg-transparent outline-none" placeholder="Search patients" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} /></div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Age</th><th className="px-5 py-4">Condition</th><th className="px-5 py-4">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredPatients.map((p) => <tr key={p.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-black">{p.name}</td><td className="px-5 py-4">{p.age}</td><td className="px-5 py-4">{p.condition}</td><td className="px-5 py-4"><StatusPill status={p.status} /></td></tr>)}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {active === "Appointments" && (
            <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
              <Card>
                <h3 className="text-lg font-black">Book Appointment</h3>
                <form onSubmit={addAppointment} className="mt-5 space-y-3">
                  <input type="date" className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={appointmentForm.date} onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })} />
                  <input type="time" className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={appointmentForm.time} onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })} />
                  <select className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={appointmentForm.patient} onChange={(e) => setAppointmentForm({ ...appointmentForm, patient: e.target.value })}>
                    {patients.map((p) => <option key={p.id}>{p.name}</option>)}
                  </select>
                  <select className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={appointmentForm.doctor} onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}>{doctors.map((d) => <option key={d}>{d}</option>)}</select>
                  <select className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={appointmentForm.type} onChange={(e) => setAppointmentForm({ ...appointmentForm, type: e.target.value })}><option>Consultation</option><option>Emergency</option><option>Follow-up</option><option>Cardiology</option><option>Report Review</option></select>
                  <select className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={appointmentForm.priority} onChange={(e) => setAppointmentForm({ ...appointmentForm, priority: e.target.value })}><option>Normal</option><option>Medium</option><option>High</option></select>
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700"><CalendarDays size={18} /> Book Appointment</button>
                </form>
              </Card>

              <div className="space-y-6">
                <Card>
                  <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h3 className="text-lg font-black">Calendar</h3><p className="text-sm text-slate-500">Green dates have appointments</p></div><input type="date" className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /></div>
                  <div className="mb-6 grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      const date = `2026-04-${String(day).padStart(2, "0")}`;
                      const hasAppt = appointments.some((a) => a.date === date);
                      return <button key={day} onClick={() => setSelectedDate(date)} className={`aspect-square rounded-2xl text-sm font-black ring-1 ${selectedDate === date ? "bg-sky-600 text-white ring-sky-600" : hasAppt ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200 hover:bg-sky-50"}`}>{day}</button>;
                    })}
                  </div>
                </Card>

                <Card>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">Appointment Tick Board</h3>
                      <p className="text-sm text-slate-500">Whole patient list for {selectedDate}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-emerald-200">
                      {selectedDateAppointments.length}/{patients.length} appointed
                    </span>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {patients.map((patient) => {
                      const appointment = appointedPatientsForDate.get(patient.name);
                      return (
                        <div key={patient.id} className={`rounded-2xl border p-4 transition ${appointment ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white hover:bg-sky-50"}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black text-slate-950">{patient.name}</p>
                              <p className="mt-1 text-sm text-slate-500">{patient.age} yrs • {patient.condition}</p>
                              <div className="mt-3"><StatusPill status={patient.status} /></div>
                            </div>
                            {appointment ? <CheckCircle2 className="text-emerald-600" /> : <XCircle className="text-slate-300" />}
                          </div>
                          {appointment ? (
                            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-3 ring-1 ring-emerald-100">
                              <p className="text-sm font-bold text-slate-600">{appointment.time} • {appointment.doctor}</p>
                              <button onClick={() => deleteAppointment(appointment.id)} className="rounded-xl bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"><Trash2 size={16} /></button>
                            </div>
                          ) : (
                            <button onClick={() => quickBookPatient(patient.name)} className="mt-4 w-full rounded-2xl bg-sky-600 px-4 py-2 text-sm font-black text-white hover:bg-sky-700">Quick appoint</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-black">Selected Date Appointment List</h3>
                  <p className="mb-5 text-sm text-slate-500">{selectedDate}</p>
                  <div className="space-y-3">
                    {selectedDateAppointments.map((a) => <div key={a.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div><p className="font-black">{a.patient}</p><p className="text-sm text-slate-500">{a.time} • {a.doctor} • {a.type} • {a.priority}</p></div><button onClick={() => deleteAppointment(a.id)} className="rounded-xl bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"><Trash2 size={17} /></button></div>)}
                    {selectedDateAppointments.length === 0 && <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm font-semibold text-slate-500">No appointments for this date. Use Quick appoint or Book Appointment.</p>}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {active === "Prescriptions" && (
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <Card>
                <h3 className="text-lg font-black">Create Prescription</h3>
                <form onSubmit={addPrescription} className="mt-5 space-y-3">
                  <select className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" value={prescriptionForm.patient} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, patient: e.target.value })}>
                    <option value="">Select patient</option>
                    {patients.map((p) => <option key={p.id}>{p.name}</option>)}
                  </select>
                  <input className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" placeholder="Diagnosis" value={prescriptionForm.diagnosis} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })} />
                  <input className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" placeholder="Medicine" value={prescriptionForm.medicine} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicine: e.target.value })} />
                  <input className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" placeholder="Dosage" value={prescriptionForm.dosage} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })} />
                  <textarea className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200" placeholder="Notes" value={prescriptionForm.notes} onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })} />
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 font-black text-white hover:bg-sky-700"><ClipboardPlus size={18} /> Save Prescription</button>
                </form>
              </Card>
              <Card>
                <h3 className="text-lg font-black">Saved Prescriptions</h3>
                <div className="mt-5 space-y-3">
                  {prescriptions.map((p) => <div key={p.id} className="rounded-2xl border border-slate-200 p-4"><p className="font-black">{p.patient}</p><p className="text-sm text-slate-500">{p.medicine} • {p.dosage}</p><p className="mt-2 text-xs font-bold text-slate-400">{p.diagnosis} • {p.date}</p></div>)}
                  {prescriptions.length === 0 && <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm font-semibold text-slate-500">No prescriptions saved yet.</p>}
                </div>
              </Card>
            </div>
          )}

          {active === "Reports" && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card><h3 className="text-lg font-black">Patient Growth</h3><div className="mt-5 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="patients" fill="#10b981" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
              <Card><h3 className="text-lg font-black">Clinic Summary</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-sky-50 p-5"><FileText className="mb-3 text-sky-600" /><p className="text-3xl font-black">{prescriptions.length}</p><p className="text-sm font-bold text-slate-500">Prescriptions</p></div><div className="rounded-2xl bg-emerald-50 p-5"><CheckCircle2 className="mb-3 text-emerald-600" /><p className="text-3xl font-black">{appointments.length}</p><p className="text-sm font-bold text-slate-500">Booked Visits</p></div></div></Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
