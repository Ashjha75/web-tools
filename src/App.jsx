import { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";
import { client } from "./lib/appwrite";
import { AppwriteException } from "appwrite";
import { Tiles } from "./components/Tiles";

function App() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");

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
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Hero Section with Tiles Background */}
      <section className="relative w-full overflow-hidden">
        {/* Tiles Background */}
        <div className="absolute inset-0 w-full h-full">
          <Tiles rows={50} cols={8} tileSize="sm" className="sm:hidden" />
          <Tiles rows={50} cols={12} tileSize="md" className="hidden sm:block" />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-main)]/50 to-[var(--bg-main)]" />
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-light)] mb-6 sm:mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--accent-pink)] animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                New: Appwrite v1.6 Integration
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
            >
              Attract top talent{" "}
              <span className="text-[var(--text-secondary)]">faster</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-8 sm:mb-10 max-w-2xl mx-auto px-4 sm:px-0"
            >
              Stop playing email tag on interviews and make scheduling a
              competitive advantage.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0"
            >
              <button
                onClick={sendPing}
                disabled={status === "loading"}
                className="btn btn-primary btn-responsive btn-rounded w-full sm:w-auto"
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner spinner-white" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Get started
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
              
              <button className="btn btn-secondary btn-responsive btn-rounded w-full sm:w-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Talk to sales
              </button>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--text-tertiary)]"
            >
              <svg className="w-4 h-4 text-[var(--accent-pink)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card required
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logs Section */}
      {logs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16"
        >
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-bold">Activity Logs</h2>
                <span className="badge badge-success text-xs sm:text-sm">{logs.length} events</span>
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">Time</th>
                      <th className="whitespace-nowrap">Method</th>
                      <th className="whitespace-nowrap">Status</th>
                      <th className="whitespace-nowrap">Path</th>
                      <th className="whitespace-nowrap hidden sm:table-cell">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="font-mono text-xs sm:text-sm whitespace-nowrap">
                          {log.date.toLocaleTimeString()}
                        </td>
                        <td>
                          <span className="badge badge-blue font-mono text-xs">
                            {log.method}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge text-xs ${
                              log.status >= 200 && log.status < 300
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {log.status === 200 ? "200 OK" : log.status}
                          </span>
                        </td>
                        <td className="font-mono text-xs sm:text-sm">{log.path}</td>
                        <td className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xs truncate hidden sm:table-cell">
                          {log.response}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default App;
