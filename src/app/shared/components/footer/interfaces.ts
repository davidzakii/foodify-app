export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export interface FooterLink {
  title: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}
