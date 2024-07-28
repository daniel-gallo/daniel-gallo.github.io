import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  NAME: "Daniel Gallo",
  EMAIL: "daniel.gallo.fernandez@student.uva.nl",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_BIO_ITEMS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Daniel Gallo's personal page.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const BIO: Metadata = {
  TITLE: "Bio",
  DESCRIPTION: "Where I have worked and studied.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of papers, and kaggle competitions",
};

export const SOCIALS: Socials = [
  {
    NAME: "scholar",
    HREF: "https://scholar.google.com/citations?user=aXjcdv4AAAAJ",
  },
  {
    NAME: "github",
    HREF: "https://github.com/daniel-gallo",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/daniel-gallo-9a7a1a201/",
  },
  {
    NAME: "kaggle",
    HREF: "https://www.kaggle.com/danielgallo",
  },
];
