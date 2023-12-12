import React, { useContext, useMemo, useState } from 'react'
import useSWR from 'swr'
import { getCategory } from '../../services/category/category.service'
import { Box, Grid, Hidden } from '@mui/material'
import { CategoryCard, CategorySkeleton } from '@mypharma/react-components'
import { BackArrowIcon, OrderByIcon, PriceIcon, PromotionIcon } from '../../assets/icons'
import { SwiperSlide } from 'swiper/react/swiper-react.js'
import { CustomSwiper } from '../../components/Swiper'
import { useNavigate } from 'react-router-dom'
import Category from '../../interfaces/category'
import { CDN } from '../../config/keys'
import { CategoryImage } from './styles'
import placeholders from '../../assets/ilustration/category'
import { useTheme } from 'styled-components'
import { SubCategory, SubCategoryButton, CategoryFilter } from '../SubCategory'
import { Modal } from '../Modal'
import categoryContext from '../../contexts/category.context'
import { CategoryFilterContainer } from '../CategoryFilterContainer'
import { CategoryFilterDialog } from '../CategoryFilterDialog'
import { ManufacturerForm } from '../../forms/ManufacturerForm'
import { normalizeStr } from '../../helpers/normalizeString'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

export const priorityCategorys = [
  'medicamentos',
  'higiene pessoal',
  'beleza e cuidados',
  'mamães e bebês',
  'linha infantil',
  'suplementos e vitaminas',
  'saúde sexual',
  'pare de fumar',
  'dermocosméticos',
  'conveniência',
  'cuidados geriátricos',
]

function array_move(arr: any[], fromIndex: number, toIndex: number) {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}

export const orderByPriority = (categorys: Category[]) => {
  const ordered: Category[] = []

  if (categorys.find((value) => !!value.position)) {
    categorys.forEach((value, index, array) => {
      if (value.position) {
        array_move(array, index, value.position - 1)
      }
    })

    return categorys
  }

  // get first priority
  priorityCategorys.forEach((value) =>
    categorys.forEach((category) => {
      if (normalizeStr(value).toLowerCase() === normalizeStr(category.name).toLowerCase())
        ordered.push(category)
    })
  )

  // find entities not provided by the priority list and push
  categorys.forEach((category) => {
    if (
      !ordered.find(
        (orderedCategory) =>
          normalizeStr(orderedCategory.name).toLowerCase() ===
          normalizeStr(category.name).toLowerCase()
      )
    )
      ordered.push(category)
  })

  return ordered
}

interface CategoryContainerProps {
  populated?: boolean
}

export const CategoryContainer: React.FC<CategoryContainerProps> = ({ populated }) => {
  const { data } = useSWR(`${populated ? 'populated/categorys' : 'categorys'}`, () =>
    getCategory(populated)
  )
  const navigate = useNavigate()
  const { color } = useTheme()
  const {
    selectedCategory,
    selectedSubCategory,
    setSelectedFilter,
    setSelectedManufacturers,
    setSelectedSubCategory,
    setFetchedSubCategory,
    isFetchingProducts,
  } = useContext(categoryContext)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [modal, setModal] = useState({
    open: false,
    form: <React.Fragment />,
  })

  const selectedFilter = (name: string) => {
    setSelectedFilter(name)
    setIsFilterOpen(false)
  }

  const handleCloseFilter = () => {
    setIsFilterOpen(false)
  }

  const openModal = (form: JSX.Element) => {
    setModal({
      open: true,
      form,
    })
  }

  const closeModal = () => {
    setModal({
      open: false,
      form: <React.Fragment />,
    })
  }

  const setGetProductsParameters = (callback: () => void) => {
    if (isFetchingProducts) return
    callback()
  }

  const filters: CategoryFilter[] = [
    {
      Icon: <OrderByIcon />,
      title: 'Mais relevantes',
      name: 'asc',
      onClick: () => setGetProductsParameters(() => selectedFilter('asc')),
    },
    {
      Icon: <PriceIcon />,
      title: 'Menor preço',
      name: 'price',
      onClick: () => setGetProductsParameters(() => selectedFilter('price')),
    },
    {
      Icon: <PromotionIcon />,
      title: 'Promoções',
      name: 'promotion',
      onClick: () => setGetProductsParameters(() => selectedFilter('promotion')),
    },
    {
      Icon: <LocalOfferIcon style={{ fontSize: 50 }} />,
      title: 'Marcas',
      name: 'brand',
      isForm: true,
      onClick: () => {
        // handleCloseFilter()
        openModal(
          <ManufacturerForm
            onSubmit={(selected) => {
              setSelectedManufacturers(selected)
              selectedFilter('brand')
              closeModal()
            }}
            onReturn={closeModal}
          />
        )
      },
    },
  ]

  const getImage = (category: Category) => {
    const hasPlaceholder = placeholders.find((value) =>
      normalizeStr(category.name.toLowerCase()).includes(normalizeStr(value.name))
    )

    if (!category.image && hasPlaceholder) {
      return <CategoryImage loading="lazy" src={hasPlaceholder.Image} alt={category.name} />
    }

    if (category.image) {
      return <CategoryImage loading="lazy" src={CDN.image + category.image} alt={category.name} />
    }

    return (
      <PromotionIcon
        style={{
          color: 'white',
          padding: 8,
          background: color.primary.medium,
          borderRadius: '50%',
        }}
      />
    )
  }

  const onClickAway = () => {
    setModal((value) => ({
      ...value,
      open: false,
      form: <React.Fragment />,
    }))
  }

  const ordered = useMemo(
    () => (data?.categorys ? orderByPriority(data.categorys) : undefined),
    [data]
  )

  return (
    <React.Fragment>
      {selectedCategory ? (
        <Box mt={{ xs: 3, sm: 2, md: 2, lg: 3, xl: 3 }}>
          <SubCategory
            ReturnIcon={<BackArrowIcon />}
            onReturn={() => navigate('/produtos')}
            initialFilter="asc"
            filters={filters}
            title={selectedCategory.name}
          >
            <SubCategoryButton
              selected={!selectedSubCategory}
              onClick={() =>
                setGetProductsParameters(() => {
                  setFetchedSubCategory(false)
                  setSelectedSubCategory(null)
                  navigate(`/departamentos/${selectedCategory.slug}`)
                })
              }
            >
              {selectedCategory.name} em geral
            </SubCategoryButton>
            {selectedCategory.subCategories.map((value) => (
              <SubCategoryButton
                key={value._id}
                selected={selectedSubCategory?._id === value._id}
                onClick={() =>
                  setGetProductsParameters(() =>
                    navigate(`/departamentos/${selectedCategory.slug}/${value.slug}`)
                  )
                }
              >
                {value.name}
              </SubCategoryButton>
            ))}
          </SubCategory>
        </Box>
      ) : (
        <Box mt={{ xs: 4, sm: 2, md: 0, lg: 0 }}>
          <Hidden lgUp>
            <Box overflow="auto" mt={{ lg: 4, md: 4, sm: 0, xs: 0 }} pt={8} pb={2}>
              <Grid gap={{ sm: 2, md: 4 }} wrap="nowrap" container>
                {ordered
                  ? ordered.map((category) => (
                    <Grid item key={category._id}>
                      <CategoryCard
                        onClick={() => {
                          navigate(`/departamentos/${category.slug}`)
                        }}
                        image={getImage(category)}
                      >
                        {category.name}
                      </CategoryCard>
                    </Grid>
                  ))
                  : new Array(...new Array(5)).map((value, index) => (
                    <Grid item key={index}>
                      <CategorySkeleton />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Hidden>
          <Hidden lgDown>
            <CustomSwiper
              paddingTop="80px"
              paddingBottom="16px"
              slidesPerView={'auto'}
              spaceBetween={24}
              navigation={true}
            >
              {data
                ? orderByPriority(data.categorys).map((category) => (
                  <SwiperSlide key={category._id}>
                    <CategoryCard
                      onClick={() => {
                        navigate(`/departamentos/${category.slug}`)
                      }}
                      image={getImage(category)}
                    >
                      {category.name}
                    </CategoryCard>
                  </SwiperSlide>
                ))
                : new Array(...new Array(5)).map((value, index) => (
                  <SwiperSlide key={index}>
                    <CategorySkeleton />
                  </SwiperSlide>
                ))}
            </CustomSwiper>
          </Hidden>
        </Box>
      )}
      {selectedCategory || selectedSubCategory ? (
        <Box mb={5} mt={2}>
          <CategoryFilterContainer onOpen={() => setIsFilterOpen(true)} filters={filters} />
        </Box>
      ) : (
        <React.Fragment />
      )}
      <CategoryFilterDialog filters={filters} open={isFilterOpen} onClickAway={handleCloseFilter} />
      {modal.open && (
        <Modal onClickAway={onClickAway} open={modal.open}>
          {modal.form}
        </Modal>
      )}
    </React.Fragment>
  )
}

export default CategoryContainer
