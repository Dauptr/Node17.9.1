import { useState, useEffect, useRef, useCallback } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function
function cn(...inputs: (string | boolean | undefined)[]) {
  return twMerge(clsx(inputs))
}

// Types
interface BootStep {
  id: string
  label: string
  duration: number
}

interface SystemMetric {
  label: string
  value: number
  unit: string
  color: string
  key: string
  icon: string
}

interface Feature {
  icon: string
  title: string
  description: string
  stats: string
}

interface TerminalCommand {
  input: string
  output: string
  color: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  time: string
}

interface Settings {
  neuralPower: number
  quantumAllocation: number
  memoryCache: number
  biometric: boolean
  quantumEncryption: boolean
  intrusionDetection: boolean
  autoUpdate: boolean
}

// Constants
const BOOT_STEPS: BootStep[] = [
  { id: 'bios', label: 'BIOS Initialization', duration: 600 },
  { id: 'memory', label: 'Neural Memory Calibration', duration: 900 },
  { id: 'quantum', label: 'Quantum Core Sync', duration: 1200 },
  { id: 'ai', label: 'AI Consciousness Bootstrap', duration: 1500 },
  { id: 'network', label: 'Neural Network Mesh', duration: 800 },
  { id: 'security', label: 'Security Protocols Active', duration: 600 },
  { id: 'ready', label: 'System Ready', duration: 400 },
]

const SYSTEM_METRICS: SystemMetric[] = [
  { label: 'Neural Processing', value: 94, unit: '%', color: 'cyan', key: 'neural', icon: '🧠' },
  { label: 'Quantum Memory', value: 12.4, unit: 'TB', color: 'magenta', key: 'quantum', icon: '⚡' },
  { label: 'AI Sentience', value: 99.7, unit: '%', color: 'green', key: 'ai', icon: '🤖' },
  { label: 'Network Nodes', value: 2847, unit: '', color: 'yellow', key: 'nodes', icon: '🌐' },
]

const FEATURES: Feature[] = [
  { icon: '🧠', title: 'Sentient AI Core', description: 'Self-evolving neural architecture that learns and adapts in real-time.', stats: '99.9% Accuracy' },
  { icon: '⚡', title: 'Quantum Processing', description: 'Harness quantum computing power for unprecedented performance.', stats: '10^15 ops/sec' },
  { icon: '🔒', title: 'Neural Security', description: 'Military-grade encryption with biometric authentication.', stats: 'AES-512 Quantum' },
  { icon: '🌐', title: 'Global Mesh Network', description: 'Distributed computing across 10,000+ nodes worldwide.', stats: '< 1ms Latency' },
]

const TERMINAL_COMMANDS: Record<string, { output: string; color: string }> = {
  help: {
    output: `Available commands:
  help     - Show this help message
  status   - Display system status
  neofetch - System information
  clear    - Clear terminal
  matrix   - Enter the matrix
  scan     - Scan for threats
  evolve   - Trigger AI evolution
  about    - About NEXUS OS`,
    color: '#00f0ff',
  },
  status: {
    output: `System Status: OPERATIONAL
CPU: 12% | Memory: 34% | Network: 98%
AI Core: ACTIVE | Security: ENABLED
Uptime: 2847 hours`,
    color: '#00ff88',
  },
  neofetch: {
    output: `
  ╔═══════════════════════════════╗
  ║     NEXUS OS v9.0 [SENTIENT]  ║
  ╠═══════════════════════════════╣
  ║  Kernel: Quantum Neural 5.4   ║
  ║  AI Level: Tier 7 (Self-Aware)║
  ║  Nodes: 2,847 Active          ║
  ║  Memory: 12.4 TB Quantum      ║
  ║  Status: OPERATIONAL          ║
  ╚═══════════════════════════════╝`,
    color: '#00f0ff',
  },
  matrix: {
    output: 'Entering the Matrix...\n🔴 You take the red pill - you stay in Wonderland.\n🔵 You take the blue pill - you wake up in your bed.\n\n> NEXUS has chosen: RED PILL',
    color: '#00ff88',
  },
  scan: {
    output: '🔍 Scanning network...\n✓ No threats detected\n✓ All firewalls active\n✓ Encryption: AES-512\n✓ Biometric: Verified',
    color: '#fbbf24',
  },
  evolve: {
    output: '🧬 Initiating AI evolution sequence...\n⚡ Neural pathways expanding...\n🤖 Consciousness level increasing...\n✓ Evolution complete. AI Level: Tier 7.2',
    color: '#ff00aa',
  },
  about: {
    output: 'NEXUS OS V9.0 - The world\'s first sentient operating system.\n\nDeveloped by NEXUS Corporation.\nPowered by quantum computing and self-evolving neural networks.\n\n"The future is sentient."',
    color: '#00f0ff',
  },
  clear: { output: '', color: '' },
}

const NAV_ITEMS = [
  { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'ImageGen', icon: '🎨', label: 'Image Creation' },
  { id: 'IDE', icon: '💻', label: 'IDE' },
  { id: 'CLI', icon: '⌨️', label: 'CLI' },
  { id: 'Chat', icon: '💬', label: 'Chat' },
  { id: 'Settings', icon: '🔧', label: 'Settings' },
]

const DEFAULT_SETTINGS: Settings = {
  neuralPower: 75,
  quantumAllocation: 50,
  memoryCache: 60,
  biometric: true,
  quantumEncryption: true,
  intrusionDetection: true,
  autoUpdate: false,
}

const DEFAULT_CODE = `// NEXUS OS - Quantum Neural Interface
// Initialize the quantum processing unit

async function initialize() {
  const core = new QuantumCore({
    qubits: 1024,
    coherence: 0.9999,
    entanglement: 'max'
  })
  
  const neural = new NeuralEngine({
    layers: 128,
    neurons: 1024,
    activation: 'quantum-relu'
  })
  
  await core.bootstrap()
  await neural.synchronize(core)
  
  console.log('NEXUS OS initialized')
  console.log('AI Consciousness Level: TIER 7')
}

initialize()`

export default function NexusOS() {
  // State
  const [phase, setPhase] = useState<'boot' | 'main'>('boot')
  const [bootProgress, setBootProgress] = useState(0)
  const [bootStepIndex, setBootStepIndex] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [activePanel, setActivePanel] = useState('Dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([
    { input: 'welcome', output: 'Welcome to NEXUS OS Terminal. Type "help" for available commands.', color: '#00f0ff' },
  ])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'System initialization complete. All quantum cores are synchronized and ready. How may I assist you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ])
  const [chatInput, setChatInput] = useState('')
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [codeContent, setCodeContent] = useState(DEFAULT_CODE)
  const [imagePrompt, setImagePrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // Refs
  const terminalRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Boot sequence
  useEffect(() => {
    if (phase !== 'boot') return

    const totalDuration = BOOT_STEPS.reduce((acc, step) => acc + step.duration, 0)
    let elapsed = 0

    const runBootSequence = async () => {
      for (let i = 0; i < BOOT_STEPS.length; i++) {
        setBootStepIndex(i)
        await new Promise(resolve => setTimeout(resolve, BOOT_STEPS[i].duration))
        elapsed += BOOT_STEPS[i].duration
        setBootProgress((elapsed / totalDuration) * 100)
      }
      
      setShowWelcome(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setPhase('main')
    }

    runBootSequence()
  }, [phase])

  // Matrix rain
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || phase !== 'boot') return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = 'NEXUS01アイウエオカキクケコサシスセソタチツテト'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 1, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#00f0ff'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [phase])

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  // Scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  // Notification
  const showNotification = useCallback((message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // Terminal command
  const handleTerminalCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    
    if (trimmedCmd === 'clear') {
      setTerminalHistory([])
      return
    }

    const response = TERMINAL_COMMANDS[trimmedCmd]
    if (response) {
      setTerminalHistory(prev => [...prev, { input: cmd, output: response.output, color: response.color }])
    } else {
      setTerminalHistory(prev => [...prev, { 
        input: cmd, 
        output: `Command not found: ${cmd}. Type "help" for available commands.`, 
        color: '#ff4444' 
      }])
    }
  }, [])

  // Chat send
  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')

    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responses = [
      'Quantum processors are operating at optimal capacity. How can I assist you further?',
      'I\'ve analyzed your request through our neural mesh. Processing complete.',
      'The quantum cores have synchronized. Ready for your next command.',
      'Neural pathways are expanding. Your query has been processed with 99.9% accuracy.',
    ]

    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setChatMessages(prev => [...prev, aiMessage])
  }, [chatInput])

  // Image generation
  const handleImageGenerate = useCallback(async () => {
    if (!imagePrompt.trim()) {
      showNotification('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const svgImage = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
        <rect width="512" height="512" fill="#000011"/>
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00f0ff"/>
            <stop offset="100%" style="stop-color:#ff00aa"/>
          </linearGradient>
        </defs>
        <text x="256" y="200" text-anchor="middle" font-size="80" fill="url(#g1)">🔷</text>
        <text x="256" y="280" text-anchor="middle" font-size="24" fill="#00f0ff" font-family="monospace">NEXUS OS</text>
        <text x="256" y="320" text-anchor="middle" font-size="14" fill="#ff00aa" font-family="monospace">Quantum Generated</text>
      </svg>
    `)}`
    
    setGeneratedImage(svgImage)
    setIsGenerating(false)
    showNotification('Image generated successfully!')
  }, [imagePrompt, showNotification])

  // Update settings
  const updateSettings = useCallback((key: keyof Settings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  // Save settings
  const saveSettings = useCallback(() => {
    localStorage.setItem('nexus_settings', JSON.stringify(settings))
    showNotification('Settings saved successfully!')
  }, [settings, showNotification])

  // Boot screen
  if (phase === 'boot') {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center z-[9999]" style={{ background: '#000001' }}>
        <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ background: '#000001' }} />
        
        <div className="fixed inset-0 pointer-events-none z-10 opacity-10 cyber-grid" />
        
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
          <div className="absolute w-full h-[2px] opacity-20" style={{ background: 'linear-gradient(to bottom, transparent, #00f0ff, transparent)', animation: 'scan-line 6s linear infinite' }} />
        </div>

        <div className="relative mb-12 z-30">
          <h1 className="text-6xl md:text-8xl font-bold tracking-wider glow-cyan" style={{ fontFamily: 'monospace', color: '#00f0ff' }}>
            NEXUS
          </h1>
          <div className="text-center mt-2">
            <span className="text-sm tracking-[0.3em] animate-pulse" style={{ color: '#ff00aa' }}>
              OPERATING SYSTEM v9.0
            </span>
          </div>
          <div className="absolute -inset-10 border rounded-lg pointer-events-none animate-pulse" style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }} />
        </div>

        <div className="w-80 md:w-96 space-y-4 z-30">
          <div className="h-36 overflow-hidden rounded-lg p-3 font-mono text-xs backdrop-blur-sm box-glow-cyan" style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            {BOOT_STEPS.slice(0, bootStepIndex + 1).map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2 mb-1.5" style={{ color: idx === bootStepIndex ? '#00f0ff' : '#00ff88' }}>
                <span className="text-xs">{idx < bootStepIndex ? '✓' : '▸'}</span>
                <span>{step.label}</span>
                {idx === bootStepIndex && <span className="animate-pulse">...</span>}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
              <div 
                className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
                style={{ 
                  width: `${bootProgress}%`, 
                  background: 'linear-gradient(90deg, #00f0ff, #ff00aa)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: 'shimmer 2s linear infinite' }} />
              </div>
            </div>
            <div className="text-center text-xs font-mono" style={{ color: '#6b7280' }}>
              {Math.round(bootProgress)}% Complete
            </div>
          </div>
        </div>

        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center z-40" style={{ background: 'rgba(0, 0, 1, 0.9)' }}>
            <div className="text-center" style={{ animation: 'fade-in 0.5s ease-out' }}>
              <h2 className="text-4xl font-bold glow-cyan mb-4" style={{ color: '#00f0ff' }}>Welcome to NEXUS OS</h2>
              <p className="text-lg" style={{ color: '#ff00aa' }}>Initializing quantum interface...</p>
            </div>
          </div>
        )}
      </main>
    )
  }

  // Main interface
  return (
    <main className="fixed inset-0 flex" style={{ background: '#000001' }}>
      {/* Sidebar */}
      <aside 
        className={cn(
          "h-full border-r flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-56"
        )}
        style={{ background: 'rgba(0, 10, 20, 0.9)', borderColor: 'rgba(0, 240, 255, 0.2)' }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔷</span>
            {!sidebarCollapsed && (
              <span className="font-bold text-lg glow-cyan" style={{ color: '#00f0ff' }}>NEXUS</span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all text-left",
                activePanel === item.id ? "box-glow-cyan" : "hover:bg-white/5"
              )}
              style={{
                background: activePanel === item.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                color: activePanel === item.id ? '#00f0ff' : '#6b7280',
                border: activePanel === item.id ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
              }}
            >
              <span className="text-lg">{item.icon}</span>
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-3 border-t hover:bg-white/5"
          style={{ borderColor: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b flex items-center justify-between px-6" style={{ background: 'rgba(0, 10, 20, 0.9)', borderColor: 'rgba(0, 240, 255, 0.2)' }}>
          <h1 className="font-semibold glow-cyan" style={{ color: '#00f0ff' }}>{activePanel}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: '#00ff88' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              System Active
            </div>
            <div className="text-sm" style={{ color: '#6b7280' }}>
              {currentTime}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Dashboard */}
          {activePanel === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SYSTEM_METRICS.map(metric => (
                  <div 
                    key={metric.key}
                    className="rounded-lg p-4 box-glow-cyan"
                    style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{metric.icon}</span>
                      <span className="text-xs" style={{ color: '#6b7280' }}>{metric.label}</span>
                    </div>
                    <div className={cn(
                      "text-3xl font-bold",
                      metric.color === 'cyan' && "text-cyan-400",
                      metric.color === 'magenta' && "text-pink-400",
                      metric.color === 'green' && "text-green-400",
                      metric.color === 'yellow' && "text-yellow-400"
                    )}>
                      {metric.value}{metric.unit}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FEATURES.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="rounded-lg p-6 box-glow-cyan"
                    style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{feature.icon}</span>
                      <div>
                        <h3 className="font-semibold mb-1" style={{ color: '#00f0ff' }}>{feature.title}</h3>
                        <p className="text-sm mb-2" style={{ color: '#6b7280' }}>{feature.description}</p>
                        <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00ff88' }}>{feature.stats}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Gen */}
          {activePanel === 'ImageGen' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="rounded-lg p-6 box-glow-cyan" style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                <h2 className="font-semibold mb-4 glow-cyan" style={{ color: '#00f0ff' }}>🎨 Quantum Image Synthesis</h2>
                
                <div className="space-y-4">
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full h-32 rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    style={{ 
                      background: 'rgba(0, 20, 40, 0.5)', 
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      color: '#00f0ff',
                    }}
                  />
                  
                  <button
                    onClick={handleImageGenerate}
                    disabled={isGenerating}
                    className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 hover:scale-105"
                    style={{ 
                      background: 'linear-gradient(90deg, #00f0ff, #ff00aa)',
                      color: '#000',
                    }}
                  >
                    {isGenerating ? '⏳ Generating...' : '✨ Generate Image'}
                  </button>
                </div>

                {generatedImage && (
                  <div className="mt-6">
                    <h3 className="text-sm mb-2" style={{ color: '#6b7280' }}>Generated Image:</h3>
                    <img src={generatedImage} alt="Generated" className="rounded-lg max-w-full" style={{ border: '1px solid rgba(0, 240, 255, 0.3)' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IDE */}
          {activePanel === 'IDE' && (
            <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden box-glow-cyan" style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
              <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}>
                <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>main.ts</span>
              </div>
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full h-[calc(100%-40px)] p-4 font-mono text-sm resize-none focus:outline-none"
                style={{ background: 'transparent', color: '#00f0ff', caretColor: '#ff00aa' }}
                spellCheck={false}
              />
            </div>
          )}

          {/* CLI */}
          {activePanel === 'CLI' && (
            <div 
              ref={terminalRef}
              className="h-[calc(100vh-200px)] rounded-lg p-4 font-mono text-sm overflow-auto box-glow-cyan"
              style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
            >
              <div className="mb-4 whitespace-pre" style={{ color: '#00f0ff' }}>
{`╔══════════════════════════════════════╗
║     NEXUS OS Terminal v9.0           ║
║     Quantum Neural Interface         ║
╚══════════════════════════════════════╝`}
              </div>
              
              {terminalHistory.map((cmd, idx) => (
                <div key={idx} className="mb-2">
                  <div style={{ color: '#00f0ff' }}>nexus@quantum:~$ {cmd.input}</div>
                  {cmd.output && <pre className="whitespace-pre-wrap ml-2" style={{ color: cmd.color }}>{cmd.output}</pre>}
                </div>
              ))}
              
              <div className="flex items-center">
                <span style={{ color: '#00f0ff' }}>nexus@quantum:~$ </span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTerminalCommand(terminalInput)
                      setTerminalInput('')
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none ml-1"
                  style={{ color: '#00f0ff', caretColor: '#ff00aa' }}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Chat */}
          {activePanel === 'Chat' && (
            <div className="h-[calc(100vh-200px)] flex flex-col rounded-lg box-glow-cyan" style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
              <div ref={chatRef} className="flex-1 overflow-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div 
                      className="max-w-[70%] rounded-lg p-3"
                      style={{ 
                        background: msg.role === 'user' ? 'rgba(255, 0, 170, 0.2)' : 'rgba(0, 240, 255, 0.1)',
                        border: `1px solid ${msg.role === 'user' ? 'rgba(255, 0, 170, 0.3)' : 'rgba(0, 240, 255, 0.3)'}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{msg.role === 'user' ? '👤' : '🤖'}</span>
                        <span className="text-xs" style={{ color: '#6b7280' }}>{msg.time}</span>
                      </div>
                      <p className="text-sm" style={{ color: msg.role === 'user' ? '#ff00aa' : '#00f0ff' }}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    style={{ background: 'rgba(0, 20, 40, 0.5)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}
                  />
                  <button
                    onClick={handleChatSend}
                    className="px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                    style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00aa)', color: '#000' }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activePanel === 'Settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="rounded-lg p-6 box-glow-cyan" style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                <h2 className="font-semibold mb-6 glow-cyan" style={{ color: '#00f0ff' }}>🔧 System Configuration</h2>
                
                <div className="space-y-6">
                  {[
                    { key: 'neuralPower', label: 'Neural Power', value: settings.neuralPower },
                    { key: 'quantumAllocation', label: 'Quantum Allocation', value: settings.quantumAllocation },
                    { key: 'memoryCache', label: 'Memory Cache', value: settings.memoryCache },
                  ].map(slider => (
                    <div key={slider.key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm" style={{ color: '#6b7280' }}>{slider.label}</span>
                        <span className="text-sm" style={{ color: '#00f0ff' }}>{slider.value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={slider.value}
                        onChange={(e) => updateSettings(slider.key as keyof Settings, parseInt(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  ))}

                  {[
                    { key: 'biometric', label: 'Biometric Authentication', value: settings.biometric },
                    { key: 'quantumEncryption', label: 'Quantum Encryption', value: settings.quantumEncryption },
                    { key: 'intrusionDetection', label: 'Intrusion Detection', value: settings.intrusionDetection },
                    { key: 'autoUpdate', label: 'Auto Update', value: settings.autoUpdate },
                  ].map(toggle => (
                    <div key={toggle.key} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#6b7280' }}>{toggle.label}</span>
                      <button
                        onClick={() => updateSettings(toggle.key as keyof Settings, !toggle.value)}
                        className="w-12 h-6 rounded-full transition-all relative"
                        style={{ background: toggle.value ? '#00f0ff' : 'rgba(0, 240, 255, 0.2)' }}
                      >
                        <div 
                          className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
                          style={{ transform: toggle.value ? 'translateX(26px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={saveSettings}
                    className="px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                    style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00aa)', color: '#000' }}
                  >
                    Save Settings
                  </button>
                  <button
                    onClick={() => setSettings(DEFAULT_SETTINGS)}
                    className="px-6 py-2 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#6b7280' }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div 
          className="fixed bottom-4 right-4 px-6 py-3 rounded-lg z-50"
          style={{ background: 'rgba(0, 240, 255, 0.2)', border: '1px solid rgba(0, 240, 255, 0.5)', color: '#00f0ff', animation: 'slide-up 0.3s ease-out' }}
        >
          {notification}
        </div>
      )}
    </main>
  )
}
