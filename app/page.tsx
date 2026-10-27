import Hero from '../components/Hero'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import About from '../components/About'
import Contact from '../components/Contact'

export const metadata = {
  openGraph: {
    title: "Cooper's Taxation - Professional Tax Services",
    description: 'Expert tax preparation and consultation services for individuals and businesses.',
    images: [{
      url: '/images/us-tax-preparation-social.jpg',
      width: 1200,
      height: 630,
      alt: 'Preparing a US tax return with a calculator and tax forms',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/us-tax-preparation-social.jpg'],
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <WhyChooseUs />
      <About />
      <Contact />
    </>
  )
}
