import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";
import { client } from "./lib/appwrite";
import { AppwriteException } from "appwrite";
import AppwriteSvg from "/appwrite.svg";
import ReactSvg from "/react.svg";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  const [detailHeight, setDetailHeight] = useState(55);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showLogs, setShowLogs] = useState(false);

  const detailsRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (detailsRef.current) {
      setDetailHeight(detailsRef.current.clientHeight);
    }
  }, [logs, showLogs]);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  // Automatically ping the Appwrite server on app load to verify setup
  useEffect(() => {
    client.ping().catch((error) => {
      console.error("Failed to ping Appwrite server:", error);
    });
  }, []);

  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.addEventListener("toggle", updateHeight);

    return () => {
      if (!detailsRef.current) return;
      detailsRef.current.removeEventListener("toggle", updateHeight);
    };
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
    setShowLogs(true);
  }

  return (
    <main
      className="checker-background relative flex flex-col items-center p-5 min-h-screen"
      style={{ marginBottom: `${detailHeight}px` }}
    >
      <ThemeSwitcher />
      
      <div className="mt-25 flex w-full max-w-[40em] items-center justify-center lg:mt-34 animate-fadeIn">
        <div className="rounded-[25%] border border-[#61dafb]/20 bg-[#61dafb]/5 p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#61dafb]/40">
          <div className="rounded-[25%] border border-[#61dafb]/10 bg-white dark:bg-black p-5 shadow-xl lg:p-9">
            <img
              alt={"React logo"}
              src={ReactSvg}
              className="h-14 w-14 transition-transform duration-300 hover:rotate-180"
              width={56}
              height={56}
            />
          </div>
        </div>
        <div
          className={`flex w-38 items-center transition-opacity duration-2500 ${status === "success" ? "opacity-100" : "opacity-0"}`}
        >
          <div className="h-[1px] flex-1 bg-gradient-to-l from-[#fd366e] to-transparent"></div>
          <div className="icon-check flex h-5 w-5 items-center justify-center rounded-full border border-[#fd366e]/30 bg-[#fd366e]/10 text-[#fd366e]"></div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-[#fd366e] to-transparent"></div>
        </div>
        <div className="rounded-[25%] border border-[#fd366e]/20 bg-[#fd366e]/5 p-3 shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#fd366e]/40">
          <div className="rounded-[25%] border border-[#fd366e]/10 bg-white dark:bg-black p-5 shadow-xl lg:p-9">
            <img
              alt={"Appwrite logo"}
              src={AppwriteSvg}
              className="h-14 w-14 transition-transform duration-300 hover:rotate-180"
              width={56}
              height={56}
            />
          </div>
        </div>
      </div>

      <section className="mt-12 flex h-52 flex-col items-center animate-fadeIn">
        {status === "loading" ? (
          <div className="flex flex-row gap-4 items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="h-6 w-6 animate-spin fill-[#fd366e] text-black/10 dark:text-white/10"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <span className="text-black dark:text-white font-medium">Waiting for connection...</span>
          </div>
        ) : status === "success" ? (
          <h1 className="font-[Poppins] text-3xl font-semibold text-[#fd366e]">
            Congratulations!
          </h1>
        ) : (
          <h1 className="font-[Poppins] text-3xl font-semibold text-black dark:text-white">
            Check connection
          </h1>
        )}

        <p className="mt-3 mb-8 text-black/60 dark:text-white/60 text-center">
          {status === "success" ? (
            <span>You connected your app successfully. 🎉</span>
          ) : status === "error" || status === "idle" ? (
            <span>Send a ping to verify the connection</span>
          ) : null}
        </p>

        <button
          onClick={sendPing}
          className={`btn-primary cursor-pointer rounded-lg px-6 py-3 font-medium shadow-md hover:shadow-lg transform transition-all duration-200 ${status === "loading" ? "hidden" : "visible"}`}
        >
          <span className="text-white">Send a ping</span>
        </button>
      </section>

      <div className="grid grid-rows-3 gap-7 lg:grid-cols-3 lg:grid-rows-none animate-slideIn">
        <div className="card flex h-full w-72 flex-col gap-3 rounded-xl p-6 hover:scale-[1.02]">
          <h2 className="text-xl font-semibold text-black dark:text-white">Edit your app</h2>
          <p className="text-black/60 dark:text-white/60">
            Edit{" "}
            <code className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-1 text-sm font-[Fira_Code] text-[#fd366e]">app/page.js</code>{" "}
            to get started with building your app.
          </p>
        </div>
        <a
          href="https://cloud.appwrite.io"
          target="_blank"
          rel="noopener noreferrer"
          className="transform transition-transform hover:scale-[1.02]"
        >
          <div className="card flex h-full w-72 flex-col gap-3 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Go to console
              </h2>
              <span className="icon-arrow-right text-black/30 dark:text-white/30 transition-transform group-hover:translate-x-1"></span>
            </div>
            <p className="text-black/60 dark:text-white/60">
              Navigate to the console to control and oversee the Appwrite
              services.
            </p>
          </div>
        </a>

        <a
          href="https://appwrite.io/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="transform transition-transform hover:scale-[1.02]"
        >
          <div className="card flex h-full w-72 flex-col gap-3 rounded-xl p-6">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Explore docs
              </h2>
              <span className="icon-arrow-right text-black/30 dark:text-white/30 transition-transform group-hover:translate-x-1"></span>
            </div>
            <p className="text-black/60 dark:text-white/60">
              Discover the full power of Appwrite by diving into our
              documentation.
            </p>
          </div>
        </a>
      </div>

      <aside className="fixed bottom-0 flex w-full cursor-pointer border-t border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-lg">
        <details open={showLogs} ref={detailsRef} className={"w-full"}>
          <summary className="flex w-full flex-row justify-between p-4 marker:content-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="flex gap-3 items-center">
              <span className="font-semibold text-black dark:text-white">Logs</span>
              {logs.length > 0 && (
                <div className="flex items-center rounded-full bg-[#fd366e]/10 px-3 py-1 animate-scaleIn">
                  <span className="font-semibold text-[#fd366e] text-sm">{logs.length}</span>
                </div>
              )}
            </div>
            <div className="icon">
              <span className="icon-cheveron-down text-black/40 dark:text-white/40" aria-hidden="true"></span>
            </div>
          </summary>
          <div className="flex w-full flex-col lg:flex-row">
            <div className="flex flex-col border-r border-black/10 dark:border-white/10">
              <div className="border-y border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2 text-black/50 dark:text-white/50 font-medium">
                Project
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-black/5 dark:bg-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-black/50 dark:text-white/50 text-sm font-medium">Endpoint</span>
                  <span className="truncate text-black dark:text-white font-[Fira_Code] text-sm">
                    http://localhost/v1
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-black/50 dark:text-white/50 text-sm font-medium">Project-ID</span>
                  <span className="truncate text-black dark:text-white font-[Fira_Code] text-sm">
                    web-tools
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-black/50 dark:text-white/50 text-sm font-medium">Project name</span>
                  <span className="truncate text-black dark:text-white font-medium">
                    Web Tools
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-grow overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0">
                  <tr className="border-y border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50">
                    {logs.length > 0 ? (
                      <>
                        <td className="w-52 py-3 pl-4 font-medium">Date</td>
                        <td className="font-medium">Status</td>
                        <td className="font-medium">Method</td>
                        <td className="hidden lg:table-cell font-medium">Path</td>
                        <td className="hidden lg:table-cell font-medium">Response</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 pl-4 font-medium">Logs</td>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black">
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <tr key={index} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 pl-4 font-[Fira_Code] text-sm text-black/70 dark:text-white/70">
                          {log.date.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>
                          {log.status > 400 ? (
                            <div className="w-fit rounded-md bg-black/10 dark:bg-white/10 px-2 py-1 text-black dark:text-white font-medium text-sm border border-black/20 dark:border-white/20">
                              {log.status}
                            </div>
                          ) : (
                            <div className="w-fit rounded-md bg-[#fd366e]/10 px-2 py-1 text-[#fd366e] font-medium text-sm">
                              {log.status}
                            </div>
                          )}
                        </td>
                        <td className="text-black/70 dark:text-white/70 font-medium">{log.method}</td>
                        <td className="hidden lg:table-cell text-black/60 dark:text-white/60 font-[Fira_Code] text-sm">{log.path}</td>
                        <td className="hidden font-[Fira_Code] text-sm lg:table-cell text-black/60 dark:text-white/60 max-w-md truncate">
                          {log.response}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 pl-4 font-[Fira_Code] text-black/40 dark:text-white/40 italic">
                        There are no logs to show
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </aside>
    </main>
  );
}

export default App;
