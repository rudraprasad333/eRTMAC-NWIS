import React, { useState, useEffect } from 'react';
import { Well, DrillingParam, AlertItem } from '../types';
import { LiveGauge } from '../components/live/LiveGauge';
import { ParameterStreamChart, TelemetryPoint } from '../components/live/ParameterStreamChart';
import { SimulationController } from '../components/live/SimulationController';
import { ShieldAlert, AlertTriangle, Radio } from 'lucide-react';

interface LiveDrillingPageProps {
  activeWell: Well;
  currentDepth: number;
  onUpdateDepth: (d: number) => void;
  alerts: AlertItem[];
}

export const LiveDrillingPage: React.FC<LiveDrillingPageProps> = ({
  activeWell,
  currentDepth,
  onUpdateDepth,
  alerts
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [depth, setDepth] = useState(currentDepth);

  const [rop, setRop] = useState(14.2);
  const [torque, setTorque] = useState(24.8);
  const [wob, setWob] = useState(18.5);
  const [rpm, setRpm] = useState(110);
  const [mudWeight, setMudWeight] = useState(10.8);
  const [standpipePressure, setStandpipePressure] = useState(3450);

  const [streamData, setStreamData] = useState<TelemetryPoint[]>([
    { time: '10:40', depth: 2710, rop: 16.5, torque: 18.2, wob: 16.0, rpm: 115, mud_weight: 10.6, standpipe_pressure: 3380 },
    { time: '10:41', depth: 2711, rop: 15.8, torque: 20.4, wob: 17.0, rpm: 112, mud_weight: 10.7, standpipe_pressure: 3410 },
    { time: '10:42', depth: 2713, rop: 14.9, torque: 22.1, wob: 17.8, rpm: 110, mud_weight: 10.8, standpipe_pressure: 3430 },
    { time: '10:43', depth: 2714, rop: 14.5, torque: 23.9, wob: 18.2, rpm: 110, mud_weight: 10.8, standpipe_pressure: 3445 },
    { time: '10:44', depth: 2715, rop: 14.2, torque: 24.8, wob: 18.5, rpm: 110, mud_weight: 10.8, standpipe_pressure: 3450 },
  ]);

  // Live simulation ticker
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDepth((prevDepth) => {
        const nextDepth = Number((prevDepth + 0.5 * speed).toFixed(1));
        onUpdateDepth(nextDepth);

        // Dynamic parameter updates
        const inCrit = nextDepth >= 2700 && nextDepth <= 2800;
        const newTorque = inCrit 
          ? Number((22.0 + 8.0 * Math.sin(nextDepth * 0.1) + (Math.random() - 0.5)).toFixed(1))
          : Number((14.0 + (Math.random() - 0.5)).toFixed(1));
        
        const newRop = inCrit
          ? Number((8.0 + 4.0 * Math.cos(nextDepth * 0.08) + (Math.random() - 0.5) * 0.5).toFixed(1))
          : Number((18.0 + (Math.random() - 0.5) * 1.5).toFixed(1));

        const newSpp = Math.round(2800 + nextDepth * 0.45 + (Math.random() - 0.5) * 20);

        setTorque(newTorque);
        setRop(newRop);
        setStandpipePressure(newSpp);

        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        setStreamData((prev) => {
          const next = [...prev.slice(-14), {
            time: timeStr,
            depth: nextDepth,
            rop: newRop,
            torque: newTorque,
            wob,
            rpm,
            mud_weight: mudWeight,
            standpipe_pressure: newSpp
          }];
          return next;
        });

        return nextDepth;
      });
    }, 1500 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, wob, rpm, mudWeight, onUpdateDepth]);

  const handleManualStep = (delta: number) => {
    const nextDepth = Number((depth + delta).toFixed(1));
    setDepth(nextDepth);
    onUpdateDepth(nextDepth);
  };

  const handleReset = (targetD: number = 2715) => {
    setDepth(targetD);
    onUpdateDepth(targetD);
    setIsRunning(false);
    setTorque(24.8);
    setRop(14.2);
  };

  const handleUpdateParam = (key: string, val: number) => {
    if (key === 'torque') setTorque(val);
    if (key === 'rop') setRop(val);
    if (key === 'mud_weight') setMudWeight(val);
  };

  const inCriticalZone = depth >= 2700 && depth <= 2800;

  return (
    <div className="space-y-6 pb-12">
      {/* Live Operational Status Banner */}
      <div className={`p-4 rounded-md border flex items-center justify-between transition-all ${
        inCriticalZone 
          ? 'bg-red-500/15 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
          : 'bg-[#0D1724] border-[#1C2A3A]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${inCriticalZone ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-100">
                WELL {activeWell.well_id} • REAL-TIME TELEMETRY CONSOLE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                1 Hz MWD DECODING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Current Formation: <span className="text-brand-sky font-bold">Fatehgarh Lower Sandstone</span> | Measured Depth: <span className="text-white font-bold">{depth} m MD</span>
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs font-bold text-red-400 block">
            {inCriticalZone ? '⚠ CRITICAL HAZARD ZONE (2,700–2,800m)' : 'NOMINAL DRILLING'}
          </span>
          <span className="text-[10px] text-slate-400">Mud Overbalance: +480 psi</span>
        </div>
      </div>

      {/* 6 Circular Gauges for Real-time Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <LiveGauge
          label="Torque"
          value={torque}
          unit="kft-lb"
          min={0}
          max={40}
          warningThreshold={22}
          criticalThreshold={28}
        />

        <LiveGauge
          label="Rate of Pen."
          value={rop}
          unit="m/hr"
          min={0}
          max={35}
          warningThreshold={25}
          criticalThreshold={30}
        />

        <LiveGauge
          label="Weight on Bit"
          value={wob}
          unit="klbs"
          min={0}
          max={45}
          warningThreshold={28}
          criticalThreshold={35}
        />

        <LiveGauge
          label="Rotary RPM"
          value={rpm}
          unit="rpm"
          min={0}
          max={180}
          warningThreshold={135}
          criticalThreshold={160}
        />

        <LiveGauge
          label="Mud Weight"
          value={mudWeight}
          unit="ppg"
          min={8.5}
          max={13.0}
          warningThreshold={11.0}
          criticalThreshold={11.8}
        />

        <LiveGauge
          label="Standpipe Press."
          value={standpipePressure}
          unit="psi"
          min={1500}
          max={5000}
          warningThreshold={4000}
          criticalThreshold={4500}
        />
      </div>

      {/* Real-time Scrolling Strip Chart */}
      <ParameterStreamChart data={streamData} />

      {/* Simulation Controls & Parameter Overrides */}
      <SimulationController
        isRunning={isRunning}
        onToggle={() => setIsRunning(!isRunning)}
        speed={speed}
        onSetSpeed={setSpeed}
        onStep={handleManualStep}
        onReset={handleReset}
        currentDepth={depth}
        torque={torque}
        rop={rop}
        mudWeight={mudWeight}
        onUpdateParam={handleUpdateParam}
      />
    </div>
  );
};
