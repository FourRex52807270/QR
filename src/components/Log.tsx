import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed
import { Timestamp } from "firebase/firestore";

interface LogEntry {
  timestamp: Timestamp;
  code: string;
}

const LogHistory = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(
          collection(db, "history"),
          orderBy("timestamp", "desc"),
          limit(30)
        );

        const snapshot = await getDocs(q);
        const entries: LogEntry[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          entries.push({
            timestamp: data.timestamp,
            code: data.code,
          });
        });

        setLogs(entries);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className=" w-full rounded-lg p-2">
      <h2 className="text-2xl font-bold mb-4">Recent Scans</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log, index) => (
            <li key={index} className="bg-white p-3 rounded shadow text-sm">
              <span className="block text-gray-600">
                {log.timestamp.toDate().toLocaleString()}
              </span>
              <span className="block font-mono text-black">Code: {log.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogHistory;
