export interface Guest {
  username: string;
  name: string;
  members: string[];
}

export interface MemberRSVP {
  memberName: string;
  attending: boolean;
  mealChoice?: string;
  dietary?: string;
}

export interface RSVP {
  username: string;
  name: string;
  attending: boolean;
  membersRSVP: MemberRSVP[];
  message: string;
  songRequest: string;
  updatedAt?: string;
}
