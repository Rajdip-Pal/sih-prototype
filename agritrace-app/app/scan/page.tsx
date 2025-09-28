wwww'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { QRScanner } from '@/components/ui/qr-scanner';
import { ScanResult } from '@/components/ui/scan-result';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  QrCode,
  Smartphone,
  ArrowLeft,
  Camera,
  Upload,
  Zap,
} from 'lucide-react';

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (result: string) => {
    setScanResult(result);
    setShowScanner(false);
  };

  const handleScanAnother = () => {
    setScanResult(null);
    setShowScanner(true);
  };

  const handleCloseScan = () => {
    setShowScanner(false);
    setScanResult(null);
  };

  if (scanResult) {
    return (
      <div className='min-h-screen bg-background'>
        <Navigation />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center gap-4 mb-8'>
            <Button variant='ghost' size='sm' onClick={handleCloseScan}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Scanner
            </Button>
          </div>
          <ScanResult
            productId={scanResult}
            onClose={handleCloseScan}
            onScanAnother={handleScanAnother}
          />
        </div>
      </div>
    );
  }

  if (showScanner) {
    return (
      <div className='min-h-screen bg-background'>
        <Navigation />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center gap-4 mb-8'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowScanner(false)}
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </Button>
            <h1 className='text-2xl font-bold'>QR Code Scanner</h1>
          </div>
          <QRScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center space-y-4 mb-12'>
          <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto'>
            <QrCode className='w-10 h-10 text-primary' />
          </div>
          <h1 className='text-4xl font-bold text-balance'>Scan QR Code</h1>
          <p className='text-xl text-muted-foreground text-pretty max-w-2xl mx-auto'>
            Instantly access complete product information and supply chain
            transparency
          </p>
        </div>

        {/* Main Scanner Card */}
        <Card className='max-w-md mx-auto mb-12'>
          <CardHeader className='text-center'>
            <CardTitle className='flex items-center justify-center gap-2'>
              <Camera className='w-5 h-5' />
              Start Scanning
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Button
              onClick={() => setShowScanner(true)}
              className='w-full text-lg h-12'
            >
              <QrCode className='w-5 h-5 mr-2' />
              Open Camera Scanner
            </Button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-muted' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or
                </span>
              </div>
            </div>

            <div className='relative'>
              <input
                aria-label='Upload QR code image'
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Simulate processing - use real Bengali Tomatoes product ID
                    setTimeout(() => handleScan('P002'), 1000);
                  }
                }}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              />
              <Button
                variant='outline'
                className='w-full text-lg h-12 bg-transparent'
              >
                <Upload className='w-5 h-5 mr-2' />
                Upload QR Image
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className='grid md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
          <Card className='text-center p-6'>
            <CardContent className='space-y-4'>
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto'>
                <Zap className='w-6 h-6 text-primary' />
              </div>
              <h3 className='text-lg font-semibold'>Instant Results</h3>
              <p className='text-muted-foreground text-sm'>
                Get complete product information in seconds with our fast QR
                scanning technology
              </p>
            </CardContent>
          </Card>

          <Card className='text-center p-6'>
            <CardContent className='space-y-4'>
              <div className='w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto'>
                <Smartphone className='w-6 h-6 text-accent' />
              </div>
              <h3 className='text-lg font-semibold'>Mobile Optimized</h3>
              <p className='text-muted-foreground text-sm'>
                Designed for mobile devices with large tap targets and
                responsive design
              </p>
            </CardContent>
          </Card>

          <Card className='text-center p-6'>
            <CardContent className='space-y-4'>
              <div className='w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto'>
                <QrCode className='w-6 h-6 text-chart-3' />
              </div>
              <h3 className='text-lg font-semibold'>Universal Compatibility</h3>
              <p className='text-muted-foreground text-sm'>
                Works with all AgriTrace QR codes and supports image upload as
                backup
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sample QR Codes */}
        <div className='text-center mt-12'>
          <h2 className='text-2xl font-bold mb-6'>Try Sample Products</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto'>
            <Card className='p-4'>
              <CardContent className='space-y-4'>
                <div className='w-24 h-24 bg-muted rounded-lg mx-auto flex items-center justify-center'>
                  <QrCode className='w-12 h-12 text-muted-foreground' />
                </div>
                <div className='text-center'>
                  <h3 className='font-semibold'>Bengali Tomatoes</h3>
                  <p className='text-sm text-muted-foreground'>
                    Pusa Ruby Variety
                  </p>
                </div>
                <Button
                  variant='outline'
                  onClick={() => handleScan('P002')}
                  className='w-full bg-transparent'
                  size='sm'
                >
                  Try Product
                </Button>
              </CardContent>
            </Card>

            <Card className='p-4'>
              <CardContent className='space-y-4'>
                <div className='w-24 h-24 bg-muted rounded-lg mx-auto flex items-center justify-center'>
                  <QrCode className='w-12 h-12 text-muted-foreground' />
                </div>
                <div className='text-center'>
                  <h3 className='font-semibold'>Gobindobhog Rice</h3>
                  <p className='text-sm text-muted-foreground'>
                    Aromatic Organic
                  </p>
                </div>
                <Button
                  variant='outline'
                  onClick={() => handleScan('P001')}
                  className='w-full bg-transparent'
                  size='sm'
                >
                  Try Product
                </Button>
              </CardContent>
            </Card>

            <Card className='p-4'>
              <CardContent className='space-y-4'>
                <div className='w-24 h-24 bg-muted rounded-lg mx-auto flex items-center justify-center'>
                  <QrCode className='w-12 h-12 text-muted-foreground' />
                </div>
                <div className='text-center'>
                  <h3 className='font-semibold'>Rohu Fish</h3>
                  <p className='text-sm text-muted-foreground'>Fresh Water</p>
                </div>
                <Button
                  variant='outline'
                  onClick={() => handleScan('P004')}
                  className='w-full bg-transparent'
                  size='sm'
                >
                  Try Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
