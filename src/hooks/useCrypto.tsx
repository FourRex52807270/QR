import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface CryptoEntry {
  date: string;
  value: number;
}

export const useCrypto = () => {
  const [history, setHistory] = useState<CryptoEntry[]>([]);

  const todayStr = new Date().toISOString().split("T")[0]; // e.g., "2025-07-29"

  useEffect(() => {
    const ensureTodayEntry = async () => {
      const docRef = doc(db, "crypto", todayStr);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const fakeValue = Math.floor(1000 + Math.random() * 1000); // Random value
        await setDoc(docRef, {
          date: todayStr,
          value: fakeValue,
        });
      }

      // Fetch all entries
      const snapshot = await getDocs(collection(db, "crypto"));
      const entries: CryptoEntry[] = [];
      snapshot.forEach((doc) => {
        entries.push(doc.data() as CryptoEntry);
      });

      // Sort by date ascending and limit to last 30
      entries.sort((a, b) => a.date.localeCompare(b.date));
      const limitedEntries = entries.slice(-30); // Keep only last 30 days

      setHistory(limitedEntries);
    };

    ensureTodayEntry();
  }, []);

  return { history };
};
