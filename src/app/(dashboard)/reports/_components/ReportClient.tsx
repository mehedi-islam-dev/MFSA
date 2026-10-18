"use client";

import { useRef } from "react";
import { useData } from "@/components/providers/DataProvider";
import { LengthWeightModelChart } from "@/app/(dashboard)/analysis/_components/LengthWeightModelChart";
import { LengthFrequencyChart } from "@/app/(dashboard)/analysis/_components/LengthFrequencyChart";
import { useReactToPrint } from "react-to-print";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { FileText, FileDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ReportClient() {
  const { fishRecords, lwrParams, avgConditionFactor, aiSummary } = useData();
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Marine_Assessment_Report",
    onAfterPrint: () => toast.success("PDF Exported Successfully!"),
  });

  const handleDocxExport = async () => {
    const totalRecords = fishRecords.length;
    const avgLength = totalRecords > 0 
      ? (fishRecords.reduce((sum, r) => sum + r.length, 0) / totalRecords).toFixed(1) 
      : "0";
    const avgWeight = totalRecords > 0 
      ? (fishRecords.reduce((sum, r) => sum + r.weight, 0) / totalRecords).toFixed(1) 
      : "0";

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Marine Assessment Report",
                  bold: true,
                  size: 32, // 16pt
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date: ${new Date().toLocaleDateString()}`,
                  size: 24, // 12pt
                }),
              ],
            }),
            new Paragraph({ text: "" }), // Spacing
            new Paragraph({
              children: [
                new TextRun({
                  text: "Summary Statistics",
                  bold: true,
                  size: 28, // 14pt
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Total Records: ${totalRecords}`, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Average Length: ${avgLength} cm`, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Average Weight: ${avgWeight} g`, size: 24 }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "marine_assessment.docx";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Word Document Exported Successfully!");
  };

  if (fishRecords.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8 text-center bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
        <div className="relative z-10">
          <FileText className="w-12 h-12 text-cyan-500 mx-auto mb-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">No Data Available for Report</h2>
          <p className="text-slate-500 mb-6">Please load data in the Data Entry workspace first.</p>
          <Link href="/data-entry" className="px-6 py-2.5 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm inline-flex items-center gap-2 rounded-xl">
            Go to Data Entry
          </Link>
        </div>
      </motion.div>
    );
  }

  const totalRecords = fishRecords.length;
  const avgLength = (fishRecords.reduce((sum, r) => sum + r.length, 0) / totalRecords).toFixed(1);
  const avgWeight = (fishRecords.reduce((sum, r) => sum + r.weight, 0) / totalRecords).toFixed(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Action Bar */}
      <div className="bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative overflow-hidden group p-6" id="tour-export-reports">
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
              <FileText className="w-6 h-6 text-cyan-400" />
              Academic Export Engine
            </h1>
            <p className="text-slate-400">Generate A4 PDF or DOCX reports.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handlePrint()}
              className="flex-1 md:flex-none px-6 py-2.5 flex items-center justify-center gap-2 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm rounded-xl"
            >
              <FileDown className="w-4 h-4" />
              PDF (A4)
            </button>
            <button
              onClick={handleDocxExport}
              className="flex-1 md:flex-none px-6 py-2.5 flex items-center justify-center gap-2 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_40px_rgba(6,182,212,1)] transition-all duration-300 uppercase tracking-[0.2em] font-bold text-sm rounded-xl"
            >
              <FileDown className="w-4 h-4" />
              Word (DOCX)
            </button>
          </div>
        </div>
      </div>

      {/* A4 Canvas Container */}
      <div className="overflow-x-auto w-full flex justify-center p-8 bg-cyan-950/10 backdrop-blur-3xl border border-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-2xl relative group">
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-400/10 z-0"></div>
        <div 
          className="bg-white text-black p-12 shadow-[0_0_50px_rgba(34,211,238,0.2)] relative z-10" 
          style={{ width: '210mm', minHeight: '297mm' }}
          ref={componentRef}
        >
          {/* Academic Report Structure */}
          <div className="mb-10 border-b-2 border-black pb-4">
            <h1 className="text-3xl font-serif font-bold text-center mb-2">Marine Assessment Report</h1>
            <p className="text-center font-serif text-gray-700">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">1. Summary Statistics</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">Total Records</p>
                <p className="text-2xl font-bold">{totalRecords}</p>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">Average Length</p>
                <p className="text-2xl font-bold">{avgLength} cm</p>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">Average Weight</p>
                <p className="text-2xl font-bold">{avgWeight} g</p>
              </div>
            </div>
          </div>

          <div className="mb-8 page-break-inside-avoid">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">2. Mathematical Parameters</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">Length-Weight Relationship (W = aL^b)</p>
                <div className="font-mono text-lg mt-2">
                  <p>a = {lwrParams.a.toExponential(4)}</p>
                  <p>b = {lwrParams.b.toFixed(4)}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-bold uppercase tracking-wider mb-1">Average Fulton's Condition Factor (K)</p>
                <div className="font-mono text-2xl mt-2">{avgConditionFactor.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="mb-8 page-break-inside-avoid">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">3. Population Structure Analysis</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col">
                <h3 className="font-bold mb-2">Length-Weight Relationship Model</h3>
                <div className="h-[300px] w-full">
                  <LengthWeightModelChart records={fishRecords} />
                </div>
                <p className="text-xs text-center text-gray-500 italic mt-2">Figure 1. Scatter plot depicting the relationship between total length and weight.</p>
              </div>

              <div className="flex flex-col">
                <h3 className="font-bold mb-2">Length Frequency Distribution</h3>
                <div className="h-[300px] w-full">
                  <LengthFrequencyChart records={fishRecords} />
                </div>
                <p className="text-xs text-center text-gray-500 italic mt-2">Figure 2. Bar chart showing the frequency distribution of lengths grouped by 10cm classes.</p>
              </div>
            </div>
          </div>
          
          {aiSummary && (
            <div className="mb-8 page-break-inside-avoid">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">4. AI Biological Interpretation</h2>
              <div className="bg-gray-50 p-6 border border-gray-200 text-sm prose prose-sm max-w-none prose-p:leading-relaxed whitespace-pre-wrap">
                {aiSummary}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-16 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
            Marine Analytica Academic Export Engine • For internal research use only.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
