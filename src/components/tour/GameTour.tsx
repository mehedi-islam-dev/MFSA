"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function GameTour() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Only run on the dashboard routes, and check if it has been seen
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (hasSeenTour === "true") return;

    // Initialize driver with glassmorphism overlay
    const driverObj = driver({
      overlayColor: "rgba(15, 23, 42, 0.5)",
      animate: true,
      popoverClass: "driver-theme",
      showProgress: true,
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
          localStorage.setItem("hasSeenTour", "true");
          driverObj.destroy();
          if (!driverObj.hasNextStep()) {
            toast.success("Tour completed! You're ready to start exploring.");
          }
        }
      },
      steps: [
        {
          element: "body",
          popover: {
            title: "Welcome to Marine Analytica 🌊",
            description: "Let's take a quick tour of the autonomous marine AI ecosystem.",
            align: "center",
          },
        },
        {
          element: "#tour-data-entry",
          popover: {
            title: "Data Entry Workspace",
            description: "Here you can log fish samples. Click 'Load Barramundi Demo Data' to populate the system.",
            align: "start",
          },
        },
        {
          element: "#tour-analysis-charts",
          popover: {
            title: "Analytics Engine",
            description: "Review academic-grade stock assessments, Length-Weight regressions, and frequency models here.",
            align: "start",
          },
        },
        {
          element: "#tour-export-reports",
          popover: {
            title: "Export Engine",
            description: "Generate A4 print-ready PDFs and DOCX academic reports directly from your data.",
            align: "start",
          },
        },
      ],
    });

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      // NOTE: Because the elements live on different pages, driver.js will skip steps where elements are missing.
      // In a full implementation, you would trigger steps conditionally based on the current pathname, 
      // or attach the tour to the sidebar navigation. For now, it will highlight what is available.
      driverObj.drive();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [mounted, pathname]);

  return null;
}
