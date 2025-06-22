"use client"

import { useState } from "react"
import UploadSection from "@/components/upload-section"
import { ResultSection } from "@/components/result-section"
import AnalysisCard from "@/components/analysis-card"
import { Toaster, toast } from "sonner"
import FloatingBackground from "@/components/floating-background"
import Header from "@/components/header"
import FaceShapesGuide from "@/components/face-shapes-guide"
import Footer from "@/components/footer"
import StylingInsights from "@/components/styling-insights"

interface AnalysisData {
  image_url: string;
  face_shape: string;
  measurements: any;
  analysis_id: string;
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gender, setGender] = useState("female");

  const handleAnalysisComplete = (data: AnalysisData) => {
    setIsAnalyzing(true); // Keep the analyzing state for smooth transition
    // The AnalysisCard will now use the direct image_url from the backend
    setAnalysisResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <FloatingBackground />

      {/* Header Section */}
      <Header />

      <main className="relative z-10">
        <div className="pt-32 pb-16">
          <div className="text-center px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6 leading-tight tracking-tighter">
              AI-Powered <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Face Shape</span> Analysis
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Unlock personalized insights into your unique facial structure. Upload your photo to begin.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Toaster position="top-center" richColors />
          <UploadSection
            onAnalysisComplete={handleAnalysisComplete}
            isAnalyzing={isAnalyzing}
            gender={gender}
            setGender={setGender}
          />

          {/* Analysis Card - Enhanced Display */}
          {analysisResult && (
            <AnalysisCard
              analysis={analysisResult}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* Result Section - Detailed Measurements */}
          {/* {analysisResult && <ResultSection result={analysisResult} />} */}

          {/* Face Shape Guide */}
          {analysisResult && <StylingInsights faceShape={analysisResult.face_shape} gender={gender} />}
          <br />
          <FaceShapesGuide />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
