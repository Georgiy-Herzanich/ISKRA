import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import CinemaDecor from '@/components/CinemaDecor';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Statement from '@/components/Statement';
import Services from '@/components/Services';
import Steps from '@/components/Steps';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import OrderSection from '@/components/OrderSection';
import Footer from '@/components/Footer';
import Fab from '@/components/Fab';
import Effects from '@/components/Effects';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <>
      <CinemaDecor />
      <Header />
      <Hero />
      <Statement />
      <Services />
      <Steps />
      <Gallery />
      <Reviews />
      <OrderSection />
      <Footer />
      <Fab />
      <Effects />
    </>
  );
}
