export interface Story {
  headline: string;
  url: string;
  source: string;
}

export interface TopStory extends Story {
  photo: string;
  photoAlt: string;
}

export interface SideContent {
  topStory: TopStory;
  stories: Story[];
}

export interface SiteData {
  lastUpdated: string;
  left: SideContent;
  right: SideContent;
}
