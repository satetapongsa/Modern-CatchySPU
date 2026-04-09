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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
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

  const [distributionData, setDistributionData] = useState<any[]>([
    { name: 'IT', count: 0 }, { name: 'Eng', count: 0 }, { name: 'Biz', count: 0 },
    { name: 'Acc', count: 0 }, { name: 'Media', count: 0 }, { name: 'Comm', count: 0 },
    { name: 'Arts', count: 0 }, { name: 'Law', count: 0 }, { name: 'Arch', count: 0 },
    { name: 'Tour', count: 0 }, { name: 'Intl', count: 0 }
  ])
  const [serverDistribution, setServerDistribution] = useState<any[]>([
    { name: 'SERVER NODE 1', value: 0 },
    { name: 'SERVER NODE 2', value: 0 },
    { name: 'SERVER NODE 3', value: 0 }
  ])

  const fetchDistributions = async () => {
    try {
      const res = await fetch('/api/simulate-traffic')
      if (!res.ok) return
      const data = await res.json()
      
      const faculties = [
        { id: 'IT', label: 'IT' }, { id: 'Engineering', label: 'Eng' }, { id: 'Business', label: 'Biz' },
        { id: 'Accountancy', label: 'Acc' }, { id: 'DigitalMedia', label: 'Media' }, { id: 'CommArts', label: 'Comm' },
        { id: 'Arts', label: 'Arts' }, { id: 'Law', label: 'Law' }, { id: 'Architecture', label: 'Arch' },
        { id: 'Tourism', label: 'Tour' }, { id: 'International', label: 'Intl' }
      ]

      const chartData = faculties.map(f => {
        const match = data.facultyDistribution.find((d: any) => d.faculty === f.id)
        return { name: f.label, count: match ? match._count : 0 }
      })

      const shardNames = ['SERVER NODE 1', 'SERVER NODE 2', 'SERVER NODE 3']
      const shardChartData = shardNames.map(name => {
        const match = data.shardDistribution.find((d: any) => d.shardedDb === name)
        return { name: name, value: match ? match._count : 0 }
      })

      setDistributionData(chartData)
      setServerDistribution(shardChartData)
    } catch (e) {}
  }

  useEffect(() => {
    fetchDistributions()
    const interval = setInterval(fetchDistributions, 10000)
    return () => clearInterval(interval)
  }, [])

  // Helper for random SPU IP
  const generateSpuIp = () => `10.21.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

  // Helper to add network logs
  const addLog = (info: { id: string; ip?: string; status?: string }) => {
    const newLog = {
      id: info.id,
      ip: info.ip || generateSpuIp(),
      volume: (Math.random() * 5 + 0.1).toFixed(2),
      timestamp: new Date().toLocaleTimeString(),
      status: info.status || (Math.random() > 0.05 ? 'authorized' : 'flagged')
    }
    setNetworkLogs(prev => [newLog, ...prev.slice(0, 49)])
  }

  // Global Handlers
  const handleMassSimulation = async (count: number) => {
    // SNAPPY UI: Immediate calculation with realistic variance
    const perShardBase = Math.floor(count / 3)
    const perFacultyBase = Math.floor(count / 11)

    setServerDistribution(prev => prev.map((item, idx) => ({
      ...item,
      value: item.value + perShardBase + (idx === 0 ? count % 3 : 0)
    })))

    setDistributionData(prev => prev.map((item, idx) => ({
      ...item,
      count: item.count + perFacultyBase + (idx === 0 ? count % 11 : 0) + (Math.floor(Math.random() * 5) - 2)
    })))

    setIsSimulating(true)
    const promise = fetch('/api/simulate-traffic', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    })
    
    toast.promise(promise, {
      loading: `Injecting ${count.toLocaleString()} Peak Load Ingress...`,
      success: `AI Optimized ${count} sessions successfully across all nodes.`,
      error: 'Simulation failed. Check API connectivity.',
    })

    try {
      await promise
      setTimeout(fetchDistributions, 3000)
    } finally {
      setIsSimulating(false)
    }
  }

  const handlePurgeMemory = async () => {
    const res = await fetch('/api/reset-db', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setDistributionData(prev => prev.map(item => ({ ...item, count: 0 })));
      setServerDistribution(prev => prev.map(item => ({ ...item, value: 0 })));
      toast.success("Database Purged: Systems are now at Clean State (0 Records)");
      fetchDistributions();
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

  // Network logs are now only generated on actual registration events (manual or mass simulation)
  // Background simulator removed to keep the surveillance display silent until activity occurs.

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
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        if (!canvas) { // Safety for TS
          this.x = 0; this.y = 0; this.size = 0; this.speedX = 0; this.speedY = 0; this.color = '';
          return;
        }
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        if (!canvas) return
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle theme - Disabled for original dark look
  const toggleTheme = () => {
    setTheme("dark")
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle student data backup
  const handleBackup = async () => {
    const backupToast = toast.loading("Preparing student data backup...")
    try {
      const res = await fetch('/api/all-students')
      if (!res.ok) throw new Error("Failed to fetch student data")
      
      const students = await res.json()
      
      if (!students || students.length === 0) {
        toast.error("No student records found to backup", { id: backupToast })
        return
      }

      const header = `MODERN&CATCHY SPU // STUDENT REGISTRATION BACKUP\n` +
                     `GENERATED: ${new Date().toLocaleString()}\n` +
                     `TOTAL RECORDS: ${students.length}\n` +
                     `SOURCE: SUPABASE 100%\n` +
                     `================================================================================\n\n`
      
      const content = students.map((s: any, idx: number) => 
        `[${(idx + 1).toString().padStart(4, '0')}] ` +
        `ID: ${s.studentId.padEnd(12)} | ` +
        `NAME: ${s.name.padEnd(25)} | ` +
        `FACULTY: ${s.faculty.padEnd(15)} | ` +
        `COURSE: ${s.course.padEnd(20)} | ` +
        `NODE: ${s.shardedDb.padEnd(15)} | ` +
        `SLOT: ${s.slot}`
      ).join('\n')

      const finalContent = header + content
      
      const blob = new Blob([finalContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `MODERN_CATCHY_SPU_BACKUP_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`Backup complete: ${students.length} records saved`, { id: backupToast })
    } catch (err) {
      console.error("Backup Error:", err)
      toast.error("Backup failed: " + (err instanceof Error ? err.message : String(err)), { id: backupToast })
    }
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden"
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">SYSTEM INITIALIZING</div>
          </div>
        </div>
      )}

      <div className="w-full max-w-full px-2 md:px-6 py-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <button 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("Dashboard")}
          >
            <div className="h-9 w-9 relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/50 p-1">
              <img src="/icon.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-wider">
              Modern&Catchy SPU
            </span>
          </button>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search systems..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500 text-slate-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    toast.info(`Searching for: ${e.currentTarget.value}`)
                  }
                }}
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-slate-400 hover:text-slate-100"
                      onClick={() => toast("No new notifications", { description: "Your system is up to date." })}
                    >
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full shadow-none border-t-0 border-b-0">
              <CardContent className="p-4">
                <nav className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-2">
                  <NavItem
                    icon={Command}
                    label="Dashboard"
                    active={activeTab === "Dashboard"}
                    onClick={() => setActiveTab("Dashboard")}
                  />
                  <NavItem
                    icon={Activity}
                    label="Diagnostics"
                    active={activeTab === "Diagnostics"}
                    onClick={() => setActiveTab("Diagnostics")}
                  />
                  <NavItem
                    icon={Database}
                    label="Data Center"
                    active={activeTab === "Data Center"}
                    onClick={() => setActiveTab("Data Center")}
                  />
                  <NavItem
                    icon={Globe}
                    label="Network"
                    active={activeTab === "Network"}
                    onClick={() => setActiveTab("Network")}
                  />
                  <NavItem
                    icon={Settings}
                    label="Settings"
                    active={activeTab === "Settings"}
                    onClick={() => setActiveTab("Settings")}
                  />
                </nav>

                <div className="hidden md:block mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">SYSTEM STATUS</div>
                  <div className="space-y-3">
                    <StatusItem label="Core Systems" value={systemStatus} color="cyan" />
                    <StatusItem label="Security" value={securityLevel} color="green" />
                    <StatusItem label="Network" value={networkStatus} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {activeTab === "Dashboard" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                  <div className="grid gap-6">
                    {/* System overview */}
                    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="border-b border-slate-700/50 pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-slate-100 flex items-center">
                            <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                            System Overview
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                              LIVE
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400"
                              onClick={() => toast.success("System data refreshed successfully")}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <MetricCard
                            title="CPU Usage"
                            value={cpuUsage}
                            icon={Cpu}
                            trend="up"
                            color="cyan"
                            detail="3.8 GHz | 12 Cores"
                          />
                          <MetricCard
                            title="Memory"
                            value={memoryUsage}
                            icon={HardDrive}
                            trend="stable"
                            color="purple"
                            detail="16.4 GB / 24 GB"
                          />
                          <MetricCard
                            title="Network"
                            value={networkStatus}
                            icon={Wifi}
                            trend="down"
                            color="blue"
                            detail="1.2 GB/s | 42ms"
                          />
                        </div>

                        <div className="mt-8">
                          <Tabs defaultValue="performance" className="w-full">
                            <div className="flex items-center justify-between mb-4">
                              <TabsList className="bg-slate-800/50 p-1">
                                <TabsTrigger
                                  value="performance"
                                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                                >
                                  Performance
                                </TabsTrigger>
                                <TabsTrigger
                                  value="processes"
                                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                                >
                                  Processes
                                </TabsTrigger>
                                <TabsTrigger
                                  value="storage"
                                  className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                                >
                                  Storage
                                </TabsTrigger>
                              </TabsList>

                              <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                                  CPU
                                </div>
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                                  Memory
                                </div>
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                                  Network
                                </div>
                              </div>
                            </div>

                            <TabsContent value="performance" className="mt-0">
                               <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                                 <PerformanceChart history={perfHistory} />
                                 <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                                   <div className="text-xs text-slate-400">System Load</div>
                                   <div className="text-lg font-mono text-cyan-400">{cpuUsage.toFixed(4)}%</div>
                                 </div>
                               </div>
                            </TabsContent>

                            <TabsContent value="processes" className="mt-0">
                              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                                <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                                  <div className="col-span-1">PID</div>
                                  <div className="col-span-4">Process</div>
                                  <div className="col-span-2">User</div>
                                  <div className="col-span-2">CPU</div>
                                  <div className="col-span-2">Memory</div>
                                  <div className="col-span-1">Status</div>
                                </div>

                                <div className="divide-y divide-slate-700/30">
                                  <ProcessRow
                                    pid="1024"
                                    name="system_core.exe"
                                    user="SYSTEM"
                                    cpu={12.4}
                                    memory={345}
                                    status="running"
                                  />
                                  <ProcessRow
                                    pid="1842"
                                    name="nexus_service.exe"
                                    user="SYSTEM"
                                    cpu={8.7}
                                    memory={128}
                                    status="running"
                                  />
                                  <ProcessRow
                                    pid="2156"
                                    name="security_monitor.exe"
                                    user="ADMIN"
                                    cpu={5.2}
                                    memory={96}
                                    status="running"
                                  />
                                  <ProcessRow
                                    pid="3012"
                                    name="network_manager.exe"
                                    user="SYSTEM"
                                    cpu={3.8}
                                    memory={84}
                                    status="running"
                                  />
                                  <ProcessRow
                                    pid="4268"
                                    name="user_interface.exe"
                                    user="USER"
                                    cpu={15.3}
                                    memory={256}
                                    status="running"
                                  />
                                  <ProcessRow
                                    pid="5124"
                                    name="data_analyzer.exe"
                                    user="ADMIN"
                                    cpu={22.1}
                                    memory={512}
                                    status="running"
                                  />
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="storage" className="mt-0">
                              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <StorageItem name="System Drive (C:)" total={512} used={324 + (cpuUsage / 10)} type="SSD" />
                                  <StorageItem name="Data Drive (D:)" total={2048} used={1285 + (memoryUsage / 5)} type="HDD" />
                                  <StorageItem name="Backup Drive (E:)" total={4096} used={1865 + (networkStatus / 20)} type="HDD" />
                                  <StorageItem name="Cloud Shard (Net)" total={10240} used={2145 + (cpuUsage * 2)} type="NVMe" />
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Security & Alerts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-slate-100 flex items-center text-base">
                            <Shield className="mr-2 h-5 w-5 text-green-500" />
                            Security Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-400">Firewall</div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-400">Intrusion Detection</div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-400">Encryption</div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-400">Threat Database</div>
                              <div className="text-sm text-cyan-400">
                                Updated <span className="text-slate-500">12 min ago</span>
                              </div>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-700/50">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">Security Level</div>
                                <div className="text-sm text-cyan-400">{securityLevel}%</div>
                              </div>
                              <Progress value={securityLevel} className="h-2 bg-slate-700">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                                  style={{ width: `${securityLevel}%` }}
                                />
                              </Progress>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-slate-100 flex items-center text-base">
                            <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                            System Alerts
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <AlertItem
                              title="Security Scan Complete"
                              time="14:32:12"
                              description="No threats detected in system scan"
                              type="info"
                            />
                            <AlertItem
                              title="Bandwidth Spike Detected"
                              time="13:45:06"
                              description="Unusual network activity on port 443"
                              type="warning"
                            />
                            <AlertItem
                              title="System Update Available"
                              time="09:12:45"
                              description="Version 12.4.5 ready to install"
                              type="update"
                            />
                            <AlertItem
                              title="Backup Completed"
                              time="04:30:00"
                              description="Incremental backup to drive E: successful"
                              type="success"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4">
                  <div className="grid gap-6">
                    {/* System time */}
                    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-0">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                          <div className="text-center">
                            <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
                            <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                            <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                              <div className="text-xs text-slate-500 mb-1">Uptime</div>
                              <div className="text-sm font-mono text-slate-200">14d 06:42:18</div>
                            </div>
                            <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                              <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                              <div className="text-sm font-mono text-slate-200">UTC-08:00</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick actions */}
                    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-slate-100 text-base">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <ActionButton
                            icon={Shield}
                            label="Security Scan"
                            onClick={() => toast.promise(new Promise(r => setTimeout(r, 2000)), {
                              loading: 'Scanning systems...',
                              success: 'No threats detected.',
                              error: 'Scan failed!',
                            })}
                          />
                          <ActionButton
                            icon={RefreshCw}
                            label="Sync Data"
                            onClick={() => toast.success("Data synchronization complete")}
                          />
                          <ActionButton
                            icon={Download}
                            label="Backup"
                            onClick={handleBackup}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Environment controls */}
                    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-slate-100 text-base">Environment Controls</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Radio className="text-cyan-500 mr-2 h-4 w-4" />
                              <Label className="text-sm text-slate-400">Power Management</Label>
                            </div>
                            <Switch />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Lock className="text-cyan-500 mr-2 h-4 w-4" />
                              <Label className="text-sm text-slate-400">Security Protocol</Label>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Diagnostics" && (
              <DiagnosticsView 
                isSimulating={isSimulating} 
                setIsSimulating={setIsSimulating} 
                onMassSimulation={handleMassSimulation} 
                onAddLog={addLog}
                setActiveTab={setActiveTab}
                distributionData={distributionData}
                serverDistribution={serverDistribution}
                setDistributionData={setDistributionData}
                setServerDistribution={setServerDistribution}
                onPurge={handlePurgeMemory}
                fetchDistributions={fetchDistributions}
              />
            )}
            {activeTab === "Data Center" && (
              <DataCenterView 
                isSimulating={isSimulating} 
                servers={servers} 
                setServers={setServers} 
                serverDistribution={serverDistribution}
                setServerDistribution={setServerDistribution}
              />
            )}
            {activeTab === "Network" && <NetworkView logs={networkLogs} perfHistory={perfHistory} networkStatus={networkStatus} />}
            {activeTab === "Settings" && (
              <SettingsView 
                theme={theme}
                setTheme={setTheme}
                onMassSimulation={handleMassSimulation} 
                onSimulateFailure={handleSimulateFailure} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for nav items
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

function DiagnosticsView({ 
  isSimulating, 
  setIsSimulating, 
  onMassSimulation,
  onAddLog,
  setActiveTab,
  distributionData,
  serverDistribution,
  setDistributionData,
  setServerDistribution,
  onPurge,
  fetchDistributions
}: { 
  isSimulating: boolean, 
  setIsSimulating: (v: boolean) => void,
  onMassSimulation: (count: number) => void,
  onAddLog: (info: { id: string; ip?: string; status?: string }) => void,
  setActiveTab: (tab: string) => void,
  distributionData: any[],
  serverDistribution: any[],
  setDistributionData: (d: any[]) => void,
  setServerDistribution: (d: any[]) => void,
  onPurge: () => void,
  fetchDistributions: () => void
}) {
  const [faculty, setFaculty] = useState('IT')
  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [course, setCourse] = useState('')
  const [regResult, setRegResult] = useState<any>(null)
  
  const [selectedShard, setSelectedShard] = useState<string | null>(null)
  const [shardLogs, setShardLogs] = useState<any[]>([])
  const [isLogsLoading, setIsLogsLoading] = useState(false)

  const fetchShardLogs = async (shardName: string) => {
    setIsLogsLoading(true)
    try {
      const res = await fetch(`/api/simulate-traffic?shard=${encodeURIComponent(shardName)}`)
      const data = await res.json()
      setShardLogs(data.shardStudents || [])
    } catch (err) {
      console.error("Failed to fetch shard logs", err)
    } finally {
      setIsLogsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedShard) {
      fetchShardLogs(selectedShard)
    }
  }, [selectedShard])

  const handleRegister = async () => {
    if (!studentId || !studentName) return toast.error("Please enter Student ID and Name")
    
    const promise = fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        faculty, 
        studentId, 
        name: studentName,
        course: course || 'N/A'
      })
    })

    toast.promise(promise, {
      loading: 'Routing registration to optimal node...',
      success: (res: any) => 'Student registered successfully',
      error: 'Registration failed'
    })

    const res = await promise
    const data = await res.json()
    
    if (data.error === 'DUPLICATE_ID') {
      toast.error("Registration Rejected", {
        description: data.message || "This Student ID is already registered in the system."
      })
      return
    }

    setRegResult(data)
    
    if (data.success) {
      toast.success(`Success: Data sharded to ${data.shardedDb}`, {
        description: `Student ${studentName} assigned to registration slot: ${data.assignedSlot}`
      })
      onAddLog({ id: studentId })
      if (selectedShard === data.shardedDb && selectedShard) fetchShardLogs(selectedShard)
      setStudentId(''); setStudentName(''); setCourse('');
      fetchDistributions()
    }
  }

  const handleMassSimulationWrapper = async (count: number) => {
    onMassSimulation(count)
    if (selectedShard) setTimeout(() => fetchShardLogs(selectedShard), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-cyan-500" />
              AI-Driven Registration Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">Manual Entry (Database Direct)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <Label className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider">Full Name</Label>
                   <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="e.g. John Doe SPU" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm mt-1 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-slate-100 placeholder:text-slate-600" />
                 </div>
                 <div>
                   <Label className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider">Student ID</Label>
                   <input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. 66010123" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm mt-1 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-slate-100 placeholder:text-slate-600" />
                 </div>
                 <div>
                   <Label className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider">Faculty Selection</Label>
                   <select value={faculty} onChange={e => setFaculty(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm mt-1 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-slate-100">
                     <option value="IT">ICT (Information Tech)</option>
                     <option value="Engineering">Engineering</option>
                     <option value="Business">Business Admin</option>
                     <option value="Accountancy">Accountancy</option>
                     <option value="DigitalMedia">Digital Media</option>
                     <option value="CommArts">Comm Arts</option>
                     <option value="Arts">Liberal Arts</option>
                     <option value="Law">Law</option>
                     <option value="Architecture">Architecture</option>
                     <option value="Tourism">Tourism & Hospitality</option>
                     <option value="International">International College</option>
                   </select>
                 </div>
                 <div>
                   <Label className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider">Academic Course</Label>
                   <input value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. CSC101 - Intro to AI" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm mt-1 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-slate-100 placeholder:text-slate-600" />
                 </div>
              </div>
              <Button onClick={handleRegister} className="w-full bg-cyan-600 hover:bg-cyan-700 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">EXECUTE ROUND-ROBIN DISTRIBUTION</Button>
              {regResult && (
                <div className="p-3 bg-slate-950/50 border border-cyan-500/20 rounded-lg animate-in slide-in-from-top-2">
                   <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Assigned Ingress Node:</span><Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{regResult.shardedDb}</Badge></div>
                   <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-tighter">SUCCESS_TOKEN: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700/50">
                <h3 className="text-sm font-semibold text-amber-500 flex items-center mb-6"><Zap className="mr-2 h-4 w-4" />AI-Managed Stress Test Controller</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[1000, 3000, 5000].map((count) => (
                    <div key={count} className="space-y-2">
                       <div className="text-[10px] text-center text-slate-500 font-mono uppercase tracking-tighter">Level {count === 1000 ? 'I' : count === 3000 ? 'II' : 'III'}</div>
                       <Button onClick={() => handleMassSimulationWrapper(count)} disabled={isSimulating} className={`w-full py-6 font-bold text-lg border-2 bg-transparent ${count === 1000 ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10' : count === 3000 ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10' : 'border-rose-500/50 text-rose-400 hover:bg-rose-500/10'}`}>{count.toLocaleString()}</Button>
                    </div>
                  ))}
                </div>
                <div className="bg-rose-950/20 border border-rose-500/20 rounded-lg p-4 mt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Database Maintenance</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4 italic">Clears overall student records from all nodes to prevent storage overflow. Use this before running fresh simulation cycles.</p>
                  <Button 
                    onClick={onPurge} 
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs h-10 shadow-[0_0_20px_rgba(225,29,72,0.2)] transition-all"
                  >
                    PURGE ALL RECORDS & RESET SHARDS
                  </Button>
                </div>
                {isSimulating && (<div className="mt-6 flex items-center justify-center space-x-3 text-cyan-400 animate-pulse"><Activity className="h-5 w-5 animate-spin-slow" /><span className="text-xs font-mono uppercase tracking-widest font-bold">AI Optimizing Distribution...</span></div>)}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-1 space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">Traffic Distribution (By Faculty)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /><XAxis dataKey="name" stroke="#475569" fontSize={8} tickLine={false} interval={0} /><YAxis stroke="#475569" fontSize={10} tickLine={false} /><ReTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} itemStyle={{ color: '#22d3ee' }} /><Bar dataKey="count" radius={[4, 4, 0, 0]}>{distributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#14b8a6', '#f97316', '#0ea5e9'][index % 11]} />))}</Bar></BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between px-1">
               <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Live Infrastructure Status</span>
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveTab("Data Center")}
                className="text-[9px] text-cyan-500 hover:text-cyan-400 font-bold h-6 border border-cyan-500/20 hover:bg-cyan-500/10"
               >
                 GO TO DATA CENTER →
               </Button>
            </div>
            {serverDistribution.map((shard, idx) => {
              const colors = ['#06b6d4', '#a855f7', '#3b82f6'];
              const percentage = Math.min(100, (shard.value / 5000) * 100);
              const isSelected = selectedShard === shard.name;
              
              return (
                <Card 
                  key={shard.name} 
                  onClick={() => setSelectedShard(shard.name)}
                  className={`bg-slate-900/50 border transition-all duration-300 relative overflow-hidden group cursor-pointer ${isSelected ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-slate-800 hover:border-slate-700'}`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-500`} style={{ backgroundColor: colors[idx], opacity: isSelected ? 1 : 0.3 }} />
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-[10px] font-mono uppercase tracking-widest" style={{ color: colors[idx] }}>{shard.name}</CardTitle>
                      <p className="text-[8px] text-slate-500 font-mono mt-0.5">SPU-CLUSTER-NODE-{idx+1}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] border-slate-700 text-slate-400 bg-slate-950/50">
                      {isSelected ? 'ACTIVE_SCAN' : 'READY'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] text-slate-400 font-mono">Load Distribution</span>
                          <span className="text-[10px] font-bold text-white font-mono">{shard.value.toLocaleString()} <span className="text-slate-600 text-[8px]">REC</span></span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 p-0.5">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-in-out relative"
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: colors[idx],
                              boxShadow: `0 0 10px ${colors[idx]}` 
                            }} 
                          >
                             <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-10 flex flex-col items-center justify-center bg-slate-950/80 rounded-lg border border-slate-800">
                         <div className="text-[10px] font-black" style={{ color: colors[idx] }}>{percentage.toFixed(0)}%</div>
                         <div className="text-[6px] text-slate-600 font-mono">UTIL</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {selectedShard && (
        <Card className="mt-6 bg-slate-900/50 border-slate-700/50 backdrop-blur-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Database className="h-24 w-24 text-cyan-500" /></div>
          <CardHeader className="border-b border-slate-800 pb-4">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-mono uppercase tracking-[0.1em] text-cyan-600 dark:text-cyan-400">Infrastructure Traffic Logs: {selectedShard}</CardTitle>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono mt-1">Showing 10 most recent ingestion units</p>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 h-8 font-bold" onClick={() => setSelectedShard(null)}>Clear Selection</Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="relative">
                {isLogsLoading && (<div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10 flex items-center justify-center"><RefreshCcw className="h-6 w-6 text-cyan-500 animate-spin" /></div>)}
                <Table>
                   <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
                      <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                         <TableHead className="text-[10px] font-mono text-slate-500 dark:text-slate-500 font-bold">RESIDENCY_ID</TableHead>
                         <TableHead className="text-[10px] font-mono text-slate-500 dark:text-slate-500 font-bold">SUBJECT_NAME</TableHead>
                         <TableHead className="text-[10px] font-mono text-slate-500 dark:text-slate-500 font-bold">FACULTY_UNIT</TableHead>
                         <TableHead className="text-[10px] font-mono text-slate-500 dark:text-slate-500 font-bold">COURSE_ENROLLED</TableHead>
                         <TableHead className="text-[10px] font-mono text-slate-500 dark:text-slate-500 font-bold text-right">INGRESS_SLOT</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {shardLogs.length === 0 && !isLogsLoading ? (
                        <TableRow><TableCell colSpan={5} className="h-24 text-center text-slate-400 text-xs font-mono">NO ACTIVE RECORDS FOUND IN THIS SEGMENT</TableCell></TableRow>
                      ) : (
                        shardLogs.map((log) => (
                          <TableRow key={log.studentId} className="border-slate-800 hover:bg-cyan-500/5 transition-colors">
                            <TableCell className="font-mono text-cyan-400 text-xs">{log.studentId}</TableCell>
                            <TableCell className="text-slate-300 text-xs font-medium uppercase">{log.name}</TableCell>
                            <TableCell><Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700 text-[9px] h-5">{log.faculty}</Badge></TableCell>
                            <TableCell className="text-slate-500 text-[10px] italic">{log.course || 'GENERAL_EDUCATION'}</TableCell>
                            <TableCell className="text-right font-mono text-slate-400 text-[10px]">{log.slot}</TableCell>
                          </TableRow>
                        ))
                      )}
                   </TableBody>
                </Table>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DataCenterView({ 
  isSimulating, 
  servers, 
  setServers,
  serverDistribution,
  setServerDistribution
}: { 
  isSimulating: boolean, 
  servers: any[], 
  setServers: (s: any[]) => void,
  serverDistribution: any[],
  setServerDistribution: (d: any[]) => void
}) {
  const [aiData, setAiData] = useState<any>(null)
  
  useEffect(() => {
    const fetchShards = async () => {
       const res = await fetch('/api/shards')
       setServers(await res.json())
    }
    const fetchAi = async () => {
       const res = await fetch('/api/status')
       const data = await res.json()
       setAiData(data.aiCore)
    }
    fetchShards()
    fetchAi()
    const interval = setInterval(() => { fetchShards(); fetchAi(); }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Global Traffic Ingress Visualization */}
      <Card className="bg-slate-900/60 border-slate-700/50 relative overflow-hidden shadow-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent)]" />
        <CardContent className="py-6">
          <div className="flex flex-col items-center justify-center space-y-4">
             <div className="flex items-center space-x-2 text-cyan-400">
                <Globe className="h-4 w-4 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Global Registration Ingress</span>
             </div>
             
             <div className="w-full max-w-2xl relative h-12 flex items-center justify-between px-4">
                {/* The "Traffic" flow lines */}
                <div className="absolute inset-0 flex items-center justify-around overflow-hidden pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20 ${i === 1 ? 'mt-4' : i === 2 ? '-mt-4' : ''}`} />
                  ))}
                  {isSimulating && [...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping-slow shadow-[0_0_8px_#22d3ee]"
                      style={{ 
                        left: `${Math.random() * 100}%`, 
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random()}s`
                      }} 
                    />
                  ))}
                </div>
                
                <div className="z-10 bg-slate-950 p-2 rounded-full border border-slate-700 shadow-xl">
                   <UsersIcon className="h-5 w-5 text-slate-300" />
                </div>
                
                <div className="flex-1 flex justify-center items-center">
                   <div className={`h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ${isSimulating ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                </div>
                
                <div className="z-10 flex space-x-8">
                   <ServerIcon className="h-5 w-5 text-cyan-500" />
                   <ServerIcon className="h-5 w-5 text-purple-500" />
                   <ServerIcon className="h-5 w-5 text-blue-500" />
                </div>
             </div>
             <p className="text-[9px] text-slate-500 font-mono italic">Smart Shard Routing: ACTIVE | Latency: 42ms</p>
          </div>
        </CardContent>
      </Card>

      {/* Real-time SERVER Distribution (Vertical Bars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servers.map((server, idx) => {
          const occupancy = serverDistribution.find(d => d.name === `SERVER NODE ${idx + 1}`)?.value || 0
          const percentage = (occupancy / 10000) * 100
          
          return (
            <Card key={server.id} className="bg-slate-900/50 border-slate-700/50 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
              <div className={`absolute top-0 right-1 p-2 opacity-20 group-hover:opacity-100 transition-opacity`}>
                 <div className={`h-1.5 w-1.5 rounded-full ${server.status === 'online' ? 'bg-green-500' : 'bg-rose-500'} shadow-[0_0_8px_currentColor]`} />
              </div>
              <CardHeader className="pb-1">
                <CardTitle className="text-[11px] font-bold flex items-center space-x-2">
                  <Database className="h-3 w-3 text-cyan-400" />
                  <span className="tracking-widest">SERVER NODE {idx + 1}</span>
                </CardTitle>
                <div className="text-[9px] text-slate-500 font-mono">NODE_CAPACITY: 10,000 UNITS</div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col space-y-4">
                   <div className="flex items-end justify-between space-x-3 h-24">
                      <div className="flex-1 flex flex-col items-center justify-end h-full">
                         <div className="text-[9px] text-slate-500 mb-1 font-mono">{server.load.toFixed(1)}% LOAD</div>
                         <div className="w-full bg-slate-800 rounded-sm relative overflow-hidden h-full max-h-[80%]" style={{ height: `${server.load}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/80 to-cyan-400" />
                         </div>
                      </div>
                      <div className="flex-1 space-y-2 text-[9px] py-1 border-l border-slate-800 pl-3">
                         <div className="flex justify-between">
                           <span className="text-slate-500">RESIDENCY</span>
                           <span className="text-slate-200">TH-SPU-{idx+1}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-slate-500">STATUS</span>
                           <span className="text-cyan-400 font-bold">NOMINAL</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-400">Database Residency</span>
                         <span className="text-cyan-400 font-mono">{occupancy.toLocaleString()} / 10,000</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-rose-500' : percentage > 70 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                           style={{ width: `${Math.min(100, percentage)}%` }} 
                         />
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Load Distribution Chart */}
        <Card className="col-span-1 lg:col-span-8 bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm font-black flex items-center text-cyan-400">
               <Activity className="mr-2 h-4 w-4" />
               LIVE INFRASTRUCTURE ANALYTICS (SN 1-3)
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={serverDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis
                       dataKey="name"
                       stroke="#475569"
                       fontSize={10}
                       tickLine={false}
                       tickFormatter={(value) => String(value).replace('SERVER NODE', 'SN')}
                     />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                      <ReTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#22d3ee' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                         {serverDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={['#06b6d4', '#a855f7', '#3b82f6'][index % 3]} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        {/* AI Scaling Event Panel */}
        <Card className="col-span-1 lg:col-span-4 bg-slate-900/50 border-slate-700/50 overflow-hidden">
           <div className="h-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-purple-500 animate-shimmer" />
           <CardHeader>
             <CardTitle className="text-sm font-semibold flex items-center text-amber-500">
                <Zap className="mr-2 h-4 w-4" />
                AI CORE: Modern&Catchy Engine
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">AI Confidence Index</span>
                    <span className="text-cyan-400 font-bold">{aiData?.aiConfidenceScore.toFixed(1)}%</span>
                 </div>
                 <Progress value={aiData?.aiConfidenceScore || 0} className="h-1 bg-slate-800" />
                 
                 <div className="flex justify-between items-center text-[11px] mt-4">
                    <span className="text-slate-400">Predicted Load (Next 10m)</span>
                    <span className="text-amber-400 font-bold">{aiData?.predictedLoadNext10m.toFixed(1)}%</span>
                 </div>
                 <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/50" style={{ width: `${aiData?.predictedLoadNext10m}%` }} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                 <div className="bg-slate-800/40 p-2 rounded border border-slate-700/50">
                    <div className="text-[9px] text-slate-500 uppercase">System Safety</div>
                    <div className="text-xs font-bold text-green-400">{aiData?.systemSafetyIndex.toFixed(1)}%</div>
                 </div>
                 <div className="bg-slate-800/40 p-2 rounded border border-slate-700/50">
                    <div className="text-[9px] text-slate-500 uppercase">Optimizer status</div>
                    <div className="text-xs font-bold text-cyan-400">NOMINAL</div>
                 </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800">
                 <div className="text-[10px] text-slate-500 font-mono uppercase mb-2">Live AI Ticker</div>
                 <div className="bg-black/40 p-2 rounded-lg border border-slate-800 h-24 overflow-y-auto font-mono text-[9px] space-y-1.5 text-slate-400">
                    <p className="border-l-2 border-cyan-500 pl-2">[{new Date().toLocaleTimeString()}] Analyzing traffic patterns...</p>
                    <p className="border-l-2 border-amber-500 pl-2">[{new Date().toLocaleTimeString()}] Predictive scaling factor: 0.92x</p>
                    <p className="border-l-2 border-purple-500 pl-2">[{new Date().toLocaleTimeString()}] Balancing strategy optimized.</p>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NetworkView({ logs, perfHistory, networkStatus }: { logs: any[], perfHistory: any[], networkStatus: number }) {
  const [trafficBars, setTrafficBars] = useState<number[]>([...Array(60)].map(() => Math.random() * 40 + 20))

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficBars(prev => {
        const next = [...prev.slice(1), Math.random() * 40 + 20]
        return next
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Sessions", value: "184", color: "text-cyan-400", sub: "Live Nodes" },
          { label: "Ingress Traffic", value: "4.2 GB", color: "text-purple-400", sub: "Last 5m" },
          { label: "Avg Latency", value: "24ms", color: "text-emerald-400", sub: "Nominal" },
          { label: "Uptime", value: "99.98%", color: "text-blue-400", sub: "Global" }
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800 backdrop-blur-sm group hover:border-slate-700 transition-colors">
            <CardContent className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{stat.label}</div>
              <div className={`text-xl font-bold ${stat.color} mb-0.5`}>{stat.value}</div>
              <div className="text-[9px] text-slate-600 font-mono italic">{stat.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
        <div className="bg-slate-800/20 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-amber-500 opacity-50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-50" />
             </div>
             <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Live Network Surveillance</h3>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex items-center text-[10px] text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                GATEWAY SECURE
             </div>
             <Badge variant="secondary" className="bg-slate-800 text-[9px] font-mono border-slate-700">PORT: 443/TLS</Badge>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="h-48 bg-black/20 relative overflow-hidden">
             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
             <div className="absolute inset-0 p-4 pt-10">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={perfHistory.slice(-20)}>
                      <defs>
                        <linearGradient id="networkFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <ReTooltip 
                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '10px' }}
                         itemStyle={{ color: '#22d3ee' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="network" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#networkFlow)" 
                        animationDuration={1500}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             
             <div className="absolute top-4 right-6 text-[10px] text-cyan-400/80 font-mono flex items-center bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded border border-cyan-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-2 animate-pulse" />
                LIVE SURVEILLANCE FEED // BANDWIDTH: {networkStatus.toFixed(2)} MB/S
             </div>
          </div>
          
          <div className="border-t border-slate-800 transition-colors">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black border-b border-slate-800/50 bg-slate-900/50">
                  <th className="px-6 py-4">Session Initiation</th>
                  <th className="px-6 py-4">Academic Entity (ID)</th>
                  <th className="px-6 py-4">Source Node (IP)</th>
                  <th className="px-6 py-4">Payload (Volume)</th>
                  <th className="px-6 py-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-600 font-light italic text-xs tracking-widest">Awaiting ingress traffic protocols...</td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr key={idx} className="group hover:bg-cyan-500/[0.02] transition-colors duration-300 animate-in slide-in-from-top-1 fade-in duration-500">
                      <td className="px-6 py-3.5 text-[10px] font-mono text-slate-500">{log.timestamp}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                           <span className="font-mono text-slate-200 font-bold tracking-wider">{log.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-[10px] font-mono text-slate-400 group-hover:text-slate-300 transition-colors">{log.ip}</td>
                      <td className="px-6 py-3.5">
                         <div className="flex items-center">
                            <div className="w-full max-w-[60px] h-1 bg-slate-800 rounded-full mr-3 overflow-hidden">
                               <div className="h-full bg-purple-500/50" style={{ width: `${(parseFloat(log.volume)/5)*100}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-purple-400 font-medium">{log.volume} MB</span>
                         </div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-[8px] font-black tracking-widest uppercase ${
                          log.status === 'authorized' 
                          ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' 
                          : 'bg-rose-500/5 text-rose-500 border-rose-500/20'
                        }`}>
                          <span className={`w-1 h-1 rounded-full mr-1.5 ${log.status === 'authorized' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <div className="bg-slate-900/80 border-t border-slate-800 px-6 py-3 flex items-center justify-between">
           <div className="text-[9px] text-slate-600 font-mono tracking-widest">NETWORK_MODERN_CATCHY_SPU_v4.2 // SECURITY_INSPECT: ENABLED</div>
           <div className="flex items-center text-[9px] text-slate-600 font-mono">
              <RefreshCcw className="h-3 w-3 mr-2 animate-spin-slow" />
              AUTO-REFRESH: 5.0s
           </div>
        </div>
      </Card>
    </div>
  )
}

function SettingsView({ 
  theme,
  setTheme,
  onMassSimulation, 
  onSimulateFailure 
}: { 
  theme: "dark" | "light",
  setTheme: (t: "dark" | "light") => void,
  onMassSimulation: (count: number) => void,
  onSimulateFailure: () => void 
}) {
  const [firewallActive, setFirewallActive] = useState(true)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          
          <Card className="bg-slate-900/50 border-slate-800">
             <CardHeader className="py-3 px-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                   <Label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Defensive Shield</Label>
                   <Switch checked={firewallActive} onCheckedChange={setFirewallActive} />
                </div>
             </CardHeader>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card className="bg-slate-900/50 border-slate-800 h-full backdrop-blur-sm">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-400 text-sm font-bold items-center flex">
                  <Lock className="mr-2 h-4 w-4" />
                  SECURITY_ENFORCER_CORE
                </CardTitle>
                <div className="flex space-x-2">
                   <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px]">ENCRYPTED</Badge>
                   <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[9px]">AI_SCAN_ON</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800 space-y-3 font-mono text-[10px]">
                       {['SHARD_A', 'SHARD_B', 'SHARD_C'].map(node => (
                         <div key={node} className="flex items-center justify-between">
                           <span className="text-slate-400">{node}</span>
                           <div className="h-1 flex-1 mx-4 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                           </div>
                           <span className="text-emerald-500">SECURE</span>
                         </div>
                       ))}
                    </div>
                    <div className="p-3 border border-slate-800 rounded-lg flex items-center justify-between">
                       <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">System Integrity Scan</span>
                       <span className="text-cyan-400 font-mono text-[10px]">STABLE_99%</span>
                    </div>
                 </div>
                 <div className="bg-slate-950/40 rounded-lg border border-slate-800 p-4 space-y-3 font-mono">
                    <div className="text-[10px] text-slate-500 uppercase flex items-center mb-1">
                       <Activity className="mr-2 h-3 w-3" />
                       Real-time Security Logs
                    </div>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="text-[9px] p-1.5 border-l-2 border-cyan-500 bg-cyan-500/5 flex justify-between text-slate-400">
                           <span>ACCESS_GRANTED: NODE_{i}0{i}</span>
                           <span className="text-slate-600">0.0{i}ms</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-cyan-500 to-blue-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

// Component for metric cards
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {value.toFixed(4)}%
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  )
}

// Performance chart component
function PerformanceChart({ history }: { history: any[] }) {
  return (
    <div className="h-full w-full p-4 relative">
       <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 100]} />
            <ReTooltip 
               contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px' }}
               itemStyle={{ padding: '0px' }}
            />
            <Area type="monotone" dataKey="cpu" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCpu)" dot={false} strokeWidth={2} />
            <Area type="monotone" dataKey="memory" stroke="#a855f7" fillOpacity={1} fill="url(#colorMem)" dot={false} strokeWidth={2} />
            <Area type="monotone" dataKey="network" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNet)" dot={false} strokeWidth={2} />
          </AreaChart>
       </ResponsiveContainer>
    </div>
  )
}

// Process row component
function ProcessRow({
  pid,
  name,
  user,
  cpu,
  memory,
  status,
}: {
  pid: string
  name: string
  user: string
  cpu: number
  memory: number
  status: string
}) {
  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-slate-500">{pid}</div>
      <div className="col-span-4 text-slate-300">{name}</div>
      <div className="col-span-2 text-slate-400">{user}</div>
      <div className="col-span-2 text-cyan-400">{cpu}%</div>
      <div className="col-span-2 text-purple-400">{memory} MB</div>
      <div className="col-span-1">
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
          {status}
        </Badge>
      </div>
    </div>
  )
}

// Storage item component
function StorageItem({
  name,
  total,
  used,
  type,
}: {
  name: string
  total: number
  used: number
  type: string
}) {
  const percentage = Math.round((used / total) * 100)

  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300">{name}</div>
        <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs">
          {type}
        </Badge>
      </div>
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-slate-500">
            {used.toFixed(5)} GB / {total} GB
          </div>
          <div className="text-xs text-slate-400">{percentage}%</div>
        </div>
        <Progress value={percentage} className="h-1.5 bg-slate-700">
          <div
            className={`h-full rounded-full ${
              percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-amber-500" : "bg-cyan-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </Progress>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="text-slate-500">Free: {total - used} GB</div>
        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-slate-400 hover:text-slate-100">
          Details
        </Button>
      </div>
    </div>
  )
}

// Alert item component
function AlertItem({
  title,
  time,
  description,
  type,
}: {
  title: string
  time: string
  description: string
  type: "info" | "warning" | "error" | "success" | "update"
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
      case "warning":
        return { icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/30" }
      case "error":
        return { icon: AlertCircle, color: "text-red-500 bg-red-500/10 border-red-500/30" }
      case "success":
        return { icon: Check, color: "text-green-500 bg-green-500/10 border-green-500/30" }
      case "update":
        return { icon: Download, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30" }
      default:
        return { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/30" }
    }
  }

  const { icon: Icon, color } = getTypeStyles()

  return (
    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-bold text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="h-auto py-3 px-3 border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full text-slate-200 transition-all group"
    >
      <Icon className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-semibold">{label}</span>
    </Button>
  )
}

// Add missing imports
function Info(props: any) {
  return <AlertCircle {...props} />
}

function Check(props: any) {
  return <Shield {...props} />
}

