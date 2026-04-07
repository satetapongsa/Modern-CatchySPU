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

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
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

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <button 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("Dashboard")}
          >
            <div className="h-9 w-9 relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/50 p-1">
              <img src="/icon.png" alt="Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-wider">
              Modern&Catchy SPU
            </span>
          </button>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search systems..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
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
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
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
                    icon={Shield}
                    label="Security"
                    active={activeTab === "Security"}
                    onClick={() => setActiveTab("Security")}
                  />
                  <NavItem
                    icon={Settings}
                    label="Settings"
                    active={activeTab === "Settings"}
                    onClick={() => setActiveTab("Settings")}
                  />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
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
                            onClick={() => toast.info("Cloud backup initiated")}
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
              />
            )}
            {activeTab === "Data Center" && <DataCenterView isSimulating={isSimulating} servers={servers} setServers={setServers} />}
            {activeTab === "Network" && <NetworkView logs={networkLogs} />}
            {activeTab === "Security" && <SecurityView />}
            {activeTab === "Settings" && (
              <SettingsView 
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
  onMassSimulation 
}: { 
  isSimulating: boolean, 
  setIsSimulating: (v: boolean) => void,
  onMassSimulation: (count: number) => void
}) {
  const [faculty, setFaculty] = useState('ICT')
  const [studentId, setStudentId] = useState('')
  const [regResult, setRegResult] = useState<any>(null)
  const [distributionData, setDistributionData] = useState<any[]>([])

  const handleRegister = async () => {
    if (!studentId) return toast.error("Please enter Student ID")
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ faculty, studentId })
    })
    const data = await res.json()
    setRegResult(data)
    toast.success("Simulation Request Sent")
  }

  const handleMassSimulationWrapper = async (count: number) => {
    await onMassSimulation(count)
    fetchDistributions()
  }

  const fetchDistributions = async () => {
    const res = await fetch('/api/simulate-traffic')
    const data = await res.json()
    
    // 6 Real SPU Faculties
    const faculties = [
      { id: 'IT', label: 'Info Tech' },
      { id: 'Engineering', label: 'Engineering' },
      { id: 'Business', label: 'Business' },
      { id: 'Accountancy', label: 'Accountancy' },
      { id: 'DigitalMedia', label: 'Digital Media' },
      { id: 'CommArts', label: 'Comm Arts' }
    ]

    // Map existing data and ensure all 6 faculties are present in result
    const chartData = faculties.map(f => {
      const match = data.facultyDistribution.find((d: any) => d.faculty === f.id)
      return {
        name: f.label,
        count: match ? match._count : 0
      }
    })

    setDistributionData(chartData)
  }

  useEffect(() => {
    fetchDistributions()
  }, [])

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
              <h3 className="text-sm font-semibold text-slate-300">Registration Simulator</h3>
              <div className="space-y-3">
                 <div>
                   <Label className="text-xs text-slate-500">Student ID (Start with 66)</Label>
                   <input 
                     value={studentId} 
                     onChange={e => setStudentId(e.target.value)} 
                     placeholder="e.g. 66010123" 
                     className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-sm mt-1" 
                   />
                 </div>
                 <div>
                   <Label className="text-xs text-slate-500">Faculty</Label>
                   <select 
                      value={faculty} 
                      onChange={e => setFaculty(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-sm mt-1"
                   >
                     <option value="IT">IT (Information Technology)</option>
                     <option value="Engineering">Engineering</option>
                     <option value="Business">Business Administration</option>
                     <option value="Accountancy">Accountancy</option>
                     <option value="DigitalMedia">Digital Media</option>
                     <option value="CommArts">Communication Arts</option>
                   </select>
                 </div>
                 <Button onClick={handleRegister} className="w-full bg-cyan-600 hover:bg-cyan-700 font-bold">EXECUTE AI STAGGERED LOGIC</Button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <h3 className="text-sm font-semibold text-amber-500 flex items-center mb-6">
                  <Zap className="mr-2 h-4 w-4" />
                  AI-Managed Stress Test Controller
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {[1000, 3000, 5000].map((count) => (
                    <div key={count} className="space-y-2">
                       <div className="text-[10px] text-center text-slate-500 font-mono uppercase tracking-tighter">Level {count === 1000 ? 'I' : count === 3000 ? 'II' : 'III'}</div>
                       <Button 
                         onClick={() => handleMassSimulationWrapper(count)} 
                         disabled={isSimulating}
                         className={`w-full py-6 font-bold text-lg border-2 bg-transparent ${
                           count === 1000 ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10' : 
                           count === 3000 ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10' : 
                           'border-rose-500/50 text-rose-400 hover:bg-rose-500/10'
                         }`}
                       >
                         {count.toLocaleString()}
                       </Button>
                    </div>
                  ))}
                </div>
                
                <Button 
                   onClick={async () => {
                     if (confirm("🚨 WARNING: This will WIPE all infrastructure records and restart simulation. Proceed?")) {
                        const res = await fetch('/api/reset-db', { method: 'POST' })
                        const data = await res.json()
                        if (data.success) {
                           toast.success("Infrastructure Cleared (Clean State)")
                           fetchDistributions()
                        } else {
                           toast.error("Cleanup Failed: " + data.error)
                        }
                     }
                   }}
                   variant="ghost" 
                   className="w-full mt-6 text-[10px] text-rose-500 border border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 font-mono tracking-widest uppercase"
                >
                   WIPE & RE-OPTIMIZE DATABASE (CLEAN STATE)
                </Button>

                {isSimulating && (
                  <div className="mt-6 flex items-center justify-center space-x-3 text-cyan-400 animate-pulse">
                    <Activity className="h-5 w-5 animate-spin-slow" />
                    <span className="text-xs font-mono uppercase tracking-widest font-bold">AI Optimizing Distribution...</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-300">Traffic Distribution (By Faculty)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={distributionData} margin={{ bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} interval={0} tick={{ fill: '#94a3b8' }} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <ReTooltip 
                         cursor={{ fill: '#1e293b', opacity: 0.4 }}
                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} 
                      />
                      <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#06b6d4', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][index % 6]} />
                          ))}
                       </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
             
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DataCenterView({ 
  isSimulating, 
  servers, 
  setServers 
}: { 
  isSimulating: boolean, 
  servers: any[], 
  setServers: (s: any[]) => void 
}) {
  const [serverDistribution, setServerDistribution] = useState<any[]>([])
  const [aiData, setAiData] = useState<any>(null)
  
  useEffect(() => {
    const fetchShards = async () => {
       const res = await fetch('/api/shards')
       setServers(await res.json())
    }
    const fetchDist = async () => {
       const res = await fetch('/api/simulate-traffic')
       const data = await res.json()
       setServerDistribution(data.shardDistribution.map((d: any) => ({ 
         name: String(d.shardedDb)
           .replace('Shard A', 'SERVER NODE 1')
           .replace('Shard B', 'SERVER NODE 2')
           .replace('Shard C', 'SERVER NODE 3')
           .replace('SERVER NODE 1', 'SERVER NODE 1') // Avoid double replace
           .replace('SERVER NODE 2', 'SERVER NODE 2')
           .replace('SERVER NODE 3', 'SERVER NODE 3')
           .replace('SERVER 1', 'SERVER NODE 1')
           .replace('SERVER 2', 'SERVER NODE 2')
           .replace('SERVER 3', 'SERVER NODE 3'),
         value: d._count 
       })))
    }
    const fetchAi = async () => {
       const res = await fetch('/api/status')
       const data = await res.json()
       setAiData(data.aiCore)
    }
    fetchShards()
    fetchDist()
    fetchAi()
    const interval = setInterval(() => { fetchShards(); fetchDist(); fetchAi(); }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Global Traffic Ingress Visualization */}
      <Card className="bg-slate-900/60 border-slate-700/50 relative overflow-hidden">
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
        {servers.map((server, idx) => (
          <Card key={server.id} className="bg-slate-900/50 border-slate-700/50 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
            <div className={`absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity`}>
               <CircleOff className={`h-4 w-4 ${server.status === 'online' ? 'text-green-500' : 'text-amber-500'}`} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center space-x-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">SN {idx + 1}</span>
              </CardTitle>
              <div className="text-[10px] text-cyan-400/50 font-mono tracking-widest uppercase">Primary Infrastructure Unit</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between space-x-4 h-32">
                 <div className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="text-[10px] text-slate-400 mb-1 font-mono">{server.load.toFixed(1)}%</div>
                    <div className="w-full bg-slate-800 rounded-t-sm relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-shadow duration-500" style={{ height: `${server.load}%` }}>
                       <div className="absolute inset-0 bg-gradient-to-t from-cyan-600 to-cyan-400 animate-pulse-slow" />
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                    </div>
                 </div>
                 <div className="flex-1 space-y-3 text-[11px] py-1">
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">Region</span>
                      <span className="text-slate-300 font-mono">{server.region}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">Node</span>
                      <span className="text-green-400 font-mono">ACTIVE</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">Records</span>
                      <span className="text-cyan-400 font-bold">{serverDistribution.find(d => d.name === `SERVER NODE ${idx + 1}`)?.value || 0}</span>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
                AI CORE: NEXUS Engine
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

function NetworkView({ logs }: { logs: any[] }) {
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

      <Card className="bg-slate-900/60 border-slate-800 overflow-hidden shadow-2xl">
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
          <div className="h-40 bg-black/20 relative overflow-hidden flex items-end px-1 space-x-0.5">
             {trafficBars.map((h, i) => (
               <div 
                 key={i} 
                 className="flex-1 bg-gradient-to-t from-cyan-600/30 to-cyan-400/5 transition-all duration-1000 ease-in-out border-t border-cyan-500/20" 
                 style={{ height: `${h}%` }} 
               />
             ))}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0)_50%,rgba(15,23,42,0.8)_100%)] pointer-events-none" />
             <div className="absolute top-4 right-6 text-[10px] text-slate-600 font-mono flex items-center">
                <BarChart3 className="h-3 w-3 mr-2 opacity-50" />
                BANDWIDTH FLOW (TX/RX)
             </div>
          </div>
          
          <div className="border-t border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold border-b border-slate-800/50 bg-slate-900/50">
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
           <div className="text-[9px] text-slate-600 font-mono tracking-widest">NETWORK_NEXUS_OS_v4.2 // SECURITY_INSPECT: ENABLED</div>
           <div className="flex items-center text-[9px] text-slate-600 font-mono">
              <RefreshCcw className="h-3 w-3 mr-2 animate-spin-slow" />
              AUTO-REFRESH: 5.0s
           </div>
        </div>
      </Card>
    </div>
  )
}

function SecurityView() {
  const [firewallActive, setFirewallActive] = useState(true)

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 backdrop-blur-md">
          <CardHeader className="border-b border-slate-800/50">
            <div className="flex items-center justify-between">
               <CardTitle className="text-sm font-bold flex items-center text-emerald-400">
                 <Shield className="mr-2 h-4 w-4" />
                 Active Defense Protocols
               </CardTitle>
               <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px]">ALPHA-LEVEL ACCESS</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Port Lockdown (80/443)", desc: "Restrict entry to verified IPs only", checked: true },
                  { label: "Cookie Hardening", desc: "AES-256 encryption on all session chips", checked: true },
                  { label: "Deep Packet Inspection", desc: "Real-time AI analysis of ingress payloads", checked: false },
                  { label: "Anti-DDoS Shield", desc: "Cloudflare-grade traffic scrubbing", checked: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                    <div className="space-y-0.5">
                       <div className="text-xs font-bold text-slate-200">{item.label}</div>
                       <div className="text-[10px] text-slate-500">{item.desc}</div>
                    </div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
             </div>
             
             <div className="pt-4 border-t border-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Encryption Strength</span>
                   <span className="text-[10px] text-cyan-400 font-mono">99.9% SECURE</span>
                </div>
                <Progress value={95} className="h-1 bg-slate-800" />
             </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="bg-slate-900/50 border-slate-800">
             <CardHeader className="pb-2">
               <CardTitle className="text-[10px] text-slate-500 uppercase tracking-widest">Threat Interception</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-3xl font-black text-rose-500 font-mono">1,429</div>
                <div className="text-[9px] text-slate-600 mt-1 flex items-center">
                   <AlertCircle className="h-3 w-3 mr-1 text-rose-500 opacity-50" />
                   Intrusions Blocked (Last 24h)
                </div>
             </CardContent>
           </Card>

           <Card className={`bg-slate-900/50 transition-all duration-500 border ${firewallActive ? 'border-emerald-500/30' : 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.1)]'}`}>
             <CardHeader className="pb-2">
               <CardTitle className="text-[10px] text-slate-500 uppercase tracking-widest">Firewall Integrity</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${firewallActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                      <Shield className={`h-6 w-6 ${firewallActive ? 'text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-rose-500'}`} />
                   </div>
                   <div className="text-right">
                      <div className={`text-xl font-bold ${firewallActive ? 'text-emerald-400' : 'text-rose-500'}`}>
                         {firewallActive ? 'DEEP PROTECT' : 'BYPASS MODE'}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono italic">
                         {firewallActive ? 'All Nodes Secure' : 'VULNERABILITY DETECTED'}
                      </div>
                   </div>
                </div>
                <Button 
                   onClick={() => setFirewallActive(!firewallActive)}
                   variant="outline" 
                   className={`w-full text-[10px] font-bold h-8 transition-all ${
                      firewallActive 
                      ? 'border-slate-700 hover:bg-rose-500/10 hover:text-rose-500' 
                      : 'border-rose-500 text-rose-500 bg-rose-500/10 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-400'
                   }`}
                >
                   {firewallActive ? 'DISABLE FIREWALL' : 'ACTIVATE SYSTEM SHIELD'}
                </Button>
             </CardContent>
           </Card>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 font-mono text-[9px] text-slate-500 p-4">
         <div className="flex items-center justify-between">
            <div className="flex space-x-4">
               <span>[ENCRYPTION_KEY: AES-256-GCM]</span>
               <span>[FIREWALL: VERSION_8.1.0]</span>
               <span>[SESSION_KEY: ENABLED]</span>
            </div>
            <div className="flex items-center text-emerald-500">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
               SYSTEM ENFORCING ACTIVE PROTECTION
            </div>
         </div>
      </Card>
    </div>
  )
}

function SettingsView({ 
  onMassSimulation, 
  onSimulateFailure 
}: { 
  onMassSimulation: (count: number) => void,
  onSimulateFailure: () => void 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-100 text-lg">System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm text-slate-200">Dark Mode</Label>
              <div className="text-xs text-slate-500">Automatically adjust theme based on time</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm text-slate-200">Auto-Update</Label>
              <div className="text-xs text-slate-500">Keep Nexus OS on the cutting edge</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-0.5">
              <Label className="text-sm text-slate-200">Telemetry</Label>
              <div className="text-xs text-slate-500">Send anonymous usage data to Nexus Core</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700/50 border-blue-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-blue-400 text-lg flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-slate-500 mb-4 font-light">Manually trigger backend events to test architecture resilience.</p>
          <div className="space-y-3">
             <Button 
               variant="outline" 
               className="w-full justify-start text-[10px] border-slate-700 h-10 hover:bg-rose-500/10 hover:border-rose-500 transition-all font-bold tracking-widest uppercase"
               onClick={onSimulateFailure}
             >
               <CircleOff className="mr-3 h-4 w-4 text-red-500" />
               Simulate Shard Failure
             </Button>
             <Button 
               variant="outline" 
               className="w-full justify-start text-[10px] border-slate-700 h-10 hover:bg-amber-500/10 hover:border-amber-500 transition-all font-bold tracking-widest uppercase"
               onClick={() => onMassSimulation(5000)}
             >
               <Zap className="mr-3 h-4 w-4 text-amber-500" />
               Inject Peak Load (AI Test)
             </Button>
          </div>
        </CardContent>
      </Card>
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
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${color.split(" ")[2]}`}>
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
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
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-cyan-500" />
      <span className="text-xs">{label}</span>
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

