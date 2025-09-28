'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrustBadge } from '@/components/ui/trust-badge';
import AgriTraceAPI, {
  type Product,
  type Farmer,
  type SupplyChainEvent,
} from '@/lib/api';
import {
  MapPin,
  Calendar,
  Package,
  Thermometer,
  Droplets,
  User,
  Phone,
  Award,
  Leaf,
  Truck,
  Building,
  Store,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface TraceData {
  product: Product;
  farmer: Farmer;
  supplyChain: SupplyChainEvent[];
  totalStages: number;
}

export default function ProductTracePage() {
  const params = useParams();
  const productId = params.id as string;

  const [traceData, setTraceData] = useState<TraceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchTraceData();
    }
  }, [productId]);

  const fetchTraceData = async () => {
    try {
      setLoading(true);
      const response = await AgriTraceAPI.traceProduct(productId);

      if (response.success) {
        setTraceData(response.trace);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product trace data');
      console.error('Error fetching trace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'farm':
      case 'aquaculture':
        return <Leaf className='w-5 h-5 text-green-600' />;
      case 'processing':
        return <Package className='w-5 h-5 text-blue-600' />;
      case 'transport':
      case 'distribution':
        return <Truck className='w-5 h-5 text-orange-600' />;
      case 'quality check':
        return <CheckCircle className='w-5 h-5 text-purple-600' />;
      case 'retail':
      case 'market supply':
        return <Store className='w-5 h-5 text-red-600' />;
      default:
        return <Building className='w-5 h-5 text-gray-600' />;
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <Navigation />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <p className='text-muted-foreground'>Loading product trace...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !traceData) {
    return (
      <div className='min-h-screen bg-background'>
        <Navigation />
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-red-600 mb-4'>
              Product Not Found
            </h1>
            <p className='text-muted-foreground mb-6'>{error}</p>
            <Button asChild>
              <Link href='/trace'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Trace
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { product, farmer, supplyChain } = traceData;

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />

      <div className='container mx-auto px-4 py-8'>
        {/* Back Button */}
        <Button variant='ghost' asChild className='mb-6'>
          <Link href='/trace'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Trace
          </Link>
        </Button>

        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
            <Package className='w-4 h-4' />
            Product ID: {product.productId}
          </div>
          <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
          <p className='text-lg text-muted-foreground'>{product.variety}</p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Product Details */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Package className='w-5 h-5' />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {product.certifications.map((cert) => (
                    <TrustBadge key={cert} type='verified' />
                  ))}
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>{product.location}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>
                      Harvested:{' '}
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Package className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>
                      Quantity: {product.quantity}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Award className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>
                      Grade: {product.qualityGrade}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farmer Details */}
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='w-5 h-5' />
                  Farmer Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='font-semibold'>{farmer.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {farmer.location}
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>
                      {farmer.village && farmer.district
                        ? `${farmer.village}, ${farmer.district}`
                        : farmer.location}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>{farmer.contactInfo}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Leaf className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>
                      Farm Size: {farmer.farmSize}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Award className='w-4 h-4 text-muted-foreground' />
                    <span className='text-sm'>{farmer.certification}</span>
                  </div>
                </div>

                <div>
                  <h4 className='font-medium mb-2'>Crops Grown:</h4>
                  <div className='flex flex-wrap gap-1'>
                    {farmer.crops.map((crop) => (
                      <Badge key={crop} variant='secondary' className='text-xs'>
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supply Chain Timeline */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Truck className='w-5 h-5' />
                  Supply Chain Journey
                </CardTitle>
                <p className='text-sm text-muted-foreground'>
                  {supplyChain.length} stages completed
                </p>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {supplyChain.map((event, index) => (
                    <div key={index} className='relative'>
                      <div className='flex items-start gap-4'>
                        <div className='flex-shrink-0 w-10 h-10 bg-background border-2 border-primary rounded-full flex items-center justify-center'>
                          {getStageIcon(event.stage)}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <h3 className='font-semibold'>{event.action}</h3>
                            <Badge variant='outline' className='text-xs'>
                              {event.stage}
                            </Badge>
                          </div>

                          <p className='text-sm text-muted-foreground mb-2'>
                            {event.location}
                          </p>

                          <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground mb-2'>
                            <div className='flex items-center gap-1'>
                              <Calendar className='w-3 h-3' />
                              {new Date(event.timestamp).toLocaleDateString()}
                            </div>
                            <div className='flex items-center gap-1'>
                              <User className='w-3 h-3' />
                              {event.actor}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Thermometer className='w-3 h-3' />
                              {event.temperature}
                            </div>
                            <div className='flex items-center gap-1'>
                              <Droplets className='w-3 h-3' />
                              {event.humidity}
                            </div>
                          </div>

                          <p className='text-sm'>{event.notes}</p>
                        </div>
                      </div>

                      {index < supplyChain.length - 1 && (
                        <div className='absolute left-5 top-10 w-0.5 h-6 bg-border'></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
