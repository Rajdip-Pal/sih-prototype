import Image from 'next/image';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrustBadge } from '@/components/ui/trust-badge';
import { Search, QrCode, Leaf, Package, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

const sampleProducts = [
  {
    id: 'P001',
    name: 'Organic Gobindobhog Rice',
    variety: 'Gobindobhog (Aromatic)',
    farm: 'Chatterjee Organic Farm',
    location: 'Bardhaman, West Bengal',
    harvestDate: 'November 20, 2024',
    status: 'Available',
    image: '/organic-cherry-tomatoes.png', // We can update with rice image later
  },
  {
    id: 'P002',
    name: 'Fresh Bengali Tomatoes',
    variety: 'Pusa Ruby',
    farm: 'Das Vegetable Farm',
    location: 'Hooghly, West Bengal',
    harvestDate: 'December 15, 2024',
    status: 'Fresh',
    image: '/fresh-organic-cherry-tomatoes.jpg',
  },
  {
    id: 'P003',
    name: 'West Bengal Potatoes',
    variety: 'Kufri Jyoti',
    farm: 'Chatterjee Organic Farm',
    location: 'Bardhaman, West Bengal',
    harvestDate: 'December 20, 2024',
    status: 'Cold Storage',
    image: '/colorful-rainbow-carrots.jpg', // We can update with potato image later
  },
  {
    id: 'P004',
    name: 'Fresh Water Rohu Fish',
    variety: 'Rohu (Labeo rohita)',
    farm: 'Mondal Fish Farm',
    location: 'North 24 Parganas, West Bengal',
    harvestDate: 'December 1, 2024',
    status: 'Fresh',
    image: '/fresh-butter-lettuce.jpg', // We can update with fish image later
  },
  {
    id: 'P005',
    name: 'Bengali Brinjal',
    variety: 'Begun (Purple Long)',
    farm: 'Das Vegetable Farm',
    location: 'Hooghly, West Bengal',
    harvestDate: 'November 30, 2024',
    status: 'Market Ready',
    image: '/organic-cherry-tomatoes.png', // We can update with brinjal image later
  },
];

export default function TracePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Navigation />

      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center space-y-4 mb-12'>
          <h1 className='text-4xl font-bold text-balance'>
            Trace Your Products
          </h1>
          <p className='text-xl text-muted-foreground text-pretty max-w-2xl mx-auto'>
            Enter a product ID or batch number to view its complete supply chain
            journey
          </p>
        </div>

        {/* Search Section */}
        <Card className='mb-12'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Search className='w-5 h-5' />
              Product Search
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <Input
                  placeholder='Enter product ID, batch number, or QR code...'
                  className='text-lg h-12'
                />
              </div>
              <Button size='lg' className='px-8'>
                <Search className='w-5 h-5 mr-2' />
                Search
              </Button>
            </div>
            <div className='flex items-center justify-center'>
              <span className='text-muted-foreground text-sm'>or</span>
            </div>
            <div className='text-center'>
              <Button variant='outline' size='lg' asChild>
                <Link href='/scan'>
                  <QrCode className='w-5 h-5 mr-2' />
                  Scan QR Code
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sample Products */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Sample Products</h2>
            <p className='text-muted-foreground'>
              Click any product to view its journey
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sampleProducts.map((product) => (
              <Link
                href={`/trace/${product.id}`}
                key={product.id}
                className='block'
              >
                <Card
                  key={product.id}
                  className='hover:shadow-lg transition-shadow cursor-pointer'
                >
                  <CardContent className='p-0'>
                    <div className='aspect-video bg-muted overflow-hidden rounded-t-lg'>
                      <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className='w-full h-full object-cover'
                        width={300}
                        height={200}
                      />
                    </div>
                    <div className='p-6 space-y-4'>
                      <div className='space-y-2'>
                        <div className='flex items-start justify-between'>
                          <h3 className='font-semibold text-lg'>
                            {product.name}
                          </h3>
                          <TrustBadge type='verified' />
                        </div>
                        <p className='text-muted-foreground text-sm'>
                          {product.variety}
                        </p>
                      </div>

                      <div className='space-y-2 text-sm'>
                        <div className='flex items-center gap-2'>
                          <Leaf className='w-4 h-4 text-primary' />
                          <span className='font-medium'>{product.farm}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-4 h-4 text-muted-foreground' />
                          <span className='text-muted-foreground'>
                            {product.location}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-4 h-4 text-muted-foreground' />
                          <span className='text-muted-foreground'>
                            {product.harvestDate}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between pt-2'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'In Store'
                              ? 'bg-primary/10 text-primary'
                              : product.status === 'In Transit'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {product.status}
                        </span>
                        <Package className='w-4 h-4 text-muted-foreground' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
