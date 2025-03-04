import React, { useContext } from 'react';
import { CanvasContext } from '../context/CanvasContext';

interface PageManagerProps {
  currentPage: number;
  onPageChange: (index: number) => void;
}

const PageManager: React.FC<PageManagerProps> = ({ currentPage, onPageChange }) => {
  const canvasContext = useContext(CanvasContext);
  if (!canvasContext) throw new Error('CanvasContext not provided');

  const { pages, addPage } = canvasContext;

  return (
    <div className="w-1/4 ml-4">
      <h3 className="text-lg font-bold mb-2">Pages</h3>
      <div className="space-y-2">
        {pages.map((page:any, index:number) => (
          <div
            key={page.id}
            className={`p-2 border cursor-pointer ${currentPage === index ? 'bg-blue-100' : ''}`}
            onClick={() => onPageChange(index)}
          >
            Page {index + 1}
          </div>
        ))}
        <button onClick={addPage} className="w-full bg-blue-500 text-white p-2 rounded mt-2">Add Page</button>
      </div>
    </div>
  );
};

export default PageManager;











