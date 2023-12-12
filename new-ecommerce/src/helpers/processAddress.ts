import Neighborhood from "../interfaces/neighborhood"

interface GoogleAddress {
    street: string
    city: string
    state: string
    code: string
    postcode?: string
    number?: string
    neighborhood: string
    formatted_address?: string
}

export const processAddress = (geocode: google.maps.GeocoderResult): GoogleAddress => {
    const { address_components } = geocode
    const address: GoogleAddress = {
        street: "",
        city: "",
        state: "",
        code: "",
        neighborhood: ""
    }

    address_components.forEach((component) => {
        if(component.types.includes('route')){
            address.street = component.long_name
        }

        if(component.types.includes('administrative_area_level_2')) {
            address.city = component.long_name
        }

        if(component.types.includes('administrative_area_level_1')) {
            address.state = component.long_name
            address.code = component.short_name
        }

        if(component.types.includes('postal_code')) {
            address.postcode = component.long_name
        }

        if(component.types.includes('street_number')) {
            address.number = component.long_name
        }

        if(component.types.includes('sublocality_level_1')){
            address.neighborhood = component.long_name
        }
    })
    return {
        ...address,
        formatted_address: `${address.neighborhood}, ${address.city}, ${address.state}`
    }
}

export const validateNeighborhood = (neighborhood: Neighborhood, name: string) => {
    return neighborhood.name.toUpperCase().localeCompare(name.toUpperCase())
}