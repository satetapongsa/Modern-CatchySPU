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
  Globe as GlobeIcon // Avoid duplicate Globe
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

  // Global Handlers
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

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Fetch Backend simulation data
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
      } catch (err) {
        console.error("Failed to fetch system status", err)
      }
    }

    const interval = setInterval(fetchStatus, 5000)
    fetchStatus() // init
    return () => clearInterval(interval)
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden font-sans`}>
      {/* Background canvas particle effect - Simplified for stability */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 uppercase font-mono text-cyan-500 animate-pulse">
              System Initialization...
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/50 p-1">
              <Hexagon className="h-full w-full text-cyan-500" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-wider">
              Modern&Catchy SPU
            </span>
          </div>

          <div className="flex items-center space-x-4">
             <div className="hidden md:block text-right">
                <div className="text-[10px] text-slate-500 font-mono tracking-[0.2em]">OPERATIONAL STATUS</div>
                <div className="text-xs text-green-400 font-bold font-mono">ALL SYSTEMS NOMINAL</div>
             </div>
             <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
             </Button>
             <Avatar>
                <AvatarFallback className="bg-slate-800 text-cyan-500">SPU</AvatarFallback>
             </Avatar>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <nav className="space-y-4">
               {[
                 { id: "Dashboard", icon: Command, label: "Dashboard" },
                 { id: "Diagnostics", icon: Activity, label: "Diagnostics" },
                 { id: "Data Center", icon: Database, label: "Data Center" },
                 { id: "Security", icon: Shield, label: "Security" },
                 { id: "Settings", icon: Settings, label: "Settings" }
               ].map((item) => (
                 <Button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   variant="ghost"
                   className={`w-full justify-start space-x-3 h-12 transition-all ${activeTab === item.id ? 'bg-slate-800/80 text-cyan-400 border-l-2 border-cyan-500' : 'text-slate-400 hover:bg-slate-800/40'}`}
                 >
                   <item.icon className="h-4 w-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                 </Button>
               ))}
            </nav>
            
            <div className="mt-12 space-y-6">
               <div className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Infrastructure Node Health</div>
               <div className="space-y-3">
                  <StatusItem label="Cluster Alpha" value={systemStatus} color="cyan" />
                  <StatusItem label="Security Layer" value={75} color="green" />
                  <StatusItem label="Net Gateways" value={networkStatus} color="blue" />
               </div>
            </div>
          </div>

          {/* Main Display */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
             {activeTab === "Dashboard" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricCard title="AI CPU LOAD" value={cpuUsage} icon={Cpu} trend="up" color="cyan" detail="Distributed Ops" />
                      <MetricCard title="MEMORY CACHE" value={memoryUsage} icon={HardDrive} trend="stable" color="purple" detail="16.4GB In-Use" />
                      <MetricCard title="LATENCY INDEX" value={networkStatus} icon={Wifi} trend="down" color="blue" detail="Node: BKK-01" />
                   </div>
                   
                   <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-md overflow-hidden">
                      <CardHeader className="border-b border-slate-700/30">
                         <CardTitle className="text-sm font-bold flex items-center text-slate-300">
                            <Activity className="mr-2 h-4 w-4 text-cyan-500" />
                            REAL-TIME INFRASTRUCTURE ANALYTICS
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                         <div className="h-80 w-full p-4">
                            <PerformanceChart history={perfHistory} />
                         </div>
                      </CardContent>
                   </Card>
                </div>
             )}

             {activeTab === "Diagnostics" && (
                <DiagnosticsView isSimulating={isSimulating} setIsSimulating={setIsSimulating} onMassSimulation={handleMassSimulation} />
             )}

             {activeTab === "Data Center" && (
                <DataCenterView isSimulating={isSimulating} servers={servers} setServers={setServers} />
             )}

             {activeTab === "Security" && <SecurityView />}

             {activeTab === "Settings" && (
                <SettingsView onMassSimulation={handleMassSimulation} onSimulateFailure={handleSimulateFailure} />
             )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-components definition

function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan": return "from-cyan-500 to-blue-500";
      case "green": return "from-green-500 to-emerald-500";
      case "blue": return "from-blue-500 to-indigo-500";
      default: return "from-slate-500 to-slate-400";
    }
  }
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, trend, color, detail }: any) {
  const getColor = () => {
    switch (color) {
      case "cyan": return "border-cyan-500/30 text-cyan-400";
      case "purple": return "border-purple-500/30 text-purple-400";
      case "blue": return "border-blue-500/30 text-blue-400";
      default: return "border-slate-700 text-slate-300";
    }
  }
  return (
    <Card className={`bg-slate-900/40 border ${getColor()} p-4 hover:scale-[1.02] transition-transform cursor-pointer`}>
       <div className="flex justify-between items-start">
          <div>
             <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">{title}</div>
             <div className="text-2xl font-black">{value.toFixed(1)}%</div>
          </div>
          <div className="p-2 bg-slate-800/50 rounded-lg">
             <Icon className="h-5 w-5" />
          </div>
       </div>
       <div className="mt-4 text-[9px] font-mono text-slate-600">{detail}</div>
    </Card>
  )
}

function PerformanceChart({ history }: { history: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={history}>
        <defs>
          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="time" stroke="#475569" fontSize={8} tick={{ transform: 'translate(0, 10)' }} />
        <YAxis stroke="#475569" fontSize={8} />
        <ReTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px' }} />
        <Area type="monotone" dataKey="cpu" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function DiagnosticsView({ isSimulating, setIsSimulating, onMassSimulation }: any) {
  const [faculty, setFaculty] = useState('IT')
  const [studentId, setStudentId] = useState('')
  const [distributionData, setDistributionData] = useState<any[]>([])

  const fetchDistributions = async () => {
    const res = await fetch('/api/simulate-traffic')
    const data = await res.json()
    const faculties = [
      { id: 'IT', label: 'Info Tech' },
      { id: 'Engineering', label: 'Engineering' },
      { id: 'Business', label: 'Business' },
      { id: 'Accountancy', label: 'Accountancy' },
      { id: 'DigitalMedia', label: 'Digital Media' },
      { id: 'CommArts', label: 'Comm Arts' }
    ]
    const chartData = faculties.map(f => {
      const match = data.facultyDistribution.find((d: any) => d.faculty === f.id)
      return { name: f.label, count: match ? match._count : 0 }
    })
    setDistributionData(chartData)
  }

  useEffect(() => { fetchDistributions() }, [])

  const handleRegister = async () => {
    if (!studentId) return toast.error("Please enter Student ID")
    await fetch('/api/register', { method: 'POST', body: JSON.stringify({ faculty, studentId }) })
    toast.success("Simulation Success")
    fetchDistributions()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500">
       <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader><CardTitle className="text-sm font-bold">Registration Simulator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label className="text-xs text-slate-500">Student ID</Label>
                <input value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 p-2 rounded text-sm" placeholder="66XXXXXX" />
             </div>
             <div className="space-y-2">
                <Label className="text-xs text-slate-500">Faculty</Label>
                <select value={faculty} onChange={e => setFaculty(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 p-2 rounded text-sm">
                   <option value="IT">IT</option>
                   <option value="Engineering">Engineering</option>
                   <option value="Business">Business</option>
                   <option value="Accountancy">Accountancy</option>
                   <option value="DigitalMedia">Digital Media</option>
                   <option value="CommArts">Comm Arts</option>
                </select>
             </div>
             <Button onClick={handleRegister} className="w-full bg-cyan-600 hover:bg-cyan-700">EXECUTE REGISTRATION</Button>
             
             <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">AI Stress Test Controls</div>
                <div className="grid grid-cols-3 gap-2">
                   {[1000, 3000, 5000].map(c => (
                     <Button key={c} variant="outline" className="text-xs border-slate-800 hover:border-cyan-500" onClick={() => onMassSimulation(c)} disabled={isSimulating}>{c}</Button>
                   ))}
                </div>
             </div>
          </CardContent>
       </Card>

       <Card className="bg-slate-900/60 border-slate-700/50">
          <CardHeader><CardTitle className="text-sm font-bold">Faculty Distribution</CardTitle></CardHeader>
          <CardContent className="h-80"><ResponsiveContainer><BarChart data={distributionData}><XAxis dataKey="name" fontSize={8} /><YAxis fontSize={8} /><ReTooltip /><Bar dataKey="count" fill="#06b6d4" radius={[2,2,0,0]} /></BarChart></ResponsiveContainer></CardContent>
       </Card>
    </div>
  )
}

function DataCenterView({ isSimulating, servers, setServers }: any) {
  const [dist, setDist] = useState<any[]>([])
  useEffect(() => {
    const fetchDist = async () => {
       const res = await fetch('/api/simulate-traffic')
       const data = await res.json()
       setDist(data.shardDistribution.map((d: any) => ({ name: d.shardedDb, value: d._count })))
    }
    fetchDist()
    const interval = setInterval(fetchDist, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servers.map((s: any, i: number) => (
            <Card key={i} className="bg-slate-900/40 border-slate-800 hover:border-cyan-500 transition-colors">
               <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">{s.id}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className={`text-xs font-bold font-mono ${s.status === 'online' ? 'text-green-400' : 'text-rose-500'}`}>{s.status.toUpperCase()}</div>
                  <Progress value={s.load} className="h-1 mt-2 bg-slate-800" />
               </CardContent>
            </Card>
          ))}
       </div>
    </div>
  )
}

function SecurityView() {
  return (
    <div className="animate-in fade-in duration-500">
       <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader><CardTitle className="text-emerald-500 flex items-center"><Shield className="mr-2 h-4 w-4" /> SECURE DEFENSE ACTIVE</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/40 rounded border border-slate-800">
                   <div className="text-[10px] text-slate-500 uppercase">Threat Level</div>
                   <div className="text-xl font-bold text-green-400">MINIMAL</div>
                </div>
                <div className="p-4 bg-slate-950/40 rounded border border-slate-800">
                   <div className="text-[10px] text-slate-500 uppercase">Encryption Strength</div>
                   <div className="text-xl font-bold text-cyan-400">AES-256</div>
                </div>
             </div>
          </CardContent>
       </Card>
    </div>
  )
}

function SettingsView({ onMassSimulation, onSimulateFailure }: any) {
  return (
    <div className="space-y-6">
       <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader><CardTitle className="text-blue-400 flex items-center"><Activity className="mr-2 h-4 w-4" /> SIMULATION CONTROLS</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full text-xs font-bold border-rose-500/30 text-rose-500 hover:bg-rose-500/10" onClick={onSimulateFailure}>Simulate Shard Failure</Button>
             <Button variant="outline" className="w-full text-xs font-bold border-amber-500/30 text-amber-500 hover:bg-amber-500/10" onClick={() => onMassSimulation(5000)}>Inject Peak Load (5000 sessions)</Button>
          </CardContent>
       </Card>
    </div>
  )
}