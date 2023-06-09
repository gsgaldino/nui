import { useMemo } from 'react';
import Head from 'next/head'
import { Provider, Collection, Banner } from '@/components'
import { IProduct } from '@/types'
import SheetService from '@/services/SheetService'

import * as S from '../styles/styles'

interface HomeProps { products: IProduct[], banner: any };

export default function Home({ products, banner }: HomeProps) {
  const collections = useMemo(() => {
    return products?.reduce((acc: any, prod: any) => {
      const existantCollection = acc.find((item: any) => item.name === prod.categoria);
      if (existantCollection) {
        existantCollection.products.push(prod);
      } else {
        acc.push({
          name: prod.categoria,
          products: [prod]
        })
      }

      return acc;
    }, [])
  }, [products]);

  const releases = products?.slice(20, products.length).reverse();

  return (
    <>
      <Head>
        <title>Nui | #énui</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Provider>
        <Banner banner={banner} />
        <S.Section>
          <Collection title="Lançamentos" data={releases} />
          {collections.map((collection: any) => collection.name !== '-' && (
            <Collection key={collection.name} title={collection.name} data={collection.products} />
          ))}
        </S.Section>
      </Provider>
    </>
  )
}

export const getStaticProps = async () => {
  const [products, banner] = await Promise.all(['produtos', 'banner_site'].map(async (item) => {
    const data = await SheetService.getRange(item);
    return data;
  }));

  return {
    props: {
      products: products,
      banner: banner,
    },
    revalidate: 2,
  };
}
