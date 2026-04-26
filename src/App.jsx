import React from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  HeartPulse,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
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

const stats = [
  { title: "Total Patients", value: "12,486", change: "+12.4%", icon: Users },
  { title: "Appointments Today", value: "48", change: "+8 new", icon: CalendarDays },
  { title: "Doctors Available", value: "23", change: "5 online", icon: Stethoscope },
  { title: "Revenue", value: "$84,290", change: "+18.2%", icon: CreditCard },
];

const appointments = [
  { time: "09:00 AM", name: "Nadia Rahman", doctor: "Dr. Farhana", type: "Consultation" },
  { time: "10:30 AM", name: "Samira Khan", doctor: "Dr. Mahmud", type: "Emergency" },
  { time: "12:15 PM", name: "Arif Hasan", doctor: "Dr. Rubel", type: "Follow-up" },
  { time: "03:00 PM", name: "Tania Islam", doctor: "Dr. Farhana", type: "Cardiology" },
];

const patients = [
  { name: "Nadia Rahman", age: 34, condition: "Diabetes", status: "Stable" },
  { name: "Arif Hasan", age: 52, condition: "Hypertension", status: "Follow-up" },
  { name: "Samira Khan", age: 28, condition: "Asthma", status: "Critical" },
  { name: "Tania Islam", age: 45, condition: "Cardiac Care", status: "Stable" },
];

const chartData = [
  { day: "Mon", appointments: 36, patients: 220 },
  { day: "Tue", appointments: 44, patients: 260 },
  { day: "Wed", appointments: 38, patients: 315 },
  { day: "Thu", appointments: 52, patients: 390 },
  { day: "Fri", appointments: 48, patients: 430 },
  { day: "Sat", appointments: 31, patients: 520 },
];

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-200/70 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export default function App() {
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
            {[
              "Dashboard",
              "Patients",
              "Appointments",
              "Prescriptions",
              "Reports",
              "Notifications",
            ].map((item, i) => (
              <button
                key={item}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  i === 0
                    ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-sky-700"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 p-5 ring-1 ring-sky-100">
            <ShieldCheck className="mb-3 text-emerald-600" />
            <h3 className="font-black">Secure Care Flow</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Smart automation for clinics, hospitals, records, and reporting.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-500">Welcome back, Admin</p>
              <h2 className="text-2xl font-black md:text-3xl">Astha Medical Dashboard</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 md:flex">
                <Search size={18} className="text-slate-400" />
                <input
                  className="bg-transparent text-sm outline-none"
                  placeholder="Search patients, reports..."
                />
              </div>
              <button className="relative rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 hover:bg-sky-50">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>
          </header>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-500">{stat.title}</p>
                      <h3 className="mt-2 text-3xl font-black">{stat.value}</h3>
                      <p className="mt-2 text-sm font-bold text-emerald-600">{stat.change}</p>
                    </div>
                    <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                      <Icon size={23} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </section>

          <section className="mb-6 grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">Appointments Trend</h3>
                  <p className="text-sm text-slate-500">Weekly hospital activity</p>
                </div>
                <Activity className="text-sky-600" />
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="appointments"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      fill="url(#blue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-black">Upcoming Appointments</h3>
              <p className="mb-5 text-sm text-slate-500">Today’s priority queue</p>

              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.time} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-black">{a.name}</p>
                        <p className="text-sm text-slate-500">{a.doctor}</p>
                      </div>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
                        {a.time}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-600">{a.type}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">Patient Management</h3>
                  <p className="text-sm text-slate-500">Recent patient records</p>
                </div>
                <button className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-sky-200 hover:bg-sky-700">
                  Add Patient
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Age</th>
                      <th className="px-5 py-4">Condition</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {patients.map((p) => (
                      <tr key={p.name} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-black">{p.name}</td>
                        <td className="px-5 py-4 text-slate-600">{p.age}</td>
                        <td className="px-5 py-4 text-slate-600">{p.condition}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              p.status === "Critical"
                                ? "bg-rose-50 text-rose-700"
                                : p.status === "Follow-up"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-black">Reports Summary</h3>
              <p className="mb-5 text-sm text-slate-500">Monthly analytics</p>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <FileText className="mb-2 text-sky-600" size={20} />
                  <p className="text-xl font-black">286</p>
                  <p className="text-xs font-bold text-slate-500">Reports</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <HeartPulse className="mb-2 text-emerald-600" size={20} />
                  <p className="text-xl font-black">98%</p>
                  <p className="text-xs font-bold text-slate-500">Care Score</p>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}