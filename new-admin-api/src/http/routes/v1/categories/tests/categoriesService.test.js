//import { StoreService } from '../categories.service'
const { removeCategoryfromsubCategories } = require('../removeCategories');

const categories = [{
  "_id": {
    "$oid": "60ef3c620a8bbf11a6b47c4d"
  },
  "subCategories": [],
  "name": "Fungos"
},{
  "_id": {
    "$oid": "63c1a49879d0f0004be49b9f"
  },
  "subCategories": [
    {
      "primary": true,
      "sort": null,
      "status": true,
      "subCategories": [],
      "position": null,
      "_id": {
        "$oid": "60ef3c620a8bbf11a6b47c4d"
      },
      "parentId": "60ef3c620a8bbf11a6b47bea",
      "cached": true,
      "deleted": false,
      "originalId": 145,
      "name": "Fungos",
      "description": "",
      "metaTitle": "Remédios - %CATEGORY_NAME% - %STORE_NAME%",
      "metaDescription": "Remédios - %CATEGORY_NAME% e linha completa de %PARENT_NAME% em %STORE_CITY% é aqui no site da %STORE_NAME%! Clique aqui e confira!",
      "metaKeyWord": "",
      "createdAt": {
        "$date": "2021-07-14T19:34:58.450Z"
      },
      "updatedAt": {
        "$date": "2021-07-14T19:34:58.450Z"
      },
      "__v": 0
    },
    {
      "primary": true,
      "sort": null,
      "status": true,
      "subCategories": [],
      "position": null,
      "_id": {
        "$oid": "60ef3c620a8bbf11a6b47c50"
      },
      "parentId": "60ef3c620a8bbf11a6b47bea",
      "cached": true,
      "deleted": false,
      "originalId": 146,
      "name": "Gases",
      "description": "",
      "metaTitle": "Remédios - %CATEGORY_NAME% - %STORE_NAME%",
      "metaDescription": "Remédios - %CATEGORY_NAME% e linha completa de %PARENT_NAME% em %STORE_CITY% é aqui no site da %STORE_NAME%! Clique aqui e confira!",
      "metaKeyWord": "",
      "createdAt": {
        "$date": "2021-07-14T19:34:58.452Z"
      },
      "updatedAt": {
        "$date": "2021-07-14T19:34:58.452Z"
      },
      "__v": 0
    }
  ],
  "name": "Categoria Teste"
},{
  "_id": {
    "$oid": "63c1a4b079d0f0004be49c0c"
  },
  "subCategories": [
    {
      "primary": true,
      "sort": null,
      "status": true,
      "subCategories": [],
      "position": null,
      "_id": {
        "$oid": "60ef3c620a8bbf11a6b47c44"
      },
      "parentId": "60ef3c620a8bbf11a6b47bea",
      "cached": true,
      "deleted": false,
      "originalId": 142,
      "name": "Dor e febre",
      "description": "",
      "metaTitle": "Remédios - %CATEGORY_NAME% - %STORE_NAME%",
      "metaDescription": "Remédios - %CATEGORY_NAME% e linha completa de %PARENT_NAME% em %STORE_CITY% é aqui no site da %STORE_NAME%! Clique aqui e confira!",
      "metaKeyWord": "",
      "createdAt": {
        "$date": "2021-07-14T19:34:58.442Z"
      },
      "updatedAt": {
        "$date": "2021-07-14T19:34:58.442Z"
      },
      "__v": 0
    },
    {
      "primary": true,
      "sort": null,
      "status": true,
      "subCategories": [],
      "position": null,
      "_id": {
        "$oid": "60ef3c620a8bbf11a6b47c4d"
      },
      "parentId": "60ef3c620a8bbf11a6b47bea",
      "cached": true,
      "deleted": false,
      "originalId": 145,
      "name": "Fungos",
      "description": "",
      "metaTitle": "Remédios - %CATEGORY_NAME% - %STORE_NAME%",
      "metaDescription": "Remédios - %CATEGORY_NAME% e linha completa de %PARENT_NAME% em %STORE_CITY% é aqui no site da %STORE_NAME%! Clique aqui e confira!",
      "metaKeyWord": "",
      "createdAt": {
        "$date": "2021-07-14T19:34:58.450Z"
      },
      "updatedAt": {
        "$date": "2021-07-14T19:34:58.450Z"
      },
      "__v": 0
    }
  ],
  "name": "Categoria Teste2"
}]

const expectedOutput =[
  {
      "_id": {
          "$oid": "60ef3c620a8bbf11a6b47c4d"
      },
      "subCategories": [],
      "name": "Fungos"
  },
  {
      "_id": {
          "$oid": "63c1a49879d0f0004be49b9f"
      },
      "subCategories": [
          {
              "primary": true,
              "sort": null,
              "status": true,
              "subCategories": [],
              "position": null,
              "_id": {
                  "$oid": "60ef3c620a8bbf11a6b47c50"
              },
              "parentId": "60ef3c620a8bbf11a6b47bea",
              "cached": true,
              "deleted": false,
              "originalId": 146,
              "name": "Gases",
              "description": "",
              "metaTitle": "Remédios - %CATEGORY_NAME% - %STORE_NAME%",
              "metaDescription": "Remédios - %CATEGORY_NAME% e linha completa de %PARENT_NAME% em %STORE_CITY% é aqui no site da %STORE_NAME%! Clique aqui e confira!",
              "metaKeyWord": "",
              "createdAt": {
                  "$date": "2021-07-14T19:34:58.452Z"
              },
              "updatedAt": {
                  "$date": "2021-07-14T19:34:58.452Z"
              },
              "__v": 0
          }
      ],
      "name": "Categoria Teste"
  },
  {
      "_id": {
          "$oid": "63c1a4b079d0f0004be49c0c"
      },
      "subCategories": [
          {
              "primary": true,
              "sort": null,
              "status": true,
              "subCategories": [],
              "position": null,
              "_id": {
                  "$oid": "60ef3c620a8bbf11a6b47c44"
              },
              "parentId": "60ef3c620a8bbf11a6b47bea",
              "cached": true,
              "deleted": false,
              "originalId": 142,
              "name": "Dor e febre",
              "description": "",
              "metaTitle": "Remédios - %CATEGORY_NAME% - %STORE_NAME%",
              "metaDescription": "Remédios - %CATEGORY_NAME% e linha completa de %PARENT_NAME% em %STORE_CITY% é aqui no site da %STORE_NAME%! Clique aqui e confira!",
              "metaKeyWord": "",
              "createdAt": {
                  "$date": "2021-07-14T19:34:58.442Z"
              },
              "updatedAt": {
                  "$date": "2021-07-14T19:34:58.442Z"
              },
              "__v": 0
          }
      ],
      "name": "Categoria Teste2"
  }
]




  test('is removing category from other categories subcategories list', () => {
    const categoryToBeRemoved_id =  '60ef3c620a8bbf11a6b47c4d'//categories[0]._id // fungos

    const afterRemove = removeCategoryfromsubCategories(categories, categoryToBeRemoved_id)
      const result = JSON.stringify(afterRemove) === JSON.stringify(expectedOutput) ? true : false
      expect(result).toBe(true)
})