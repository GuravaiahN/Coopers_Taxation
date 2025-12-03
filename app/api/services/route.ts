import { NextRequest, NextResponse } from 'next/server'
import { servicesData } from '../../../data/services'

export async function GET() {
  return NextResponse.json({
    services: servicesData,
    total: servicesData.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json()
    
    if (category && category !== 'all') {
      const filteredServices = servicesData.filter(service => service.category === category)
      return NextResponse.json({
        services: filteredServices,
        total: filteredServices.length,
        category
      })
    }
    
    return NextResponse.json({
      services: servicesData,
      total: servicesData.length
    })
  } catch (error) {
    console.error('Services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}