// app\api\upload\route.ts

import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Log file details
    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "uploads")
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const filepath = join(uploadDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file with error checking
    try {
      await writeFile(filepath, buffer)
      
      // Verify file was written correctly
      const fs = require('fs')
      const stats = fs.statSync(filepath)
      
      if (stats.size === 0) {
        throw new Error("File was written but is empty")
      }
      
      if (stats.size !== buffer.length) {
        throw new Error(`File size mismatch: expected ${buffer.length} bytes but got ${stats.size} bytes`)
      }

      // Double check file exists and is readable
      if (!fs.existsSync(filepath)) {
        throw new Error("File was not saved successfully")
      }

      console.log("File saved successfully:", {
        path: filepath,
        size: stats.size,
        originalSize: buffer.length
      })

      // Wait a moment to ensure file is fully written
      await new Promise(resolve => setTimeout(resolve, 100))

      return NextResponse.json({
        message: "File uploaded successfully",
        filename: filename,
        size: stats.size
      })
    } catch (writeError) {
      console.error("Error writing file:", writeError)
      // Clean up if file was partially written
      try {
        const fs = require('fs')
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        }
      } catch (cleanupError) {
        console.error("Error cleaning up failed upload:", cleanupError)
      }
      throw writeError
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
} 