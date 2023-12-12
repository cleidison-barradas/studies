import { SearchCaptureData, AttractionCaptureData, StarCaptureData } from './CaptureData'

export interface SearchCaptureEvent {
  content: SearchCaptureData
}
export interface AttractionCaptureEvent {
  content: AttractionCaptureData
}
export interface StarCaptureEvent {
  content: StarCaptureData
}

