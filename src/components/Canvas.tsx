import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { useCanvas  } from "../context/CanvasContext";

const GRID_SIZE = 20;

const Canvas = () => {
  const { pages, currentPage, updateElement, deleteElement } = useCanvas();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Snap to grid utility
  const snapToGrid = (value: number) =>
    Math.round(value / GRID_SIZE) * GRID_SIZE;

  // Drag handlers
  const handleMouseDown = (e: any, elementId: any) => {
    const el = pages[currentPage].find((el) => el.id === elementId);
    if (!el) return;
    setDraggingId(elementId);
    setDragOffset({ x: e.clientX - el.x, y: e.clientY - el.y });
  };

  const handleMouseMove = (e: any) => {
    if (!draggingId) return;
    requestAnimationFrame(() => {
      const newX = snapToGrid(e.clientX - dragOffset.x);
      const newY = snapToGrid(e.clientY - dragOffset.y);
      updateElement(currentPage, draggingId, { x: newX, y: newY });
    });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Resize handlers
  const handleResizeStart = (
    e: React.MouseEvent<HTMLDivElement>,
    elementId: string
  ) => {
    e.stopPropagation();
    setResizingId(elementId);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingId) return;
    const el = pages[currentPage].find((el) => el.id === resizingId);
    if (el) {
      const newWidth = snapToGrid(Math.max(50, el.width + e.movementX));
      const newHeight = snapToGrid(Math.max(50, el.height + e.movementY));
      updateElement(currentPage, resizingId, {
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleResizeEnd = () => {
    setResizingId(null);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  resizingId && document.addEventListener("mousemove", handleResizeMove);
  resizingId && document.addEventListener("mouseup", handleResizeEnd);

  // Rotate handlers
  const handleRotateStart = (
    e: React.MouseEvent<HTMLDivElement>,
    elementId: string
  ) => {
    e.stopPropagation();
    setRotatingId(elementId);
  };

  const handleRotateMove = (e: MouseEvent) => {
    if (!rotatingId) return;
    const el = pages[currentPage].find((el) => el.id === rotatingId);
    if (el) {
      const centerX = el.x + el.width / 2;
      const centerY = el.y + el.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const rotation = Math.round((angle * 180) / Math.PI);
      updateElement(currentPage, rotatingId, { rotation });
    }
  };

  const handleRotateEnd = () => {
    setRotatingId(null);
    document.removeEventListener("mousemove", handleRotateMove);
    document.removeEventListener("mouseup", handleRotateEnd);
  };

  rotatingId && document.addEventListener("mousemove", handleRotateMove);
  rotatingId && document.addEventListener("mouseup", handleRotateEnd);

  // Flip toggle
  const toggleFlip = (id: string) => {
    updateElement(currentPage, id, {
      isFlipped: !pages[currentPage].find((el) => el.id === id)?.isFlipped,
    });
  };

  // Color change handler
  const handleColorChange = (id: string, color: string) => {
    updateElement(currentPage, id, { color });
  };

  // Export exportAsImage
  const exportAsImage = () => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `canvas-page-${currentPage + 1}.png`;
        link.click();
      });
    }
  };

  // Export exportAsPDF
  const exportAsPDF = () => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Create PDF with exact dimensions of the canvas
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? "landscape" : "portrait",
          unit: "px",
          format: [imgWidth, imgHeight],
        });

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`canvas-page-${currentPage + 1}.pdf`);
      });
    }
  };

  return (
    <div
      className="flex-1 bg-gray-100 p-6 rounded-xl shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={canvasRef}
        className="relative w-full min-h-[700px] bg-white border border-gray-200 rounded-lg overflow-hidden shadow-inner"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      >
        {pages[currentPage].map((el) => (
          <div
            key={el.id}
            className="absolute group z-10 transition-transform duration-200 ease-in-out"
            style={{
              transform: `translate(${el.x}px, ${el.y}px) rotate(${el.rotation}deg)`,
              width: el.width,
              height: el.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
          >
            {el.type === "text" ? (
              <div
                className="relative p-3 bg-gray-900 border border-gray-200 rounded-lg shadow-md cursor-move hover:shadow-xl transition-all w-[600px] h-full"
              >
                <p className="text-white break-words">{el.content}</p>
                <div
                  onMouseDown={(e) => handleResizeStart(e, el.id)}
                  className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20"
                />
                <div
                  onMouseDown={(e) => handleRotateStart(e, el.id)}
                  className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
                />
                <button
                  onClick={() => deleteElement(currentPage, el.id)}
                  className="absolute top-1 left-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  x
                </button>
              </div>
            ) : el.type === "image" ? (
              <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all w-full h-full">
                <img
                  src={el.content}
                  alt="canvas-img"
                  className="w-full h-full object-cover"
                />
                <div
                  onMouseDown={(e) => handleResizeStart(e, el.id)}
                  className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20"
                />
                <div
                  onMouseDown={(e) => handleRotateStart(e, el.id)}
                  className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
                />
                <button
                  onClick={() => deleteElement(currentPage, el.id)}
                  className="absolute top-1 left-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  x
                </button>
              </div>
            ) : (
              <div
                onClick={() => toggleFlip(el.id)}
                className="relative rounded-lg shadow-md hover:shadow-xl transition-transform duration-500 ease-in-out w-full h-full"
                style={{
                  backgroundColor: el.color,
                  transform: el.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-semibold">
                  {el.isFlipped ? el.back : el.front}
                </div>
                <div
                  onMouseDown={(e) => handleResizeStart(e, el.id)}
                  className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20"
                />
                <div
                  onMouseDown={(e) => handleRotateStart(e, el.id)}
                  className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
                />
                <button
                  onClick={() => deleteElement(currentPage, el.id)}
                  className="absolute top-1 left-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  ×
                </button>
                <input
                  type="color"
                  value={el.color || "#e5e7eb"}
                  onChange={(e) => handleColorChange(el.id, e.target.value)}
                  className="absolute bottom-1 left-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={exportAsImage}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-all shadow-md hover:shadow-lg"
        >
          Export as Image
        </button>
        <button
          onClick={exportAsPDF}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-all shadow-md hover:shadow-lg"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default Canvas;
