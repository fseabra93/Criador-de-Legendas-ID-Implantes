
export interface CaptionData {
  informative: string;
  friendly: string;
  professional: string;
}

export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface AudioPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}
