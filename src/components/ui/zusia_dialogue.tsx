import { useState } from 'react';

// Main component - exported as default
export default function VisualNovelDialogue({ 
  backgroundImage, 
  dialogueText,
  dialogueBoxImage = "/zusia/text_box.png",
  dialogueBoxMargin = 20,
  textMargin = 40,
  textSize = 1.5
}) {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Container for both images - centered */}
      <div className="relative max-w-full max-h-full flex items-end justify-center">
        {/* Background Image - Contained */}
        <img
          src={backgroundImage}
          alt="Background scene"
          className="max-w-full max-h-full object-contain"
        />
        
        {/* Dialogue Box Section - Overlapping at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: `0 ${dialogueBoxMargin}px` }}
        >
          <div className="relative w-full">
            {/* Dialogue Box Image - Stretches Horizontally */}
            <img
              src={dialogueBoxImage}
              alt="Dialogue box"
              className="w-full h-auto"
            />
            
            {/* Text Overlay */}
            <div 
              className="absolute inset-0 flex items-center text-white text-shadow-lg/30"
              style={{ 
                padding: `${textMargin}px`,
                fontSize: `${textSize}vw`
              }}
            >
              <p className="leading-relaxed">
                {dialogueText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}