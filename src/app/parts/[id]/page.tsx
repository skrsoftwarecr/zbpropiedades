import { getProductById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/products/ProductDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type ProductDetailPageProps = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
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
  );
}
