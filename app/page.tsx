"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  CircleOff,
  Command,
  Cpu,
  Database,
  Download,
  Globe,
  HardDrive,
  Hexagon,
  LineChart,
  Lock,
  type LucideIcon,
  MessageSquare,
  Mic,
  Moon,
  Radio,
  RefreshCw,
  RefreshCcw,
  Search,
  Server as ServerIcon,
  Settings,
  Shield,
  Sun,
  Terminal,
  Users as UsersIcon,
  Wifi,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [systemStatus, setSystemStatus] = useState(85)
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [networkStatus, setNetworkStatus] = useState(92)
  const [securityLevel, setSecurityLevel] = useState(75.0000)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [perfHistory, setPerfHistory] = useState<any[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [networkLogs, setNetworkLogs] = useState<any[]>([])
  const [servers, setServers] = useState<any[]>([
    { id: 'SERVER NODE 1', status: 'online', load: 32.4, region: 'SOUTH_A2' },
    { id: 'SERVER NODE 2', status: 'online', load: 45.1, region: 'WEST_C4' },
    { id: 'SERVER NODE 3', status: 'online', load: 12.8, region: 'NORTH_B1' }
  ])

  const handleMassSimulation = async (count: number) => {
    setIsSimulating(true)
    const promise = fetch('/api/simulate-traffic', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    })
    
    toast.promise(promise, {
      loading: `Injecting ${count.toLocaleString()} Peak Load Ingress...`,
      success: `AI Optimized ${count} sessions successfully.`,
      error: 'Simulation failed. Check API connectivity.',
    })

    try {
      await promise
    } finally {
      setIsSimulating(false)
    }
  }

  const handleSimulateFailure = () => {
    const targetIdx = Math.floor(Math.random() * 3)
    setServers(prev => prev.map((s, i) => 
      i === targetIdx ? { ...s, status: s.status === 'online' ? 'offline' : 'online' } : s
    ))
    
    const wasOnline = servers[targetIdx].status === 'online'
    if (wasOnline) {
      toast.error(`CRITICAL: ${servers[targetIdx].id} Infrastructure Failure!`, {
        description: 'AI Rerouting registration traffic to healthy nodes...'
      })
    } else {
      toast.success(`RECOVERY: ${servers[targetIdx].id} Restored.`, {
        description: 'Synchronizing shard records and re-balancing ingress...'
      })
    }
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        const data = await res.json()
        setCpuUsage(data.cpuUsage)
        setMemoryUsage(data.memoryUsage)
        setNetworkStatus(data.networkStatus)
        setSystemStatus(data.systemStatus)
        
        setPerfHistory(prev => {
           const newData = {
             time: new Date().toLocaleTimeString(),
             cpu: data.cpuUsage,
             memory: data.memoryUsage,
             network: data.networkStatus
           }
           const updated = [...prev, newData]
           if (updated.length > 30) return updated.slice(1)
           return updated
        })
      } catch (err) {}
    }
    const interval = setInterval(fetchStatus, 5000)
    fetchStatus()
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const generateLog = () => {
      const id = `66${Math.floor(100000 + Math.random() * 899999)}`
      const ip = `10.21.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      const vol = (Math.random() * 5 + 0.1).toFixed(2)
      setNetworkLogs(prev => [{
        id, ip, volume: vol, timestamp: new Date().toLocaleTimeString(), status: Math.random() > 0.1 ? 'authorized' : 'flagged'
      }, ...prev.slice(0, 49)])
    }
    const interval = setInterval(generateLog, 5000)
    generateLog()
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <div className={`${theme} min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

       {isLoading && (
        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center z-50">
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <Hexagon className="absolute inset-6 h-12 w-12 text-cyan-500 animate-spin-slow" />
            </div>
            <div className="text-cyan-500 font-mono text-[10px] tracking-widest animate-pulse uppercase">Syncing Cluster Shards</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 lg:p-8 flex-grow flex flex-col relative z-20">
         <header className="flex items-center justify-between pb-8 border-b border-white/[0.05] mb-8">
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center">
                  <Terminal className="h-5 w-5 text-cyan-400" />
               </div>
               <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-tight">Modern&Catchy SPU console</h1>
                  <p className="text-[10px] text-slate-600 font-mono italic">AI INFRASTRUCTURE WAR ROOM - NODE_01</p>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="hidden lg:block text-right">
                  <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none mb-1">Time Distribution</div>
                  <div className="text-sm font-mono text-cyan-500">{currentTime.toLocaleTimeString()}</div>
               </div>
               <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-slate-900 transition-colors">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
               </Button>
               <Avatar className="h-8 w-8 border border-slate-700">
                  <AvatarFallback className="bg-slate-900 text-cyan-500 text-[10px] font-bold tracking-tighter">ADM</AvatarFallback>
               </Avatar>
            </div>
         </header>

         <div className="grid grid-cols-12 gap-8 flex-grow">
            <aside className="col-span-12 lg:col-span-2 space-y-8">
               <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                  {[
                    { id: "Dashboard", icon: Command, label: "Overview" },
                    { id: "Diagnostics", icon: Activity, label: "Diagnostics" },
                    { id: "Data Center", icon: Database, label: "Data Center" },
                    { id: "Security", icon: Shield, label: "Network" },
                    { id: "Settings", icon: Settings, label: "Controls" }
                  ].map((nav) => (
                    <Button 
                      key={nav.id} 
                      onClick={() => setActiveTab(nav.id)}
                      variant="ghost" 
                      className={`justify-start h-10 w-full md:w-auto lg:w-full space-x-3 px-3 transition-colors ${activeTab === nav.id ? 'bg-slate-900 text-cyan-400 shadow-[0_0_15px_-5px_rgba(6,182,212,0.5)]' : 'text-slate-500 hover:bg-slate-900/40'}`}
                    >
                      <nav.icon className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{nav.label}</span>
                    </Button>
                  ))}
               </nav>

               <div className="hidden lg:block pt-8 border-t border-white/[0.03] space-y-6">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Node Health Level</div>
                  <StatusItem label="Alpha Core" value={systemStatus} color="cyan" />
                  <StatusItem label="Beta Shard" value={securityLevel} color="purple" />
                  <StatusItem label="Latency Index" value={networkStatus} color="blue" />
               </div>
            </aside>

            <main className="col-span-12 lg:col-span-10 divide-y divide-white/[0.03]">
               {activeTab === "Dashboard" && (
                 <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-0">
                       <MetricCard title="System Throughput" value={cpuUsage} icon={Zap} color="cyan" detail="Distributed Ops" />
                       <MetricCard title="Distributed Memory" value={memoryUsage} icon={HardDrive} color="purple" detail="16.4GB / 24GB Cached" />
                       <MetricCard title="Latency Index" value={networkStatus} icon={Wifi} color="blue" detail="Sync Rate: 1.2GB/s" />
                    </div>

                    <Card className="bg-slate-950/50 border-slate-900 backdrop-blur-sm overflow-hidden border-t-0 rounded-t-none">
                       <CardHeader className="border-b border-white/[0.03]">
                          <CardTitle className="text-[11px] font-bold tracking-widest text-slate-400 uppercase flex items-center">
                             <Activity className="mr-2 h-4 w-4 text-cyan-500" />
                             Dynamic Performance Analytics
                          </CardTitle>
                       </CardHeader>
                       <CardContent className="p-0">
                          <div className="h-[300px] w-full p-6">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={perfHistory}>
                                   <defs>
                                      <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                         <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                      </linearGradient>
                                   </defs>
                                   <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                   <XAxis dataKey="time" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                                   <YAxis stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                                   <ReTooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '9px' }} />
                                   <Area type="monotone" dataKey="cpu" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} />
                                </AreaChart>
                             </ResponsiveContainer>
                          </div>
                       </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <Card className="bg-slate-950/40 border-slate-900">
                          <CardHeader><CardTitle className="text-[11px] font-black uppercase text-slate-500">Active Node Instances</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                             {servers.map((s, i) => (
                               <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-white/[0.02]">
                                  <div className="flex items-center gap-3">
                                     <div className={`h-1.5 w-1.5 rounded-full ${s.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                                     <span className="text-[10px] font-mono text-slate-400 tracking-widest">{s.id}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase">{s.region}</span>
                               </div>
                             ))}
                          </CardContent>
                       </Card>

                       <Card className="bg-slate-950/40 border-slate-900">
                          <CardHeader><CardTitle className="text-[11px] font-black uppercase text-slate-500">Security Ingress Monitor</CardTitle></CardHeader>
                          <CardContent className="h-[180px] overflow-hidden relative">
                             <div className="space-y-2 font-mono text-[9px] text-cyan-600/80">
                                {networkLogs.map((log, i) => (
                                   <div key={i} className="flex justify-between items-center opacity-70">
                                      <span>{log.timestamp}</span>
                                      <span>{log.ip}</span>
                                      <span className={log.status === 'flagged' ? 'text-amber-500' : 'text-cyan-400'}>[{log.status.toUpperCase()}]</span>
                                   </div>
                                ))}
                             </div>
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none h-12 top-auto" />
                          </CardContent>
                       </Card>
                    </div>
                 </div>
               )}

               {activeTab === "Diagnostics" && (
                 <DiagnosticsView 
                    isSimulating={isSimulating} 
                    onMassSimulation={handleMassSimulation} 
                    servers={servers}
                 />
               )}

               {activeTab === "Data Center" && <DataCenterView isSimulating={isSimulating} servers={servers} />}
               
               {activeTab === "Security" && <SecurityView logs={networkLogs} />}

               {activeTab === "Settings" && (
                 <SettingsView 
                    onMassSimulation={handleMassSimulation} 
                    onSimulateFailure={handleSimulateFailure} 
                 />
               )}
            </main>
         </div>
      </div>
    </div>
  )
}

// Sub-components re-injected for total UI fidelity
function StatusItem({ label, value, color }: any) {
  const colorMap: any = { cyan: 'bg-cyan-500', purple: 'bg-purple-500', blue: 'bg-blue-500' }
  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tighter"><span>{label}</span><span>{value}%</span></div>
      <div className="h-1 bg-slate-900 rounded-full overflow-hidden"><div className={`h-full ${colorMap[color]} transition-all duration-1000`} style={{ width: `${value}%` }} /></div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color, detail }: any) {
  const colorMap: any = { cyan: 'border-cyan-500/20 text-cyan-500', purple: 'border-purple-500/20 text-purple-500', blue: 'border-blue-500/20 text-blue-500' }
  return (
    <Card className={`bg-slate-950/40 border ${colorMap[color]} p-4 relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
       <div className="flex justify-between items-start">
          <div className="space-y-1">
             <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{title}</div>
             <div className="text-2xl font-black">{Math.round(value)}%</div>
          </div>
          <Icon className="h-5 w-5 opacity-40 group-hover:scale-110 transition-transform" />
       </div>
       <div className="mt-4 text-[9px] font-mono text-slate-700 tracking-tighter uppercase italic">{detail}</div>
    </Card>
  )
}

function DiagnosticsView({ isSimulating, onMassSimulation }: any) {
  const [distData, setDistData] = useState<any[]>([])
  const [selectedFaculty, setSelectedFaculty] = useState('IT')
  const [studentId, setStudentId] = useState('')

  const refreshStats = async () => {
    const res = await fetch('/api/simulate-traffic')
    const data = await res.json()
    const faculties = [{ id: 'IT', label: 'Infra Tech' }, { id: 'Engineering', label: 'Engineering' }, { id: 'Business', label: 'Business' }, { id: 'Accountancy', label: 'Accounting' }, { id: 'DigitalMedia', label: 'Digital Media' }, { id: 'CommArts', label: 'Comm Arts' }]
    setDistData(faculties.map(f => {
      const match = data.facultyDistribution.find((d: any) => d.faculty === f.id)
      return { name: f.label, count: match ? match._count : 0 }
    }))
  }
  useEffect(() => { refreshStats() }, [])
  const handleRegister = async () => {
    if (!studentId) return toast.error("ACCESS DENIED: Enter Student ID")
    const promise = fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ faculty: selectedFaculty, studentId, name: 'SIM_AGENT_AI' }) })
    toast.promise(promise, { loading: 'Processing Registration...', success: 'Data Recorded.', error: 'API Error' })
    await promise; refreshStats()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-6 duration-700">
       <Card className="bg-slate-950/40 border-slate-800"><CardHeader><CardTitle className="text-[11px] font-black uppercase text-slate-300">Live Registration Simulation</CardTitle></CardHeader><CardContent className="space-y-6"><div className="space-y-2"><Label className="text-[9px] text-slate-500 uppercase font-mono">Student ID</Label><input value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full h-11 bg-slate-900/50 border border-slate-800 px-4 rounded font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-cyan-500/50" placeholder="66XXXXXX" /></div><div className="space-y-2"><Label className="text-[9px] text-slate-500 uppercase font-mono">Department Node</Label><select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)} className="w-full h-11 bg-slate-900/50 border border-slate-800 px-4 rounded text-sm focus:outline-none focus:border-cyan-500/50"><option value="IT">IT Node</option><option value="Engineering">Engineering Node</option><option value="Business">Business Node</option><option value="Accountancy">Accounting Node</option><option value="DigitalMedia">Digital Media Cluster</option><option value="CommArts">Comm Arts Cluster</option></select></div><Button onClick={handleRegister} className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 text-[10px] font-black uppercase tracking-widest transition-all">Execute Registration Ingress</Button></CardContent></Card>
       <Card className="bg-slate-950/40 border-slate-800"><CardHeader><CardTitle className="text-[11px] font-black uppercase text-slate-300">Registration Load Balance</CardTitle></CardHeader><CardContent className="h-[250px]"><ResponsiveContainer><BarChart data={distData}><XAxis dataKey="name" fontSize={8} stroke="#1e293b" /><YAxis fontSize={8} stroke="#1e293b" /><Bar dataKey="count" fill="#06b6d4" radius={[2,2,0,0]} barSize={25} /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  )
}

function DataCenterView({ servers }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in pt-8">
       {servers.map((s: any, i: any) => (
          <Card key={i} className="bg-slate-950/50 border-slate-800 p-6 flex flex-col items-center text-center">
             <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center mb-4 border border-white/[0.05]"><ServerIcon className="h-5 w-5 text-cyan-500" /></div>
             <h3 className="text-xs font-black uppercase text-slate-200 mb-1">{s.id}</h3>
             <p className="text-[8px] font-mono text-slate-600 uppercase mb-4 tracking-[0.2em]">{s.region}</p>
             <div className="w-full space-y-3"><div className="flex justify-between text-[9px] uppercase font-bold text-slate-500"><span>Live Load</span><span>{Math.round(s.load)}%</span></div><Progress value={s.load} className="h-1 bg-slate-900" /><div className={`text-[9px] font-black uppercase ${s.status === 'online' ? 'text-green-500' : 'text-rose-500'}`}>{s.status}</div></div>
          </Card>
       ))}
    </div>
  )
}

function SecurityView({ logs }: any) {
  return (
    <Card className="bg-slate-950/50 border-slate-800 p-12 h-[450px] flex items-center justify-center overflow-hidden relative border-t-0 rounded-t-none">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
       <Globe className="h-72 w-72 text-cyan-900/30 animate-spin-slow opacity-40" />
       <div className="z-10 text-center"><div className="text-[11px] font-black text-cyan-400 tracking-[0.6em] animate-pulse">GLOBAL INFRASTRUCTURE SECURE</div><p className="text-[9px] font-mono text-slate-600 uppercase mt-4 italic tracking-widest">Scanning registration lattice connectivity...</p></div>
    </Card>
  )
}

function SettingsView({ onMassSimulation, onSimulateFailure }: any) {
  return (
    <div className="space-y-8 animate-in fade-in py-8">
       <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-2"><h2 className="text-xl font-black uppercase text-slate-100">System Resilience Testing</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Execute critical infrastructure failure scenarios</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
             <div className="p-8 bg-slate-900/20 border border-slate-800 rounded-xl space-y-6 hover:border-rose-900/30 transition-colors"><div className="flex items-center gap-4"><div className="p-3 bg-rose-500/10 rounded-lg"><AlertCircle className="h-5 w-5 text-rose-500" /></div><h3 className="text-[11px] font-bold uppercase text-slate-200">Shard Failure Injection</h3></div><p className="text-[10px] text-slate-600 leading-relaxed italic font-mono uppercase tracking-tighter">Simulate a hardware-level shard disconnection to test AI failover.</p><Button variant="outline" className="w-full border-rose-900/30 text-rose-500 hover:bg-rose-500/10 text-[9px] font-bold uppercase tracking-widest h-12" onClick={onSimulateFailure}>Trigger Shard Failure</Button></div>
             <div className="p-8 bg-slate-900/20 border border-slate-800 rounded-xl space-y-6 hover:border-amber-900/30 transition-colors"><div className="flex items-center gap-4"><div className="p-3 bg-amber-500/10 rounded-lg"><Zap className="h-5 w-5 text-amber-500" /></div><h3 className="text-[11px] font-bold uppercase text-slate-200">Peak Load Injection</h3></div><p className="text-[10px] text-slate-600 leading-relaxed italic font-mono uppercase tracking-tighter">Simulate 5,000 students to test AI predictive staggered windows.</p><Button variant="outline" className="w-full border-amber-900/30 text-amber-500 hover:bg-amber-500/10 text-[9px] font-bold uppercase tracking-widest h-12" onClick={() => onMassSimulation(5000)}>Inject 5,000 Load</Button></div>
          </div>
       </div>
    </div>
  )
}