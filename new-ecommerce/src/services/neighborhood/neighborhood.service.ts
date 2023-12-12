import { siteApi } from "../../config/api"
import { NeighborhoodRequest} from "./request.interface"
import { NeighborhoodResponse } from "./response.interface"

export async function postNeighborhood(data: NeighborhoodRequest) {
    return siteApi.post<NeighborhoodResponse>(`/v2/neighborhood/`, data).then((res) => res.data)
}