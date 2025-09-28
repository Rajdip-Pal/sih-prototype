import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrustBadge } from '@/components/ui/trust-badge';
import {
  QrCode,
  Shield,
  Users,
  Truck,
  Leaf,
  CheckCircle,
  ArrowRight,
  Smartphone,
  BarChart3,
  FileCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Navigation />

      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-primary/5'>
        <div className='container mx-auto px-4 py-20 lg:py-32'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-8 animate-fade-in-up'>
              <div className='space-y-4'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Shield className='w-4 h-4 text-primary' />
                  Blockchain-Powered Transparency
                </div>
                <h1 className='text-4xl lg:text-6xl font-bold text-balance leading-tight'>
                  Track West Bengal&apos;s food from{' '}
                  <span className='text-primary'>khetan to thala</span>
                </h1>
                <p className='text-xl text-muted-foreground text-pretty max-w-lg'>
                  সম্পূর্ণ খাদ্য সরবরাহ শৃঙ্খল স্বচ্ছতা। Blockchain technology
                  দিয়ে West Bengal এর কৃষি পণ্যের journey track করুন এবং trust
                  করুন।
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Button size='lg' className='text-lg px-8' asChild>
                  <Link href='/scan'>
                    <QrCode className='w-5 h-5 mr-2' />
                    Scan Product QR
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='text-lg px-8 bg-transparent'
                  asChild
                >
                  <Link href='/trace'>
                    Learn More
                    <ArrowRight className='w-5 h-5 ml-2' />
                  </Link>
                </Button>
              </div>

              <div className='flex items-center gap-6 pt-4'>
                <TrustBadge type='verified' />
                <TrustBadge type='organic' />
                <TrustBadge type='blockchain' />
              </div>
            </div>

            <div className='relative animate-slide-in-right'>
              <div className='relative bg-card rounded-2xl shadow-2xl p-6 border'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-semibold'>Gobindobhog Rice</h3>
                    <TrustBadge type='verified' />
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                      <div className='w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center'>
                        <Leaf className='w-4 h-4 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>
                          Chatterjee Organic Farm, Bardhaman
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Harvested: November 20, 2024
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                      <div className='w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center'>
                        <Truck className='w-4 h-4 text-accent' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>
                          Bardhaman Rice Mill
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Processed: November 21, 2024
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
                      <div className='w-8 h-8 bg-chart-3/20 rounded-full flex items-center justify-center'>
                        <CheckCircle className='w-4 h-4 text-chart-3' />
                      </div>
                      <div>
                        <p className='text-sm font-medium'>
                          WB Agricultural Lab Certified
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Certified: November 21, 2024
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='text-center space-y-4 mb-16'>
            <h2 className='text-3xl lg:text-4xl font-bold text-balance'>
              Complete Supply Chain Visibility
            </h2>
            <p className='text-xl text-muted-foreground text-pretty max-w-2xl mx-auto'>
              From farmers to consumers, everyone benefits from transparent,
              verifiable food tracking
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <Card className='text-center p-6 hover:shadow-lg transition-shadow'>
              <CardContent className='space-y-4'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto'>
                  <Smartphone className='w-6 h-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold'>Easy QR Scanning</h3>
                <p className='text-muted-foreground'>
                  Simply scan any product QR code to instantly access its
                  complete journey
                </p>
              </CardContent>
            </Card>

            <Card className='text-center p-6 hover:shadow-lg transition-shadow'>
              <CardContent className='space-y-4'>
                <div className='w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto'>
                  <Shield className='w-6 h-6 text-accent' />
                </div>
                <h3 className='text-xl font-semibold'>Blockchain Security</h3>
                <p className='text-muted-foreground'>
                  Immutable records ensure data integrity and prevent tampering
                </p>
              </CardContent>
            </Card>

            <Card className='text-center p-6 hover:shadow-lg transition-shadow'>
              <CardContent className='space-y-4'>
                <div className='w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto'>
                  <BarChart3 className='w-6 h-6 text-chart-3' />
                </div>
                <h3 className='text-xl font-semibold'>Real-time Analytics</h3>
                <p className='text-muted-foreground'>
                  Track performance metrics and optimize your supply chain
                  operations
                </p>
              </CardContent>
            </Card>

            <Card className='text-center p-6 hover:shadow-lg transition-shadow'>
              <CardContent className='space-y-4'>
                <div className='w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mx-auto'>
                  <FileCheck className='w-6 h-6 text-chart-4' />
                </div>
                <h3 className='text-xl font-semibold'>Compliance Ready</h3>
                <p className='text-muted-foreground'>
                  Meet regulatory requirements with automated documentation and
                  reporting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='text-center space-y-4 mb-16'>
            <h2 className='text-3xl lg:text-4xl font-bold text-balance'>
              Built for Everyone
            </h2>
            <p className='text-xl text-muted-foreground text-pretty max-w-2xl mx-auto'>
              Tailored solutions for every stakeholder in the agricultural
              supply chain
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <Card className='p-8 hover:shadow-lg transition-shadow'>
              <CardContent className='space-y-6'>
                <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center'>
                  <Users className='w-8 h-8 text-primary' />
                </div>
                <div className='space-y-3'>
                  <h3 className='text-2xl font-semibold'>Consumers</h3>
                  <p className='text-muted-foreground'>
                    Scan QR codes to verify product authenticity, view origin
                    details, and make informed purchasing decisions.
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='w-full bg-transparent'
                  asChild
                >
                  <Link href='/scan'>Start Scanning</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className='p-8 hover:shadow-lg transition-shadow'>
              <CardContent className='space-y-6'>
                <div className='w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center'>
                  <Leaf className='w-8 h-8 text-accent' />
                </div>
                <div className='space-y-3'>
                  <h3 className='text-2xl font-semibold'>Farmers</h3>
                  <p className='text-muted-foreground'>
                    Upload growth data, certifications, and harvest information
                    to build trust with consumers.
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='w-full bg-transparent'
                  asChild
                >
                  <Link href='/farmers'>Farmer Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className='p-8 hover:shadow-lg transition-shadow'>
              <CardContent className='space-y-6'>
                <div className='w-16 h-16 bg-chart-3/10 rounded-xl flex items-center justify-center'>
                  <Truck className='w-8 h-8 text-chart-3' />
                </div>
                <div className='space-y-3'>
                  <h3 className='text-2xl font-semibold'>Distributors</h3>
                  <p className='text-muted-foreground'>
                    Track shipments, manage inventory, and maintain chain of
                    custody documentation.
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='w-full bg-transparent'
                  asChild
                >
                  <Link href='/distributors'>Distributor Portal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-primary text-primary-foreground'>
        <div className='container mx-auto px-4 text-center'>
          <div className='space-y-6 max-w-3xl mx-auto'>
            <h2 className='text-3xl lg:text-4xl font-bold text-balance'>
              Ready to Transform Your Supply Chain?
            </h2>
            <p className='text-xl opacity-90 text-pretty'>
              Join thousands of farmers, distributors, and consumers building a
              more transparent food system
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Button
                size='lg'
                variant='secondary'
                className='text-lg px-8'
                asChild
              >
                <Link href='/scan'>
                  <QrCode className='w-5 h-5 mr-2' />
                  Try QR Scanner
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent'
                asChild
              >
                <Link href='/dashboard'>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 border-t'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                  <Leaf className='w-5 h-5 text-primary-foreground' />
                </div>
                <span className='font-bold text-xl'>AgriTrace</span>
              </div>
              <p className='text-muted-foreground'>
                Blockchain-powered supply chain transparency for agricultural
                produce.
              </p>
            </div>
            <div className='space-y-4'>
              <h4 className='font-semibold'>Product</h4>
              <div className='space-y-2 text-sm'>
                <Link
                  href='/trace'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Trace Products
                </Link>
                <Link
                  href='/scan'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  QR Scanner
                </Link>
                <Link
                  href='/dashboard'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Dashboard
                </Link>
              </div>
            </div>
            <div className='space-y-4'>
              <h4 className='font-semibold'>Users</h4>
              <div className='space-y-2 text-sm'>
                <Link
                  href='/farmers'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Farmers
                </Link>
                <Link
                  href='/distributors'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Distributors
                </Link>
                <Link
                  href='/regulators'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Regulators
                </Link>
              </div>
            </div>
            <div className='space-y-4'>
              <h4 className='font-semibold'>Support</h4>
              <div className='space-y-2 text-sm'>
                <Link
                  href='/help'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Help Center
                </Link>
                <Link
                  href='/contact'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Contact Us
                </Link>
                <Link
                  href='/privacy'
                  className='block text-muted-foreground hover:text-foreground'
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className='border-t mt-8 pt-8 text-center text-sm text-muted-foreground'>
            <p>&copy; 2024 AgriTrace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
