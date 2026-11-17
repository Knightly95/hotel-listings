import { NextResponse } from 'next/server';

import { generateHotels } from '@/src/data/hotels';

/**
 * GET /api/hotels.json
 *
 * The app's own hotels API. The data is deterministic, so the response is
 * rendered once at build time. That also lets the route be part of a static
 * export (GitHub Pages) with no server.
 */
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(generateHotels());
}
