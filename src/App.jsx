import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { client } from "./lib/appwrite";
import { AppwriteException } from "appwrite";
import AppwriteSvg from "/appwrite.svg";
import ReactSvg from "/react.svg";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showLogs, setShowLogs] = useState(false);
  const scrollRef = useRef(null);

  // Automatically ping the Appwrite server on app load
  useEffect(() => {
    client.ping().catch((error) => {
      console.error("Failed to ping Appwrite server:", error);
    });
  }, []);

  async function sendPing() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("success");
      setShowLogs(true);
    } catch (err) {
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: err instanceof AppwriteException ? err.code : 500,
        response:
          err instanceof AppwriteException
            ? err.message
            : "Something went wrong",
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("error");
      setShowLogs(true);
    }
  }

  const navLinks = [
    { name: "Solutions", href: "#" },
    { name: "Enterprise", href: "#" },
    { name: "Developers", href: "#" },
    { name: "Resources", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-gray-900 selection:text-white dark:selection:bg-white dark:selection:text-gray-900 overflow-x-hidden transition-colors duration-300">
      
      {/* Navigation Bar */}
      <nav className="fixed w-full top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-2">
                <span className="cal-heading text-2xl tracking-tighter">cal.com</span>
              </a>
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="nav-link font-medium text-sm">
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <div className="hidden sm:flex items-center gap-3">
                <button className="text-[var(--text-primary)] font-medium text-sm hover:text-[var(--text-muted)] transition-colors">Log In</button>
                <button className="cal-btn cal-btn-primary rounded-full px-5 py-2">Get started</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-48 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          
          {/* Left Column: Text & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border-default)] text-xs font-medium text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-accent)]"></span>
              New: Appwrite v1.6 Integration
            </div>
            
            <h1 className="cal-heading text-6xl sm:text-7xl leading-[1.05] tracking-tight">
              The better way to <br/>
              <span className="text-[var(--text-muted)]">connect logs.</span>
            </h1>
            
            <p className="text-[var(--text-secondary)] text-lg sm:text-xl max-w-lg leading-relaxed">
              A fully customizable monitoring dashboard for individuals, businesses, and developers building platforms where uptime matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={sendPing}
                disabled={status === "loading"}
                className={`cal-button-dark h-14 px-8 rounded-full text-lg font-medium group transition-all duration-300 ${status === "loading" ? "opacity-70 cursor-wait" : ""}`}
              >
                 {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-[var(--bg-primary)] border-t-transparent rounded-full animate-spin mr-3"></div>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                )}
                {status === "loading" ? "Pinging..." : "Send a Ping"} 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="h-14 px-8 rounded-full border border-[var(--border-default)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-muted)] transition-colors">
                View Documentation
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               No credit card required
            </div>
          </motion.div>

          {/* Right Column: Visual Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-[var(--brand-accent)]/20 to-purple-500/20 rounded-full blur-3xl opacity-50 dark:opacity-20 pointer-events-none"></div>
            
            <div className="visual-mockup bg-[var(--bg-primary)] border border-[var(--border-default)] p-8 relative z-10">
              {/* Header of Mockup */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--bg-muted)] rounded-full flex items-center justify-center p-2 border border-[var(--border-default)]">
                     <img src={AppwriteSvg} alt="Appwrite" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">Appwrite Connection</h3>
                    <p className="text-sm text-[var(--text-muted)]">status.appwrite.io</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full bg-[var(--bg-muted)] border border-[var(--border-default)]"></div>
                   <div className="w-8 h-8 rounded-full bg-[var(--bg-muted)] border border-[var(--border-default)]"></div>
                </div>
              </div>

              {/* Body of Mockup: Status */}
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--brand-accent)] transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Response Time</span>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-accent)] transition-colors">{status === 'success' ? '45ms' : status === 'loading' ? '...' : '--'}</span>
                     <span className="text-xs text-[var(--text-muted)]">avg</span>
                  </div>
                  <div className="mt-3 w-full h-1.5 bg-[var(--border-default)] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[var(--brand-accent)] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: status === 'success' ? "85%" : "10%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-default)] shadow-sm">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">Backend Health</p>
                        <p className="text-xs text-[var(--text-muted)]">Running smoothly</p>
                      </div>
                      <div className="cal-badge cal-badge-success">Operational</div>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-2 pt-2 border-t border-[var(--border-subtle)]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Last checked: Just now
                   </div>
                </div>
              </div>

               {/* Mockup Footer */}
               <div className="mt-6 flex justify-between items-center text-xs text-[var(--text-muted)] px-1">
                  <span>v1.5.8</span>
                  <div className="flex gap-2">
                     <div className="w-20 h-2 bg-[var(--bg-muted)] rounded-full"></div>
                  </div>
               </div>

            </div>
          </motion.div>
        </div>

        {/* Feature/Steps Section */}
        <div className="text-center mb-16">
           <h2 className="cal-heading text-3xl md:text-4xl mb-4">Your all-purpose development kit</h2>
           <p className="text-[var(--text-secondary)]">Discover a variety of our advanced features. Unlimited and free for individuals.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          <motion.div whileHover={{ y: -5 }} className="cal-step-card">
            <div className="step-number">1</div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Connect source</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Edit <code className="px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] font-mono text-xs">src/App.jsx</code> to start building your application.
            </p>
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
               <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-primary)] bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-primary)] bg-gray-300"></div>
               </div>
               <img src={ReactSvg} className="w-6 h-6 grayscale opacity-50" />
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="cal-step-card">
            <div className="step-number">2</div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Set config</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Navigate to the Appwrite console to manage your databases, authentication, and storage.
            </p>
            <div className="mt-8">
               <div className="w-full bg-[var(--bg-muted)] rounded-lg p-3">
                  <div className="w-3/4 h-2 bg-[var(--border-default)] rounded mb-2"></div>
                  <div className="w-1/2 h-2 bg-[var(--border-default)] rounded"></div>
               </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="cal-step-card">
             <div className="step-number">3</div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Deploy tools</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Discover the full power of Appwrite by diving into our comprehensive documentation.
            </p>
            <div className="mt-8 flex justify-end">
               <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
               </div>
            </div>
          </motion.div>
        </div>

      </main>

      {/* Activity Logs Drawer - Fixed Bottom */}
      <AnimatePresence>
        {(showLogs || logs.length > 0) && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-default)] shadow-2xl z-40 max-h-[40vh] flex flex-col"
          >
            <div 
              className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-default)] bg-[var(--bg-secondary)] cursor-pointer hover:bg-[var(--bg-muted)] transition-colors"
              onClick={() => setShowLogs(!showLogs)}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Activity Logs</h3>
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border-default)] text-xs text-[var(--text-muted)] font-mono">
                  {logs.length} events
                </span>
              </div>
              <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                {showLogs ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                )}
              </button>
            </div>

            {showLogs && (
              <div className="overflow-auto p-0 scroll-smooth">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[var(--bg-subtle)] sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-default)]">Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-default)]">Method</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-default)]">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-default)]">Path</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-default)]">Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {logs.map((log, index) => (
                      <tr key={index} className="hover:bg-[var(--bg-subtle)] transition-colors group">
                        <td className="px-6 py-3 text-sm text-[var(--text-secondary)] font-mono whitespace-nowrap">
                          {log.date.toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono">
                            {log.method}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            log.status >= 200 && log.status < 300 
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}>
                            {log.status === 200 ? '200 OK' : log.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-[var(--text-primary)] font-mono">{log.path}</td>
                        <td className="px-6 py-3 text-sm text-[var(--text-secondary)] font-mono max-w-xs truncate group-hover:whitespace-normal group-hover:break-words group-hover:max-w-none transition-all">
                          {log.response}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
