"use client";

import { useEffect, useState } from "react";

export default function Tournament() {
  const [days, setDays] = useState(15);
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(24);
  const [seconds, setSeconds] = useState(55);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);
    if (seconds === 0) {
      clearInterval(interval);
    }
    if (seconds === 0) {
      setMinutes(minutes - 1);
      setSeconds(59);
    }
    if (minutes === 0) {
      setHours(hours - 1);
      setMinutes(59);
    }
    if (hours === 0) {
      setDays(days - 1);
      setHours(23);
    }
  }, [seconds, minutes, hours, days]);
  return (
    <div className="flex flex-col gap-2 justify-center mt-5">
      <h2 className="text-2xl font-bold text-center">Tournaments</h2>
      <p className="text-center">Tournaments are coming soon</p>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max justify-center">
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            {/* @ts-ignore */}
            <span style={{ "--value": days }}></span>
          </span>
          days
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            {/* @ts-ignore */}
            <span style={{ "--value": hours }}></span>
          </span>
          hours
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            {/* @ts-ignore */}
            <span style={{ "--value": minutes }}></span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            {/* @ts-ignore */}
            <span style={{ "--value": seconds }}></span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
}
