import { NextRequest, NextResponse } from "next/server"
import linuxPackages from "@/data/linux-packages.json"
import { buildLinuxScript } from "@/lib/utils"

const PLAIN_TEXT = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const appsParam = searchParams.get("apps") ?? ""
  const rawIds = appsParam.split(",").map(s => s.trim()).filter(Boolean)

  if (rawIds.length === 0) {
    return new NextResponse(
      `echo "Error: No packages specified. Usage: ?apps=apt:git,flatpak:com.spotify.Client"; exit 1`,
      { headers: PLAIN_TEXT }
    )
  }

  const catalogIds = new Set((linuxPackages as Array<{ id: string }>).map(p => p.id))
  const valid: string[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const id of rawIds.slice(0, 50)) {
    const sanitized = id.replace(/[^A-Za-z0-9._:-]/g, "")
    
    if (sanitized !== id || !catalogIds.has(sanitized)) {
      invalid.push(id)
      continue
    }
    
    if (!seen.has(sanitized)) {
      seen.add(sanitized)
      valid.push(sanitized)
    }
  }

  if (valid.length === 0) {
    return new NextResponse(
      `echo "Error: No valid package IDs found."; exit 1`,
      { headers: PLAIN_TEXT }
    )
  }

  let script = buildLinuxScript(valid)
  if (invalid.length > 0) {
    script += `\n\necho "Warning: Skipped unknown packages: ${invalid.join(', ')}"`
  }

  return new NextResponse(script, { headers: PLAIN_TEXT })
}
