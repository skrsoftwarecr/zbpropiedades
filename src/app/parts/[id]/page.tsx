import { getProductById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ProductDetails } from '@/components/products/ProductDetails';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Repuesto no encontrado',
      description: 'El repuesto que busca no existe o no está disponible en Bimmer CR.',
    }
  }
  
  const title = `${product.name} - Repuesto ${product.category} para BMW`;
  const description = `Comprar ${product.name} (SKU: ${product.sku}) para BMW en Costa Rica. ${product.description.substring(0, 120)}... Encuentre repuestos ${product.category} para su vehículo en Bimmer CR.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.imageUrls[0] ? [
        {
          url: product.imageUrls[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ] : [],
    },
  }
}


export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrls,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.category === 'Original' ? "BMW" : "Aftermarket"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.bimmercr.com/parts/${product.id}`,
      "priceCurrency": "CRC",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": product.condition === 'Nuevo' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-6">
              <Button variant="ghost" asChild>
                  <Link href="/parts">
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Volver a Repuestos
                  </Link>
              </Button>
          </div>
          <ProductDetails product={product} />
      </div>
    </>
  );
}
