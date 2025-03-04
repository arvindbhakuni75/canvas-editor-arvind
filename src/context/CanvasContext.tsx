import { createContext, useContext, useState, ReactNode } from "react";
import { CanvasElement } from "../types";

interface CanvasContextType {
  pages: CanvasElement[][];
  currentPage: number;
  addElement: (type: "text" | "image" | "flip", content?: string, front?: string, back?: string, width?: number, height?: number) => void;
  updateElement: (pageIdx: number, elementId: string, updates: Partial<CanvasElement>) => void;
  switchPage: (pageIdx: number) => void;
  addPage: () => void;
  removePage: (pageIdx: number) => void;
  deleteElement: (pageIdx: number, elementId: string) => void;
}


export const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [pages, setPages] = useState<CanvasElement[][]>([[]]);
  const [currentPage, setCurrentPage] = useState(0);

  const addElement = (
    type: "text" | "image" | "flip",
    content?: string,
    front?: string,
    back?: string,
    width?: number,
    height?: number
  ) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type,
      content: type === "text" || type === "image" ? content : undefined,
      x: 50,
      y: 50,
      width: width || (type === "image" ? 400 : type === "text" ? 150 : 150), // Default or dynamic width
      height: height || (type === "image" ? 400 : type === "text" ? 100 : 150), // Default or dynamic height
      front: type === "flip" ? front : undefined,
      back: type === "flip" ? back : undefined,
      isFlipped: type === "flip" ? false : undefined,
      rotation: 0,
      color: type === "flip" ? "#e5e7eb" : undefined,
    };
    setPages((prev) => {
      const newPages = [...prev];
      newPages[currentPage] = [...newPages[currentPage], newElement];
      return newPages;
    });
  };

  const updateElement = (pageIdx: number, elementId: string, updates: Partial<CanvasElement>) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[pageIdx] = newPages[pageIdx].map((el) =>
        el.id === elementId ? { ...el, ...updates } : el
      );
      return newPages;
    });
  };

  const deleteElement = (pageIdx: number, elementId: string) => {
    setPages((prev) => {
      const newPages = [...prev];
      newPages[pageIdx] = newPages[pageIdx].filter((el) => el.id !== elementId);
      return newPages;
    });
  };

  const switchPage = (pageIdx: number) => setCurrentPage(pageIdx);

  const addPage = () => {
    setPages((prev) => {
      const newPages = [...prev, []];
      setCurrentPage(newPages.length - 1);
      return newPages;
    });
  };

  const removePage = (pageIdx: number) => {
    setPages((prev) => {
      if (prev.length === 1) return prev; // Ensure at least one page remains
  
      const newPages = prev.filter((_, idx) => idx !== pageIdx);
  
      // Adjust the current page index to avoid out-of-bounds errors
      setCurrentPage((prevPage) => (prevPage >= newPages.length ? newPages.length - 1 : prevPage));
  
      return newPages;
    });
  };
  

  return (
    <CanvasContext.Provider value={{ pages, currentPage, addElement, updateElement, switchPage, addPage, deleteElement, removePage }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error("useCanvas must be used within CanvasProvider");
  return context;
};