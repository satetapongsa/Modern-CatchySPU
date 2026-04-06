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

  // Network activity background simulator (Persistent)
  useEffect(() => {
    const generateLog = () => {
      const id = `66${Math.floor(100000 + Math.random() * 899999)}`
      const ip = `10.21.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      const vol = (Math.random() * 5 + 0.1).toFixed(2)
      const newLog = {
        id,
        ip,
        volume: vol,
        timestamp: new Date().toLocaleTimeString(),
        status: Math.random() > 0.1 ? 'authorized' : 'flagged'
      }
      setNetworkLogs(prev => [newLog, ...prev.slice(0, 49)])
    }

    const interval = setInterval(generateLog, 5000)
    generateLog() // Initial call
    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; color: string;
      constructor() {
        if (!canvas) { this.x=0;this.y=0;this.size=0;this.speedX=0;this.speedY=0;this.color=''; return; }
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(100, 150, 255, ${Math.random() * 0.5 + 0.2})`
      }
      update() {
        if (!canvas) return
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0; if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle())
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const particle of particles) { particle.update(); particle.draw(); }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  // Toggle theme
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  // Render Logic
  return (
    <div className={`${theme} min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />

      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Hexagon className="h-16 w-16 text-cyan-500 animate-spin mb-4" />
            <div className="text-cyan-500 font-mono text-xs tracking-widest">INITIALIZING SPU CLUSTER</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 lg:p-8 relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between py-6 border-b border-white/[0.05] mb-8">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center">
                 <Terminal className="h-5 w-5 text-cyan-400" />
              </div>
              <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-tight">Modern&Catchy SPU Dashboard</h1>
           </div>
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-slate-900">
                 {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Avatar><AvatarFallback className="bg-slate-900 text-cyan-500 font-bold">SPU</AvatarFallback></Avatar>
           </div>
        </header>

        <div className="grid grid-cols-12 gap-8 flex-grow">
           <aside className="col-span-12 lg:col-span-2 space-y-6">
              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                 <NavItem icon={Command} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
                 <NavItem icon={Activity} label="Diagnostics" active={activeTab === "Diagnostics"} onClick={() => setActiveTab("Diagnostics")} />
                 <NavItem icon={Database} label="Data Center" active={activeTab === "Data Center"} onClick={() => setActiveTab("Data Center")} />
                 <NavItem icon={Globe} label="Network" active={activeTab === "Network"} onClick={() => setActiveTab("Network")} />
                 <NavItem icon={Shield} label="Security" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
                 <NavItem icon={Settings} label="Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
              </nav>
              <div className="hidden lg:block pt-8 border-t border-white/[0.05]">
                 <StatusItem label="Core Node" value={systemStatus} color="cyan" />
                 <StatusItem label="Security Layer" value={securityLevel} color="green" />
              </div>
           </aside>

           <main className="col-span-12 lg:col-span-10">
              {activeTab === "Dashboard" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <MetricCard title="CPU USAGE" value={cpuUsage} icon={Cpu} color="cyan" detail="Distributed Compute" />
                      <MetricCard title="MEMORY" value={memoryUsage} icon={HardDrive} color="purple" detail="16.4GB / 24GB Cached" />
                      <MetricCard title="NETWORK" value={networkStatus} icon={Wifi} color="blue" detail="Sync Rate: 1.2GB/s" />
                   </div>
                   <Card className="bg-slate-950/50 border-slate-900">
                      <CardHeader><CardTitle className="text-xs font-bold uppercase text-slate-500">Real-Time Performance Analytics</CardTitle></CardHeader>
                      <CardContent className="h-[300px] p-6"><PerformanceChart history={perfHistory} /></CardContent>
                   </Card>
                </div>
              )}

              {activeTab === "Diagnostics" && (
                <DiagnosticsView isSimulating={isSimulating} onMassSimulation={handleMassSimulation} servers={servers} />
              )}

              {activeTab === "Data Center" && <DataCenterView isSimulating={isSimulating} servers={servers} />}

              {activeTab === "Security" && <SecurityView logs={networkLogs} />}

              {activeTab === "Settings" && (
                <SettingsView onMassSimulation={handleMassSimulation} onSimulateFailure={handleSimulateFailure} />
              )}
           </main>
        </div>
      </div>
    </div>
  )
}

// All Sub-components with Original Premium UI Re-injected
function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <Button variant="ghost" onClick={onClick} className={`justify-start h-10 w-full space-x-3 transition-colors ${active ? 'bg-slate-900 text-cyan-400' : 'text-slate-500 hover:bg-slate-900/40'}`}>
      <Icon className="h-4 w-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </Button>
  )
}

function StatusItem({ label, value, color }: any) {
  const colors: any = { cyan: 'bg-cyan-500', green: 'bg-green-500' }
  return (
    <div className="space-y-1.5 mb-4">
      <div className="flex justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest"><span>{label}</span><span>{value}%</span></div>
      <div className="h-1 bg-slate-900 rounded-full overflow-hidden"><div className={`h-full ${colors[color]} transition-all duration-1000`} style={{ width: `${value}%` }} /></div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color, detail }: any) {
  const colors: any = { cyan: 'text-cyan-500 border-cyan-500/20', purple: 'text-purple-500 border-purple-500/20', blue: 'text-blue-500 border-blue-500/20' }
  return (
    <Card className={`bg-slate-950/40 border ${colors[color]} p-4 relative overflow-hidden group`}>
      <div className="flex justify-between items-start"><div className="space-y-1"><div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{title}</div><div className="text-2xl font-black">{Math.round(value)}%</div></div><Icon className="h-5 w-5 opacity-40" /></div>
      <div className="mt-4 text-[9px] font-mono text-slate-600 italic">{detail}</div>
    </Card>
  )
}

function PerformanceChart({ history }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%"><AreaChart data={history}><defs><linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /><XAxis dataKey="time" stroke="#475569" fontSize={8} /><YAxis stroke="#475569" fontSize={8} /><ReTooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '9px' }} /><Area type="monotone" dataKey="cpu" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
  )
}

function DiagnosticsView({ isSimulating, onMassSimulation, servers }: any) {
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
       <Card className="bg-slate-950/40 border-slate-800"><CardHeader><CardTitle className="text-[11px] font-black uppercase text-slate-300">Live Registration Simulation</CardTitle></CardHeader><CardContent className="space-y-6"><div className="space-y-2"><Label className="text-[9px] text-slate-500 uppercase font-mono">Student ID</Label><input value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full h-11 bg-slate-900/50 border border-slate-800 px-4 rounded font-mono text-sm uppercase" placeholder="66XXXXXX" /></div><div className="space-y-2"><Label className="text-[9px] text-slate-500 uppercase font-mono">Department Node</Label><select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)} className="w-full h-11 bg-slate-900/50 border border-slate-800 px-4 rounded text-sm"><option value="IT">IT Node</option><option value="Engineering">Engineering Node</option><option value="Business">Business Node</option><option value="Accountancy">Accounting Node</option><option value="DigitalMedia">Digital Media Cluster</option><option value="CommArts">Comm Arts Cluster</option></select></div><Button onClick={handleRegister} className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 text-[10px] font-black uppercase tracking-widest">Execute Registration Ingress</Button></CardContent></Card>
       <Card className="bg-slate-950/40 border-slate-800"><CardHeader><CardTitle className="text-[11px] font-black uppercase text-slate-300">Registration Load Balance</CardTitle></CardHeader><CardContent className="h-[250px]"><ResponsiveContainer><BarChart data={distData}><XAxis dataKey="name" fontSize={8} stroke="#1e293b" /><YAxis fontSize={8} stroke="#1e293b" /><Bar dataKey="count" fill="#06b6d4" radius={[2,2,0,0]} barSize={25} /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  )
}

function DataCenterView({ servers }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
       {servers.map((s: any, i: any) => (
          <Card key={i} className="bg-slate-950/50 border-slate-800 p-6">
             <div className="flex items-center gap-4 mb-4"><ServerIcon className="h-5 w-5 text-cyan-500" /><div><h3 className="text-xs font-black uppercase text-slate-200">{s.id}</h3><p className="text-[8px] font-mono text-slate-600 uppercase">{s.region}</p></div></div>
             <div className="space-y-3"><div className="flex justify-between text-[9px] uppercase font-bold text-slate-500"><span>Live Load</span><span>{Math.round(s.load)}%</span></div><Progress value={s.load} className="h-1 bg-slate-900" /><div className={`text-[9px] font-black uppercase ${s.status === 'online' ? 'text-green-500' : 'text-rose-500'}`}>{s.status}</div></div>
          </Card>
       ))}
    </div>
  )
}

function SecurityView({ logs }: any) {
  return (
    <Card className="bg-slate-950/50 border-slate-800 p-12 h-[450px] flex items-center justify-center overflow-hidden relative">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
       <Globe className="h-72 w-72 text-cyan-900/30 animate-spin-slow opacity-40" />
       <div className="z-10 text-center"><div className="text-[11px] font-black text-cyan-400 tracking-[0.6em] animate-pulse">GLOBAL INFRASTRUCTURE SECURE</div><p className="text-[9px] font-mono text-slate-600 uppercase mt-4 italic">Scanning registration lattice connectivity...</p></div>
    </Card>
  )
}

function SettingsView({ onMassSimulation, onSimulateFailure }: any) {
  return (
    <Card className="bg-slate-950/50 border-slate-800 p-12"><div className="max-w-2xl mx-auto space-y-12"><div className="text-center space-y-2"><h2 className="text-xl font-black uppercase text-slate-100">System Resilience Testing</h2><p className="text-[10px] text-slate-500 uppercase tracking-widest">Execute critical infrastructure failure scenarios</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="p-6 bg-slate-900/20 border border-slate-800 rounded-xl space-y-6"><h3 className="text-[11px] font-bold uppercase text-rose-500">Shard Failure Injection</h3><p className="text-[10px] text-slate-600 leading-relaxed italic">Simulate a sudden hardware-level shard disconnection.</p><Button variant="outline" className="w-full border-rose-900/30 text-rose-500 hover:bg-rose-500/10 text-[9px] font-bold uppercase" onClick={onSimulateFailure}>Trigger Shard Failure</Button></div><div className="p-6 bg-slate-900/20 border border-slate-800 rounded-xl space-y-6"><h3 className="text-[11px] font-bold uppercase text-amber-500">Peak Load Injection</h3><p className="text-[10px] text-slate-600 leading-relaxed italic">Simulate 5,000 concurrent students to test AI staggered slots.</p><Button variant="outline" className="w-full border-amber-900/30 text-amber-500 hover:bg-amber-500/10 text-[9px] font-bold uppercase" onClick={() => onMassSimulation(5000)}>Inject 5,000 Load</Button></div></div></div></Card>
  )
}