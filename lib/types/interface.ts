export interface CreateModule {
    name: string;
    code: string;
    topics: string[];
    hours: string;
    totalPrice: number;
    state: boolean;
    checkImage: boolean;
    session: CreateSession[];
    graduateId: number;
    corporationId?: number[];
  }

  export interface CreateSession {
    linkZoom?: string;
    date: string;
    hour: string;
    speakerId?: number;
  }
