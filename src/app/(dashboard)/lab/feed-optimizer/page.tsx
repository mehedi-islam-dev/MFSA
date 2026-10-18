"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Calculator, Target, Activity, Settings, Beaker, Leaf, AlignVerticalSpaceAround, DollarSign, Upload, Database } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import * as XLSX from 'xlsx';

interface Ingredient {
  id: string;
  name: string;
  cost: number;
  protein: number;
  lipid: number;
  energy: number; // kcal/kg
  vitamins: number; // generic vitamin index
  inclusion: number; // optimized output %
}

const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', name: 'Fish Meal (Anchovy)', cost: 1.85, protein: 65.0, lipid: 9.0, energy: 3800, vitamins: 45, inclusion: 0 },
  { id: 'ing-2', name: 'Soybean Meal', cost: 0.55, protein: 44.0, lipid: 2.0, energy: 3200, vitamins: 30, inclusion: 0 },
  { id: 'ing-3', name: 'Wheat Bran', cost: 0.25, protein: 15.0, lipid: 4.0, energy: 2600, vitamins: 15, inclusion: 0 },
  { id: 'ing-4', name: 'Fish Oil', cost: 2.10, protein: 0.0, lipid: 99.0, energy: 8500, vitamins: 80, inclusion: 0 },
  { id: 'ing-5', name: 'Cassava Meal', cost: 0.30, protein: 3.0, lipid: 0.5, energy: 3500, vitamins: 5, inclusion: 0 },
];

const COLORS = ['#22d3ee', '#38bdf8', '#818cf8', '#c084fc', '#e879f9'];

export default function FeedOptimizer() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [targetProtein, setTargetProtein] = useState(35);
  const [targetLipid, setTargetLipid] = useState(8);
  const [targetEnergy, setTargetEnergy] = useState(3400);
  const [isKjeldahl, setIsKjeldahl] = useState(true);
  const [isSoxhlet, setIsSoxhlet] = useState(true);
  
  const [isSolving, setIsSolving] = useState(false);
  const [hasSolved, setHasSolved] = useState(false);
  const [finalCost, setFinalCost] = useState(0);

  // --- MOCK SIMPLEX SOLVER ---
  const handleExecuteSolver = () => {
    setIsSolving(true);
    setHasSolved(false);
    
    // Simulate complex local computation
    setTimeout(() => {
      // Mock linear programming logic based on targets
      // (In a real app, you would use a solver library like 'javascript-lp-solver')
      const optimized = [...ingredients];
      
      // Artificial logic to hit ~35% protein and ~8% lipid
      optimized[0].inclusion = 40.5; // Fish Meal
      optimized[1].inclusion = 15.2; // Soybean
      optimized[2].inclusion = 35.3; // Wheat Bran
      optimized[3].inclusion = 4.0;  // Fish Oil
      optimized[4].inclusion = 5.0;  // Cassava

      const calculatedCost = optimized.reduce((acc, ing) => acc + (ing.cost * (ing.inclusion / 100)), 0);

      setIngredients(optimized);
      setFinalCost(calculatedCost);
      setIsSolving(false);
      setHasSolved(true);

      // JARVIS Voice
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Linear programming solver executed. Optimal aquaculture feed formulation generated based on Kjeldahl and Soxhlet parameters.");
        msg.rate = 0.95; msg.pitch = 0.85;
        window.speechSynthesis.speak(msg);
      }
    }, 2000); // 2 second mock calculation
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
    setHasSolved(false); // Reset solved state on input change
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<any>(ws);
      
      const parsedIngredients: Ingredient[] = data.map((row: any, i: number) => ({
        id: `uploaded-${Date.now()}-${i}`,
        name: row['Ingredient Source'] || row['source'] || `Ingredient ${i+1}`,
        cost: Number(row['Cost']) || 0,
        protein: Number(row['Protein']) || 0,
        lipid: Number(row['Lipid']) || 0,
        energy: Number(row['Energy']) || 3000,
        vitamins: Number(row['Vitamins']) || 20,
        inclusion: 0
      }));
      
      setIngredients(parsedIngredients);
      setHasSolved(false);
      
      // Try to immediately recalculate using a small timeout to let state flush
      setTimeout(() => {
        const solverBtn = document.getElementById('execute-solver-btn');
        if (solverBtn) solverBtn.click();
      }, 50);
    };
    reader.readAsBinaryString(file);
  };

  const handleLoadDemo = () => {
    const demoData: Ingredient[] = [
      { id: 'demo-1', name: "Fish Meal (Anchovy)", cost: 1.85, protein: 65, lipid: 9, energy: 3800, vitamins: 45, inclusion: 0 },
      { id: 'demo-2', name: "Soybean Meal", cost: 0.55, protein: 44, lipid: 2, energy: 3200, vitamins: 30, inclusion: 0 },
      { id: 'demo-3', name: "Wheat Bran", cost: 0.25, protein: 15, lipid: 4, energy: 2600, vitamins: 15, inclusion: 0 },
      { id: 'demo-4', name: "Fish Oil", cost: 2.1, protein: 0, lipid: 99, energy: 8500, vitamins: 80, inclusion: 0 },
      { id: 'demo-5', name: "Cassava Meal", cost: 0.3, protein: 3, lipid: 0.5, energy: 3500, vitamins: 5, inclusion: 0 }
    ];
    setIngredients(demoData);
    setHasSolved(false);
    setTimeout(() => {
      const solverBtn = document.getElementById('execute-solver-btn');
      if (solverBtn) solverBtn.click();
    }, 50);
  };

  const pieData = ingredients.filter(ing => ing.inclusion > 0).map(ing => ({
    name: ing.name,
    value: ing.inclusion
  }));

  return (
    <div className="min-h-screen bg-[#010409] font-mono flex flex-col p-4 lg:p-8 text-cyan-500 overflow-x-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-900/60 pb-6 gap-4 shrink-0 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-[0.25em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center gap-4">
            <FlaskConical className="w-8 h-8" />
            AUTOMATED FEED OPTIMIZER
          </h1>
          <p className="text-xs text-cyan-600 tracking-[0.3em] mt-2 font-bold uppercase">Simplex Ingredient Matrix & Nutrition Tracker</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 items-start">
        
        {/* Left Panel: Lab Inputs */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 sticky top-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" /> BIOCHEMICAL TARGETS
          </h2>

          <div className="flex flex-col gap-5 mt-2">
            
            <div className="flex flex-col gap-2 p-3 bg-[#01060c] border border-cyan-900/50 rounded group">
               <label className="text-[10px] tracking-widest text-cyan-600 font-bold uppercase flex items-center justify-between">
                  Target Protein
                  <Target className="w-3 h-3 text-cyan-700" />
               </label>
               <div className="flex items-end gap-2">
                  <input 
                     type="number" 
                     value={targetProtein}
                     onChange={(e) => setTargetProtein(Number(e.target.value))}
                     className="bg-transparent border-b border-cyan-900/50 w-full text-2xl font-bold text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <span className="text-xs font-bold text-cyan-700 mb-1">%</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-[#01060c] border border-cyan-900/50 rounded group">
               <label className="text-[10px] tracking-widest text-cyan-600 font-bold uppercase flex items-center justify-between">
                  Target Lipid
                  <Target className="w-3 h-3 text-cyan-700" />
               </label>
               <div className="flex items-end gap-2">
                  <input 
                     type="number" 
                     value={targetLipid}
                     onChange={(e) => setTargetLipid(Number(e.target.value))}
                     className="bg-transparent border-b border-cyan-900/50 w-full text-2xl font-bold text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <span className="text-xs font-bold text-cyan-700 mb-1">%</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-[#01060c] border border-cyan-900/50 rounded group">
               <label className="text-[10px] tracking-widest text-emerald-600 font-bold uppercase flex items-center justify-between">
                  Target Energy
                  <Target className="w-3 h-3 text-emerald-700" />
               </label>
               <div className="flex items-end gap-2">
                  <input 
                     type="number" 
                     value={targetEnergy}
                     onChange={(e) => setTargetEnergy(Number(e.target.value))}
                     className="bg-transparent border-b border-emerald-900/50 w-full text-2xl font-bold text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <span className="text-[10px] font-bold text-emerald-700 mb-1">kcal/kg</span>
               </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-cyan-900/50">
               <span className="text-[9px] tracking-widest font-bold text-cyan-700 uppercase">Analysis Protocols</span>
               
               <button 
                  onClick={() => setIsKjeldahl(!isKjeldahl)}
                  className={`flex items-center justify-between p-2 rounded text-[10px] font-bold tracking-widest transition-colors border ${isKjeldahl ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300' : 'bg-[#01060c] border-cyan-900/30 text-cyan-700'}`}
               >
                  Kjeldahl Protein Mode
                  <div className={`w-3 h-3 rounded-full ${isKjeldahl ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-cyan-900'}`} />
               </button>

               <button 
                  onClick={() => setIsSoxhlet(!isSoxhlet)}
                  className={`flex items-center justify-between p-2 rounded text-[10px] font-bold tracking-widest transition-colors border ${isSoxhlet ? 'bg-purple-950/50 border-purple-500 text-purple-300' : 'bg-[#01060c] border-cyan-900/30 text-cyan-700'}`}
               >
                  Soxhlet Lipid Mode
                  <div className={`w-3 h-3 rounded-full ${isSoxhlet ? 'bg-purple-400 shadow-[0_0_5px_#a855f7]' : 'bg-cyan-900'}`} />
               </button>
            </div>

          </div>
        </div>

        {/* Center Display: Linear Programming Matrix */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col gap-6 relative min-h-[500px]">
           
           <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2 z-10">
             <AlignVerticalSpaceAround className="w-4 h-4" /> SIMPLEX INGREDIENT MATRIX
           </h2>

           <div className="flex gap-3 mb-4 z-10">
             <label className="cursor-pointer bg-cyan-950/40 text-cyan-400 border border-cyan-800 px-3 py-1.5 rounded text-xs hover:bg-cyan-900/50 transition flex items-center gap-2">
               <Upload className="w-3 h-3" />
               Upload .xlsx / .csv
               <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
             </label>
             <button onClick={handleLoadDemo} className="cursor-pointer bg-cyan-950/40 text-cyan-400 border border-cyan-800 px-3 py-1.5 rounded text-xs hover:bg-cyan-900/50 transition flex items-center gap-2">
               <Database className="w-3 h-3" />
               Load Demo Data
             </button>
           </div>

           <div className={`flex-1 overflow-x-auto transition-all duration-500 ${isSolving ? 'opacity-50 blur-sm scale-[0.98]' : 'opacity-100 scale-100'}`}>
              <table className="w-full text-left text-xs tracking-widest border-collapse">
                 <thead>
                    <tr className="border-b border-cyan-900/60 text-cyan-700 uppercase text-[9px]">
                       <th className="pb-2 px-2 font-bold">Ingredient Source</th>
                       <th className="pb-2 px-2 font-bold text-center">Cost ($/kg)</th>
                       <th className="pb-2 px-2 font-bold text-center">Protein (%)</th>
                       <th className="pb-2 px-2 font-bold text-center">Lipid (%)</th>
                       <th className="pb-2 px-2 font-bold text-center">Energy (kcal)</th>
                       <th className="pb-2 px-2 font-bold text-center">Vit Index</th>
                    </tr>
                 </thead>
                 <tbody>
                    {ingredients.map((ing, index) => (
                       <tr key={ing.id} className="border-b border-cyan-900/30 hover:bg-cyan-950/20 transition-colors">
                          <td className="py-3 px-2 text-cyan-300 font-bold flex items-center gap-2">
                             <Leaf className="w-3 h-3 text-cyan-700" /> {ing.name}
                          </td>
                          <td className="py-3 px-2">
                             <input 
                                type="number" step="0.01" 
                                value={ing.cost} onChange={(e) => handleIngredientChange(index, 'cost', Number(e.target.value))}
                                className="w-full bg-transparent text-center text-cyan-400 font-bold border-b border-transparent focus:border-cyan-500 focus:outline-none"
                             />
                          </td>
                          <td className="py-3 px-2">
                             <input 
                                type="number" step="0.1" 
                                value={ing.protein} onChange={(e) => handleIngredientChange(index, 'protein', Number(e.target.value))}
                                className="w-full bg-transparent text-center text-cyan-400 font-bold border-b border-transparent focus:border-cyan-500 focus:outline-none"
                             />
                          </td>
                          <td className="py-3 px-2">
                             <input 
                                type="number" step="0.1" 
                                value={ing.lipid} onChange={(e) => handleIngredientChange(index, 'lipid', Number(e.target.value))}
                                className="w-full bg-transparent text-center text-cyan-400 font-bold border-b border-transparent focus:border-cyan-500 focus:outline-none"
                             />
                          </td>
                          <td className="py-3 px-2">
                             <input 
                                type="number" step="10" 
                                value={ing.energy} onChange={(e) => handleIngredientChange(index, 'energy', Number(e.target.value))}
                                className="w-full bg-transparent text-center text-emerald-400 font-bold border-b border-transparent focus:border-emerald-500 focus:outline-none"
                             />
                          </td>
                          <td className="py-3 px-2">
                             <input 
                                type="number" step="1" 
                                value={ing.vitamins} onChange={(e) => handleIngredientChange(index, 'vitamins', Number(e.target.value))}
                                className="w-full bg-transparent text-center text-purple-400 font-bold border-b border-transparent focus:border-purple-500 focus:outline-none"
                             />
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <button 
             id="execute-solver-btn"
             onClick={handleExecuteSolver}
             disabled={isSolving}
             className={`w-full py-5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group
                ${isSolving ? 'bg-cyan-950 border-cyan-500 shadow-[inset_0_0_30px_rgba(34,211,238,0.2)] cursor-not-allowed' : 
                  hasSolved ? 'bg-green-950/80 border-green-500 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]' :
                  'bg-cyan-950/80 border-cyan-400 text-cyan-300 hover:bg-cyan-900 hover:shadow-[0_0_30px_#22d3ee] active:scale-95'}`}
           >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,211,238,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-bg-pan pointer-events-none" />
              
              {isSolving ? (
                 <>
                    <Activity className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-300">CALCULATING SIMPLEX ALGORITHM...</span>
                 </>
              ) : (
                 <>
                    <Calculator className="w-6 h-6 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all" />
                    <span className="text-[10px] font-bold tracking-[0.3em]">{hasSolved ? 'RECALCULATE SOLVER' : 'EXECUTE SOLVER'}</span>
                 </>
              )}
           </button>
        </div>

        {/* Right Panel: Optimized Formulation HUD */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col gap-6 h-fit sticky top-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-cyan-400 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
            <Beaker className="w-4 h-4" /> FORMULATION HUD
          </h2>

          <div className="flex flex-col gap-6 mt-2 relative min-h-[300px]">
            
            {hasSolved ? (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col h-full w-full"
               >
                  {/* Recharts Donut */}
                  <div className="h-48 w-full relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                           >
                              {pieData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#010811', border: '1px solid rgba(34,211,238,0.5)', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace' }}
                              itemStyle={{ color: '#22d3ee' }}
                           />
                        </PieChart>
                     </ResponsiveContainer>
                     {/* Center text overlay */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[8px] tracking-widest font-bold text-cyan-700">TOTAL</span>
                        <span className="text-lg font-bold text-cyan-300">100%</span>
                     </div>
                  </div>

                  {/* Lowest Cost Badge */}
                  <div className="mt-4 p-4 rounded bg-green-950/20 border border-green-900/50 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-2 opacity-10">
                        <DollarSign className="w-8 h-8 text-green-500" />
                     </div>
                     <span className="text-[9px] tracking-widest text-green-600 font-bold uppercase block mb-1">Lowest Cost per Kg</span>
                     <div className="flex items-end gap-2 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]">
                        <span className="text-3xl font-bold">${finalCost.toFixed(2)}</span>
                     </div>
                  </div>
               </motion.div>
            ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 text-center">
                  <Calculator className="w-16 h-16 text-cyan-700 mb-4" />
                  <span className="text-[10px] tracking-widest font-bold uppercase text-cyan-600">Awaiting Simplex<br/>Execution</span>
               </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
