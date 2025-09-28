'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrustBadge } from '@/components/ui/trust-badge';
import {
  CheckCircle,
  ExternalLink,
  Share2,
  X,
  Leaf,
  MapPin,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AgriTraceAPI } from '@/lib/api';

interface ScanResultProps {
  productId: string;
  onClose: () => void;
  onScanAnother: () => void;
  className?: string;
}

interface ProductData {
  id: string;
  name: string;
  variety: string;
  farm: string;
  location: string;
  harvestDate: string;
  currentStatus: string;
  image: string;
  certifications: string[];
  lastUpdate: string;
}

export function ScanResult({
  productId,
  onClose,
  onScanAnother,
  className,
}: ScanResultProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const api = new AgriTraceAPI();
        const traceData = await api.traceProduct(productId);

        if (traceData.success) {
          const productInfo = traceData.trace.product;
          const farmerInfo = traceData.trace.farmer;

          setProduct({
            id: productInfo.productId,
            name: productInfo.name,
            variety: productInfo.variety,
            farm: farmerInfo.name,
            location: productInfo.location,
            harvestDate: new Date(productInfo.harvestDate).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
            currentStatus: 'Available in Market',
            image: '/fresh-organic-cherry-tomatoes.jpg', // Default image
            certifications: productInfo.certifications || [],
            lastUpdate: 'Just now',
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', className)}>
        <CardContent className='p-8 text-center space-y-4'>
          <div className='w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse'>
            <CheckCircle className='w-8 h-8 text-primary' />
          </div>
          <div className='space-y-2'>
            <h3 className='font-semibold'>Scanning Complete!</h3>
            <p className='text-muted-foreground text-sm'>
              Loading product information...
            </p>
          </div>
          <div className='space-y-2'>
            <div className='h-4 bg-muted rounded animate-pulse' />
            <div className='h-4 bg-muted rounded animate-pulse w-3/4 mx-auto' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !product) {
    return (
      <Card
        className={cn('w-full max-w-md mx-auto border-destructive', className)}
      >
        <CardContent className='p-8 text-center space-y-4'>
          <div className='w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center'>
            <X className='w-8 h-8 text-destructive' />
          </div>
          <div className='space-y-2'>
            <h3 className='font-semibold'>Product Not Found</h3>
            <p className='text-muted-foreground text-sm'>
              {error ||
                "We couldn't find information for this QR code. Please try scanning again or contact support."}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={onScanAnother}
              className='flex-1 bg-transparent'
            >
              Scan Another
            </Button>
            <Button
              variant='outline'
              onClick={onClose}
              className='flex-1 bg-transparent'
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn('w-full max-w-md mx-auto animate-fade-in-up', className)}
    >
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle className='w-5 h-5 text-primary' />
            Scan Successful!
          </CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Product Image */}
        <div className='aspect-video bg-muted rounded-lg overflow-hidden'>
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className='w-full h-full object-cover'
            width={300}
            height={200}
          />
        </div>

        {/* Product Info */}
        <div className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-start justify-between'>
              <h3 className='text-xl font-bold'>{product.name}</h3>
              <div className='flex gap-1'>
                <TrustBadge type='verified' />
                <TrustBadge type='organic' />
              </div>
            </div>
            <p className='text-muted-foreground'>{product.variety}</p>
          </div>

          <div className='space-y-3 text-sm'>
            <div className='flex items-center gap-2'>
              <Leaf className='w-4 h-4 text-primary' />
              <span className='font-medium'>{product.farm}</span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='w-4 h-4 text-muted-foreground' />
              <span className='text-muted-foreground'>{product.location}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-muted-foreground' />
              <span className='text-muted-foreground'>
                Harvested {product.harvestDate}
              </span>
            </div>
          </div>

          <div className='p-3 bg-primary/5 border border-primary/20 rounded-lg'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-primary' />
              <span className='text-sm font-medium text-primary'>
                {product.currentStatus}
              </span>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Last updated {product.lastUpdate}
            </p>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium'>Certifications</p>
            <div className='flex flex-wrap gap-2'>
              {product.certifications.map((cert, i) => (
                <span
                  key={i}
                  className='px-2 py-1 bg-accent/10 text-accent text-xs rounded-full'
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='space-y-3 pt-2'>
          <Button asChild className='w-full'>
            <Link href={`/trace/${product.id}`}>
              <ExternalLink className='w-4 h-4 mr-2' />
              View Full Journey
            </Link>
          </Button>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={onScanAnother}
              className='flex-1 bg-transparent'
            >
              Scan Another
            </Button>
            <Button variant='outline' className='flex-1 bg-transparent'>
              <Share2 className='w-4 h-4 mr-2' />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
