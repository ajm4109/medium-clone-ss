import {
    createClient,
    createPreviewSubscriptionHook,
    createImageUrlBuilder,
    createPortableTextComponent,
    createCurrentUserHook
  } from 'next-sanity';
  
  // const sanityConfig = {
  //   projectId: 'kufuxjqf',
  //   dataset: 'production',
  //   apiVersion: 'v2021-10-21',
  //   useCdn: false,
  // };

  const sanityConfig ={
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: 'v2021-10-21',
    useCdn: false
  }
  
  export const sanityClient = createClient(sanityConfig);
  
  export const usePreviewSubscription = createPreviewSubscriptionHook(sanityConfig);
  
  export const urlFor = (source) =>
    createImageUrlBuilder(sanityConfig).image(source);
  
  export const portableText = createPortableTextComponent({
    ...sanityConfig,
    serializers: {},
  });
  