import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  PageOrientation,
  ShadingType,
} from "docx";
import { SummaryStats, ReportMeta, LengthBin } from "@/types";
import { formatNumber } from "@/lib/utils";

function headerCell(text: string): TableCell {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, size: 20 })],
      alignment: AlignmentType.CENTER,
    })],
    shading: { type: ShadingType.SOLID, color: "D0E8FF", fill: "D0E8FF" },
  });
}

function dataCell(text: string, center = false): TableCell {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, size: 19 })],
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
    })],
  });
}

export async function generateDocx(meta: ReportMeta, stats: SummaryStats): Promise<Blob> {
  const { lwrParams: lwr } = stats;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children: [
          // ── Title ──
          new Paragraph({
            text: "Marine Analytica — Scientific Report",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: meta.title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: meta.species, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: "" }),

          // ── Metadata Table ──
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  headerCell("Author"), headerCell("Institution"), headerCell("Location"), headerCell("Date"),
                ],
              }),
              new TableRow({
                children: [
                  dataCell(meta.author), dataCell(meta.institution), dataCell(meta.location), dataCell(meta.date),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // ── Abstract ──
          new Paragraph({ text: "Abstract", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({
            children: [new TextRun({
              text: `This report presents the length-weight relationship (LWR) analysis for ${meta.species} based on ${stats.n} specimens collected from ${meta.location}. The LWR was estimated using log-transformed data following the model W = aL^b. The allometric coefficient b = ${formatNumber(lwr.b, 4)} (95% CI: [${formatNumber(lwr.ci_b_lower || 0, 4)}, ${formatNumber(lwr.ci_b_upper || 0, 4)}]; R² = ${formatNumber(lwr.r2, 4)}) indicates ${lwr.b < 3 ? "negative" : lwr.b > 3 ? "positive" : "isometric"} allometric growth. The mean Fulton condition factor K = ${formatNumber(stats.meanK, 4)} suggests ${stats.meanK >= 1 ? "healthy" : "below-average"} condition of the sampled population.`,
              size: 22,
            })],
            alignment: AlignmentType.JUSTIFIED,
          }),
          new Paragraph({ text: "" }),

          // ── Summary Statistics ──
          new Paragraph({ text: "1. Summary Statistics", heading: HeadingLevel.HEADING_2 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  headerCell("Parameter"), headerCell("N"), headerCell("Mean ± SD"),
                  headerCell("Min"), headerCell("Max"),
                ],
              }),
              new TableRow({
                children: [
                  dataCell("Total Length (cm)"),
                  dataCell(stats.n.toString(), true),
                  dataCell(`${formatNumber(stats.meanTL)} ± ${formatNumber(stats.sdTL)}`, true),
                  dataCell(formatNumber(stats.minTL, 1), true),
                  dataCell(formatNumber(stats.maxTL, 1), true),
                ],
              }),
              new TableRow({
                children: [
                  dataCell("Body Weight (g)"),
                  dataCell(stats.n.toString(), true),
                  dataCell(`${formatNumber(stats.meanWeight)} ± ${formatNumber(stats.sdWeight)}`, true),
                  dataCell(formatNumber(stats.minWeight, 1), true),
                  dataCell(formatNumber(stats.maxWeight, 1), true),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // ── LWR Parameters ──
          new Paragraph({ text: "2. Length-Weight Relationship Parameters", heading: HeadingLevel.HEADING_2 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [headerCell("Parameter"), headerCell("Value"), headerCell("Interpretation")],
              }),
              ...[
                { p: "a (intercept)", v: lwr.a.toString(), i: "Condition at unit length" },
                { p: "b (slope/exponent)", v: `${formatNumber(lwr.b, 4)} ± ${formatNumber(lwr.se_b || 0, 4)} SE`, i: lwr.b < 3 ? "Negative allometric" : lwr.b > 3 ? "Positive allometric" : "Isometric growth" },
                { p: "95% CI of b", v: `[${formatNumber(lwr.ci_b_lower || 0, 4)}, ${formatNumber(lwr.ci_b_upper || 0, 4)}]`, i: "Confidence Interval" },
                { p: "R² (goodness of fit)", v: formatNumber(lwr.r2, 4), i: lwr.r2 > 0.95 ? "Excellent fit" : lwr.r2 > 0.9 ? "Good fit" : "Fair fit" },
                { p: "Sample size (N)", v: lwr.n.toString(), i: "Valid measurements" },
                { p: "Mean Fulton's K", v: formatNumber(stats.meanK, 4), i: stats.meanK >= 1 ? "Healthy (K ≥ 1)" : "Below average (K < 1)" },
              ].map(({ p, v, i }) => new TableRow({
                children: [dataCell(p), dataCell(v, true), dataCell(i)],
              })),
            ],
          }),
          new Paragraph({ text: "" }),

          // ── Length Frequency Table ──
          new Paragraph({ text: "3. Length Frequency Table", heading: HeadingLevel.HEADING_2 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  headerCell("Length Class (cm)"), headerCell("Midpoint"), headerCell("Count (n)"),
                  headerCell("Frequency (%)"), headerCell("Cumulative (%)"),
                ],
              }),
              ...stats.lengthBins.map((bin: LengthBin, i: number) => {
                const cum = stats.lengthBins.slice(0, i + 1).reduce((a, b) => a + b.frequency, 0);
                return new TableRow({
                  children: [
                    dataCell(bin.bin, true),
                    dataCell(bin.midpoint.toString(), true),
                    dataCell(bin.count.toString(), true),
                    dataCell(`${bin.frequency.toFixed(2)}%`, true),
                    dataCell(`${cum.toFixed(2)}%`, true),
                  ],
                });
              }),
            ],
          }),
          new Paragraph({ text: "" }),

          // ── Footer ──
          new Paragraph({
            children: [
              new TextRun({ text: `Generated by Marine Analytica v2.0 on ${new Date().toLocaleDateString()} | Confidential — Academic Use Only`, size: 16, color: "888888" }),
            ],
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } },
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadDocx(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
