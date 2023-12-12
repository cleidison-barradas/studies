import { CircularProgress, Grid, Typography } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ProductCard } from '../../components/ProductCard'
import { ProductSkeleton } from '@mypharma/react-components'
import { getCategoryProductsByName } from '../../services/category/category.service'
import { GetCategoryProductsByNameResponse } from '../../services/category/response.interface'
import categoryContext from '../../contexts/category.context'
import Product from '../../interfaces/product'
import { useNavigate } from 'react-router'

export const CategoryProducts: React.FC = () => {
  const [limit, setLimit] = useState(20)

  const [data, setData] = useState<GetCategoryProductsByNameResponse | undefined>()
  const {
    selectedCategory,
    fetchedCategory,
    selectedSubCategory,
    fetchedSubCategory,
    selectedFilter,
    selectedManufacturers,
    isFetchingProducts,
    setIsFetchingProducts,
  } = useContext(categoryContext)
  const navigate = useNavigate()

  const fetchProducts = useCallback(async () => {
    setIsFetchingProducts(true)
    const response = await getCategoryProductsByName({
      limit,
      filter: selectedFilter,
      manufacturers: selectedManufacturers.map(({ _id }) => _id),
      categoryId: selectedSubCategory ? selectedSubCategory._id : selectedCategory?._id,
    })
    setData(response)
    setIsFetchingProducts(false)
  }, [
    limit,
    selectedFilter,
    selectedCategory?._id,
    selectedSubCategory,
    selectedManufacturers,
    setIsFetchingProducts,
  ])

  useEffect(() => {
    if (fetchedCategory && (!selectedCategory || (fetchedSubCategory && !selectedSubCategory))) {
      navigate('/404')
    }
    if (selectedCategory || selectedSubCategory) {
      fetchProducts()
    }
  }, [
    limit,
    selectedCategory,
    selectedSubCategory,
    selectedFilter,
    selectedManufacturers,
    fetchProducts,
    fetchedCategory,
    fetchedSubCategory,
    navigate,
  ])

  const hasStock = (product: Product) => (product.quantity <= 0 ? false : true)

  return (
    <React.Fragment>
      <Typography display="flex" alignItems="center" variant="h2" gap={2} fontSize={18}>
        Produtos em {selectedSubCategory ? selectedSubCategory.name : selectedCategory?.name}
        {isFetchingProducts && <CircularProgress color="primary" size={18} />}
      </Typography>
      <InfiniteScroll
        hasMore={data?.count !== data?.products.length}
        loader={
          <Grid
            mt={2}
            justifyContent={{ xs: 'center', md: 'normal' }}
            container
            spacing={4}
            alignItems="center"
            overflow={'auto'}
            wrap={'wrap'}
          >
            {[...Array(window.innerWidth > 600 ? 8 : 2)].map((x, index) => (
              <Grid mb={5} xs={6} md={'auto'} key={index} item>
                <ProductSkeleton />
              </Grid>
            ))}
          </Grid>
        }
        scrollThreshold={0.5}
        dataLength={data?.products.length || 0}
        next={() => setLimit((value) => value + 20)}
      >
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent={{ xs: 'center', sm: 'normal' }}
          overflow={'auto'}
          wrap={'wrap'}
        >
          {data?.products &&
            data?.products
              .filter(hasStock)
              .concat(data.products.filter((product) => !hasStock(product)))
              .map((product: any) => (
                <Grid mb={5} xs={6} sm="auto" md={'auto'} key={product._id} item>
                  <ProductCard product={product} />
                </Grid>
              ))}
        </Grid>
      </InfiniteScroll>
    </React.Fragment>
  )
}
