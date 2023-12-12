
const StoreSchema = {
  originalId: 'store_id',
  name: 'name',
  url: 'url',
  ssl: 'ssl',
  tenant: 'name',
  originalPmcId: 'pmc_region_id',
  settings: 'settings'
}

const CustomerSchema = {
  originalId: 'customer_id',
  firstname: 'firstname',
  lastname: 'lastname',
  fullName: 'full_name',
  email: 'email',
  phone: 'telephone',
  birthdate: 'birthdate',
  password: 'password',
  salt: 'salt',
  cpf: 'cpf'
}

const CategorySchema = {
  originalId: 'category_id',
  parentId: "parent_id",
  name: 'name',
  description: 'description',
  metaDescription: 'meta_description',
  metaTitle: 'meta_title',
  metaKeyWord: 'meta_keyword',
  image: "image",
  sort: "sort_order",
  status: "status",
  cached: "cached",
}

const ProductClassificationSchema = {
  originalId: 'id',
  name: 'name',
}

const ProductControlSchema = {
  originalId: 'id',
  description: 'description',
  initials: 'initials',
}

const CountrySchema = {
  originalId: 'country_id',
  name: 'name',
  iso_code_2: 'iso_code_2',
  iso_code_3: 'iso_code_3',
  status: 'status'
}

const ManufacturerSchema = {
  originalId: 'manufacturer_id',
  name: 'name',
}

const AboutUsSchema = {
  originalId: 'store_id',
  content: 'content',
  status: 'status'
}

const ProductSchema = {
  originalId: 'product_id',
  originalManufacturerId: 'manufacturer_id',
  originalClassificationId: 'classification_id',
  originalControlId: 'control_id',
  model: 'model',
  price: 'price',
  name: 'name',
  EAN: 'ean',
  MS: 'ms',
  description: 'description',
  imageUrl: 'image',
  quantity: 'quantity',
  activePrinciple: 'active_principle',
  status: 'status',
  verified: 'verified',
  cached: 'cached',
  metaTitle: 'meta_title',
  metaDescritpion: 'meta_description',
  metaKeyword: 'meta_keyword',
  slug: 'url'
}
const OrderSchema = {
  originalId: "order_id",
  originalStatusId: "order_status_id",
  originalCustomerId: "customer_id",
  paymentMethod: "payment_method",
  paymentCode: "payment_code",
  clientIP: "ip",
  prefix: "invoice_prefix",
  userAgent: "user_agent",
  totalOrder: "total"
}
const StatusOrderSchema = {
  originalId: 'order_status_id',
  name: 'name',
  type: 'order_status_id'

}

const SettingSchema = {
  originalId: "setting_id",
  code: "code",
  key: "key",
  value: "value",
  serialized: "serialized"
}

const PMCRegionSchema = {
  originalId: 'region_id',
  name: 'name',
}

const NeighborhoodSchema = {
  originalId: "neighborhood_id",
  originalCityId: "city_id",
  name: "name"
}
const CitySchema = {
  originalId: "city_id",
  originalStateId: "zone_id",
  name: "name"
}

const StateSchema = {
  originalId: "zone_id",
  originalCountryId: "country_id",
  name: "name",
  code: "code"
}

const AddressSchema = {
  originalId: "address_id",
  street: "address_1",
  complement: "company",
  number: "address_2",
  originalCustomerId: "customer_id",
  originalNeighborhoodId: "neighborhood_id",
  notDeliverable: 'not_deliverable'
}

const DeliveryFeeSchema = {
  originalId: "delivery_id",
  feePrice: "delivery_fee",
  freeFrom: "free_from",
  minimumPurchase: "minimum_value",
  deliveryTime: "delivery_time",
  originalNeighborhoodId: "neighborhood_id"
}

const ProductSlugSchema = {
  originalId: "product_id",
  url: "url",
}

const UserSchema = {
  originalId: "user_id",
  originalStoreId: 'store_id',
  originalUserGroupId: "user_group_id",
  userName: 'username',
  password: 'password',
  salt: 'salt',
  email: 'email'
}

const ShowCaseSchema = {
  originalId: "module_id",
  name: "name",
  settings: "setting"
}

const SpecialProductSchema = {
  originalId: "product_id",
  price: "price",
  date_start: "date_start",
  date_end: "date_end"
}

module.exports = {
  StoreSchema,
  CustomerSchema,
  CategorySchema,
  ProductClassificationSchema,
  ProductControlSchema,
  CountrySchema,
  ManufacturerSchema,
  AboutUsSchema,
  ProductSchema,
  OrderSchema,
  StatusOrderSchema,
  SettingSchema,
  PMCRegionSchema,
  NeighborhoodSchema,
  CitySchema,
  StateSchema,
  AddressSchema,
  DeliveryFeeSchema,
  ProductSlugSchema,
  UserSchema,
  ShowCaseSchema,
  SpecialProductSchema

}
