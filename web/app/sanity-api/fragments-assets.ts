export const imageAsset = `
  asset->{
    _id,
    assetId,
    title,
    altText,
    description,
    creditLine,
    metadata {
      lqip,
      dimensions {
        width,
        height,
      }
    }
  }
`;

export const videoAsset = `
  asset->{
    playbackId
  }
`;
