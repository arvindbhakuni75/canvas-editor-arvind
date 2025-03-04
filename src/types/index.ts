
export interface User {
    email: string;
    name: { first: string; last: string };
    picture: { thumbnail: string };
  }
  
  export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: () => void;
    logout: () => void;
    loading: boolean;
  }
  
  export interface CanvasElement {
      id: string;
      type: "text" | "image" | "flip";
      content?: string;
      x: number;
      y: number;
      width: number;
      height: number;
      front?: string;
      back?: string;
      isFlipped?: boolean;
      rotation?: number;
      color?: string;
    }
    
    export interface Page {
      id: string;
      elements: CanvasElement[];
    }
  
  