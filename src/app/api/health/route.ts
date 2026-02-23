import { NextResponse } from 'next/server';

/**
 * Endpoint de Health Check para Cloud Run Probes
 * Retorna 200 OK se o container estiver pronto para receber tráfego.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'cloud-native-nextjs',
      node_version: process.version,
    },
    { status: 200 }
  );
}
